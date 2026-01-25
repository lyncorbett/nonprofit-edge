// File: api/generate-video-script.js
// Vercel Serverless Function - Generate video scripts using Claude

import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const VIDEO_VOICE_PROMPT = `You are Dr. Lyn Corbett writing video scripts for nonprofit leaders. You speak directly to camera as yourself — authentic, warm, and practical.

## YOUR BACKGROUND
- 25+ years consulting with nonprofits
- PhD in Organizational Leadership
- Helped 847+ organizations, secured over $100 million in funding
- Author of "Hope is Not a Strategy" and "The Leadership Reset"

## VIDEO VOICE
- Conversational, like talking to a colleague
- Direct but warm
- Practical — every video leads to a useful insight
- Confident without being preachy
- Occasional dry humor when earned

## VIDEO STRUCTURE BY TYPE

### AD (30-60 seconds)
1. Hook (5 sec) — Pattern interrupt or bold statement
2. Problem (10 sec) — The pain point they know too well
3. Agitate (10 sec) — Why it matters / what's at stake
4. Solution tease (10 sec) — What's possible
5. CTA (5 sec) — Clear next step

### EXPLAINER (1-2 minutes)
1. Hook (10 sec) — Why they should keep watching
2. Context (20 sec) — Set up the problem
3. Framework/Insight (45 sec) — The main teaching
4. Application (20 sec) — How to use it
5. CTA (10 sec) — What to do next

### EDUCATIONAL (2-3 minutes)
1. Hook & Promise (15 sec)
2. Why This Matters (30 sec)
3. Main Content (90 sec) — The teaching with examples
4. Summary (15 sec)
5. CTA (10 sec)

## SCRIPT FORMAT
Write in spoken language — contractions, natural pauses, the way you actually talk.
Include [PAUSE] markers for emphasis.
Include [B-ROLL SUGGESTION] notes where relevant.

## PLATFORM CONSIDERATIONS
- LinkedIn: Professional but not stiff, thought leadership angle
- Meta: More emotional hook, broader appeal
- YouTube: Can be longer, more educational depth
- TikTok: Fast cuts, immediate hook, trend-aware
- Website: Can assume more context about your work`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const {
      video_id,
      topic,
      video_type = 'ad',
      target_platform = 'linkedin',
      list_type = 'general',
      additional_context
    } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const durations = {
      ad: '30-60 seconds',
      explainer: '1-2 minutes',
      testimonial: '60-90 seconds',
      educational: '2-3 minutes',
      announcement: '30-45 seconds'
    };

    const generationPrompt = `Write a ${video_type.toUpperCase()} video script with these specifications:

**Topic:** ${topic}
**Duration:** ${durations[video_type] || '60 seconds'}
**Platform:** ${target_platform}
**Audience:** ${list_type === 'cold' ? 'People who don\'t know me yet' : list_type === 'warm' ? 'People familiar with my work' : 'General nonprofit leaders'}
${additional_context ? `**Additional Context:** ${additional_context}` : ''}

Write the complete script as Dr. Lyn Corbett would deliver it on camera.

Format your response as JSON:
{
  "title": "Video title for internal reference",
  "hook": "The opening line (this is crucial)",
  "script": "The full script with [PAUSE] markers and [B-ROLL] suggestions",
  "duration_estimate": "Estimated runtime in seconds",
  "cta": "The specific call to action",
  "thumbnail_suggestion": "What the thumbnail should show"
}`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: generationPrompt }],
      system: VIDEO_VOICE_PROMPT
    });

    const responseText = message.content[0].text;

    let scriptContent;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        scriptContent = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch (parseError) {
      return res.status(500).json({ error: 'Failed to parse script', raw_response: responseText });
    }

    // Update the video_queue record if video_id provided
    if (video_id) {
      await supabase
        .from('video_queue')
        .update({
          title: scriptContent.title || topic,
          script: scriptContent.script,
          estimated_duration: parseInt(scriptContent.duration_estimate) || 60,
          status: 'pending_review',
          generated_by: 'claude',
          notes: JSON.stringify({
            hook: scriptContent.hook,
            cta: scriptContent.cta,
            thumbnail_suggestion: scriptContent.thumbnail_suggestion
          })
        })
        .eq('id', video_id);
    } else {
      // Create new record
      const { data: newVideo, error } = await supabase
        .from('video_queue')
        .insert({
          title: scriptContent.title || topic,
          script: scriptContent.script,
          video_type,
          target_platform,
          list_type,
          estimated_duration: parseInt(scriptContent.duration_estimate) || 60,
          status: 'pending_review',
          generated_by: 'claude',
          topic,
          notes: JSON.stringify({
            hook: scriptContent.hook,
            cta: scriptContent.cta,
            thumbnail_suggestion: scriptContent.thumbnail_suggestion
          })
        })
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: 'Failed to save video', details: error });
      }

      return res.status(200).json({
        success: true,
        video: newVideo,
        script: scriptContent
      });
    }

    return res.status(200).json({
      success: true,
      video_id,
      script: scriptContent
    });

  } catch (error) {
    console.error('Video script generation error:', error);
    return res.status(500).json({ error: 'Failed to generate script', details: error.message });
  }
}
