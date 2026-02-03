import React from 'react';

interface ScenarioPlannerLandingProps {
  onNavigate?: (route: string) => void;
  onGetStarted?: () => void;
}

const ScenarioPlannerLanding: React.FC<ScenarioPlannerLandingProps> = ({ onNavigate, onGetStarted }) => {
  const navigate = (path: string) => {
    if (onNavigate) onNavigate(path);
    else window.location.href = path;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ background: 'white', padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#0D2C54', fontWeight: 600 }}>← The Nonprofit Edge</button>
        <button onClick={() => navigate('/login')} style={{ padding: '8px 20px', background: '#0097A9', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Sign In</button>
      </header>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: '#0097A9', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 600, marginBottom: '24px' }}>Strategic Planning Tool</div>
        <h1 style={{ fontSize: '40px', fontWeight: 800, color: '#0D2C54', marginBottom: '16px' }}>PIVOT Scenario Planner</h1>
        <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
          Prepare for multiple futures with AI-powered scenario analysis. Model best-case, worst-case, and most-likely outcomes for your organization's key decisions.
        </p>
        <button onClick={onGetStarted || (() => navigate('/scenario-planner/use'))} style={{ padding: '14px 32px', background: '#0097A9', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}>
          Start Scenario Planning →
        </button>
        <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '16px' }}>Requires a free account</p>
      </div>
    </div>
  );
};

export default ScenarioPlannerLanding;