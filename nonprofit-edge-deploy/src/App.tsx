/**
 * THE NONPROFIT EDGE - App.tsx
 * Complete Routing with Usage Tracking Integration
 * 
 * Route Pattern:
 *   /tool-name         → Landing page (public, marketing)
 *   /tool-name/use     → Actual tool (requires login, tracked)
 * 
 * All tools receive tracking props to connect with Dashboard counters
 * 
 * UPDATED: January 23, 2026
 * - Added /ask-professor route for full-page Ask the Professor
 * - Fixed logo scaling issue
 * - Added DashboardV2 (new design)
 * - Added OnboardingQuestionnaire for new users
 */

import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

// ============================================
// COMPONENT IMPORTS
// ============================================

// Dashboard & Core Components
import RealDashboard from './components/Dashboard';
import DashboardV2 from './components/DashboardV2';  // NEW DASHBOARD
import AskTheProfessorFullPage from './components/AskTheProfessorFullPage';  // NEW FULL PAGE
import OnboardingQuestionnaire from './components/OnboardingQuestionnaire';  // NEW ONBOARDING
import ResourceLibrary from './components/ResourceLibrary';
import TemplateVault from './components/TemplateVault';  // USER TEMPLATE LIBRARY
import TemplateManager from './components/TemplateManager';  // ADMIN TEMPLATE UPLOAD
import ConversationHistory from './components/ConversationHistory';  // PROFESSOR CHAT HISTORY
import AssessmentSetup from './components/AssessmentSetup';  // ASSESSMENT ADMIN SETUP
import EventsCalendar from './components/EventsCalendar';
import EnhancedOwnerDashboard from './components/EnhancedOwnerDashboard';
import MarketingDashboard from './components/MarketingDashboard';
import LinkManager from './components/LinkManager';
import TeamAccessManager from './components/TeamAccessManager';
import ContentManager from './components/ContentManager';
import AdminDashboard from './components/AdminDashboard';
import PlatformOwnerDashboard from './components/PlatformOwnerDashboard';
import UserManager from './components/UserManager';

// Auth Components
import Login from './components/Login';
import SignUp from './components/SignUp';
import SignUpSuccess from './components/SignUpSuccess';
// import SignupFlow from './components/SignupFlow';  // COMMENTED OUT - causes Router context error
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

// UI Components
import Homepage from './components/Homepage';
// import WhyWeExist from './components/WhyWeExist'; // COMMENTED - page not ready yet
// import Sidebar from './components/Sidebar';  // COMMENTED OUT - causes Router context error
// import ProductTour from './components/ProductTour';  // COMMENTED OUT - not used directly
// import WelcomeModal from './components/WelcomeModal';  // COMMENTED OUT - not used directly
// import AIGuideChatbot from './components/AIGuideChatbot';  // COMMENTED OUT - not used directly

// Tool Components (Actual Tools)
import StrategicPlanCheckup from './StrategicPlanCheckup';
import CEOEvaluation from './CEOEvaluation';
import BoardAssessment from './BoardAssessment';
import GrantReview from './GrantReview';
import ScenarioPlanner from './ScenarioPlanner';
import AskTheProfessor from './components/AskTheProfessor';
import AISummary from './AISummary';

// Landing Page Components
import ScenarioPlannerLanding from './ScenarioPlannerLanding';
import BoardAssessmentLanding from './BoardAssessmentLanding';
import CEOEvaluationLanding from './CEOEvaluationLanding';
import StrategicPlanCheckupLanding from './StrategicPlanCheckupLanding';
import GrantReviewLanding from './GrantReviewLanding';
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
  // Onboarding fields
  onboarding_completed?: boolean;
  focus_area?: string;
  engagement_preference?: string;
  leadership_journey_opted_in?: boolean;
  tutorial_opted_in?: boolean;
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

interface OnboardingData {
  role: string;
  organizationSize: string;
  focusArea: string;
  engagementPreference: string;
  leadershipJourneyOptIn: boolean;
  tutorialOptIn: boolean;
}

// ============================================
// BRAND COLORS
// ============================================

const NAVY = '#0D2C54';
const TEAL = '#0097A9';

// ============================================
// LOGO COMPONENT - FIXED for proper scaling
// ============================================

const Logo = ({ width = 180 }: { width?: number }) => (
  <svg width={width} height={width * 0.4} viewBox="250 270 500 220">
    <g>
      {/* Outer arc */}
      <path fill="#0D2C54" d="M438.46,469.14c-18.16,14.03-40.93,22.38-65.64,22.38c-30.79,0-58.55-12.94-78.16-33.69c2.85,0.46,5.7,0.81,8.57,1.06c9.13,0.79,17.9,0.49,26.26-0.63c12.72,7.44,27.53,11.71,43.33,11.71c17.17,0,33.17-5.03,46.59-13.71C422.94,460.11,428.93,465.14,438.46,469.14z"/>
      {/* Inner arc */}
      <path fill="#0D2C54" d="M294.86,420.29c-8.64,2.53-16.05,3.61-21.74,4.02c-5.05-12.44-7.82-26.05-7.82-40.31c0-59.37,48.14-107.52,107.52-107.52c25.62,0,49.15,8.96,67.62,23.94c-9.33,2.92-16.19,7.85-20.47,11.69c-13.54-8.9-29.74-14.08-47.15-14.08c-47.48,0-85.97,38.49-85.97,85.97C286.85,396.97,289.72,409.27,294.86,420.29z"/>
      {/* Arrow */}
      <path fill="#0097A9" d="M258.67,434.74c0,0,61.28,14.58,121.38-60.61l-18.3-13.11l72.86-22.42l0.39,71.06l-18.78-13.01C416.22,396.64,340.29,479.82,258.67,434.74z"/>
      {/* THE */}
      <g>
        <path fill="#0D2C54" d="M491.43,298.55v7.98h-9.88v32.91h-9.08v-32.91h-9.88v-7.98H491.43z"/>
        <path fill="#0D2C54" d="M528.3,298.55v40.89h-9.08V322.6h-14.13v16.83H496v-40.89h9.08v16.02h14.13v-16.02H528.3z"/>
        <path fill="#0D2C54" d="M543.91,306.53v8.27h12.17v7.69h-12.17v8.97h13.76v7.98h-22.84v-40.89h22.84v7.98H543.91z"/>
      </g>
      {/* NON */}
      <g>
        <path fill="#0097A9" d="M495.94,392.68h-9.08l-15.19-25.22v25.22h-9.08v-40.89h9.08l15.19,25.34v-25.34h9.08V392.68z"/>
        {/* O - using stroke instead of fill to keep hollow */}
        <path fill="none" stroke="#0097A9" strokeWidth="8" d="M520.17,372.13c0-10.5,7.5-19,16.76-19c9.26,0,16.76,8.5,16.76,19c0,10.5-7.5,19-16.76,19C527.67,391.13,520.17,382.63,520.17,372.13z"/>
        <path fill="#0097A9" d="M577.65,392.68h-9.08l-15.19-25.22v25.22h-9.08v-40.89h9.08l15.19,25.34v-25.34h9.08V392.68z"/>
      </g>
      {/* EDGE */}
      <g>
        <path fill="#0D2C54" d="M476.97,418.87v13.1h19.27v12.18h-19.27v14.21h21.8v12.64h-36.19v-64.78h36.19v12.64H476.97z"/>
        {/* D - using stroke to keep hollow */}
        <path fill="none" stroke="#0D2C54" strokeWidth="8" d="M522.14,406.23h14c10,0,18.14,3.5,23.5,9.5c5.36,6,8.04,14,8.04,24c0,10-2.68,18-8.04,24c-5.36,6-13.5,9.5-23.5,9.5h-14V406.23z"/>
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
  
  // Usage tracking state
  const [usage, setUsage] = useState<UsageData>({
    tools_started: 0,
    tools_completed: 0,
    tools_used_this_month: 0,
    downloads_this_month: 0,
    professor_sessions_this_month: 0,
    report_downloads: 0,
  });

  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  // ==========================================
  // INITIALIZATION - Fixed with Supabase
  // ==========================================

  useEffect(() => {
    // Handle browser navigation
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);

    // Initialize auth
    const initializeAuth = async () => {
      try {
        // Check for existing Supabase session FIRST
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // User is logged in via Supabase - create user object
          const newUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.email?.split('@')[0] || 'User',
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            role: 'member',
            organization_id: 'org_1',
            created_at: session.user.created_at || new Date().toISOString(),
            // Check onboarding status from metadata or default to false
            onboarding_completed: session.user.user_metadata?.onboarding_completed || false,
            focus_area: session.user.user_metadata?.focus_area || '',
            engagement_preference: session.user.user_metadata?.engagement_preference || 'weekly',
            leadership_journey_opted_in: session.user.user_metadata?.leadership_journey_opted_in || false,
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
          
          // Check if user needs onboarding
          const needsOnboarding = !newUser.onboarding_completed;
          setShowOnboarding(needsOnboarding);
        } else {
          // No Supabase session - check localStorage as fallback
          const savedUser = localStorage.getItem('nonprofit_edge_user');
          const savedOrg = localStorage.getItem('nonprofit_edge_org');
          
          if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            // Check onboarding from localStorage
            setShowOnboarding(!parsedUser.onboarding_completed);
          }
          if (savedOrg) {
            setOrganization(JSON.parse(savedOrg));
          }
        }
        
        // Load saved usage
        const savedUsage = localStorage.getItem('nonprofit_edge_usage');
        if (savedUsage) {
          setUsage(JSON.parse(savedUsage));
        }
      } catch (e) {
        console.error('Error initializing auth:', e);
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    // Listen for Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[App] Auth event:', event);
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setOrganization(null);
          setShowOnboarding(false);
          localStorage.removeItem('nonprofit_edge_user');
          localStorage.removeItem('nonprofit_edge_org');
          setCurrentRoute('/');
          window.history.pushState({}, '', '/');
        }
        
        // Handle new sign up - show onboarding
        if (event === 'SIGNED_IN' && session) {
          const isNewUser = !session.user.user_metadata?.onboarding_completed;
          setShowOnboarding(isNewUser);
        }
      }
    );

    return () => {
      window.removeEventListener('popstate', handlePopState);
      subscription.unsubscribe();
    };
  }, []);

  // Save usage to localStorage when it changes
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
  // AUTH HANDLERS - Fixed with Supabase
  // ==========================================

  const handleLogin = async (email: string) => {
    // Get the actual session from Supabase
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      const newUser: User = {
        id: session.user.id,  // Use real Supabase user ID
        email: session.user.email || email,
        name: session.user.email?.split('@')[0] || 'User',
        full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
        role: 'member',
        organization_id: 'org_1',
        created_at: session.user.created_at || new Date().toISOString(),
        onboarding_completed: session.user.user_metadata?.onboarding_completed || false,
        focus_area: session.user.user_metadata?.focus_area || '',
        engagement_preference: session.user.user_metadata?.engagement_preference || 'weekly',
        leadership_journey_opted_in: session.user.user_metadata?.leadership_journey_opted_in || false,
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
      
      // Check if needs onboarding
      setShowOnboarding(!newUser.onboarding_completed);
      
      navigate('/dashboard');
    } else {
      // Fallback if no Supabase session (shouldn't happen normally)
      console.warn('[App] No Supabase session found, using email fallback');
      const newUser: User = {
        id: 'user_' + Date.now(),
        email: email,
        name: email.split('@')[0],
        full_name: email.split('@')[0],
        role: 'member',
        organization_id: 'org_1',
        created_at: new Date().toISOString(),
        onboarding_completed: false,
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
      
      // New user needs onboarding
      setShowOnboarding(true);
      
      navigate('/dashboard');
    }
  };

  const handleLogout = async () => {
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    setUser(null);
    setOrganization(null);
    setCurrentSession(null);
    setShowOnboarding(false);
    localStorage.removeItem('nonprofit_edge_user');
    localStorage.removeItem('nonprofit_edge_org');
    localStorage.removeItem('nonprofit_edge_usage');
    navigate('/');
  };

  // ==========================================
  // ONBOARDING HANDLER
  // ==========================================

  const handleOnboardingComplete = async (data: OnboardingData) => {
    if (!user) return;
    
    console.log('[App] Onboarding completed:', data);
    
    // Update user with onboarding data
    const updatedUser: User = {
      ...user,
      onboarding_completed: true,
      focus_area: data.focusArea,
      engagement_preference: data.engagementPreference,
      leadership_journey_opted_in: data.leadershipJourneyOptIn,
      tutorial_opted_in: data.tutorialOptIn,
    };
    
    setUser(updatedUser);
    localStorage.setItem('nonprofit_edge_user', JSON.stringify(updatedUser));
    setShowOnboarding(false);
    
    // Show tutorial if user opted in
    if (data.tutorialOptIn) {
      setShowTutorial(true);
    }
    
    // Save to Supabase (update user metadata)
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          onboarding_completed: true,
          focus_area: data.focusArea,
          engagement_preference: data.engagementPreference,
          leadership_journey_opted_in: data.leadershipJourneyOptIn,
          tutorial_opted_in: data.tutorialOptIn,
          role: data.role,
          organization_size: data.organizationSize,
        }
      });
      
      if (error) {
        console.error('[App] Error saving onboarding to Supabase:', error);
      } else {
        console.log('[App] Onboarding saved to Supabase successfully');
      }
    } catch (e) {
      console.error('[App] Error updating user metadata:', e);
    }
  };

  // ==========================================
  // TRACKING HANDLERS (Connect to Dashboard)
  // ==========================================

  const handleToolStart = async (toolId: string, toolName: string): Promise<string | null> => {
    if (!user || !organization) return null;

    const sessionId = `session_${Date.now()}`;
    const session: ToolSession = {
      id: sessionId,
      tool_type: toolId,
      started_at: new Date().toISOString(),
    };
    setCurrentSession(session);

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
    console.log(`Tool COMPLETED: ${toolName} (Score: ${score || 'N/A'}) - Counters updated!`);
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

    setUsage(prev => ({
      ...prev,
      professor_sessions_this_month: prev.professor_sessions_this_month + 1,
    }));

    navigate('/ask-professor');
  };

  // ==========================================
  // TOOL PAGE WRAPPER (with tracking)
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
      if (sessionId) {
        handleToolComplete(sessionId, toolName, score);
      }
    };

    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        <header style={{ 
          background: 'white', 
          padding: '12px 32px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '1px solid #e2e8f0' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Logo width={140} />
            <span style={{ color: '#cbd5e1' }}>|</span>
            <span style={{ color: NAVY, fontWeight: 600 }}>{toolName}</span>
          </div>
          <button 
            onClick={() => navigate('/dashboard')} 
            style={{ 
              padding: '8px 16px', 
              background: '#f1f5f9', 
              color: '#475569', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer' 
            }}
          >
            ← Back to Dashboard
          </button>
        </header>
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { 
              onComplete, 
              sessionId,
              onBack: () => navigate('/dashboard')
            } as any);
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
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#f8fafc' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <Logo width={200} />
          <p style={{ color: '#64748b', marginTop: '16px' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ROUTE MAPPING HELPER
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
      'constraint-assessment': '/constraint-assessment',
      'getting-started': '/getting-started',
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
      'homepage-editor': '/admin/homepage',
      'member-resources': '/resources',
      'leadership-profile': '/leadership-profile',
      'constraint-report': '/constraint-report',
      'tools': '/tools',
      'conversations': '/conversations',
      'ask-professor': '/ask-professor',
    };
    return routeMap[page] || `/${page}`;
  };

  // ==========================================
  // ROUTING
  // ==========================================

  const renderRoute = (): React.ReactNode => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlSessionId = urlParams.get('session');

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

      // case '/why-we-exist':
      //   return <WhyWeExist onNavigate={navigate} />;

      // ========================================
      // TOOL LANDING PAGES (Public)
      // ========================================
      
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
      
      case '/ask-the-professor':
        return <ScenarioPlannerLanding onNavigate={navigate} onGetStarted={handleStartProfessor} />;
      
      case '/certifications':
        return <CertificationsLanding onNavigate={navigate} />;

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
      
      case '/board-assessment/setup':
        return requireAuth(<AssessmentSetup type="board-assessment" />);
      
      case '/ceo-evaluation/use':
        return requireAuth(
          <ToolPageWrapper toolId="ceo-evaluation" toolName="CEO Evaluation">
            <CEOEvaluation />
          </ToolPageWrapper>
        );
      
      case '/ceo-evaluation/setup':
        return requireAuth(<AssessmentSetup type="ceo-evaluation" />);
      
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
      // ASK THE PROFESSOR - FULL PAGE (NEW!)
      // ========================================
      
      case '/ask-professor':
        return requireAuth(<AskTheProfessorFullPage />);

      // ========================================
      // DASHBOARD & MAIN APP (Require Auth)
      // ========================================
      
      case '/dashboard':
        if (!user || !organization) {
          navigate('/login');
          return null;
        }
        
        // Show onboarding questionnaire for new users
        if (showOnboarding) {
          return (
            <OnboardingQuestionnaire
              userName={user.name}
              onComplete={handleOnboardingComplete}
            />
          );
        }
        
        // Show the new DashboardV2
        return <DashboardV2 />;

      // Keep old dashboard accessible at /dashboard-old if needed
      case '/dashboard-old':
        if (!user || !organization) {
          navigate('/login');
          return null;
        }
        return (
          <RealDashboard 
            user={{
              ...user,
              full_name: user.name,
              avatar_url: null,
              profile_photo: null,
              created_at: user.created_at || new Date().toISOString(),
            }}
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
        return requireAuth(
          <ResourceLibrary 
            user={{ ...user!, full_name: user!.name }}
            organization={organization!}
            onNavigate={(page: string) => navigate(mapDashboardNavigation(page))}
            onLogout={handleLogout}
          />
        );

      case '/templates':
      case '/template-vault':
        return requireAuth(<TemplateVault />);

      case '/admin/templates':
        return requireAuth(<TemplateManager />);

      case '/conversations':
      case '/chat-history':
        return requireAuth(<ConversationHistory />);

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
      // PLACEHOLDER ROUTES (To be built)
      // ========================================
      
      case '/leadership-profile':
        return requireAuth(
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h1>My Leadership Profile</h1>
            <p>Coming soon...</p>
            <button onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
          </div>
        );
      
      case '/constraint-report':
        return requireAuth(
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h1>Our Constraint Report</h1>
            <p>Coming soon...</p>
            <button onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
          </div>
        );
      
      case '/tools':
        return requireAuth(
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h1>All Tools</h1>
            <p>Coming soon...</p>
            <button onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
          </div>
        );
      
      case '/conversations':
        return requireAuth(
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h1>Conversation History</h1>
            <p>Coming soon...</p>
            <button onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
          </div>
        );
      
      case '/settings':
        return requireAuth(
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h1>Settings</h1>
            <p>Coming soon...</p>
            <button onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
          </div>
        );

      // ========================================
      // ADMIN ROUTES
      // ========================================

      case '/admin':
      case '/admin/owner':
      case '/admin/enhanced':
        return requireAuth(
          <EnhancedOwnerDashboard onNavigate={(page: string) => navigate(`/${page}`)} />
        );

      case '/admin/marketing':
        return requireAuth(<MarketingDashboard />);

      case '/admin/users':
        return requireAuth(<UserManager supabase={supabase} onNavigate={navigate} />);

      case '/admin/links':
        return requireAuth(<LinkManager />);

      case '/admin/team':
        return requireAuth(<TeamAccessManager />);

      case '/admin/content':
        return requireAuth(<ContentManager />);

      case '/admin/platform':
        return requireAuth(<AdminDashboard />);

      // ========================================
      // LEGACY ROUTE REDIRECTS
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
      
      case '/tools/ask-professor':
        navigate('/ask-professor');
        return null;
      
      case '/tools/ai-summary':
        navigate('/ai-summary/use');
        return null;

      case '/tools/scenario-planner/info':
        navigate('/scenario-planner');
        return null;

      case '/owner':
        navigate('/admin/owner');
        return null;

      case '/owner/enhanced':
        navigate('/admin/enhanced');
        return null;

      case '/owner/marketing':
        navigate('/admin/marketing');
        return null;

      case '/owner/links':
        navigate('/admin/links');
        return null;

      case '/owner/team':
        navigate('/admin/team');
        return null;

      // ========================================
      // DEFAULT / 404
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
