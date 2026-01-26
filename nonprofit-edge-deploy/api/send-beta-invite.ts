// api/send-beta-invite.ts
// Vercel Serverless Function for sending beta tester invites via Instantly

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name, magicLink } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: 'email and name are required' });
  }

  const INSTANTLY_API_KEY = process.env.INSTANTLY_API_KEY;

  if (!INSTANTLY_API_KEY) {
    console.error('Instantly API key not configured');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  try {
    // Option 1: Add lead to an Instantly campaign
    // This will send the email through your configured campaign
    const CAMPAIGN_ID = process.env.INSTANTLY_CAMPAIGN_ID;
    
    if (CAMPAIGN_ID) {
      const response = await fetch('https://api.instantly.ai/api/v1/lead/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: INSTANTLY_API_KEY,
          campaign_id: CAMPAIGN_ID,
          skip_if_in_workspace: false,
          leads: [
            {
              email: email,
              first_name: name.split(' ')[0],
              last_name: name.split(' ').slice(1).join(' ') || '',
              company_name: '',
              personalization: magicLink, // Use personalization field for magic link
              custom_variables: {
                magic_link: magicLink,
                full_name: name
              }
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Instantly API error:', errorData);
        throw new Error('Failed to add lead to campaign');
      }

      const data = await response.json();
      
      return res.status(200).json({ 
        success: true, 
        message: `Added ${email} to beta campaign`,
        data 
      });
    }

    // Option 2: If no campaign ID, just add to workspace leads
    const workspaceResponse = await fetch('https://api.instantly.ai/api/v1/lead/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: INSTANTLY_API_KEY,
        campaign_id: '', // Empty = just add to workspace
        leads: [
          {
            email: email,
            first_name: name.split(' ')[0],
            last_name: name.split(' ').slice(1).join(' ') || '',
            custom_variables: {
              magic_link: magicLink,
              full_name: name,
              beta_tester: 'true'
            }
          }
        ]
      })
    });

    if (!workspaceResponse.ok) {
      throw new Error('Failed to add lead');
    }

    return res.status(200).json({ 
      success: true, 
      message: `Added ${email} to workspace (no campaign)` 
    });

  } catch (error: any) {
    console.error('Error sending invite:', error);
    return res.status(500).json({ 
      error: 'Failed to send invite',
      details: error.message 
    });
  }
}


// ============================================
// INSTANTLY SETUP INSTRUCTIONS
// ============================================
/*

To use this API endpoint with Instantly:

1. ENVIRONMENT VARIABLES (add to Vercel):
   - INSTANTLY_API_KEY: Your API key from Instantly settings
   - INSTANTLY_CAMPAIGN_ID: (optional) The campaign ID for beta invites

2. GET YOUR API KEY:
   - Go to Instantly.ai → Settings → API
   - Copy your API key

3. CREATE A CAMPAIGN (recommended):
   - Create a new campaign in Instantly called "Beta Tester Invites"
   - Set up your email sequence
   - Use variables in your email:
     - {{first_name}} - First name
     - {{last_name}} - Last name  
     - {{magic_link}} - The login link
   - Copy the campaign ID from the URL

4. EMAIL TEMPLATE EXAMPLE:

Subject: 🚀 Your Beta Access to The Nonprofit Edge is Ready!

Hi {{first_name}},

You've been selected as one of our founding beta testers for The Nonprofit Edge!

Your exclusive access link:
{{magic_link}}

This link gives you:
✓ Full access to all Premium features
✓ Ask the Professor AI coaching
✓ All 6 assessment tools
✓ 147+ templates
✓ Direct line to Dr. Corbett

Your beta access is valid through March 24, 2026.

Questions? Just reply to this email.

– Dr. Lyn Corbett
The Pivotal Group

5. GET CAMPAIGN ID:
   - Open your campaign in Instantly
   - Look at the URL: https://app.instantly.ai/app/campaign/XXXXXX
   - The XXXXXX is your campaign ID

*/
