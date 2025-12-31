import React, { useState, useEffect } from 'react';

// Core Pages
import Homepage from './Homepage';
import Dashboard from './Dashboard';
import SignUp from './SignUp';
import SignUpSuccess from './SignUpSuccess';

// Tool Pages
import ToolsPage from './ToolsPage';
import StrategicPlanCheckup from './StrategicPlanCheckup';
import AskTheProfessor from './AskTheProfessor';
import CEOEvaluation from './CEOEvaluation';
import BoardAssessment from './BoardAssessment';
import GrantReview from './GrantReview';
import ScenarioPlanner from './ScenarioPlanner';
import AISummary from './AISummary';

// Resource Pages
import ResourceLibrary from './ResourceLibrary';
import EventsCalendar from './EventsCalendar';

// Owner/Admin Pages
import EnhancedOwnerDashboard from './EnhancedOwnerDashboard';
import MarketingDashboard from './MarketingDashboard';
import LinkManager from './LinkManager';
import TeamAccessManager from './TeamAccessManager';

// Components
import WelcomeModal from './WelcomeModal';
import ProductTour from './ProductTour';
import AIGuideChatbot from './AIGuideChatbot';

// Types
interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'member';
  organization_id: string;
  avatar_url?: string;
  is_new_user?: boolean;
  onboarding_completed?: boolean;
}

type Route = 
  | '/' 
  | '/signup' 
  | '/signup/success'
  | '/dashboard' 
  | '/tools'
  | '/tools/strategic-plan'
  | '/tools/ask-professor'
  | '/tools/ceo-evaluation'
  | '/tools/board-assessment'
  | '/tools/grant-review'
  | '/tools/scenario-planner'
  | '/tools/ai-summary'
  | '/resources'
  | '/events'
  | '/owner'
  | '/owner/marketing'
  | '/owner/links'
  | '/owner/team';

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<Route>('/');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showProductTour, setShowProductTour] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname as Route;
      setCurrentRoute(path || '/');
    };

    window.addEventListener('popstate', handlePopState);
    
    // Set initial route from URL
    const initialPath = window.location.pathname as Route;
    if (initialPath && initialPath !== '/') {
      setCurrentRoute(initialPath);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      // In production, check Supabase session
      // For now, check localStorage for demo
      const savedUser = localStorage.getItem('nonprofit_edge_user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        
        // Check if new user needs onboarding
        if (userData.is_new_user && !userData.onboarding_completed) {
          setShowWelcomeModal(true);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = (route: Route) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
  };

  const handleLogin = async (email: string, password: string) => {
    // In production, use Supabase auth
    // Demo login for testing
    const demoUser: User = {
      id: '1',
      email: email,
      name: email.split('@')[0],
      role: email.includes('owner') ? 'owner' : 'member',
      organization_id: 'org_1',
      is_new_user: false,
      onboarding_completed: true,
    };
    
    setUser(demoUser);
    localStorage.setItem('nonprofit_edge_user', JSON.stringify(demoUser));
    navigate('/dashboard');
  };

  const handleSignUp = async (userData: any) => {
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      role: 'member',
      organization_id: 'org_' + Date.now(),
      is_new_user: true,
      onboarding_completed: false,
    };
    
    setUser(newUser);
    localStorage.setItem('nonprofit_edge_user', JSON.stringify(newUser));
    navigate('/signup/success');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nonprofit_edge_user');
    navigate('/');
  };

  const handleWelcomeComplete = (selectedAvatar?: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        avatar_url: selectedAvatar,
        is_new_user: false,
      };
      setUser(updatedUser);
      localStorage.setItem('nonprofit_edge_user', JSON.stringify(updatedUser));
    }
    setShowWelcomeModal(false);
    setShowProductTour(true);
  };

  const handleTourComplete = () => {
    if (user) {
      const updatedUser = {
        ...user,
        onboarding_completed: true,
      };
      setUser(updatedUser);
      localStorage.setItem('nonprofit_edge_user', JSON.stringify(updatedUser));
    }
    setShowProductTour(false);
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

  // Route rendering
  const renderRoute = () => {
    // Public routes (no auth required)
    switch (currentRoute) {
      case '/':
        return (
          <Homepage 
            onNavigate={navigate}
            onLogin={handleLogin}
            isLoggedIn={!!user}
          />
        );
      
      case '/signup':
        return <SignUp onNavigate={navigate} onSignUp={handleSignUp} />;
      
      case '/signup/success':
        return <SignUpSuccess onNavigate={navigate} userEmail={user?.email} />;
    }

    // Protected routes (require auth)
    if (!user) {
      navigate('/');
      return null;
    }

    switch (currentRoute) {
      // Main Dashboard
      case '/dashboard':
        return (
          <Dashboard 
            user={user}
            onNavigate={navigate}
            onLogout={handleLogout}
            onStartTour={() => setShowProductTour(true)}
          />
        );

      // Tools
      case '/tools':
        return (
          <ToolsPage 
            userTier="professional"
            onNavigate={navigate}
          />
        );
      
      case '/tools/strategic-plan':
        return <StrategicPlanCheckup />;
      
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

      // Resources
      case '/resources':
        return (
          <ResourceLibrary 
            userRole={user.role}
            onNavigate={navigate}
          />
        );
      
      case '/events':
        return (
          <EventsCalendar 
            userRole={user.role}
            onNavigate={navigate}
          />
        );

      // Owner/Admin pages
      case '/owner':
        if (user.role !== 'owner' && user.role !== 'admin') {
          navigate('/dashboard');
          return null;
        }
        return (
          <EnhancedOwnerDashboard 
            onNavigate={navigate}
          />
        );
      
      case '/owner/marketing':
        if (user.role !== 'owner' && user.role !== 'admin') {
          navigate('/dashboard');
          return null;
        }
        return <MarketingDashboard />;
      
      case '/owner/links':
        if (user.role !== 'owner' && user.role !== 'admin') {
          navigate('/dashboard');
          return null;
        }
        return <LinkManager />;
      
      case '/owner/team':
        if (user.role !== 'owner' && user.role !== 'admin') {
          navigate('/dashboard');
          return null;
        }
        return <TeamAccessManager />;

      default:
        return (
          <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
          }}>
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: '4rem', color: '#0D2C54', margin: '0 0 16px 0' }}>404</h1>
              <p style={{ color: '#64748b', marginBottom: '24px' }}>Page not found</p>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  padding: '12px 24px',
                  background: '#0097A9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {renderRoute()}

      {/* Welcome Modal for new users */}
      {showWelcomeModal && user && (
        <WelcomeModal
          userName={user.name}
          onComplete={handleWelcomeComplete}
          onSkip={() => {
            setShowWelcomeModal(false);
            navigate('/dashboard');
          }}
        />
      )}

      {/* Product Tour */}
      {showProductTour && (
        <ProductTour
          onComplete={handleTourComplete}
          onSkip={handleTourComplete}
        />
      )}

      {/* AI Chatbot (floating button) */}
      {user && currentRoute !== '/tools/ask-professor' && (
        <>
          <button
            onClick={() => setShowChatbot(!showChatbot)}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#0D2C54',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              zIndex: 1000,
            }}
            title="Ask AI Assistant"
          >
            {showChatbot ? '✕' : '💬'}
          </button>

          {showChatbot && (
            <div style={{
              position: 'fixed',
              bottom: '96px',
              right: '24px',
              width: '380px',
              height: '500px',
              zIndex: 999,
            }}>
              <AIGuideChatbot onClose={() => setShowChatbot(false)} />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default App;
