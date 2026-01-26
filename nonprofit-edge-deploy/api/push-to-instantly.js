// File: api/push-to-instantly.js
// Push approved emails to Instantly.ai for sending

import { createClient } from '@supabase/supabase-js';

// Debug: Log all relevant env vars
console.log('=== Environment Variable Debug ===');
console.log('INSTANTLY_API_KEY exists:', !!process.env.INSTANTLY_API_KEY);
console.log('INSTANTLY_API_KEY length:', process.env.INSTANTLY_API_KEY?.length || 0);
console.log('SUPABASE_URL exists:', !!process.env.SUPABASE_URL);
console.log('VITE_SUPABASE_URL exists:', !!process.env.VITE_SUPABASE_URL);
console.log('All env var keys:', Object.keys(process.env).filter(k => 
  !k.startsWith('npm_') && !k.startsWith('NODE_') && !k.startsWith('PATH')
).join(', '));
console.log('=================================');

// Use fallbacks for environment variables
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const INSTANTLY_API_KEY = process.env.INSTANTLY_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const INSTANTLY_API_URL = 'https://api.instantly.ai/api/v1';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check for required environment variables
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ 
      error: 'Server configuration error - missing database credentials',
      debug: {
        hasSupabaseUrl: !!process.env.SUPABASE_URL,
        hasViteSupabaseUrl: !!process.env.VITE_SUPABASE_URL,
      }
    });
  }

  if (!INSTANTLY_API_KEY) {
    return res.status(500).json({ 
      error: 'Server configuration error - missing Instantly API key',
      debug: {
        envVarExists: !!process.env.INSTANTLY_API_KEY,
        envVarLength: process.env.INSTANTLY_API_KEY?.length || 0,
        availableKeys: Object.keys(process.env).filter(k => 
          k.includes('INSTANTLY') || k.includes('API')
        )
      }
    });
  }

  try {
    const { email_id, campaign_name, send_immediately = false } = req.body;

    if (!email_id) {
      return res.status(400).json({ error: 'email_id is required' });
    }

    // Fetch the approved email from queue
    const { data: email, error: fetchError } = await supabase
      .from('email_queue')
      .select('*')
      .eq('id', email_id)
      .single();

    if (fetchError || !email) {
      return res.status(404).json({ error: 'Email not found', details: fetchError });
    }

    if (email.status !== 'approved') {
      return res.status(400).json({ error: 'Email must be approved before pushing to Instantly' });
    }

    // Create campaign name if not provided
    const finalCampaignName = campaign_name || 
      `${email.email_type}_${email.list_type}_${new Date().toISOString().split('T')[0]}`;

    // Step 1: Create a campaign in Instantly
    const campaignResponse = await fetch(`${INSTANTLY_API_URL}/campaign/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: INSTANTLY_API_KEY,
        name: finalCampaignName,
      }),
    });

    const campaignData = await campaignResponse.json();
    
    if (!campaignResponse.ok) {
      console.error('Instantly campaign creation failed:', campaignData);
      return res.status(500).json({ 
        error: 'Failed to create campaign in Instantly', 
        details: campaignData 
      });
    }

    const campaignId = campaignData.id || campaignData.campaign_id;

    // Step 2: Add email sequence to the campaign
    const sequenceResponse = await fetch(`${INSTANTLY_API_URL}/campaign/sequence/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: INSTANTLY_API_KEY,
        campaign_id: campaignId,
        sequences: [
          {
            steps: [
              {
                type: 'email',
                delay: 0,
                variants: email.subject_line_variants ? 
                  email.subject_line_variants.map((subject, index) => ({
                    subject: subject,
                    body: email.body_html,
                  })) :
                  [{
                    subject: email.subject_line,
                    body: email.body_html,
                  }]
              }
            ]
          }
        ]
      }),
    });

    const sequenceData = await sequenceResponse.json();

    if (!sequenceResponse.ok) {
      console.error('Instantly sequence creation failed:', sequenceData);
      return res.status(500).json({ 
        error: 'Failed to add email sequence', 
        details: sequenceData 
      });
    }

    // Step 3: Save campaign to our database
    const { data: savedCampaign, error: saveError } = await supabase
      .from('email_campaigns')
      .insert({
        instantly_campaign_id: campaignId,
        instantly_campaign_name: finalCampaignName,
        email_queue_id: email_id,
        list_type: email.list_type,
        status: 'created',
      })
      .select()
      .single();

    if (saveError) {
      console.error('Failed to save campaign to database:', saveError);
    }

    // Step 4: Update email status
    await supabase
      .from('email_queue')
      .update({ 
        status: 'pushed',
        instantly_campaign_id: campaignId,
        pushed_at: new Date().toISOString()
      })
      .eq('id', email_id);

    // Step 5: Launch campaign if send_immediately is true
    if (send_immediately) {
      const launchResponse = await fetch(`${INSTANTLY_API_URL}/campaign/launch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: INSTANTLY_API_KEY,
          campaign_id: campaignId,
        }),
      });

      if (!launchResponse.ok) {
        console.error('Campaign launch failed, but campaign was created');
      } else {
        await supabase
          .from('email_queue')
          .update({ status: 'sent' })
          .eq('id', email_id);
      }
    }

    return res.status(200).json({
      success: true,
      campaign_id: campaignId,
      campaign_name: finalCampaignName,
      message: send_immediately ? 
        'Email pushed and campaign launched!' : 
        'Email pushed to Instantly. Go to Instantly to add leads and launch.',
      instantly_url: `https://app.instantly.ai/app/campaign/${campaignId}`
    });

  } catch (error) {
    console.error('Push to Instantly error:', error);
    return res.status(500).json({ 
      error: 'Failed to push to Instantly', 
      details: error.message 
    });
  }
}
