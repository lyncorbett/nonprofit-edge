/**
 * THE NONPROFIT EDGE - Certifications Landing Page
 * Professional Development & Certification Programs
 */

import React from 'react';

const NAVY = '#0D2C54';
const TEAL = '#0097A9';

interface CertificationsLandingProps {
  onNavigate?: (path: string) => void;
}

const CertificationsLanding: React.FC<CertificationsLandingProps> = ({ onNavigate }) => {
  
  const certifications = {
    partner: [
      {
        id: 'disc',
        name: 'Everything DiSC® Certification',
        description: 'Master the world\'s most trusted behavioral assessment tool. Learn to administer, interpret, and facilitate DiSC workshops that transform how teams communicate and collaborate.',
        duration: '2 weeks (20 hours)',
        format: 'Live online + self-paced',
        exam: '80% to pass',
        credits: '20 SHRM/HRCI PDCs',
        image: '/images/cert-disc.jpg',
      },
      {
        id: 'five-behaviors',
        name: 'The Five Behaviors® Certification',
        description: 'Based on Patrick Lencioni\'s bestselling "The Five Dysfunctions of a Team." Learn to build trust, drive healthy conflict, and create accountability in any team environment.',
        duration: '2 weeks (20 hours)',
        format: 'Live online + self-paced',
        exam: '80% to pass',
        credits: '20 SHRM/HRCI PDCs',
        image: '/images/cert-five-behaviors.jpg',
      },
    ],
    nonprofitEdge: [
      {
        id: 'governance',
        name: 'Nonprofit Governance Certification',
        description: 'For board members and executives who want to master nonprofit governance. Learn fiduciary responsibilities, strategic oversight, board-staff dynamics, and how to build a high-performing board.',
        duration: '4 weeks',
        format: 'Live online sessions',
        exam: 'Final assessment required',
        certificate: 'The Nonprofit Edge',
        image: '/images/cert-governance.jpg',
      },
      {
        id: 'consultant',
        name: 'Nonprofit Consultant Certification',
        description: 'For aspiring and practicing consultants who want to serve the nonprofit sector. Learn consulting frameworks, client engagement, facilitation skills, and how to deliver strategic value.',
        duration: '6 weeks',
        format: 'Live online sessions',
        exam: 'Final assessment required',
        certificate: 'The Nonprofit Edge',
        image: '/images/cert-consultant.jpg',
      },
      {
        id: 'leadership',
        name: 'Strategic Leadership Certification',
        description: 'For nonprofit executives ready to elevate their leadership. Master strategic thinking, change management, organizational culture, and the skills needed to lead with clarity and impact.',
        duration: '6 weeks',
        format: 'Live online sessions',
        exam: 'Final assessment required',
        certificate: 'The Nonprofit Edge',
        image: '/images/cert-leadership.jpg',
      },
    ],
  };

  const benefits = [
    { icon: '📋', title: 'Advance Your Career', description: 'Stand out with recognized credentials that signal expertise to employers and clients.' },
    { icon: '🎯', title: 'Deepen Your Expertise', description: 'Go beyond surface knowledge with rigorous training from experienced practitioners.' },
    { icon: '🤝', title: 'Join a Community', description: 'Connect with fellow professionals committed to nonprofit excellence.' },
    { icon: '💡', title: 'Apply Immediately', description: 'Every certification includes practical tools you can use right away.' },
    { icon: '✅', title: 'Earn PDCs', description: 'Partner certifications count toward SHRM, HRCI, ATD, and ICF recertification.' },
    { icon: '🏆', title: 'Lifetime Credential', description: 'Your certification doesn\'t expire—it\'s a permanent addition to your credentials.' },
  ];

  const steps = [
    { number: 1, title: 'Choose Your Program', description: 'Select the certification that matches your goals' },
    { number: 2, title: 'Complete Training', description: 'Attend live sessions and finish coursework' },
    { number: 3, title: 'Pass the Exam', description: 'Demonstrate mastery with final assessment' },
    { number: 4, title: 'Get Certified', description: 'Receive your credential and start applying' },
  ];

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: '#374151',
      lineHeight: 1.6,
    },
    hero: {
      padding: '80px 24px',
      background: `linear-gradient(135deg, ${NAVY} 0%, #1a4070 100%)`,
      textAlign: 'center' as const,
    },
    heroBadge: {
      display: 'inline-block',
      background: TEAL,
      color: 'white',
      padding: '8px 20px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: 600,
      textTransform: 'uppercase' as const,
      letterSpacing: '1px',
      marginBottom: '24px',
    },
    heroTitle: {
      fontSize: '48px',
      fontWeight: 800,
      color: 'white',
      marginBottom: '20px',
      lineHeight: 1.2,
    },
    heroSubtitle: {
      fontSize: '20px',
      color: 'rgba(255, 255, 255, 0.85)',
      maxWidth: '700px',
      margin: '0 auto',
    },
    section: {
      padding: '80px 24px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    sectionHeader: {
      textAlign: 'center' as const,
      marginBottom: '48px',
    },
    sectionTitle: {
      fontSize: '36px',
      fontWeight: 700,
      color: NAVY,
      marginBottom: '12px',
    },
    sectionSubtitle: {
      fontSize: '18px',
      color: '#6b7280',
      maxWidth: '600px',
      margin: '0 auto',
    },
    certCard: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.2fr',
      gap: 0,
      background: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      marginBottom: '40px',
      border: '1px solid #e5e7eb',
    },
    certCardReverse: {
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
      gap: 0,
      background: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      marginBottom: '40px',
      border: '1px solid #e5e7eb',
    },
    certImage: {
      minHeight: '320px',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    certContent: {
      padding: '40px',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
    },
    certType: {
      display: 'inline-block',
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 600,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
      marginBottom: '16px',
      width: 'fit-content',
    },
    certTypePartner: {
      background: 'rgba(0, 151, 169, 0.1)',
      color: TEAL,
    },
    certTypeEdge: {
      background: 'rgba(13, 44, 84, 0.1)',
      color: NAVY,
    },
    certTitle: {
      fontSize: '28px',
      fontWeight: 700,
      color: NAVY,
      marginBottom: '16px',
    },
    certDesc: {
      fontSize: '16px',
      color: '#4b5563',
      marginBottom: '24px',
      lineHeight: 1.7,
    },
    certDetails: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
      marginBottom: '24px',
    },
    certDetail: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: '#4b5563',
    },
    certDetailIcon: {
      color: TEAL,
      fontWeight: 600,
    },
    certCta: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: TEAL,
      color: 'white',
      padding: '14px 28px',
      borderRadius: '8px',
      fontWeight: 600,
      fontSize: '15px',
      textDecoration: 'none',
      width: 'fit-content',
      cursor: 'pointer',
      border: 'none',
    },
    benefitsSection: {
      padding: '80px 24px',
      background: '#f9fafb',
    },
    benefitsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '24px',
      maxWidth: '1000px',
      margin: '0 auto',
    },
    benefitCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '32px 24px',
      textAlign: 'center' as const,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      border: '1px solid #e5e7eb',
    },
    benefitIcon: {
      width: '56px',
      height: '56px',
      background: 'rgba(0, 151, 169, 0.1)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      fontSize: '24px',
    },
    benefitTitle: {
      fontSize: '18px',
      fontWeight: 700,
      color: NAVY,
      marginBottom: '8px',
    },
    benefitDesc: {
      fontSize: '14px',
      color: '#6b7280',
      lineHeight: 1.6,
    },
    processSection: {
      padding: '80px 24px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    processSteps: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '32px',
      maxWidth: '1000px',
      margin: '0 auto',
    },
    processStep: {
      textAlign: 'center' as const,
    },
    stepNumber: {
      width: '64px',
      height: '64px',
      background: NAVY,
      color: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      fontWeight: 700,
      margin: '0 auto 20px',
    },
    stepTitle: {
      fontSize: '18px',
      fontWeight: 700,
      color: NAVY,
      marginBottom: '8px',
    },
    stepDesc: {
      fontSize: '14px',
      color: '#6b7280',
    },
    ctaSection: {
      padding: '80px 24px',
      background: NAVY,
      textAlign: 'center' as const,
    },
    ctaTitle: {
      fontSize: '36px',
      fontWeight: 700,
      color: 'white',
      marginBottom: '16px',
    },
    ctaSubtitle: {
      fontSize: '18px',
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: '32px',
      maxWidth: '600px',
      margin: '0 auto 32px',
    },
    ctaButton: {
      display: 'inline-flex',
      alignItems: 'center',
      background: 'white',
      color: NAVY,
      padding: '16px 32px',
      borderRadius: '8px',
      fontWeight: 600,
      fontSize: '16px',
      textDecoration: 'none',
      cursor: 'pointer',
      border: 'none',
    },
  };

  return (
    <div style={styles.container}>
      {/* Hero */}
      <section style={styles.hero}>
        <span style={styles.heroBadge}>Professional Development</span>
        <h1 style={styles.heroTitle}>Earn Credentials That Advance Your Career</h1>
        <p style={styles.heroSubtitle}>
          Gain recognized certifications in leadership assessment, team development, nonprofit governance, 
          and strategic consulting—all through live, online training with The Nonprofit Edge.
        </p>
      </section>

      {/* Partner Certifications */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Partner Certifications</h2>
          <p style={styles.sectionSubtitle}>
            Become certified in industry-leading assessment tools. As authorized distributors, 
            we'll guide you through the certification process and connect you with the official training.
          </p>
        </div>

        {certifications.partner.map((cert, index) => (
          <div key={cert.id} style={index % 2 === 0 ? styles.certCard : styles.certCardReverse}>
            {index % 2 === 0 ? (
              <>
                <div style={{ ...styles.certImage, backgroundImage: `url(${cert.image})` }} />
                <div style={styles.certContent}>
                  <span style={{ ...styles.certType, ...styles.certTypePartner }}>Partner Certification</span>
                  <h3 style={styles.certTitle}>{cert.name}</h3>
                  <p style={styles.certDesc}>{cert.description}</p>
                  <div style={styles.certDetails}>
                    <div style={styles.certDetail}>
                      <span style={styles.certDetailIcon}>✓</span>
                      <span><strong>Duration:</strong> {cert.duration}</span>
                    </div>
                    <div style={styles.certDetail}>
                      <span style={styles.certDetailIcon}>✓</span>
                      <span><strong>Format:</strong> {cert.format}</span>
                    </div>
                    <div style={styles.certDetail}>
                      <span style={styles.certDetailIcon}>✓</span>
                      <span><strong>Exam:</strong> {cert.exam}</span>
                    </div>
                    <div style={styles.certDetail}>
                      <span style={styles.certDetailIcon}>✓</span>
                      <span><strong>Credits:</strong> {cert.credits}</span>
                    </div>
                  </div>
                  <button style={styles.certCta}>Learn More & Register →</button>
                </div>
              </>
            ) : (
              <>
                <div style={styles.certContent}>
                  <span style={{ ...styles.certType, ...styles.certTypePartner }}>Partner Certification</span>
                  <h3 style={styles.certTitle}>{cert.name}</h3>
                  <p style={styles.certDesc}>{cert.description}</p>
                  <div style={styles.certDetails}>
                    <div style={styles.certDetail}>
                      <span style={styles.certDetailIcon}>✓</span>
                      <span><strong>Duration:</strong> {cert.duration}</span>
                    </div>
                    <div style={styles.certDetail}>
                      <span style={styles.certDetailIcon}>✓</span>
                      <span><strong>Format:</strong> {cert.format}</span>
                    </div>
                    <div style={styles.certDetail}>
                      <span style={styles.certDetailIcon}>✓</span>
                      <span><strong>Exam:</strong> {cert.exam}</span>
                    </div>
                    <div style={styles.certDetail}>
                      <span style={styles.certDetailIcon}>✓</span>
                      <span><strong>Credits:</strong> {cert.credits}</span>
                    </div>
                  </div>
                  <button style={styles.certCta}>Learn More & Register →</button>
                </div>
                <div style={{ ...styles.certImage, backgroundImage: `url(${cert.image})` }} />
              </>
            )}
          </div>
        ))}
      </section>

      {/* Nonprofit Edge Certifications */}
      <section style={{ ...styles.section, background: '#f9fafb', maxWidth: 'none', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>The Nonprofit Edge Certifications</h2>
            <p style={styles.sectionSubtitle}>
              Exclusive credentials developed by Dr. Lyn Corbett, drawing on 25+ years of nonprofit 
              leadership experience. Designed specifically for the nonprofit sector.
            </p>
          </div>

          {certifications.nonprofitEdge.map((cert, index) => (
            <div key={cert.id} style={index % 2 === 0 ? styles.certCard : styles.certCardReverse}>
              {index % 2 === 0 ? (
                <>
                  <div style={{ ...styles.certImage, backgroundImage: `url(${cert.image})` }} />
                  <div style={styles.certContent}>
                    <span style={{ ...styles.certType, ...styles.certTypeEdge }}>Nonprofit Edge Certification</span>
                    <h3 style={styles.certTitle}>{cert.name}</h3>
                    <p style={styles.certDesc}>{cert.description}</p>
                    <div style={styles.certDetails}>
                      <div style={styles.certDetail}>
                        <span style={styles.certDetailIcon}>✓</span>
                        <span><strong>Duration:</strong> {cert.duration}</span>
                      </div>
                      <div style={styles.certDetail}>
                        <span style={styles.certDetailIcon}>✓</span>
                        <span><strong>Format:</strong> {cert.format}</span>
                      </div>
                      <div style={styles.certDetail}>
                        <span style={styles.certDetailIcon}>✓</span>
                        <span><strong>Exam:</strong> {cert.exam}</span>
                      </div>
                      <div style={styles.certDetail}>
                        <span style={styles.certDetailIcon}>✓</span>
                        <span><strong>Certificate:</strong> {cert.certificate}</span>
                      </div>
                    </div>
                    <button style={styles.certCta}>Learn More & Register →</button>
                  </div>
                </>
              ) : (
                <>
                  <div style={styles.certContent}>
                    <span style={{ ...styles.certType, ...styles.certTypeEdge }}>Nonprofit Edge Certification</span>
                    <h3 style={styles.certTitle}>{cert.name}</h3>
                    <p style={styles.certDesc}>{cert.description}</p>
                    <div style={styles.certDetails}>
                      <div style={styles.certDetail}>
                        <span style={styles.certDetailIcon}>✓</span>
                        <span><strong>Duration:</strong> {cert.duration}</span>
                      </div>
                      <div style={styles.certDetail}>
                        <span style={styles.certDetailIcon}>✓</span>
                        <span><strong>Format:</strong> {cert.format}</span>
                      </div>
                      <div style={styles.certDetail}>
                        <span style={styles.certDetailIcon}>✓</span>
                        <span><strong>Exam:</strong> {cert.exam}</span>
                      </div>
                      <div style={styles.certDetail}>
                        <span style={styles.certDetailIcon}>✓</span>
                        <span><strong>Certificate:</strong> {cert.certificate}</span>
                      </div>
                    </div>
                    <button style={styles.certCta}>Learn More & Register →</button>
                  </div>
                  <div style={{ ...styles.certImage, backgroundImage: `url(${cert.image})` }} />
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Why Get Certified */}
      <section style={styles.benefitsSection}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Why Get Certified?</h2>
            <p style={styles.sectionSubtitle}>Credentials that demonstrate expertise and open doors</p>
          </div>
          <div style={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <div key={index} style={styles.benefitCard}>
                <div style={styles.benefitIcon}>{benefit.icon}</div>
                <h4 style={styles.benefitTitle}>{benefit.title}</h4>
                <p style={styles.benefitDesc}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={styles.processSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <p style={styles.sectionSubtitle}>A simple path from enrollment to certification</p>
        </div>
        <div style={styles.processSteps}>
          {steps.map((step) => (
            <div key={step.number} style={styles.processStep}>
              <div style={styles.stepNumber}>{step.number}</div>
              <h4 style={styles.stepTitle}>{step.title}</h4>
              <p style={styles.stepDesc}>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Ready to Elevate Your Expertise?</h2>
        <p style={styles.ctaSubtitle}>
          Explore upcoming certification cohorts or contact us to discuss which program is right for you.
        </p>
        <button style={styles.ctaButton}>View Upcoming Cohorts →</button>
      </section>
    </div>
  );
};

export default CertificationsLanding;
