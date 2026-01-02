import React, { useState, useEffect } from 'react';

// Import real components from components folder
import RealDashboard from './components/Dashboard';
import ResourceLibrary from './components/ResourceLibrary';
import EventsCalendar from './components/EventsCalendar';
import EnhancedOwnerDashboard from './components/EnhancedOwnerDashboard';
import MarketingDashboard from './components/MarketingDashboard';
import LinkManager from './components/LinkManager';
import TeamAccessManager from './components/TeamAccessManager';

// Import real tool components from src folder
import StrategicPlanCheckup from './StrategicPlanCheckup';
import CEOEvaluation from './CEOEvaluation';
import BoardAssessment from './BoardAssessment';
import GrantReview from './GrantReview';
import ScenarioPlanner from './ScenarioPlanner';
import AskTheProfessor from './AskTheProfessor';
import AISummary from './AISummary';

// Import landing pages from components folder
import ScenarioPlannerLanding from './components/ScenarioPlannerLanding';

// Types
interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'member';
  organization_id: string;
}

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>(window.location.pathname);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize once on mount
  useEffect(() => {
    // Handle browser navigation
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);

    // Check for saved user
    try {
      const savedUser = localStorage.getItem('nonprofit_edge_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Error loading user:', e);
    }
    
    setIsLoading(false);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
  };

  const handleLogin = (email: string) => {
    const newUser: User = {
      id: '1',
      email: email,
      name: email.split('@')[0],
      role: email.includes('owner') ? 'owner' : 'member',
      organization_id: 'org_1',
    };
    setUser(newUser);
    localStorage.setItem('nonprofit_edge_user', JSON.stringify(newUser));
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nonprofit_edge_user');
    navigate('/');
  };

  // Loading
  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <p style={{ color: '#64748b' }}>Loading...</p>
      </div>
    );
  }

  // ============================================
  // INLINE COMPONENTS (to avoid import issues)
  // ============================================

  // Logo SVG Component
  const Logo = ({ width = 180 }: { width?: number }) => (
    <svg width={width} height={width * 0.4} viewBox="250 270 500 220">
      <g>
        <path fill="#0D2C54" d="M438.46,469.14c-18.16,14.03-40.93,22.38-65.64,22.38c-30.79,0-58.55-12.94-78.16-33.69c2.85,0.46,5.7,0.81,8.57,1.06c9.13,0.79,17.9,0.49,26.26-0.63c12.72,7.44,27.53,11.71,43.33,11.71c17.17,0,33.17-5.03,46.59-13.71C422.94,460.11,428.93,465.14,438.46,469.14z"/>
        <path fill="#0D2C54" d="M294.86,420.29c-8.64,2.53-16.05,3.61-21.74,4.02c-5.05-12.44-7.82-26.05-7.82-40.31c0-59.37,48.14-107.52,107.52-107.52c25.62,0,49.15,8.96,67.62,23.94c-9.33,2.92-16.19,7.85-20.47,11.69c-13.54-8.9-29.74-14.08-47.15-14.08c-47.48,0-85.97,38.49-85.97,85.97C286.85,396.97,289.72,409.27,294.86,420.29z"/>
        <path fill="#0097A9" d="M258.67,434.74c0,0,61.28,14.58,121.38-60.61l-18.3-13.11l72.86-22.42l0.39,71.06l-18.78-13.01C416.22,396.64,340.29,479.82,258.67,434.74z"/>
        <g>
          <path fill="#0D2C54" d="M491.43,298.55v7.98h-9.88v32.91h-9.08v-32.91h-9.88v-7.98H491.43z"/>
          <path fill="#0D2C54" d="M528.3,298.55v40.89h-9.08V322.6h-14.13v16.83H496v-40.89h9.08v16.02h14.13v-16.02H528.3z"/>
          <path fill="#0D2C54" d="M543.91,306.53v8.27h12.17v7.69h-12.17v8.97h13.76v7.98h-22.84v-40.89h22.84v7.98H543.91z"/>
        </g>
        <g>
          <path fill="#0097A9" d="M495.94,392.68h-9.08l-15.19-25.22v25.22h-9.08v-40.89h9.08l15.19,25.34v-25.34h9.08V392.68z"/>
          <path fill="#0097A9" d="M510.53,390.41c-2.92-1.79-5.24-4.28-6.96-7.48c-1.72-3.2-2.58-6.8-2.58-10.8c0-4,0.86-7.59,2.58-10.78c1.72-3.18,4.04-5.67,6.96-7.46c2.92-1.79,6.14-2.68,9.64-2.68c3.51,0,6.72,0.89,9.64,2.68c2.92,1.79,5.22,4.27,6.91,7.46c1.68,3.18,2.52,6.78,2.52,10.78c0,4-0.85,7.6-2.55,10.8c-1.7,3.2-4,5.7-6.91,7.48c-2.9,1.79-6.11,2.68-9.62,2.68C516.66,393.09,513.45,392.19,510.53,390.41z M527.31,380.74c1.79-2.17,2.68-5.05,2.68-8.62c0-3.61-0.89-6.49-2.68-8.65c-1.79-2.15-4.17-3.23-7.15-3.23c-3.01,0-5.41,1.07-7.2,3.2c-1.79,2.14-2.68,5.03-2.68,8.68c0,3.61,0.89,6.49,2.68,8.65c1.79,2.16,4.19,3.23,7.2,3.23C523.14,384,525.52,382.91,527.31,380.74z"/>
          <path fill="#0097A9" d="M577.65,392.68h-9.08l-15.19-25.22v25.22h-9.08v-40.89h9.08l15.19,25.34v-25.34h9.08V392.68z"/>
          <path fill="#0097A9" d="M611.17,371.45c-0.99,1.96-2.52,3.54-4.57,4.75c-2.05,1.2-4.6,1.81-7.65,1.81h-5.63v14.68h-9.08v-40.89h14.72c2.98,0,5.49,0.56,7.54,1.69c2.05,1.13,3.59,2.68,4.62,4.66c1.03,1.98,1.54,4.25,1.54,6.81C612.66,367.32,612.16,369.49,611.17,371.45z M602.14,368.74c0.85-0.89,1.27-2.16,1.27-3.79c0-1.63-0.42-2.89-1.27-3.79c-0.85-0.89-2.14-1.34-3.88-1.34h-4.94v10.25h4.94C599.99,370.08,601.29,369.63,602.14,368.74z"/>
          <path fill="#0097A9" d="M636.4,392.68l-7.76-15.43h-2.18v15.43h-9.08v-40.89h15.25c2.94,0,5.45,0.56,7.52,1.69c2.07,1.13,3.62,2.67,4.65,4.63c1.03,1.96,1.54,4.15,1.54,6.55c0,2.72-0.7,5.15-2.1,7.28c-1.4,2.14-3.46,3.65-6.19,4.54l8.61,16.19H636.4z M626.47,370.2h5.63c1.66,0,2.91-0.45,3.75-1.34c0.83-0.89,1.25-2.16,1.25-3.79c0-1.55-0.42-2.78-1.25-3.67c-0.83-0.89-2.08-1.34-3.75-1.34h-5.63V370.2z"/>
          <path fill="#0097A9" d="M660.02,390.41c-2.92-1.79-5.24-4.28-6.96-7.48c-1.72-3.2-2.58-6.8-2.58-10.8c0-4,0.86-7.59,2.58-10.78c1.72-3.18,4.04-5.67,6.96-7.46c2.92-1.79,6.14-2.68,9.64-2.68c3.51,0,6.72,0.89,9.64,2.68c2.92,1.79,5.22,4.27,6.91,7.46c1.68,3.18,2.52,6.78,2.52,10.78c0,4-0.85,7.6-2.55,10.8c-1.7,3.2-4,5.7-6.91,7.48c-2.9,1.79-6.11,2.68-9.62,2.68C666.15,393.09,662.94,392.19,660.02,390.41z M676.8,380.74c1.79-2.17,2.68-5.05,2.68-8.62c0-3.61-0.89-6.49-2.68-8.65c-1.79-2.15-4.17-3.23-7.15-3.23c-3.01,0-5.41,1.07-7.2,3.2c-1.79,2.14-2.68,5.03-2.68,8.68c0,3.61,0.89,6.49,2.68,8.65c1.79,2.16,4.19,3.23,7.2,3.23C672.63,384,675.01,382.91,676.8,380.74z"/>
          <path fill="#0097A9" d="M718.05,351.79v7.98h-15.19v8.62h11.37v7.75h-11.37v16.54h-9.08v-40.89H718.05z"/>
          <path fill="#0097A9" d="M731.92,351.79v40.89h-9.08v-40.89H731.92z"/>
          <path fill="#0097A9" d="M765.33,351.79v7.98h-9.88v32.91h-9.08v-32.91h-9.88v-7.98H765.33z"/>
        </g>
        <g>
          <path fill="#0D2C54" d="M476.97,418.87v13.1h19.27v12.18h-19.27v14.21h21.8v12.64h-36.19v-64.78h36.19v12.64H476.97z"/>
          <path fill="#0D2C54" d="M546.58,410.29c4.66,2.71,8.26,6.51,10.82,11.4c2.55,4.89,3.83,10.54,3.83,16.93c0,6.34-1.28,11.97-3.83,16.89c-2.55,4.92-6.17,8.74-10.86,11.44c-4.69,2.71-10.11,4.06-16.29,4.06h-22.14v-64.78h22.14C536.48,406.23,541.92,407.58,546.58,410.29z M542.03,452.46c3.03-3.26,4.55-7.87,4.55-13.84c0-5.97-1.51-10.61-4.55-13.93c-3.03-3.32-7.27-4.98-12.71-4.98h-6.82v37.65h6.82C534.77,457.35,539,455.72,542.03,452.46z"/>
          <path fill="#0D2C54" d="M608.53,426.71c-1.07-2.15-2.6-3.8-4.59-4.94c-1.99-1.14-4.33-1.71-7.03-1.71c-4.66,0-8.39,1.68-11.19,5.03c-2.81,3.35-4.21,7.83-4.21,13.43c0,5.97,1.47,10.63,4.42,13.98c2.95,3.35,7,5.03,12.16,5.03c3.54,0,6.52-0.98,8.96-2.95c2.44-1.97,4.22-4.8,5.34-8.49h-18.26v-11.63h31.31v14.67c-1.07,3.94-2.88,7.6-5.43,10.98c-2.55,3.38-5.79,6.12-9.72,8.21c-3.93,2.09-8.36,3.14-13.3,3.14c-5.84,0-11.04-1.4-15.61-4.2c-4.57-2.8-8.14-6.69-10.69-11.67c-2.55-4.98-3.83-10.67-3.83-17.07c0-6.4,1.28-12.1,3.83-17.12c2.55-5.01,6.1-8.92,10.65-11.72c4.55-2.8,9.73-4.2,15.57-4.2c7.07,0,13.03,1.88,17.89,5.63c4.85,3.75,8.07,8.95,9.64,15.6H608.53z"/>
          <path fill="#0D2C54" d="M647.83,418.87v13.1h19.27v12.18h-19.27v14.21h21.8v12.64h-36.19v-64.78h36.19v12.64H647.83z"/>
        </g>
      </g>
    </svg>
  );

  // Homepage
  const Homepage = () => (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ background: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
        <Logo width={160} />
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/login')} style={{ padding: '10px 20px', background: 'white', color: '#0D2C54', border: '2px solid #0D2C54', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            Log In
          </button>
          <button onClick={() => navigate('/signup')} style={{ padding: '10px 20px', background: '#0097A9', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            Get Started
          </button>
        </div>
      </header>

      <div style={{ background: 'linear-gradient(135deg, #0D2C54 0%, #164e63 100%)', color: 'white', padding: '80px 32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>AI-Powered Tools for Nonprofit Leaders</h1>
        <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 32px' }}>
          Strategic assessments, coaching, and planning tools designed specifically for nonprofits.
        </p>
        <button onClick={() => navigate('/signup')} style={{ padding: '16px 48px', background: '#0097A9', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.125rem', fontWeight: 600, cursor: 'pointer' }}>
          Start Free Trial →
        </button>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '64px 32px' }}>
        <h2 style={{ textAlign: 'center', color: '#0D2C54', marginBottom: '40px' }}>Our Tools</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[
            { icon: '📊', name: 'Strategic Plan Check-Up', desc: 'Evaluate your strategy with PIVOT framework', route: '/tools/strategic-plan/info' },
            { icon: '👤', name: 'CEO Evaluation', desc: 'Comprehensive leadership assessment', route: '/tools/ceo-evaluation/info' },
            { icon: '👥', name: 'Board Assessment', desc: 'Evaluate board effectiveness', route: '/tools/board-assessment/info' },
            { icon: '📝', name: 'Grant Review', desc: 'AI feedback on proposals', route: '/tools/grant-review/info' },
            { icon: '🔮', name: 'Scenario Planner', desc: 'Plan for multiple futures', route: '/tools/scenario-planner/info' },
            { icon: '🎓', name: 'Ask The Professor', desc: 'AI coaching on demand', route: '/tools/ask-professor/info' },
          ].map((tool, i) => (
            <div 
              key={i} 
              onClick={() => navigate(tool.route)}
              style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{tool.icon}</div>
              <h3 style={{ margin: '0 0 8px 0', color: '#0D2C54' }}>{tool.name}</h3>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.9375rem' }}>{tool.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Login Page
  const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ background: 'white', padding: '48px', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Logo width={180} />
          </div>
          <h2 style={{ textAlign: 'center', color: '#0D2C54', marginBottom: '24px' }}>Welcome Back</h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }}
            />
            <button
              onClick={() => handleLogin(email)}
              style={{ padding: '14px', background: '#0097A9', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Log In
            </button>
          </div>
          <p style={{ textAlign: 'center', marginTop: '24px', color: '#64748b' }}>
            Don't have an account? <a onClick={() => navigate('/signup')} style={{ color: '#0097A9', cursor: 'pointer' }}>Sign up</a>
          </p>
        </div>
      </div>
    );
  };

  // Dashboard
  const Dashboard = () => (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <header style={{ background: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
        <Logo width={160} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#64748b' }}>Welcome, {user?.name}</span>
          <button onClick={handleLogout} style={{ padding: '8px 16px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Log Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
        <h1 style={{ color: '#0D2C54', marginBottom: '8px' }}>Dashboard</h1>
        <p style={{ color: '#64748b', marginBottom: '32px' }}>Access your tools and track progress</p>

        {/* Tools Grid */}
        <h2 style={{ color: '#0D2C54', marginBottom: '16px', fontSize: '1.25rem' }}>Your Tools</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {[
            { icon: '📊', name: 'Strategic Plan Check-Up', route: '/tools/strategic-plan', desc: 'Evaluate your strategic plan' },
            { icon: '👤', name: 'CEO Evaluation', route: '/tools/ceo-evaluation', desc: 'Leadership performance assessment' },
            { icon: '👥', name: 'Board Assessment', route: '/tools/board-assessment', desc: 'Board effectiveness review' },
            { icon: '📝', name: 'Grant Review', route: '/tools/grant-review', desc: 'AI-powered proposal feedback' },
            { icon: '🔮', name: 'Scenario Planner', route: '/tools/scenario-planner', desc: 'Plan for multiple futures' },
            { icon: '🎓', name: 'Ask The Professor', route: '/tools/ask-professor', desc: 'AI coaching assistance' },
            { icon: '✨', name: 'AI Summary', route: '/tools/ai-summary', desc: 'Document summarization' },
          ].map((tool, i) => (
            <div
              key={i}
              onClick={() => navigate(tool.route)}
              style={{
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                border: '2px solid transparent',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = '#0097A9';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{tool.icon}</div>
              <h3 style={{ margin: '0 0 8px 0', color: '#0D2C54' }}>{tool.name}</h3>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>{tool.desc}</p>
            </div>
          ))}
        </div>

        {/* Recently Used - Placeholder */}
        <h2 style={{ color: '#0D2C54', marginBottom: '16px', fontSize: '1.25rem' }}>Recently Used</h2>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', color: '#64748b', textAlign: 'center' }}>
          No recent activity yet. Start by using a tool above!
        </div>
      </div>
    </div>
  );

  // Tool Page Wrapper (adds logo header to external tool components)
  const ToolPageWrapper = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ background: 'white', padding: '12px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Logo width={140} />
          <span style={{ color: '#cbd5e1' }}>|</span>
          <span style={{ color: '#0D2C54', fontWeight: 600 }}>{title}</span>
        </div>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          ← Back to Dashboard
        </button>
      </header>
      {children}
    </div>
  );

  // Placeholder Tool Component
  const PlaceholderTool = ({ name }: { name: string }) => (
    <div style={{ padding: '48px 32px', textAlign: 'center' }}>
      <h2 style={{ color: '#0D2C54', marginBottom: '16px' }}>{name}</h2>
      <p style={{ color: '#64748b' }}>Tool component loading...</p>
    </div>
  );

  // ============================================
  // ROUTING
  // ============================================
  
  switch (currentRoute) {
    case '/':
      return <Homepage />;
    
    case '/login':
      return <LoginPage />;
    
    case '/signup':
      return <LoginPage />; // Reuse login for now
    
    case '/dashboard':
      if (!user) { navigate('/login'); return null; }
      // Provide all props the real Dashboard expects
      const mockOrganization = {
        id: user.organization_id,
        name: 'Your Organization',
        tier: 'professional',
        logo_url: null,
      };
      const mockUsage = {
        tools_started: 0,
        tools_completed: 0,
        tools_used_this_month: 0,
        downloads_this_month: 0,
        professor_sessions_this_month: 0,
        report_downloads: 0,
      };
      return (
        <RealDashboard 
          user={{
            ...user,
            full_name: user.name,
            avatar_url: null,
            profile_photo: null,
            created_at: new Date().toISOString(),
          }}
          organization={mockOrganization}
          usage={mockUsage}
          teamCount={1}
          onNavigate={(page: string) => {
            // Map Dashboard's page names to our routes
            const routeMap: Record<string, string> = {
              'dashboard': '/dashboard',
              'library': '/resources',
              'events': '/events',
              'team': '/team',
              'reports': '/reports',
              'settings': '/settings',
              'strategic-checkup': '/tools/strategic-plan',
              'ceo-evaluation': '/tools/ceo-evaluation',
              'board-assessment': '/tools/board-assessment',
              'scenario-planner': '/tools/scenario-planner',
              'grant-review': '/tools/grant-review',
              'content-manager': '/owner/content',
              'owner-dashboard': '/owner',
              'enhanced-owner': '/owner/enhanced',
              'marketing': '/owner/marketing',
              'link-manager': '/owner/links',
              'team-access': '/owner/team',
              'homepage-editor': '/owner/homepage',
            };
            navigate(routeMap[page] || `/${page}`);
          }}
          onDownload={(resourceId: string) => console.log('Download:', resourceId)}
          onStartProfessor={() => navigate('/tools/ask-professor')}
          onLogout={handleLogout}
        />
      );
    
    // ============================================
    // TOOL LANDING PAGES (Public - no login required)
    // ============================================
    case '/tools/scenario-planner/info':
      return <ScenarioPlannerLanding />;
    
    // Future landing pages can be added here:
    // case '/tools/strategic-plan/info':
    //   return <StrategicPlanLanding />;
    // case '/tools/board-assessment/info':
    //   return <BoardAssessmentLanding />;
    
    // ============================================
    // TOOL PAGES (Requires login)
    // ============================================
    case '/tools/strategic-plan':
      return <ToolPageWrapper title="Strategic Plan Check-Up"><StrategicPlanCheckup /></ToolPageWrapper>;
    
    case '/tools/ceo-evaluation':
      return <ToolPageWrapper title="CEO Evaluation"><CEOEvaluation /></ToolPageWrapper>;
    
    case '/tools/board-assessment':
      return <ToolPageWrapper title="Board Assessment"><BoardAssessment /></ToolPageWrapper>;
    
    case '/tools/grant-review':
      return <ToolPageWrapper title="Grant Review"><GrantReview /></ToolPageWrapper>;
    
    case '/tools/scenario-planner':
      return <ToolPageWrapper title="Scenario Planner"><ScenarioPlanner /></ToolPageWrapper>;
    
    case '/tools/ask-professor':
      return <ToolPageWrapper title="Ask The Professor"><AskTheProfessor /></ToolPageWrapper>;
    
    case '/tools/ai-summary':
      return <ToolPageWrapper title="AI Summary"><AISummary /></ToolPageWrapper>;
    
    // Resources & Events
    case '/resources':
      if (!user) { navigate('/login'); return null; }
      return (
        <ResourceLibrary 
          user={{ ...user, full_name: user.name }}
          organization={{ id: user.organization_id, name: 'Your Organization', tier: 'professional' }}
          onNavigate={(page: string) => navigate(page === 'dashboard' ? '/dashboard' : `/${page}`)}
          onLogout={handleLogout}
        />
      );
    
    case '/events':
      if (!user) { navigate('/login'); return null; }
      return (
        <EventsCalendar 
          user={{ ...user, full_name: user.name }}
          organization={{ id: user.organization_id, name: 'Your Organization', tier: 'professional' }}
          onNavigate={(page: string) => navigate(page === 'dashboard' ? '/dashboard' : `/${page}`)}
          onLogout={handleLogout}
        />
      );
    
    // Owner/Admin Pages
    case '/owner':
    case '/owner/enhanced':
      if (!user) { navigate('/login'); return null; }
      return <EnhancedOwnerDashboard onNavigate={(page: string) => navigate(`/${page}`)} />;
    
    case '/owner/marketing':
      if (!user) { navigate('/login'); return null; }
      return <MarketingDashboard />;
    
    case '/owner/links':
      if (!user) { navigate('/login'); return null; }
      return <LinkManager />;
    
    case '/owner/team':
      if (!user) { navigate('/login'); return null; }
      return <TeamAccessManager />;
    
    default:
      return <Homepage />;
  }
};

export default App;
