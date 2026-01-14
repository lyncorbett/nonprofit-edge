/**
 * THE NONPROFIT EDGE - Dashboard Component
 * Version: 5.1 - Final Production Version
 * 
 * Features:
 * - Plus Jakarta Sans font
 * - Teal quote panel with bold quote text
 * - 6 tool cards (5 tools + Ask the Professor)
 * - My Leadership Journey (navy, no arrow)
 * - Upcoming Events panel
 * - Collapsible Owner Tools accordion
 * - Reduced whitespace between panels
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
// TOOLS CONFIG
// ============================================
const TOOLS = [
  { id: 'board-assessment', name: 'Board Assessment', status: 'Ready', image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80', webhookKey: 'board-assessment' },
  { id: 'strategic-plan', name: 'Strategic Plan Check-Up', status: 'Ready', image: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=600&q=80', webhookKey: 'strategic-checkup' },
  { id: 'ceo-evaluation', name: 'CEO Evaluation', status: 'Ready', image: '/ceo-evaluation.jpg', webhookKey: 'ceo-evaluation' },
  { id: 'scenario-planner', name: 'Scenario Planner', status: 'Ready', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80', webhookKey: 'scenario-planner' },
  { id: 'grant-review', name: 'Grant Review', status: 'Ready', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80', webhookKey: 'grant-review' },
];

// ============================================
// UPCOMING EVENTS
// ============================================
const UPCOMING_EVENTS = [
  { day: '15', month: 'Jan', title: 'Board Governance Webinar', time: '2:00 PM EST', type: 'Webinar' },
  { day: '22', month: 'Jan', title: 'Strategic Planning Workshop', time: '10:00 AM EST', type: 'Workshop' },
  { day: '5', month: 'Feb', title: 'Grant Writing Masterclass', time: '1:00 PM EST', type: 'Masterclass' },
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
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);
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
          <img src="/logo.png" alt="The Nonprofit Edge" style={{ height: '60px', width: 'auto' }} />
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
        <div style={{ marginBottom: '18px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: COLORS.navy, marginBottom: '4px' }}>Welcome back, {userName}!</h1>
          <p style={{ fontSize: '14px', color: COLORS.gray500 }}>Let's move your mission forward.</p>
        </div>

        {/* Quote Card - Teal */}
        <div style={{ background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.tealDark})`, borderRadius: '14px', padding: '24px 28px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
          <span style={{ position: 'absolute', top: '5px', left: '20px', fontSize: '80px', color: 'rgba(255,255,255,0.25)', fontFamily: 'Georgia, serif', lineHeight: 1 }}>"</span>
          <p style={{ fontSize: '16px', fontStyle: 'italic', fontWeight: 600, color: COLORS.white, lineHeight: 1.7, marginBottom: '12px', marginLeft: '40px', position: 'relative', zIndex: 1 }}>
            "The job of a board member isn't to run the organization. It's to make sure the organization is well-run."
          </p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', fontWeight: 400, textAlign: 'right' }}>— Chait, Ryan & Taylor, "Governance as Leadership"</p>
        </div>

        {/* YOUR TOOLS - 6 CARDS */}
        <div style={{ background: COLORS.white, border: `1px solid ${COLORS.gray200}`, borderRadius: '14px', marginBottom: '16px' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${COLORS.gray200}` }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: COLORS.navy }}>Your Tools</span>
          </div>
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
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
        <div style={{ background: COLORS.white, border: `1px solid ${COLORS.gray200}`, borderRadius: '14px', marginBottom: '16px' }}>
          <div style={{ padding: '16px' }}>
            <div
              onClick={handleLeadershipJourney}
              style={{
                display: 'flex',
                alignItems: 'center',
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
            </div>
          </div>
        </div>

        {/* UPCOMING EVENTS */}
        <div style={{ background: COLORS.white, border: `1px solid ${COLORS.gray200}`, borderRadius: '14px', marginBottom: '20px' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${COLORS.gray200}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: COLORS.navy }}>Upcoming Events</span>
            <a href="/events" style={{ fontSize: '13px', color: COLORS.teal, textDecoration: 'none', fontWeight: 500 }}>View All →</a>
          </div>
          <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            {UPCOMING_EVENTS.map((event, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredEvent(i)}
                onMouseLeave={() => setHoveredEvent(null)}
                style={{
                  display: 'flex',
                  gap: '14px',
                  padding: '16px',
                  background: hoveredEvent === i ? COLORS.gray100 : COLORS.gray50,
                  borderRadius: '10px',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
              >
                <div style={{ textAlign: 'center', minWidth: '50px', background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyLight})`, borderRadius: '8px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: COLORS.white, lineHeight: 1 }}>{event.day}</div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', marginTop: '4px' }}>{event.month}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.gray900, marginBottom: '4px' }}>{event.title}</div>
                  <div style={{ fontSize: '12px', color: COLORS.gray500 }}>{event.time}</div>
                  <span style={{ display: 'inline-block', fontSize: '10px', fontWeight: 600, padding: '3px 8px', background: 'rgba(0,151,169,0.1)', color: COLORS.teal, borderRadius: '4px', marginTop: '6px' }}>{event.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
