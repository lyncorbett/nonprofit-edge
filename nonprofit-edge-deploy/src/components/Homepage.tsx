/**
 * THE NONPROFIT EDGE - Homepage (Editable)
 * Public landing page with admin editing capability
 */

import React, { useState, useEffect } from 'react';

const NAVY = '#1a365d';
const TEAL = '#0097a7';
const TEAL_DARK = '#00838f';
const TEAL_LIGHT = '#5eead4';

interface HomepageProps {
  onNavigate: (page: string) => void;
  isAdmin?: boolean;
  supabase?: any;
}

const DEFAULT_CONTENT: Record<string, any> = {
  hero: {
    headline: "Your Mission Deserves More Than Hope—",
    headlineAccent: "It Needs an Edge.",
    subheadline: "Discover the strategic tools top nonprofit leaders use to unlock clarity, funding, and impact.",
    ctaPrimary: "Start Your Free Trial",
    ctaSecondary: "► See How It Works"
  },
  trustBar: {
    label: "Trusted By",
    logos: ["Salvation Army", "YMCA", "American Red Cross", "San Diego Zoo"]
  },
  tools: {
    headline: "Stop Guessing. Start Knowing.",
    subheadline: "Professional tools that transform how nonprofits lead and govern",
    items: [
      { title: "Strategic Plan Analysis", desc: "Diagnose your current plan in minutes with scores & specific fixes.", link: "strategic-checkup" },
      { title: "Grant Review", desc: "Win more grants with expert scoring, comments, and funder-ready polish.", link: "grant-review" },
      { title: "Strategy & Scenario Planning", desc: "Stress-test strategy with clear \"what-if\" scenarios before risks hit.", link: "scenario-planner" },
      { title: "CEO Evaluation", desc: "Build stronger leadership with fair, confidential performance reviews.", link: "ceo-evaluation" },
      { title: "Board Assessment", desc: "Strengthen governance with measurable board practices & next steps.", link: "board-assessment" },
      { title: "Member Resources", desc: "Access templates, guides, and trainings—new tools added each month.", link: "library" }
    ]
  },
  professor: {
    headline: "Ask the Professor",
    subheadline: "Strategic guidance built on 25+ years of real-world experience",
    description: "It's like having an expert consultant in your back pocket. Get expert-level strategic advice, available 24/7. Trained on Dr. Lyn Corbett's decades of nonprofit consulting — not generic AI.",
    badge: "Over 25 Years of Nonprofit Experience",
    questionsLabel: "Questions Leaders Are Asking:",
    questions: [
      "\"How do I transition my board from operational to strategic?\"",
      "\"Should we accept this major restricted gift?\"",
      "\"What's the best approach to a difficult ED/Board Chair relationship?\""
    ],
    cta: "Ask Your First Question — Free"
  },
  assessment: {
    badge: "Free Assessment",
    headline: "Every nonprofit has ONE constraint holding them back. What's yours?",
    subheadline: "Find out in 3 minutes — no login required.",
    cta: "Take the Assessment →"
  },
  pricing: {
    headline: "Simple, Transparent Pricing",
    subheadline: "Start free. Upgrade when you're ready. Cancel anytime.",
    note: "* Founding Member Rate: Lock in these rates forever. When we raise prices (and we will), your rate stays the same as long as you remain a member.",
    plans: [
      { name: "Essential", price: "$79", period: "/mo", label: "Founding Member Rate", features: ["1 person", "10 assessments/month", "100 Ask the Professor/month", "Full Resource Library"], featured: false },
      { name: "Professional", price: "$159", period: "/mo", label: "Founding Member Rate", features: ["Up to 5 team members", "25 assessments/month", "Unlimited Ask the Professor", "Full Resource Library"], featured: true },
      { name: "Premium", price: "$329", period: "/mo", label: "Founding Member Rate", features: ["Everything in Professional", "Up to 10 team members", "Unlimited assessments", "Monthly coaching call"], featured: false },
      { name: "Enterprise", price: "Let's Talk", period: "", label: "Custom solutions", features: ["Everything in Premium", "Unlimited users", "Custom integrations", "Dedicated success manager"], featured: false, isEnterprise: true }
    ]
  },
  faq: {
    headline: "Frequently Asked Questions",
    items: [
      { q: "What is The Nonprofit Edge?" },
      { q: "What is \"Ask the Professor\"?" },
      { q: "What is the Theory of Constraints?" },
      { q: "Can I run unlimited assessments?" },
      { q: "How long does an assessment take?" }
    ]
  },
  footer: {
    tagline: "Where bold missions meet modern strategy. Smart AI tools, practical templates, and decades of leadership experience — your unfair advantage.",
    copyright: "© 2026 The Nonprofit Edge. All rights reserved."
  }
};

const Homepage: React.FC<HomepageProps> = ({ onNavigate, isAdmin = false, supabase }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [content, setContent] = useState<Record<string, any>>(DEFAULT_CONTENT);
  const [originalContent, setOriginalContent] = useState<Record<string, any>>(DEFAULT_CONTENT);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    if (supabase) loadContent();
  }, [supabase]);

  const loadContent = async () => {
    if (!supabase) return;
    try {
      const { data } = await supabase.from('homepage_content').select('*');
      if (data && data.length > 0) {
        const loadedContent = { ...DEFAULT_CONTENT };
        data.forEach((item: any) => { loadedContent[item.section] = item.content; });
        setContent(loadedContent);
        setOriginalContent(loadedContent);
      }
    } catch (err) { console.error('Error loading content:', err); }
  };

  const saveSection = async (section: string) => {
    if (!supabase) {
      setOriginalContent({ ...content });
      setEditingSection(null);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
      return;
    }
    setSaveStatus('saving');
    try {
      await supabase.from('homepage_content').upsert({ section, content: content[section], updated_at: new Date().toISOString() }, { onConflict: 'section' });
      setOriginalContent({ ...content });
      setEditingSection(null);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const cancelEdit = (section: string) => {
    setContent({ ...content, [section]: originalContent[section] });
    setEditingSection(null);
  };

  const updateContent = (section: string, key: string, value: any) => {
    setContent({ ...content, [section]: { ...content[section], [key]: value } });
  };

  const handleNavClick = (page: string) => {
    setMobileMenuOpen(false);
    onNavigate(page);
  };

  const isEditing = (section: string) => editingSection === section;

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", color: '#1e293b' }}>
      {/* Admin Edit Toggle */}
      {isAdmin && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999, background: NAVY, padding: '12px 20px', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>Edit Mode:</span>
          <label style={{ position: 'relative', display: 'inline-block', width: 50, height: 26, cursor: 'pointer' }}>
            <input type="checkbox" checked={editMode} onChange={(e) => { setEditMode(e.target.checked); if (!e.target.checked) setEditingSection(null); }} style={{ opacity: 0, width: 0, height: 0 }} />
            <span style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: editMode ? TEAL : '#475569', borderRadius: 26, transition: '0.3s' }} />
            <span style={{ position: 'absolute', height: 20, width: 20, left: editMode ? 27 : 3, bottom: 3, background: 'white', borderRadius: '50%', transition: '0.3s' }} />
          </label>
          {saveStatus === 'saving' && <span style={{ color: '#fbbf24', fontSize: 12 }}>Saving...</span>}
          {saveStatus === 'saved' && <span style={{ color: '#4ade80', fontSize: 12 }}>✓ Saved</span>}
          {saveStatus === 'error' && <span style={{ color: '#f87171', fontSize: 12 }}>Error</span>}
        </div>
      )}

      {/* Navigation */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', zIndex: 1000, borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }} style={{ fontSize: '1.25rem', fontWeight: 800, color: NAVY, textDecoration: 'none' }}>
            The Nonprofit <span style={{ color: TEAL }}>Edge</span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="nav-desktop">
            <a href="#tools" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.9375rem', fontWeight: 500 }}>Our Tools</a>
            <a href="#pricing" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.9375rem', fontWeight: 500 }}>Pricing</a>
            <button onClick={() => handleNavClick('signin')} style={{ background: NAVY, color: 'white', padding: '0.625rem 1.25rem', borderRadius: 8, fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: '0.9375rem' }}>
              Member Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '8rem 2rem 4rem', background: '#f8fafc', position: 'relative' }}>
        {editMode && (
          <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 100 }}>
            {isEditing('hero') ? (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => saveSection('hero')} style={{ padding: '0.5rem 1rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>✓ Save</button>
                <button onClick={() => cancelEdit('hero')} style={{ padding: '0.5rem 1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>✕ Cancel</button>
              </div>
            ) : (
              <button onClick={() => setEditingSection('hero')} style={{ padding: '0.5rem 1rem', background: NAVY, color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>✏️ Edit Hero</button>
            )}
          </div>
        )}
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '3.25rem', fontWeight: 800, lineHeight: 1.15, color: NAVY, marginBottom: '1.5rem' }}>
              {isEditing('hero') ? (
                <input type="text" value={content.hero.headline} onChange={(e) => updateContent('hero', 'headline', e.target.value)} style={{ width: '100%', fontSize: '3.25rem', fontWeight: 800, color: NAVY, border: '2px dashed #0097a7', borderRadius: 4, padding: '0.25rem', background: 'rgba(0,151,167,0.1)' }} />
              ) : content.hero.headline}
              <span style={{ color: TEAL, fontStyle: 'italic', display: 'block' }}>
                {isEditing('hero') ? (
                  <input type="text" value={content.hero.headlineAccent} onChange={(e) => updateContent('hero', 'headlineAccent', e.target.value)} style={{ width: '100%', fontSize: '3.25rem', fontWeight: 800, color: TEAL, fontStyle: 'italic', border: '2px dashed #0097a7', borderRadius: 4, padding: '0.25rem', background: 'rgba(0,151,167,0.1)' }} />
                ) : content.hero.headlineAccent}
              </span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#475569', marginBottom: '2rem', maxWidth: 480 }}>
              {isEditing('hero') ? (
                <textarea value={content.hero.subheadline} onChange={(e) => updateContent('hero', 'subheadline', e.target.value)} style={{ width: '100%', fontSize: '1.25rem', color: '#475569', border: '2px dashed #0097a7', borderRadius: 4, padding: '0.5rem', background: 'rgba(0,151,167,0.1)', minHeight: 80 }} />
              ) : content.hero.subheadline}
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => handleNavClick('signup')} style={{ padding: '0.875rem 1.75rem', background: TEAL, border: 'none', borderRadius: 8, fontSize: '1rem', fontWeight: 600, color: 'white', cursor: 'pointer' }}>
                {content.hero.ctaPrimary}
              </button>
              <button onClick={() => handleNavClick('demo')} style={{ padding: '0.875rem 1.75rem', border: '2px solid #cbd5e1', borderRadius: 8, fontSize: '1rem', fontWeight: 600, color: '#334155', background: 'white', cursor: 'pointer' }}>
                {content.hero.ctaSecondary}
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src="/hero-image.png" alt="Hero" style={{ maxWidth: '100%', height: 'auto', borderRadius: 16 }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section style={{ padding: '2.5rem 2rem', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>
            {content.trustBar.label}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {content.trustBar.logos.map((logo: string, i: number) => (
              <span key={i} style={{ padding: '0.5rem 1rem', border: '1px solid #e2e8f0', borderRadius: 100, fontSize: '0.8125rem', color: '#64748b', fontWeight: 500 }}>{logo}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" style={{ padding: '5rem 2rem', background: 'white', position: 'relative' }}>
        {editMode && (
          <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 100 }}>
            {isEditing('tools') ? (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => saveSection('tools')} style={{ padding: '0.5rem 1rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>✓ Save</button>
                <button onClick={() => cancelEdit('tools')} style={{ padding: '0.5rem 1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>✕ Cancel</button>
              </div>
            ) : (
              <button onClick={() => setEditingSection('tools')} style={{ padding: '0.5rem 1rem', background: NAVY, color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>✏️ Edit Tools</button>
            )}
          </div>
        )}
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 3rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: NAVY, marginBottom: '0.75rem' }}>{content.tools.headline}</h2>
          <p style={{ fontSize: '1.125rem', color: '#64748b' }}>{content.tools.subheadline}</p>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {content.tools.items.map((tool: any, i: number) => (
            <div key={i} onClick={() => !isEditing('tools') && handleNavClick(tool.link)} style={{ position: 'relative', height: 280, borderRadius: 16, overflow: 'hidden', background: `linear-gradient(135deg, ${NAVY} 0%, ${TEAL_DARK} 100%)`, cursor: isEditing('tools') ? 'default' : 'pointer' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
                  {isEditing('tools') ? (
                    <input type="text" value={tool.title} onChange={(e) => { const items = [...content.tools.items]; items[i] = { ...items[i], title: e.target.value }; updateContent('tools', 'items', items); }} style={{ width: '100%', background: 'rgba(255,255,255,0.2)', border: '1px dashed white', borderRadius: 4, padding: '0.25rem', color: 'white', fontWeight: 700, fontSize: '1.4rem' }} />
                  ) : tool.title}
                </h3>
                <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)', marginBottom: '1rem' }}>
                  {isEditing('tools') ? (
                    <textarea value={tool.desc} onChange={(e) => { const items = [...content.tools.items]; items[i] = { ...items[i], desc: e.target.value }; updateContent('tools', 'items', items); }} style={{ width: '100%', background: 'rgba(255,255,255,0.2)', border: '1px dashed white', borderRadius: 4, padding: '0.25rem', color: 'white', fontSize: '0.95rem', minHeight: 60 }} />
                  ) : tool.desc}
                </p>
                <span style={{ color: TEAL_LIGHT, fontWeight: 600, fontSize: '0.95rem' }}>Launch Tool →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Professor Section */}
      <section style={{ padding: '5rem 2rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '350px 1fr', gap: '4rem', alignItems: 'start' }}>
          <div style={{ position: 'relative' }}>
            <img src="/dr-corbett.png" alt="Dr. Lyn Corbett" style={{ width: '100%', height: 'auto', borderRadius: 12, minHeight: 300, background: '#e2e8f0' }} onError={(e) => { (e.target as HTMLImageElement).style.background = '#e2e8f0'; }} />
            <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', background: NAVY, color: 'white', padding: '0.75rem 1.25rem', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
              {content.professor.badge}
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: NAVY, marginBottom: '0.75rem' }}>{content.professor.headline}</h2>
            <p style={{ fontSize: '1.0625rem', color: '#475569', marginBottom: '1.25rem' }}>{content.professor.subheadline}</p>
            <p style={{ fontSize: '1.0625rem', color: '#334155', marginBottom: '1.5rem' }}>{content.professor.description}</p>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>{content.professor.questionsLabel}</div>
            <ul style={{ listStyle: 'none', marginBottom: '1.5rem', padding: 0 }}>
              {content.professor.questions.map((q: string, i: number) => (
                <li key={i} style={{ fontSize: '0.9375rem', color: '#475569', padding: '0.5rem 0', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ color: TEAL, fontWeight: 'bold' }}>→</span>{q}
                </li>
              ))}
            </ul>
            <button onClick={() => handleNavClick('professor')} style={{ background: NAVY, color: 'white', padding: '1rem 1.75rem', borderRadius: 8, fontSize: '1rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              {content.professor.cta}
            </button>
          </div>
        </div>
      </section>

      {/* Assessment CTA */}
      <section style={{ background: NAVY, padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ color: 'white' }}>
            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', padding: '0.375rem 0.875rem', borderRadius: 4, fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>{content.assessment.badge}</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{content.assessment.headline} <span style={{ color: '#94a3b8', fontSize: '0.9375rem', fontWeight: 500 }}>{content.assessment.subheadline}</span></h3>
          </div>
          <button onClick={() => handleNavClick('assessment')} style={{ background: TEAL, color: 'white', padding: '1rem 1.75rem', borderRadius: 8, fontSize: '1rem', fontWeight: 700, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>{content.assessment.cta}</button>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: '5rem 2rem', background: 'white' }}>
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 3rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: NAVY, marginBottom: '0.75rem' }}>{content.pricing.headline}</h2>
          <p style={{ fontSize: '1.125rem', color: '#64748b' }}>{content.pricing.subheadline}</p>
        </div>
        <div style={{ maxWidth: 1150, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
          {content.pricing.plans.map((plan: any, i: number) => (
            <div key={i} style={{ background: 'white', border: `2px solid ${plan.featured ? NAVY : '#e2e8f0'}`, borderRadius: 12, padding: '1.75rem', textAlign: 'center', position: 'relative' }}>
              {plan.featured && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: NAVY, color: 'white', padding: '0.25rem 0.75rem', borderRadius: 4, fontSize: '0.625rem', fontWeight: 700 }}>MOST POPULAR</div>}
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: NAVY, marginBottom: '0.75rem' }}>{plan.name}</h3>
              <div style={{ marginBottom: '0.25rem' }}>
                <span style={{ fontSize: plan.isEnterprise ? '1.75rem' : '2.25rem', fontWeight: 800, color: NAVY }}>{plan.price}</span>
                {!plan.isEnterprise && <span style={{ fontSize: '1rem', color: '#64748b' }}>{plan.period}</span>}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: plan.isEnterprise ? '#64748b' : TEAL, marginBottom: '1rem' }}>{plan.label}</div>
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', marginBottom: '1.5rem' }}>
                {plan.features.map((f: string, j: number) => (
                  <li key={j} style={{ fontSize: '0.875rem', color: '#475569', padding: '0.375rem 0', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleNavClick(plan.isEnterprise ? 'contact' : 'signup')} style={{ display: 'block', width: '100%', padding: '0.875rem 1rem', borderRadius: 8, fontSize: '0.9375rem', fontWeight: 700, border: 'none', cursor: 'pointer', background: plan.featured ? NAVY : '#f1f5f9', color: plan.featured ? 'white' : NAVY }}>
                {plan.isEnterprise ? 'Contact Sales' : 'Start 3-Day Trial'}
              </button>
            </div>
          ))}
        </div>
        <p style={{ maxWidth: 700, margin: '2rem auto 0', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>{content.pricing.note}</p>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '5rem 2rem', background: '#f8fafc' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.25rem', fontWeight: 800, color: NAVY, marginBottom: '2.5rem' }}>{content.faq.headline}</h2>
        <div style={{ maxWidth: 750, margin: '0 auto' }}>
          {content.faq.items.map((item: any, i: number) => (
            <div key={i} style={{ borderBottom: '1px solid #e2e8f0', padding: '1.25rem 0' }}>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: NAVY, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                Q{i + 1}: {item.q}
                <span style={{ fontSize: '1.25rem', color: '#94a3b8' }}>+</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: NAVY, color: 'white', padding: '4rem 2rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr repeat(4, 1fr)', gap: '3rem' }}>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>The Nonprofit <span style={{ color: TEAL_LIGHT }}>Edge</span></div>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', maxWidth: 250, lineHeight: 1.6 }}>{content.footer.tagline}</p>
          </div>
          {[{ title: 'Product', links: ['Features', 'Pricing', 'FAQ'] }, { title: 'Company', links: ['About', 'Resources', 'Contact'] }, { title: 'Legal', links: ['Privacy', 'Terms'] }, { title: 'Support', links: ['Help Center', 'Contact'] }].map((col, i) => (
            <div key={i}>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', color: '#94a3b8' }}>{col.title}</h4>
              {col.links.map((link, j) => <a key={j} href="#" style={{ display: 'block', fontSize: '0.9375rem', color: 'white', textDecoration: 'none', padding: '0.375rem 0' }}>{link}</a>)}
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 1100, margin: '3rem auto 0', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8125rem', color: '#94a3b8' }}>{content.footer.copyright}</div>
      </footer>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 1000px) { .nav-desktop { display: none !important; } }
        @media (max-width: 768px) {
          section > div { grid-template-columns: 1fr !important; }
          footer > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Homepage;
