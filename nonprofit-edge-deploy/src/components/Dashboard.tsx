
/**
 * THE NONPROFIT EDGE - Dashboard Component
 * Version: 2.0 - Fixed Links, Onboarding Tour & Smart Recommendations
 * 
 * CHANGES FROM PREVIOUS VERSION:
 * 1. Tool cards now open n8n webhooks DIRECTLY (not internal routes)
 * 2. New user onboarding tour for first-time visitors
 * 3. Smart recommendation engine based on completed assessments
 * 4. Logo size: 140px (prominent)
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
// TIER LIMITS
// ============================================
const TIER_LIMITS = {
  essential: { downloads: 10, atpSessions: 10, seats: 1 },
  professional: { downloads: 25, atpSessions: 50, seats: 5 },
  premium: { downloads: 100, atpSessions: Infinity, seats: 10 },
};

// ============================================
// N8N WEBHOOKS - Tools open these DIRECTLY
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
  { id: 'grant-review', name: 'Grant Review', status: 'Ready', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80', webhookKey: 'grant-review' },
];

const RECOMMENDATIONS = [
  { type: 'template', title: 'Board Self-Assessment Survey', desc: 'Annual evaluation tool for board members' },
  { type: 'playbook', title: 'Good to Great (Social Sectors)', desc: 'Jim Collins on nonprofit excellence' },
  { type: 'template', title: 'Strategic Plan Template', desc: '3-year planning framework' },
  { type: 'playbook', title: 'The ONE Thing', desc: 'Focus methodology for leaders' },
];

// ============================================
// TOUR STEPS
// ============================================
const TOUR_STEPS = [
  { title: 'Welcome to The Nonprofit Edge! 🎉', content: 'Your AI-powered strategic planning platform. Let me give you a quick tour.' },
  { title: 'Your Assessment Tools', content: 'Click any tool card to start an AI-guided assessment. Each one evaluates a different aspect of your organization.' },
  { title: 'Ask the Professor 🎓', content: 'Need guidance? Our AI consultant is available 24/7 to answer your nonprofit strategy questions.' },
  { title: 'Member Resources', content: 'Access templates, playbooks, and certifications in the sidebar to support your work.' },
  { title: 'Track Your Progress', content: 'Monitor your completed assessments and remaining downloads. Your usage resets monthly.' },
  { title: 'Ready to Start?', content: 'We recommend beginning with the Board Assessment - it provides a foundation for all other tools. Click it to get started!' },
];

// ============================================
// LOGO COMPONENT (140px height)
// ============================================
const Logo = () => (
  <svg viewBox="0 0 1024 768" style={{ height: '140px', width: 'auto' }}>
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
// ONBOARDING TOUR COMPONENT
// ============================================
interface TourModalProps {
  step: number;
  onNext: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

const TourModal: React.FC<TourModalProps> = ({ step, onNext, onSkip, onComplete }) => {
  const current = TOUR_STEPS[step];
  const isLast = step === TOUR_STEPS.length - 1;

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9998 }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        background: COLORS.white, borderRadius: '20px', padding: '36px 32px', width: '90%', maxWidth: '440px',
        zIndex: 9999, boxShadow: '0 25px 80px rgba(0,0,0,0.4)'
      }}>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
          {TOUR_STEPS.map((_, i) => (
            <div key={i} style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: i <= step ? COLORS.teal : COLORS.gray200,
              transition: 'background 0.3s'
            }} />
          ))}
        </div>
        <h3 style={{ fontSize: '22px', fontWeight: 700, color: COLORS.navy, textAlign: 'center', marginBottom: '12px' }}>
          {current.title}
        </h3>
        <p style={{ fontSize: '15px', color: COLORS.gray600, textAlign: 'center', lineHeight: 1.7, marginBottom: '28px' }}>
          {current.content}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onSkip} style={{
            padding: '10px 20px', background: 'transparent', border: 'none',
            color: COLORS.gray500, fontSize: '14px', cursor: 'pointer'
          }}>
            Skip Tour
          </button>
          <button onClick={isLast ? onComplete : onNext} style={{
            padding: '14px 32px', background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.tealDark})`,
            border: 'none', borderRadius: '10px', color: COLORS.white, fontSize: '15px', fontWeight: 600, cursor: 'pointer'
          }}>
            {isLast ? "Let's Go! 🚀" : 'Next →'}
          </button>
        </div>
      </div>
    </>
  );
};

// ============================================
// RECOMMENDATION BANNER COMPONENT
// ============================================
interface RecBannerProps {
  toolName: string;
  reason: string;
  onStart: () => void;
  onDismiss: () => void;
}

const RecommendationBanner: React.FC<RecBannerProps> = ({ toolName, reason, onStart, onDismiss }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '20px', padding: '20px 24px', marginBottom: '24px',
    background: `linear-gradient(135deg, rgba(0,151,169,0.1), rgba(0,151,169,0.05))`,
    border: `2px solid ${COLORS.teal}`, borderRadius: '14px', maxWidth: '900px'
  }}>
    <span style={{ fontSize: '36px' }}>💡</span>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: COLORS.teal, marginBottom: '4px' }}>
        Recommended for you
      </div>
      <div style={{ fontSize: '18px', fontWeight: 700, color: COLORS.navy, marginBottom: '4px' }}>
        Start with {toolName}
      </div>
      <div style={{ fontSize: '14px', color: COLORS.gray600 }}>{reason}</div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <button onClick={onStart} style={{
        padding: '12px 24px', background: COLORS.teal, color: COLORS.white,
        border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap'
      }}>
        Start Now →
      </button>
      <button onClick={onDismiss} style={{
        padding: '8px 16px', background: 'transparent', color: COLORS.gray500,
        border: 'none', fontSize: '12px', cursor: 'pointer'
      }}>
        Maybe Later
      </button>
    </div>
  </div>
);

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================
interface DashboardProps {
  user?: any;
  organization?: any;
  supabase?: any;
  navigate?: (path: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, organization, supabase, navigate }) => {
  // State
  const [usageData, setUsageData] = useState({ downloads_this_month: 7, atp_sessions_this_month: 5 });
  const [completedTools, setCompletedTools] = useState<string[]>([]);
  const [recentActivity, setRecentActivity] = useState([
    { id: '1', text: 'Board Assessment started', time: 'Today', color: COLORS.teal },
    { id: '2', text: 'Strategic Plan completed', time: '3 days ago', color: '#16a34a' },
    { id: '3', text: 'Downloaded Board Self-Assessment', time: '5 days ago', color: '#8b5cf6' },
    { id: '4', text: 'Coaching session', time: '2 weeks ago', color: '#f59e0b' },
  ]);
  const [adminAccess, setAdminAccess] = useState({ isOwner: false });
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  // Tour state
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // Recommendation state
  const [recommendedTool, setRecommendedTool] = useState<typeof TOOLS[0] | null>(null);
  const [recommendationReason, setRecommendationReason] = useState('');
  const [showRecommendation, setShowRecommendation] = useState(false);

  // Tier info
  const tierKey = (organization?.tier || 'professional').toLowerCase() as keyof typeof TIER_LIMITS;
  const limits = TIER_LIMITS[tierKey] || TIER_LIMITS.professional;
  const remainingDownloads = limits.downloads - usageData.downloads_this_month;
  const downloadPercentage = (remainingDownloads / limits.downloads) * 100;

  // User info
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userInitial = userName.charAt(0).toUpperCase();
  const orgName = organization?.name || 'Organization';

  // ============================================
  // CHECK IF NEW USER → SHOW TOUR
  // ============================================
  useEffect(() => {
    const checkNewUser = async () => {
      if (!supabase || !user?.id) return;
      try {
        const { data } = await supabase
          .from('user_preferences')
          .select('has_seen_tour')
          .eq('user_id', user.id)
          .single();
        if (!data || !data.has_seen_tour) {
          setShowTour(true);
        }
      } catch {
        setShowTour(true); // No record = new user
      }
    };
    checkNewUser();
  }, [supabase, user?.id]);

  // ============================================
  // CALCULATE SMART RECOMMENDATION
  // ============================================
  useEffect(() => {
    const uncompleted = TOOLS.filter(t => !completedTools.includes(t.id));
    if (uncompleted.length === 0) {
      setShowRecommendation(false);
      return;
    }
    // New user: recommend Board Assessment
    if (completedTools.length === 0) {
      const board = TOOLS.find(t => t.id === 'board-assessment');
      if (board) {
        setRecommendedTool(board);
        setRecommendationReason('A strong board is the foundation of every successful nonprofit. Start here to identify governance strengths.');
        setShowRecommendation(true);
        return;
      }
    }
    // After Board, recommend Strategic Plan
    if (completedTools.includes('board-assessment') && !completedTools.includes('strategic-plan')) {
      const strategic = TOOLS.find(t => t.id === 'strategic-plan');
      if (strategic) {
        setRecommendedTool(strategic);
        setRecommendationReason('Now that your board is assessed, ensure your strategic plan is on track.');
        setShowRecommendation(true);
        return;
      }
    }
    // Otherwise recommend first uncompleted
    setRecommendedTool(uncompleted[0]);
    setRecommendationReason(`Continue building your organizational profile with ${uncompleted[0].name}.`);
    setShowRecommendation(true);
  }, [completedTools]);

  // ============================================
  // FETCH COMPLETED ASSESSMENTS
  // ============================================
  useEffect(() => {
    const fetchCompleted = async () => {
      if (!supabase || !organization?.id) return;
      try {
        const { data } = await supabase
          .from('completed_assessments')
          .select('tool_id')
          .eq('organization_id', organization.id);
        if (data) setCompletedTools(data.map((d: any) => d.tool_id));
      } catch (err) {
        console.log('Fetch completed:', err);
      }
    };
    fetchCompleted();
  }, [supabase, organization?.id]);

  // ============================================
  // FETCH USAGE DATA
  // ============================================
  useEffect(() => {
    const fetchUsage = async () => {
      if (!supabase || !organization?.id) return;
      try {
        const { data } = await supabase
          .from('usage_tracking')
          .select('*')
          .eq('organization_id', organization.id)
          .single();
        if (data) {
          setUsageData({
            downloads_this_month: data.downloads_this_month || 0,
            atp_sessions_this_month: data.atp_sessions_this_month || 0,
          });
        }
      } catch (err) {
        console.log('Usage fetch:', err);
      }
    };
    fetchUsage();
  }, [supabase, organization?.id]);

  // ============================================
  // CHECK ADMIN ACCESS
  // ============================================
  useEffect(() => {
    const checkAdmin = async () => {
      if (!supabase || !user?.email) return;
      try {
        const { data } = await supabase
          .from('platform_admins')
          .select('role')
          .eq('email', user.email.toLowerCase())
          .single();
        if (data) setAdminAccess({ isOwner: data.role === 'owner' });
      } catch (err) {
        console.log('Admin check:', err);
      }
    };
    checkAdmin();
  }, [supabase, user?.email]);

  // ============================================
  // NAVIGATION HELPER
  // ============================================
  const handleNavigate = (path: string) => {
    if (navigate) navigate(path);
    else window.location.href = path;
  };

  // ============================================
  // TOOL CLICK → OPENS N8N WEBHOOK DIRECTLY
  // ============================================
  const handleToolClick = async (tool: typeof TOOLS[0]) => {
    // Log activity
    if (supabase && organization?.id) {
      try {
        await supabase.from('activity_log').insert({
          organization_id: organization.id,
          user_id: user?.id,
          type: 'tool_start',
          description: `${tool.name} started`,
          tool_id: tool.id,
        });
      } catch (err) {
        console.error('Activity log error:', err);
      }
    }

    // Build webhook URL with user context
    const webhookUrl = N8N_WEBHOOKS[tool.webhookKey];
    if (webhookUrl) {
      const url = new URL(webhookUrl);
      url.searchParams.append('org_id', organization?.id || '');
      url.searchParams.append('org_name', organization?.name || '');
      url.searchParams.append('user_id', user?.id || '');
      url.searchParams.append('user_email', user?.email || '');
      url.searchParams.append('user_name', userName);
      
      // Open in new tab
      window.open(url.toString(), '_blank');
    }
  };

  // ============================================
  // ASK THE PROFESSOR → OPENS N8N WEBHOOK
  // ============================================
  const handleAskProfessor = async () => {
    // Check limit
    if (limits.atpSessions !== Infinity && usageData.atp_sessions_this_month >= limits.atpSessions) {
      alert('You have reached your ATP session limit for this month. Please upgrade your plan.');
      return;
    }

    // Log and increment
    if (supabase && organization?.id) {
      try {
        await supabase.rpc('increment_atp_sessions', { org_id: organization.id });
        await supabase.from('activity_log').insert({
          organization_id: organization.id,
          user_id: user?.id,
          type: 'professor',
          description: 'Ask the Professor session',
        });
      } catch (err) {
        console.error('ATP error:', err);
      }
    }

    // Open webhook
    const url = new URL(N8N_WEBHOOKS['ask-professor']);
    url.searchParams.append('org_id', organization?.id || '');
    url.searchParams.append('user_id', user?.id || '');
    url.searchParams.append('user_email', user?.email || '');
    url.searchParams.append('user_name', userName);
    window.open(url.toString(), '_blank');
  };

  // ============================================
  // DOWNLOAD HANDLER
  // ============================================
  const handleDownload = async (title: string) => {
    if (usageData.downloads_this_month >= limits.downloads) {
      alert('You have reached your download limit. Please upgrade your plan.');
      return;
    }
    if (supabase && organization?.id) {
      try {
        await supabase.rpc('increment_downloads', { org_id: organization.id });
        await supabase.from('activity_log').insert({
          organization_id: organization.id,
          user_id: user?.id,
          type: 'download',
          description: `Downloaded ${title}`,
        });
        setUsageData(prev => ({ ...prev, downloads_this_month: prev.downloads_this_month + 1 }));
      } catch (err) {
        console.error('Download error:', err);
      }
    }
  };

  // ============================================
  // TOUR HANDLERS
  // ============================================
  const handleTourNext = () => setTourStep(prev => prev + 1);
  
  const handleTourSkip = async () => {
    setShowTour(false);
    if (supabase && user?.id) {
      await supabase.from('user_preferences').upsert({ user_id: user.id, has_seen_tour: true });
    }
  };
  
  const handleTourComplete = async () => {
    setShowTour(false);
    if (supabase && user?.id) {
      await supabase.from('user_preferences').upsert({ user_id: user.id, has_seen_tour: true });
    }
  };

  // ============================================
  // LOGOUT
  // ============================================
  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    handleNavigate('/login');
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif", background: COLORS.gray50 }}>
      {/* TOUR MODAL */}
      {showTour && (
        <TourModal step={tourStep} onNext={handleTourNext} onSkip={handleTourSkip} onComplete={handleTourComplete} />
      )}

      {/* LEFT SIDEBAR */}
      <aside style={{
        width: '280px', background: COLORS.white, borderRight: `1px solid ${COLORS.gray200}`,
        position: 'fixed', height: '100vh', overflowY: 'auto', display: 'flex', flexDirection: 'column'
      }}>
        {/* Logo */}
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${COLORS.gray200}`, display: 'flex', justifyContent: 'center', background: '#fafbfc' }}>
          <Logo />
        </div>

        {/* Quick Actions */}
        <div style={{ padding: '20px', borderBottom: `1px solid ${COLORS.gray200}` }}>
          <div style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: COLORS.navy, marginBottom: '16px' }}>
            Quick Actions
          </div>
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', fontSize: '14px', fontWeight: 500,
              color: hoveredNav === 'events' ? COLORS.navy : COLORS.gray600,
              background: hoveredNav === 'events' ? COLORS.gray100 : 'transparent',
              border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px', width: '100%', textAlign: 'left'
            }}
            onMouseEnter={() => setHoveredNav('events')}
            onMouseLeave={() => setHoveredNav(null)}
            onClick={() => handleNavigate('/events')}
          >
            <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>📅</span>
            Events Calendar
          </button>
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', fontSize: '14px', fontWeight: 500,
              color: hoveredNav === 'completed' ? COLORS.navy : COLORS.gray600,
              background: hoveredNav === 'completed' ? COLORS.gray100 : 'transparent',
              border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px', width: '100%', textAlign: 'left'
            }}
            onMouseEnter={() => setHoveredNav('completed')}
            onMouseLeave={() => setHoveredNav(null)}
            onClick={() => handleNavigate('/completed-assessments')}
          >
            <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>📊</span>
            Completed Assessments
          </button>
          <button
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 14px', fontSize: '14px', fontWeight: 500,
              color: COLORS.white, background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyLight})`,
              border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%', marginBottom: '4px'
            }}
            onClick={() => handleNavigate('/theory-of-constraints')}
          >
            Theory of Constraints
          </button>
        </div>

        {/* Member Resources */}
        <div style={{ padding: '20px', borderBottom: `1px solid ${COLORS.gray200}` }}>
          <div style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: COLORS.navy, marginBottom: '16px' }}>
            Member Resources
          </div>
          {[
            { key: 'templates', icon: '📄', label: 'Templates', path: '/templates' },
            { key: 'playbooks', icon: '📘', label: 'Playbooks', path: '/playbooks' },
            { key: 'certifications', icon: '🎓', label: 'Certifications', path: '/certifications' },
          ].map(item => (
            <button
              key={item.key}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', fontSize: '14px', fontWeight: 500,
                color: hoveredNav === item.key ? COLORS.navy : COLORS.gray600,
                background: hoveredNav === item.key ? COLORS.gray100 : 'transparent',
                border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px', width: '100%', textAlign: 'left'
              }}
              onMouseEnter={() => setHoveredNav(item.key)}
              onMouseLeave={() => setHoveredNav(null)}
              onClick={() => handleNavigate(item.path)}
            >
              <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Recent Activity */}
        <div style={{ padding: '20px', borderBottom: `1px solid ${COLORS.gray200}` }}>
          <div style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: COLORS.navy, marginBottom: '16px' }}>
            Recent Activity
          </div>
          {recentActivity.map((activity, i) => (
            <div key={activity.id} style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 0',
              borderBottom: i < recentActivity.length - 1 ? `1px solid ${COLORS.gray100}` : 'none'
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: activity.color, marginTop: '5px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '13px', color: COLORS.gray700, fontWeight: 500 }}>{activity.text}</div>
                <div style={{ fontSize: '11px', color: COLORS.gray400, marginTop: '2px' }}>{activity.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Remaining Downloads - Teal Background */}
        <div style={{ padding: '20px', borderBottom: `1px solid ${COLORS.gray200}` }}>
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.tealDark})`,
            borderRadius: '10px', padding: '14px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: COLORS.white }}>Remaining Downloads</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: COLORS.white }}>{remainingDownloads} of {limits.downloads}</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.3)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${downloadPercentage}%`, background: COLORS.white, borderRadius: '4px' }} />
            </div>
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.3)' }}>
              <span style={{
                display: 'inline-block', fontSize: '10px', fontWeight: 700, padding: '4px 10px',
                background: COLORS.white, color: COLORS.navy, borderRadius: '4px', textTransform: 'uppercase'
              }}>
                {tierKey.charAt(0).toUpperCase() + tierKey.slice(1)}
              </span>
              <div style={{ marginTop: '8px', fontSize: '11px', color: 'rgba(255,255,255,0.9)' }}>
                {limits.downloads} downloads/mo • {limits.atpSessions === Infinity ? 'Unlimited' : limits.atpSessions} ATP sessions • {limits.seats} team seats
              </div>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div style={{ padding: '16px 20px', borderTop: `1px solid ${COLORS.gray200}`, marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}>
            <div style={{
              width: '40px', height: '40px', background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyLight})`,
              borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.white, fontWeight: 700
            }}>
              {userInitial}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.gray900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</div>
              <div style={{ fontSize: '12px', color: COLORS.gray500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{orgName}</div>
            </div>
            {adminAccess.isOwner && (
              <span style={{ fontSize: '9px', fontWeight: 800, padding: '4px 8px', background: COLORS.teal, color: COLORS.white, borderRadius: '4px' }}>OWNER</span>
            )}
          </div>
          <button
            style={{ width: '100%', padding: '8px', fontSize: '12px', fontWeight: 500, color: COLORS.gray500, background: 'none', border: 'none', cursor: 'pointer', marginTop: '8px', borderRadius: '6px' }}
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, marginLeft: '280px', padding: '28px 36px', maxWidth: '1200px' }}>
        {/* Welcome */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: COLORS.navy, marginBottom: '4px' }}>Welcome back, {userName}!</h1>
          <p style={{ fontSize: '14px', color: COLORS.gray500 }}>Here's what's happening with your organization</p>
        </div>

        {/* Smart Recommendation Banner */}
        {showRecommendation && recommendedTool && (
          <RecommendationBanner
            toolName={recommendedTool.name}
            reason={recommendationReason}
            onStart={() => handleToolClick(recommendedTool)}
            onDismiss={() => setShowRecommendation(false)}
          />
        )}

        {/* Daily Insight Quote */}
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyLight})`,
          borderRadius: '14px', padding: '28px 32px 24px', marginBottom: '28px', position: 'relative', maxWidth: '900px'
        }}>
          <span style={{ position: 'absolute', top: '8px', left: '24px', fontSize: '80px', color: 'rgba(0,151,169,0.3)', fontFamily: 'Georgia, serif', lineHeight: 1 }}>"</span>
          <p style={{ fontSize: '16px', fontStyle: 'italic', color: COLORS.white, lineHeight: 1.6, marginBottom: '12px', marginLeft: '40px', position: 'relative', zIndex: 1 }}>
            "The job of a board member isn't to run the organization. It's to make sure the organization is well-run."
          </p>
          <p style={{ fontSize: '13px', color: COLORS.teal, fontWeight: 500, textAlign: 'right', position: 'relative', zIndex: 1 }}>
            — Chait, Ryan & Taylor, "Governance as Leadership"
          </p>
        </div>

        {/* Your Tools */}
        <div style={{ background: COLORS.white, border: `1px solid ${COLORS.gray200}`, borderRadius: '14px', marginBottom: '28px', maxWidth: '1000px' }}>
          <div style={{ padding: '16px 24px', borderBottom: `1px solid ${COLORS.gray200}` }}>
            <span style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: COLORS.navy }}>Your Tools</span>
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(200px, 300px))', gap: '18px' }}>
              {TOOLS.map(tool => (
                <div
                  key={tool.id}
                  onClick={() => handleToolClick(tool)}
                  style={{
                    position: 'relative', height: '130px', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${tool.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,44,84,0.9) 0%, rgba(13,44,84,0.4) 50%, rgba(13,44,84,0.1) 100%)' }} />
                  {recommendedTool?.id === tool.id && (
                    <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#f59e0b', color: COLORS.white, fontSize: '10px', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>Recommended</span>
                  )}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px' }}>
                    <div style={{ color: COLORS.white, fontSize: '15px', fontWeight: 700 }}>{tool.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginTop: '4px' }}>
                      {completedTools.includes(tool.id) ? '✓ Completed' : tool.status}
                    </div>
                  </div>
                  {completedTools.includes(tool.id) && (
                    <div style={{ position: 'absolute', top: '10px', right: '10px', width: '10px', height: '10px', background: COLORS.teal, borderRadius: '50%', border: '2px solid white' }} />
                  )}
                </div>
              ))}

              {/* Ask the Professor Card */}
              <div
                onClick={handleAskProfessor}
                style={{
                  background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.tealDark})`,
                  height: '130px', borderRadius: '12px', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <span style={{ fontSize: '36px', marginBottom: '10px' }}>🎓</span>
                <span style={{ color: COLORS.white, fontSize: '18px', fontWeight: 800 }}>Ask the Professor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended For You */}
        <div style={{ background: COLORS.white, border: `1px solid ${COLORS.gray200}`, borderRadius: '14px', maxWidth: '1000px' }}>
          <div style={{ padding: '16px 24px', borderBottom: `1px solid ${COLORS.gray200}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: COLORS.navy }}>Recommended For You</span>
            <span onClick={() => handleNavigate('/templates')} style={{ fontSize: '13px', fontWeight: 600, color: COLORS.teal, cursor: 'pointer' }}>See all →</span>
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(200px, 400px))', gap: '18px' }}>
              {RECOMMENDATIONS.map((rec, i) => (
                <div
                  key={i}
                  onClick={() => handleDownload(rec.title)}
                  style={{
                    background: COLORS.gray50, borderRadius: '12px', padding: '18px', cursor: 'pointer',
                    border: `1px solid ${COLORS.gray200}`, transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = COLORS.gray100; }}
                  onMouseLeave={e => { e.currentTarget.style.background = COLORS.gray50; }}
                >
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 700,
                    textTransform: 'uppercase', padding: '5px 10px', borderRadius: '6px', marginBottom: '10px',
                    background: rec.type === 'template' ? COLORS.teal : '#f59e0b', color: COLORS.white
                  }}>
                    {rec.type === 'template' ? '📄 Template' : '📘 Playbook'}
                  </span>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: COLORS.navy, marginBottom: '4px' }}>{rec.title}</div>
                  <div style={{ fontSize: '13px', color: COLORS.gray500 }}>{rec.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
