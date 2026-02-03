/**
 * THE NONPROFIT EDGE - App.tsx
 * Complete Routing with Usage Tracking Integration
 * 
 * UPDATED: February 2, 2026
 * - Added AskProfessorFree (public, no login)
 * - Added WhyWeExist page
 * - Added PrivacyPolicy page
 * - Added TermsOfService page
 * - Added /grant-review landing page route
 * - All new public routes placed before requireAuth section
 */

import React, { useState, useEffect } from 'react';

// ============================================
// COMPONENT IMPORTS
// ============================================

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

// User Pages
import Settings from './components/Settings';
import MyDownloads from './components/MyDownloads';
import SavedFavorites from './components/SavedFavorites';

// Constraint Assessment
import ConstraintAssessment from './components/ConstraintAssessment';
import ConstraintReport from './components/ConstraintReport';
import CoreConstraintAssessment from './components/CoreConstraintAssessment';

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

// ============================================
// TOOL COMPONENTS
// ============================================
import StrategicPlanCheckup from './components/StrategicPlanCheckup';
import CEOEvaluation from './components/CEOEvaluation';
import BoardAssessment from './components/BoardAssessment';
import GrantReview from './components/GrantReview';
import ScenarioPlanner from './components/ScenarioPlanner';
import AskTheProfessor from './components/AskTheProfessor';

// Leadership Assessment
import LeadershipAssessment from './components/LeadershipAssessment';
import LeadershipReport from './components/LeadershipReport';
import LeadershipProfile from './components/LeadershipProfile';

// Landing Page Components
import ScenarioPlannerLanding from './components/ScenarioPlannerLanding';
import BoardAssessmentLanding from './components/BoardAssessmentLanding';
import CEOEvaluationLanding from './components/CEOEvaluationLanding';
import StrategicPlanCheckupLanding from './components/StrategicPlanCheckupLanding';
import CertificationsLanding from './components/CertificationsLanding';
import GrantReviewLanding from './components/GrantReviewLanding';

// ============================================
// NEW PUBLIC PAGE COMPONENTS
// ============================================
import AskProfessorFree from './components/AskProfessorFree';
import WhyWeExist from './components/WhyWeExist';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';

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
  <img 
    src="/logo.svg" 
    alt="The Nonprofit Edge" 
    style={{ width: `${width}px`, height: 'auto' }}
  />
);

// ============================================
// MAIN APP COMPONENT
// ============================================

const App: React.FC = () => {
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

  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
    window.scrollTo(0, 0);
  };

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

  const handleToolStart = async (toolId: string, toolName: string): Promise<string | null> => {
    if (!user || !organization) return null;
    const sessionId = `session_${Date.now()}`;
    const session: ToolSession = { id: sessionId, tool_type: toolId, started_at: new Date().toISOString() };
    setCurrentSession(session);
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

  const requireAuth = (component: React.ReactNode): React.ReactNode => {
    if (!user) {
      navigate('/login');
      return null;
    }
    return component;
  };

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

  const mapDashboardNavigation = (page: string): string => {
    const routeMap: Record<string, string> = {
      'dashboard': '/dashboard',
      'library': '/resources',
      'events': '/events',
      'settings': '/settings',
      'constraint-assessment': '/constraint-assessment',
      'constraint-report': '/constraint-report',
      'my-downloads': '/my-downloads',
      'favorites': '/favorites',
      'leadership-assessment': '/leadership-assessment',
      'leadership-report': '/leadership-assessment/report',
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

  const renderRoute = (): React.ReactNode => {
    switch (currentRoute) {
      // ============================================
      // PUBLIC ROUTES (No login required)
      // ============================================
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

      // FREE ASSESSMENT (Public Lead Magnet)
      case '/assessment':
        return <CoreConstraintAssessment onNavigate={navigate} />;

      // ASK THE PROFESSOR - FREE PREVIEW (Public, one question, no login)
      case '/ask-the-professor':
      case '/ask-free':
        return <AskProfessorFree onNavigate={navigate} />;

      // WHY WE EXIST PAGE
      case '/why-we-exist':
        return <WhyWeExist onNavigate={navigate} />;

      // PRIVACY & TERMS
      case '/privacy':
        return <PrivacyPolicy onNavigate={navigate} />;
      
      case '/terms':
        return <TermsOfService onNavigate={navigate} />;

      // ============================================
      // TOOL LANDING PAGES (Public)
      // ============================================
      case '/strategic-plan-checkup':
        return <StrategicPlanCheckupLanding onNavigate={navigate} onGetStarted={() => navigate('/strategic-plan-checkup/use')} />;
      
      case '/board-assessment':
        return <BoardAssessmentLanding onNavigate={navigate} onGetStarted={() => navigate('/board-assessment/use')} />;
      
      case '/ceo-evaluation':
        return <CEOEvaluationLanding onNavigate={navigate} onGetStarted={() => navigate('/ceo-evaluation/use')} />;
      
      case '/scenario-planner':
        return <ScenarioPlannerLanding onNavigate={navigate} onGetStarted={() => navigate('/scenario-planner/use')} />;
      
      case '/grant-review':
        return <GrantReviewLanding onNavigate={navigate} onGetStarted={() => navigate('/grant-review/use')} />;

      case '/certifications':
        return <CertificationsLanding onNavigate={navigate} />;

      // ============================================
      // TOOL PAGES (Require Auth) - Direct render
      // ============================================
      case '/strategic-plan-checkup/use':
        return requireAuth(<StrategicPlanCheckup onNavigate={navigate} />);
      
      case '/board-assessment/use':
        return requireAuth(<BoardAssessment onNavigate={navigate} />);
      
      case '/ceo-evaluation/use':
        return requireAuth(<CEOEvaluation onNavigate={navigate} />);
      
      case '/scenario-planner/use':
        return requireAuth(<ScenarioPlanner onNavigate={navigate} />);
      
      case '/grant-review/use':
        return requireAuth(<GrantReview onNavigate={navigate} />);
      
      case '/ask-the-professor/use':
        return requireAuth(<AskTheProfessor onNavigate={navigate} />);

      // ============================================
      // LEADERSHIP ASSESSMENT
      // ============================================
      case '/leadership-assessment':
        return requireAuth(<LeadershipAssessment onNavigate={navigate} />);
      
      case '/leadership-assessment/report':
        return requireAuth(<LeadershipReport onNavigate={navigate} />);

      // ============================================
      // USER PAGES (Require Auth)
      // ============================================
      case '/settings':
        return requireAuth(<Settings onNavigate={navigate} onLogout={handleLogout} />);

      case '/my-downloads':
        return requireAuth(<MyDownloads onNavigate={navigate} />);

      case '/favorites':
        return requireAuth(<SavedFavorites onNavigate={navigate} />);

      // CONSTRAINT ASSESSMENT (Full Member Version)
      case '/constraint-assessment':
      case '/dashboard/constraint-assessment':
        return requireAuth(<ConstraintAssessment onNavigate={navigate} />);

      case '/constraint-report':
      case '/dashboard/constraint-report':
        return requireAuth(<ConstraintReport onNavigate={navigate} />);

      // ============================================
      // DASHBOARD
      // ============================================
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

      // ============================================
      // ADMIN ROUTES
      // ============================================
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

      // ============================================
      // LEGACY REDIRECTS
      // ============================================
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
      
      case '/tools/ask-professor':
        navigate('/ask-the-professor/use');
        return null;

      // ============================================
      // DEFAULT
      // ============================================
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
