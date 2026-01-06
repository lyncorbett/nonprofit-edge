/**
 * THE NONPROFIT EDGE - Certifications Landing Page
 * Location: src/components/CertificationsLanding.tsx
 */

import React from 'react';

const COLORS = {
  navy: '#0D2C54',
  teal: '#0097A9',
  gold: '#D4A853',
  white: '#ffffff',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
};

const PARTNER_CERTS = [
  {
    type: 'partner',
    title: 'Everything DiSC® Certification',
    description: 'Master the world\'s most trusted behavioral assessment tool. Learn to administer, interpret, and facilitate DiSC workshops that transform how teams communicate and collaborate.',
    image: '/images/cert-disc.jpg',
    duration: '2 weeks (20 hours)',
    format: 'Live online + self-paced',
    exam: '80% to pass',
    credits: '20 SHRM/HRCI PDCs',
  },
  {
    type: 'partner',
    title: 'The Five Behaviors® Certification',
    description: 'Based on Patrick Lencioni\'s bestselling "The Five Dysfunctions of a Team." Learn to build trust, drive healthy conflict, and create accountability in any team environment.',
    image: '/images/cert-five-behaviors.png',
    duration: '2 weeks (20 hours)',
    format: 'Live online + self-paced',
    exam: '80% to pass',
    credits: '20 SHRM/HRCI PDCs',
  },
];

const NP_EDGE_CERTS = [
  {
    type: 'nonprofit-edge',
    title: 'Nonprofit Governance Certification',
    description: 'For board members and executives who want to master nonprofit governance. Learn fiduciary responsibilities, strategic oversight, board-staff dynamics, and how to build a high-performing board.',
    image: '/images/cert-governance.jpg',
    duration: '4 weeks',
    format: 'Live online sessions',
    exam: 'Final assessment required',
    credits: 'The Nonprofit Edge',
  },
  {
    type: 'nonprofit-edge',
    title: 'Nonprofit Consultant Certification',
    description: 'For aspiring and practicing consultants who want to serve the nonprofit sector. Learn consulting frameworks, client engagement, facilitation skills, and how to deliver strategic value.',
    image: '/images/cert-consultant.jpg',
    duration: '6 weeks',
    format: 'Live online sessions',
    exam: 'Final assessment required',
    credits: 'The Nonprofit Edge',
  },
  {
    type: 'nonprofit-edge',
    title: 'Strategic Leadership Certification',
    description: 'For nonprofit executives ready to elevate their leadership. Master strategic thinking, change management, organizational culture, and the skills needed to lead with clarity and impact.',
    image: '/images/cert-leadership.jpg',
    duration: '6 weeks',
    format: 'Live online sessions',
    exam: 'Final assessment required',
    credits: 'The Nonprofit Edge',
  },
];

const BENEFITS = [
  { icon: '📋', title: 'Advance Your Career', desc: 'Stand out with recognized credentials that signal expertise to employers and clients.' },
  { icon: '🎯', title: 'Deepen Your Expertise', desc: 'Go beyond surface knowledge with rigorous training from experienced practitioners.' },
  { icon: '🤝', title: 'Join a Community', desc: 'Connect with fellow professionals committed to nonprofit excellence.' },
  { icon: '💡', title: 'Apply Immediately', desc: 'Every certification includes practical tools you can use right away.' },
  { icon: '✅', title: 'Earn PDCs', desc: 'Partner certifications count toward SHRM, HRCI, ATD, and ICF recertification.' },
  { icon: '🏆', title: 'Lifetime Credential', desc: 'Your certification doesn\'t expire—it\'s a permanent addition to your credentials.' },
];

const STEPS = [
  { num: 1, title: 'Choose Your Program', desc: 'Select the certification that matches your goals' },
  { num: 2, title: 'Complete Training', desc: 'Attend live sessions and finish coursework' },
  { num: 3, title: 'Pass the Exam', desc: 'Demonstrate mastery with final assessment' },
  { num: 4, title: 'Get Certified', desc: 'Receive your credential and start applying' },
];

interface CertificationsLandingProps {
  navigate?: (path: string) => void;
}

const CertCard: React.FC<{ cert: typeof PARTNER_CERTS[0]; reverse?: boolean }> = ({ cert, reverse }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: reverse ? '1.2fr 1fr' : '1fr 1.2fr',
    gap: 0,
    background: COLORS.white,
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginBottom: '40px',
    border: `1px solid ${COLORS.gray200}`,
  }}>
    {!reverse && (
      <div style={{ minHeight: '320px', background: COLORS.gray100, position: 'relative' }}>
        <img src={cert.image} alt={cert.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }} />
      </div>
    )}
    <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <span style={{
        display: 'inline-block', padding: '6px 14px', borderRadius: '20px', fontSize: '12px',
        fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px', width: 'fit-content',
        background: cert.type === 'partner' ? 'rgba(0,151,169,0.1)' : 'rgba(13,44,84,0.1)',
        color: cert.type === 'partner' ? COLORS.teal : COLORS.navy,
      }}>
        {cert.type === 'partner' ? 'Partner Certification' : 'Nonprofit Edge Certification'}
      </span>
      <h3 style={{ fontSize: '28px', fontWeight: 700, color: COLORS.navy, marginBottom: '16px' }}>{cert.title}</h3>
      <p style={{ fontSize: '16px', color: COLORS.gray600, marginBottom: '24px', lineHeight: 1.7 }}>{cert.description}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Duration', value: cert.duration },
          { label: 'Format', value: cert.format },
          { label: 'Exam', value: cert.exam },
          { label: 'Credits', value: cert.credits },
        ].map((detail, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: COLORS.gray600 }}>
            <span style={{ color: COLORS.teal }}>✓</span>
            <span><strong>{detail.label}:</strong> {detail.value}</span>
          </div>
        ))}
      </div>
      <a href="#" style={{ color: COLORS.teal, fontWeight: 600, fontSize: '15px', textDecoration: 'none' }}>
        Learn More & Register →
      </a>
    </div>
    {reverse && (
      <div style={{ minHeight: '320px', background: COLORS.gray100, position: 'relative' }}>
        <img src={cert.image} alt={cert.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }} />
      </div>
    )}
  </div>
);

const CertificationsLanding: React.FC<CertificationsLandingProps> = ({ navigate }) => {
  return (
    <div style={{ minHeight: '100vh', background: COLORS.white, fontFamily: "'Inter', sans-serif" }}>
      
      {/* HERO */}
      <section style={{
        padding: '80px 24px',
        background: `linear-gradient(135deg, ${COLORS.navy} 0%, #1a4070 100%)`,
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{
            display: 'inline-block', background: COLORS.teal, color: COLORS.white,
            padding: '8px 20px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px',
          }}>Professional Development</span>
          <h1 style={{ fontSize: '48px', fontWeight: 800, color: COLORS.white, marginBottom: '20px', lineHeight: 1.2 }}>
            Earn Credentials That<br />Advance Your Career
          </h1>
          <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.85)', maxWidth: '700px', margin: '0 auto' }}>
            Industry-recognized certifications from trusted partners and exclusive programs designed specifically for nonprofit professionals.
          </p>
        </div>
      </section>

      {/* PARTNER CERTIFICATIONS */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 700, color: COLORS.navy, marginBottom: '12px' }}>
              Partner Certifications
            </h2>
            <p style={{ fontSize: '18px', color: COLORS.gray500, maxWidth: '600px', margin: '0 auto' }}>
              Globally recognized credentials from Wiley's Everything DiSC® and The Five Behaviors® programs. We're an authorized partner.
            </p>
          </div>
          {PARTNER_CERTS.map((cert, i) => (
            <CertCard key={i} cert={cert} reverse={i % 2 === 1} />
          ))}
        </div>
      </section>

      {/* NONPROFIT EDGE CERTIFICATIONS */}
      <section style={{ padding: '80px 24px', background: COLORS.gray50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 700, color: COLORS.navy, marginBottom: '12px' }}>
              The Nonprofit Edge Certifications
            </h2>
            <p style={{ fontSize: '18px', color: COLORS.gray500, maxWidth: '600px', margin: '0 auto' }}>
              Exclusive credentials developed by Dr. Lyn Corbett, drawing on 25+ years of nonprofit leadership experience.
            </p>
          </div>
          {NP_EDGE_CERTS.map((cert, i) => (
            <CertCard key={i} cert={cert} reverse={i % 2 === 1} />
          ))}
        </div>
      </section>

      {/* WHY GET CERTIFIED */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 700, color: COLORS.navy, marginBottom: '12px' }}>
              Why Get Certified?
            </h2>
            <p style={{ fontSize: '18px', color: COLORS.gray500 }}>
              Credentials that demonstrate expertise and open doors
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {BENEFITS.map((benefit, i) => (
              <div key={i} style={{
                background: COLORS.white, borderRadius: '12px', padding: '32px',
                border: `1px solid ${COLORS.gray200}`, textAlign: 'center',
              }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>{benefit.icon}</div>
                <h4 style={{ fontSize: '18px', fontWeight: 700, color: COLORS.navy, marginBottom: '8px' }}>{benefit.title}</h4>
                <p style={{ fontSize: '15px', color: COLORS.gray600 }}>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 24px', background: COLORS.gray50 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 700, color: COLORS.navy, marginBottom: '12px' }}>
              How It Works
            </h2>
            <p style={{ fontSize: '18px', color: COLORS.gray500 }}>
              A simple path from enrollment to certification
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {STEPS.map((step) => (
              <div key={step.num} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '60px', height: '60px', background: COLORS.navy, color: COLORS.white,
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px', fontWeight: 700, margin: '0 auto 16px',
                }}>{step.num}</div>
                <h4 style={{ fontSize: '18px', fontWeight: 700, color: COLORS.navy, marginBottom: '8px' }}>{step.title}</h4>
                <p style={{ fontSize: '14px', color: COLORS.gray600 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 24px',
        background: `linear-gradient(135deg, ${COLORS.navy} 0%, #1a4070 100%)`,
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 700, color: COLORS.white, marginBottom: '16px' }}>
            Ready to Elevate Your Expertise?
          </h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.85)', marginBottom: '32px' }}>
            Explore upcoming certification cohorts or contact us to discuss which program is right for you.
          </p>
          <a href="#" style={{
            display: 'inline-block', padding: '16px 32px', fontSize: '16px', fontWeight: 600,
            background: COLORS.white, color: COLORS.navy, borderRadius: '10px', textDecoration: 'none',
          }}>
            View Upcoming Cohorts →
          </a>
        </div>
      </section>
    </div>
  );
};

export default CertificationsLanding;
