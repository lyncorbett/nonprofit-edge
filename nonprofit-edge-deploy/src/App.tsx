import React, { useState, useEffect } from 'react';

// Tool Pages - These are the new files you just uploaded
import ToolsPage from './ToolsPage';
import AskTheProfessor from './AskTheProfessor';
import CEOEvaluation from './CEOEvaluation';
import BoardAssessment from './BoardAssessment';
import GrantReview from './GrantReview';
import ScenarioPlanner from './ScenarioPlanner';
import AISummary from './AISummary';

// Types
interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'member';
  organization_id: string;
}

type Route = 
  | '/' 
  | '/tools'
  | '/tools/strategic-plan'
  | '/tools/ask-professor'
  | '/tools/ceo-evaluation'
  | '/tools/board-assessment'
  | '/tools/grant-review'
  | '/tools/scenario-planner'
  | '/tools/ai-summary';

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<Route>('/');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle browser back/forward buttons and initial route
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname as Route;
      setCurrentRoute(path || '/');
    };

    window.addEventListener('popstate', handlePopState);
    
    // Set initial route from URL
    const initialPath = window.location.pathname as Route;
    setCurrentRoute(initialPath || '/');

    // Simple auth check
    const savedUser = localStorage.getItem('nonprofit_edge_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
    
    setIsLoading(false);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: Route) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
  };

  const handleLogin = (email: string) => {
    const demoUser: User = {
      id: '1',
      email: email,
      name: email.split('@')[0],
      role: 'member',
      organization_id: 'org_1',
    };
    setUser(demoUser);
    localStorage.setItem('nonprofit_edge_user', JSON.stringify(demoUser));
    navigate('/tools');
  };

  // Loading state
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
        fontFamily: 'Source Sans Pro, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e2e8f0',
            borderTopColor: '#0097A9',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite',
          }} />
          <p style={{ color: '#64748b' }}>Loading...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Simple Homepage
  const Homepage = () => (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Source Sans Pro, sans-serif' }}>
      {/* Header */}
      <header style={{ background: '#0D2C54', color: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontFamily: 'Merriweather, serif' }}>The Nonprofit Edge</h1>
        <button 
          onClick={() => navigate('/tools')}
          style={{ padding: '10px 24px', background: '#0097A9', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
        >
          Enter Platform
        </button>
      </header>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0D2C54 0%, #164e63 100%)', color: 'white', padding: '80px 32px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', fontFamily: 'Merriweather, serif', marginBottom: '16px' }}>
          AI-Powered Tools for Nonprofit Leaders
        </h2>
        <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 32px' }}>
          Strategic assessments, coaching, and planning tools designed specifically for nonprofits.
        </p>
        <button 
          onClick={() => navigate('/tools')}
          style={{ padding: '16px 48px', background: '#0097A9', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.125rem', fontWeight: 600, cursor: 'pointer' }}
        >
          Explore Tools →
        </button>
      </div>

      {/* Tools Preview */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '64px 32px' }}>
        <h3 style={{ textAlign: 'center', fontFamily: 'Merriweather, serif', color: '#0D2C54', marginBottom: '40px' }}>
          Available Tools
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[
            { icon: '🎓', name: 'Ask The Professor', desc: 'AI coaching for any nonprofit challenge' },
            { icon: '👤', name: 'CEO Evaluation', desc: 'Comprehensive leadership assessment' },
            { icon: '📝', name: 'Grant Review', desc: 'AI feedback on your proposals' },
            { icon: '🔮', name: 'Scenario Planner', desc: 'Plan for best/worst case futures' },
            { icon: '✨', name: 'AI Summary', desc: 'Instant document summaries' },
            { icon: '📊', name: 'Strategic Plan Check-Up', desc: 'Evaluate your strategy' },
          ].map((tool, i) => (
            <div key={i} style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{tool.icon}</div>
              <h4 style={{ margin: '0 0 8px 0', color: '#0D2C54' }}>{tool.name}</h4>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.9375rem' }}>{tool.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Route rendering
  const renderRoute = () => {
    switch (currentRoute) {
      case '/':
        return <Homepage />;

      case '/tools':
        return <ToolsPage userTier="professional" onNavigate={navigate} />;
      
      case '/tools/ask-professor':
        return <AskTheProfessor />;
      
      case '/tools/ceo-evaluation':
        return <CEOEvaluation />;
      
      case '/tools/board-assessment':
        return <BoardAssessment />;
      
      case '/tools/grant-review':
        return <GrantReview />;
      
      case '/tools/scenario-planner':
        return <ScenarioPlanner />;
      
      case '/tools/ai-summary':
        return <AISummary />;

      default:
        // Handle any /tools/* routes that don't match
        if (currentRoute.startsWith('/tools')) {
          return <ToolsPage userTier="professional" onNavigate={navigate} />;
        }
        return <Homepage />;
    }
  };

  return renderRoute();
};

export default App;
