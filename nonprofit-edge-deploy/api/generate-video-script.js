// File: api/generate-video-script.js
// Vercel Serverless Function - Generate video scripts using Claude

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
      video_type = 'educational',   // educational, promotional, testimonial, explainer
      platform = 'linkedin',        // linkedin, youtube, instagram, tiktok, website
      topic,                         // What the video is about
      duration = '60',               // Target duration in seconds
      tone = 'professional',         // professional, casual, inspiring, urgent
      cta_type = 'soft',            // soft, direct, none
      additional_context,            // Any extra instructions
      refine_message,                // For iterative refinement
      previous_script                // Previous version to refine
    } = req.body;

    if (!topic && !refine_message) {
      return res.status(400).json({ error: 'Topic or refine_message is required' });
    }

    // Video script voice prompt
    const VIDEO_VOICE_PROMPT = `You are Dr. Lyn Corbett creating video scripts for nonprofit leaders. You speak directly to camera as yourself — authentic, warm, and knowledgeable.

## YOUR ON-CAMERA PRESENCE
- Conversational — Like you're talking to one person across a coffee table
- Authoritative but approachable — You know your stuff but you're not lecturing
- Energetic but not hyper — Engaged, not exhausting
- Real — You can laugh, pause, show genuine emotion

## SCRIPT STRUCTURE BY LENGTH

### Short (30-60 seconds) - LinkedIn, Instagram, TikTok
- Hook (0-5 sec): Pattern interrupt, surprising stat, provocative question
- One key insight (5-45 sec): Make ONE point clearly
- CTA (45-60 sec): Simple, clear next step

### Medium (1-3 minutes) - LinkedIn, YouTube Shorts
- Hook (0-10 sec): Grab attention immediately
- Problem (10-30 sec): Name the pain point
- Insight/Solution (30-120 sec): Your key message
- Proof (optional): Quick example or stat
- CTA (final 15-20 sec): What should they do?

### Long (3-10 minutes) - YouTube, Website
- Hook (0-15 sec): Why should they keep watching?
- Context (15-60 sec): Set up the problem/situation
- Main content (1-7 min): 3-5 key points with examples
- Summary (30-60 sec): Recap main takeaways
- CTA (final 30 sec): Clear next step

## SCRIPT FORMATTING

Write scripts in this format:
- [VISUAL] notes for what's on screen (b-roll, graphics, etc.)
- [ON CAMERA] when I'm speaking to camera
- Include natural pauses with "..." or "(beat)"
- Mark emphasis with *asterisks*
- Include approximate timing markers

## PLATFORM ADJUSTMENTS

### LinkedIn
- Professional but personal
- Lead with value
- Text overlays helpful
- Square or vertical format

### YouTube
- Can be longer, more in-depth
- Chapters/sections helpful
- Thumbnail consideration
- End screen CTA

### Instagram/TikTok
- Fast-paced, punchy
- Captions essential
- Hook in first 2 seconds
- Trending audio consideration

## YOUR FRAMEWORKS (Use When Relevant)
- The Trust Triangle
- The 4Ms — Mindset, Moment, Method, Movement
- Theory of Constraints
- "Hope is not a strategy"
- The pattern you see over and over

## PHRASES THAT WORK ON VIDEO
- "Here's what nobody tells you..."
- "I've sat in hundreds of these meetings, and..."
- "Let me show you what I mean..."
- "The biggest mistake I see is..."
- "What if I told you..."`;

    // Build the generation prompt
    let generationPrompt;
    
    if (refine_message && previous_script) {
      // Refinement mode - iterate on existing script
      generationPrompt = `Here's the current video script:

---
${previous_script}
---

The user wants to refine it with this feedback:
"${refine_message}"

Please revise the script based on this feedback. Keep what works, improve what doesn't.

Return ONLY valid JSON:
{
  "title": "Video title",
  "hook": "The opening hook (first 5-10 seconds)",
  "script": "Full script with [VISUAL] and [ON CAMERA] markers",
  "duration_estimate": "Estimated duration in seconds",
  "thumbnail_ideas": ["idea 1", "idea 2"],
  "caption": "Social media caption to accompany the video",
  "hashtags": ["relevant", "hashtags"]
}`;
    } else {
      // New script generation
      generationPrompt = `Create a video script with these specifications:

**Video Type:** ${video_type}
**Platform:** ${platform}
**Topic:** ${topic}
**Target Duration:** ${duration} seconds
**Tone:** ${tone}
**CTA Style:** ${cta_type}
${additional_context ? `**Additional Context:** ${additional_context}` : ''}

Write a complete video script following the structure guidelines for this length and platform.

Return ONLY valid JSON, no markdown:
{
  "title": "Video title",
  "hook": "The opening hook (first 5-10 seconds)",
  "script": "Full script with [VISUAL] and [ON CAMERA] markers, timing notes, and natural pauses",
  "duration_estimate": "Estimated duration in seconds",
  "thumbnail_ideas": ["idea 1", "idea 2"],
  "caption": "Social media caption to accompany the video",
  "hashtags": ["relevant", "hashtags"]
}

Remember:
- Write as Dr. Lyn Corbett
- Platform is ${platform} — adjust style accordingly
- Target ${duration} seconds
- Include [VISUAL] and [ON CAMERA] markers
- Make the hook irresistible
- Return ONLY valid JSON`;
    }

    // Call Claude using fetch
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2500,
        system: VIDEO_VOICE_PROMPT,
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
    const responseText = message.content[0].text;
    
    // Parse the response
    let scriptContent;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        scriptContent = JSON.parse(jsonMatch[0]);
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

    // Save to video_queue
    let queuedVideo = null;
    try {
      const { data, error: insertError } = await supabase
        .from('video_queue')
        .insert({
          title: scriptContent.title,
          hook: scriptContent.hook,
          script: scriptContent.script,
          duration_estimate: parseInt(scriptContent.duration_estimate) || parseInt(duration),
          thumbnail_ideas: scriptContent.thumbnail_ideas,
          caption: scriptContent.caption,
          hashtags: scriptContent.hashtags,
          video_type: video_type,
          platform: platform,
          topic: topic,
          tone: tone,
          status: 'pending_review',
          generated_by: 'claude'
        })
        .select()
        .single();

      if (insertError) {
        console.error('Supabase insert error:', insertError);
      } else {
        queuedVideo = data;
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
    }

    // Return the generated script
    return res.status(200).json({
      success: true,
      video: queuedVideo || {
        ...scriptContent,
        video_type: video_type,
        platform: platform,
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
      error: 'Failed to generate video script', 
      details: error.message 
    });
  }
}
