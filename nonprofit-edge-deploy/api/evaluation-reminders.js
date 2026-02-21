// api/evaluation-reminders.js
// Vercel Cron — runs daily at 8 AM UTC
// Checks for pending evaluators and fires the right reminder email
//
// Add to vercel.json:
// {
//   "crons": [{ "path": "/api/evaluation-reminders", "schedule": "0 8 * * *" }]
// }

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Verify this is a cron call (Vercel sets this header)
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let sent = 0;
  let skipped = 0;

  try {
    // ── Get all active evaluations with pending evaluators ──
    const { data: evaluations, error } = await supabase
      .from('ceo_evaluations')
      .select(`
        *,
        ceo_evaluators!inner(*)
      `)
      .eq('status', 'active')
      .eq('ceo_evaluators.status', 'pending')
      .eq('ceo_evaluators.reminder_opt_out', false);

    if (error) throw error;

    for (const evaluation of evaluations || []) {
      const deadline = new Date(evaluation.deadline);
      deadline.setHours(0, 0, 0, 0);
      const daysUntilDeadline = Math.round((deadline - today) / (1000 * 60 * 60 * 24));
      const config = evaluation.reminder_config || {};

      for (const evaluator of evaluation.ceo_evaluators) {
        const reminderLog = evaluator.reminder_log || [];
        const alreadySent = (type) => reminderLog.some(r => r.trigger === type);

        let triggerType = null;
        let subject = null;

        // Determine which trigger applies today
        if (daysUntilDeadline === 7 && config.seven_day && !alreadySent('7day')) {
          triggerType = 'reminder_7day';
          subject = `Reminder: CEO Evaluation due in 7 days`;
        } else if (daysUntilDeadline === 3 && config.three_day && !alreadySent('3day')) {
          triggerType = 'reminder_3day';
          subject = `Reminder: CEO Evaluation due in 3 days`;
        } else if (daysUntilDeadline === 0 && config.day_of && !alreadySent('day_of')) {
          triggerType = 'reminder_day_of';
          subject = `Today is the deadline — CEO Evaluation`;
        } else if (daysUntilDeadline === -1 && config.post_deadline && !alreadySent('post_deadline')) {
          // Only fire if fewer than 3 responses total
          const { data: results } = await supabase
            .from('ceo_evaluation_results')
            .select('total_responded')
            .eq('evaluation_id', evaluation.id)
            .single();

          if (!results || results.total_responded < 3) {
            triggerType = 'reminder_post';
            subject = `Final notice: CEO Evaluation still needs your input`;
          }
        } else if (config.custom_date) {
          const customDate = new Date(config.custom_date);
          customDate.setHours(0, 0, 0, 0);
          if (customDate.getTime() === today.getTime() && !alreadySent('custom')) {
            triggerType = 'reminder_custom';
            subject = `Reminder: CEO Evaluation`;
          }
        }

        if (!triggerType) {
          skipped++;
          continue;
        }

        // Send the reminder
        const evalLink = `${process.env.APP_URL}/eval/${evaluator.token}`;
        const deadlineFormatted = deadline.toLocaleDateString('en-US', {
          month: 'long', day: 'numeric', year: 'numeric'
        });

        try {
          const { data: emailData } = await resend.emails.send({
            from: 'The Nonprofit Edge <lyn@thenonprofitedge.org>',
            to: evaluator.email,
            subject: `${subject} — ${evaluation.organization_name}`,
            html: reminderEmailHTML({
              triggerType,
              evaluatorName: evaluator.name,
              ceoName: evaluation.ceo_name,
              organizationName: evaluation.organization_name,
              deadline: deadlineFormatted,
              daysUntilDeadline,
              evalLink
            })
          });

          // Update reminder_log on evaluator
          const updatedLog = [...reminderLog, { trigger: triggerType, sent_at: new Date().toISOString() }];
          await supabase
            .from('ceo_evaluators')
            .update({ reminder_log: updatedLog })
            .eq('id', evaluator.id);

          // Log to email table
          await supabase.from('ceo_eval_email_log').insert({
            evaluation_id: evaluation.id,
            evaluator_id: evaluator.id,
            email_to: evaluator.email,
            email_type: triggerType,
            subject,
            resend_message_id: emailData?.id,
            status: 'sent'
          });

          sent++;
        } catch (emailErr) {
          console.error(`Failed to send ${triggerType} to ${evaluator.email}:`, emailErr);
        }
      }

      // ── Admin late summary (day after deadline) ──────────
      if (daysUntilDeadline === -1) {
        const { data: results } = await supabase
          .from('ceo_evaluation_results')
          .select('total_responded, total_invited')
          .eq('evaluation_id', evaluation.id)
          .single();

        if (results && results.total_responded < results.total_invited) {
          const pending = evaluation.ceo_evaluators.map(e => e.name).join(', ');
          await resend.emails.send({
            from: 'The Nonprofit Edge <lyn@thenonprofitedge.org>',
            to: evaluation.admin_email,
            subject: `⏰ Deadline passed — ${results.total_responded}/${results.total_invited} responses received`,
            html: adminLateHTML({
              adminName: evaluation.admin_name,
              ceoName: evaluation.ceo_name,
              organizationName: evaluation.organization_name,
              responded: results.total_responded,
              total: results.total_invited,
              pendingNames: pending,
              evaluationId: evaluation.id
            })
          });
        }
      }
    }

    return res.status(200).json({ success: true, sent, skipped });

  } catch (error) {
    console.error('evaluation-reminders error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// ── Email Templates ──────────────────────────────────────────────────

function reminderEmailHTML({ triggerType, evaluatorName, ceoName, organizationName, deadline, daysUntilDeadline, evalLink }) {
  const urgencyColor = daysUntilDeadline <= 0 ? '#dc2626' : daysUntilDeadline <= 3 ? '#d97706' : '#0097A9';

  const urgencyMessage = {
    reminder_7day: `You have 7 days to complete this evaluation.`,
    reminder_3day: `The deadline is in 3 days — please set aside 15 minutes today.`,
    reminder_day_of: `Today is the final day to submit your evaluation.`,
    reminder_post: `The deadline has passed, but your input is still needed. Please complete this today.`,
    reminder_custom: `This is a reminder to complete the CEO evaluation.`
  }[triggerType] || '';

  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:#0D2C54;border-radius:12px 12px 0 0;padding:28px 36px;text-align:center;">
      <div style="color:rgba(255,255,255,.5);font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;margin-bottom:6px;">Reminder</div>
      <div style="color:white;font-size:20px;font-weight:600;">CEO Evaluation Still Needs You</div>
    </div>
    <div style="background:white;padding:36px;border:1px solid #e2e8f0;border-top:none;">
      <p style="font-size:16px;color:#1e293b;margin:0 0 16px;">Hi ${evaluatorName},</p>
      <p style="font-size:15px;color:#475569;line-height:1.7;margin:0 0 16px;">
        This is a reminder that your evaluation of <strong style="color:#0D2C54">${ceoName}</strong> at ${organizationName} is still pending.
      </p>
      <div style="background:#f8fafc;border-left:3px solid ${urgencyColor};padding:12px 16px;border-radius:0 8px 8px 0;margin:0 0 24px;">
        <p style="margin:0;font-size:14px;color:#1e293b;font-weight:600;">${urgencyMessage}</p>
        <p style="margin:4px 0 0;font-size:13px;color:#64748b;">Deadline: ${deadline}</p>
      </div>
      <div style="text-align:center;margin:28px 0;">
        <a href="${evalLink}" style="display:inline-block;background:#0097A9;color:white;font-size:15px;font-weight:700;padding:14px 36px;border-radius:8px;text-decoration:none;">
          Complete Evaluation →
        </a>
      </div>
      <p style="font-size:12px;color:#94a3b8;margin:16px 0 0;">
        <a href="${evalLink.replace('/eval/', '/unsubscribe/')}" style="color:#0097A9;text-decoration:none;">Opt out of future reminders</a>
      </p>
    </div>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:16px 36px;text-align:center;">
      <p style="font-size:12px;color:#94a3b8;margin:0;">Powered by <strong style="color:#0D2C54">The Nonprofit Edge</strong></p>
    </div>
  </div>
</body>
</html>`;
}

function adminLateHTML({ adminName, ceoName, organizationName, responded, total, pendingNames, evaluationId }) {
  return `
<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;color:#475569;">
  <h2 style="color:#0D2C54">Evaluation Deadline Passed</h2>
  <p>Hi ${adminName},</p>
  <p>The deadline for the ${ceoName} CEO evaluation at ${organizationName} has passed.</p>
  <p><strong style="color:#0D2C54">${responded} of ${total}</strong> board members have responded.</p>
  ${responded < total ? `<p>Still pending: ${pendingNames}</p>
  <p>You can extend the deadline or generate the report with current responses from your dashboard.</p>` : ''}
  <p style="font-size:12px;color:#94a3b8;">Evaluation ID: ${evaluationId}</p>
</body>
</html>`;
}
