/**
 * THE NONPROFIT EDGE - Why We Exist Page
 * Location: src/components/WhyWeExist.tsx
 */

import React from 'react';

const COLORS = {
  navy: '#0D2C54',
  teal: '#0097A9',
  white: '#ffffff',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
};

interface WhyWeExistProps {
  navigate?: (path: string) => void;
}

const WhyWeExist: React.FC<WhyWeExistProps> = ({ navigate }) => {
  const handleCTA = () => {
    if (navigate) navigate('/signup');
    else window.location.href = '/signup';
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.white, fontFamily: "'Inter', sans-serif" }}>
      
      {/* HERO */}
      <section style={{
        padding: '96px 24px',
        background: `linear-gradient(135deg, ${COLORS.navy} 0%, #1a4a7a 100%)`,
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', color: COLORS.white }}>
          <h1 style={{ fontSize: '56px', fontWeight: 800, lineHeight: 1.1, marginBottom: '32px' }}>
            Why We Exist
          </h1>
          <p style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>
            Every nonprofit has <span style={{ color: '#5eead4' }}>One Thing</span> that, when focused on,<br />
            will change everything.
          </p>
          <p style={{ fontSize: '20px', opacity: 0.75 }}>
            Most leaders are too buried in everything else to find it.<br />
            We built The Nonprofit Edge to fix that.
          </p>
        </div>
      </section>

      {/* YOU'RE EXPECTED TO BE AN EXPERT */}
      <section style={{ padding: '80px 24px', background: COLORS.gray50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '36px', fontWeight: 700, color: COLORS.navy, marginBottom: '24px' }}>
                You're Expected to Be an Expert in Everything
              </h2>
              <p style={{ fontSize: '18px', color: COLORS.gray600, marginBottom: '32px' }}>
                Fundraising. Board management. HR. Strategy. Compliance. Communications. Finance. 
                You wear every hat — often at the same time — with no playbook and no backup.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {[
                  { num: 1, title: "You're stretched thin.", desc: "Every decision feels urgent, but you're making most of them alone." },
                  { num: 2, title: "Technology treats you like a for-profit business.", desc: "But you're not. Your board dynamics, funding cycles, and stakeholder complexity are entirely different." },
                  { num: 3, title: "Resources are either competitive, expensive, or generic.", desc: "Consultants can be expensive, board members inexperienced in the nonprofit sector. Free templates weren't built for your reality." },
                  { num: 4, title: "You're expected to compete with organizations that have dedicated grant writers.", desc: "They have teams. You have a to-do list that never ends." },
                  { num: 5, title: "You're guessing more than you'd like to admit.", desc: "Not because you're not smart — because you don't have the right tools." },
                ].map((item) => (
                  <div key={item.num} style={{ display: 'flex', gap: '16px' }}>
                    <div style={{
                      width: '40px', height: '40px', background: '#fee2e2', color: '#dc2626',
                      borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, flexShrink: 0,
                    }}>{item.num}</div>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: COLORS.navy, marginBottom: '4px' }}>{item.title}</h3>
                      <p style={{ fontSize: '15px', color: COLORS.gray600 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
              <img src="/images/founder.jpg" alt="Dr. Lyn Corbett" style={{ width: '100%', height: 'auto' }} />
            </div>
          </div>
        </div>
      </section>

      {/* THE NONPROFIT EDGE SOLUTION */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
            <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
              <img src="/images/team-meeting.jpg" alt="The Nonprofit Edge platform" style={{ width: '100%', height: 'auto' }} />
            </div>
            
            <div>
              <span style={{
                display: 'inline-block', background: '#ccfbf1', color: '#0f766e',
                padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 600, marginBottom: '16px',
              }}>The Solution</span>
              <h2 style={{ fontSize: '36px', fontWeight: 700, color: COLORS.navy, marginBottom: '24px' }}>
                The Nonprofit Edge
              </h2>
              <p style={{ fontSize: '18px', color: COLORS.gray600, marginBottom: '32px' }}>
                A comprehensive platform built specifically for nonprofit leaders — by someone who spent 15 years as an Executive Director.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { title: "Built by someone who lived it.", desc: "Not a tech founder who read about nonprofits — an ED who managed boards, chased funding, built teams, and made impossible decisions with incomplete information." },
                  { title: "Battle-tested frameworks.", desc: "Every tool comes from real consulting engagements with 847+ organizations. Not theory — practice." },
                  { title: "AI-powered, human-informed.", desc: "Technology that understands nonprofit nuance because it was trained on nonprofit reality." },
                  { title: "Everything in one place.", desc: "Strategy. Board governance. Scenario planning. Grant review. CEO evaluation. Connected. Comprehensive. Affordable." },
                  { title: "Shaped by leaders who've been there.", desc: "Our frameworks are informed by a network of influential leaders — executive directors, philanthropists, and board members — who contributed their hard-won insights." },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                      width: '24px', height: '24px', background: COLORS.teal, borderRadius: '4px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.white,
                      fontSize: '14px', flexShrink: 0, marginTop: '2px',
                    }}>✓</div>
                    <div>
                      <span style={{ fontWeight: 600, color: COLORS.navy }}>{item.title}</span>
                      <span style={{ color: COLORS.gray600 }}> {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER QUOTE */}
      <section style={{ padding: '80px 24px', background: COLORS.navy }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', color: COLORS.white }}>
          <blockquote style={{ fontSize: '28px', fontWeight: 600, fontStyle: 'italic', lineHeight: 1.5 }}>
            "I built what I wished existed when I was an Executive Director."
          </blockquote>
          <cite style={{ display: 'block', marginTop: '24px', fontSize: '18px', opacity: 0.85, fontStyle: 'normal' }}>
            — Dr. Lyn Corbett, Founder
          </cite>
        </div>
      </section>

      {/* FOUNDER BIO */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '48px', alignItems: 'start' }}>
            <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
              <img src="/images/founder.jpg" alt="Dr. Lyn Corbett" style={{ width: '100%', height: 'auto' }} />
            </div>
            
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: 700, color: COLORS.navy, marginBottom: '16px' }}>
                Before I became a consultant, I was you.
              </h3>
              <p style={{ fontSize: '16px', color: COLORS.gray600, marginBottom: '16px' }}>
                I spent 15 years as an Executive Director — managing boards, chasing funding, building teams, 
                and making impossible decisions with incomplete information. I know what it feels like to lead 
                a mission you believe in while the infrastructure crumbles around you.
              </p>
              <p style={{ fontSize: '16px', color: COLORS.gray600, marginBottom: '24px' }}>
                I built The Nonprofit Edge because I got tired of watching brilliant leaders struggle with 
                problems that have solutions — solutions that were priced out of reach or buried in consulting 
                engagements only the largest organizations could afford.
              </p>
              
              <p style={{ fontWeight: 700, color: COLORS.navy, fontSize: '18px' }}>Dr. Lyn Corbett</p>
              <p style={{ color: COLORS.gray500, fontStyle: 'italic', marginBottom: '24px' }}>Founder, The Nonprofit Edge</p>
              
              <hr style={{ border: 'none', borderTop: `1px solid ${COLORS.gray200}`, margin: '24px 0' }} />
              
              <p style={{ fontSize: '15px', color: COLORS.gray600, marginBottom: '16px' }}>
                Dr. Corbett is a nationally recognized leadership strategist, executive coach, and President of 
                The Pivotal Group Consultants Inc. His firm has been trusted by Fortune 500 companies, 
                philanthropic organizations, nonprofits, and local governments to deliver transformative leadership solutions.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginTop: '24px' }}>
                <div>
                  <p style={{ fontWeight: 600, color: COLORS.navy, marginBottom: '8px' }}>Credentials</p>
                  <ul style={{ fontSize: '13px', color: COLORS.gray600, listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: '4px' }}>• PhD, University of San Diego</li>
                    <li style={{ marginBottom: '4px' }}>• M.A., New York University</li>
                    <li style={{ marginBottom: '4px' }}>• Cambridge University</li>
                    <li style={{ marginBottom: '4px' }}>• Gallup Certified Coach</li>
                    <li>• ICF ACC Certified</li>
                  </ul>
                </div>
                <div>
                  <p style={{ fontWeight: 600, color: COLORS.navy, marginBottom: '8px' }}>Recognition</p>
                  <ul style={{ fontSize: '13px', color: COLORS.gray600, listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: '4px' }}>• Top 500 SD Leaders (2025)</li>
                    <li style={{ marginBottom: '4px' }}>• Featured in USA Today</li>
                    <li>• CA Assembly Volunteer of Year</li>
                  </ul>
                </div>
                <div>
                  <p style={{ fontWeight: 600, color: COLORS.navy, marginBottom: '8px' }}>Author</p>
                  <ul style={{ fontSize: '13px', color: COLORS.gray600, listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: '4px' }}>• <em>The Leadership Reset</em></li>
                    <li>• <em>Hope is Not a Strategy</em></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 700, color: COLORS.navy, marginBottom: '16px' }}>
            Your Mission Deserves Better Tools
          </h2>
          <p style={{ fontSize: '18px', color: COLORS.gray600, marginBottom: '32px' }}>
            Stop guessing. Stop overpaying. Stop settling for resources that weren't built for you. 
            The Nonprofit Edge gives you everything you need to lead with confidence — at a price that respects your budget.
          </p>
          <button onClick={handleCTA} style={{
            padding: '16px 32px', fontSize: '16px', fontWeight: 600,
            background: COLORS.navy, color: COLORS.white,
            border: 'none', borderRadius: '10px', cursor: 'pointer',
          }}>
            Start Your Free Trial
          </button>
          <p style={{ marginTop: '24px', fontSize: '14px', color: COLORS.gray500 }}>
            Starting at $97/month for teams · Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
};

export default WhyWeExist;
