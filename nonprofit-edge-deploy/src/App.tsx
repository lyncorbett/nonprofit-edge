/**
 * THE NONPROFIT EDGE - App.tsx
 * Stable version with all components
 * UPDATED: January 30, 2026
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

const Logo = ({ width = 180 }: { width?: number }) => (
  <svg width={width} height={width * 0.4} viewBox="250 270 500 220">
    <path fill="#0D2C54" d="M438.46,469.14c-18.16,14.03-40.93,22.38-65.64,22.38c-30.79,0-58.55-12.94-78.16-33.69c2.85,0.46,5.7,0.81,8.57,1.06c9.13,0.79,17.9,0.49,26.26-0.63c12.72,7.44,27.53,11.71,43.33,11.71c17.17,0,33.17-5.03,46.59-13.71C422.94,460.11,428.93,465.14,438.46,469.14z"/>
    <path fill="#0D2C54" d="M294.86,420.29c-8.64,2.53-16.05,3.61-21.74,4.02c-5.05-12.44-7.82-26.05-7.82-40.31c0-59.37,48.14-107.52,107.52-107.52c25.62,0,49.15,8.96,67.62,23.94c-9.33,2.92-16.19,7.85-20.47,11.69c-13.54-8.9-29.74-14.08-47.15-14.08c-47.48,0-85.97,38.49-85.97,85.97C286.85,396.97,289.72,409.27,294.86,420.29z"/>
    <path fill="#0097A9" d="M258.67,434.74c0,0,61.28,14.58,121.38-60.61l-18.3-13.11l72.86-22.42l0.39,71.06l-18.78-13.01C416.22,396.64,340.29,479.82,258.67,434.74z"/>
    <path fill="#0D2C54" d="M491.43,298.55v7.98h-9.88v32.91h-9.08v-32.91h-9.88v-7.98H491.43z"/>
    <path fill="#0D2C54" d="M528.3,298.55v40.89h-9.08V322.6h-14.13v16.83H496v-40.89h9.08v16.02h14.13v-16.02H528.3z"/>
    <path fill="#0D2C54" d="M543.91,306.53v8.27h12.17v7.69h-12.17v8.97h13.76v7.98h-22.84v-40.89h22.84v7.98H543.91z"/>
    <path fill="#0097A9" d="M495.94,392.68h-9.08l-15.19-25.22v25.22h-9.08v-40.89h9.08l15.19,25.34v-25.34h9.08V392.68z"/>
    <path fill="#0097A9" d="M510.53,390.41c-2.92-1.79-5.24-4.28-6.96-7.48c-1.72-3.2-2.58-6.8-2.58-10.8c0-4,0.86-7.59,2.58-10.78c1.72-3.18,4.04-5.67,6.96-7.46c2.92-1.79,6.14-2.68,9.64-2.68c3.51,0,6.72,0.89,9.64,2.68c2.92,1.79,5.22,4.27,6.91,7.46c1.68,3.18,2.52,6.78,2.52,10.78c0,4-0.85,7.6-2.55,10.8c-1.7,3.2-4,5.7-6.91,7.48c-2.9,1.79-6.11,2.68-9.62,2.68C516.66,393.09,513.45,392.19,510.53,390.41z"/>
    <path fill="#0097A9" d="M577.65,392.68h-9.08l-15.19-25.22v25.22h-9.08v-40.89h9.08l15.19,25.34v-25.34h9.08V392.68z"/>
    <path fill="#0D2C54" d="M476.97,418.87v13.1h19.27v12.18h-19.27v14.21h21.8v12.64h-36.19v-64.78h36.19v12.64H476.97z"/>
    <path fill="#0D2C54" d="M546.58,410.29c4.66,2.71,8.26,6.51,10.82,11.4c2.55,4.89,3.83,10.54,3.83,16.93c0,6.34-1.28,11.97-3.83,16.89c-2.55,4.92-6.17,8.74-10.86,11.44c-4.69,2.71-10.11,4.06-16.29,4.06h-22.14v-64.78h22.14C536.48,406.23,541.92,407.58,546.58,410.29z"/>
    <path fill="#0D2C54" d="M608.53,426.71c-1.07-2.15-2.6-3.8-4.59-4.94c-1.99-1.14-4.33-1.71-7.03-1.71c-4.66,0-8.39,1.68-11.19,5.03c-2.81,3.35-4.21,7.83-4.21,13.43c0,5.97,1.47,10.63,4.42,13.98c2.95,3.35,7,5.03,12.16,5.03c3.54,0,6.52-0.98,8.96-2.95c2.44-1.97,4.22-4.8,5.34-8.49h-18.26v-11.63h31.31v14.67c-1.07,3.94-2.88,7.6-5.43,10.98c-2.55,3.38-5.79,6.12-9.72,8.21c-3.93,2.09-8.36,3.14-13.3,3.14c-5.84,0-11.04-1.4-15.61-4.2c-4.57-2.8-8.14-6.69-10.69-11.67c-2.55-4.98-3.83-10.67-3.83-17.07c0-6.4,1.28-12.1,3.83-17.12c2.55-5.01,6.1-8.92,10.65-11.72c4.55-2.8,9.73-4.2,15.57-4.2c7.07,0,13.03,1.88,17.89,5.63c4.85,3.75,8.07,8.95,9.64,15.6H608.53z"/>
    <path fill="#0D2C54" d="M647.83,418.87v13.1h19.27v12.18h-19.27v14.21h21.8v12.64h-36.19v-64.78h36.19v12.64H647.83z"/>
  </svg>
);

const Homepage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => (
  <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${NAVY} 0%, #164677 100%)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'system-ui', padding: '40px' }}>
    <Logo width={300} />
    <h1 style={{ fontSize: '48px', fontWeight: 700, marginTop: '40px', marginBottom: '16px' }}>The Nonprofit Edge</h1>
    <p style={{ fontSize: '20px', opacity: 0.8, marginBottom: '40px', textAlign: 'center', maxWidth: '600px' }}>AI-powered tools for nonprofit leaders.</p>
    <div style={{ display: 'flex', gap: '16px' }}>
      <button onClick={() => onNavigate('/login')} style={{ padding: '16px 32px', background: TEAL, color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}>Sign In</button>
      <button onClick={() => onNavigate('/signup')} style={{ padding: '16px 32px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '2px solid white', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}>Get Started</button>
    </div>
  </div>
);

const Login: React.FC<{ onLogin: (email: string) => void; onNavigate: (path: string) => void }> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui' }}>
      <div style={{ background: 'white', padding: '48px', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}><Logo width={200} /></div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: NAVY, marginBottom: '8px', textAlign: 'center' }}>Welcome Back</h1>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" style={{ width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '16px', marginBottom: '16px', boxSizing: 'border-box' }} />
        <button onClick={() => email && onLogin(email)} style={{ width: '100%', padding: '14px', background: TEAL, color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}>Sign In</button>
        <p style={{ textAlign: 'center', marginTop: '24px', color: '#64748b', fontSize: '14px' }}>Don't have an account? <span onClick={() => onNavigate('/signup')} style={{ color: TEAL, cursor: 'pointer' }}>Sign up</span></p>
      </div>
    </div>
  );
};

const ToolPage: React.FC<{ name: string; onBack: () => void }> = ({ name, onBack }) => (
  <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui' }}>
    <header style={{ background: 'white', padding: '16px 32px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}><Logo width={140} /><span style={{ color: '#cbd5e1' }}>|</span><span style={{ color: NAVY, fontWeight: 600 }}>{name}</span></div>
      <button onClick={onBack} style={{ padding: '8px 16px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>← Back to Dashboard</button>
    </header>
    <div style={{ padding: '60px', textAlign: 'center' }}><h1 style={{ color: NAVY, marginBottom: '16px' }}>{name}</h1><p style={{ color: '#64748b' }}>Tool loading...</p></div>
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
    try {
      const savedUser = localStorage.getItem('nonprofit_edge_user');
      const savedOrg = localStorage.getItem('nonprofit_edge_org');
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedOrg) setOrganization(JSON.parse(savedOrg));
    } catch (e) { console.error(e); }
    setIsLoading(false);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string) => {
    const fullRoute = route.startsWith('/') ? route : `/${route}`;
    setCurrentRoute(fullRoute);
    window.history.pushState({}, '', fullRoute);
    window.scrollTo(0, 0);
  };

  const routeMap: Record<string, string> = {
    'dashboard': '/dashboard', 'member-resources': '/member-resources', 'resources': '/member-resources',
    'events': '/events', 'settings': '/settings', 'my-downloads': '/my-downloads', 'favorites': '/favorites',
    'constraint-assessment': '/constraint-assessment', 'constraint-report': '/constraint-report',
    'guides': '/resources/guides', 'book-summaries': '/resources/book-summaries',
    'playbooks': '/resources/playbooks', 'facilitation-kits': '/resources/facilitation-kits',
    'board-assessment': '/board-assessment/use', 'strategic-checkup': '/strategic-plan-checkup/use',
    'ceo-evaluation': '/ceo-evaluation/use', 'scenario-planner': '/scenario-planner/use',
    'grant-review': '/grant-review/use', 'ask-the-professor': '/ask-the-professor/use',
  };

  const handleNav = (page: string) => navigate(routeMap[page] || `/${page}`);

  const handleLogin = (email: string) => {
    const newUser: User = { id: 'user_1', email, name: email.split('@')[0], role: 'member', organization_id: 'org_1' };
    const newOrg: Organization = { id: 'org_1', name: 'Your Organization', tier: 'professional' };
    setUser(newUser); setOrganization(newOrg);
    localStorage.setItem('nonprofit_edge_user', JSON.stringify(newUser));
    localStorage.setItem('nonprofit_edge_org', JSON.stringify(newOrg));
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setUser(null); setOrganization(null);
    localStorage.removeItem('nonprofit_edge_user'); localStorage.removeItem('nonprofit_edge_org');
    navigate('/');
  };

  const handleStartProfessor = () => user ? navigate('/ask-the-professor/use') : navigate('/login');

  const requireAuth = (component: React.ReactNode) => user ? component : (navigate('/login'), null);

  if (isLoading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}><Logo width={200} /></div>;

  switch (currentRoute) {
    case '/': return <Homepage onNavigate={navigate} />;
    case '/login': return <Login onLogin={handleLogin} onNavigate={navigate} />;
    case '/signup': return <Login onLogin={handleLogin} onNavigate={navigate} />;
    case '/dashboard': return requireAuth(<Dashboard user={user!} organization={organization!} onNavigate={handleNav} onStartProfessor={handleStartProfessor} onLogout={handleLogout} />);
    case '/member-resources': case '/resources': return requireAuth(<ResourceLibrary user={user!} organization={organization!} onNavigate={handleNav} onStartProfessor={handleStartProfessor} onLogout={handleLogout} />);
    case '/resources/guides': return requireAuth(<ResourceCategoryPage category="guides" onNavigate={handleNav} />);
    case '/resources/book-summaries': return requireAuth(<ResourceCategoryPage category="book-summaries" onNavigate={handleNav} />);
    case '/resources/playbooks': return requireAuth(<ResourceCategoryPage category="playbooks" onNavigate={handleNav} />);
    case '/resources/facilitation-kits': return requireAuth(<ResourceCategoryPage category="facilitation-kits" onNavigate={handleNav} />);
    case '/events': return requireAuth(<EventsCalendar onNavigate={handleNav} />);
    case '/settings': return requireAuth(<Settings onNavigate={handleNav} onLogout={handleLogout} />);
    case '/my-downloads': return requireAuth(<MyDownloads onNavigate={handleNav} />);
    case '/favorites': return requireAuth(<SavedFavorites onNavigate={handleNav} />);
    case '/constraint-assessment': return requireAuth(<ConstraintAssessment onNavigate={handleNav} />);
    case '/constraint-report': return requireAuth(<ConstraintReport onNavigate={handleNav} />);
    case '/board-assessment/use': return requireAuth(<ToolPage name="Board Assessment" onBack={() => navigate('/dashboard')} />);
    case '/strategic-plan-checkup/use': return requireAuth(<ToolPage name="Strategic Plan Check-Up" onBack={() => navigate('/dashboard')} />);
    case '/ceo-evaluation/use': return requireAuth(<ToolPage name="CEO Evaluation" onBack={() => navigate('/dashboard')} />);
    case '/scenario-planner/use': return requireAuth(<ToolPage name="Scenario Planner" onBack={() => navigate('/dashboard')} />);
    case '/grant-review/use': return requireAuth(<ToolPage name="Grant Review" onBack={() => navigate('/dashboard')} />);
    case '/ask-the-professor/use': return requireAuth(<ToolPage name="Ask the Professor" onBack={() => navigate('/dashboard')} />);
    default:
      console.log('Unknown route:', currentRoute);
      return user ? <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', background: '#f8fafc', fontFamily: 'system-ui' }}><h1 style={{ color: NAVY }}>Page Not Found</h1><p style={{ color: '#64748b', margin: '16px 0' }}>Route: {currentRoute}</p><button onClick={() => navigate('/dashboard')} style={{ padding: '12px 24px', background: TEAL, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Go to Dashboard</button></div> : <Homepage onNavigate={navigate} />;
  }
};

export default App;
