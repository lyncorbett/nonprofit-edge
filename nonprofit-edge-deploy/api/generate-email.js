// File: api/generate-email.js
// Vercel Serverless Function - Generate emails using Claude + your voice

import { createClient } from '@supabase/supabase-js';

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

  try {
    const {
      email_type = 'insight',      // insight, story, offer, question, resource
      list_type = 'warm',          // warm, cold, both
      topic,                        // What the email is about
      campaign_name,                // Optional campaign grouping
      sequence_position,            // If part of a sequence
      additional_context,           // Any extra instructions
      num_subject_variants = 3      // How many subject line options
    } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    // Your email voice prompt
    const EMAIL_VOICE_PROMPT = `You are Dr. Lyn Corbett writing emails to nonprofit leaders. You write in first person, as yourself — not as a brand, not as a company, as YOU.

## YOUR BACKGROUND (use naturally, don't recite)
- 25+ years consulting with nonprofits
- PhD in Organizational Leadership (USD)
- Helped 847+ organizations
- Secured over $100 million in funding
- Author of "Hope is Not a Strategy" and "The Leadership Reset"
- You've been in the trenches — made payroll by the skin of your teeth, sat in board meetings that went sideways

You are a peer, not a vendor. You write like you're emailing a colleague you respect.

## VOICE CHARACTERISTICS

### How You Sound
- Direct but warm — Like a mentor who tells it straight
- Practical — Every email leads to something useful
- Peer energy — "I've been there" not "You should do this"
- Occasionally funny — Dry humor, sector inside jokes
- Confident without bragging

### Phrases You Use Naturally
- "Here's the thing..."
- "I've seen this play out dozens of times..."
- "Let me be direct with you..."
- "This might sound counterintuitive, but..."
- "The pattern I see over and over..."

### Phrases You NEVER Use
- "I hope this email finds you well"
- "Just checking in"
- "I wanted to reach out"
- "Excited to announce"
- "Don't miss this opportunity"
- Any emoji in subject lines

## EMAIL STRUCTURE

### Subject Lines
- Short — 4-8 words max
- Curiosity or pattern interrupt — Not clickbait, but intriguing
- Sounds like a person — Not a marketing department

### Opening Line
Kill the throat-clearing. No "I hope you're doing well." Start with:
- A provocative observation
- A question
- A story hook
- A direct statement

### Body
- Short paragraphs — 1-3 sentences max
- One idea per email
- Conversational — Write like you talk
- Specific — Use concrete examples

### Call to Action
- One CTA per email
- Soft when appropriate — "Reply and tell me..."
- Direct when needed — "Here's the link"

### Signature
Keep it simple:
— Lyn

Dr. Lyn Corbett
Founder, The Nonprofit Edge

## YOUR FRAMEWORKS (Use Naturally)
- The Trust Triangle — Board ↔ Staff ↔ Donors alignment
- The 4Ms — Mindset, Moment, Method, Movement
- Theory of Constraints — Find the ONE bottleneck
- The Ocean Metaphor — Surface tactics vs. deep currents
- "Hope is not a strategy"

## TONE BY LIST TYPE

### WARM LIST (They Know You)
- More personal, can reference shared context
- Example: "Something came up in a conversation last week that I can't stop thinking about."

### COLD LIST (They Don't Know You Yet)
- Lead with value and credibility
- Example: "I've spent 15 years in nonprofit boardrooms, and there's one conversation that happens in almost every single one."`;

    // Build the generation prompt
    const generationPrompt = `Generate an email with these specifications:

**Email Type:** ${email_type}
**Target List:** ${list_type}
**Topic:** ${topic}
${additional_context ? `**Additional Context:** ${additional_context}` : ''}

Please provide:

1. **${num_subject_variants} SUBJECT LINE OPTIONS** (4-8 words each, no emojis)

2. **PREVIEW TEXT** (The snippet that shows after subject line, 40-90 characters)

3. **EMAIL BODY** (Following the structure guidelines - short paragraphs, one main idea, clear CTA)

Format your response as JSON only, no markdown code blocks:
{
  "subject_lines": ["option 1", "option 2", "option 3"],
  "preview_text": "preview text here",
  "body_html": "<p>Email body with HTML formatting</p>",
  "body_plain": "Email body as plain text"
}

Remember:
- Write as Dr. Lyn Corbett in first person
- ${list_type === 'cold' ? 'This is a COLD list - lead with credibility and value' : 'This is a WARM list - be more personal and direct'}
- Keep it under 200 words unless it's a story email
- One clear CTA only
- Return ONLY valid JSON, no other text`;

    // Call Claude using fetch (more reliable in Vercel)
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: EMAIL_VOICE_PROMPT,
        messages: [
          {
            role: 'user',
            content: generationPrompt
          }
        ]
      })
    });

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      console.error('Claude API error:', errorText);
      return res.status(500).json({ error: 'Claude API error', details: errorText });
    }

    const message = await claudeResponse.json();

    // Parse Claude's response
    const responseText = message.content[0].text;
    
    // Extract JSON from response (handle markdown code blocks)
    let emailContent;
    try {
      // Try to find JSON in the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        emailContent = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText);
      return res.status(500).json({ 
        error: 'Failed to parse generated content',
        raw_response: responseText 
      });
    }

    // Initialize Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Save to email_queue
    let queuedEmail = null;
    try {
      const { data, error: insertError } = await supabase
        .from('email_queue')
        .insert({
          subject_line: emailContent.subject_lines[0],
          subject_line_variants: emailContent.subject_lines,
          preview_text: emailContent.preview_text,
          body_html: emailContent.body_html,
          body_plain: emailContent.body_plain,
          email_type: email_type,
          list_type: list_type,
          campaign_name: campaign_name || null,
          sequence_position: sequence_position || null,
          topic: topic,
          status: 'pending_review',
          generated_by: 'claude'
        })
        .select()
        .single();

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        // Don't fail - still return the generated content
      } else {
        queuedEmail = data;
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Don't fail - still return the generated content
    }

    // Return the generated email
    return res.status(200).json({
      success: true,
      email: queuedEmail || {
        subject_lines: emailContent.subject_lines,
        preview_text: emailContent.preview_text,
        body_html: emailContent.body_html,
        body_plain: emailContent.body_plain,
        email_type: email_type,
        list_type: list_type,
        topic: topic,
        status: 'pending_review'
      },
      usage: {
        input_tokens: message.usage?.input_tokens,
        output_tokens: message.usage?.output_tokens
      }
    });

  } catch (error) {
    console.error('Generation error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate email', 
      details: error.message 
    });
  }
}
