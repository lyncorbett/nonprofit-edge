// File: api/render-heygen.js
// Vercel Serverless Function - Send approved scripts to HeyGen for video rendering

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
const HEYGEN_API_BASE = 'https://api.heygen.com/v2';

async function heygenRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'X-Api-Key': HEYGEN_API_KEY,
      'Content-Type': 'application/json'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${HEYGEN_API_BASE}${endpoint}`, options);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HeyGen API error: ${response.status} - ${error}`);
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
    const { video_id, avatar_id, voice_id } = req.body;

    if (!video_id) {
      return res.status(400).json({ error: 'video_id is required' });
    }

    // Fetch the approved video
    const { data: video, error: fetchError } = await supabase
      .from('video_queue')
      .select('*')
      .eq('id', video_id)
      .eq('status', 'approved')
      .single();

    if (fetchError || !video) {
      return res.status(404).json({ error: 'Approved video not found' });
    }

    // Get default avatar if not specified
    let selectedAvatar = avatar_id;
    let selectedVoice = voice_id;

    if (!selectedAvatar) {
      const { data: defaultAvatar } = await supabase
        .from('heygen_avatars')
        .select('*')
        .eq('is_default', true)
        .single();

      if (defaultAvatar) {
        selectedAvatar = defaultAvatar.heygen_avatar_id;
        selectedVoice = defaultAvatar.heygen_voice_id;
      }
    }

    // Determine aspect ratio based on platform
    const aspectRatios = {
      linkedin: '16:9',
      youtube: '16:9',
      meta: '1:1',
      instagram: '9:16',
      tiktok: '9:16',
      website: '16:9'
    };

    const aspectRatio = aspectRatios[video.target_platform] || '16:9';

    // Create video in HeyGen
    const heygenPayload = {
      video_inputs: [{
        character: {
          type: 'avatar',
          avatar_id: selectedAvatar || 'default', // Will need to be configured
          avatar_style: 'normal'
        },
        voice: {
          type: 'text',
          input_text: video.script,
          voice_id: selectedVoice || 'default' // Will need to be configured
        }
      }],
      dimension: {
        width: aspectRatio === '9:16' ? 1080 : 1920,
        height: aspectRatio === '9:16' ? 1920 : aspectRatio === '1:1' ? 1080 : 1080
      },
      aspect_ratio: aspectRatio
    };

    const heygenResponse = await heygenRequest('/video/generate', 'POST', heygenPayload);

    // Create render record
    const { data: renderRecord, error: insertError } = await supabase
      .from('video_renders')
      .insert({
        video_queue_id: video.id,
        heygen_video_id: heygenResponse.data?.video_id,
        heygen_job_id: heygenResponse.data?.video_id, // HeyGen uses same ID
        avatar_id: selectedAvatar,
        voice_id: selectedVoice,
        aspect_ratio: aspectRatio,
        status: 'processing',
        submitted_at: new Date().toISOString(),
        heygen_raw_response: heygenResponse
      })
      .select()
      .single();

    // Update video status
    await supabase
      .from('video_queue')
      .update({ status: 'rendering' })
      .eq('id', video_id);

    return res.status(200).json({
      success: true,
      message: 'Video submitted to HeyGen for rendering',
      render: {
        id: renderRecord?.id,
        heygen_video_id: heygenResponse.data?.video_id,
        status: 'processing',
        estimated_time: '2-5 minutes'
      }
    });

  } catch (error) {
    console.error('HeyGen render error:', error);
    return res.status(500).json({ error: 'Failed to start render', details: error.message });
  }
}
