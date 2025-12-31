/**
 * THE NONPROFIT EDGE - Dashboard
 * With Product Tour, Chatbot, and Owner Access
 * Updated with official SVG logo
 */

import React, { useState, useEffect } from 'react';
import ProductTour from './ProductTour';
import AIGuideChatbot from './AIGuideChatbot';
import WelcomeModal from './WelcomeModal';

// Brand colors
const NAVY = '#0D2C54';
const TEAL = '#0097A9';
const TEAL_LIGHT = '#e6f7f9';

// Owner email - gets full admin access
const OWNER_EMAIL = 'lyn@thepivotalgroup.com';

// Official Logo Component
const Logo = ({ width = 140 }: { width?: number }) => (
  <svg width={width} height={width * 0.35} viewBox="250 270 520 220">
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

interface DashboardProps {
  user: any;
  organization: any;
  usage: any;
  teamCount: number;
  onNavigate: (page: string) => void;
  onDownload: (resourceId: string) => void;
  onStartProfessor: () => void;
  onLogout: () => void;
  supabase?: any;
}

interface Tool {
  id: string;
  name: string;
  status: string;
  statusColor: string;
  icon: string;
  route: string;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  organization,
  usage,
  teamCount,
  onNavigate,
  onDownload,
  onStartProfessor,
  onLogout,
  supabase
}) => {
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  const [showTour, setShowTour] = useState(false);
  const [tourCompleted, setTourCompleted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const isOwner = user?.email?.toLowerCase() === OWNER_EMAIL.toLowerCase();

  useEffect(() => {
    const completed = localStorage.getItem('nonprofit-edge-tour-completed');
    const dismissed = localStorage.getItem('nonprofit-edge-onboarding-dismissed');
    const welcomeCompleted = localStorage.getItem('nonprofit-edge-welcome-completed');
    
    if (completed) {
      setTourCompleted(true);
      setShowWelcomeBanner(false);
    }
    if (dismissed) {
      setOnboardingDismissed(true);
    }
    if (!welcomeCompleted && !isProfileComplete()) {
      setShowWelcomeModal(true);
    }
  }, []);

  const isWithin7Days = () => {
    const createdAt = user?.created_at;
    if (!createdAt) return true;
    const signupDate = new Date(createdAt);
    const now = new Date();
    const daysSinceSignup = Math.floor((now.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceSignup <= 7;
  };

  const isProfileComplete = () => {
    const hasAvatar = user?.avatar_url || user?.profile_photo;
    const hasOrgLogo = organization?.logo_url;
    return hasAvatar && hasOrgLogo;
  };

  const shouldShowOnboarding = !onboardingDismissed && (isWithin7Days() || !isProfileComplete());

  const handleDismissOnboarding = () => {
    setOnboardingDismissed(true);
    localStorage.setItem('nonprofit-edge-onboarding-dismissed', 'true');
  };

  const tools: Tool[] = [
    { id: 'strategic-plan', name: 'Strategic Plan Check-Up', status: 'Ready', statusColor: TEAL, icon: '📊', route: 'strategic-checkup' },
    { id: 'ceo-evaluation', name: 'CEO Evaluation', status: 'Ready', statusColor: TEAL, icon: '👤', route: 'ceo-evaluation' },
    { id: 'board-assessment', name: 'Board Assessment', status: 'Coming Soon', statusColor: '#6b7280', icon: '👥', route: 'board-assessment' },
    { id: 'grant-review', name: 'Grant & RFP Review', status: 'Ready', statusColor: TEAL, icon: '📝', route: 'grant-review' },
    { id: 'scenario-planner', name: 'Scenario Planner', status: 'Ready', statusColor: TEAL, icon: '🔮', route: 'scenario-planner' },
    { id: 'ask-professor', name: 'Ask The Professor', status: 'Ready', statusColor: TEAL, icon: '🎓', route: 'ask-professor' },
    { id: 'ai-summary', name: 'AI Summary', status: 'Ready', statusColor: TEAL, icon: '✨', route: 'ai-summary' }
  ];

  const handleTourComplete = () => {
    setShowTour(false);
    setTourCompleted(true);
    setShowWelcomeBanner(false);
    localStorage.setItem('nonprofit-edge-tour-completed', 'true');
  };

  const getTierInfo = () => {
    const tier = organization?.tier || 'professional';
    const tiers: Record<string, { name: string; color: string }> = {
      essential: { name: 'Essential', color: '#6b7280' },
      professional: { name: 'Professional', color: TEAL },
      premium: { name: 'Premium', color: '#8b5cf6' },
      enterprise: { name: 'Enterprise', color: '#f59e0b' }
    };
    return tiers[tier] || tiers.professional;
  };

  const tierInfo = getTierInfo();
  const firstName = user?.full_name?.split(' ')[0] || 'there';

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside className={`${mobile ? 'fixed inset-0 z-50 bg-black/50 lg:hidden' : 'hidden lg:flex w-64 bg-white border-r border-gray-200 fixed h-screen flex-col'}`}>
      {mobile && <div className="absolute inset-0" onClick={() => setMobileMenuOpen(false)} />}
      <div className={`${mobile ? 'absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col' : 'flex flex-col h-full'}`}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <Logo width={150} />
          {mobile && <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500 text-xl">✕</button>}
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <a onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer" style={{ backgroundColor: TEAL_LIGHT, color: NAVY }}>
            <span>🏠</span> Dashboard
          </a>
          <a onClick={() => { onNavigate('library'); setMobileMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50">
            <span>📚</span> Resource Library
          </a>
          <a onClick={() => { onNavigate('events'); setMobileMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50">
            <span>📅</span> Events
          </a>
          <a onClick={() => { onNavigate('team'); setMobileMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50">
            <span>👥</span> Team
          </a>
          <a onClick={() => { onNavigate('reports'); setMobileMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50">
            <span>📄</span> My Reports
          </a>

          {isOwner && (
            <>
              <div className="pt-4 pb-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3">Admin</div>
              </div>
              <a onClick={() => { onNavigate('content-manager'); setMobileMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50">
                <span>📝</span> Content Manager
              </a>
              <a onClick={() => { onNavigate('owner-dashboard'); setMobileMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50">
                <span>⚙️</span> Platform Admin
              </a>
              <a onClick={() => { onNavigate('enhanced-owner'); setMobileMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50">
                <span>📊</span> Owner Dashboard
              </a>
              <a onClick={() => { onNavigate('marketing'); setMobileMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50">
                <span>📢</span> Marketing
              </a>
              <a onClick={() => { onNavigate('link-manager'); setMobileMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50">
                <span>🔗</span> Link Manager
              </a>
              <a onClick={() => { onNavigate('team-access'); setMobileMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50">
                <span>🔐</span> Team Access
              </a>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: TEAL }}>
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate" style={{ color: NAVY }}>{user?.full_name || 'User'}</div>
              <div className="text-xs text-gray-400">{isOwner ? 'Owner' : tierInfo.name}</div>
            </div>
          </div>
          <button onClick={onLogout} className="mt-3 w-full text-xs text-gray-500 hover:text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition">
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {showWelcomeModal && (
        <WelcomeModal isOpen={showWelcomeModal} user={user} organization={organization} supabase={supabase}
          onComplete={() => { setShowWelcomeModal(false); if (!tourCompleted) setShowTour(true); }}
          onSkip={() => setShowWelcomeModal(false)}
        />
      )}

      {showTour && <ProductTour isOpen={showTour} onClose={() => setShowTour(false)} onComplete={handleTourComplete} />}

      <Sidebar />
      {mobileMenuOpen && <Sidebar mobile />}

      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-40">
        <button onClick={() => setMobileMenuOpen(true)} className="text-2xl" style={{ color: NAVY }}>☰</button>
        <Logo width={120} />
        <div className="w-8" />
      </div>

      <div className="lg:ml-64 pt-14 lg:pt-0">
        <div className="p-4 lg:p-6 flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            {shouldShowOnboarding && showWelcomeBanner && !tourCompleted && (
              <div className="rounded-2xl p-5 lg:p-6 text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${TEAL}, #007d8a)` }}>
                <button onClick={() => setShowWelcomeBanner(false)} className="absolute top-3 right-3 text-white/70 hover:text-white text-xl">✕</button>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🎉</span>
                  <h2 className="text-lg lg:text-xl font-bold">Welcome, {firstName}!</h2>
                </div>
                <p className="text-white/90 mb-4 text-sm lg:text-base">
                  You now have access to strategic tools built for nonprofit leaders. Take a quick tour to get started.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button onClick={() => setShowTour(true)} className="px-4 py-2 bg-white rounded-lg font-semibold text-sm hover:bg-gray-100 transition" style={{ color: NAVY }}>
                    Take a Quick Tour (30 sec)
                  </button>
                  <button onClick={() => setShowWelcomeBanner(false)} className="px-4 py-2 bg-white/20 rounded-lg font-semibold text-sm text-white hover:bg-white/30 transition">
                    I'll explore on my own
                  </button>
                </div>
              </div>
            )}

            <div className="rounded-2xl p-4 lg:p-5 text-white" style={{ background: `linear-gradient(135deg, ${NAVY}, #122443)` }}>
              <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">TODAY'S INSIGHT</div>
              <p className="text-sm lg:text-base font-semibold leading-relaxed mb-2">
                "The board's job isn't to run the organization. It's to make sure the organization is well-run."
              </p>
              <p className="text-xs text-gray-400">— "Governance as Leadership" by Chait, Ryan & Taylor</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-sm font-bold" style={{ color: NAVY }}>Your Tools</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                  {tools.map((tool) => (
                    <div key={tool.id} onClick={() => onNavigate(tool.route)}
                      className="rounded-xl border-2 border-gray-200 cursor-pointer hover:shadow-lg hover:border-teal-400 transition-all overflow-hidden group bg-white">
                      <div className="p-4 text-center">
                        <div className="text-4xl mb-3">{tool.icon}</div>
                        <div className="font-semibold text-sm mb-1" style={{ color: NAVY }}>{tool.name}</div>
                        <div className="text-xs font-medium" style={{ color: tool.statusColor }}>{tool.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-72 space-y-6">
            <div className="rounded-2xl p-4 lg:p-5 text-white cursor-pointer hover:shadow-xl transition" style={{ background: `linear-gradient(135deg, ${TEAL}, #007d8a)` }} onClick={onStartProfessor}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🎓</span>
                <span className="font-bold">Ask the Professor</span>
              </div>
              <p className="text-sm text-white/80 mb-3">Get expert guidance on strategy, governance, and leadership.</p>
              <div className="text-xs bg-white/20 rounded-lg px-3 py-2 text-center">
                {usage?.professor_sessions_this_month || 0} sessions this month
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-sm font-bold" style={{ color: NAVY }}>Upcoming Events</h3>
                <a onClick={() => onNavigate('events')} className="text-xs font-semibold cursor-pointer hover:underline" style={{ color: TEAL }}>See all →</a>
              </div>
              <div className="p-3 space-y-2">
                {[
                  { month: 'JAN', day: '15', title: 'Board Engagement Strategies', time: '12:00 PM PT', color: NAVY },
                  { month: 'JAN', day: '22', title: 'Strategic Planning Workshop', time: '10:00 AM PT', color: TEAL }
                ].map((event, i) => (
                  <div key={i} className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="w-11 h-11 rounded-lg flex flex-col items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: event.color }}>
                      <span className="text-[10px]">{event.month}</span>
                      <span className="text-base">{event.day}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate" style={{ color: NAVY }}>{event.title}</div>
                      <div className="text-xs text-gray-500">{event.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <h3 className="text-sm font-bold mb-3" style={{ color: NAVY }}>This Month</h3>
              <div className="space-y-2">
                {[
                  { label: 'Tools Used', value: usage?.tools_used_this_month || 0 },
                  { label: 'Downloads', value: usage?.downloads_this_month || 0 },
                  { label: 'Professor Sessions', value: usage?.professor_sessions_this_month || 0 }
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{stat.label}</span>
                    <span className="text-sm font-bold" style={{ color: NAVY }}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AIGuideChatbot user={user} organization={organization} onNavigate={onNavigate} />
    </div>
  );
};

export default Dashboard;
