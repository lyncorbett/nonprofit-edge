// src/components/CEOSelfRating.tsx
// CEO self-rating within the board-led evaluation — token-based, no login required
// Route: /ceo-self-rating/[token]
// Uses Set 2 closing questions — distinct from independent self-assessment

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const BRAND = {
  navy:  '#0D2C54',
  teal:  '#0097A9',
  accent:'#E8A838',
  bg:    '#F0F4F8',
  muted: '#64748b',
  border:'#e2e8f0',
};

const FONT = "'DM Sans', Arial, sans-serif";

const SCALE = [
  { value: 5, label: 'Always' },
  { value: 4, label: 'Usually' },
  { value: 3, label: 'Sometimes' },
  { value: 2, label: 'Rarely' },
  { value: 1, label: 'Never' },
];

// Same 7 dimensions as board evaluation — first person lens
const DIMENSIONS = [
  {
    id: 'vision',
    label: 'Vision & Strategic Direction',
    icon: '🧭',
    description: 'How clearly you set direction — and whether the organization can follow it',
    questions: [
      { id: 'v1', text: 'I articulate a clear and compelling vision that staff, board, and partners can rally around.' },
      { id: 'v2', text: 'I translate big-picture vision into concrete priorities the organization can actually act on.' },
      { id: 'v3', text: 'When pressure builds to drift from the mission — new funding, outside demands, shiny opportunities — I hold the line.' },
      { id: 'v4', text: 'I stay ahead of trends and shifts in the field. I am rarely caught off guard.' },
      { id: 'v5', text: 'I communicate direction in a way that creates alignment, not just awareness.' },
    ],
  },
  {
    id: 'board_relations',
    label: 'Board Relations & Governance',
    icon: '🤝',
    description: 'How you partner with and support the board',
    questions: [
      { id: 'br1', text: 'I give the board complete, timely, and honest information — they are not surprised by things they should have known.' },
      { id: 'br2', text: 'I respect the board\'s governance role. I know where my authority ends and don\'t overstep it.' },
      { id: 'br3', text: 'I am accessible and responsive between board meetings — not just present during them.' },
      { id: 'br4', text: 'I actively support the board\'s effectiveness — not just my own agenda in the room.' },
      { id: 'br5', text: 'Board meetings are a productive use of everyone\'s time. I plan the agenda with the board chair and help us focus on what matters.' },
    ],
  },
  {
    id: 'financial_stewardship',
    label: 'Financial Stewardship',
    icon: '📊',
    description: 'How you manage and grow the organization\'s financial health',
    questions: [
      { id: 'fs1', text: 'Our financial controls and accountability practices are sound — I don\'t have to wonder if the basics are covered.' },
      { id: 'fs2', text: 'I keep the board appropriately informed about the organization\'s financial position — the real picture, not the polished one.' },
      { id: 'fs3', text: 'How the organization spends money actually reflects its stated priorities.' },
      { id: 'fs4', text: 'I am proactive about financial sustainability — not reactive when things get tight.' },
      { id: 'fs5', text: 'I lead fundraising and revenue development consistently — not just when there\'s a budget gap.' },
    ],
  },
  {
    id: 'staff_leadership',
    label: 'Staff Leadership & Culture',
    icon: '👥',
    description: 'How you lead, develop, and show up for the team',
    questions: [
      { id: 'sl1', text: 'I have built a leadership team that can operate effectively. I am not the only one holding things together.' },
      { id: 'sl2', text: 'The organizational culture reflects the values I model, not just the ones I talk about.' },
      { id: 'sl3', text: 'I invest in developing staff — not just managing their performance.' },
      { id: 'sl4', text: 'When performance issues arise, I address them directly rather than working around them.' },
      { id: 'sl5', text: 'Staff trust me. There is evidence of genuine morale and engagement, not just compliance.' },
    ],
  },
  {
    id: 'external_relations',
    label: 'External Relations & Community Impact',
    icon: '🌐',
    description: 'How you show up beyond the organization — and whether it translates to real impact',
    questions: [
      { id: 'er1', text: 'I represent this organization publicly in a way that builds genuine credibility — not just visibility.' },
      { id: 'er2', text: 'I have built meaningful relationships with the partners, funders, and community leaders who matter most to this mission.' },
      { id: 'er3', text: 'I can point to measurable impact — not just activity — that reflects what this organization set out to do.' },
      { id: 'er4', text: 'The communities this organization serves have a real voice in its direction. This isn\'t token representation — it\'s actual practice.' },
      { id: 'er5', text: 'I cultivate funder and donor relationships consistently — not just when the budget needs it.' },
    ],
  },
  {
    id: 'decisions',
    label: 'Decision-Making & Accountability',
    icon: '⚖️',
    description: 'How you make decisions, own them, and create a culture of accountability',
    questions: [
      { id: 'd1', text: 'I bring the right people into important decisions — not too many, not too few.' },
      { id: 'd2', text: 'When I make a call that turns out to be wrong, I say so. I don\'t reframe it or move on quietly.' },
      { id: 'd3', text: 'I make decisions at the right pace — I don\'t let urgency replace clarity or avoid hard calls by waiting.' },
      { id: 'd4', text: 'I hold my team accountable in the same way I expect to be held accountable — clearly, directly, and without it becoming personal.' },
      { id: 'd5', text: 'I build organizational resilience — this organization could absorb a significant challenge without everything depending on me.' },
    ],
  },
  {
    id: 'sustainability',
    label: 'Personal Effectiveness & Sustainability',
    icon: '🌱',
    description: 'How you sustain yourself and prepare the organization for the future',
    questions: [
      { id: 'pg1', text: 'My pace of work is sustainable. I am not running on fumes and calling it leadership.' },
      { id: 'pg2', text: 'I actively invest in my own growth — I am not coasting on what I already know how to do.' },
      { id: 'pg3', text: 'I model the boundaries and work practices I want to see in my team — I don\'t just preach them.' },
      { id: 'pg4', text: 'I seek and use honest feedback. I don\'t just tolerate it.' },
      { id: 'pg5', text: 'If I left tomorrow, the organization would be in a position to continue. I have built for what comes after me.' },
    ],
  },
];

// Set 2 — CEO closing questions for board-led evaluation
const CEO_CLOSING = [
  { id: 'cc1', text: 'What do you believe are your greatest contributions to this organization over the past year?' },
  { id: 'cc2', text: 'Where do you most want to grow as a leader in the year ahead?' },
  { id: 'cc3', text: 'What do you most need from your board to do your best work?' },
];

type Scores = Record<string, number>;
type Reflections = Record<string, string>;

type EvalData = {
  id: string;
  ceo_name: string;
  organization_name: string;
  deadline: string;
  ceo_self_rating_complete: boolean;
};

export default function CEOSelfRating({ token }: { token: string }) {
  const [loading, setLoading] = useState(true);
  const [evalData, setEvalData] = useState<EvalData | null>(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'intro' | 'assessment' | 'closing' | 'done'>('intro');
  const [currentDim, setCurrentDim] = useState(0);
  const [scores, setScores] = useState<Scores>({});
  const [closing, setClosing] = useState<Reflections>({});
  const [submitting, setSubmitting] = useState(false);

  const totalQ = DIMENSIONS.reduce((n, d) => n + d.questions.length, 0);
  const answered = Object.keys(scores).length;
  const pct = Math.round((answered / totalQ) * 100);
  const dim = DIMENSIONS[currentDim];
  const dimComplete = dim?.questions.every(q => scores[q.id] !== undefined);
  const isLast = currentDim === DIMENSIONS.length - 1;
  const allDone = answered === totalQ;

  useEffect(() => {
    async function loadToken() {
      try {
        const { data, error } = await supabase
          .from('ceo_evaluations')
          .select('id, ceo_name, organization_name, deadline, ceo_self_rating_complete')
          .eq('ceo_token', token)
          .single();

        if (error || !data) {
          setError('This link is invalid or has expired.');
          setLoading(false);
          return;
        }

        setEvalData({
          id: data.id,
          ceo_name: data.ceo_name,
          organization_name: data.organization_name,
          deadline: data.deadline ? new Date(data.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '',
          ceo_self_rating_complete: data.ceo_self_rating_complete,
        });
        setLoading(false);
      } catch (e) {
        setError('Something went wrong loading your self-rating.');
        setLoading(false);
      }
    }
    loadToken();
  }, [token]);

  async function submit() {
    if (!evalData) return;
    setSubmitting(true);
    try {
      await supabase.from('ceo_self_ratings').insert({
        evaluation_id: evalData.id,
        scores,
        closing_responses: closing,
        submitted_at: new Date().toISOString(),
      });
      await supabase
        .from('ceo_evaluations')
        .update({ ceo_self_rating_complete: true })
        .eq('id', evalData.id);
      setStep('done');
    } catch (e) {
      console.error('Submit error:', e);
    } finally {
      setSubmitting(false);
    }
  }

  // ── LOADING ──────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BRAND.bg, fontFamily: FONT }}>
      <div style={{ color: BRAND.muted, fontSize: 15 }}>Loading your self-rating...</div>
    </div>
  );

  // ── ERROR ────────────────────────────────────────────────────────
  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BRAND.bg, fontFamily: FONT, padding: 24 }}>
      <div style={{ background: 'white', borderRadius: 14, padding: '40px', maxWidth: 480, textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>⚠️</div>
        <h2 style={{ color: BRAND.navy, fontFamily: 'Georgia, serif', margin: '0 0 12px' }}>Link Not Found</h2>
        <p style={{ color: BRAND.muted, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{error}</p>
      </div>
    </div>
  );

  // ── ALREADY COMPLETED ────────────────────────────────────────────
  if (evalData?.ceo_self_rating_complete && step !== 'done') return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BRAND.bg, fontFamily: FONT, padding: 24 }}>
      <div style={{ background: 'white', borderRadius: 14, padding: '40px', maxWidth: 480, textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>✅</div>
        <h2 style={{ color: BRAND.navy, fontFamily: 'Georgia, serif', margin: '0 0 12px' }}>Already Submitted</h2>
        <p style={{ color: BRAND.muted, fontSize: 14, lineHeight: 1.7, margin: 0 }}>You have already completed your self-rating for this evaluation cycle.</p>
      </div>
    </div>
  );

  // ── DONE ─────────────────────────────────────────────────────────
  if (step === 'done') return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BRAND.bg, fontFamily: FONT, padding: 24 }}>
      <div style={{ background: 'white', borderRadius: 16, padding: '48px 40px', maxWidth: 520, textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,.08)' }}>
        <div style={{ width: 64, height: 64, background: `${BRAND.teal}15`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28 }}>✓</div>
        <h2 style={{ color: BRAND.navy, fontFamily: 'Georgia, serif', fontSize: 24, margin: '0 0 12px' }}>Self-Rating Submitted</h2>
        <p style={{ color: BRAND.muted, fontSize: 15, lineHeight: 1.75, margin: '0 0 24px' }}>
          Your self-rating has been recorded. Once the board evaluation is complete, your scores will be compared side by side with the board's aggregated results.
        </p>
        <div style={{ background: BRAND.bg, borderRadius: 10, padding: '16px 20px', fontSize: 13, color: BRAND.muted, lineHeight: 1.6 }}>
          The gap between how you see yourself and how the board sees you is often the most useful data in this whole process — in either direction.
        </div>
      </div>
    </div>
  );

  // ── INTRO ────────────────────────────────────────────────────────
  if (step === 'intro') return (
    <div style={{ maxWidth: 660, margin: '0 auto', padding: '40px 24px 80px', fontFamily: FONT }}>
      <div style={{ background: BRAND.navy, borderRadius: 14, padding: '36px 40px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: `${BRAND.teal}18` }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: BRAND.teal, letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 10 }}>The Nonprofit Edge · CEO Self-Rating</div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 26, color: 'white', margin: '0 0 8px' }}>Your Self-Rating</h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.7)', margin: '0 0 20px', lineHeight: 1.6 }}>
            {evalData?.organization_name} · Board-Led Evaluation
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              ['35 questions', '7 dimensions'],
              ['~15 minutes', 'First-person lens'],
              ['Side-by-side', 'Compared with board scores'],
            ].map(([h, s]) => (
              <div key={h} style={{ background: 'rgba(255,255,255,.08)', borderRadius: 8, padding: '10px 16px', border: '1px solid rgba(255,255,255,.12)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>{h}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)' }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 14, padding: '28px 32px', marginBottom: 16, border: `1px solid ${BRAND.border}` }}>
        <p style={{ fontSize: 15, color: '#1e293b', lineHeight: 1.75, margin: '0 0 16px' }}>
          Hi {evalData?.ceo_name?.split(' ')[0]},
        </p>
        <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.75, margin: '0 0 16px' }}>
          You'll rate yourself across the same seven dimensions the board is evaluating. Your responses are private — they won't be shared with the board directly. What gets shared is the side-by-side comparison: where you and the board align, and where the gaps are.
        </p>
        <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.75, margin: '0 0 24px' }}>
          {evalData?.deadline && <span>Please complete this by <strong style={{ color: BRAND.navy }}>{evalData.deadline}</strong>.</span>}
        </p>
        <div style={{ background: `${BRAND.navy}06`, borderRadius: 10, padding: '14px 18px', borderLeft: `3px solid ${BRAND.navy}`, marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: BRAND.navy, lineHeight: 1.65, margin: 0 }}>
            <strong>Rate based on pattern, not intent.</strong> The most useful self-ratings happen when you answer for who you actually are — not who you're working toward being.
          </p>
        </div>
        <button onClick={() => setStep('assessment')} style={{ width: '100%', background: BRAND.navy, color: 'white', border: 'none', borderRadius: 10, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>
          Begin Self-Rating →
        </button>
      </div>
    </div>
  );

  // ── ASSESSMENT ───────────────────────────────────────────────────
  if (step === 'assessment') return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 24px 80px', fontFamily: FONT }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: BRAND.navy, letterSpacing: '.1em', textTransform: 'uppercase' }}>Self-Rating · {evalData?.organization_name}</div>
        <div style={{ marginLeft: 'auto', fontSize: 12, color: BRAND.muted }}>{pct}% complete</div>
      </div>
      <div style={{ height: 5, background: BRAND.border, borderRadius: 3, marginBottom: 20 }}>
        <div style={{ height: '100%', background: BRAND.teal, width: `${pct}%`, borderRadius: 3, transition: 'width .3s' }} />
      </div>

      <div style={{ display: 'flex', gap: 7, marginBottom: 20, flexWrap: 'wrap' }}>
        {DIMENSIONS.map((d, i) => {
          const done = d.questions.every(q => scores[q.id] !== undefined);
          return (
            <div key={d.id} onClick={() => (done || i <= currentDim) ? setCurrentDim(i) : null}
              style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20,
                cursor: done || i <= currentDim ? 'pointer' : 'default',
                background: i === currentDim ? BRAND.navy : done ? `${BRAND.teal}18` : BRAND.bg,
                color: i === currentDim ? 'white' : done ? BRAND.teal : '#94a3b8',
                border: `1px solid ${i === currentDim ? BRAND.navy : done ? BRAND.teal : BRAND.border}` }}>
              {done ? '✓ ' : ''}{d.label.split(' ')[0]}
            </div>
          );
        })}
      </div>

      <div style={{ background: 'white', borderRadius: 14, padding: '28px 32px', border: `1px solid ${BRAND.border}`, boxShadow: '0 1px 6px rgba(0,0,0,.04)' }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: BRAND.teal, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4 }}>
            {dim.icon} Section {currentDim + 1} of {DIMENSIONS.length}
          </div>
          <h2 style={{ margin: '0 0 4px', fontSize: 20, color: BRAND.navy, fontFamily: 'Georgia, serif' }}>{dim.label}</h2>
          <p style={{ margin: 0, fontSize: 13, color: BRAND.muted }}>{dim.description}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          {dim.questions.map(q => (
            <div key={q.id} style={{ background: BRAND.bg, borderRadius: 10, padding: '16px 18px', border: `1px solid ${scores[q.id] ? BRAND.teal : BRAND.border}` }}>
              <p style={{ margin: '0 0 12px', fontSize: 14, color: '#1e293b', lineHeight: 1.65 }}>{q.text}</p>
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                {SCALE.map(s => (
                  <button key={s.value} onClick={() => setScores(prev => ({ ...prev, [q.id]: s.value }))}
                    style={{ padding: '6px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: FONT,
                      border: `2px solid ${scores[q.id] === s.value ? BRAND.teal : BRAND.border}`,
                      background: scores[q.id] === s.value ? `${BRAND.teal}15` : 'white',
                      color: scores[q.id] === s.value ? BRAND.navy : BRAND.muted,
                      fontWeight: scores[q.id] === s.value ? 700 : 400 }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {currentDim > 0
            ? <button onClick={() => setCurrentDim(d => d - 1)} style={{ background: 'white', color: BRAND.muted, border: `1px solid ${BRAND.border}`, borderRadius: 8, padding: '10px 20px', fontSize: 14, cursor: 'pointer', fontFamily: FONT }}>← Previous</button>
            : <div />}
          {!isLast
            ? <button onClick={() => setCurrentDim(d => d + 1)} disabled={!dimComplete}
                style={{ background: dimComplete ? BRAND.teal : BRAND.border, color: dimComplete ? 'white' : '#94a3b8', border: 'none', borderRadius: 8, padding: '10px 22px', fontSize: 14, fontWeight: 700, cursor: dimComplete ? 'pointer' : 'not-allowed', fontFamily: FONT }}>
                Next Section →
              </button>
            : <button onClick={() => setStep('closing')} disabled={!allDone}
                style={{ background: allDone ? BRAND.navy : BRAND.border, color: allDone ? 'white' : '#94a3b8', border: 'none', borderRadius: 8, padding: '10px 22px', fontSize: 14, fontWeight: 700, cursor: allDone ? 'pointer' : 'not-allowed', fontFamily: FONT }}>
                Final Questions →
              </button>}
        </div>
      </div>
    </div>
  );

  // ── CLOSING ──────────────────────────────────────────────────────
  if (step === 'closing') return (
    <div style={{ maxWidth: 660, margin: '0 auto', padding: '32px 24px 80px', fontFamily: FONT }}>
      <div style={{ background: 'white', borderRadius: 14, padding: '32px', border: `1px solid ${BRAND.border}` }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: BRAND.teal, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4 }}>Final Questions</div>
          <h2 style={{ margin: '0 0 6px', fontSize: 22, color: BRAND.navy, fontFamily: 'Georgia, serif' }}>Three Reflections</h2>
          <p style={{ margin: 0, fontSize: 14, color: BRAND.muted, lineHeight: 1.65 }}>Your answers here are private — they inform the final report but are not shared verbatim with the board.</p>
        </div>

        {CEO_CLOSING.map((q, i) => (
          <div key={q.id} style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', lineHeight: 1.65, marginBottom: 8 }}>
              <span style={{ color: BRAND.teal, fontWeight: 700, marginRight: 8 }}>{i + 1}.</span>{q.text}
            </p>
            <textarea
              value={closing[q.id] || ''}
              onChange={e => setClosing(prev => ({ ...prev, [q.id]: e.target.value }))}
              rows={4} maxLength={800}
              placeholder="Be honest — this is for your growth, not for evaluation..."
              style={{ width: '100%', boxSizing: 'border-box', border: `1px solid ${BRAND.border}`, borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#1e293b', resize: 'vertical', fontFamily: FONT, lineHeight: 1.6, outline: 'none' }}
            />
            <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'right' }}>{(closing[q.id] || '').length}/800</div>
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <button onClick={() => setStep('assessment')} style={{ background: 'white', color: BRAND.muted, border: `1px solid ${BRAND.border}`, borderRadius: 8, padding: '10px 20px', fontSize: 14, cursor: 'pointer', fontFamily: FONT }}>← Back</button>
          <button onClick={submit} disabled={submitting}
            style={{ background: submitting ? BRAND.border : BRAND.navy, color: submitting ? '#94a3b8' : 'white', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: FONT }}>
            {submitting ? 'Submitting...' : 'Submit Self-Rating →'}
          </button>
        </div>
      </div>
    </div>
  );

  return null;
}
