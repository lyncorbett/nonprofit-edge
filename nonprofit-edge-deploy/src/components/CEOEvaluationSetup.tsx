// src/components/CEOEvaluationSetup.tsx
// Admin-facing setup flow inside the platform
// Route: /ceo-evaluation or /tools/ceo-evaluation

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const COMMITTEES = ['Executive', 'Finance & Audit', 'Programs', 'Fundraising', 'Governance', 'HR'];

type Evaluator = { name: string; email: string; board_role: 'exec' | 'atlarge'; committee_memberships: string[] };

export default function CEOEvaluationSetup() {
  const [step, setStep] = useState<'setup' | 'evaluators' | 'reminders' | 'confirm' | 'launched'>('setup');
  const [submitting, setSubmitting] = useState(false);
  const [launchResult, setLaunchResult] = useState<any>(null);

  // Step 1 — setup
  const [orgName, setOrgName] = useState('');
  const [ceoName, setCeoName] = useState('');
  const [ceoEmail, setCeoEmail] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [deadline, setDeadline] = useState('');
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [shareWithCEO, setShareWithCEO] = useState(false);

  // Step 2 — committees
  const [hasCommittees, setHasCommittees] = useState<boolean | null>(null);
  const [selectedCommittees, setSelectedCommittees] = useState<string[]>([]);

  // Step 3 — evaluators
  const [evaluators, setEvaluators] = useState<Evaluator[]>([{ name: '', email: '', board_role: 'atlarge', committee_memberships: [] }]);

  // Step 4 — reminders
  const [reminders, setReminders] = useState({ seven_day: true, three_day: true, day_of: true, post_deadline: true });
  const [customDate, setCustomDate] = useState('');

  function addEvaluator() {
    setEvaluators(prev => [...prev, { name: '', email: '', board_role: 'atlarge', committee_memberships: [] }]);
  }

  function removeEvaluator(i: number) {
    setEvaluators(prev => prev.filter((_, idx) => idx !== i));
  }

  function updateEvaluator(i: number, field: keyof Evaluator, value: any) {
    setEvaluators(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e));
  }

  function toggleCommitteeMembership(evalIndex: number, committee: string) {
    const current = evaluators[evalIndex].committee_memberships;
    const updated = current.includes(committee)
      ? current.filter(c => c !== committee)
      : [...current, committee];
    updateEvaluator(evalIndex, 'committee_memberships', updated);
  }

  async function launch() {
    setSubmitting(true);
    try {
      const res = await fetch('/api/create-evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization_name: orgName,
          ceo_name: ceoName,
          ceo_email: ceoEmail,
          admin_name: adminName,
          admin_email: adminEmail,
          deadline,
          period_start: periodStart || null,
          period_end: periodEnd || null,
          share_results_with_ceo: shareWithCEO,
          has_committees: hasCommittees || false,
          committee_list: selectedCommittees,
          reminder_config: {
            invite: true,
            seven_day: reminders.seven_day,
            three_day: reminders.three_day,
            day_of: reminders.day_of,
            post_deadline: reminders.post_deadline,
            custom_date: customDate || null,
          },
          evaluators,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Launch failed');
      setLaunchResult(data);
      setStep('launched');
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  // ── Render ────────────────────────────────────────────
  if (step === 'launched') {
    return (
      <PageWrap>
        <div style={card}>
          <div style={{ textAlign: 'center', padding: '8px 0 24px' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 26 }}>✓</div>
            <h2 style={h2}>Evaluation Launched</h2>
            <p style={subtext}>Invitations have been sent to {launchResult?.evaluators_invited} board members. You'll receive a confirmation email shortly.</p>
          </div>
          <div style={{ background: '#f8fafc', borderRadius: 8, padding: '16px 20px', fontSize: 14, color: '#475569' }}>
            <div><strong>CEO:</strong> {ceoName}</div>
            <div style={{ marginTop: 6 }}><strong>Deadline:</strong> {new Date(deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            <div style={{ marginTop: 6 }}><strong>Evaluators invited:</strong> {launchResult?.evaluators_invited}</div>
          </div>
          <button onClick={() => { setStep('setup'); setLaunchResult(null); }} style={{ ...btnSecondary, marginTop: 20, width: '100%' }}>
            Start Another Evaluation
          </button>
        </div>
      </PageWrap>
    );
  }

  return (
    <PageWrap>
      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, alignItems: 'center' }}>
        {(['setup', 'evaluators', 'reminders', 'confirm'] as const).map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700,
              background: step === s ? '#0D2C54' : ['setup', 'evaluators', 'reminders', 'confirm'].indexOf(step) > i ? '#0097A9' : '#e2e8f0',
              color: step === s || ['setup', 'evaluators', 'reminders', 'confirm'].indexOf(step) > i ? 'white' : '#94a3b8',
            }}>{i + 1}</div>
            <span style={{ fontSize: 12, color: step === s ? '#0D2C54' : '#94a3b8', fontWeight: step === s ? 700 : 400, display: i === 3 ? 'none' : 'inline' }}>
              {['Setup', 'Board Members', 'Reminders', 'Confirm'][i]}
            </span>
            {i < 3 && <div style={{ width: 24, height: 1, background: '#e2e8f0' }} />}
          </div>
        ))}
      </div>

      {/* ── STEP 1: Setup ─────────────────────────────── */}
      {step === 'setup' && (
        <div style={card}>
          <h2 style={h2}>Evaluation Setup</h2>
          <p style={subtext}>Basic information about this evaluation cycle.</p>

          <div style={fieldGroup}>
            <label style={labelStyle}>Organization Name *</label>
            <input style={inputStyle} value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="e.g. Bay Area Community Health" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={fieldGroup}>
              <label style={labelStyle}>CEO / Executive Director Name *</label>
              <input style={inputStyle} value={ceoName} onChange={e => setCeoName(e.target.value)} placeholder="Full name" />
            </div>
            <div style={fieldGroup}>
              <label style={labelStyle}>CEO Email <span style={{ color: '#94a3b8' }}>(for sharing results)</span></label>
              <input style={inputStyle} type="email" value={ceoEmail} onChange={e => setCeoEmail(e.target.value)} placeholder="ceo@org.org" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={fieldGroup}>
              <label style={labelStyle}>Board Chair / Admin Name *</label>
              <input style={inputStyle} value={adminName} onChange={e => setAdminName(e.target.value)} placeholder="Your name" />
            </div>
            <div style={fieldGroup}>
              <label style={labelStyle}>Board Chair / Admin Email *</label>
              <input style={inputStyle} type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} placeholder="chair@org.org" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div style={fieldGroup}>
              <label style={labelStyle}>Evaluation Period Start</label>
              <input style={inputStyle} type="date" value={periodStart} onChange={e => setPeriodStart(e.target.value)} />
            </div>
            <div style={fieldGroup}>
              <label style={labelStyle}>Evaluation Period End</label>
              <input style={inputStyle} type="date" value={periodEnd} onChange={e => setPeriodEnd(e.target.value)} />
            </div>
            <div style={fieldGroup}>
              <label style={labelStyle}>Response Deadline *</label>
              <input style={inputStyle} type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
            </div>
          </div>

          <div style={fieldGroup}>
            <label style={labelStyle}>Does your board have standing committees?</label>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              {[true, false].map(v => (
                <button key={String(v)} onClick={() => setHasCommittees(v)}
                  style={{ padding: '8px 20px', borderRadius: 8, border: hasCommittees === v ? '2px solid #0097A9' : '2px solid #e2e8f0', background: hasCommittees === v ? '#e0f7fa' : 'white', color: hasCommittees === v ? '#0D2C54' : '#64748b', fontWeight: hasCommittees === v ? 700 : 400, cursor: 'pointer', fontSize: 14 }}>
                  {v ? 'Yes' : 'No'}
                </button>
              ))}
            </div>
            {hasCommittees && (
              <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {COMMITTEES.map(c => (
                  <button key={c} onClick={() => setSelectedCommittees(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}
                    style={{ padding: '5px 14px', borderRadius: 20, border: selectedCommittees.includes(c) ? '2px solid #0097A9' : '2px solid #e2e8f0', background: selectedCommittees.includes(c) ? '#e0f7fa' : 'white', color: selectedCommittees.includes(c) ? '#0D2C54' : '#64748b', fontWeight: selectedCommittees.includes(c) ? 700 : 400, cursor: 'pointer', fontSize: 13 }}>
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#f8fafc', borderRadius: 8 }}>
            <input type="checkbox" id="share" checked={shareWithCEO} onChange={e => setShareWithCEO(e.target.checked)} />
            <label htmlFor="share" style={{ fontSize: 14, color: '#475569', cursor: 'pointer' }}>Share results with CEO after report is generated</label>
          </div>

          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setStep('evaluators')}
              disabled={!orgName || !ceoName || !adminName || !adminEmail || !deadline || hasCommittees === null}
              style={(!orgName || !ceoName || !adminName || !adminEmail || !deadline || hasCommittees === null) ? btnDisabled : btnPrimary}>
              Next: Add Board Members →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Evaluators ───────────────────────── */}
      {step === 'evaluators' && (
        <div style={card}>
          <h2 style={h2}>Board Members</h2>
          <p style={subtext}>Add each board member who will receive an evaluation invitation. Each person gets a unique private link.</p>

          {evaluators.map((e, i) => (
            <div key={i} style={{ background: '#f8fafc', borderRadius: 10, padding: '16px 20px', marginBottom: 14, border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'end' }}>
                <div style={fieldGroup}>
                  <label style={labelStyle}>Name *</label>
                  <input style={inputStyle} value={e.name} onChange={ev => updateEvaluator(i, 'name', ev.target.value)} placeholder="Full name" />
                </div>
                <div style={fieldGroup}>
                  <label style={labelStyle}>Email *</label>
                  <input style={inputStyle} type="email" value={e.email} onChange={ev => updateEvaluator(i, 'email', ev.target.value)} placeholder="email@org.org" />
                </div>
                {evaluators.length > 1 && (
                  <button onClick={() => removeEvaluator(i)} style={{ background: 'none', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 18, marginBottom: 0 }}>×</button>
                )}
              </div>

              <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={labelStyle}>Role:</span>
                {(['atlarge', 'exec'] as const).map(role => (
                  <button key={role} onClick={() => updateEvaluator(i, 'board_role', role)}
                    style={{ padding: '4px 14px', borderRadius: 20, border: e.board_role === role ? '2px solid #0097A9' : '2px solid #e2e8f0', background: e.board_role === role ? '#e0f7fa' : 'white', color: e.board_role === role ? '#0D2C54' : '#64748b', fontWeight: e.board_role === role ? 700 : 400, cursor: 'pointer', fontSize: 12 }}>
                    {role === 'atlarge' ? 'At-Large' : 'Exec Committee'}
                  </button>
                ))}
              </div>

              {hasCommittees && selectedCommittees.length > 0 && (
                <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={labelStyle}>Committees:</span>
                  {selectedCommittees.map(c => (
                    <button key={c} onClick={() => toggleCommitteeMembership(i, c)}
                      style={{ padding: '3px 12px', borderRadius: 20, border: e.committee_memberships.includes(c) ? '1px solid #0097A9' : '1px solid #e2e8f0', background: e.committee_memberships.includes(c) ? '#e0f7fa' : 'white', color: e.committee_memberships.includes(c) ? '#0D2C54' : '#94a3b8', cursor: 'pointer', fontSize: 11, fontWeight: e.committee_memberships.includes(c) ? 700 : 400 }}>
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button onClick={addEvaluator} style={{ ...btnSecondary, width: '100%', marginBottom: 24 }}>
            + Add Board Member
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep('setup')} style={btnSecondary}>← Back</button>
            <button onClick={() => setStep('reminders')} disabled={evaluators.some(e => !e.name || !e.email)} style={evaluators.some(e => !e.name || !e.email) ? btnDisabled : btnPrimary}>
              Next: Reminders →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Reminders ─────────────────────────── */}
      {step === 'reminders' && (
        <div style={card}>
          <h2 style={h2}>Reminder Schedule</h2>
          <p style={subtext}>Automated reminders are sent to board members who haven't completed the evaluation. Toggle any off.</p>

          {[
            { key: 'seven_day', label: '7 days before deadline', desc: 'First follow-up reminder' },
            { key: 'three_day', label: '3 days before deadline', desc: 'Urgency reminder' },
            { key: 'day_of', label: 'Day of deadline', desc: 'Final day reminder at 8 AM' },
            { key: 'post_deadline', label: '1 day after deadline', desc: 'Only sent if fewer than 3 responses received' },
          ].map(r => (
            <div key={r.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#f8fafc', borderRadius: 8, marginBottom: 10, border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{r.label}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{r.desc}</div>
              </div>
              <button onClick={() => setReminders(prev => ({ ...prev, [r.key]: !prev[r.key as keyof typeof prev] }))}
                style={{ width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', background: reminders[r.key as keyof typeof reminders] ? '#0097A9' : '#e2e8f0', position: 'relative', transition: 'background .2s' }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: reminders[r.key as keyof typeof reminders] ? 23 : 3, transition: 'left .2s' }} />
              </button>
            </div>
          ))}

          <div style={{ ...fieldGroup, marginTop: 8 }}>
            <label style={labelStyle}>Custom reminder date (optional)</label>
            <input style={inputStyle} type="date" value={customDate} onChange={e => setCustomDate(e.target.value)} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <button onClick={() => setStep('evaluators')} style={btnSecondary}>← Back</button>
            <button onClick={() => setStep('confirm')} style={btnPrimary}>Review & Launch →</button>
          </div>
        </div>
      )}

      {/* ── STEP 4: Confirm ───────────────────────────── */}
      {step === 'confirm' && (
        <div style={card}>
          <h2 style={h2}>Review & Launch</h2>
          <p style={subtext}>Review the details below. Once launched, invitation emails will be sent immediately.</p>

          <div style={{ background: '#f8fafc', borderRadius: 10, padding: '20px 24px', marginBottom: 20, border: '1px solid #e2e8f0' }}>
            <Row label="Organization" value={orgName} />
            <Row label="CEO" value={ceoName} />
            <Row label="Board Chair" value={`${adminName} (${adminEmail})`} />
            <Row label="Deadline" value={new Date(deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
            <Row label="Board members invited" value={String(evaluators.length)} />
            <Row label="Committees" value={hasCommittees ? selectedCommittees.join(', ') || 'None selected' : 'No'} />
            <Row label="Share results with CEO" value={shareWithCEO ? 'Yes' : 'No'} last />
          </div>

          <div style={{ background: '#fff7ed', borderRadius: 8, padding: '12px 16px', marginBottom: 24, border: '1px solid #fed7aa' }}>
            <p style={{ margin: 0, fontSize: 13, color: '#9a3412' }}>
              ⚠️ Clicking Launch will immediately send invitation emails to all {evaluators.length} board members.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep('reminders')} style={btnSecondary}>← Back</button>
            <button onClick={launch} disabled={submitting} style={submitting ? btnDisabled : { ...btnPrimary, background: '#0D2C54' }}>
              {submitting ? 'Launching...' : `🚀 Launch Evaluation`}
            </button>
          </div>
        </div>
      )}
    </PageWrap>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: last ? 'none' : '1px solid #e2e8f0' }}>
      <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 13, color: '#1e293b' }}>{value}</span>
    </div>
  );
}

function PageWrap({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 26, color: '#0D2C54', fontFamily: "'DM Serif Display', serif" }}>CEO Evaluation</h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#64748b' }}>Board-led performance evaluation — confidential and aggregated</p>
      </div>
      {children}
    </div>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────
const card: React.CSSProperties = { background: 'white', borderRadius: 12, padding: '28px 32px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,.05)' };
const h2: React.CSSProperties = { margin: '0 0 4px', fontSize: 20, color: '#0D2C54', fontFamily: "'DM Serif Display', serif" };
const subtext: React.CSSProperties = { margin: '0 0 24px', fontSize: 14, color: '#64748b', lineHeight: 1.6 };
const fieldGroup: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: '#374151', letterSpacing: '.03em' };
const inputStyle: React.CSSProperties = { border: '1px solid #e2e8f0', borderRadius: 8, padding: '9px 14px', fontSize: 14, color: '#1e293b', outline: 'none', fontFamily: 'inherit' };
const btnPrimary: React.CSSProperties = { background: '#0097A9', color: 'white', border: 'none', borderRadius: 8, padding: '11px 26px', fontSize: 14, fontWeight: 700, cursor: 'pointer' };
const btnSecondary: React.CSSProperties = { background: 'white', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 8, padding: '11px 22px', fontSize: 14, cursor: 'pointer' };
const btnDisabled: React.CSSProperties = { background: '#e2e8f0', color: '#94a3b8', border: 'none', borderRadius: 8, padding: '11px 26px', fontSize: 14, fontWeight: 700, cursor: 'not-allowed' };
