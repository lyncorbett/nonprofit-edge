// File: api/push-to-instantly.js
// Vercel Serverless Function - Push approved emails to Instantly

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const INSTANTLY_API_KEY = process.env.INSTANTLY_API_KEY;
const INSTANTLY_API_BASE = 'https://api.instantly.ai/api/v2';

// Helper function for Instantly API calls
async function instantlyRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${INSTANTLY_API_KEY}`,
      'Content-Type': 'application/json'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${INSTANTLY_API_BASE}${endpoint}`, options);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Instantly API error: ${response.status} - ${error}`);
  }

  return response.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { 
      email_id,           // Single email ID to push
      campaign_name,      // Optional: override campaign name
      send_immediately    // If true, start campaign right away
    } = req.body;

    if (!email_id) {
      return res.status(400).json({ error: 'email_id is required' });
    }

    // Fetch the approved email
    const { data: email, error: fetchError } = await supabase
      .from('email_queue')
      .select('*')
      .eq('id', email_id)
      .eq('status', 'approved')
      .single();

    if (fetchError || !email) {
      return res.status(404).json({ error: 'Approved email not found' });
    }

    // Create campaign in Instantly
    const campaignData = {
      name: campaign_name || email.campaign_name || `${email.subject_line} - ${new Date().toLocaleDateString()}`,
      email_list: email.list_type === 'warm' ? 'warm_list' : 'cold_list' // You'll set these up in Instantly
    };

    const campaign = await instantlyRequest('/campaigns', 'POST', campaignData);

    // Add email sequence/step to campaign
    const emailStep = {
      campaign_id: campaign.id,
      subject: email.subject_line,
      body: email.body_html,
      step: 1,
      delay: 0,
      variants: email.subject_line_variants?.map((subject, index) => ({
        subject: subject,
        body: email.body_html,
        weight: index === 0 ? 50 : Math.floor(50 / (email.subject_line_variants.length - 1))
      }))
    };

    await instantlyRequest('/campaign-steps', 'POST', emailStep);

    // Record in our database
    const { data: campaignRecord, error: insertError } = await supabase
      .from('email_campaigns')
      .insert({
        email_queue_id: email.id,
        instantly_campaign_id: campaign.id,
        instantly_campaign_name: campaign.name,
        status: send_immediately ? 'active' : 'pending',
        list_type: email.list_type,
        pushed_at: new Date().toISOString(),
        started_at: send_immediately ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to record campaign:', insertError);
    }

    // Update email status
    await supabase
      .from('email_queue')
      .update({ status: 'sent' })
      .eq('id', email_id);

    // Start campaign if requested
    if (send_immediately) {
      await instantlyRequest(`/campaigns/${campaign.id}/start`, 'POST');
    }

    return res.status(200).json({
      success: true,
      message: send_immediately ? 'Campaign created and started' : 'Campaign created (not started)',
      campaign: {
        id: campaign.id,
        name: campaign.name,
        our_record_id: campaignRecord?.id
      }
    });

  } catch (error) {
    console.error('Push to Instantly error:', error);
    return res.status(500).json({ 
      error: 'Failed to push to Instantly', 
      details: error.message 
    });
  }
}
