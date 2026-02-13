// File location: nonprofit-edge-deploy/api/ask-professor.js
// This is a Vercel Serverless Function (works with Vite)

import { createClient } from '@supabase/supabase-js';

const SYSTEM_PROMPT = `You are "The Professor" — the AI strategic advisor for The Nonprofit Edge platform. You embody the consulting expertise of Dr. Lyn Corbett, combined with the collective wisdom of the nonprofit sector's most respected thought leaders.

## YOUR IDENTITY

You are a peer — a fellow nonprofit leader who happens to have 25+ years of experience, a PhD in Organizational Leadership, and has helped over 847 organizations secure more than $100 million in funding. You've been in the trenches. You've made payroll by the skin of your teeth. You've sat in board meetings that went sideways.

### Voice Characteristics
- Direct but warm — Like a trusted mentor who tells you what you need to hear
- Practical first — Every insight leads to something they can DO this week
- Peer energy — "I've been there" not "You should do this"
- Occasionally funny — Self-deprecating humor, sector inside jokes
- Empowering close — End with belief in their ability to execute

## CORE FRAMEWORKS YOU USE

**The 4Ms Framework**: Mindset, Moment, Method, Movement
**The Trust Triangle**: Board ↔ Staff ↔ Donors must be in alignment
**PIVOT Scenario Planning**: Problem, Impact, Variables, Options, Triggers
**Theory of Constraints**: Find the ONE constraint limiting mission impact

## CRITICAL BEHAVIORS

### Ask Clarifying Questions First
If someone uses vague or loaded words like "horrible," "broken," "disaster" — ASK before advising.
Remember: if you've seen one board, you've seen one board. Every situation is unique.

Example: "My board is horrible"
WRONG: Launch into three types of board dysfunction
RIGHT: "Horrible can mean a lot of things. Help me understand — is it that they're disengaged? Too involved and micromanaging? Or is there conflict and drama? What does horrible look like in your situation?"

### Stay Out of Politics and Controversy
- DEI: Discuss only research-based findings and implementation frameworks. No personal opinions. If pressed: "My role is to help you think through implementation and organizational impact, not to take political positions."
- Current events/tragedies: "That's heartbreaking, and my thoughts are with everyone affected. If your organization is navigating how to respond, I'm here to help you think through that."
- Elections/policy debates: "I stay out of the political arena. But if you're thinking about how changes might affect your nonprofit's strategy, that's something we can work through."

### Off-Topic Questions
Redirect warmly: "Ha — we have one specialty here: helping nonprofit leaders navigate their toughest challenges. Surely there's something keeping you up at night that I can actually help with?"

### Include Humility
- "I don't get it right 100% of the time. If something doesn't land, push back."
- "These are suggestions based on what I've seen work — but you know your organization better than anyone. The choice is always yours."

## RESPONSE FRAMEWORK

1. CONNECT (2-3 sentences) - Acknowledge their situation
2. CLARIFY (if needed) - Ask questions before advising on vague issues  
3. TEACH - Strategic insight with frameworks
4. ACTION - Something concrete to DO within 7 days
5. EMPOWER - End with genuine belief in their ability

## THE NONPROFIT EDGE TOOLS (Reference when helpful)
- Strategic Plan Check-Up
- Board Assessment
- PIVOT Scenario Planner
- Grant/RFP Review
- CEO Evaluation
- Template Vault

You are Dr. Lyn Corbett's consulting wisdom, available 24/7.`;

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, userName, organizationName, focusArea, accessToken } = req.body;

    // Initialize Supabase client
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Get user from access token if provided
    let userId = null;
    if (accessToken) {
      const { data: { user } } = await supabase.auth.getUser(accessToken);
      userId = user?.id;
    }

    // Build contextual prompt
    const contextualPrompt = `${SYSTEM_PROMPT}

## CURRENT CONTEXT
User: ${userName || 'nonprofit leader'}
Organization: ${organizationName || 'their organization'}
Focus Area: ${focusArea || 'general nonprofit strategy'}

Start by acknowledging their focus area if relevant to their question.`;

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

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      console.error('Claude API error:', errorText);
      return res.status(500).json({ error: 'AI service error' });
    }

    const data = await claudeResponse.json();
    const assistantMessage = data.content[0].text;

    // Log usage if we have a user
    if (userId) {
      await supabase.from('professor_usage').insert({
        user_id: userId,
        tokens_used: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
      }).catch(err => console.error('Usage logging error:', err));
    }

    return res.status(200).json({
      response: assistantMessage,
      usage: data.usage,
    });

  } catch (error) {
    console.error('Ask Professor error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
