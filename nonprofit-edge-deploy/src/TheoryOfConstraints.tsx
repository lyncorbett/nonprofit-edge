/**
 * THE NONPROFIT EDGE - Theory of Constraints Page
 * Educational content about TOC methodology and how it applies to nonprofits
 */

import React, { useState } from 'react';

// ============================================
// COLORS
// ============================================
const COLORS = {
  navy: '#0D2C54',
  navyLight: '#1a4175',
  teal: '#0097A9',
  tealDark: '#007d8c',
  white: '#ffffff',
  gray50: '#f8fafc',
  gray100: '#f1f5f9',
  gray200: '#e2e8f0',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray900: '#111827',
};

// ============================================
// CONTENT
// ============================================
const FIVE_FOCUSING_STEPS = [
  {
    step: 1,
    title: 'IDENTIFY',
    subtitle: 'Find the Constraint',
    description: 'Identify the single biggest bottleneck limiting your organization\'s ability to achieve its goal. This is your constraint.',
    example: 'A food bank discovers that their single delivery truck is the constraint limiting how many families they can serve.',
    icon: '🔍',
  },
  {
    step: 2,
    title: 'EXPLOIT',
    subtitle: 'Maximize the Constraint',
    description: 'Get the most out of your constraint without spending money. Ensure it\'s never idle and always working on the highest priority items.',
    example: 'The food bank optimizes delivery routes and schedules pickups so the truck is never waiting.',
    icon: '⚡',
  },
  {
    step: 3,
    title: 'SUBORDINATE',
    subtitle: 'Align Everything Else',
    description: 'Align all other resources and processes to support the constraint. Non-constraints should not produce more than the constraint can handle.',
    example: 'Volunteers pack food boxes at a pace that matches the truck\'s delivery capacity—no faster.',
    icon: '🔗',
  },
  {
    step: 4,
    title: 'ELEVATE',
    subtitle: 'Increase Capacity',
    description: 'If more throughput is needed, invest in increasing the constraint\'s capacity. This often requires resources.',
    example: 'The food bank fundraises to purchase a second delivery truck.',
    icon: '📈',
  },
  {
    step: 5,
    title: 'REPEAT',
    subtitle: 'Find the New Constraint',
    description: 'Once a constraint is broken, a new constraint will emerge. Go back to Step 1 and continue the improvement process.',
    example: 'With two trucks, the new constraint becomes warehouse space for food storage.',
    icon: '🔄',
  },
];

const CONSTRAINT_TYPES = [
  {
    type: 'Physical',
    description: 'Tangible limitations like equipment, space, or people',
    examples: ['Limited office space', 'Not enough staff', 'Outdated technology', 'Single vehicle for deliveries'],
    icon: '🏢',
  },
  {
    type: 'Policy',
    description: 'Rules, procedures, or decisions that limit performance',
    examples: ['Approval processes that slow decisions', 'Restrictions on who can be served', 'Outdated bylaws', 'Risk-averse culture'],
    icon: '📋',
  },
  {
    type: 'Market',
    description: 'External demand or funding limitations',
    examples: ['Limited donor base', 'Declining grant opportunities', 'Community unaware of services', 'Competition for funding'],
    icon: '📊',
  },
  {
    type: 'Knowledge',
    description: 'Lack of skills, expertise, or information',
    examples: ['Board lacks financial expertise', 'Staff need training', 'No data on program outcomes', 'Unclear best practices'],
    icon: '🧠',
  },
];

const NONPROFIT_APPLICATIONS = [
  {
    area: 'Strategic Planning',
    description: 'Focus your strategic plan on addressing the ONE constraint that matters most.',
    benefit: 'Stop spreading resources thin across dozens of initiatives.',
  },
  {
    area: 'Board Governance',
    description: 'Identify if your board is a constraint (policy) or an enabler of mission success.',
    benefit: 'Transform board meetings from status updates to strategic problem-solving.',
  },
  {
    area: 'Fundraising',
    description: 'Determine if funding is truly your constraint, or if something else limits impact.',
    benefit: 'Many nonprofits raise more money than they can effectively deploy.',
  },
  {
    area: 'Program Delivery',
    description: 'Find the bottleneck in your service delivery and optimize around it.',
    benefit: 'Serve more people without proportionally increasing costs.',
  },
];

// ============================================
// MAIN COMPONENT
// ============================================
interface TheoryOfConstraintsProps {
  navigate?: (path: string) => void;
}

const TheoryOfConstraints: React.FC<TheoryOfConstraintsProps> = ({ navigate }) => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [activeType, setActiveType] = useState<number | null>(null);

  const handleBack = () => {
    if (navigate) navigate('/dashboard');
    else window.location.href = '/dashboard';
  };

  const handleStartAssessment = () => {
    // Open the constraint assessment webhook
    window.open('https://thenonprofitedge.app.n8n.cloud/webhook/constraint-assessment', '_blank');
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={handleBack} style={styles.backButton}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <span style={styles.heroLabel}>THE NONPROFIT EDGE METHODOLOGY</span>
          <h1 style={styles.heroTitle}>Theory of Constraints</h1>
          <p style={styles.heroSubtitle}>
            A powerful framework for identifying and eliminating the single biggest 
            bottleneck preventing your organization from achieving its mission.
          </p>
          <div style={styles.heroActions}>
            <button onClick={handleStartAssessment} style={styles.primaryBtn}>
              Find Your Constraint →
            </button>
            <a href="#five-steps" style={styles.secondaryBtn}>
              Learn the Method
            </a>
          </div>
        </div>
        <div style={styles.heroVisual}>
          <div style={styles.chainLink}>
            <span style={styles.chainStrong}>💪</span>
            <span style={styles.chainWeak}>⛓️</span>
            <span style={styles.chainStrong}>💪</span>
          </div>
          <p style={styles.chainCaption}>
            "A chain is only as strong as its weakest link"
          </p>
        </div>
      </div>

      {/* The ONE Thing Quote */}
      <div style={styles.quoteSection}>
        <div style={styles.quoteCard}>
          <span style={styles.quoteMark}>"</span>
          <p style={styles.quoteText}>
            What's the ONE Thing you can do, such that by doing it, 
            everything else will be easier or unnecessary?
          </p>
          <p style={styles.quoteAuthor}>— Gary Keller, "The ONE Thing"</p>
        </div>
      </div>

      {/* What is TOC */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>What is Theory of Constraints?</h2>
          <p style={styles.sectionSubtitle}>
            Developed by Dr. Eliyahu Goldratt, TOC is a management philosophy that views 
            any system as being limited by a very small number of constraints.
          </p>
        </div>

        <div style={styles.conceptGrid}>
          <div style={styles.conceptCard}>
            <span style={styles.conceptIcon}>🎯</span>
            <h3 style={styles.conceptTitle}>Focus on What Matters</h3>
            <p style={styles.conceptText}>
              Instead of trying to improve everything, TOC helps you identify the ONE thing 
              that will have the biggest impact on your mission.
            </p>
          </div>
          <div style={styles.conceptCard}>
            <span style={styles.conceptIcon}>⛓️</span>
            <h3 style={styles.conceptTitle}>The Chain Analogy</h3>
            <p style={styles.conceptText}>
              Your organization is like a chain. Strengthening any link except the weakest 
              one does nothing to improve overall strength.
            </p>
          </div>
          <div style={styles.conceptCard}>
            <span style={styles.conceptIcon}>🚀</span>
            <h3 style={styles.conceptTitle}>Breakthrough Results</h3>
            <p style={styles.conceptText}>
              By focusing all energy on the constraint, organizations often achieve 
              dramatic improvements without additional resources.
            </p>
          </div>
        </div>
      </div>

      {/* Five Focusing Steps */}
      <div id="five-steps" style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>The Five Focusing Steps</h2>
          <p style={styles.sectionSubtitle}>
            TOC provides a simple, repeatable process for continuous improvement.
          </p>
        </div>

        <div style={styles.stepsContainer}>
          {FIVE_FOCUSING_STEPS.map((step, index) => (
            <div
              key={step.step}
              style={{
                ...styles.stepCard,
                ...(activeStep === index ? styles.stepCardActive : {}),
              }}
              onMouseEnter={() => setActiveStep(index)}
              onMouseLeave={() => setActiveStep(null)}
            >
              <div style={styles.stepNumber}>{step.step}</div>
              <div style={styles.stepIcon}>{step.icon}</div>
              <h3 style={styles.stepTitle}>{step.title}</h3>
              <p style={styles.stepSubtitle}>{step.subtitle}</p>
              <p style={styles.stepDescription}>{step.description}</p>
              
              {activeStep === index && (
                <div style={styles.stepExample}>
                  <span style={styles.exampleLabel}>Example:</span>
                  <p style={styles.exampleText}>{step.example}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Types of Constraints */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Types of Constraints</h2>
          <p style={styles.sectionSubtitle}>
            Understanding what kind of constraint you're facing helps determine the right solution.
          </p>
        </div>

        <div style={styles.typesGrid}>
          {CONSTRAINT_TYPES.map((type, index) => (
            <div
              key={type.type}
              style={{
                ...styles.typeCard,
                ...(activeType === index ? styles.typeCardActive : {}),
              }}
              onMouseEnter={() => setActiveType(index)}
              onMouseLeave={() => setActiveType(null)}
            >
              <span style={styles.typeIcon}>{type.icon}</span>
              <h3 style={styles.typeTitle}>{type.type} Constraint</h3>
              <p style={styles.typeDescription}>{type.description}</p>
              
              <div style={styles.examplesList}>
                <span style={styles.examplesLabel}>Common Examples:</span>
                <ul style={styles.examplesUl}>
                  {type.examples.map((ex, i) => (
                    <li key={i} style={styles.exampleLi}>{ex}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nonprofit Applications */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Applying TOC to Your Nonprofit</h2>
          <p style={styles.sectionSubtitle}>
            Here's how constraint thinking transforms common nonprofit challenges.
          </p>
        </div>

        <div style={styles.applicationsGrid}>
          {NONPROFIT_APPLICATIONS.map((app, index) => (
            <div key={index} style={styles.applicationCard}>
              <h3 style={styles.appTitle}>{app.area}</h3>
              <p style={styles.appDescription}>{app.description}</p>
              <div style={styles.appBenefit}>
                <span style={styles.benefitIcon}>✓</span>
                {app.benefit}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to Find Your Constraint?</h2>
          <p style={styles.ctaText}>
            Take our Core Constraint Assessment to identify the single biggest 
            bottleneck limiting your organization's impact.
          </p>
          <button onClick={handleStartAssessment} style={styles.ctaButton}>
            Start the Assessment →
          </button>
        </div>
      </div>

      {/* Resources */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Learn More</h2>
        </div>

        <div style={styles.resourcesGrid}>
          <div style={styles.resourceCard}>
            <span style={styles.resourceIcon}>📚</span>
            <h3 style={styles.resourceTitle}>The Goal</h3>
            <p style={styles.resourceAuthor}>by Eliyahu Goldratt</p>
            <p style={styles.resourceDesc}>The foundational book on TOC, told as a business novel.</p>
          </div>
          <div style={styles.resourceCard}>
            <span style={styles.resourceIcon}>📚</span>
            <h3 style={styles.resourceTitle}>The ONE Thing</h3>
            <p style={styles.resourceAuthor}>by Gary Keller</p>
            <p style={styles.resourceDesc}>Applying constraint thinking to personal productivity.</p>
          </div>
          <div style={styles.resourceCard}>
            <span style={styles.resourceIcon}>📚</span>
            <h3 style={styles.resourceTitle}>It's Not Luck</h3>
            <p style={styles.resourceAuthor}>by Eliyahu Goldratt</p>
            <p style={styles.resourceDesc}>TOC applied to marketing, distribution, and strategy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// STYLES
// ============================================
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: COLORS.gray50,
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  header: {
    padding: '24px 48px',
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 500,
    color: COLORS.teal,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '8px',
  },

  // Hero
  hero: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '40px 48px 80px',
    background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyLight} 100%)`,
    gap: '60px',
  },
  heroContent: {
    flex: 1,
    maxWidth: '600px',
  },
  heroLabel: {
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '1px',
    color: COLORS.teal,
    marginBottom: '16px',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: 800,
    color: COLORS.white,
    marginBottom: '20px',
    lineHeight: 1.1,
  },
  heroSubtitle: {
    fontSize: '18px',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 1.7,
    marginBottom: '32px',
  },
  heroActions: {
    display: 'flex',
    gap: '16px',
  },
  primaryBtn: {
    padding: '16px 32px',
    fontSize: '16px',
    fontWeight: 600,
    color: COLORS.white,
    background: COLORS.teal,
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  secondaryBtn: {
    padding: '16px 32px',
    fontSize: '16px',
    fontWeight: 600,
    color: COLORS.white,
    background: 'transparent',
    border: `2px solid rgba(255,255,255,0.3)`,
    borderRadius: '10px',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  heroVisual: {
    textAlign: 'center',
  },
  chainLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '64px',
    marginBottom: '16px',
  },
  chainStrong: {
    opacity: 1,
  },
  chainWeak: {
    opacity: 0.5,
    filter: 'grayscale(50%)',
  },
  chainCaption: {
    fontSize: '14px',
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.6)',
  },

  // Quote
  quoteSection: {
    padding: '0 48px',
    marginTop: '-40px',
    marginBottom: '60px',
  },
  quoteCard: {
    background: COLORS.white,
    borderRadius: '16px',
    padding: '40px 48px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    position: 'relative',
    maxWidth: '800px',
    margin: '0 auto',
  },
  quoteMark: {
    position: 'absolute',
    top: '20px',
    left: '30px',
    fontSize: '80px',
    color: COLORS.teal,
    opacity: 0.2,
    fontFamily: 'Georgia, serif',
    lineHeight: 1,
  },
  quoteText: {
    fontSize: '24px',
    fontWeight: 500,
    color: COLORS.navy,
    lineHeight: 1.5,
    marginBottom: '16px',
    position: 'relative',
    zIndex: 1,
  },
  quoteAuthor: {
    fontSize: '14px',
    color: COLORS.teal,
    fontWeight: 600,
  },

  // Section
  section: {
    padding: '60px 48px',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '48px',
    maxWidth: '700px',
    margin: '0 auto 48px',
  },
  sectionTitle: {
    fontSize: '32px',
    fontWeight: 700,
    color: COLORS.navy,
    marginBottom: '16px',
  },
  sectionSubtitle: {
    fontSize: '18px',
    color: COLORS.gray500,
    lineHeight: 1.6,
  },

  // Concept Cards
  conceptGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  conceptCard: {
    background: COLORS.white,
    borderRadius: '14px',
    padding: '32px',
    textAlign: 'center',
    border: `1px solid ${COLORS.gray200}`,
  },
  conceptIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '20px',
  },
  conceptTitle: {
    fontSize: '18px',
    fontWeight: 700,
    color: COLORS.navy,
    marginBottom: '12px',
  },
  conceptText: {
    fontSize: '14px',
    color: COLORS.gray600,
    lineHeight: 1.6,
  },

  // Steps
  stepsContainer: {
    display: 'flex',
    gap: '16px',
    maxWidth: '1200px',
    margin: '0 auto',
    overflowX: 'auto',
    padding: '20px 0',
  },
  stepCard: {
    flex: '1 0 200px',
    background: COLORS.white,
    borderRadius: '14px',
    padding: '28px 24px',
    textAlign: 'center',
    border: `1px solid ${COLORS.gray200}`,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    minHeight: '280px',
  },
  stepCardActive: {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0,151,169,0.2)',
    borderColor: COLORS.teal,
  },
  stepNumber: {
    width: '36px',
    height: '36px',
    background: COLORS.teal,
    color: COLORS.white,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 700,
    margin: '0 auto 16px',
  },
  stepIcon: {
    fontSize: '32px',
    marginBottom: '12px',
  },
  stepTitle: {
    fontSize: '16px',
    fontWeight: 800,
    color: COLORS.navy,
    letterSpacing: '0.5px',
    marginBottom: '4px',
  },
  stepSubtitle: {
    fontSize: '13px',
    color: COLORS.teal,
    fontWeight: 600,
    marginBottom: '12px',
  },
  stepDescription: {
    fontSize: '13px',
    color: COLORS.gray600,
    lineHeight: 1.5,
  },
  stepExample: {
    marginTop: '16px',
    padding: '12px',
    background: COLORS.gray50,
    borderRadius: '8px',
    textAlign: 'left',
  },
  exampleLabel: {
    fontSize: '11px',
    fontWeight: 700,
    color: COLORS.teal,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  exampleText: {
    fontSize: '12px',
    color: COLORS.gray700,
    lineHeight: 1.5,
    marginTop: '4px',
  },

  // Types
  typesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  typeCard: {
    background: COLORS.white,
    borderRadius: '14px',
    padding: '28px',
    border: `1px solid ${COLORS.gray200}`,
    transition: 'all 0.2s ease',
  },
  typeCardActive: {
    borderColor: COLORS.teal,
    boxShadow: '0 8px 30px rgba(0,151,169,0.15)',
  },
  typeIcon: {
    fontSize: '36px',
    display: 'block',
    marginBottom: '16px',
  },
  typeTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: COLORS.navy,
    marginBottom: '8px',
  },
  typeDescription: {
    fontSize: '13px',
    color: COLORS.gray600,
    lineHeight: 1.5,
    marginBottom: '16px',
  },
  examplesList: {
    borderTop: `1px solid ${COLORS.gray100}`,
    paddingTop: '16px',
  },
  examplesLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: COLORS.gray500,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  examplesUl: {
    margin: '8px 0 0 0',
    padding: '0 0 0 16px',
  },
  exampleLi: {
    fontSize: '12px',
    color: COLORS.gray600,
    marginBottom: '4px',
  },

  // Applications
  applicationsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  applicationCard: {
    background: COLORS.white,
    borderRadius: '14px',
    padding: '28px',
    border: `1px solid ${COLORS.gray200}`,
  },
  appTitle: {
    fontSize: '18px',
    fontWeight: 700,
    color: COLORS.navy,
    marginBottom: '12px',
  },
  appDescription: {
    fontSize: '14px',
    color: COLORS.gray600,
    lineHeight: 1.6,
    marginBottom: '16px',
  },
  appBenefit: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    fontSize: '13px',
    color: COLORS.teal,
    fontWeight: 500,
    background: `${COLORS.teal}10`,
    padding: '12px',
    borderRadius: '8px',
  },
  benefitIcon: {
    fontWeight: 700,
  },

  // CTA
  ctaSection: {
    background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyLight} 100%)`,
    padding: '80px 48px',
    textAlign: 'center',
  },
  ctaContent: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  ctaTitle: {
    fontSize: '32px',
    fontWeight: 700,
    color: COLORS.white,
    marginBottom: '16px',
  },
  ctaText: {
    fontSize: '18px',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 1.6,
    marginBottom: '32px',
  },
  ctaButton: {
    padding: '18px 40px',
    fontSize: '17px',
    fontWeight: 600,
    color: COLORS.navy,
    background: COLORS.white,
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
  },

  // Resources
  resourcesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  resourceCard: {
    background: COLORS.white,
    borderRadius: '14px',
    padding: '28px',
    textAlign: 'center',
    border: `1px solid ${COLORS.gray200}`,
  },
  resourceIcon: {
    fontSize: '40px',
    display: 'block',
    marginBottom: '16px',
  },
  resourceTitle: {
    fontSize: '18px',
    fontWeight: 700,
    color: COLORS.navy,
    marginBottom: '4px',
  },
  resourceAuthor: {
    fontSize: '13px',
    color: COLORS.teal,
    fontWeight: 500,
    marginBottom: '12px',
  },
  resourceDesc: {
    fontSize: '13px',
    color: COLORS.gray600,
    lineHeight: 1.5,
  },
};

export default TheoryOfConstraints;
