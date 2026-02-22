// api/send-report.js
// Vercel Serverless Function — sends board assessment report via Resend

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    adminEmail,
    additionalEmails = [],
    orgName,
    respondentCount,
    reportHtml,
  } = req.body;

  if (!adminEmail || !reportHtml) {
    return res.status(400).json({ error: 'adminEmail and reportHtml are required' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.error('Resend API key not configured');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  // Build recipient list — admin first, then any additional
  const allRecipients = [adminEmail, ...additionalEmails.filter(e => e && e.trim())];

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'The Nonprofit Edge <insights@thenonprofitedge.org>',
        to: allRecipients,
        subject: `Board Governance Assessment Report — ${orgName || 'Your Organization'}`,
        reply_to: 'insights@thenonprofitedge.org',
        html: buildEmailWrapper(reportHtml, orgName, respondentCount),
        text: `Your Board Governance Assessment Report for ${orgName || 'Your Organization'} is ready. ${respondentCount} responses were collected. Please view this email in an HTML-capable client to see the full report.`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API error:', errorData);
      throw new Error(errorData.message || 'Failed to send email');
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      message: `Report sent to ${allRecipients.length} recipient${allRecipients.length !== 1 ? 's' : ''}`,
      emailId: data.id,
      recipients: allRecipients,
    });

  } catch (error) {
    console.error('Error sending report:', error);
    return res.status(500).json({
      error: 'Failed to send report',
      details: error.message,
    });
  }
}

// ─── Email wrapper ────────────────────────────────────────────────────────────
function buildEmailWrapper(reportHtml, orgName, respondentCount) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Board Governance Assessment Report</title>
  <style>
    body { margin: 0; padding: 0; background: #F0F4F8; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .wrapper { max-width: 700px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #0D2C54, #0097A9); padding: 32px 40px; }
    .header h1 { color: white; margin: 0 0 6px; font-size: 22px; font-weight: 800; }
    .header p { color: rgba(255,255,255,0.75); margin: 0; font-size: 14px; }
    .meta { background: #F8FAFC; padding: 16px 40px; border-bottom: 1px solid #E2E8F0; font-size: 13px; color: #555; }
    .content { padding: 32px 40px; }
    .footer { background: #0D2C54; padding: 24px 40px; text-align: center; }
    .footer p { color: rgba(255,255,255,0.5); font-size: 11px; margin: 0; line-height: 1.8; }
    .footer a { color: rgba(255,255,255,0.7); text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Board Governance Assessment Report</h1>
      <p>${orgName || 'Your Organization'} · Final Report</p>
    </div>
    <div class="meta">
      <strong>${respondentCount} board member${respondentCount !== 1 ? 's' : ''} participated</strong> · Assessment finalized and closed · Powered by The Nonprofit Edge
    </div>
    <div class="content">
      ${reportHtml}
    </div>
    <div class="footer">
      <p>
        Powered by <a href="https://thenonprofitedge.org">The Nonprofit Edge</a><br />
        © 2026 The Pivotal Group Consultants Inc. · Dr. Lyn Corbett<br />
        Questions? <a href="mailto:insights@thenonprofitedge.org">insights@thenonprofitedge.org</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}
