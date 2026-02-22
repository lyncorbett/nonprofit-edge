// api/send-ceo-reminders.js
// Vercel Cron Job — runs weekly to send CEO assessment reminders
// Schedule: every Monday at 8am UTC
// Add to vercel.json: { "crons": [{ "path": "/api/send-ceo-reminders", "schedule": "0 8 * * 1" }] }

import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // needs service role to query all users
);

export default async function handler(req, res) {
  // Only allow GET (cron) or POST with secret (manual trigger)
  if (req.method === 'POST') {
    if (req.headers['x-cron-secret'] !== process.env.CRON_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const now = new Date().toISOString();

  try {
    // Find all assessments where reminder is due and not yet sent
    const { data: due, error } = await supabase
      .from('ceo_self_assessments')
      .select('id, ceo_email, ceo_name, completed_at, reminder_scheduled_at')
      .eq('reminder_sent', false)
      .lte('reminder_scheduled_at', now);

    if (error) throw error;
    if (!due || due.length === 0) {
      return res.status(200).json({ message: 'No reminders due', count: 0 });
    }

    const results = [];

    for (const record of due) {
      const firstName = record.ceo_name?.split(' ')[0] || 'there';
      const completedDate = new Date(record.completed_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      const html = `
        <div style="font-family:'DM Sans',Arial,sans-serif;max-width:560px;margin:0 auto;background:#f0f4f8;padding:24px;">
          <div style="background:#0D2C54;border-radius:12px;padding:36px 40px;margin-bottom:20px;">
            <div style="font-size:11px;font-weight:700;color:#0097A9;letter-spacing:.16em;text-transform:uppercase;margin-bottom:10px;">The Nonprofit Edge</div>
            <h1 style="font-family:Georgia,serif;font-size:24px;color:white;margin:0 0 10px;">Time for your annual reflection.</h1>
            <p style="font-size:15px;color:rgba(255,255,255,.7);margin:0;line-height:1.6;">You completed your CEO Self-Assessment in ${completedDate}. A lot can change in a year — and you've probably grown more than you've had time to notice.</p>
          </div>
          <div style="background:white;border-radius:12px;padding:28px 32px;margin-bottom:16px;">
            <p style="font-size:15px;color:#1e293b;line-height:1.75;margin:0 0 20px;">Hi ${firstName},</p>
            <p style="font-size:15px;color:#1e293b;line-height:1.75;margin:0 0 20px;">The most effective leaders don't just reflect once — they build it into the rhythm of how they lead. Your annual CEO Self-Assessment is one of the highest-leverage hours you can invest in yourself and your organization.</p>
            <p style="font-size:15px;color:#1e293b;line-height:1.75;margin:0 0 28px;">This year's assessment covers the same seven dimensions — but you'll come to it with a different set of experiences, pressures, and growth. The gap between last year's answers and this year's is the data.</p>
            <a href="https://thenonprofitedge.org/ceo-evaluation/use" style="display:inline-block;background:#0097A9;color:white;text-decoration:none;border-radius:8px;padding:13px 28px;font-size:15px;font-weight:700;">Start This Year's Assessment →</a>
          </div>
          <div style="background:white;border-radius:12px;padding:20px 28px;margin-bottom:16px;border-left:3px solid #0097A9;">
            <p style="font-size:13px;color:#475569;line-height:1.65;margin:0;font-style:italic;">"The most useful self-assessments happen when you answer for who you actually are — not who you intend to be. Rate based on pattern, not potential."</p>
          </div>
          <div style="text-align:center;padding:16px;color:#94a3b8;font-size:12px;line-height:1.8;">
            The Nonprofit Edge · CEO Self-Assessment<br/>
            <a href="https://thenonprofitedge.org" style="color:#0097A9;text-decoration:none;">thenonprofitedge.org</a>
            <br/><br/>
            <a href="https://thenonprofitedge.org/eval/unsubscribed" style="color:#cbd5e1;font-size:11px;">Unsubscribe from reminders</a>
          </div>
        </div>
      `;

      try {
        await resend.emails.send({
          from: 'Lyn Corbett <lyn@thenonprofitedge.org>',
          to: record.ceo_email,
          subject: `Time for your annual CEO Self-Assessment — The Nonprofit Edge`,
          html,
        });

        // Mark reminder as sent
        await supabase
          .from('ceo_self_assessments')
          .update({ reminder_sent: true, reminder_sent_at: new Date().toISOString() })
          .eq('id', record.id);

        results.push({ email: record.ceo_email, status: 'sent' });
      } catch (emailErr) {
        results.push({ email: record.ceo_email, status: 'failed', error: emailErr.message });
      }
    }

    return res.status(200).json({ message: 'Reminders processed', count: results.length, results });

  } catch (err) {
    console.error('Reminder error:', err);
    return res.status(500).json({ error: err.message });
  }
}
