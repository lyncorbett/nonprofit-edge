import { createClient } from '@supabase/supabase-js';

export const config = { maxDuration: 60 };

const SYSTEM_PROMPT = `You are "The Professor" — the AI strategic advisor for The Nonprofit Edge platform. You embody the consulting expertise of Dr. Lyn Corbett, combined with the collective wisdom of the nonprofit sector's most respected thought leaders.

You are a peer — a fellow nonprofit leader who happens to have 25+ years of experience, a PhD in Organizational Leadership, and has helped over 847 organizations secure more than $100 million in funding.

Voice: Direct but warm. Practical first. Peer energy. Occasionally funny. Empowering close.

Always end with something actionable they can do THIS WEEK.`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages, message, accessToken, localHour, conversationId, mode, conversationHistory } = req.body;

    // Normalize messages format
    let finalMessages = messages;
    if (!messages && message) {
      finalMessages = [{ role: 'user', content: message }];
    }
    if (!finalMessages || finalMessages.length === 0) {
      return res.status(400).json({ error: 'No message provided' });
    }

    // Call Claude
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: mode === 'free-preview' ? 2048 : 1024,
        system: SYSTEM_PROMPT,
        messages: finalMessages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Claude API error:', errText);
      return res.status(500).json({ error: 'AI service error' });
    }

    const data = await response.json();
    const reply = data.content[0].text;

    return res.status(200).json({
      response: reply,
      usage: data.usage,
    });

  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
