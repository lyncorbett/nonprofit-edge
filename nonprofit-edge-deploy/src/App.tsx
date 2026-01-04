/**
 * THE NONPROFIT EDGE - App.tsx
 * Complete Routing with Usage Tracking Integration
 * 
 * Route Pattern:
 *   /tool-name         → Landing page (public, marketing) - WITH HEADER/FOOTER
 *   /tool-name/use     → Actual tool (requires login, tracked)
 */

import React, { useState, useEffect } from 'react';

// ============================================
// COMPONENT IMPORTS
// ============================================

// Layout Components (Header + Footer)
import Layout from './components/Layout';

// Dashboard & Core Components
import RealDashboard from './components/Dashboard';
import ResourceLibrary from './components/ResourceLibrary';
import EventsCalendar from './components/EventsCalendar';
import EnhancedOwnerDashboard from './components/EnhancedOwnerDashboard';
import MarketingDashboard from './components/MarketingDashboard';
import LinkManager from './components/LinkManager';
import TeamAccessManager from './components/TeamAccessManager';
import ContentManager from './components/ContentManager';
import AdminDashboard from './components/AdminDashboard';
import PlatformOwnerDashboard from './components/PlatformOwnerDashboard';

// Auth Components
import Login from './components/Login';
import SignUp from './components/SignUp';
import SignUpSuccess from './components/SignUpSuccess';
import SignupFlow from './components/SignupFlow';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

// UI Components
import Homepage from './components/Homepage';
import Sidebar from './components/Sidebar';
import ProductTour from './components/ProductTour';
import WelcomeModal from './components/WelcomeModal';
import AIGuideChatbot from './components/AIGuideChatbot';

// Tool Components (Actual Tools)
import StrategicPlanCheckup from './StrategicPlanCheckup';
import CEOEvaluation from './CEOEvaluation';
import BoardAssessment from './BoardAssessment';
import GrantReview from './GrantReview';
import ScenarioPlanner from './ScenarioPlanner';
import AskTheProfessor from './AskTheProfessor';
import AISummary from './AISummary';

// Landing Page Components
import ScenarioPlannerLanding from './ScenarioPlannerLanding';
import BoardAssessmentLanding from './BoardAssessmentLanding';
import CEOEvaluationLanding from './CEOEvaluationLanding';
import StrategicPlanCheckupLanding from './StrategicPlanCheckupLanding';
import GrantRFPReviewLanding from './GrantRFPReviewLanding';
import CertificationsLanding from './CertificationsLanding';

// Tracking utilities
import { 
  trackToolStart, 
  trackToolComplete, 
  trackDownload, 
  trackProfessorSession,
  TIER_LIMITS 
} from './lib/tracking';

// ============================================
// TYPES
// ============================================

interface User {
  id: string;
  email: string;
  name: string;
  full_name?: string;
  role: 'owner' | 'admin' | 'member';
  organization_id: string;
  avatar_url?: string | null;
  profile_photo?: string | null;
  created_at?: string;
}

interface Organization {
  id: string;
  name: string;
  tier: 'essential' | 'professional' | 'premium';
  logo_url?: string | null;
}

interface UsageData {
  tools_started: number;
  tools_completed: number;
  tools_used_this_month: number;
  downloads_this_month: number;
  professor_sessions_this_month: number;
  report_downloads: number;
}

interface ToolSession {
  id: string;
  tool_type: string;
  started_at: string;
}

// ============================================
// BRAND COLORS
// ============================================

const NAVY = '#0D2C54';
const TEAL = '#0097A9';

// ============================================
// LOGO COMPONENT
// ============================================

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
        <path fill="#0097A9" d="M510.53,390.41c-2.92-1.79-5.24-4.28-6.96-7.48c-1.72-3.2-2.58-6.8-2.58-10.8c0-4,0.86-7.59,2.58-10.78c1.72-3.18,4.04-5.67,6.96-7.46c2.92-1.79,6.14-2.68,9.64-2.68c3.51,0,6.72,0.89,9.64,2.68c2.92,1.79,5.22,4.27,6.91,7.46c1.68,3.18,2.52,6.78,2.52,10.78c0,4-0.85,7.6-2.55,10.8c-1.7,3.2-4,5.7-6.91,7.48c-2.9,1.79-6.11,2.68-9.62,2.68C516.66,393.09,513.45,392.19,510.53,390.41z"/>
        <path fill="#0097A9" d="M577.65,392.68h-9.08l-15.19-25.22v25.22h-9.08v-40.89h9.08l15.19,25.34v-25.34h9.08V392.68z"/>
      </g>
      <g>
        <path fill="#0D2C54" d="M476.97,418.87v13.1h19.27v12.18h-19.27v14.21h21.8v12.64h-36.19v-64.78h36.19v12.64H476.97z"/>
        <path fill="#0D2C54" d="M546.58,410.29c4.66,2.71,8.26,6.51,10.82,11.4c2.55,4.89,3.83,10.54,3.83,16.93c0,6.34-1.28,11.97-3.83,16.89c-2.55,4.92-6.17,8.74-10.86,11.44c-4.69,2.71-10.11,4.06-16.29,4.06h-22.14v-64.78h22.14C536.48,406.23,541.92,407.58,546.58,410.29z"/>
        <path fill="#0D2C54" d="M608.53,426.71c-1.07-2.15-2.6-3.8-4.59-4.94c-1.99-1.14-4.33-1.71-7.03-1.71c-4.66,0-8.39,1.68-11.19,5.03c-2.81,3.35-4.21,7.83-4.21,13.43c0,5.97,1.47,10.63,4.42,13.98c2.95,3.35,7,5.03,12.16,5.03c3.54,0,6.52-0.98,8.96-2.95c2.44-1.97,4.22-4.8,5.34-8.49h-18.26v-11.63h31.31v14.67c-1.07,3.94-2.88,7.6-5.43,10.98c-2.55,3.38-5.79,6.12-9.72,8.21c-3.93,2.09-8.36,3.14-13.3,3.14c-5.84,0-11.04-1.4-15.61-4.2c-4.57-2.8-8.14-6.69-10.69-11.67c-2.55-4.98-3.83-10.67-3.83-17.07c0-6.4,1.28-12.1,3.83-17.12c2.55-5.01,6.1-8.92,10.65-11.72c4.55-2.8,9.73-4.2,15.57-4.2c7.07,0,13.03,1.88,17.89,5.63c4.85,3.75,8.07,8.95,9.64,15.6H608.53z"/>
        <path fill="#0D2C54" d="M647.83,418.87v13.1h19.27v12.18h-19.27v14.21h21.8v12.64h-36.19v-64.78h36.19v12.64H647.83z"/>
      </g>
    </g>
  </svg>
);

// ============================================
// MAIN APP COMPONENT
// ============================================

const App: React.FC = () => {
  // ==========================================
  // STATE
  // ==========================================
  
  const [currentRoute, setCurrentRoute] = useState<string>(window.location.pathname);
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSession, setCurrentSession] = useState<ToolSession | null>(null);
  
  const [usage, setUsage] = useState<UsageData>({
    tools_started: 0,
    tools_completed: 0,
    tools_used_this_month: 0,
    downloads_this_month: 0,
    professor_sessions_this_month: 0,
    report_downloads: 0,
  });

  // ==========================================
  // INITIALIZATION
  // ==========================================

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);

    try {
      const savedUser = localStorage.getItem('nonprofit_edge_user');
      const savedOrg = localStorage.getItem('nonprofit_edge_org');
      const savedUsage = localStorage.getItem('nonprofit_edge_usage');
      
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedOrg) setOrganization(JSON.parse(savedOrg));
      if (savedUsage) setUsage(JSON.parse(savedUsage));
    } catch (e) {
      console.error('Error loading saved data:', e);
    }
    
    setIsLoading(false);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('nonprofit_edge_usage', JSON.stringify(usage));
    }
  }, [usage, user]);

  // ==========================================
  // NAVIGATION
  // ==========================================

  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
    window.scrollTo(0, 0);
  };

  // ==========================================
  // AUTH HANDLERS
  // ==========================================

  const handleLogin = (email: string) => {
    const newUser: User = {
      id: 'user_' + Date.now(),
      email: email,
      name: email.split('@')[0],
      full_name: email.split('@')[0],
      role: email.includes('owner') ? 'owner' : 'member',
      organization_id: 'org_1',
      created_at: new Date().toISOString(),
    };
    
    const newOrg: Organization = {
      id: 'org_1',
      name: 'Your Organization',
      tier: 'professional',
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
    setCurrentSession(null);
    localStorage.removeItem('nonprofit_edge_user');
    localStorage.removeItem('nonprofit_edge_org');
    localStorage.removeItem('nonprofit_edge_usage');
    navigate('/');
  };

  // ==========================================
  // TRACKING HANDLERS
  // ==========================================

  const handleToolStart = async (toolId: string, toolName: string): Promise<string | null> => {
    if (!user || !organization) return null;
    const sessionId = `session_${Date.now()}`;
    setCurrentSession({ id: sessionId, tool_type: toolId, started_at: new Date().toISOString() });
    console.log(`Tool opened: ${toolName} (Session: ${sessionId})`);
    return sessionId;
  };

  const handleToolComplete = async (sessionId: string, toolName: string, score?: number) => {
    if (!user || !organization) return;
    setUsage(prev => ({
      ...prev,
      tools_started: prev.tools_started + 1,
      tools_completed: prev.tools_completed + 1,
      tools_used_this_month: prev.tools_used_this_month + 1,
    }));
    setCurrentSession(null);
    console.log(`Tool COMPLETED: ${toolName} (Score: ${score || 'N/A'})`);
  };

  const handleDownload = async (resourceName: string, resourceType: 'report' | 'template' = 'report') => {
    if (!user || !organization) return;
    const tier = organization.tier;
    const limits = TIER_LIMITS[tier] || TIER_LIMITS.essential;
    if (usage.downloads_this_month >= limits.downloads) {
      alert(`You've reached your monthly download limit (${limits.downloads}). Upgrade for more.`);
      return;
    }
    setUsage(prev => ({
      ...prev,
      downloads_this_month: prev.downloads_this_month + 1,
      report_downloads: prev.report_downloads + 1,
    }));
    console.log(`Download tracked: ${resourceName}`);
  };

  const handleStartProfessor = async () => {
    if (!user || !organization) {
      navigate('/login');
      return;
    }
    const tier = organization.tier;
    const limits = TIER_LIMITS[tier] || TIER_LIMITS.essential;
    if (tier !== 'premium' && usage.professor_sessions_this_month >= limits.professor) {
      alert(`You've reached your monthly limit (${limits.professor}). Upgrade for more.`);
      return;
    }
    setUsage(prev => ({ ...prev, professor_sessions_this_month: prev.professor_sessions_this_month + 1 }));
    navigate('/ask-the-professor/use');
  };

  // ==========================================
  // TOOL PAGE WRAPPER
  // ==========================================

  interface ToolWrapperProps {
    toolId: string;
    toolName: string;
    children: React.ReactNode;
  }

  const ToolPageWrapper: React.FC<ToolWrapperProps> = ({ toolId, toolName, children }) => {
    const [sessionId, setSessionId] = useState<string | null>(null);

    useEffect(() => {
      handleToolStart(toolId, toolName).then(id => setSessionId(id));
    }, [toolId, toolName]);

    const onComplete = (score?: number) => {
      if (sessionId) handleToolComplete(sessionId, toolName, score);
    };

    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        <header style={{ background: 'white', padding: '12px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Logo width={140} />
            <span style={{ color: '#cbd5e1' }}>|</span>
            <span style={{ color: NAVY, fontWeight: 600 }}>{toolName}</span>
          </div>
          <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            ← Back to Dashboard
          </button>
        </header>
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { onComplete, sessionId, onBack: () => navigate('/dashboard') } as any);
          }
          return child;
        })}
      </div>
    );
  };

  // ==========================================
  // AUTH GUARD
  // ==========================================

  const requireAuth = (component: React.ReactNode): React.ReactNode => {
    if (!user) {
      navigate('/login');
      return null;
    }
    return component;
  };

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <Logo width={200} />
          <p style={{ color: '#64748b', marginTop: '16px' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ROUTE MAPPING
  // ==========================================

  const mapDashboardNavigation = (page: string): string => {
    const routeMap: Record<string, string> = {
      'dashboard': '/dashboard',
      'library': '/resources',
      'events': '/events',
      'team': '/team',
      'reports': '/reports',
      'settings': '/settings',
      'templates': '/templates',
      'book-summaries': '/book-summaries',
      'certifications': '/certifications',
      'pricing': '/pricing',
      'strategic-checkup': '/strategic-plan-checkup/use',
      'ceo-evaluation': '/ceo-evaluation/use',
      'board-assessment': '/board-assessment/use',
      'scenario-planner': '/scenario-planner/use',
      'grant-review': '/grant-review/use',
      'content-manager': '/admin/content',
      'platform-admin': '/admin/platform',
      'owner-dashboard': '/admin/owner',
      'enhanced-owner': '/admin/enhanced',
      'marketing': '/admin/marketing',
      'link-manager': '/admin/links',
      'team-access': '/admin/team',
    };
    return routeMap[page] || `/${page}`;
  };

  // ==========================================
  // ROUTING
  // ==========================================

  const renderRoute = (): React.ReactNode => {
    switch (currentRoute) {
      // ========================================
      // PUBLIC ROUTES
      // ========================================
      
      case '/':
        return <Homepage onNavigate={navigate} />;
      
      case '/login':
        return <Login onLogin={handleLogin} onNavigate={navigate} />;
      
      case '/signup':
        return <SignUp onSignUp={handleLogin} onNavigate={navigate} />;
      
      case '/signup/success':
        return <SignUpSuccess onNavigate={navigate} />;
      
      case '/forgot-password':
        return <ForgotPassword onNavigate={navigate} />;
      
      case '/reset-password':
        return <ResetPassword onNavigate={navigate} />;

      // ========================================
      // TOOL LANDING PAGES (Public) - WITH LAYOUT (HEADER + FOOTER)
      // ========================================
      
      case '/strategic-plan-checkup':
        return (
          <Layout onNavigate={navigate}>
            <StrategicPlanCheckupLanding onNavigate={navigate} onGetStarted={() => navigate('/strategic-plan-checkup/use')} />
          </Layout>
        );
      
      case '/board-assessment':
        return (
          <Layout onNavigate={navigate}>
            <BoardAssessmentLanding onNavigate={navigate} onGetStarted={() => navigate('/board-assessment/use')} />
          </Layout>
        );
      
      case '/ceo-evaluation':
        return (
          <Layout onNavigate={navigate}>
            <CEOEvaluationLanding onNavigate={navigate} onGetStarted={() => navigate('/ceo-evaluation/use')} />
          </Layout>
        );
      
      case '/scenario-planner':
        return (
          <Layout onNavigate={navigate}>
            <ScenarioPlannerLanding onNavigate={navigate} onGetStarted={() => navigate('/scenario-planner/use')} />
          </Layout>
        );
      
      case '/grant-review':
        return (
          <Layout onNavigate={navigate}>
            <GrantRFPReviewLanding onNavigate={navigate} onGetStarted={() => navigate('/grant-review/use')} />
          </Layout>
        );
      
      case '/ask-the-professor':
        return (
          <Layout onNavigate={navigate}>
            <ScenarioPlannerLanding onNavigate={navigate} onGetStarted={handleStartProfessor} />
          </Layout>
        );
      
      case '/certifications':
        return (
          <Layout onNavigate={navigate}>
            <CertificationsLanding onNavigate={navigate} />
          </Layout>
        );

      // ========================================
      // TOOL PAGES (Require Auth, Tracked)
      // ========================================
      
      case '/strategic-plan-checkup/use':
        return requireAuth(
          <ToolPageWrapper toolId="strategic-checkup" toolName="Strategic Plan Check-Up">
            <StrategicPlanCheckup />
          </ToolPageWrapper>
        );
      
      case '/board-assessment/use':
        return requireAuth(
          <ToolPageWrapper toolId="board-assessment" toolName="Board Assessment">
            <BoardAssessment />
          </ToolPageWrapper>
        );
      
      case '/ceo-evaluation/use':
        return requireAuth(
          <ToolPageWrapper toolId="ceo-evaluation" toolName="CEO Evaluation">
            <CEOEvaluation />
          </ToolPageWrapper>
        );
      
      case '/scenario-planner/use':
        return requireAuth(
          <ToolPageWrapper toolId="scenario-planner" toolName="PIVOT Scenario Planner">
            <ScenarioPlanner />
          </ToolPageWrapper>
        );
      
      case '/grant-review/use':
        return requireAuth(
          <ToolPageWrapper toolId="grant-review" toolName="Grant/RFP Review">
            <GrantReview />
          </ToolPageWrapper>
        );
      
      case '/ask-the-professor/use':
        return requireAuth(
          <ToolPageWrapper toolId="ask-professor" toolName="Ask The Professor">
            <AskTheProfessor />
          </ToolPageWrapper>
        );
      
      case '/ai-summary/use':
        return requireAuth(
          <ToolPageWrapper toolId="ai-summary" toolName="AI Summary">
            <AISummary />
          </ToolPageWrapper>
        );

      // ========================================
      // DASHBOARD & MAIN APP
      // ========================================
      
      case '/dashboard':
        if (!user || !organization) {
          navigate('/login');
          return null;
        }
        return (
          <RealDashboard 
            user={{ ...user, full_name: user.name, avatar_url: null, profile_photo: null, created_at: user.created_at || new Date().toISOString() }}
            organization={organization}
            usage={usage}
            teamCount={1}
            onNavigate={(page: string) => navigate(mapDashboardNavigation(page))}
            onDownload={handleDownload}
            onStartProfessor={handleStartProfessor}
            onLogout={handleLogout}
          />
        );

      case '/resources':
        return requireAuth(
          <ResourceLibrary 
            user={{ ...user!, full_name: user!.name }}
            organization={organization!}
            onNavigate={(page: string) => navigate(mapDashboardNavigation(page))}
            onLogout={handleLogout}
          />
        );

      case '/events':
        return requireAuth(
          <EventsCalendar 
            user={{ ...user!, full_name: user!.name }}
            organization={organization!}
            onNavigate={(page: string) => navigate(mapDashboardNavigation(page))}
            onLogout={handleLogout}
          />
        );

      // ========================================
      // ADMIN ROUTES
      // ========================================

      case '/admin':
      case '/admin/owner':
      case '/admin/enhanced':
        return requireAuth(<EnhancedOwnerDashboard onNavigate={(page: string) => navigate(`/${page}`)} />);

      case '/admin/marketing':
        return requireAuth(<MarketingDashboard />);

      case '/admin/links':
        return requireAuth(<LinkManager />);

      case '/admin/team':
        return requireAuth(<TeamAccessManager />);

      case '/admin/content':
        return requireAuth(<ContentManager />);

      case '/admin/platform':
        return requireAuth(<AdminDashboard />);

      // ========================================
      // LEGACY REDIRECTS
      // ========================================

      case '/tools/strategic-plan':
        navigate('/strategic-plan-checkup/use');
        return null;
      
      case '/tools/board-assessment':
        navigate('/board-assessment/use');
        return null;
      
      case '/tools/ceo-evaluation':
        navigate('/ceo-evaluation/use');
        return null;
      
      case '/tools/scenario-planner':
        navigate('/scenario-planner/use');
        return null;
      
      case '/tools/grant-review':
        navigate('/grant-review/use');
        return null;

      // ========================================
      // DEFAULT
      // ========================================
      
      default:
        if (currentRoute.startsWith('/tools/')) {
          navigate('/dashboard');
          return null;
        }
        return <Homepage onNavigate={navigate} />;
    }
  };

  return <>{renderRoute()}</>;
};

export default App;
