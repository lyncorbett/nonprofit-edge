// File: api/heygen-webhook.js
// Vercel Serverless Function - Receive HeyGen video completion webhooks

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // HeyGen sends POST requests for webhooks
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { event_type, video_id, status, video_url, thumbnail_url, duration, error } = req.body;

    console.log('HeyGen webhook received:', { event_type, video_id, status });

    // Find the render record
    const { data: render, error: fetchError } = await supabase
      .from('video_renders')
      .select('*, video_queue(*)')
      .eq('heygen_video_id', video_id)
      .single();

    if (fetchError || !render) {
      console.error('Render not found for video_id:', video_id);
      return res.status(200).json({ received: true, message: 'Render not found' });
    }

    if (status === 'completed' || event_type === 'video.completed') {
      // Update render record with completed video
      await supabase
        .from('video_renders')
        .update({
          status: 'completed',
          video_url: video_url,
          thumbnail_url: thumbnail_url,
          duration_seconds: duration,
          completed_at: new Date().toISOString()
        })
        .eq('id', render.id);

      // Update video queue status
      await supabase
        .from('video_queue')
        .update({ status: 'completed' })
        .eq('id', render.video_queue_id);

      console.log('Video completed:', video_url);

    } else if (status === 'failed' || event_type === 'video.failed') {
      // Update with error
      await supabase
        .from('video_renders')
        .update({
          status: 'failed',
          error_message: error || 'Unknown error'
        })
        .eq('id', render.id);

      await supabase
        .from('video_queue')
        .update({ status: 'failed' })
        .eq('id', render.video_queue_id);

      console.error('Video failed:', error);

    } else if (status === 'processing' || event_type === 'video.processing') {
      // Update progress if provided
      const progress = req.body.progress || 50;
      await supabase
        .from('video_renders')
        .update({ progress })
        .eq('id', render.id);
    }

    return res.status(200).json({ received: true, status: 'processed' });

  } catch (err) {
    console.error('Webhook processing error:', err);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
