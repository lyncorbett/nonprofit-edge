// File: api/sync-instantly-results.js
// Vercel Serverless Function - Sync campaign results from Instantly
// Can be called manually or via cron job

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const INSTANTLY_API_KEY = process.env.INSTANTLY_API_KEY;
const INSTANTLY_API_BASE = 'https://api.instantly.ai/api/v2';

async function instantlyRequest(endpoint) {
  const response = await fetch(`${INSTANTLY_API_BASE}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${INSTANTLY_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Instantly API error: ${response.status} - ${error}`);
  }

  return response.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // Get all active campaigns from our database
    const { data: campaigns, error: fetchError } = await supabase
      .from('email_campaigns')
      .select('*')
      .in('status', ['active', 'pending']);

    if (fetchError) {
      throw new Error('Failed to fetch campaigns: ' + fetchError.message);
    }

    if (!campaigns || campaigns.length === 0) {
      return res.status(200).json({ 
        success: true, 
        message: 'No active campaigns to sync',
        synced: 0 
      });
    }

    const results = [];

    for (const campaign of campaigns) {
      try {
        // Fetch analytics from Instantly
        const analytics = await instantlyRequest(
          `/campaigns/${campaign.instantly_campaign_id}/analytics`
        );

        // Upsert results
        const { data: resultRecord, error: upsertError } = await supabase
          .from('email_results')
          .upsert({
            campaign_id: campaign.id,
            email_queue_id: campaign.email_queue_id,
            
            // Core metrics
            emails_sent: analytics.sent || 0,
            emails_delivered: analytics.delivered || 0,
            emails_bounced: analytics.bounced || 0,
            
            // Engagement
            opens: analytics.opened || 0,
            unique_opens: analytics.unique_opened || 0,
            open_rate: analytics.open_rate || 0,
            
            clicks: analytics.clicked || 0,
            unique_clicks: analytics.unique_clicked || 0,
            click_rate: analytics.click_rate || 0,
            
            // Responses
            replies: analytics.replied || 0,
            reply_rate: analytics.reply_rate || 0,
            positive_replies: analytics.positive_replies || 0,
            negative_replies: analytics.negative_replies || 0,
            
            // Deliverability
            spam_reports: analytics.spam || 0,
            unsubscribes: analytics.unsubscribed || 0,
            
            // A/B test results
            winning_subject_line: analytics.winning_variant?.subject || null,
            subject_line_results: analytics.variants || null,
            
            // Raw data
            instantly_raw_data: analytics,
            last_synced_at: new Date().toISOString()
          }, {
            onConflict: 'campaign_id'
          })
          .select()
          .single();

        // Update campaign status if completed
        if (analytics.status === 'completed') {
          await supabase
            .from('email_campaigns')
            .update({ 
              status: 'completed',
              completed_at: new Date().toISOString()
            })
            .eq('id', campaign.id);
        }

        results.push({
          campaign_id: campaign.id,
          instantly_id: campaign.instantly_campaign_id,
          status: 'synced',
          metrics: {
            sent: analytics.sent,
            opens: analytics.opened,
            replies: analytics.replied
          }
        });

      } catch (campaignError) {
        console.error(`Error syncing campaign ${campaign.id}:`, campaignError);
        results.push({
          campaign_id: campaign.id,
          instantly_id: campaign.instantly_campaign_id,
          status: 'error',
          error: campaignError.message
        });
      }
    }

    return res.status(200).json({
      success: true,
      synced: results.filter(r => r.status === 'synced').length,
      errors: results.filter(r => r.status === 'error').length,
      results
    });

  } catch (error) {
    console.error('Sync error:', error);
    return res.status(500).json({ 
      error: 'Failed to sync results', 
      details: error.message 
    });
  }
}
