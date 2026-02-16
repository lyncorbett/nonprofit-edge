import React, { useState, useEffect } from 'react';

const NAVY = '#0D2C54';
const TEAL = '#0097A9';

export default function StrategicPlanCheckupLanding() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showFile, setShowFile] = useState(false);
  const [showFileCheck, setShowFileCheck] = useState(false);
  const [highlightUpload, setHighlightUpload] = useState(false);
  const [analyzeSteps, setAnalyzeSteps] = useState<number[]>([]);
  const [showCards, setShowCards] = useState<number[]>([]);
  const [showRewrite, setShowRewrite] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const runAnimation = () => {
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

  const featureCards = [
    { 
      title: 'Goal Analysis', 
      desc: 'Every goal scored for clarity, specificity, and measurability. See exactly which ones need work.', 
      img: '/strategic-goal-analysis.jpg',
      fallback: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80'
    },
    { 
      title: 'SMART Rewrites', 
      desc: 'Vague objectives transformed into specific, measurable goals you can actually track and report on.', 
      img: '/strategic-smart-rewrites.jpg', 
      fallback: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80'
    },
    { 
      title: 'Implementation Check', 
      desc: "Does your plan have owners? Timelines? Tracking mechanisms? We'll tell you what's missing.", 
      img: '/strategic-implementation.jpg',
      fallback: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=600&q=80'
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: '#374151', lineHeight: 1.6 }}>
      
      {/* Header */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, backgroundColor: 'white', borderBottom: '1px solid #f3f4f6' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '120px' }}>
            <a href="/" style={{ display: 'flex', alignItems: 'center' }}>
              <img 
                src="/logo.svg" 
                alt="The Nonprofit Edge" 
                style={{ width: '280px', height: 'auto' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.jpg'
                }}
              />
            </a>
            <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <a href="/why-we-exist" style={{ color: '#4b5563', fontWeight: 500, textDecoration: 'none' }}>Why We Exist</a>
              <a href="/#tools-section" style={{ color: '#4b5563', fontWeight: 500, textDecoration: 'none' }}>Tools</a>
              <a href="/#pricing-section" style={{ color: '#4b5563', fontWeight: 500, textDecoration: 'none' }}>Pricing</a>
              <a href="/login" style={{ padding: '10px 20px', backgroundColor: TEAL, color: 'white', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>Sign In</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '80px 0 100px', marginTop: '120px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div style={{ maxWidth: '540px' }}>
            <h1 style={{ fontSize: '46px', fontWeight: 800, lineHeight: 1.1, marginBottom: '20px' }}>
              <span style={{ color: NAVY }}>Is Your $30,000 Strategic Plan</span><br/>
              <span style={{ color: TEAL }}>Gathering Dust?</span>
            </h1>
            <p style={{ fontSize: '19px', color: '#4b5563', marginBottom: '12px', lineHeight: 1.6 }}>
              Upload your strategic plan. Our proprietary framework—built from 15+ years and 800+ nonprofit engagements—identifies vague goals and rewrites them into SMART objectives you can actually track.
            </p>
            <p style={{ fontSize: '15px', color: TEAL, fontWeight: 500, marginBottom: '32px', fontStyle: 'italic' }}>
              For executive directors, board members, and leadership teams who need plans that actually get implemented.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="/signup" style={{
                display: 'inline-flex', alignItems: 'center', padding: '14px 28px',
                background: NAVY, color: 'white', borderRadius: '8px', fontWeight: 600,
                fontSize: '16px', textDecoration: 'none'
              }}>
                Start Your Free 3-Day Trial →
              </a>
              <a href="/samples/strategic-plan-report.pdf" style={{
                display: 'inline-flex', alignItems: 'center', padding: '14px 28px',
                background: 'white', color: NAVY, borderRadius: '8px', fontWeight: 600,
                fontSize: '16px', textDecoration: 'none', border: `2px solid ${NAVY}`
              }}>
                See Sample Report
              </a>
            </div>
          </div>
          
          {/* Hero Image */}
          <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <img 
              src="/strategic-hero.jpg" 
              alt="Strategic planning session"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80';
              }}
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '60px 0', background: NAVY }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
            {[
              { number: '67%', label: 'of strategic plans fail to get implemented' },
              { number: '$30K', label: 'average cost of a plan that sits on a shelf' },
              { number: '90%', label: "of staff can't name their organization's top 3 priorities" },
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
            <p style={{ fontSize: '18px', color: '#6b7280' }}>Expert-level analysis based on 15+ years of nonprofit consulting experience.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
            {featureCards.map((card, i) => (
              <div key={i} style={{ position: 'relative', height: '320px', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  backgroundImage: `url('${card.img}'), url('${card.fallback}')`, backgroundSize: 'cover',
                  backgroundPosition: 'center'
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
            <p style={{ fontSize: '18px', color: '#6b7280' }}>The same goal. Two very different levels of clarity.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}>
              <div style={{ padding: '12px 24px', background: '#374151', color: 'white', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Before</div>
              <div style={{ padding: '24px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Strategic Goal</div>
                <div style={{ fontSize: '16px', lineHeight: 1.7, color: '#374151', fontStyle: 'italic', marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '8px', borderLeft: '3px solid #d1d5db' }}>
                  "Improve community engagement and strengthen partnerships."
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 500, color: '#6b7280' }}>
                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚠</span>
                  <span>Vague • No metrics • Untrackable</span>
                </div>
              </div>
            </div>
            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}>
              <div style={{ padding: '12px 24px', background: NAVY, color: 'white', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>After</div>
              <div style={{ padding: '24px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Strategic Goal</div>
                <div style={{ fontSize: '16px', lineHeight: 1.7, color: '#374151', fontStyle: 'italic', marginBottom: '20px', padding: '16px', background: 'rgba(0,151,169,0.05)', borderRadius: '8px', borderLeft: `3px solid ${TEAL}` }}>
                  "Increase active community partnerships from 12 to 20 by December 2026, measured by signed MOUs and quarterly joint activities."
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 500, color: TEAL }}>
                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(0,151,169,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>
                  <span>Specific • Measurable • Achievable</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section style={{ padding: '80px 0', background: NAVY }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <blockquote>
            <p style={{ fontSize: '32px', lineHeight: 1.5, color: 'white', fontStyle: 'italic', marginBottom: '32px', fontWeight: 400 }}>
              "A strategic plan without measurable goals isn't a plan—it's a wish list. The difference between the two is accountability."
            </p>
            <cite style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '22px', fontWeight: 600, color: 'white', fontStyle: 'normal' }}>Dr. Lyn Corbett</span>
              <span style={{ fontSize: '17px', color: 'rgba(255,255,255,0.7)', fontStyle: 'normal' }}>Founder, The Nonprofit Edge</span>
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
                { num: '1', title: 'Upload Your Plan', desc: 'Any format—PDF, Word, even photos of flip charts' },
                { num: '2', title: 'Expert Analysis', desc: 'Our proprietary framework evaluates every goal for clarity, measurability, and implementation readiness' },
                { num: '3', title: 'Take Action', desc: 'Implement changes that transform your plan from document to driving force' },
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
                    <div style={{ width: '48px', height: '48px', margin: '0 auto 12px', color: '#9ca3af' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Drop your strategic plan here</div>
                    <div style={{ fontSize: '13px', color: '#9ca3af' }}>PDF, Word, or any format</div>
                  </div>
                  {showFile && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px',
                      padding: '12px 16px', marginTop: '16px'
                    }}>
                      <span style={{ color: TEAL }}>📄</span>
                      <span style={{ flex: 1, fontSize: '14px', color: '#374151' }}>Strategic_Plan_2026.pdf</span>
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
                  <div style={{ fontSize: '16px', fontWeight: 600, color: NAVY, marginBottom: '16px' }}>Analyzing your plan...</div>
                  <div style={{ width: '200px', height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden', marginBottom: '20px' }}>
                    <div style={{ height: '100%', background: TEAL, width: `${progress}%`, transition: 'width 0.3s ease' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                    {['Reading document structure', 'Evaluating goal specificity', 'Checking measurability', 'Generating SMART rewrites'].map((step, i) => (
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
                    <div style={{ fontSize: '14px', fontWeight: 700, color: NAVY }}>Strategic Plan Analysis</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: TEAL }}>Complete</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                    {[
                      { value: '62', label: 'Clarity', width: '62%' },
                      { value: '41', label: 'Measurability', width: '41%' },
                      { value: '78', label: 'Alignment', width: '78%' },
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
                      Priority Fix: Measurability
                    </div>
                    <div style={{ padding: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', padding: '8px', background: '#f9fafb', borderRadius: '4px' }}>
                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>Your Text</div>
                        "Improve community engagement"
                      </div>
                      <div style={{ fontSize: '12px', color: NAVY, padding: '8px', background: 'rgba(0,151,169,0.05)', borderRadius: '4px', borderLeft: `2px solid ${TEAL}` }}>
                        <div style={{ fontSize: '10px', fontWeight: 600, color: TEAL, textTransform: 'uppercase', marginBottom: '4px' }}>Try This</div>
                        "Increase community event attendance by 25% within 12 months"
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
          backgroundImage: "url('https://images.unsplash.com/photo-1552581234-26160f608093?w=1400&h=600&fit=crop')",
          backgroundSize: 'cover', backgroundPosition: 'center'
        }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(135deg, rgba(13,44,84,0.92) 0%, rgba(0,109,120,0.88) 100%)'
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ fontSize: '44px', fontWeight: 800, color: 'white', marginBottom: '16px' }}>Transform Your Strategic Plan</h2>
          <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.85)', marginBottom: '40px' }}>From shelf decoration to organizational driving force.</p>
          <a href="/signup" style={{
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
