import React, { useState, useEffect } from 'react';

/**
 * Grant & RFP Review Landing Page
 * The Nonprofit Edge
 */

const NAVY = '#0D2C54';
const TEAL = '#0097A9';

export default function GrantRFPReviewLanding() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showFile, setShowFile] = useState(false);
  const [showFileCheck, setShowFileCheck] = useState(false);
  const [highlightUpload, setHighlightUpload] = useState(false);
  const [analyzeSteps, setAnalyzeSteps] = useState<number[]>([]);
  const [showCards, setShowCards] = useState<number[]>([]);
  const [showRewrite, setShowRewrite] = useState(false);

  // Animation cycle
  useEffect(() => {
    const runAnimation = () => {
      // Reset
      setCurrentScreen(0);
      setProgress(0);
      setShowFile(false);
      setShowFileCheck(false);
      setHighlightUpload(false);
      setAnalyzeSteps([]);
      setShowCards([]);
      setShowRewrite(false);

      setTimeout(() => setHighlightUpload(true), 500);
      setTimeout(() => setShowFile(true), 1000);
      setTimeout(() => setShowFileCheck(true), 1500);
      
      setTimeout(() => {
        setCurrentScreen(1);
        let p = 0;
        const interval = setInterval(() => {
          p += 2;
          setProgress(p);
          if (p >= 15) setAnalyzeSteps(prev => prev.includes(0) ? prev : [...prev, 0]);
          if (p >= 40) setAnalyzeSteps(prev => prev.includes(1) ? prev : [...prev, 1]);
          if (p >= 65) setAnalyzeSteps(prev => prev.includes(2) ? prev : [...prev, 2]);
          if (p >= 90) setAnalyzeSteps(prev => prev.includes(3) ? prev : [...prev, 3]);
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setCurrentScreen(2);
              setTimeout(() => setShowCards([0]), 100);
              setTimeout(() => setShowCards([0, 1]), 250);
              setTimeout(() => setShowCards([0, 1, 2]), 400);
              setTimeout(() => setShowRewrite(true), 600);
            }, 500);
          }
        }, 50);
      }, 2500);
    };

    runAnimation();
    const cycleInterval = setInterval(runAnimation, 12000);
    return () => clearInterval(cycleInterval);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: '#374151', lineHeight: 1.6 }}>
      
      {/* Hero Section */}
      <section style={{ padding: '80px 0 100px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div style={{ maxWidth: '540px' }}>
            <h1 style={{ fontSize: '46px', fontWeight: 800, lineHeight: 1.1, marginBottom: '20px' }}>
              <span style={{ color: NAVY }}>Stop Submitting</span><br/>
              <span style={{ color: TEAL }}>Losing Proposals</span>
            </h1>
            <p style={{ fontSize: '19px', color: '#4b5563', marginBottom: '12px', lineHeight: 1.6 }}>
              Get expert feedback on your grant proposal before you submit. Our proprietary review framework shows you what funders will see—and helps you fix weak spots before it's too late.
            </p>
            <p style={{ fontSize: '15px', color: TEAL, fontWeight: 500, marginBottom: '32px', fontStyle: 'italic' }}>
              For nonprofit leaders, grant writers and development teams who are tired of rejection letters.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="/trial" style={{
                display: 'inline-flex', alignItems: 'center', padding: '14px 28px',
                background: NAVY, color: 'white', borderRadius: '8px', fontWeight: 600,
                fontSize: '16px', textDecoration: 'none'
              }}>
                Start Your Free 3-Day Trial →
              </a>
              <a href="#features" style={{
                display: 'inline-flex', alignItems: 'center', padding: '14px 28px',
                background: 'white', color: NAVY, borderRadius: '8px', fontWeight: 600,
                fontSize: '16px', textDecoration: 'none', border: `2px solid ${NAVY}`
              }}>
                See What You Get
              </a>
            </div>
          </div>
          
          <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <img 
              src="/images/grant-review-hero.jpg" 
              alt="Team collaborating on grant proposal"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '60px 0', background: NAVY }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
            {[
              { number: '80%', label: 'of grant applications get rejected' },
              { number: '40hrs', label: 'spent writing a single proposal' },
              { number: '$0', label: 'feedback when you lose' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>{stat.number}</div>
                <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section id="features" style={{ padding: '80px 0 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 700, color: NAVY, marginBottom: '12px' }}>What You Get</h2>
            <p style={{ fontSize: '18px', color: '#6b7280' }}>The feedback you'd get from a grant reviewer—before you submit.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
            {[
              { title: 'Requirements Check', desc: 'Every RFP requirement mapped to your response', img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop' },
              { title: 'Predicted Score', desc: 'Section-by-section scoring based on funder criteria', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop' },
              { title: 'Real Insight', desc: 'We compare what you know versus what you wrote', img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop' },
            ].map((card, i) => (
              <div key={i} style={{ position: 'relative', height: '320px', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  backgroundImage: `url('${card.img}')`, backgroundSize: 'cover', backgroundPosition: 'center'
                }} />
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  background: 'linear-gradient(180deg, rgba(13,44,84,0) 0%, rgba(13,44,84,0.85) 60%, rgba(13,44,84,0.95) 100%)'
                }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px', color: 'white' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>{card.title}</h3>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After */}
      <section style={{ padding: '40px 0 80px', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 700, color: NAVY, marginBottom: '12px' }}>See the Difference</h2>
            <p style={{ fontSize: '18px', color: '#6b7280' }}>The same organization. The same program. Two very different proposals.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}>
              <div style={{ padding: '12px 24px', background: '#dc2626', color: 'white', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Before</div>
              <div style={{ padding: '24px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Outcomes Section</div>
                <div style={{ fontSize: '16px', lineHeight: 1.7, color: '#374151', fontStyle: 'italic', marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '8px', borderLeft: '3px solid #d1d5db' }}>
                  "We will improve outcomes for participants in our workforce development program."
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 500, color: '#dc2626' }}>
                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(220,38,38,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✗</span>
                  <span>Vague • No metrics • Weak</span>
                </div>
              </div>
            </div>
            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}>
              <div style={{ padding: '12px 24px', background: TEAL, color: 'white', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>After</div>
              <div style={{ padding: '24px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Outcomes Section</div>
                <div style={{ fontSize: '16px', lineHeight: 1.7, color: '#374151', fontStyle: 'italic', marginBottom: '20px', padding: '16px', background: 'rgba(0,151,169,0.05)', borderRadius: '8px', borderLeft: `3px solid ${TEAL}` }}>
                  "We will achieve a 25% improvement in employment rates within 6 months, measured through quarterly surveys and employer verification."
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 500, color: TEAL }}>
                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(0,151,169,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>
                  <span>Specific • Measurable • Compelling</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section style={{ padding: '60px 0', background: NAVY }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          <blockquote style={{ textAlign: 'center' }}>
            <span style={{ display: 'inline-block', background: TEAL, color: 'white', padding: '8px 20px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px' }}>
              Preparation Matters
            </span>
            <p style={{ fontSize: '32px', lineHeight: 1.5, color: 'white', fontStyle: 'italic', marginBottom: '32px', fontWeight: 400 }}>
              "Give me six hours to chop down a tree and I will spend the first four sharpening the axe."
            </p>
            <cite style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'center' }}>
              <span style={{ fontSize: '22px', fontWeight: 600, color: 'white', fontStyle: 'normal' }}>Abraham Lincoln</span>
              <span style={{ fontSize: '17px', color: 'rgba(255,255,255,0.7)', fontStyle: 'normal' }}>16th President of the United States</span>
            </cite>
          </blockquote>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '100px 0', background: 'linear-gradient(180deg, #f9fafb 0%, white 100%)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 700, color: NAVY }}>How It Works</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {[
                { num: '1', title: 'Upload Both Files', desc: 'Your proposal draft and the RFP requirements' },
                { num: '2', title: 'Get Expert Feedback', desc: 'We score against funder criteria and flag gaps' },
                { num: '3', title: 'Apply & Submit', desc: 'Apply feedback and submit with confidence' },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                  <div style={{
                    width: '56px', height: '56px', minWidth: '56px',
                    background: 'white', border: `3px solid ${NAVY}`, color: NAVY,
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '22px', fontWeight: 800, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}>
                    {step.num}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: NAVY, marginBottom: '6px' }}>{step.title}</h3>
                    <p style={{ fontSize: '15px', color: '#6b7280', margin: 0 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Animated Mockup */}
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
              <div style={{ background: '#f3f4f6', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#eab308' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }} />
                <div style={{ flex: 1, marginLeft: '12px', background: 'white', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', color: '#6b7280' }}>
                  thenonprofitedge.org
                </div>
              </div>
              
              <div style={{ height: '300px', position: 'relative', overflow: 'hidden' }}>
                {/* Screen 1: Upload */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', padding: '24px',
                  opacity: currentScreen === 0 ? 1 : 0, transition: 'opacity 0.5s ease'
                }}>
                  <div style={{
                    border: `2px dashed ${highlightUpload ? TEAL : '#d1d5db'}`,
                    borderRadius: '12px', padding: '40px 20px', textAlign: 'center',
                    background: highlightUpload ? 'rgba(0,151,169,0.05)' : 'transparent',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ width: '48px', height: '48px', margin: '0 auto 12px', color: '#9ca3af' }}>📄</div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Upload your proposal & RFP</div>
                    <div style={{ fontSize: '13px', color: '#9ca3af' }}>PDF, Word, or any format</div>
                  </div>
                  {showFile && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px',
                      padding: '12px 16px', marginTop: '16px'
                    }}>
                      <span style={{ color: TEAL }}>📄</span>
                      <span style={{ flex: 1, fontSize: '14px', color: '#374151' }}>Grant_Proposal_Draft.pdf</span>
                      {showFileCheck && <span style={{ color: '#22c55e' }}>✓</span>}
                    </div>
                  )}
                </div>

                {/* Screen 2: Analyzing */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', padding: '24px',
                  opacity: currentScreen === 1 ? 1 : 0, transition: 'opacity 0.5s ease',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                }}>
                  <div style={{
                    width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTopColor: TEAL,
                    borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px'
                  }} />
                  <div style={{ fontSize: '16px', fontWeight: 600, color: NAVY, marginBottom: '16px' }}>Reviewing your proposal...</div>
                  <div style={{ width: '200px', height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden', marginBottom: '20px' }}>
                    <div style={{ height: '100%', background: TEAL, width: `${progress}%`, transition: 'width 0.3s ease' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                    {['Matching RFP requirements', 'Scoring each section', 'Checking funder alignment', 'Generating rewrites'].map((step, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: analyzeSteps.includes(i) ? '#22c55e' : '#9ca3af' }}>
                        <span style={{ opacity: analyzeSteps.includes(i) ? 1 : 0 }}>✓</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Screen 3: Report */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', padding: '24px',
                  opacity: currentScreen === 2 ? 1 : 0, transition: 'opacity 0.5s ease',
                  display: 'flex', flexDirection: 'column'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: NAVY }}>Proposal Review</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: TEAL }}>72/100</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                    {[
                      { value: '85', label: 'Organization', width: '85%' },
                      { value: '52', label: 'Outcomes', width: '52%' },
                      { value: '78', label: 'Budget', width: '78%' },
                    ].map((card, i) => (
                      <div key={i} style={{
                        background: '#f9fafb', borderRadius: '8px', padding: '12px', textAlign: 'center',
                        opacity: showCards.includes(i) ? 1 : 0, transform: showCards.includes(i) ? 'translateY(0)' : 'translateY(10px)',
                        transition: 'all 0.4s ease'
                      }}>
                        <div style={{ fontSize: '24px', fontWeight: 800, color: NAVY }}>{card.value}</div>
                        <div style={{ height: '4px', background: '#e5e7eb', borderRadius: '2px', margin: '8px 0', overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: TEAL, width: card.width, borderRadius: '2px' }} />
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>{card.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden',
                    opacity: showRewrite ? 1 : 0, transform: showRewrite ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'all 0.4s ease 0.3s'
                  }}>
                    <div style={{ background: 'rgba(220,38,38,0.1)', padding: '8px 12px', fontSize: '12px', fontWeight: 600, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', background: '#dc2626', borderRadius: '50%' }} />
                      Priority Fix: Outcomes
                    </div>
                    <div style={{ padding: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', padding: '8px', background: '#f9fafb', borderRadius: '4px' }}>
                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>Your Text</div>
                        "We will improve outcomes for participants."
                      </div>
                      <div style={{ fontSize: '12px', color: NAVY, padding: '8px', background: 'rgba(0,151,169,0.05)', borderRadius: '4px', borderLeft: `2px solid ${TEAL}` }}>
                        <div style={{ fontSize: '10px', fontWeight: 600, color: TEAL, textTransform: 'uppercase', marginBottom: '4px' }}>Try This</div>
                        "We will achieve a 25% improvement in employment rates within 6 months."
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '120px 0', position: 'relative', textAlign: 'center', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: "url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1400&h=600&fit=crop')",
          backgroundSize: 'cover', backgroundPosition: 'center'
        }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(135deg, rgba(13,44,84,0.92) 0%, rgba(0,109,120,0.88) 100%)'
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ fontSize: '44px', fontWeight: 800, color: 'white', marginBottom: '16px' }}>Win More Grants</h2>
          <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.85)', marginBottom: '40px' }}>Get feedback before you submit, not after you lose.</p>
          <a href="/trial" style={{
            display: 'inline-flex', alignItems: 'center', padding: '18px 42px',
            background: 'white', color: NAVY, borderRadius: '8px', fontWeight: 700,
            fontSize: '17px', textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            Start Your Free 3-Day Trial →
          </a>
        </div>
      </section>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
