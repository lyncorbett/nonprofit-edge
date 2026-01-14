/**
 * THE NONPROFIT EDGE - Dashboard Component
 * Version: 5.0 - Final Production Version
 * 
 * Features:
 * - Plus Jakarta Sans font (warmer feel)
 * - 6 tool cards (5 tools + Ask the Professor)
 * - My Leadership Journey button
 * - Collapsible Owner Tools accordion
 * - Updated sidebar structure
 */

import React, { useState, useEffect } from 'react';

// ============================================
// COLORS
// ============================================
const COLORS = {
  navy: '#0D2C54',
  navyLight: '#1a4175',
  teal: '#0097A9',
  tealDark: '#007d8c',
  gold: '#D4A84B',
  white: '#ffffff',
  gray50: '#f8fafc',
  gray100: '#f1f5f9',
  gray200: '#e2e8f0',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray900: '#111827',
};

// ============================================
// ACCESS LEVELS
// ============================================
const OWNER_EMAILS = ['lyn@thepivotalgroup.com'];
const ADMIN_EMAILS = ['asha@thepivotalgroup.com'];

// ============================================
// TIER LIMITS
// ============================================
const TIER_LIMITS = {
  essential: { downloads: 10, atpSessions: 10, seats: 1 },
  professional: { downloads: 25, atpSessions: 50, seats: 5 },
  premium: { downloads: 100, atpSessions: Infinity, seats: 10 },
};

// ============================================
// N8N WEBHOOKS
// ============================================
const N8N_WEBHOOKS: Record<string, string> = {
  'board-assessment': 'https://thenonprofitedge.app.n8n.cloud/webhook/board-assessment',
  'strategic-checkup': 'https://thenonprofitedge.app.n8n.cloud/webhook/strategic-checkup',
  'ceo-evaluation': 'https://thenonprofitedge.app.n8n.cloud/webhook/ceo-evaluation',
  'scenario-planner': 'https://thenonprofitedge.app.n8n.cloud/webhook/scenario-planner',
  'grant-review': 'https://thenonprofitedge.app.n8n.cloud/webhook/grant-review',
  'ask-professor': 'https://thenonprofitedge.app.n8n.cloud/webhook/ask-professor',
};

// ============================================
// TOOLS CONFIG - 5 tools (Ask the Professor is separate card)
// ============================================
const TOOLS = [
  { id: 'board-assessment', name: 'Board Assessment', status: 'Ready', image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80', webhookKey: 'board-assessment' },
  { id: 'strategic-plan', name: 'Strategic Plan Check-Up', status: 'Ready', image: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=600&q=80', webhookKey: 'strategic-checkup' },
  { id: 'ceo-evaluation', name: 'CEO Evaluation', status: 'Ready', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80', webhookKey: 'ceo-evaluation' },
  { id: 'scenario-planner', name: 'Scenario Planner', status: 'Ready', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80', webhookKey: 'scenario-planner' },
  { id: 'grant-review', name: 'Grant Review', status: 'Ready', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80', webhookKey: 'grant-review' },
];

// ============================================
// TOUR STEPS
// ============================================
const TOUR_STEPS = [
  { title: 'Welcome to The Nonprofit Edge! 🎉', content: 'The platform built by nonprofit leaders, for nonprofit leaders.' },
  { title: 'Ask the Professor 🎓', content: 'Get expert guidance from Dr. Lyn Corbett\'s 25+ years of nonprofit experience.' },
  { title: 'Your Strategic Tools', content: 'Each tool evaluates a critical area of your organization.' },
  { title: 'My Leadership Journey', content: 'Track your growth with daily challenges and achievement badges.' },
  { title: 'Ready to Start?', content: 'We recommend beginning with the Board Assessment.' },
];

// ============================================
// LOGO COMPONENT
// ============================================
const Logo = () => (
  <svg viewBox="0 0 1024 768" style={{ height: '80px', width: 'auto' }}>
    <style>{`.st0{fill:#0D2C54;}.st1{fill:#0097A9;}`}</style>
    <g>
      <g>
        <path className="st0" d="M438.46,469.14c-18.16,14.03-40.93,22.38-65.64,22.38c-30.79,0-58.55-12.94-78.16-33.69c2.85,0.46,5.7,0.81,8.57,1.06c9.13,0.79,17.9,0.49,26.26-0.63c12.72,7.44,27.53,11.71,43.33,11.71c17.17,0,33.17-5.03,46.59-13.71C422.94,460.11,428.93,465.14,438.46,469.14z"/>
        <path className="st0" d="M294.86,420.29c-8.64,2.53-16.05,3.61-21.74,4.02c-5.05-12.44-7.82-26.05-7.82-40.31c0-59.37,48.14-107.52,107.52-107.52c25.62,0,49.15,8.96,67.62,23.94c-9.33,2.92-16.19,7.85-20.47,11.69c-13.54-8.9-29.74-14.08-47.15-14.08c-47.48,0-85.97,38.49-85.97,85.97C286.85,396.97,289.72,409.27,294.86,420.29z"/>
        <path className="st1" d="M258.67,434.74c0,0,61.28,14.58,121.38-60.61l-18.3-13.11l72.86-22.42l0.39,71.06l-18.78-13.01C416.22,396.64,340.29,479.82,258.67,434.74z"/>
      </g>
      <g>
        <g>
          <path className="st0" d="M491.43,298.55v7.98h-9.88v32.91h-9.08v-32.91h-9.88v-7.98H491.43z"/>
          <path className="st0" d="M528.3,298.55v40.89h-9.08V322.6h-14.13v16.83H496v-40.89h9.08v16.02h14.13v-16.02H528.3z"/>
          <path className="st0" d="M543.91,306.53v8.27h12.17v7.69h-12.17v8.97h13.76v7.98h-22.84v-40.89h22.84v7.98H543.91z"/>
        </g>
        <g>
          <path className="st1" d="M495.94,392.68h-9.08l-15.19-25.22v25.22h-9.08v-40.89h9.08l15.19,25.34v-25.34h9.08V392.68z"/>
          <path className="st1" d="M510.53,390.41c-2.92-1.79-5.24-4.28-6.96-7.48c-1.72-3.2-2.58-6.8-2.58-10.8c0-4,0.86-7.59,2.58-10.78c1.72-3.18,4.04-5.67,6.96-7.46c2.92-1.79,6.14-2.68,9.64-2.68c3.51,0,6.72,0.89,9.64,2.68c2.92,1.79,5.22,4.27,6.91,7.46c1.68,3.18,2.52,6.78,2.52,10.78c0,4-0.85,7.6-2.55,10.8c-1.7,3.2-4,5.7-6.91,7.48c-2.9,1.79-6.11,2.68-9.62,2.68C516.66,393.09,513.45,392.19,510.53,390.41z"/>
          <path className="st1" d="M577.65,392.68h-9.08l-15.19-25.22v25.22h-9.08v-40.89h9.08l15.19,25.34v-25.34h9.08V392.68z"/>
          <path className="st1" d="M611.17,371.45c-0.99,1.96-2.52,3.54-4.57,4.75c-2.05,1.2-4.6,1.81-7.65,1.81h-5.63v14.68h-9.08v-40.89h14.72c2.98,0,5.49,0.56,7.54,1.69c2.05,1.13,3.59,2.68,4.62,4.66c1.03,1.98,1.54,4.25,1.54,6.81C612.66,367.32,612.16,369.49,611.17,371.45z"/>
          <path className="st1" d="M636.4,392.68l-7.76-15.43h-2.18v15.43h-9.08v-40.89h15.25c2.94,0,5.45,0.56,7.52,1.69c2.07,1.13,3.62,2.67,4.65,4.63c1.03,1.96,1.54,4.15,1.54,6.55c0,2.72-0.7,5.15-2.1,7.28c-1.4,2.14-3.46,3.65-6.19,4.54l8.61,16.19H636.4z"/>
          <path className="st1" d="M660.02,390.41c-2.92-1.79-5.24-4.28-6.96-7.48c-1.72-3.2-2.58-6.8-2.58-10.8c0-4,0.86-7.59,2.58-10.78c1.72-3.18,4.04-5.67,6.96-7.46c2.92-1.79,6.14-2.68,9.64-2.68c3.51,0,6.72,0.89,9.64,2.68c2.92,1.79,5.22,4.27,6.91,7.46c1.68,3.18,2.52,6.78,2.52,10.78c0,4-0.85,7.6-2.55,10.8c-1.7,3.2-4,5.7-6.91,7.48c-2.9,1.79-6.11,2.68-9.62,2.68C666.15,393.09,662.94,392.19,660.02,390.41z"/>
          <path className="st1" d="M718.05,351.79v7.98h-15.19v8.62h11.37v7.75h-11.37v16.54h-9.08v-40.89H718.05z"/>
          <path className="st1" d="M731.92,351.79v40.89h-9.08v-40.89H731.92z"/>
          <path className="st1" d="M765.33,351.79v7.98h-9.88v32.91h-9.08v-32.91h-9.88v-7.98H765.33z"/>
        </g>
        <g>
          <path className="st0" d="M476.97,418.87v13.1h19.27v12.18h-19.27v14.21h21.8v12.64h-36.19v-64.78h36.19v12.64H476.97z"/>
          <path className="st0" d="M546.58,410.29c4.66,2.71,8.26,6.51,10.82,11.4c2.55,4.89,3.83,10.54,3.83,16.93c0,6.34-1.28,11.97-3.83,16.89c-2.55,4.92-6.17,8.74-10.86,11.44c-4.69,2.71-10.11,4.06-16.29,4.06h-22.14v-64.78h22.14C536.48,406.23,541.92,407.58,546.58,410.29z"/>
          <path className="st0" d="M608.53,426.71c-1.07-2.15-2.6-3.8-4.59-4.94c-1.99-1.14-4.33-1.71-7.03-1.71c-4.66,0-8.39,1.68-11.19,5.03c-2.81,3.35-4.21,7.83-4.21,13.43c0,5.97,1.47,10.63,4.42,13.98c2.95,3.35,7,5.03,12.16,5.03c3.54,0,6.52-0.98,8.96-2.95c2.44-1.97,4.22-4.8,5.34-8.49h-18.26v-11.63h31.31v14.67c-1.07,3.94-2.88,7.6-5.43,10.98c-2.55,3.38-5.79,6.12-9.72,8.21c-3.93,2.09-8.36,3.14-13.3,3.14c-5.84,0-11.04-1.4-15.61-4.2c-4.57-2.8-8.14-6.69-10.69-11.67c-2.55-4.98-3.83-10.67-3.83-17.07c0-6.4,1.28-12.1,3.83-17.12c2.55-5.01,6.1-8.92,10.65-11.72c4.55-2.8,9.73-4.2,15.57-4.2c7.07,0,13.03,1.88,17.89,5.63c4.85,3.75,8.07,8.95,9.64,15.6H608.53z"/>
          <path className="st0" d="M647.83,418.87v13.1h19.27v12.18h-19.27v14.21h21.8v12.64h-36.19v-64.78h36.19v12.64H647.83z"/>
        </g>
      </g>
    </g>
  </svg>
);

// ============================================
// TOUR MODAL COMPONENT
// ============================================
interface TourModalProps {
  step: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

const TourModal: React.FC<TourModalProps> = ({ step, onNext, onBack, onSkip, onComplete }) => {
  const current = TOUR_STEPS[step];
  const isLast = step === TOUR_STEPS.length - 1;
  const isFirst = step === 0;

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9998 }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: COLORS.white, borderRadius: '20px', padding: '36px 32px', width: '90%', maxWidth: '440px', zIndex: 9999, boxShadow: '0 25px 80px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
          {TOUR_STEPS.map((_, i) => (
            <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: i <= step ? COLORS.teal : COLORS.gray200 }} />
          ))}
        </div>
        <h3 style={{ fontSize: '22px', fontWeight: 700, color: COLORS.navy, textAlign: 'center', marginBottom: '12px' }}>{current.title}</h3>
        <p style={{ fontSize: '15px', color: COLORS.gray600, textAlign: 'center', lineHeight: 1.7, marginBottom: '28px' }}>{current.content}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onSkip} style={{ padding: '10px 20px', background: 'transparent', border: 'none', color: COLORS.gray500, cursor: 'pointer', fontFamily: 'inherit' }}>Skip</button>
          <div style={{ display: 'flex', gap: '12px' }}>
            {!isFirst && <button onClick={onBack} style={{ padding: '14px 24px', background: COLORS.gray100, border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>}
            <button onClick={isLast ? onComplete : onNext} style={{ padding: '14px 32px', background: COLORS.teal, border: 'none', borderRadius: '10px', color: COLORS.white, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{isLast ? "✓ Finish" : 'Next →'}</button>
          </div>
        </div>
      </div>
    </>
  );
};

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================
interface DashboardProps {
  user?: any;
  organization?: any;
  supabase?: any;
  navigate?: (path: string) => void;
  onNavigate?: (path: string) => void;
  onLogout?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, organization, supabase, navigate, onNavigate, onLogout }) => {
  // State
  const [usageData, setUsageData] = useState({ downloads_this_month: 7, atp_sessions_this_month: 5 });
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [completedTools] = useState<string[]>([]);
  const [ownerToolsOpen, setOwnerToolsOpen] = useState(false);
  const [leadershipStreak] = useState(12);
  const [leadershipDay] = useState(47);

  const [recentActivity] = useState([
    { id: '1', text: 'Board Assessment started', time: 'Today', color: COLORS.teal },
    { id: '2', text: 'Strategic Plan completed', time: '3 days ago', color: '#16a34a' },
    { id: '3', text: 'Downloaded Board Self-Assessment', time: '5 days ago', color: '#8b5cf6' },
    { id: '4', text: 'Coaching session', time: '2 weeks ago', color: '#f59e0b' },
  ]);

  // Tier info
  const tierKey = (organization?.tier || 'professional').toLowerCase() as keyof typeof TIER_LIMITS;
  const limits = TIER_LIMITS[tierKey] || TIER_LIMITS.professional;
  const remainingDownloads = limits.downloads - usageData.downloads_this_month;
  const downloadPercentage = (remainingDownloads / limits.downloads) * 100;

  // User info
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || user?.name || 'Lyn';
  const userInitial = userName.charAt(0).toUpperCase();
  const orgName = organization?.name || 'Organization';
  const userEmail = user?.email || '';

  // Access levels
  const isOwner = OWNER_EMAILS.some(email => userEmail.toLowerCase() === email.toLowerCase());
  const isAdmin = ADMIN_EMAILS.some(email => userEmail.toLowerCase() === email.toLowerCase());
  const hasAdminAccess = isOwner || isAdmin;

  // Check for new user tour
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('nonprofit_edge_tour_seen');
    if (!hasSeenTour) setShowTour(true);
  }, []);

  // Navigation helper
  const handleNavigate = (path: string) => {
    if (onNavigate) onNavigate(path);
    else if (navigate) navigate(path);
    else window.location.href = path;
  };

  // Tool click handler
  const handleToolClick = (tool: typeof TOOLS[0]) => {
    const toolRoutes: Record<string, string> = {
      'board-assessment': '/board-assessment/use',
      'strategic-plan': '/strategic-plan-checkup/use',
      'ceo-evaluation': '/ceo-evaluation/use',
      'scenario-planner': '/scenario-planner/use',
      'grant-review': '/grant-review/use',
    };
    handleNavigate(toolRoutes[tool.id] || `/tools/${tool.id}`);
  };

  // Ask the Professor handler
  const handleAskProfessor = () => {
    const url = new URL(N8N_WEBHOOKS['ask-professor']);
    url.searchParams.append('user_name', userName);
    window.open(url.toString(), '_blank');
  };

  // Leadership Journey handler
  const handleLeadershipJourney = () => handleNavigate('/leadership-journey');

  // Logout handler
  const handleLogout = async () => {
    if (onLogout) onLogout();
    else if (supabase) { await supabase.auth.signOut(); handleNavigate('/login'); }
    else handleNavigate('/login');
  };

  // Sidebar nav items
  const quickActions = [
    { key: 'philosophy', icon: '🧭', label: 'Our Philosophy', path: '/philosophy' },
    { key: 'events', icon: '📅', label: 'Events Calendar', path: '/events' },
  ];

  const memberResources = [
    { key: 'dashboards', icon: '📊', label: 'Dashboards', path: '/dashboards' },
    { key: 'templates', icon: '📄', label: 'Templates', path: '/templates' },
    { key: 'playbooks', icon: '📘', label: 'Playbooks', path: '/playbooks' },
    { key: 'certifications', icon: '🎓', label: 'Certifications', path: '/certifications' },
    { key: 'book-summaries', icon: '📚', label: 'Book Summaries', path: '/book-summaries' },
  ];

  const ownerTools = [
    { key: 'users', icon: '👤', label: 'User Manager', path: '/admin/users' },
    { key: 'marketing', icon: '📈', label: 'Marketing Dashboard', path: '/admin/marketing' },
    { key: 'links', icon: '🔗', label: 'Link Manager', path: '/admin/links' },
    { key: 'team-access', icon: '👥', label: 'Team Access', path: '/admin/team' },
    { key: 'content', icon: '⚙️', label: 'Content Manager', path: '/admin/content' },
    { key: 'platform', icon: '🔧', label: 'Platform Admin', path: '/admin/platform' },
    { key: 'owner-dash', icon: '💰', label: 'Owner Dashboard', path: '/admin/owner' },
  ];

  // Nav button style helper
  const getNavStyle = (key: string, isAdmin = false) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 14px',
    fontSize: '14px',
    fontWeight: 500,
    color: hoveredNav === key ? (isAdmin ? '#b45309' : COLORS.navy) : COLORS.gray600,
    background: hoveredNav === key ? (isAdmin ? '#fef3c7' : COLORS.gray100) : 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '4px',
    width: '100%',
    textAlign: 'left' as const,
    transition: 'all 0.15s',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", background: COLORS.gray50 }}>
      {/* Google Font Import */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Tour Modal */}
      {showTour && (
        <TourModal
          step={tourStep}
          onNext={() => setTourStep(s => s + 1)}
          onBack={() => setTourStep(s => s - 1)}
          onSkip={() => { setShowTour(false); localStorage.setItem('nonprofit_edge_tour_seen', 'true'); }}
          onComplete={() => { setShowTour(false); localStorage.setItem('nonprofit_edge_tour_seen', 'true'); }}
        />
      )}

      {/* SIDEBAR */}
      <aside style={{ width: '280px', background: COLORS.white, borderRight: `1px solid ${COLORS.gray200}`, position: 'fixed', height: '100vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Logo */}
        <div style={{ padding: '20px', borderBottom: `1px solid ${COLORS.gray200}`, display: 'flex', justifyContent: 'center', background: '#fafbfc' }}>
          <Logo />
        </div>

        {/* Quick Actions */}
        <div style={{ padding: '20px', borderBottom: `1px solid ${COLORS.gray200}` }}>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: COLORS.navy, marginBottom: '16px' }}>Quick Actions</div>
          {quickActions.map(item => (
            <button
              key={item.key}
              style={getNavStyle(item.key)}
              onMouseEnter={() => setHoveredNav(item.key)}
              onMouseLeave={() => setHoveredNav(null)}
              onClick={() => handleNavigate(item.path)}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Member Resources */}
        <div style={{ padding: '20px', borderBottom: `1px solid ${COLORS.gray200}` }}>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: COLORS.navy, marginBottom: '16px' }}>Member Resources</div>
          {memberResources.map(item => (
            <button
              key={item.key}
              style={getNavStyle(item.key)}
              onMouseEnter={() => setHoveredNav(item.key)}
              onMouseLeave={() => setHoveredNav(null)}
              onClick={() => handleNavigate(item.path)}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Owner Tools - Accordion */}
        {hasAdminAccess && (
          <div style={{ background: '#fffbeb', borderBottom: `1px solid ${COLORS.gray200}` }}>
            <div
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', cursor: 'pointer', userSelect: 'none' }}
              onClick={() => setOwnerToolsOpen(!ownerToolsOpen)}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#b45309' }}>
                🔐 {isOwner ? 'Owner Tools' : 'Admin Tools'}
              </div>
              <span style={{ fontSize: '12px', color: '#b45309', transform: ownerToolsOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>
            </div>
            <div style={{ maxHeight: ownerToolsOpen ? '400px' : '0', overflow: 'hidden', transition: 'max-height 0.3s ease', padding: ownerToolsOpen ? '0 20px 16px' : '0 20px' }}>
              {ownerTools.map(item => (
                <button
                  key={item.key}
                  style={getNavStyle(item.key, true)}
                  onMouseEnter={() => setHoveredNav(item.key)}
                  onMouseLeave={() => setHoveredNav(null)}
                  onClick={() => handleNavigate(item.path)}
                >
                  <span style={{ fontSize: '16px' }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div style={{ padding: '20px', borderBottom: `1px solid ${COLORS.gray200}` }}>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: COLORS.navy, marginBottom: '16px' }}>Recent Activity</div>
          {recentActivity.map((a, i) => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 0', borderBottom: i < recentActivity.length - 1 ? `1px solid ${COLORS.gray100}` : 'none' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.color, marginTop: '5px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '13px', color: COLORS.gray700, fontWeight: 500 }}>{a.text}</div>
                <div style={{ fontSize: '11px', color: COLORS.gray400, marginTop: '2px' }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Remaining Downloads */}
        <div style={{ padding: '20px', borderBottom: `1px solid ${COLORS.gray200}` }}>
          <div style={{ background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.tealDark})`, borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: COLORS.white }}>Remaining Downloads</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: COLORS.white }}>{remainingDownloads} of {limits.downloads}</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.3)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${downloadPercentage}%`, background: COLORS.white, borderRadius: '4px' }} />
            </div>
            <span style={{ display: 'inline-block', fontSize: '10px', fontWeight: 700, padding: '4px 10px', background: COLORS.white, color: COLORS.navy, borderRadius: '4px', textTransform: 'uppercase', marginTop: '12px' }}>{tierKey}</span>
          </div>
        </div>

        {/* User Profile */}
        <div style={{ padding: '16px 20px', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px' }}>
            <div style={{ width: '40px', height: '40px', background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyLight})`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.white, fontWeight: 700 }}>{userInitial}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.gray900 }}>{userName}</div>
              <div style={{ fontSize: '12px', color: COLORS.gray500 }}>{orgName}</div>
            </div>
            {isOwner && <span style={{ fontSize: '9px', fontWeight: 800, padding: '4px 8px', background: '#f59e0b', color: COLORS.white, borderRadius: '4px' }}>OWNER</span>}
          </div>
          <button style={{ width: '100%', padding: '8px', fontSize: '12px', color: COLORS.gray500, background: 'none', border: 'none', cursor: 'pointer', marginTop: '8px', fontFamily: 'inherit' }} onClick={handleLogout}>Sign Out</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, marginLeft: '280px', padding: '28px 36px', maxWidth: '1100px' }}>
        {/* Welcome */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: COLORS.navy, marginBottom: '4px' }}>Welcome back, {userName}!</h1>
          <p style={{ fontSize: '14px', color: COLORS.gray500 }}>Let's move your mission forward.</p>
        </div>

        {/* Quote Card */}
        <div style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyLight})`, borderRadius: '14px', padding: '28px 32px', marginBottom: '28px', position: 'relative', overflow: 'hidden' }}>
          <span style={{ position: 'absolute', top: '5px', left: '20px', fontSize: '80px', color: 'rgba(0,151,169,0.3)', fontFamily: 'Georgia, serif', lineHeight: 1 }}>"</span>
          <p style={{ fontSize: '16px', fontStyle: 'italic', color: COLORS.white, lineHeight: 1.7, marginBottom: '12px', marginLeft: '40px', position: 'relative', zIndex: 1 }}>
            "The job of a board member isn't to run the organization. It's to make sure the organization is well-run."
          </p>
          <p style={{ fontSize: '13px', color: COLORS.teal, fontWeight: 500, textAlign: 'right' }}>— Chait, Ryan & Taylor, "Governance as Leadership"</p>
        </div>

        {/* YOUR TOOLS - 6 CARDS */}
        <div style={{ background: COLORS.white, border: `1px solid ${COLORS.gray200}`, borderRadius: '14px', marginBottom: '24px' }}>
          <div style={{ padding: '16px 24px', borderBottom: `1px solid ${COLORS.gray200}` }}>
            <span style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: COLORS.navy }}>Your Tools</span>
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
              {TOOLS.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => handleToolClick(tool)}
                  onMouseEnter={() => setHoveredTool(tool.id)}
                  onMouseLeave={() => setHoveredTool(null)}
                  style={{
                    position: 'relative',
                    height: '140px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transform: hoveredTool === tool.id ? 'translateY(-4px)' : 'translateY(0)',
                    boxShadow: hoveredTool === tool.id ? '0 12px 24px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${tool.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,44,84,0.95) 0%, rgba(13,44,84,0.5) 50%, rgba(13,44,84,0.2) 100%)' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px' }}>
                    <div style={{ color: COLORS.white, fontSize: '16px', fontWeight: 700 }}>{tool.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginTop: '4px' }}>{completedTools.includes(tool.id) ? '✓ Completed' : tool.status}</div>
                  </div>
                </div>
              ))}
              {/* Ask the Professor Card */}
              <div
                onClick={handleAskProfessor}
                onMouseEnter={() => setHoveredTool('ask-professor')}
                onMouseLeave={() => setHoveredTool(null)}
                style={{
                  position: 'relative',
                  height: '140px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background: `linear-gradient(135deg, ${COLORS.teal} 0%, ${COLORS.tealDark} 100%)`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: hoveredTool === 'ask-professor' ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: hoveredTool === 'ask-professor' ? '0 12px 24px rgba(0,151,169,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: '40px', marginBottom: '8px' }}>🎓</span>
                <div style={{ color: COLORS.white, fontSize: '16px', fontWeight: 700 }}>Ask the Professor</div>
              </div>
            </div>
          </div>
        </div>

        {/* MY LEADERSHIP JOURNEY */}
        <div style={{ background: COLORS.white, border: `1px solid ${COLORS.gray200}`, borderRadius: '14px', marginBottom: '28px' }}>
          <div style={{ padding: '20px' }}>
            <div
              onClick={handleLeadershipJourney}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyLight} 100%)`,
                borderRadius: '12px',
                padding: '20px 24px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(13,44,84,0.2)',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '26px' }}>🏆</span>
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: COLORS.white, marginBottom: '4px' }}>My Leadership Journey</div>
                  <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>Daily challenges, Edge Leadership Profile & growth tracking</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: COLORS.gold }}>🔥 {leadershipStreak}-day streak</span>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Day {leadershipDay} of 365</span>
                  </div>
                </div>
              </div>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: COLORS.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.white, fontSize: '20px' }}>→</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
