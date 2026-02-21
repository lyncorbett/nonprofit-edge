// api/create-evaluation.js
// Creates evaluation record, adds evaluators, fires invitation emails via Resend
// POST /api/create-evaluation

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    organization_id,
    organization_name,
    ceo_name,
    ceo_email,
    admin_name,
    admin_email,
    period_start,
    period_end,
    deadline,
    share_results_with_ceo,
    has_committees,
    committee_list,
    reminder_config,
    evaluators // array of { name, email, board_role, committee_memberships }
  } = req.body;

  // ── Validate required fields ─────────────────────────
  if (!organization_name || !ceo_name || !admin_email || !deadline || !evaluators?.length) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // ── 1. Create the evaluation record ─────────────────
    const { data: evaluation, error: evalError } = await supabase
      .from('ceo_evaluations')
      .insert({
        organization_id,
        organization_name,
        ceo_name,
        ceo_email,
        admin_name,
        admin_email,
        period_start,
        period_end,
        deadline,
        share_results_with_ceo: share_results_with_ceo || false,
        has_committees: has_committees || false,
        committee_list: committee_list || [],
        reminder_config: reminder_config || {},
        status: 'active',
        published_at: new Date().toISOString()
      })
      .select()
      .single();

    if (evalError) throw evalError;

    // ── 2. Insert evaluator rows ─────────────────────────
    const evaluatorRows = evaluators.map(e => ({
      evaluation_id: evaluation.id,
      name: e.name,
      email: e.email,
      board_role: e.board_role,
      committee_memberships: e.committee_memberships || [],
      status: 'pending',
      invited_at: new Date().toISOString()
    }));

    const { data: insertedEvaluators, error: evalrError } = await supabase
      .from('ceo_evaluators')
      .insert(evaluatorRows)
      .select();

    if (evalrError) throw evalrError;

    // ── 3. Send invitation emails ────────────────────────
    const emailResults = [];
    const baseUrl = process.env.APP_URL || 'https://thenonprofitedge.org';

    for (const evaluator of insertedEvaluators) {
      const evalLink = `${baseUrl}/eval/${evaluator.token}`;
      const deadlineFormatted = new Date(deadline).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
      });

      try {
        const { data: emailData, error: emailError } = await resend.emails.send({
          from: 'The Nonprofit Edge <lyn@thenonprofitedge.org>',
          to: evaluator.email,
          subject: `CEO Evaluation Request — ${organization_name}`,
          html: invitationEmailHTML({
            evaluatorName: evaluator.name,
            ceoName: ceo_name,
            organizationName: organization_name,
            adminName: admin_name,
            deadline: deadlineFormatted,
            evalLink
          })
        });

        // Log the email
        await supabase.from('ceo_eval_email_log').insert({
          evaluation_id: evaluation.id,
          evaluator_id: evaluator.id,
          email_to: evaluator.email,
          email_type: 'invite',
          subject: `CEO Evaluation Request — ${organization_name}`,
          resend_message_id: emailData?.id,
          status: emailError ? 'failed' : 'sent'
        });

        emailResults.push({ email: evaluator.email, success: !emailError });
      } catch (e) {
        emailResults.push({ email: evaluator.email, success: false, error: e.message });
      }
    }

    // ── 4. Send admin confirmation ───────────────────────
    await resend.emails.send({
      from: 'The Nonprofit Edge <lyn@thenonprofitedge.org>',
      to: admin_email,
      subject: `✅ CEO Evaluation Launched — ${organization_name}`,
      html: adminConfirmationHTML({
        adminName: admin_name,
        ceoName: ceo_name,
        organizationName: organization_name,
        evaluatorCount: insertedEvaluators.length,
        deadline: new Date(deadline).toLocaleDateString('en-US', {
          month: 'long', day: 'numeric', year: 'numeric'
        }),
        evaluationId: evaluation.id
      })
    });

    return res.status(200).json({
      success: true,
      evaluation_id: evaluation.id,
      evaluators_invited: insertedEvaluators.length,
      emails: emailResults
    });

  } catch (error) {
    console.error('create-evaluation error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// ── Email Templates ──────────────────────────────────────────────────

function invitationEmailHTML({ evaluatorName, ceoName, organizationName, adminName, deadline, evalLink }) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <!-- Header -->
    <div style="background:#0D2C54;border-radius:12px 12px 0 0;padding:28px 36px;text-align:center;">
      <div style="color:rgba(255,255,255,.5);font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;margin-bottom:6px;">The Nonprofit Edge</div>
      <div style="color:white;font-size:20px;font-weight:600;">CEO Evaluation — Board Survey</div>
    </div>

    <!-- Body -->
    <div style="background:white;padding:36px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
      <p style="font-size:16px;color:#1e293b;margin:0 0 16px;">Hi ${evaluatorName},</p>
      <p style="font-size:15px;color:#475569;line-height:1.7;margin:0 0 20px;">
        ${adminName} has invited you to participate in the annual performance evaluation for <strong style="color:#0D2C54">${ceoName}</strong>, Executive Director of ${organizationName}.
      </p>
      <p style="font-size:15px;color:#475569;line-height:1.7;margin:0 0 28px;">
        This evaluation is confidential. Your individual responses will not be shared — only aggregated results are included in the board report. Please complete this by <strong style="color:#0D2C54">${deadline}</strong>.
      </p>

      <!-- CTA -->
      <div style="text-align:center;margin:32px 0;">
        <a href="${evalLink}" style="display:inline-block;background:#0097A9;color:white;font-size:15px;font-weight:700;padding:14px 36px;border-radius:8px;text-decoration:none;letter-spacing:.02em;">
          Begin Evaluation →
        </a>
      </div>

      <p style="font-size:13px;color:#94a3b8;margin:24px 0 0;line-height:1.6;">
        This link is unique to you. The evaluation takes approximately 10–15 minutes. If you have questions, reply to this email or contact ${adminName} directly.
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:20px 36px;text-align:center;">
      <p style="font-size:12px;color:#94a3b8;margin:0;">
        Powered by <strong style="color:#0D2C54">The Nonprofit Edge</strong> · 
        <a href="${evalLink.replace('/eval/', '/unsubscribe/')}" style="color:#0097A9;text-decoration:none;">Opt out of reminders</a>
      </p>
    </div>

  </div>
</body>
</html>`;
}

function adminConfirmationHTML({ adminName, ceoName, organizationName, evaluatorCount, deadline, evaluationId }) {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:#0D2C54;border-radius:12px 12px 0 0;padding:28px 36px;">
      <div style="color:white;font-size:18px;font-weight:600;">✅ Evaluation Launched Successfully</div>
    </div>
    <div style="background:white;padding:36px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
      <p style="font-size:15px;color:#475569;line-height:1.7;">Hi ${adminName},</p>
      <p style="font-size:15px;color:#475569;line-height:1.7;">
        The CEO evaluation for <strong>${ceoName}</strong> at ${organizationName} has been launched. 
        Invitations have been sent to <strong>${evaluatorCount} board members</strong>.
      </p>
      <table style="width:100%;border-collapse:collapse;margin:24px 0;font-size:14px;">
        <tr style="background:#f8fafc;">
          <td style="padding:10px 16px;color:#64748b;font-weight:600;border:1px solid #e2e8f0;">CEO</td>
          <td style="padding:10px 16px;color:#1e293b;border:1px solid #e2e8f0;">${ceoName}</td>
        </tr>
        <tr>
          <td style="padding:10px 16px;color:#64748b;font-weight:600;border:1px solid #e2e8f0;">Evaluators</td>
          <td style="padding:10px 16px;color:#1e293b;border:1px solid #e2e8f0;">${evaluatorCount} invited</td>
        </tr>
        <tr style="background:#f8fafc;">
          <td style="padding:10px 16px;color:#64748b;font-weight:600;border:1px solid #e2e8f0;">Deadline</td>
          <td style="padding:10px 16px;color:#1e293b;border:1px solid #e2e8f0;">${deadline}</td>
        </tr>
      </table>
      <p style="font-size:13px;color:#94a3b8;">Evaluation ID: ${evaluationId}</p>
    </div>
  </div>
</body>
</html>`;
}
