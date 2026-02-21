// src/components/CEOSelfAssessment.tsx
// CEO fills this out alone — private, reflective, no board involved
// Mirrors the Leadership Assessment flow and the CEO self-assessment report design

import { useState } from 'react';
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

const TIER = (avg: number) => {
  if (avg >= 4.5) return { label: 'Exceptional', color: '#16a34a', bg: '#f0fdf4' };
  if (avg >= 3.75) return { label: 'Strong', color: '#0097A9', bg: '#e8f7f9' };
  if (avg >= 2.75) return { label: 'Good', color: '#2563eb', bg: '#eff6ff' };
  return { label: 'Developing', color: '#d97706', bg: '#fffbeb' };
};

const DIMENSIONS = [
  {
    id: 'vision', label: 'Vision & Strategic Direction',
    icon: '🧭',
    description: 'How clearly you set and communicate direction',
    questions: [
      { id: 'v1', text: 'I articulate a clear and compelling vision that others can rally around.' },
      { id: 'v2', text: 'I translate our big-picture vision into concrete priorities my team can act on.' },
      { id: 'v3', text: 'I keep the organization focused on mission even when there is pressure to drift.' },
      { id: 'v4', text: 'I stay ahead of trends and anticipate what is coming before it arrives.' },
      { id: 'v5', text: 'I communicate direction in a way that motivates and aligns staff, board, and partners.' },
    ],
    reflection: 'What is one strategic priority you have been avoiding or delaying — and why?',
  },
  {
    id: 'board_relations', label: 'Board Relations & Governance',
    icon: '🤝',
    description: 'How you partner with and support your board',
    questions: [
      { id: 'br1', text: 'I keep the board informed with timely, accurate, and complete information.' },
      { id: 'br2', text: 'I respect the board\'s governance role and know where my authority ends.' },
      { id: 'br3', text: 'I am accessible and responsive to board members between meetings.' },
      { id: 'br4', text: 'I actively develop board leadership and support the board chair.' },
      { id: 'br5', text: 'I come to board meetings prepared and help make the time productive.' },
    ],
    reflection: 'Where is your board partnership strongest — and where does it need the most honest attention?',
  },
  {
    id: 'financial_stewardship', label: 'Financial Stewardship',
    icon: '📊',
    description: 'How you manage and grow financial health',
    questions: [
      { id: 'fs1', text: 'I ensure the organization maintains sound financial controls and accountability.' },
      { id: 'fs2', text: 'I keep the board informed about our financial position without overwhelming them.' },
      { id: 'fs3', text: 'I allocate resources in ways that reflect our actual strategic priorities.' },
      { id: 'fs4', text: 'I am proactive about financial sustainability — not reactive when things get tight.' },
      { id: 'fs5', text: 'I lead fundraising and revenue development with confidence and consistency.' },
    ],
    reflection: 'What financial risk or gap are you carrying right now that the board should probably know more about?',
  },
  {
    id: 'staff_leadership', label: 'Staff Leadership & Culture',
    icon: '👥',
    description: 'How you lead, develop, and protect your team',
    questions: [
      { id: 'sl1', text: 'I have built a leadership team I genuinely trust to run things without me.' },
      { id: 'sl2', text: 'The culture of this organization reflects the values I model, not just the ones I talk about.' },
      { id: 'sl3', text: 'I invest in developing my staff — not just managing their performance.' },
      { id: 'sl4', text: 'I address performance issues directly rather than working around them.' },
      { id: 'sl5', text: 'I navigate organizational change in a way that maintains trust and clarity.' },
    ],
    reflection: 'Is there someone on your team whose performance or fit you have been avoiding addressing? What would it take to act?',
  },
  {
    id: 'external_relations', label: 'External Relations & Impact',
    icon: '🌐',
    description: 'How you show up beyond your organization',
    questions: [
      { id: 'er1', text: 'I represent this organization publicly in a way that builds credibility and trust.' },
      { id: 'er2', text: 'I have built meaningful relationships with key community partners and stakeholders.' },
      { id: 'er3', text: 'I actively work to raise the visibility and brand of this organization.' },
      { id: 'er4', text: 'I can point to measurable community impact that reflects our mission.' },
      { id: 'er5', text: 'I cultivate funder and donor relationships consistently — not just when I need money.' },
    ],
    reflection: 'Which external relationship or opportunity are you underinvesting in right now?',
  },
  {
    id: 'sustainability', label: 'Personal Growth & Sustainability',
    icon: '🌱',
    description: 'How you sustain yourself and plan for the future',
    questions: [
      { id: 'pg1', text: 'I am actively investing in my own professional development.' },
      { id: 'pg2', text: 'My pace of work is sustainable — I am not running on empty.' },
      { id: 'pg3', text: 'I have taken concrete steps to build leadership capacity for when I am gone.' },
      { id: 'pg4', text: 'I actively seek feedback and use it — I don\'t just tolerate it.' },
      { id: 'pg5', text: 'I model healthy boundaries for my team, not just preach them.' },
    ],
    reflection: 'If you left tomorrow, how ready would this organization be — and what does that tell you?',
  },
];

const CLOSING = [
  { id: 'close1', text: 'What are you most proud of from this past year that you have not said out loud enough?' },
  { id: 'close2', text: 'What is the one thing you most need from your board right now to do your best work?' },
  { id: 'close3', text: 'What commitment are you willing to make — to yourself — coming out of this reflection?' },
];

type Scores = Record<string, number>;
type Reflections = Record<string, string>;

export default function CEOSelfAssessment({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const [step, setStep] = useState<'intro' | 'assessment' | 'closing' | 'report'>('intro');
  const [currentDim, setCurrentDim] = useState(0);
  const [scores, setScores] = useState<Scores>({});
  const [reflections, setReflections] = useState<Reflections>({});
  const [closing, setClosing] = useState<Reflections>({});
  const [saving, setSaving] = useState(false);

  const totalQ = DIMENSIONS.reduce((n, d) => n + d.questions.length, 0);
  const answered = Object.keys(scores).length;
  const pct = Math.round((answered / totalQ) * 100);
  const dim = DIMENSIONS[currentDim];
  const dimComplete = dim.questions.every(q => scores[q.id] !== undefined);
  const isLast = currentDim === DIMENSIONS.length - 1;
  const allDone = answered === totalQ;

  function dimAvg(dimId: string) {
    const qs = DIMENSIONS.find(d => d.id === dimId)?.questions || [];
    const vals = qs.map(q => scores[q.id]).filter(Boolean);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  }

  async function saveAndShowReport() {
    setSaving(true);
    const dimensionScores: Record<string, number> = {};
    DIMENSIONS.forEach(d => { dimensionScores[d.id] = dimAvg(d.id); });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('ceo_self_assessments').insert({
          ceo_email: user.email,
          ceo_name: user.user_metadata?.full_name || user.email,
          vision_score: dimensionScores.vision,
          board_relations_score: dimensionScores.board_relations,
          financial_stewardship_score: dimensionScores.financial_stewardship,
          staff_leadership_score: dimensionScores.staff_leadership,
          external_relations_score: dimensionScores.external_relations,
          sustainability_score: dimensionScores.sustainability,
          responses: scores,
          challenge_responses: { ...reflections, ...closing },
          status: 'complete',
        });
      }
    } catch (e) {
      console.error('Save error:', e);
    } finally {
      setSaving(false);
      setStep('report');
    }
  }

  // ── INTRO ─────────────────────────────────────────────────────────
  if (step === 'intro') return (
    <Page>
      <div style={card}>
        <div style={{ textAlign: 'center', padding: '8px 0 28px' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🪞</div>
          <h1 style={h1}>CEO Self-Assessment</h1>
          <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.75, maxWidth: 520, margin: '12px auto 0' }}>
            This is a private reflection — no one else sees your responses. Work through six dimensions of your leadership honestly. The goal isn't a perfect score. It's a clearer picture of where you are and what you want to do about it.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 28 }}>
          {[['6 dimensions', 'Vision through sustainability'], ['30 questions', 'Always → Never scale'], ['Private report', 'Yours alone to keep']].map(([h, s]) => (
            <div key={h} style={{ background: '#f8fafc', borderRadius: 10, padding: '16px 18px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0D2C54', marginBottom: 4 }}>{h}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{s}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#eff6ff', borderRadius: 10, padding: '14px 18px', marginBottom: 28, borderLeft: '3px solid #2563eb' }}>
          <p style={{ fontSize: 13, color: '#1e3a8a', lineHeight: 1.65 }}>
            <strong>A note before you start:</strong> The most valuable self-assessments happen when you answer for who you actually are — not who you want to be. Resist the urge to rate yourself based on intent. Rate based on pattern.
          </p>
        </div>

        <button onClick={() => setStep('assessment')} style={{ ...btnPrimary, width: '100%', fontSize: 15, padding: '14px' }}>
          Begin Self-Assessment →
        </button>
      </div>
    </Page>
  );

  // ── ASSESSMENT ────────────────────────────────────────────────────
  if (step === 'assessment') return (
    <Page>
      {/* Progress */}
      <div style={{ height: 4, background: '#e2e8f0', borderRadius: 2, marginBottom: 24 }}>
        <div style={{ height: '100%', background: '#2563eb', width: `${pct}%`, borderRadius: 2, transition: 'width .3s ease' }} />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {DIMENSIONS.map((d, i) => {
          const avg = dimAvg(d.id);
          const done = d.questions.every(q => scores[q.id] !== undefined);
          return (
            <div key={d.id} onClick={() => done || i <= currentDim ? setCurrentDim(i) : null}
              style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, cursor: done || i <= currentDim ? 'pointer' : 'default',
                background: i === currentDim ? '#0D2C54' : done ? '#e8f7f9' : '#f1f5f9',
                color: i === currentDim ? 'white' : done ? '#0097A9' : '#94a3b8',
                border: i === currentDim ? 'none' : done ? '1px solid #0097A9' : '1px solid #e2e8f0' }}>
              {done ? '✓ ' : ''}{d.label.split(' ')[0]}
            </div>
          );
        })}
      </div>

      <div style={card}>
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4 }}>
            {dim.icon} Section {currentDim + 1} of {DIMENSIONS.length}
          </div>
          <h2 style={{ margin: 0, fontSize: 20, color: '#0D2C54', fontFamily: 'Georgia, serif' }}>{dim.label}</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>{dim.description}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
          {dim.questions.map(q => (
            <div key={q.id} style={{ background: '#f8fafc', borderRadius: 10, padding: '16px 20px', border: scores[q.id] ? '1px solid #2563eb' : '1px solid #e2e8f0' }}>
              <p style={{ margin: '0 0 12px', fontSize: 14, color: '#1e293b', lineHeight: 1.65 }}>{q.text}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {SCALE.map(s => (
                  <button key={s.value} onClick={() => setScores(prev => ({ ...prev, [q.id]: s.value }))}
                    style={{ padding: '6px 15px', borderRadius: 8, fontSize: 13, cursor: 'pointer', transition: 'all .12s',
                      border: scores[q.id] === s.value ? '2px solid #2563eb' : '2px solid #e2e8f0',
                      background: scores[q.id] === s.value ? '#eff6ff' : 'white',
                      color: scores[q.id] === s.value ? '#1e3a8a' : '#64748b',
                      fontWeight: scores[q.id] === s.value ? 700 : 400 }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Reflection prompt */}
        <div style={{ background: '#eff6ff', borderRadius: 10, padding: '16px 20px', marginBottom: 24, borderLeft: '3px solid #2563eb' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>Reflection</p>
          <p style={{ fontSize: 14, color: '#1e3a8a', lineHeight: 1.7, marginBottom: 10 }}>{dim.reflection}</p>
          <textarea
            value={reflections[dim.id] || ''}
            onChange={e => setReflections(prev => ({ ...prev, [dim.id]: e.target.value }))}
            rows={3} maxLength={600}
            placeholder="Write honestly — this is for you only..."
            style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #bfdbfe', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#1e293b', resize: 'vertical', fontFamily: 'inherit', background: 'white', lineHeight: 1.6 }}
          />
          <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'right' }}>{(reflections[dim.id] || '').length}/600</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {currentDim > 0
            ? <button onClick={() => setCurrentDim(d => d - 1)} style={btnSecondary}>← Previous</button>
            : <div />}
          {!isLast
            ? <button onClick={() => setCurrentDim(d => d + 1)} disabled={!dimComplete}
                style={{ ...btnPrimary, background: dimComplete ? '#2563eb' : '#e2e8f0', color: dimComplete ? 'white' : '#94a3b8', cursor: dimComplete ? 'pointer' : 'not-allowed' }}>
                Next Section →
              </button>
            : <button onClick={() => setStep('closing')} disabled={!allDone}
                style={{ ...btnPrimary, background: allDone ? '#2563eb' : '#e2e8f0', color: allDone ? 'white' : '#94a3b8', cursor: allDone ? 'pointer' : 'not-allowed' }}>
                Final Reflections →
              </button>
          }
        </div>
      </div>
    </Page>
  );

  // ── CLOSING ───────────────────────────────────────────────────────
  if (step === 'closing') return (
    <Page>
      <div style={card}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4 }}>Final Reflections</div>
          <h2 style={{ margin: 0, fontSize: 20, color: '#0D2C54', fontFamily: 'Georgia, serif' }}>Before You See Your Report</h2>
          <p style={{ margin: '6px 0 0', fontSize: 14, color: '#64748b', lineHeight: 1.65 }}>Three questions. No right answers. Just honest ones.</p>
        </div>

        {CLOSING.map(q => (
          <div key={q.id} style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 14, color: '#1e293b', fontWeight: 600, lineHeight: 1.65, marginBottom: 8 }}>{q.text}</p>
            <textarea
              value={closing[q.id] || ''}
              onChange={e => setClosing(prev => ({ ...prev, [q.id]: e.target.value }))}
              rows={4} maxLength={600}
              placeholder="Take your time with this one..."
              style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#1e293b', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
            />
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <button onClick={() => setStep('assessment')} style={btnSecondary}>← Back</button>
          <button onClick={saveAndShowReport} disabled={saving}
            style={{ ...btnPrimary, background: '#0D2C54', opacity: saving ? .7 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? 'Saving...' : 'View My Report →'}
          </button>
        </div>
      </div>
    </Page>
  );

  // ── REPORT ────────────────────────────────────────────────────────
  const dimResults = DIMENSIONS.map(d => {
    const avg = dimAvg(d.id);
    const tier = TIER(avg);
    return { ...d, avg, tier };
  });

  const overallAvg = dimResults.reduce((s, d) => s + d.avg, 0) / dimResults.length;
  const overallTier = TIER(overallAvg);
  const strongest = [...dimResults].sort((a, b) => b.avg - a.avg)[0];
  const developing = [...dimResults].sort((a, b) => a.avg - b.avg)[0];

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px 80px', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Toolbar */}
      <div style={{ background: 'white', borderRadius: 10, padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 13, letterSpacing: '.1em', textTransform: 'uppercase', color: '#0D2C54' }}>The Nonprofit Edge</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '3px 10px', borderRadius: 20, border: '1px solid #bfdbfe' }}>CEO Self-Assessment</span>
        </div>
        <button onClick={() => window.print()} style={{ ...btnSecondary, fontSize: 12, padding: '7px 16px' }}>⬇ Save Report</button>
      </div>

      {/* Cover */}
      <div style={{ background: '#0D2C54', borderRadius: 12, padding: '48px 56px 44px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(0,151,169,.12)' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(37,99,235,.08)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0097A9', letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 14 }}>Private · Confidential</div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 34, color: 'white', lineHeight: 1.2, marginBottom: 10 }}>CEO Self-Assessment</h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.6)', marginBottom: 40 }}>A private reflection on your leadership</p>

          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ background: 'rgba(255,255,255,.08)', borderRadius: 10, padding: '16px 24px', border: '1px solid rgba(255,255,255,.12)', flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Overall Profile</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: overallTier.color }}>{overallTier.label}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,.08)', borderRadius: 10, padding: '16px 24px', border: '1px solid rgba(255,255,255,.12)', flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Top Dimension</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{strongest.label}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,.08)', borderRadius: 10, padding: '16px 24px', border: '1px solid rgba(255,255,255,.12)', flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Focus Area</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{developing.label}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dimension Scores */}
      <div style={{ background: 'white', borderRadius: 12, padding: '32px 36px', marginBottom: 20, border: '1px solid #e2e8f0' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#0D2C54', marginBottom: 6 }}>Your Leadership Profile</h2>
        <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>Six dimensions of your performance as you see it.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {dimResults.map(d => (
            <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 200, fontSize: 13, fontWeight: 600, color: '#1e293b', flexShrink: 0 }}>{d.icon} {d.label}</div>
              <div style={{ flex: 1, height: 10, background: '#f1f5f9', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(d.avg / 5) * 100}%`, background: d.tier.color, borderRadius: 5, transition: 'width 1s ease' }} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: d.tier.color, background: d.tier.bg, padding: '3px 12px', borderRadius: 20, flexShrink: 0, minWidth: 90, textAlign: 'center' }}>
                {d.tier.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dimension deep-dives */}
      {dimResults.map(d => (
        <div key={d.id} style={{ background: 'white', borderRadius: 12, padding: '28px 36px', marginBottom: 16, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>{d.icon} {d.label}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: d.tier.color, background: d.tier.bg, padding: '2px 10px', borderRadius: 20, display: 'inline-block' }}>{d.tier.label}</div>
            </div>
          </div>

          {/* Per-question breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: reflections[d.id] ? 20 : 0 }}>
            {d.questions.map(q => {
              const s = scores[q.id] || 0;
              const scaleItem = SCALE.find(sc => sc.value === s);
              return (
                <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1, fontSize: 13, color: '#475569', lineHeight: 1.5 }}>{q.text}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', flexShrink: 0, minWidth: 64, textAlign: 'right' }}>{scaleItem?.label || '—'}</div>
                  <div style={{ width: 80, height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden', flexShrink: 0 }}>
                    <div style={{ height: '100%', width: `${(s / 5) * 100}%`, background: d.tier.color, borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reflection */}
          {reflections[d.id] && (
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: '14px 18px', borderLeft: '3px solid #2563eb' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Your Reflection</div>
              <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7, fontStyle: 'italic' }}>"{reflections[d.id]}"</p>
            </div>
          )}
        </div>
      ))}

      {/* Closing reflections */}
      {CLOSING.some(q => closing[q.id]) && (
        <div style={{ background: 'white', borderRadius: 12, padding: '32px 36px', marginBottom: 20, border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#0D2C54', marginBottom: 20 }}>Your Commitments</h2>
          {CLOSING.map(q => closing[q.id] ? (
            <div key={q.id} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>{q.text}</p>
              <p style={{ fontSize: 14, color: '#1e293b', lineHeight: 1.7, fontStyle: 'italic' }}>"{closing[q.id]}"</p>
            </div>
          ) : null)}
        </div>
      )}

      {/* Footer */}
      <div style={{ background: '#0D2C54', borderRadius: 12, padding: '24px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 12 }}>
          The Nonprofit Edge · CEO Self-Assessment · Private & Confidential
        </div>
        <button onClick={() => setStep('intro')} style={{ background: 'rgba(255,255,255,.1)', color: 'white', border: '1px solid rgba(255,255,255,.2)', borderRadius: 8, padding: '8px 18px', fontSize: 13, cursor: 'pointer' }}>
          Retake Assessment
        </button>
      </div>
    </div>
  );
}

// ── Layout & Styles ───────────────────────────────────────────────────
function Page({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px 80px', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 26, color: '#0D2C54', fontFamily: 'Georgia, serif' }}>CEO Self-Assessment</h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#64748b' }}>Private reflection on your leadership — for your eyes only</p>
      </div>
      {children}
    </div>
  );
}

const card: React.CSSProperties = { background: 'white', borderRadius: 12, padding: '28px 32px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,.05)' };
const h1: React.CSSProperties = { margin: 0, fontSize: 24, color: '#0D2C54', fontFamily: 'Georgia, serif' };
const btnPrimary: React.CSSProperties = { background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, padding: '11px 26px', fontSize: 14, fontWeight: 700, cursor: 'pointer' };
const btnSecondary: React.CSSProperties = { background: 'white', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 8, padding: '11px 22px', fontSize: 14, cursor: 'pointer' };
