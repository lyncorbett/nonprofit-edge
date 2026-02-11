import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.status(200).json({ ok: true, supabase: !!createClient });
}
