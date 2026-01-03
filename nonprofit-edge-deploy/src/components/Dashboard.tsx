/**
 * THE NONPROFIT EDGE - Dashboard
 * Complete Integrated Version with Usage Tracking & n8n Integration
 * 
 * Features:
 * - Usage counters connected to Supabase (downloads, professor sessions, tools)
 * - n8n webhook connections for all tools
 * - Real-time tracking of all user activity
 * - Tier-based limits enforcement
 * - AI Assistant chatbot
 * - Avatar selection modal
 * - Role-based admin access
 * 
 * Tiers:
 *   Essential ($97)     → 10 downloads, 10 professor sessions, 1 seat
 *   Professional ($297) → 25 downloads, 50 professor sessions, 5 seats
 *   Premium ($797)      → 100 downloads, unlimited professor sessions, 10 seats
 */

import React, { useState, useEffect } from 'react';

// Brand colors
const NAVY = '#1a365d';
const TEAL = '#00a0b0';
const TEAL_LIGHT = '#e6f7f9';

// Tier limits configuration
const TIER_LIMITS = {
  essential: { downloads: 10, professor: 10, seats: 1 },
  professional: { downloads: 25, professor: 50, seats: 5 },
  premium: { downloads: 100, professor: 999, seats: 10 }
};

// n8n Webhook URLs - UPDATE WITH YOUR ACTUAL WEBHOOKS
const N8N_WEBHOOKS: Record<string, string> = {
  'board-assessment': 'https://thenonprofitedge.app.n8n.cloud/webhook/board-assessment',
  'strategic-checkup': 'https://thenonprofitedge.app.n8n.cloud/webhook/strategic-checkup',
  'ceo-evaluation': 'https://thenonprofitedge.app.n8n.cloud/webhook/ceo-evaluation',
  'scenario-planner': 'https://thenonprofitedge.app.n8n.cloud/webhook/scenario-planner',
  'grant-review': 'https://thenonprofitedge.app.n8n.cloud/webhook/grant-review',
  'constraint-assessment': 'https://thenonprofitedge.app.n8n.cloud/webhook/constraint-assessment',
  'ask-professor': 'https://thenonprofitedge.app.n8n.cloud/webhook/ask-professor'
};

// Tool definitions
const TOOLS = [
  {
    id: 'board-assessment',
    name: 'Board Assessment',
    description: 'Comprehensive board effectiveness review',
    status: 'Ready',
    statusColor: '#6b7280',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=600&fit=crop',
    route: 'board-assessment',
    webhookKey: 'board-assessment',
    isActive: true
  },
  {
    id: 'strategic-plan',
    name: 'Strategic Plan Check-Up',
    description: 'Evaluate your strategic plan health',
    status: 'Ready',
    statusColor: '#6b7280',
    image: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=1200&h=600&fit=crop',
    route: 'strategic-checkup',
    webhookKey: 'strategic-checkup',
    isActive: false
  },
  {
    id: 'ceo-evaluation',
    name: 'CEO Evaluation',
    description: 'Executive performance assessment',
    status: 'Ready',
    statusColor: '#6b7280',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop',
    route: 'ceo-evaluation',
    webhookKey: 'ceo-evaluation',
    isActive: false
  },
  {
    id: 'scenario-planner',
    name: 'PIVOT Scenario Planner',
    description: 'Plan for multiple future scenarios',
    status: 'Ready',
    statusColor: '#6b7280',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
    route: 'scenario-planner',
    webhookKey: 'scenario-planner',
    isActive: false
  },
  {
    id: 'grant-review',
    name: 'Grant/RFP Review',
    description: 'AI-powered proposal analysis',
    status: 'Ready',
    statusColor: '#6b7280',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=600&fit=crop',
    route: 'grant-review',
    webhookKey: 'grant-review',
    isActive: false
  },
  {
    id: 'template-vault',
    name: 'Template Vault',
    description: 'Strategic planning templates and resources',
    status: '147 templates',
    statusColor: '#6b7280',
    image: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=1200&h=600&fit=crop',
    route: 'templates',
    webhookKey: '',
    isActive: false
  }
];

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

interface AdminAccess {
  isAdmin: boolean;
  isOwner: boolean;
  role: string | null;
}

interface UsageData {
  downloads_this_month: number;
  professor_sessions_this_month: number;
  tools_used_this_month: number;
  tools_completed_this_month: number;
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
  // Admin access state
  const [adminAccess, setAdminAccess] = useState<AdminAccess>({
    isAdmin: false,
    isOwner: false,
    role: null
  });

  // UI state
  const [showAIChat, setShowAIChat] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTool, setLoadingTool] = useState<string | null>(null);

  // Usage data from Supabase
  const [usageData, setUsageData] = useState<UsageData>({
    downloads_this_month: 0,
    professor_sessions_this_month: 0,
    tools_used_this_month: 0,
    tools_completed_this_month: 0
  });

  // Recent activity
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Get tier limits
  const tierKey = (organization?.tier || 'essential').toLowerCase() as keyof typeof TIER_LIMITS;
  const limits = TIER_LIMITS[tierKey] || TIER_LIMITS.essential;

  // Recommendations data
  const recommendations = [
    { type: 'template', title: 'Board Self-Assessment Survey', desc: 'Annual evaluation tool for board members' },
    { type: 'book', title: 'Good to Great (Social Sectors)', desc: 'Jim Collins on nonprofit excellence' },
    { type: 'template', title: 'Strategic Plan Template', desc: '3-year planning framework' },
    { type: 'book', title: 'The ONE Thing', desc: 'Focus methodology for leaders' }
  ];

  // Events data
  const events = [
    { day: '15', month: 'JAN', title: 'Board Governance Masterclass', meta: 'Virtual • 2:00 PM EST', tag: 'WORKSHOP', tagColor: 'bg-purple-100 text-purple-700' },
    { day: '22', month: 'JAN', title: 'Strategic Planning Deep Dive', meta: 'Virtual • 1:00 PM EST', tag: 'TRAINING', tagColor: 'bg-blue-100 text-blue-700' },
    { day: '05', month: 'FEB', title: 'Grant Writing Workshop', meta: 'Virtual • 11:00 AM EST', tag: 'WORKSHOP', tagColor: 'bg-purple-100 text-purple-700' }
  ];

  // Avatar colors
  const avatarColors = ['#1a365d', '#00a0b0', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981'];

  // ==========================================
  // EFFECTS
  // ==========================================

  // Check admin access
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!supabase || !user?.email) return;
      
      try {
        const { data, error } = await supabase
          .from('platform_admins')
          .select('role')
          .eq('email', user.email.toLowerCase())
          .single();
        
        if (data && !error) {
          setAdminAccess({
            isAdmin: true,
            isOwner: data.role === 'owner',
            role: data.role
          });
        }
      } catch (err) {
        console.log('Admin check:', err);
      }
    };

    checkAdminAccess();
  }, [supabase, user?.email]);

  // Fetch usage data
  useEffect(() => {
    const fetchUsageData = async () => {
      if (!supabase || !organization?.id) return;

      try {
        const now = new Date();
        const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        // Fetch monthly usage
        const { data: usageRecord } = await supabase
          .from('monthly_usage')
          .select('*')
          .eq('organization_id', organization.id)
          .eq('month_year', monthYear)
          .single();

        if (usageRecord) {
          setUsageData({
            downloads_this_month: (usageRecord.report_downloads || 0) + (usageRecord.templates_downloaded || 0),
            professor_sessions_this_month: usageRecord.professor_sessions || 0,
            tools_used_this_month: usageRecord.tools_started || 0,
            tools_completed_this_month: usageRecord.tools_completed || 0
          });
        }

        // Fetch recent activity
        const { data: activityData } = await supabase
          .from('activity_log')
          .select('*')
          .eq('organization_id', organization.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (activityData) {
          setRecentActivity(activityData);
        }
      } catch (err) {
        console.error('Error fetching usage:', err);
      }
    };

    fetchUsageData();
  }, [supabase, organization?.id]);

  // ==========================================
  // TRACKING FUNCTIONS
  // ==========================================

  // Track tool start
  const trackToolStart = async (toolId: string, toolName: string) => {
    if (!supabase || !user?.id || !organization?.id) return { success: false };

    try {
      const now = new Date();
      const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      // Update monthly usage
      await supabase.rpc('increment_usage', {
        p_org_id: organization.id,
        p_user_id: user.id,
        p_month_year: monthYear,
        p_field: 'tools_started'
      });

      // Log activity
      await supabase.from('activity_log').insert({
        organization_id: organization.id,
        user_id: user.id,
        action_type: 'tool_start',
        action_detail: { tool_id: toolId, tool_name: toolName }
      });

      // Create tool session
      const { data: session } = await supabase
        .from('tool_sessions')
        .insert({
          organization_id: organization.id,
          user_id: user.id,
          tool_type: toolId,
          status: 'in_progress'
        })
        .select()
        .single();

      // Trigger n8n webhook
      if (N8N_WEBHOOKS[toolId]) {
        fetch(N8N_WEBHOOKS[toolId], {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'tool_started',
            sessionId: session?.id,
            toolId,
            toolName,
            organizationId: organization.id,
            userId: user.id,
            userEmail: user.email,
            orgName: organization.name,
            timestamp: now.toISOString()
          })
        }).catch(err => console.warn('Webhook failed:', err));
      }

      return { success: true, sessionId: session?.id };
    } catch (err) {
      console.error('Error tracking tool start:', err);
      return { success: false };
    }
  };

  // Track download
  const trackDownload = async (resourceName: string, resourceType: 'report' | 'template') => {
    if (!supabase || !user?.id || !organization?.id) return { success: false };

    // Check limit
    if (usageData.downloads_this_month >= limits.downloads) {
      return { 
        success: false, 
        message: `You've reached your monthly download limit (${limits.downloads}). Upgrade for more.`
      };
    }

    try {
      const now = new Date();
      const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const field = resourceType === 'report' ? 'report_downloads' : 'templates_downloaded';

      await supabase.rpc('increment_usage', {
        p_org_id: organization.id,
        p_user_id: user.id,
        p_month_year: monthYear,
        p_field: field
      });

      await supabase.from('activity_log').insert({
        organization_id: organization.id,
        user_id: user.id,
        action_type: 'download',
        action_detail: { resource_name: resourceName, resource_type: resourceType }
      });

      return { success: true };
    } catch (err) {
      console.error('Error tracking download:', err);
      return { success: false };
    }
  };

  // Track professor session
  const trackProfessorSession = async () => {
    if (!supabase || !user?.id || !organization?.id) return { success: false };

    // Check limit (premium = unlimited)
    if (tierKey !== 'premium' && usageData.professor_sessions_this_month >= limits.professor) {
      return { 
        success: false, 
        message: `You've reached your monthly limit (${limits.professor}). Upgrade for more.`
      };
    }

    try {
      const now = new Date();
      const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      await supabase.rpc('increment_usage', {
        p_org_id: organization.id,
        p_user_id: user.id,
        p_month_year: monthYear,
        p_field: 'professor_sessions'
      });

      await supabase.from('activity_log').insert({
        organization_id: organization.id,
        user_id: user.id,
        action_type: 'professor_session',
        action_detail: { timestamp: now.toISOString() }
      });

      return { success: true };
    } catch (err) {
      console.error('Error tracking professor session:', err);
      return { success: false };
    }
  };

  // ==========================================
  // CLICK HANDLERS
  // ==========================================

  // Handle tool click
  const handleToolClick = async (tool: typeof TOOLS[0]) => {
    if (isLoading) return;

    setIsLoading(true);
    setLoadingTool(tool.id);

    try {
      const result = await trackToolStart(tool.id, tool.name);

      if (result.success) {
        setUsageData(prev => ({
          ...prev,
          tools_used_this_month: prev.tools_used_this_month + 1
        }));

        setRecentActivity(prev => [{
          id: Date.now().toString(),
          action_type: 'tool_start',
          action_detail: { tool_name: tool.name },
          created_at: new Date().toISOString()
        }, ...prev.slice(0, 4)]);

        const sessionParam = result.sessionId ? `?session=${result.sessionId}` : '';
        onNavigate(`${tool.route}${sessionParam}`);
      } else {
        onNavigate(tool.route);
      }
    } catch (err) {
      console.error('Tool click error:', err);
      onNavigate(tool.route);
    } finally {
      setIsLoading(false);
      setLoadingTool(null);
    }
  };

  // Handle download click
  const handleDownloadClick = async (resourceName: string, resourceType: 'report' | 'template') => {
    const result = await trackDownload(resourceName, resourceType);

    if (!result.success && result.message) {
      alert(result.message);
      return;
    }

    if (result.success) {
      setUsageData(prev => ({
        ...prev,
        downloads_this_month: prev.downloads_this_month + 1
      }));

      setRecentActivity(prev => [{
        id: Date.now().toString(),
        action_type: 'download',
        action_detail: { resource_name: resourceName },
        created_at: new Date().toISOString()
      }, ...prev.slice(0, 4)]);
    }

    onDownload(resourceName);
  };

  // Handle professor click
  const handleStartProfessor = async () => {
    const result = await trackProfessorSession();

    if (!result.success && result.message) {
      alert(result.message);
      return;
    }

    if (result.success) {
      setUsageData(prev => ({
        ...prev,
        professor_sessions_this_month: prev.professor_sessions_this_month + 1
      }));

      setRecentActivity(prev => [{
        id: Date.now().toString(),
        action_type: 'professor_session',
        action_detail: {},
        created_at: new Date().toISOString()
      }, ...prev.slice(0, 4)]);
    }

    onStartProfessor();
  };

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================

  const formatActivity = (activity: any) => {
    const colors: Record<string, string> = {
      'tool_start': '#00a0b0',
      'tool_complete': '#16a34a',
      'download': '#8b5cf6',
      'professor_session': '#f59e0b'
    };

    const labels: Record<string, string> = {
      'tool_start': 'Started',
      'tool_complete': 'Completed',
      'download': 'Downloaded',
      'professor_session': 'Professor session'
    };

    const detail = activity.action_detail || {};
    let text = labels[activity.action_type] || activity.action_type;
    if (detail.tool_name) text += ` ${detail.tool_name}`;
    if (detail.resource_name) text += ` ${detail.resource_name}`;

    return { color: colors[activity.action_type] || '#6b7280', text, time: formatTimeAgo(activity.created_at) };
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getResetDate = () => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="flex min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ==========================================
          LEFT SIDEBAR
          ========================================== */}
      <aside className="w-56 bg-white border-r-2 border-gray-300 flex flex-col fixed h-screen overflow-y-auto">
        {/* Logo */}
        <div className="px-4 py-4 border-b-2 border-gray-300">
          <div className="bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg p-3 text-center">
            <span className="text-xs text-gray-500 font-medium">YOUR LOGO HERE</span>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="py-3 flex-1">
          <div className="px-3 mb-2">
            <span className="text-xs font-extrabold tracking-wider text-gray-600 uppercase">Main</span>
          </div>
          <nav className="space-y-0.5 px-2">
            <a onClick={() => onNavigate('dashboard')} className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-sm font-medium" style={{ background: TEAL_LIGHT, color: TEAL }}>
              <span>Home</span>
            </a>
            <a onClick={() => onNavigate('library')} className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-50 text-sm">
              <span>Resource Library</span>
            </a>
            <a onClick={() => onNavigate('events')} className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-50 text-sm">
              <span>Events Calendar</span>
            </a>
          </nav>

          {/* Tools Section */}
          <div className="mt-4 pt-4 border-t-2 border-gray-300">
            <div className="px-3 mb-2">
              <span className="text-xs font-extrabold tracking-wider text-gray-600 uppercase">Tools</span>
            </div>
            <nav className="space-y-0.5 px-2">
              {TOOLS.map(tool => (
                <a
                  key={tool.id}
                  onClick={() => handleToolClick(tool)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-50 text-sm ${loadingTool === tool.id ? 'opacity-50' : ''}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: tool.isActive ? TEAL : '#d1d5db' }} />
                  <span>{tool.name}</span>
                  {loadingTool === tool.id && (
                    <span className="ml-auto">
                      <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                    </span>
                  )}
                </a>
              ))}
            </nav>
          </div>

          {/* Resources Section */}
          <div className="mt-4 pt-4 border-t-2 border-gray-300">
            <div className="px-3 mb-2">
              <span className="text-xs font-extrabold tracking-wider text-gray-600 uppercase">Resources</span>
            </div>
            <nav className="space-y-0.5 px-2">
              <a onClick={() => onNavigate('templates')} className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-50 text-sm">
                <span>Templates</span>
              </a>
              <a onClick={() => onNavigate('book-summaries')} className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-50 text-sm">
                <span>Book Summaries</span>
              </a>
              <a onClick={() => onNavigate('certifications')} className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-50 text-sm">
                <span>Certifications</span>
              </a>
              <a onClick={handleStartProfessor} className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-sm font-medium text-white" style={{ background: NAVY }}>
                <span>Ask the Professor</span>
              </a>
            </nav>
          </div>

          {/* Admin Section */}
          {adminAccess.isAdmin && (
            <div className="mt-4 pt-4 border-t-2 border-gray-300">
              <div className="px-3 mb-2">
                <span className="text-xs font-extrabold tracking-wider text-gray-600 uppercase">Admin</span>
              </div>
              <nav className="space-y-0.5 px-2">
                <a onClick={() => onNavigate('content-manager')} className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-50 text-sm">
                  <span>Content Manager</span>
                </a>
                {adminAccess.isOwner && (
                  <>
                    <a onClick={() => onNavigate('platform-admin')} className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-50 text-sm">
                      <span>Platform Admin</span>
                    </a>
                    <a onClick={() => onNavigate('owner-dashboard')} className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-50 text-sm">
                      <span>Owner Dashboard</span>
                    </a>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="p-3 border-t-2 border-gray-300">
          <div onClick={() => setShowAvatarModal(true)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer group">
            <div className="relative">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: NAVY }}>
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{user?.email || 'User'}</div>
              <div className="text-xs text-gray-500 truncate">{organization?.name || 'Organization'}</div>
            </div>
            {adminAccess.isOwner && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: TEAL_LIGHT, color: TEAL }}>OWNER</span>
            )}
          </div>
          <button onClick={onLogout} className="w-full mt-2 text-xs text-gray-500 hover:text-gray-700 py-1">Sign Out</button>
        </div>
      </aside>

      {/* ==========================================
          MAIN CONTENT
          ========================================== */}
      <div className="flex-1 ml-56">
        <div className="p-6">
          <div className="flex gap-6">
            {/* Center Content */}
            <div className="flex-1 space-y-5">
              {/* Welcome Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold" style={{ color: NAVY }}>
                    Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
                  </h1>
                  <p className="text-sm text-gray-500">Here's what's happening with your organization</p>
                </div>
                <button onClick={() => onNavigate('constraint-assessment')} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: TEAL }}>
                  Constraint Assessment Report
                </button>
              </div>

              {/* Today's Insight */}
              <div className="rounded-xl p-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a365d 0%, #0f1f38 100%)' }}>
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full" style={{ background: 'rgba(0,160,176,0.1)' }} />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">💡</span>
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: TEAL }}>Today's Insight</span>
                  </div>
                  <p className="text-white text-base leading-relaxed mb-2">
                    "The job of a board member isn't to run the organization. It's to make sure the organization is well-run."
                  </p>
                  <p className="text-sm text-gray-400">— "Governance as Leadership" by Chait, Ryan & Taylor</p>
                </div>
              </div>

              {/* Getting Started Panel */}
              {showOnboarding && (
                <div className="rounded-xl border-2 border-gray-300 overflow-hidden bg-white">
                  <div className="px-5 py-3 border-b-2 border-gray-300 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">👋</span>
                      <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: NAVY }}>Getting Started</h2>
                    </div>
                    <button onClick={() => setShowOnboarding(false)} className="text-xs text-gray-400 hover:text-gray-600">
                      ✓ I'm done with onboarding
                    </button>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { num: 1, label: 'FIRST', title: 'Complete Profile', desc: 'Add your photo & org details', route: 'settings', bg: TEAL },
                        { num: 2, label: 'ASSESS', title: 'Constraint Assessment', desc: "Find your organization's ONE Thing", route: 'constraint-assessment', bg: NAVY },
                        { num: 3, label: 'EXPLORE', title: 'Browse Templates', desc: '147+ ready-to-use resources', route: 'templates', bg: NAVY },
                        { num: 4, label: 'TRY THIS', title: 'Strategic Plan Check-Up', desc: "Assess your org's health", route: 'strategic-checkup', bg: NAVY }
                      ].map((step, i) => (
                        <div key={i} onClick={() => onNavigate(step.route)} className="rounded-xl border-2 border-gray-200 p-4 cursor-pointer hover:shadow-lg hover:border-[#00a0b0] transition bg-white group" style={i === 0 ? { borderColor: TEAL, background: '#f0fafb' } : {}}>
                          <div className={`text-[10px] font-bold uppercase tracking-wide mb-2 px-2 py-0.5 rounded inline-block ${i === 0 ? 'text-white' : 'bg-blue-100 text-blue-700'}`} style={i === 0 ? { background: TEAL } : {}}>
                            {step.label}
                          </div>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mb-3 group-hover:scale-110 transition" style={{ background: step.bg }}>
                            {step.num}
                          </div>
                          <div className="font-bold text-sm mb-1" style={{ color: NAVY }}>{step.title}</div>
                          <div className="text-xs text-gray-500">{step.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tools Grid */}
              <div className="rounded-xl border-2 border-gray-300 overflow-hidden bg-white">
                <div className="px-5 py-3 border-b-2 border-gray-300">
                  <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: NAVY }}>Your Tools</h2>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-3">
                    {TOOLS.map(tool => (
                      <div
                        key={tool.id}
                        onClick={() => handleToolClick(tool)}
                        className={`relative rounded-lg overflow-hidden cursor-pointer group ${loadingTool === tool.id ? 'opacity-75' : ''}`}
                        style={{ height: '100px' }}
                      >
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105" style={{ backgroundImage: `url(${tool.image})` }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <div className="text-white font-bold text-sm leading-tight">{tool.name}</div>
                          <div className="text-xs mt-0.5 text-gray-300">{tool.status}</div>
                        </div>
                        {tool.isActive && <div className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: TEAL }} />}
                        {loadingTool === tool.id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended For You */}
              <div className="rounded-xl border-2 border-gray-300 overflow-hidden bg-white">
                <div className="px-5 py-3 border-b-2 border-gray-300 flex justify-between items-center">
                  <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: NAVY }}>Recommended For You</h2>
                  <a onClick={() => onNavigate('library')} className="text-xs font-semibold cursor-pointer hover:underline" style={{ color: TEAL }}>See all →</a>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {recommendations.map((rec, index) => (
                      <div key={index} onClick={() => handleDownloadClick(rec.title, rec.type as 'report' | 'template')} className="bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition">
                        <span className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded mb-2 ${rec.type === 'template' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                          {rec.type === 'template' ? '📄 TEMPLATE' : '📚 BOOK SUMMARY'}
                        </span>
                        <div className="font-bold text-sm mb-0.5" style={{ color: NAVY }}>{rec.title}</div>
                        <div className="text-xs text-gray-500">{rec.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="rounded-xl border-2 border-gray-300 overflow-hidden bg-white">
                <div className="px-5 py-3 border-b-2 border-gray-300 flex justify-between items-center">
                  <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: NAVY }}>Upcoming Events</h2>
                  <a onClick={() => onNavigate('events')} className="text-xs font-semibold cursor-pointer hover:underline" style={{ color: TEAL }}>View calendar →</a>
                </div>
                <div className="p-4 space-y-3">
                  {events.map((event, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg flex flex-col items-center justify-center flex-shrink-0" style={{ background: NAVY }}>
                        <div className="text-lg font-bold text-white leading-none">{event.day}</div>
                        <div className="text-[10px] font-medium text-gray-300">{event.month}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm" style={{ color: NAVY }}>{event.title}</div>
                        <div className="text-xs text-gray-500 mb-1">{event.meta}</div>
                        <span className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded ${event.tagColor}`}>{event.tag}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ==========================================
                RIGHT SIDEBAR
                ========================================== */}
            <div className="w-64 space-y-4 flex-shrink-0">
              {/* Quick Actions */}
              <div className="rounded-xl border-2 border-gray-300 overflow-hidden bg-white">
                <div className="px-4 py-3 border-b-2 border-gray-300">
                  <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: NAVY }}>Quick Actions</h2>
                </div>
                <div className="p-3 space-y-2">
                  {[
                    { icon: '🚀', title: 'Getting Started', desc: 'Complete your onboarding', route: 'getting-started', bg: TEAL },
                    { icon: '📋', title: 'Constraint Assessment', desc: 'Find your ONE Thing', route: 'constraint-assessment', bg: '#8b5cf6' },
                    { icon: '📅', title: 'Attend a Webinar', desc: 'Join live sessions', route: 'events', bg: '#f59e0b' }
                  ].map((action, i) => (
                    <button key={i} onClick={() => onNavigate(action.route)} className="w-full text-left px-3 py-2.5 rounded-lg text-sm hover:bg-[#e6f7f9] transition flex items-center gap-3 border border-transparent hover:border-[#00a0b0]">
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: action.bg }}>{action.icon}</span>
                      <div>
                        <div className="font-semibold" style={{ color: NAVY }}>{action.title}</div>
                        <div className="text-[10px] text-gray-500">{action.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ask the Professor Tracker */}
              <div className="rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a365d 0%, #0f1f38 100%)' }}>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">🎓</span>
                    <div>
                      <span className="font-bold text-sm text-white">Ask the Professor</span>
                      <div className="text-[10px] text-gray-400">AI-powered guidance</div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Sessions this month</span>
                    <span className="font-bold text-white">
                      {usageData.professor_sessions_this_month} of {tierKey === 'premium' ? '∞' : limits.professor}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.2)' }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{ background: 'linear-gradient(90deg, #f97316, #fbbf24)', width: tierKey === 'premium' ? '10%' : `${Math.min((usageData.professor_sessions_this_month / limits.professor) * 100, 100)}%` }} />
                  </div>
                  <button onClick={handleStartProfessor} className="w-full mt-3 py-2 rounded-lg text-sm font-semibold text-white transition hover:opacity-90" style={{ background: TEAL }}>
                    Start Session →
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="rounded-xl border-2 border-gray-300 overflow-hidden bg-white">
                <div className="px-4 py-3 border-b-2 border-gray-300">
                  <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: NAVY }}>Recent Activity</h2>
                </div>
                <div className="p-3 space-y-3">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => {
                      const formatted = formatActivity(activity);
                      return (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: formatted.color }} />
                          <div>
                            <div className="text-xs text-gray-700">{formatted.text}</div>
                            <div className="text-[10px] text-gray-400">{formatted.time}</div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-xs text-gray-400 text-center py-2">No recent activity yet</div>
                  )}
                </div>
              </div>

              {/* Report Downloads Tracker */}
              <div className="rounded-xl border-2 overflow-hidden" style={{ background: TEAL_LIGHT, borderColor: TEAL }}>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base">📥</span>
                    <span className="font-bold text-sm" style={{ color: NAVY }}>Report Downloads</span>
                  </div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">Remaining</span>
                    <span className="font-bold" style={{ color: NAVY }}>
                      {Math.max(limits.downloads - usageData.downloads_this_month, 0)} of {limits.downloads}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,160,176,0.2)' }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{ background: TEAL, width: `${Math.max(((limits.downloads - usageData.downloads_this_month) / limits.downloads) * 100, 0)}%` }} />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2">
                    Resets {getResetDate()} • <a href="#" onClick={() => onNavigate('pricing')} className="underline" style={{ color: TEAL }}>Need more?</a>
                  </p>
                </div>
              </div>

              {/* Tools This Month */}
              <div className="rounded-xl border-2 border-gray-300 overflow-hidden bg-white">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base">🛠️</span>
                    <span className="font-bold text-sm" style={{ color: NAVY }}>Tools This Month</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold" style={{ color: NAVY }}>{usageData.tools_used_this_month}</div>
                      <div className="text-[10px] text-gray-500">Started</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold" style={{ color: TEAL }}>{usageData.tools_completed_this_month}</div>
                      <div className="text-[10px] text-gray-500">Completed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          AI CHATBOT
          ========================================== */}
      <div className="fixed bottom-6 right-6 z-50">
        <button onClick={() => setShowAIChat(!showAIChat)} className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-105 transition-transform" style={{ background: 'linear-gradient(135deg, #1a365d, #00a0b0)' }}>
          <span className="text-2xl">💬</span>
        </button>

        {showAIChat && (
          <div className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #1a365d, #0f1f38)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: TEAL }}>
                <span className="text-xl">💬</span>
              </div>
              <div className="flex-1">
                <div className="font-bold text-white text-sm">AI Assistant</div>
                <div className="text-xs text-gray-300">Here to help you</div>
              </div>
              <button onClick={() => setShowAIChat(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="p-4 h-64 overflow-y-auto bg-gray-50">
              <div className="flex gap-2 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: TEAL }}>
                  <span className="text-sm">💬</span>
                </div>
                <div className="bg-white rounded-xl rounded-tl-none p-3 shadow-sm max-w-[85%]">
                  <p className="text-sm text-gray-700">
                    Hi{user?.email ? ` ${user.email.split('@')[0]}` : ''}! 👋 I'm here to help you with The Nonprofit Edge. What would you like to explore today?
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-gray-200">
              <div className="flex gap-2">
                <input type="text" value={aiMessage} onChange={(e) => setAiMessage(e.target.value)} placeholder="Ask me anything..." className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#00a0b0]" />
                <button className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ background: TEAL }}>→</button>
              </div>
              <div className="flex gap-1 mt-2 flex-wrap">
                <button className="text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">Where do I start?</button>
                <button className="text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">Show me templates</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==========================================
          AVATAR MODAL
          ========================================== */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-bold text-lg" style={{ color: NAVY }}>Choose Your Avatar</h3>
              <p className="text-sm text-gray-500">Select an image or upload your own</p>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold" style={{ background: NAVY }}>
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <p className="text-xs text-gray-500 mt-2">Current</p>
              </div>

              <p className="text-sm font-semibold text-gray-700 mb-3">Choose a color for your initials:</p>
              <div className="flex gap-2 mb-6">
                {avatarColors.map((color, i) => (
                  <div key={i} className="w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition" style={{ background: color }} />
                ))}
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#00a0b0] transition cursor-pointer">
                <span className="text-2xl">📷</span>
                <p className="text-sm text-gray-600 mt-1">Upload your own photo</p>
                <p className="text-xs text-gray-400">JPG, PNG up to 2MB</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setShowAvatarModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
              <button onClick={() => setShowAvatarModal(false)} className="px-4 py-2 text-sm font-semibold text-white rounded-lg" style={{ background: TEAL }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40 pointer-events-none">
          <div className="bg-white rounded-xl p-4 shadow-xl flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-gray-700">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
