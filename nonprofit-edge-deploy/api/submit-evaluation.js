// api/submit-evaluation.js
// Called when an evaluator submits their form
// POST /api/submit-evaluation
// Public endpoint — authenticated by UUID token, no login required

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // service role — bypasses RLS for public submissions
);
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, responses } = req.body;
  // responses = array of { dimension, question_id, question_text, score, open_response }

  if (!token || !responses?.length) {
    return res.status(400).json({ error: 'Missing token or responses' });
  }

  try {
    // ── 1. Look up evaluator by token ────────────────────
    const { data: evaluator, error: evalrError } = await supabase
      .from('ceo_evaluators')
      .select('*, ceo_evaluations(*)')
      .eq('token', token)
      .single();

    if (evalrError || !evaluator) {
      return res.status(404).json({ error: 'Invalid or expired link' });
    }

    if (evaluator.status === 'completed') {
      return res.status(409).json({ error: 'This evaluation has already been submitted' });
    }

    const evaluation = evaluator.ceo_evaluations;

    // Check deadline
    if (new Date(evaluation.deadline) < new Date()) {
      // Still allow submission but flag it
      console.warn(`Late submission from ${evaluator.email} for evaluation ${evaluation.id}`);
    }

    // ── 2. Insert all responses ──────────────────────────
    const responseRows = responses.map(r => ({
      evaluation_id: evaluation.id,
      evaluator_id: evaluator.id,
      dimension: r.dimension,
      question_id: r.question_id,
      question_text: r.question_text || '',
      score: r.score || null,
      open_response: r.open_response || null
    }));

    const { error: insertError } = await supabase
      .from('ceo_evaluator_responses')
      .insert(responseRows);

    if (insertError) throw insertError;

    // ── 3. Mark evaluator as completed ──────────────────
    await supabase
      .from('ceo_evaluators')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', evaluator.id);

    // ── 4. Recalculate aggregate results ─────────────────
    await supabase.rpc('recalculate_ceo_results', { eval_id: evaluation.id });

    // ── 5. Check if admin threshold notification needed ──
    const { data: results } = await supabase
      .from('ceo_evaluation_results')
      .select('total_responded, total_invited')
      .eq('evaluation_id', evaluation.id)
      .single();

    const thresholds = [3, 5, evaluation.minimum_responses];
    if (results && thresholds.includes(results.total_responded)) {
      await notifyAdminOfProgress(evaluation, results, resend);
    }

    // ── 6. Send thank-you to evaluator ──────────────────
    await resend.emails.send({
      from: 'The Nonprofit Edge <lyn@thenonprofitedge.org>',
      to: evaluator.email,
      subject: `Thank you — CEO Evaluation Complete`,
      html: thankYouHTML({ evaluatorName: evaluator.name, ceoName: evaluation.ceo_name, organizationName: evaluation.organization_name })
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('submit-evaluation error:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function notifyAdminOfProgress(evaluation, results, resend) {
  const responseRate = Math.round((results.total_responded / results.total_invited) * 100);
  const remaining = results.total_invited - results.total_responded;

  await resend.emails.send({
    from: 'The Nonprofit Edge <lyn@thenonprofitedge.org>',
    to: evaluation.admin_email,
    subject: `📊 ${results.total_responded} responses in — CEO Evaluation Update`,
    html: `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
  <h2 style="color:#0D2C54">Evaluation Update</h2>
  <p style="color:#475569;">You've reached <strong>${results.total_responded} responses</strong> (${responseRate}% response rate) for the ${evaluation.ceo_name} evaluation at ${evaluation.organization_name}.</p>
  <p style="color:#475569;">${remaining > 0 ? `${remaining} board member${remaining > 1 ? 's have' : ' has'} not yet responded.` : 'All invited board members have responded.'}</p>
  ${results.total_responded >= evaluation.minimum_responses 
    ? `<p style="background:#dcfce7;padding:12px 16px;border-radius:8px;color:#15803d;font-weight:600;">✅ Minimum response threshold met — you can generate the report now.</p>` 
    : ''}
</div>`
  });
}

function thankYouHTML({ evaluatorName, ceoName, organizationName }) {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:#0D2C54;border-radius:12px 12px 0 0;padding:28px 36px;text-align:center;">
      <div style="color:white;font-size:20px;font-weight:600;">Thank You</div>
    </div>
    <div style="background:white;padding:36px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
      <p style="font-size:15px;color:#475569;line-height:1.7;">Hi ${evaluatorName},</p>
      <p style="font-size:15px;color:#475569;line-height:1.7;">
        Your evaluation of <strong>${ceoName}</strong> at ${organizationName} has been received. 
        Your responses are confidential and will only appear as part of the aggregated board report.
      </p>
      <p style="font-size:15px;color:#475569;line-height:1.7;">
        Thank you for taking the time to provide thoughtful feedback — it makes a real difference in supporting strong nonprofit leadership.
      </p>
    </div>
  </div>
</body>
</html>`;
}
