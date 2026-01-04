import React, { useState, useEffect } from 'react';

/**
 * PIVOT Scenario Planner Landing Page
 * The Nonprofit Edge
 */

const NAVY = '#0D2C54';
const TEAL = '#0097A9';

export default function ScenarioPlannerLanding() {
  const [currentScreen, setCurrentScreen] = useState(0);

  // Animation cycle through 3 screens
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScreen(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: '#374151', lineHeight: 1.6 }}>
      
      {/* Hero Section */}
      <section style={{ padding: '80px 0 100px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div style={{ maxWidth: '540px' }}>
            <h1 style={{ fontSize: '46px', fontWeight: 800, lineHeight: 1.1, marginBottom: '20px' }}>
              <span style={{ color: NAVY }}>What If Your Biggest</span><br/>
              <span style={{ color: TEAL }}>Funder Disappeared?</span>
            </h1>
            <p style={{ fontSize: '19px', color: '#4b5563', marginBottom: '12px', lineHeight: 1.6 }}>
              Explore "what if" scenarios before they become crises. Our PIVOT framework helps you stress-test your organization and build contingency plans that actually work.
            </p>
            <p style={{ fontSize: '15px', color: TEAL, fontWeight: 500, marginBottom: '32px', fontStyle: 'italic' }}>
              For executive directors and board members who refuse to be caught off guard.
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
              src="/images/scenario-planner-hero.jpg" 
              alt="Leadership team planning for the future"
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
              { number: '73%', label: 'of nonprofits have no contingency plan' },
              { number: '6mo', label: 'average warning time before a crisis' },
              { number: '40%', label: 'of organizations fail within 2 years of major disruption' },
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
            <p style={{ fontSize: '18px', color: '#6b7280' }}>Scenario planning tools built for nonprofit realities.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
            {[
              { title: 'Leadership Changes', desc: 'Plan for executive transitions, board turnover, and key staff departures.', img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop' },
              { title: 'Funding Shifts', desc: 'Model what happens if a major funder cuts back, delays, or disappears entirely.', img: 'https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=600&h=400&fit=crop' },
              { title: 'External Disruptions', desc: 'Prepare for policy changes, economic downturns, and competitive threats.', img: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600&h=400&fit=crop' },
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
            <p style={{ fontSize: '18px', color: '#6b7280' }}>The same scenario. Two very different responses.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}>
              <div style={{ padding: '12px 24px', background: '#374151', color: 'white', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Before</div>
              <div style={{ padding: '24px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>When Major Funder Cuts 50%</div>
                <div style={{ fontSize: '16px', lineHeight: 1.7, color: '#374151', fontStyle: 'italic', marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '8px', borderLeft: '3px solid #d1d5db' }}>
                  "We'll figure it out. Maybe we can do a fundraiser or something. Let's wait and see what happens."
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 500, color: '#6b7280' }}>
                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚠</span>
                  <span>Reactive • Unprepared • High Risk</span>
                </div>
              </div>
            </div>
            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}>
              <div style={{ padding: '12px 24px', background: TEAL, color: 'white', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>After</div>
              <div style={{ padding: '24px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>When Major Funder Cuts 50%</div>
                <div style={{ fontSize: '16px', lineHeight: 1.7, color: '#374151', fontStyle: 'italic', marginBottom: '20px', padding: '16px', background: 'rgba(0,151,169,0.05)', borderRadius: '8px', borderLeft: `3px solid ${TEAL}` }}>
                  "We activate Plan B: Reduce contractor hours, accelerate individual giving campaign, and notify board of bridge loan option. Timeline: 30 days."
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 500, color: TEAL }}>
                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(0,151,169,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>
                  <span>Proactive • Prepared • Resilient</span>
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
              Strategic Foresight
            </span>
            <p style={{ fontSize: '32px', lineHeight: 1.5, color: 'white', fontStyle: 'italic', marginBottom: '32px', fontWeight: 400 }}>
              "In preparing for battle I have always found that plans are useless, but planning is indispensable."
            </p>
            <cite style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'center' }}>
              <span style={{ fontSize: '22px', fontWeight: 600, color: 'white', fontStyle: 'normal' }}>Dwight D. Eisenhower</span>
              <span style={{ fontSize: '17px', color: 'rgba(255,255,255,0.7)', fontStyle: 'normal' }}>34th President of the United States</span>
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
                { num: '1', title: 'Choose Your Scenario', desc: 'Select from leadership, funding, or disruption scenarios that matter most' },
                { num: '2', title: 'Explore Three Futures', desc: 'We guide you through best case, most likely, and worst case possibilities' },
                { num: '3', title: 'Build Your Playbook', desc: 'Get a concrete action plan with triggers, owners, and timelines' },
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
                {/* Screen 1: Select Scenario */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', padding: '24px',
                  opacity: currentScreen === 0 ? 1 : 0, transition: 'opacity 0.5s ease'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: NAVY, marginBottom: '12px' }}>Select a scenario to explore:</div>
                  {[
                    { icon: '👤', label: 'Executive Director Departure', selected: true },
                    { icon: '💰', label: 'Major Funder Reduction (50%+)', selected: false },
                    { icon: '📋', label: 'Government Contract Loss', selected: false },
                    { icon: '⚡', label: 'Economic Recession Impact', selected: false },
                  ].map((opt, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
                      background: opt.selected ? 'rgba(0,151,169,0.05)' : '#f9fafb',
                      border: opt.selected ? `2px solid ${TEAL}` : '2px solid transparent',
                      borderRadius: '8px', marginBottom: '8px', transition: 'all 0.3s ease'
                    }}>
                      <span style={{ fontSize: '20px' }}>{opt.icon}</span>
                      <span style={{ fontSize: '13px', color: '#374151' }}>{opt.label}</span>
                    </div>
                  ))}
                </div>

                {/* Screen 2: Three Futures */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', padding: '24px',
                  opacity: currentScreen === 1 ? 1 : 0, transition: 'opacity 0.5s ease'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: NAVY, marginBottom: '16px' }}>ED Departure: Three Futures</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    {[
                      { title: 'Best Case', desc: 'Smooth transition with internal candidate ready.', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', color: '#16a34a' },
                      { title: 'Most Likely', desc: '6-month search with interim leadership.', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)', color: '#ca8a04' },
                      { title: 'Worst Case', desc: 'Extended vacancy, staff turnover, funder concerns.', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', color: '#dc2626' },
                    ].map((future, i) => (
                      <div key={i} style={{ padding: '12px', borderRadius: '8px', textAlign: 'center', background: future.bg, border: `1px solid ${future.border}` }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', color: future.color }}>{future.title}</div>
                        <div style={{ fontSize: '11px', color: '#4b5563', lineHeight: 1.4 }}>{future.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Screen 3: Readiness */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', padding: '24px',
                  opacity: currentScreen === 2 ? 1 : 0, transition: 'opacity 0.5s ease'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: NAVY, marginBottom: '16px' }}>Your Readiness Score</div>
                  {[
                    { label: 'Succession', score: 25, color: '#ef4444' },
                    { label: 'Documentation', score: 60, color: '#eab308' },
                    { label: 'Board Ready', score: 45, color: '#eab308' },
                    { label: 'Cash Reserve', score: 80, color: '#22c55e' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <span style={{ width: '80px', fontSize: '12px', color: '#4b5563' }}>{item.label}</span>
                      <div style={{ flex: 1, height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: item.color, width: `${item.score}%`, borderRadius: '4px', transition: 'width 1s ease' }} />
                      </div>
                      <span style={{ width: '40px', fontSize: '12px', fontWeight: 600, textAlign: 'right' }}>{item.score}%</span>
                    </div>
                  ))}
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
          backgroundImage: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1400&h=600&fit=crop')",
          backgroundSize: 'cover', backgroundPosition: 'center'
        }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(135deg, rgba(13,44,84,0.92) 0%, rgba(0,109,120,0.88) 100%)'
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ fontSize: '44px', fontWeight: 800, color: 'white', marginBottom: '16px' }}>Plan for Tomorrow, Today</h2>
          <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.85)', marginBottom: '40px' }}>Don't wait for a crisis to discover you're not ready.</p>
          <a href="/trial" style={{
            display: 'inline-flex', alignItems: 'center', padding: '18px 42px',
            background: 'white', color: NAVY, borderRadius: '8px', fontWeight: 700,
            fontSize: '17px', textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            Start Your Free 3-Day Trial →
          </a>
        </div>
      </section>
    </div>
  );
}
