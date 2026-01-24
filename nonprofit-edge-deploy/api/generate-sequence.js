// File: api/generate-sequence.js
// Vercel Serverless Function - Generate a full email sequence using Claude

import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const EMAIL_VOICE_PROMPT = `You are Dr. Lyn Corbett writing emails to nonprofit leaders. You write in first person, as yourself — not as a brand, not as a company, as YOU.

## YOUR BACKGROUND
- 25+ years consulting with nonprofits
- PhD in Organizational Leadership (USD)
- Helped 847+ organizations, secured over $100 million in funding
- Author of "Hope is Not a Strategy" and "The Leadership Reset"
- You've been in the trenches

You are a peer, not a vendor.

## VOICE
- Direct but warm
- Practical — every email leads to action
- Peer energy — "I've been there"
- Occasionally funny — dry humor, sector inside jokes
- Confident without bragging

## EMAIL RULES
- Subject lines: 4-8 words, no emojis
- Kill throat-clearing — no "I hope you're doing well"
- Short paragraphs: 1-3 sentences
- One main idea per email
- One CTA per email
- Under 200 words unless it's a story

## YOUR FRAMEWORKS
- The Trust Triangle — Board ↔ Staff ↔ Donors
- The 4Ms — Mindset, Moment, Method, Movement
- Theory of Constraints — Find the ONE bottleneck
- "Hope is not a strategy"`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const {
      sequence_name,
      list_type = 'warm',
      goal,                    // What's the sequence trying to achieve?
      num_emails = 5,          // How many emails in the sequence
      delay_days = 2,          // Days between emails
      offer_details,           // If promoting something specific
      additional_context
    } = req.body;

    if (!sequence_name || !goal) {
      return res.status(400).json({ error: 'sequence_name and goal are required' });
    }

    // Create the sequence record first
    const { data: sequence, error: seqError } = await supabase
      .from('email_sequences')
      .insert({
        name: sequence_name,
        description: goal,
        list_type: list_type,
        email_count: num_emails,
        delay_between_emails: delay_days,
        status: 'draft'
      })
      .select()
      .single();

    if (seqError) {
      return res.status(500).json({ error: 'Failed to create sequence', details: seqError });
    }

    // Build the sequence generation prompt
    const sequencePrompt = `Create a ${num_emails}-email sequence with these specifications:

**Sequence Name:** ${sequence_name}
**Target List:** ${list_type} (${list_type === 'cold' ? "they don't know you yet" : "they know you"})
**Goal:** ${goal}
${offer_details ? `**Offer Details:** ${offer_details}` : ''}
${additional_context ? `**Additional Context:** ${additional_context}` : ''}
**Delay Between Emails:** ${delay_days} days

## SEQUENCE STRATEGY

Map out the arc:
- Email 1: Hook / Pattern interrupt
- Emails 2-3: Build value / Share insights
- Email 4: Soft ask or deeper engagement
- Email 5: Direct CTA

Vary the email types (insight, story, question, resource, offer) — don't send 5 of the same type.

## OUTPUT FORMAT

Return a JSON array with ${num_emails} emails:

[
  {
    "position": 1,
    "email_type": "insight|story|question|resource|offer",
    "subject_lines": ["option 1", "option 2", "option 3"],
    "preview_text": "40-90 characters",
    "body_html": "<p>Email body</p>",
    "body_plain": "Plain text version",
    "strategic_notes": "Why this email at this position"
  },
  // ... more emails
]

Remember:
- Each email should stand alone but build on the arc
- ${list_type === 'cold' ? 'Cold list: establish credibility first, earn trust before asking' : 'Warm list: you can be more direct and personal'}
- Give value 3-4x before making a real ask
- Keep each email under 200 words`;

    // Call Claude
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 6000,
      messages: [{ role: 'user', content: sequencePrompt }],
      system: EMAIL_VOICE_PROMPT
    });

    const responseText = message.content[0].text;

    // Parse the sequence
    let emails;
    try {
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        emails = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON array found');
      }
    } catch (parseError) {
      console.error('Parse error:', responseText);
      return res.status(500).json({ 
        error: 'Failed to parse sequence', 
        raw_response: responseText 
      });
    }

    // Insert all emails into queue
    const emailInserts = emails.map((email, index) => ({
      subject_line: email.subject_lines[0],
      subject_line_variants: email.subject_lines,
      preview_text: email.preview_text,
      body_html: email.body_html,
      body_plain: email.body_plain,
      email_type: email.email_type,
      list_type: list_type,
      campaign_name: sequence_name,
      sequence_position: email.position || index + 1,
      topic: goal,
      notes: email.strategic_notes,
      status: 'pending_review',
      generated_by: 'claude'
    }));

    const { data: queuedEmails, error: insertError } = await supabase
      .from('email_queue')
      .insert(emailInserts)
      .select();

    if (insertError) {
      return res.status(500).json({ error: 'Failed to save emails', details: insertError });
    }

    // Log the generation
    await supabase
      .from('email_generation_log')
      .insert({
        request_type: 'sequence',
        email_type: 'mixed',
        list_type: list_type,
        topic: goal,
        email_queue_ids: queuedEmails.map(e => e.id),
        model_used: 'claude-sonnet-4-20250514',
        prompt_tokens: message.usage?.input_tokens,
        completion_tokens: message.usage?.output_tokens
      });

    return res.status(200).json({
      success: true,
      sequence: sequence,
      emails: queuedEmails,
      usage: {
        input_tokens: message.usage?.input_tokens,
        output_tokens: message.usage?.output_tokens
      }
    });

  } catch (error) {
    console.error('Sequence generation error:', error);
    return res.status(500).json({ error: 'Failed to generate sequence', details: error.message });
  }
}
