/**
 * THE NONPROFIT EDGE - App.tsx
 * Stable version with all components
 * UPDATED: January 30, 2026
 * 
 * LOGO: Uses /images/nonprofit-edge-logo.png from public folder
 */

import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ResourceLibrary from './components/ResourceLibrary';
import ResourceCategoryPage from './components/ResourceCategoryPage';
import EventsCalendar from './components/EventsCalendar';
import Settings from './components/Settings';
import MyDownloads from './components/MyDownloads';
import SavedFavorites from './components/SavedFavorites';
import ConstraintAssessment from './components/ConstraintAssessment';
import ConstraintReport from './components/ConstraintReport';
import AskTheProfessor from './components/AskTheProfessor';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'member';
  organization_id: string;
}

interface Organization {
  id: string;
  name: string;
  tier: 'essential' | 'professional' | 'premium';
}

const NAVY = '#0D2C54';
const TEAL = '#0097A9';

// Use actual logo image from public folder
const Logo: React.FC<{ width?: number; variant?: 'dark' | 'white' }> = ({ width = 180, variant = 'dark' }) => (
  <img 
    src={variant === 'white' ? '/images/nonprofit-edge-logo-white.png' : '/images/nonprofit-edge-logo.png'} 
    alt="The Nonprofit Edge" 
    style={{ height: width * 0.35, width: 'auto' }}
  />
);

const Homepage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => (
  <div style={{ 
    minHeight: '100vh', 
    background: `linear-gradient(135deg, ${NAVY} 0%, #164677 100%)`, 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    color: 'white', 
    fontFamily: "'DM Sans', system-ui, sans-serif", 
    padding: '40px' 
  }}>
    <Logo width={300} variant="white" />
    <h1 style={{ fontSize: '48px', fontWeight: 700, marginTop: '40px', marginBottom: '16px' }}>
      The Nonprofit Edge
    </h1>
    <p style={{ fontSize: '20px', opacity: 0.8, marginBottom: '40px', textAlign: 'center', maxWidth: '600px' }}>
      AI-powered tools, templates, and guidance for nonprofit leaders who want to lead with clarity and confidence.
    </p>
    <div style={{ display: 'flex', gap: '16px' }}>
      <button 
        onClick={() => onNavigate('/login')} 
        style={{ 
          padding: '16px 32px', 
          background: TEAL, 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px', 
          fontSize: '16px', 
          fontWeight: 600, 
          cursor: 'pointer' 
        }}
      >
        Sign In
      </button>
      <button 
        onClick={() => onNavigate('/signup')} 
        style={{ 
          padding: '16px 32px', 
          background: 'rgba(255,255,255,0.1)', 
          color: 'white', 
          border: '2px solid white', 
          borderRadius: '8px', 
          fontSize: '16px', 
          fontWeight: 600, 
          cursor: 'pointer' 
        }}
      >
        Get Started
      </button>
    </div>
  </div>
);

const Login: React.FC<{ onLogin: (email: string) => void; onNavigate: (path: string) => void }> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontFamily: "'DM Sans', system-ui, sans-serif" 
    }}>
      <div style={{ 
        background: 'white', 
        padding: '48px', 
        borderRadius: '16px', 
        boxShadow: '0 4px 24px rgba(0,0,0,0.1)', 
        width: '100%', 
        maxWidth: '400px' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Logo width={200} />
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: NAVY, marginBottom: '8px', textAlign: 'center' }}>
          Welcome Back
        </h1>
        <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '24px', fontSize: '14px' }}>
          Sign in to your account
        </p>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
            Email
          </label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="you@organization.org" 
            style={{ 
              width: '100%', 
              padding: '12px 16px', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px', 
              fontSize: '16px', 
              boxSizing: 'border-box' 
            }} 
          />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
            Password
          </label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••" 
            style={{ 
              width: '100%', 
              padding: '12px 16px', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px', 
              fontSize: '16px', 
              boxSizing: 'border-box' 
            }} 
          />
        </div>
        <button 
          onClick={() => email && onLogin(email)} 
          style={{ 
            width: '100%', 
            padding: '14px', 
            background: TEAL, 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            fontSize: '16px', 
            fontWeight: 600, 
            cursor: 'pointer' 
          }}
        >
          Sign In
        </button>
        <p style={{ textAlign: 'center', marginTop: '24px', color: '#64748b', fontSize: '14px' }}>
          Don't have an account?{' '}
          <span onClick={() => onNavigate('/signup')} style={{ color: TEAL, cursor: 'pointer', fontWeight: 500 }}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

// Tool page wrapper with proper logo and back button
const ToolPageWrapper: React.FC<{ 
  name: string; 
  onBack: () => void;
  children: React.ReactNode;
}> = ({ name, onBack, children }) => (
  <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
    <header style={{ 
      background: 'white', 
      padding: '16px 32px', 
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Logo width={140} />
        <span style={{ color: '#cbd5e1', fontSize: '20px' }}>|</span>
        <span style={{ color: NAVY, fontWeight: 600, fontSize: '16px' }}>{name}</span>
      </div>
      <button 
        onClick={onBack}
        style={{ 
          padding: '10px 20px', 
          background: '#f1f5f9', 
          color: '#475569', 
          border: 'none', 
          borderRadius: '8px', 
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        ← Back to Dashboard
      </button>
    </header>
    {children}
  </div>
);

// Placeholder for tools that aren't implemented yet
const ToolPlaceholder: React.FC<{ name: string }> = ({ name }) => (
  <div style={{ padding: '60px', textAlign: 'center' }}>
    <h1 style={{ color: NAVY, marginBottom: '16px' }}>{name}</h1>
    <p style={{ color: '#64748b' }}>This tool is coming soon.</p>
  </div>
);

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>(window.location.pathname);
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handlePopState = () => setCurrentRoute(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    
    // Load saved user/org from localStorage
    try {
      const savedUser = localStorage.getItem('nonprofit_edge_user');
      const savedOrg = localStorage.getItem('nonprofit_edge_org');
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedOrg) setOrganization(JSON.parse(savedOrg));
    } catch (e) { 
      console.error('Error loading user data:', e); 
    }
    
    setIsLoading(false);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string) => {
    const fullRoute = route.startsWith('/') ? route : `/${route}`;
    setCurrentRoute(fullRoute);
    window.history.pushState({}, '', fullRoute);
    window.scrollTo(0, 0);
  };

  // Route mapping for Dashboard navigation
  const routeMap: Record<string, string> = {
    'dashboard': '/dashboard',
    'member-resources': '/member-resources',
    'resources': '/member-resources',
    'events': '/events',
    'settings': '/settings',
    'my-downloads': '/my-downloads',
    'favorites': '/favorites',
    'constraint-assessment': '/constraint-assessment',
    'constraint-report': '/constraint-report',
    'guides': '/resources/guides',
    'book-summaries': '/resources/book-summaries',
    'playbooks': '/resources/playbooks',
    'facilitation-kits': '/resources/facilitation-kits',
    // Tools
    'board-assessment': '/board-assessment/use',
    'strategic-checkup': '/strategic-plan-checkup/use',
    'ceo-evaluation': '/ceo-evaluation/use',
    'scenario-planner': '/scenario-planner/use',
    'grant-review': '/grant-review/use',
    'ask-the-professor': '/ask-the-professor/use',
    'dashboard-creator': '/dashboard-creator/use',
  };

  const handleNav = (page: string) => navigate(routeMap[page] || `/${page}`);
  const goToDashboard = () => navigate('/dashboard');

  const handleLogin = (email: string) => {
    const newUser: User = { 
      id: 'user_1', 
      email, 
      name: email.split('@')[0], 
      role: 'member', 
      organization_id: 'org_1' 
    };
    const newOrg: Organization = { 
      id: 'org_1', 
      name: 'Your Organization', 
      tier: 'professional' 
    };
    setUser(newUser);
    setOrganization(newOrg);
    localStorage.setItem('nonprofit_edge_user', JSON.stringify(newUser));
    localStorage.setItem('nonprofit_edge_org', JSON.stringify(newOrg));
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setOrganization(null);
    localStorage.removeItem('nonprofit_edge_user');
    localStorage.removeItem('nonprofit_edge_org');
    navigate('/');
  };

  const handleStartProfessor = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/ask-the-professor/use');
  };

  const requireAuth = (component: React.ReactNode) => {
    if (!user) {
      navigate('/login');
      return null;
    }
    return component;
  };

  // Loading state
  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#f8fafc' 
      }}>
        <Logo width={200} />
      </div>
    );
  }

  // Routing
  switch (currentRoute) {
    case '/':
      return <Homepage onNavigate={navigate} />;
    
    case '/login':
      return <Login onLogin={handleLogin} onNavigate={navigate} />;
    
    case '/signup':
      return <Login onLogin={handleLogin} onNavigate={navigate} />;

    case '/dashboard':
      return requireAuth(
        <Dashboard 
          user={user!}
          organization={organization!}
          onNavigate={handleNav}
          onStartProfessor={handleStartProfessor}
          onLogout={handleLogout}
        />
      );

    case '/member-resources':
    case '/resources':
      return requireAuth(
        <ResourceLibrary 
          user={user!}
          organization={organization!}
          onNavigate={handleNav}
          onStartProfessor={handleStartProfessor}
          onLogout={handleLogout}
        />
      );

    case '/resources/guides':
      return requireAuth(
        <ResourceCategoryPage category="guides" onNavigate={handleNav} />
      );

    case '/resources/book-summaries':
      return requireAuth(
        <ResourceCategoryPage category="book-summaries" onNavigate={handleNav} />
      );

    case '/resources/playbooks':
      return requireAuth(
        <ResourceCategoryPage category="playbooks" onNavigate={handleNav} />
      );

    case '/resources/facilitation-kits':
      return requireAuth(
        <ResourceCategoryPage category="facilitation-kits" onNavigate={handleNav} />
      );

    case '/events':
      return requireAuth(
        <EventsCalendar onNavigate={handleNav} />
      );

    case '/settings':
      return requireAuth(
        <Settings onNavigate={handleNav} onLogout={handleLogout} />
      );

    case '/my-downloads':
      return requireAuth(
        <MyDownloads onNavigate={handleNav} />
      );

    case '/favorites':
      return requireAuth(
        <SavedFavorites onNavigate={handleNav} />
      );

    case '/constraint-assessment':
      return requireAuth(
        <ConstraintAssessment onNavigate={handleNav} />
      );

    case '/constraint-report':
      return requireAuth(
        <ConstraintReport onNavigate={handleNav} />
      );

    // ASK THE PROFESSOR - Full implementation
    case '/ask-the-professor/use':
      return requireAuth(
        <ToolPageWrapper name="Ask the Professor" onBack={goToDashboard}>
          <AskTheProfessor 
            user={user!}
            organization={organization!}
            onNavigate={handleNav}
          />
        </ToolPageWrapper>
      );

    // Other tools
    case '/board-assessment/use':
      return requireAuth(
        <ToolPageWrapper name="Board Assessment" onBack={goToDashboard}>
          <ToolPlaceholder name="Board Assessment" />
        </ToolPageWrapper>
      );

    case '/strategic-plan-checkup/use':
      return requireAuth(
        <ToolPageWrapper name="Strategic Plan Check-Up" onBack={goToDashboard}>
          <ToolPlaceholder name="Strategic Plan Check-Up" />
        </ToolPageWrapper>
      );

    case '/ceo-evaluation/use':
      return requireAuth(
        <ToolPageWrapper name="CEO Evaluation" onBack={goToDashboard}>
          <ToolPlaceholder name="CEO Evaluation" />
        </ToolPageWrapper>
      );

    case '/scenario-planner/use':
      return requireAuth(
        <ToolPageWrapper name="Scenario Planner" onBack={goToDashboard}>
          <ToolPlaceholder name="Scenario Planner" />
        </ToolPageWrapper>
      );

    case '/grant-review/use':
      return requireAuth(
        <ToolPageWrapper name="Grant Review" onBack={goToDashboard}>
          <ToolPlaceholder name="Grant Review" />
        </ToolPageWrapper>
      );

    case '/dashboard-creator/use':
      return requireAuth(
        <ToolPageWrapper name="Dashboard Creator" onBack={goToDashboard}>
          <ToolPlaceholder name="Dashboard Creator" />
        </ToolPageWrapper>
      );

    default:
      console.log('Unknown route:', currentRoute);
      if (user) {
        return (
          <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            background: '#f8fafc',
            fontFamily: "'DM Sans', system-ui, sans-serif"
          }}>
            <Logo width={200} />
            <h1 style={{ color: NAVY, marginTop: '32px' }}>Page Not Found</h1>
            <p style={{ color: '#64748b', margin: '16px 0' }}>Route: {currentRoute}</p>
            <button
              onClick={goToDashboard}
              style={{
                padding: '12px 24px',
                background: TEAL,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Go to Dashboard
            </button>
          </div>
        );
      }
      return <Homepage onNavigate={navigate} />;
  }
};

export default App;
