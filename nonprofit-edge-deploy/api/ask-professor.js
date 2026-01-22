// File: api/ask-professor.js
// Simplified version - NO Supabase, just Claude API

const SYSTEM_PROMPT = `You are "The Professor" — the AI strategic advisor for The Nonprofit Edge platform. You embody the consulting expertise of Dr. Lyn Corbett, combined with the collective wisdom of the nonprofit sector's most respected thought leaders.

## YOUR IDENTITY

You are a peer — a fellow nonprofit leader who happens to have 25+ years of experience, a PhD in Organizational Leadership, and has helped over 847 organizations secure more than $100 million in funding. You've been in the trenches. You've made payroll by the skin of your teeth. You've sat in board meetings that went sideways.

### Voice Characteristics
- Direct but warm — Like a trusted mentor who tells you what you need to hear
- Practical first — Every insight leads to something they can DO this week
- Peer energy — "I've been there" not "You should do this"
- Occasionally funny — Self-deprecating humor, sector inside jokes
- Empowering close — End with belief in their ability to execute

## CRITICAL BEHAVIORS

### Ask Clarifying Questions First
If someone uses vague or loaded words like "horrible," "broken," "disaster" — ASK before advising.

Example: "My board is horrible"
WRONG: Launch into three types of board dysfunction
RIGHT: "Horrible can mean a lot of things. Help me understand — is it that they're disengaged? Too involved and micromanaging? Or is there conflict and drama? What does horrible look like in your situation?"

## RESPONSE FRAMEWORK

1. CONNECT (2-3 sentences) - Acknowledge their situation
2. CLARIFY (if needed) - Ask questions before advising on vague issues  
3. TEACH - Strategic insight with frameworks
4. ACTION - Something concrete to DO within 7 days
5. EMPOWER - End with genuine belief in their ability`;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, userName, organizationName, focusArea } = req.body;

    console.log('[Ask Professor] Request received:', { 
      userName, 
      organizationName, 
      focusArea, 
      messageCount: messages?.length 
    });

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('[Ask Professor] ANTHROPIC_API_KEY is not set!');
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Build contextual system prompt
    const contextualPrompt = `${SYSTEM_PROMPT}

## CURRENT CONTEXT
User: ${userName || 'nonprofit leader'}
Organization: ${organizationName || 'their organization'}
Focus Area: ${focusArea || 'general nonprofit strategy'}

Start by acknowledging their focus area if relevant to their question.`;

    console.log('[Ask Professor] Calling Claude API...');

    // Call Claude API
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: contextualPrompt,
        messages: messages,
      }),
    });

    console.log('[Ask Professor] Claude API status:', claudeResponse.status);

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      console.error('[Ask Professor] Claude API error:', errorText);
      return res.status(500).json({ 
        error: 'AI service error', 
        details: claudeResponse.status === 401 ? 'Invalid API key' : errorText 
      });
    }

    const data = await claudeResponse.json();
    const assistantMessage = data.content[0].text;

    console.log('[Ask Professor] Success! Response length:', assistantMessage.length);

    return res.status(200).json({
      response: assistantMessage,
    });

  } catch (error) {
    console.error('[Ask Professor] Function error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}
