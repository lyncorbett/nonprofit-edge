/**
 * THE NONPROFIT EDGE - App.tsx
 * Real Supabase Authentication + Complete Routing
 * 
 * UPDATED: February 3, 2026
 * - Real Supabase auth (no more mock users)
 * - Listens to onAuthStateChange for login/logout/magic links
 * - Loads user profile and organization from Supabase
 * - Falls back to user_metadata if no profile table exists yet
 * - All public routes (free tools, pages) work without login
 */

import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';

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
import GrantReviewLanding from "./GrantReviewLanding";
import ScenarioPlanner from './components/ScenarioPlanner';
import AskTheProfessor from './components/AskTheProfessor';

// Leadership Assessment
import LeadershipAssessment from './components/LeadershipAssessment';
import LeadershipReport from './components/LeadershipReport';
import LeadershipProfile from './components/LeadershipProfile';

// Landing Page Components
import ScenarioPlannerLanding from './ScenarioPlannerLanding';
import BoardAssessmentLanding from './BoardAssessmentLanding';
import CEOEvaluationLanding from './CEOEvaluationLanding';
import StrategicPlanCheckupLanding from './StrategicPlanCheckupLanding';
import CertificationsLanding from './components/CertificationsLanding';
import ResourcesLanding from './ResourcesLanding';
import LeadershipAssessmentLanding from './LeadershipAssessmentLanding';

// New Public Page Components
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

interface AppUser {
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

const Logo = ({ width = 280 }: { width?: number }) => (
  <img 
    src="/logo.svg" 
    alt="The Nonprofit Edge" 
    style={{ width: `${width}px`, height: 'auto' }}
  />
);

// ============================================
// HELPER: Build user & org from Supabase session
// ============================================

const buildUserFromSession = (supabaseUser: SupabaseUser): { user: AppUser; org: Organization } => {
  const meta = supabaseUser.user_metadata || {};
  
  const user: AppUser = {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: meta.full_name || meta.name || supabaseUser.email?.split('@')[0] || 'User',
    full_name: meta.full_name || meta.name || supabaseUser.email?.split('@')[0] || 'User',
    role: meta.role || 'member',
    organization_id: meta.organization_id || 'org_' + supabaseUser.id.slice(0, 8),
    avatar_url: meta.avatar_url || null,
    profile_photo: null,
    created_at: supabaseUser.created_at,
  };

  const org: Organization = {
    id: user.organization_id,
    name: meta.organization || 'My Organization',
    tier: meta.plan || 'professional',
    logo_url: null,
  };

  return { user, org };
};

// ============================================
// MAIN APP COMPONENT
// ============================================

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>(window.location.pathname);
  const [user, setUser] = useState<AppUser | null>(null);
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

  // ============================================
  // SUPABASE AUTH LISTENER
  // ============================================
  useEffect(() => {
    // Handle browser back/forward
    const handlePopState = () => setCurrentRoute(window.location.pathname);
    window.addEventListener('popstate', handlePopState);

    // Check for existing session on load
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { user: appUser, org } = buildUserFromSession(session.user);
          setUser(appUser);
          setOrganization(org);

          // Try to load profile from profiles table (if it exists)
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setUser(prev => prev ? {
                ...prev,
                name: profile.full_name || prev.name,
                full_name: profile.full_name || prev.full_name,
                role: profile.role || prev.role,
                organization_id: profile.organization_id || prev.organization_id,
                avatar_url: profile.avatar_url || prev.avatar_url,
              } : prev);
            }
          } catch {
            // profiles table might not exist yet — that's fine, use metadata
          }

          // Try to load org details
          try {
            const { data: orgData } = await supabase
              .from('organizations')
              .select('*')
              .eq('id', appUser.organization_id)
              .single();

            if (orgData) {
              setOrganization({
                id: orgData.id,
                name: orgData.name || 'My Organization',
                tier: orgData.tier || 'professional',
                logo_url: orgData.logo_url || null,
              });
            }
          } catch {
            // organizations table might not exist yet — use defaults
          }

          // Load saved usage
          const savedUsage = localStorage.getItem('nonprofit_edge_usage');
          if (savedUsage) {
            try { setUsage(JSON.parse(savedUsage)); } catch {}
          }
        }
      } catch (err) {
        console.error('[App] Auth init error:', err);
      }
      
      setIsLoading(false);
    };

    initAuth();

    // Listen for auth state changes (login, logout, magic link callbacks)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth]', event, session?.user?.email);

        if (event === 'SIGNED_IN' && session?.user) {
          const { user: appUser, org } = buildUserFromSession(session.user);
          setUser(appUser);
          setOrganization(org);

          // If we're on login/signup page, redirect to dashboard
          if (currentRoute === '/login' || currentRoute === '/signup' || currentRoute === '/') {
            navigate('/dashboard');
          }
        }

        if (event === 'SIGNED_OUT') {
          setUser(null);
          setOrganization(null);
          localStorage.removeItem('nonprofit_edge_usage');
          navigate('/');
        }
      }
    );

    return () => {
      window.removeEventListener('popstate', handlePopState);
      subscription.unsubscribe();
    };
  }, []);

  // Persist usage
  useEffect(() => {
    if (user) {
      localStorage.setItem('nonprofit_edge_usage', JSON.stringify(usage));
    }
  }, [usage, user]);

  // ============================================
  // NAVIGATION
  // ============================================

  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
    window.scrollTo(0, 0);
  };

  // ============================================
  // AUTH HANDLERS
  // ============================================

  const handleLoginSuccess = (userData: { id: string; email: string; name: string; role: string }) => {
    // Build user/org from the data Login.tsx passes back
    const appUser: AppUser = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      full_name: userData.name,
      role: (userData.role as 'owner' | 'admin' | 'member') || 'member',
      organization_id: 'org_' + userData.id.slice(0, 8),
      created_at: new Date().toISOString(),
    };

    const org: Organization = {
      id: appUser.organization_id,
      name: 'My Organization',
      tier: 'professional',
    };

    setUser(appUser);
    setOrganization(org);
    navigate('/dashboard');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('[App] Logout error:', err);
    }
    setUser(null);
    setOrganization(null);
    setCurrentSession(null);
    localStorage.removeItem('nonprofit_edge_usage');
    navigate('/');
  };

  // ============================================
  // TOOL TRACKING HANDLERS
  // ============================================

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

  // ============================================
  // AUTH GUARD
  // ============================================

  const requireAuth = (component: React.ReactNode): React.ReactNode => {
    if (!user) {
      navigate('/login');
      return null;
    }
    return component;
  };

  // ============================================
  // LOADING STATE
  // ============================================

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <Logo width={320} />
          <p style={{ color: '#64748b', marginTop: '16px' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // DASHBOARD NAVIGATION MAP
  // ============================================

  const mapDashboardNavigation = (page: string): string => {
    const routeMap: Record<string, string> = {
      'dashboard': '/dashboard',
      'library': '/resources',
      'member-resources': '/resources',
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

  // ============================================
  // ROUTING
  // ============================================

  const renderRoute = (): React.ReactNode => {
    switch (currentRoute) {
      // ============================================
      // PUBLIC ROUTES (No login required)
      // ============================================
      case '/':
        return <Homepage onNavigate={navigate} />;
      
      case '/login':
        // If already logged in, go to dashboard
        if (user) { navigate('/dashboard'); return null; }
        return <Login onLoginSuccess={handleLoginSuccess} onNavigate={navigate} />;
      
      case '/signup':
        if (user) { navigate('/dashboard'); return null; }
        return <SignUp onSignUpSuccess={handleLoginSuccess} onNavigate={navigate} />;
      
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
        return <StrategicPlanCheckupLanding />;
      
      case '/board-assessment':
        return <BoardAssessmentLanding onNavigate={navigate} onGetStarted={() => navigate('/signup')} />;
      
      case '/ceo-evaluation':
        return <CEOEvaluationLanding onNavigate={navigate} onGetStarted={() => navigate('/signup')} />;
      
      case '/scenario-planner':
        return <ScenarioPlannerLanding onNavigate={navigate} onGetStarted={() => navigate('/signup')} />;
      
      case '/grant-review':
        return <GrantReviewLanding onNavigate={navigate} onGetStarted={() => navigate('/signup')} />;

      case '/resources-landing':
        return <ResourcesLanding onNavigate={navigate} onGetStarted={() => navigate('/signup')} />;

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
        return <LeadershipAssessmentLanding onNavigate={navigate} onGetStarted={() => navigate('/signup')} />;
      
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
      case '/member-resources':
        if (!user || !organization) { navigate('/login'); return null; }
        return (
          <ResourceLibrary 
            user={{ ...user, full_name: user.name }}
            organization={organization}
            onNavigate={(page: string) => navigate(mapDashboardNavigation(page))}
            onLogout={handleLogout}
          />
        );

      case '/events':
        if (!user || !organization) { navigate('/login'); return null; }
        return (
          <EventsCalendar 
            user={{ ...user, full_name: user.name }}
            organization={organization}
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
