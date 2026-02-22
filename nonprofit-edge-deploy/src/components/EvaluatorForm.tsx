// src/pages/EvaluatorForm.tsx
// Public page — no login required
// Route: /eval/:token

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const SCALE = [
  { value: 5, label: 'Always' },
  { value: 4, label: 'Usually' },
  { value: 3, label: 'Sometimes' },
  { value: 2, label: 'Rarely' },
  { value: 1, label: 'Never' },
];

const DIMENSIONS = [
  {
    id: 'vision', label: 'Vision & Strategic Direction',
    questions: [
      { id: 'v1', text: 'The CEO articulates a clear and compelling vision for the organization.' },
      { id: 'v2', text: 'The CEO translates vision into actionable strategic priorities.' },
      { id: 'v3', text: 'The CEO maintains mission focus under pressure or changing conditions.' },
      { id: 'v4', text: 'The CEO anticipates trends and opportunities relevant to the mission.' },
      { id: 'v5', text: 'The CEO effectively communicates strategic direction to key stakeholders.' },
    ],
  },
  {
    id: 'board_relations', label: 'Board Relations & Governance',
    questions: [
      { id: 'br1', text: 'The CEO provides the board with timely, accurate, and complete information.' },
      { id: 'br2', text: "The CEO respects the board's governance role and appropriate boundaries." },
      { id: 'br3', text: 'The CEO is responsive and accessible to board members.' },
      { id: 'br4', text: 'The CEO supports and develops board leadership effectively.' },
      { id: 'br5', text: 'The CEO facilitates productive board meetings and discussions.' },
    ],
  },
  {
    id: 'financial_stewardship', label: 'Financial Stewardship',
    questions: [
      { id: 'fs1', text: 'The CEO ensures sound financial management and accountability.' },
      { id: 'fs2', text: 'The CEO keeps the board appropriately informed about financial performance.' },
      { id: 'fs3', text: 'The CEO effectively manages resources to advance the mission.' },
      { id: 'fs4', text: 'The CEO demonstrates a proactive approach to financial sustainability.' },
      { id: 'fs5', text: 'The CEO leads fundraising and revenue development effectively.' },
    ],
  },
  {
    id: 'staff_leadership', label: 'Staff Leadership & Culture',
    questions: [
      { id: 'sl1', text: 'The CEO builds and retains a strong leadership team.' },
      { id: 'sl2', text: 'The CEO fosters a positive and productive organizational culture.' },
      { id: 'sl3', text: 'The CEO develops staff capacity and invests in talent.' },
      { id: 'sl4', text: 'The CEO models the values and culture the organization aspires to.' },
      { id: 'sl5', text: 'The CEO manages organizational change effectively.' },
    ],
  },
  {
    id: 'external_relations', label: 'External Relations & Impact',
    questions: [
      { id: 'er1', text: 'The CEO effectively represents the organization to external stakeholders.' },
      { id: 'er2', text: 'The CEO builds and maintains strong community partnerships.' },
      { id: 'er3', text: "The CEO advances the organization's public profile and brand." },
      { id: 'er4', text: 'The CEO demonstrates measurable impact in the community.' },
      { id: 'er5', text: 'The CEO cultivates relationships with funders and donors effectively.' },
    ],
  },
  {
    id: 'sustainability', label: 'Personal Growth & Sustainability',
    questions: [
      { id: 'pg1', text: 'The CEO demonstrates a commitment to their own professional development.' },
      { id: 'pg2', text: 'The CEO manages their workload in a way that is sustainable long-term.' },
      { id: 'pg3', text: 'The CEO has taken steps to develop succession and leadership continuity.' },
      { id: 'pg4', text: 'The CEO seeks and is receptive to feedback.' },
      { id: 'pg5', text: 'The CEO maintains appropriate work-life balance and models healthy boundaries.' },
    ],
  },
];

const OPEN_QUESTIONS = [
  { id: 'open1', text: 'What does this CEO do exceptionally well that the board should recognize and reinforce?' },
  { id: 'open2', text: 'Where is the greatest opportunity for this CEO to grow or strengthen their leadership?' },
  { id: 'open3', text: 'Is there anything else the board should know as it considers this evaluation?' },
];

export default function EvaluatorForm() {
  const { token } = useParams<{ token: string }>();
  const [evaluator, setEvaluator] = useState<any>(null);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [scores, setScores] = useState<Record<string, number>>({});
  const [openResponses, setOpenResponses] = useState<Record<string, string>>({});
  const [currentDim, setCurrentDim] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      if (!token) { setError('Invalid link.'); setLoading(false); return; }
      const { data, error: err } = await supabase
        .from('ceo_evaluators')
        .select('*, ceo_evaluations(*)')
        .eq('token', token)
        .single();
      if (err || !data) { setError('This link is invalid or has expired. Please contact your board chair.'); setLoading(false); return; }
      if (data.status === 'completed') { setSubmitted(true); setLoading(false); return; }
      setEvaluator(data);
      setEvaluation(data.ceo_evaluations);
      setLoading(false);
    }
    load();
  }, [token]);

  const totalQuestions = DIMENSIONS.reduce((n, d) => n + d.questions.length, 0);
  const answeredQuestions = Object.keys(scores).length;
  const progressPct = Math.round((answeredQuestions / totalQuestions) * 100);
  const currentDimComplete = DIMENSIONS[currentDim]?.questions.every(q => scores[q.id] !== undefined);
  const isLastDim = currentDim === DIMENSIONS.length - 1;
  const allScoresDone = answeredQuestions === totalQuestions;

  async function handleSubmit() {
    if (!allScoresDone) { alert('Please answer all rating questions before submitting.'); return; }
    setSubmitting(true);
    const responses: any[] = [];
    DIMENSIONS.forEach(dim => {
      dim.questions.forEach(q => {
        responses.push({ dimension: dim.id, question_id: q.id, question_text: q.text, score: scores[q.id] });
      });
    });
    OPEN_QUESTIONS.forEach(q => {
      if (openResponses[q.id]) {
        responses.push({ dimension: 'open', question_id: q.id, question_text: q.text, score: null, open_response: openResponses[q.id] });
      }
    });
    try {
      const res = await fetch('/api/submit-evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, responses }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Submission failed'); }
      setSubmitted(true);
    } catch (e: any) {
      alert(`Something went wrong: ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Screen><p style={{ color: '#64748b' }}>Loading your evaluation...</p></Screen>;
  if (error) return <Screen><div style={{ textAlign: 'center', maxWidth: 480 }}><div style={{ fontSize: 36, marginBottom: 16 }}>⚠️</div><h2 style={{ color: '#0D2C54' }}>Link Error</h2><p style={{ color: '#64748b', lineHeight: 1.7 }}>{error}</p></div></Screen>;
  if (submitted) return (
    <Screen>
      <div style={{ background: 'white', borderRadius: 12, padding: 48, maxWidth: 520, textAlign: 'center', border: '1px solid #e2e8f0' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 28 }}>✓</div>
        <h2 style={{ color: '#0D2C54', fontFamily: "'DM Serif Display', serif", fontSize: 24, marginBottom: 12 }}>Evaluation Submitted</h2>
        <p style={{ color: '#475569', lineHeight: 1.7 }}>Thank you for completing the evaluation of <strong>{evaluation?.ceo_name}</strong> at {evaluation?.organization_name}. Your responses are confidential.</p>
      </div>
    </Screen>
  );

  const dim = DIMENSIONS[currentDim];

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ background: '#0D2C54', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>CEO Evaluation — {evaluation?.organization_name}</span>
        <span style={{ color: 'rgba(255,255,255,.45)', fontSize: 12 }}>Confidential</span>
      </div>

      {/* Progress */}
      <div style={{ height: 4, background: '#e2e8f0' }}>
        <div style={{ height: '100%', background: '#0097A9', width: `${progressPct}%`, transition: 'width .3s ease' }} />
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px' }}>

        {/* Intro banner */}
        {currentDim === 0 && answeredQuestions === 0 && (
          <div style={{ background: 'white', borderRadius: 10, padding: '20px 24px', marginBottom: 24, borderLeft: '4px solid #0097A9' }}>
            <p style={{ margin: 0, fontSize: 14, color: '#475569', lineHeight: 1.7 }}>
              Hi <strong style={{ color: '#0D2C54' }}>{evaluator?.name}</strong> — you're evaluating <strong style={{ color: '#0D2C54' }}>{evaluation?.ceo_name}</strong>. Your responses are confidential. Only aggregated results appear in the board report. This takes about 10–15 minutes.
            </p>
          </div>
        )}

        {/* Dimension label */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0097A9', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4 }}>
            Section {currentDim + 1} of {DIMENSIONS.length}
          </div>
          <h2 style={{ margin: 0, fontSize: 20, color: '#0D2C54', fontFamily: "'DM Serif Display', serif" }}>{dim.label}</h2>
        </div>

        {/* Rating questions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {dim.questions.map(q => (
            <div key={q.id} style={{ background: 'white', borderRadius: 10, padding: '18px 22px', border: scores[q.id] ? '1px solid #0097A9' : '1px solid #e2e8f0' }}>
              <p style={{ margin: '0 0 14px', fontSize: 14, color: '#1e293b', lineHeight: 1.65 }}>{q.text}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {SCALE.map(s => (
                  <button key={s.value} onClick={() => setScores(prev => ({ ...prev, [q.id]: s.value }))}
                    style={{
                      padding: '7px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer', transition: 'all .12s',
                      border: scores[q.id] === s.value ? '2px solid #0097A9' : '2px solid #e2e8f0',
                      background: scores[q.id] === s.value ? '#e0f7fa' : 'white',
                      color: scores[q.id] === s.value ? '#0D2C54' : '#64748b',
                      fontWeight: scores[q.id] === s.value ? 700 : 400,
                    }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Open responses on final section */}
        {isLastDim && (
          <div style={{ marginTop: 28 }}>
            <h3 style={{ fontSize: 15, color: '#0D2C54', marginBottom: 14 }}>
              Open Responses <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 400 }}>(optional)</span>
            </h3>
            {OPEN_QUESTIONS.map(q => (
              <div key={q.id} style={{ background: 'white', borderRadius: 10, padding: '18px 22px', border: '1px solid #e2e8f0', marginBottom: 14 }}>
                <p style={{ margin: '0 0 10px', fontSize: 14, color: '#1e293b', lineHeight: 1.65 }}>{q.text}</p>
                <textarea
                  value={openResponses[q.id] || ''}
                  onChange={e => setOpenResponses(prev => ({ ...prev, [q.id]: e.target.value }))}
                  maxLength={500} rows={3}
                  placeholder="Your response (optional)..."
                  style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#1e293b', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
                />
                <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'right' }}>{(openResponses[q.id] || '').length}/500</div>
              </div>
            ))}
          </div>
        )}

        {/* Nav buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28 }}>
          {currentDim > 0
            ? <button onClick={() => setCurrentDim(d => d - 1)} style={{ background: 'white', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 8, padding: '11px 22px', fontSize: 14, cursor: 'pointer' }}>← Previous</button>
            : <div />
          }
          {!isLastDim
            ? <button onClick={() => setCurrentDim(d => d + 1)} disabled={!currentDimComplete}
                style={{ background: currentDimComplete ? '#0097A9' : '#e2e8f0', color: currentDimComplete ? 'white' : '#94a3b8', border: 'none', borderRadius: 8, padding: '11px 26px', fontSize: 14, fontWeight: 700, cursor: currentDimComplete ? 'pointer' : 'not-allowed' }}>
                Next Section →
              </button>
            : <button onClick={handleSubmit} disabled={!allScoresDone || submitting}
                style={{ background: allScoresDone && !submitting ? '#0097A9' : '#e2e8f0', color: allScoresDone && !submitting ? 'white' : '#94a3b8', border: 'none', borderRadius: 8, padding: '11px 26px', fontSize: 14, fontWeight: 700, cursor: allScoresDone && !submitting ? 'pointer' : 'not-allowed' }}>
                {submitting ? 'Submitting...' : 'Submit Evaluation →'}
              </button>
          }
        </div>

        <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', marginTop: 20 }}>
          {answeredQuestions} of {totalQuestions} questions answered · Progress auto-saved
        </p>
      </div>
    </div>
  );
}

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8', padding: 24 }}>
      {children}
    </div>
  );
}
