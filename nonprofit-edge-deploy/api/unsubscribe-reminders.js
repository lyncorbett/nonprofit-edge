// api/unsubscribe-reminders.js
// GET /api/unsubscribe-reminders?token=UUID
// Linked from every reminder email footer

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send('Invalid link');
  }

  const { error } = await supabase
    .from('ceo_evaluators')
    .update({ reminder_opt_out: true })
    .eq('token', token);

  if (error) {
    return res.status(500).send('Something went wrong. Please try again.');
  }

  // Redirect to a simple confirmation page
  return res.redirect(302, `${process.env.APP_URL}/eval/unsubscribed`);
}
