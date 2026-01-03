/**
 * THE NONPROFIT EDGE - Generic Tool Landing Page
 * Use this as a template for tools that don't have custom landing pages yet
 */

import React from 'react';

interface ToolLandingProps {
  toolName: string;
  toolDescription: string;
  icon: string;
  features: string[];
  heroImage?: string;
  onNavigate: (route: string) => void;
  onGetStarted: () => void;
}

const NAVY = '#0D2C54';
const TEAL = '#0097A9';

const ToolLanding: React.FC<ToolLandingProps> = ({
  toolName,
  toolDescription,
  icon,
  features,
  heroImage,
  onNavigate,
  onGetStarted,
}) => {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <header style={{ 
        background: 'white', 
        padding: '16px 32px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: '1px solid #e2e8f0' 
      }}>
        <div 
          onClick={() => onNavigate('/')} 
          style={{ cursor: 'pointer', fontWeight: 700, fontSize: '1.25rem', color: NAVY }}
        >
          The Nonprofit Edge
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => onNavigate('/login')} 
            style={{ 
              padding: '10px 20px', 
              background: 'white', 
              color: NAVY, 
              border: `2px solid ${NAVY}`, 
              borderRadius: '8px', 
              fontWeight: 600, 
              cursor: 'pointer' 
            }}
          >
            Log In
          </button>
          <button 
            onClick={() => onNavigate('/signup')} 
            style={{ 
              padding: '10px 20px', 
              background: TEAL, 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: 600, 
              cursor: 'pointer' 
            }}
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div style={{ 
        background: `linear-gradient(135deg, ${NAVY} 0%, #164e63 100%)`, 
        color: 'white', 
        padding: '80px 32px', 
        textAlign: 'center' 
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>{icon}</div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', fontWeight: 700 }}>{toolName}</h1>
        <p style={{ 
          fontSize: '1.25rem', 
          opacity: 0.9, 
          maxWidth: '600px', 
          margin: '0 auto 32px' 
        }}>
          {toolDescription}
        </p>
        <button 
          onClick={onGetStarted} 
          style={{ 
            padding: '16px 48px', 
            background: TEAL, 
            color: 'white', 
            border: 'none', 
            borderRadius: '10px', 
            fontSize: '1.125rem', 
            fontWeight: 600, 
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}
        >
          Start Assessment →
        </button>
      </div>

      {/* Features Section */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '64px 32px' }}>
        <h2 style={{ textAlign: 'center', color: NAVY, marginBottom: '40px', fontSize: '1.75rem' }}>
          What You'll Get
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '24px' 
        }}>
          {features.map((feature, i) => (
            <div 
              key={i} 
              style={{ 
                background: 'white', 
                padding: '24px', 
                borderRadius: '12px', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}
            >
              <div style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: '50%', 
                background: TEAL, 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                flexShrink: 0
              }}>
                ✓
              </div>
              <p style={{ margin: 0, color: '#475569' }}>{feature}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ 
        background: '#f1f5f9', 
        padding: '64px 32px', 
        textAlign: 'center' 
      }}>
        <h2 style={{ color: NAVY, marginBottom: '16px' }}>Ready to get started?</h2>
        <p style={{ color: '#64748b', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
          Join hundreds of nonprofit leaders using The Nonprofit Edge to strengthen their organizations.
        </p>
        <button 
          onClick={onGetStarted} 
          style={{ 
            padding: '14px 40px', 
            background: NAVY, 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            fontSize: '1rem', 
            fontWeight: 600, 
            cursor: 'pointer' 
          }}
        >
          Start Free Trial
        </button>
      </div>

      {/* Footer */}
      <footer style={{ 
        background: NAVY, 
        color: 'white', 
        padding: '32px', 
        textAlign: 'center' 
      }}>
        <p style={{ margin: 0, opacity: 0.8 }}>
          © 2026 The Nonprofit Edge. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default ToolLanding;

// ============================================
// PRE-CONFIGURED LANDING PAGES
// ============================================

export const StrategicPlanCheckupLanding: React.FC<{ onNavigate: (r: string) => void; onGetStarted: () => void }> = (props) => (
  <ToolLanding
    toolName="Strategic Plan Check-Up"
    toolDescription="Get AI-powered analysis of your strategic plan's health. Identify gaps, strengthen alignment, and ensure your plan drives real impact."
    icon="📊"
    features={[
      "Overall health assessment of your strategic plan",
      "Analysis of goals, objectives, and alignment",
      "Identification of gaps and areas for improvement",
      "PIVOT framework evaluation",
      "Actionable recommendations for strengthening your plan",
      "Downloadable PDF report"
    ]}
    {...props}
  />
);

export const BoardAssessmentLanding: React.FC<{ onNavigate: (r: string) => void; onGetStarted: () => void }> = (props) => (
  <ToolLanding
    toolName="Board Assessment"
    toolDescription="Evaluate your board's effectiveness with our comprehensive assessment tool. Strengthen governance and unlock your board's full potential."
    icon="👥"
    features={[
      "Comprehensive board effectiveness evaluation",
      "Individual member assessments",
      "Governance best practices analysis",
      "Engagement and participation metrics",
      "Actionable improvement recommendations",
      "Benchmarking against high-performing boards"
    ]}
    {...props}
  />
);

export const CEOEvaluationLanding: React.FC<{ onNavigate: (r: string) => void; onGetStarted: () => void }> = (props) => (
  <ToolLanding
    toolName="CEO Evaluation"
    toolDescription="Conduct a thorough, objective evaluation of executive leadership performance aligned with nonprofit best practices."
    icon="👤"
    features={[
      "360-degree leadership assessment",
      "Performance against strategic goals",
      "Board relationship evaluation",
      "Stakeholder engagement analysis",
      "Professional development recommendations",
      "Succession planning insights"
    ]}
    {...props}
  />
);

export const GrantReviewLanding: React.FC<{ onNavigate: (r: string) => void; onGetStarted: () => void }> = (props) => (
  <ToolLanding
    toolName="Grant/RFP Review"
    toolDescription="Get AI-powered feedback on your grant proposals before submission. Increase your chances of funding with expert-level analysis."
    icon="📝"
    features={[
      "Comprehensive proposal analysis",
      "Alignment with funder priorities",
      "Budget review and recommendations",
      "Narrative strength assessment",
      "Compliance check against RFP requirements",
      "Suggestions for strengthening your case"
    ]}
    {...props}
  />
);

export const AskTheProfessorLanding: React.FC<{ onNavigate: (r: string) => void; onGetStarted: () => void }> = (props) => (
  <ToolLanding
    toolName="Ask The Professor"
    toolDescription="Get instant, expert-level answers to your nonprofit leadership questions. AI coaching powered by decades of research and best practices."
    icon="🎓"
    features={[
      "24/7 access to AI coaching",
      "Answers grounded in nonprofit best practices",
      "Strategic planning guidance",
      "Board governance expertise",
      "Fundraising and development advice",
      "Leadership development support"
    ]}
    {...props}
  />
);
