/**
 * THE NONPROFIT EDGE - Dashboard
 * Updated with new design: image-based tool cards, modern layout
 * 
 * Roles:
 *   owner  → Sees: Content Manager + Platform Admin + Owner Dashboard + Marketing + Links
 *   admin  → Sees: Content Manager only
 *   member → Sees: Neither (regular dashboard only)
 */

import React, { useState, useEffect } from 'react';

// Brand colors
const NAVY = '#1a365d';
const TEAL = '#00a0b0';
const TEAL_LIGHT = '#e6f7f9';

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

interface Tool {
  id: string;
  name: string;
  status: string;
  statusColor: string;
  image: string;
  route: string;
  isActive?: boolean;
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
  const [adminAccess, setAdminAccess] = useState<AdminAccess>({
    isAdmin: false,
    isOwner: false,
    role: null
  });
  const [loading, setLoading] = useState(true);

  // Tool data with carefully selected professional images
  // Using wider aspect ratio (600x300) to show more of each image
  const tools: Tool[] = [
    {
      id: 'board-assessment',
      name: 'Board Assessment',
      status: 'In Process',
      statusColor: TEAL,
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=300&fit=crop',
      route: 'board-assessment',
      isActive: true
    },
    {
      id: 'strategic-plan',
      name: 'Strategic Plan Check-Up',
      status: 'Score: 92',
      statusColor: '#6b7280',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=300&fit=crop',
      route: 'strategic-checkup'
    },
    {
      id: 'ceo-evaluation',
      name: 'CEO Evaluation',
      status: 'Completed',
      statusColor: '#16a34a',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=300&fit=crop',
      route: 'ceo-evaluation'
    },
    {
      id: 'scenario-planner',
      name: 'Scenario Planner',
      status: 'Ready',
      statusColor: '#6b7280',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop',
      route: 'scenario-planner'
    },
    {
      id: 'template-vault',
      name: 'Template Vault',
      status: '147 templates',
      statusColor: '#6b7280',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=300&fit=crop',
      route: 'templates'
    },
    {
      id: 'grant-review',
      name: 'Grant Review',
      status: 'Ready',
      statusColor: '#6b7280',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=300&fit=crop',
      route: 'grant-review'
    }
  ];

  // Check admin access on mount
  useEffect(() => {
    checkAdminAccess();
  }, [user.email]);

  const checkAdminAccess = async () => {
    if (!supabase) {
      const isOwner = user.email === 'lyn@thepivotalgroup.com';
      setAdminAccess({
        isAdmin: isOwner,
        isOwner: isOwner,
        role: isOwner ? 'owner' : null
      });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('platform_admins')
        .select('role')
        .eq('email', user.email)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin access:', error);
      }

      if (data) {
        setAdminAccess({
          isAdmin: true,
          isOwner: data.role === 'owner',
          role: data.role
        });
      } else {
        setAdminAccess({
          isAdmin: false,
          isOwner: false,
          role: null
        });
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTierInfo = () => {
    const tier = organization?.subscription_tier || 'professional';
    const tiers: Record<string, { name: string; color: string; bgColor: string }> = {
      essential: { name: 'Essential', color: NAVY, bgColor: '#E8F4F8' },
      professional: { name: 'Professional', color: TEAL, bgColor: TEAL_LIGHT },
      premium: { name: 'Premium', color: '#7C3AED', bgColor: '#F3E8FF' }
    };
    return tiers[tier] || tiers.professional;
  };

  const tierInfo = getTierInfo();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <aside className="w-52 bg-white border-r border-gray-300 flex flex-col fixed h-screen overflow-y-auto">
        {/* Logo */}
        <div className="px-4 py-5 border-b border-gray-300">
          <div className="text-lg font-extrabold" style={{ color: NAVY }}>
            The Nonprofit Edge
          </div>
        </div>

        {/* Main Nav */}
        <div className="py-4">
          <div className="px-4 mb-2 text-xs font-extrabold uppercase tracking-wider" style={{ color: NAVY }}>
            Main
          </div>
          <nav>
            <a 
              onClick={() => onNavigate('dashboard')}
              className="block px-4 py-2 text-sm font-semibold cursor-pointer"
              style={{ color: TEAL, backgroundColor: TEAL_LIGHT }}
            >
              Dashboard
            </a>
            <a 
              onClick={() => onNavigate('library')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Resource Library
            </a>
            <a 
              onClick={() => onNavigate('events')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              📅 Events
            </a>
          </nav>
        </div>

        {/* Tools */}
        <div className="py-4 border-t border-gray-300">
          <div className="px-4 mb-2 text-xs font-extrabold uppercase tracking-wider" style={{ color: NAVY }}>
            Tools
          </div>
          <nav>
            <a 
              onClick={() => onNavigate('strategic-checkup')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer leading-tight"
            >
              Strategic Plan<br/>Check-Up
            </a>
            <a 
              onClick={() => onNavigate('board-assessment')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Board Assessment
            </a>
            <a 
              onClick={() => onNavigate('scenario-planner')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Scenario Planner
            </a>
            <a 
              onClick={() => onNavigate('grant-review')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Grant Review
            </a>
            <a 
              onClick={() => onNavigate('ceo-evaluation')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              CEO Evaluation
            </a>
          </nav>
        </div>

        {/* Resources */}
        <div className="py-4 border-t border-gray-300">
          <div className="px-4 mb-2 text-xs font-extrabold uppercase tracking-wider" style={{ color: NAVY }}>
            Resources
          </div>
          <nav>
            <a 
              onClick={() => onNavigate('templates')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Templates
            </a>
            <a 
              onClick={() => onNavigate('book-summaries')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Book Summaries
            </a>
            <a 
              onClick={() => onNavigate('certifications')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Certifications
            </a>
          </nav>
          
          {/* Ask the Professor Button */}
          <div className="px-3 pt-3">
            <a 
              onClick={onStartProfessor}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-white cursor-pointer hover:opacity-90 transition"
              style={{ background: `linear-gradient(135deg, ${NAVY}, #122443)` }}
            >
              <div 
                className="w-7 h-7 rounded-md flex items-center justify-center text-sm"
                style={{ background: TEAL }}
              >
                🎓
              </div>
              <span className="font-semibold text-sm">Ask the Professor</span>
            </a>
          </div>
        </div>

        {/* Manage Team */}
        <div className="py-3 border-t border-gray-300">
          <a 
            onClick={() => onNavigate('team')}
            className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
          >
            Manage Team
          </a>
        </div>

        {/* Admin Section - Role Based */}
        {!loading && adminAccess.isAdmin && (
          <div className="py-4 border-t border-gray-300">
            <div className="px-4 mb-2 text-xs font-extrabold uppercase tracking-wider" style={{ color: NAVY }}>
              Admin
            </div>
            <nav>
              <a 
                onClick={() => onNavigate('content-manager')}
                className="block px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer"
                style={{ color: NAVY }}
              >
                📝 Content Manager
              </a>
              <a 
                onClick={() => onNavigate('admin')}
                className="block px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 cursor-pointer"
              >
                ⚙️ Platform Admin
              </a>
              {adminAccess.isOwner && (
                <>
                  <a 
                    onClick={() => onNavigate('owner-dashboard')}
                    className="block px-4 py-2 text-sm text-green-600 hover:bg-green-50 cursor-pointer"
                  >
                    💰 Owner Dashboard
                  </a>
                  <a 
                    onClick={() => onNavigate('enhanced-owner')}
                    className="block px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                  >
                    📊 Analytics + GHL
                  </a>
                  <a 
                    onClick={() => onNavigate('marketing')}
                    className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 cursor-pointer"
                  >
                    📣 Marketing
                  </a>
                  <a 
                    onClick={() => onNavigate('link-manager')}
                    className="block px-4 py-2 text-sm text-violet-600 hover:bg-violet-50 cursor-pointer"
                  >
                    🔗 Link Manager
                  </a>
                  <a 
                    onClick={() => onNavigate('team-access')}
                    className="block px-4 py-2 text-sm text-pink-600 hover:bg-pink-50 cursor-pointer"
                  >
                    👥 Team Access
                  </a>
                </>
              )}
            </nav>
          </div>
        )}

        {/* User Profile */}
        <div className="mt-auto px-4 py-4 border-t border-gray-300">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
              style={{ background: `linear-gradient(135deg, ${TEAL}, #008090)` }}
            >
              {user.full_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-800 text-sm truncate">
                {user.full_name || user.email}
              </div>
              <div className="text-[10px] text-gray-400">{tierInfo.name}</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="mt-3 w-full text-xs text-gray-500 hover:text-gray-700 py-1"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-52">
        <div className="p-6 flex gap-6">
          {/* Center Content */}
          <div className="flex-1 space-y-6">
            
            {/* Today's Insight */}
            <div 
              className="rounded-2xl p-5 text-white"
              style={{ background: `linear-gradient(135deg, ${NAVY}, #122443)` }}
            >
              <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                TODAY'S INSIGHT
              </div>
              <p className="text-base font-semibold leading-relaxed mb-2">
                "The board's job isn't to run the organization. It's to make sure the organization is well-run."
              </p>
              <p className="text-xs text-gray-400">
                — "Governance as Leadership" by Chait, Ryan & Taylor
              </p>
            </div>

            {/* Your Tools */}
            <div className="bg-white rounded-2xl border border-gray-300 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-300">
                <h2 className="text-sm font-bold" style={{ color: NAVY }}>Your Tools</h2>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-3 gap-4">
                  {tools.map((tool) => (
                    <div 
                      key={tool.id}
                      onClick={() => onNavigate(tool.route)}
                      className={`rounded-xl border-2 cursor-pointer hover:shadow-lg transition-all overflow-hidden group ${
                        tool.isActive 
                          ? 'border-[#00a0b0]' 
                          : 'border-gray-200 hover:border-[#00a0b0]'
                      }`}
                    >
                      <div className="h-24 overflow-hidden relative bg-gray-100">
                        <img 
                          src={tool.image} 
                          alt={tool.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div 
                        className="p-3 text-center"
                        style={{ backgroundColor: tool.isActive ? TEAL_LIGHT : '#fff' }}
                      >
                        <div className="font-semibold text-sm" style={{ color: NAVY }}>
                          {tool.name}
                        </div>
                        <div 
                          className="text-xs mt-1 font-medium"
                          style={{ color: tool.statusColor }}
                        >
                          {tool.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended For You */}
            <div className="bg-white rounded-2xl border border-gray-300 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-300 flex justify-between items-center">
                <h2 className="text-sm font-bold" style={{ color: NAVY }}>Recommended For You</h2>
                <a 
                  onClick={() => onNavigate('library')}
                  className="text-xs font-semibold cursor-pointer hover:underline"
                  style={{ color: TEAL }}
                >
                  See all →
                </a>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition">
                    <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded mb-2 bg-blue-100 text-blue-700">
                      TEMPLATE
                    </span>
                    <div className="font-bold text-sm mb-1" style={{ color: NAVY }}>
                      Board Member Expectations Agreement
                    </div>
                    <div className="text-xs text-gray-500">
                      Clarify roles and commitments upfront
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition">
                    <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded mb-2 bg-amber-100 text-amber-700">
                      BOOK SUMMARY
                    </span>
                    <div className="font-bold text-sm mb-1" style={{ color: NAVY }}>
                      Governance as Leadership
                    </div>
                    <div className="text-xs text-gray-500">
                      Reframing board work · 8 min read
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition">
                    <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded mb-2 bg-blue-100 text-blue-700">
                      TEMPLATE
                    </span>
                    <div className="font-bold text-sm mb-1" style={{ color: NAVY }}>
                      Leadership Transition Checklist
                    </div>
                    <div className="text-xs text-gray-500">
                      Distribute responsibilities systematically
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition">
                    <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded mb-2 bg-amber-100 text-amber-700">
                      BOOK SUMMARY
                    </span>
                    <div className="font-bold text-sm mb-1" style={{ color: NAVY }}>
                      The Outstanding Organization
                    </div>
                    <div className="text-xs text-gray-500">
                      Stop firefighting, start leading · 6 min read
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl border border-gray-300 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-300 flex justify-between items-center">
                <h2 className="text-sm font-bold" style={{ color: NAVY }}>Upcoming Events</h2>
                <a 
                  onClick={() => onNavigate('events')}
                  className="text-xs font-semibold cursor-pointer hover:underline"
                  style={{ color: TEAL }}
                >
                  View calendar →
                </a>
              </div>
              <div className="p-5 space-y-4">
                {/* Event 1 */}
                <div className="flex gap-4">
                  <div className="w-14 flex-shrink-0">
                    <div 
                      className="rounded-lg text-center py-2"
                      style={{ background: NAVY }}
                    >
                      <div className="text-xl font-extrabold text-white leading-none">12</div>
                      <div className="text-[10px] font-semibold text-white/70 uppercase">JAN</div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm mb-1" style={{ color: NAVY }}>
                      Board Engagement That Actually Works
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      Live webinar with Dr. Lyn Corbett · 12:00 PM PT
                    </div>
                    <span 
                      className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded"
                      style={{ background: TEAL_LIGHT, color: TEAL }}
                    >
                      WEBINAR
                    </span>
                  </div>
                </div>
                {/* Event 2 */}
                <div className="flex gap-4">
                  <div className="w-14 flex-shrink-0">
                    <div 
                      className="rounded-lg text-center py-2"
                      style={{ background: NAVY }}
                    >
                      <div className="text-xl font-extrabold text-white leading-none">15</div>
                      <div className="text-[10px] font-semibold text-white/70 uppercase">JAN</div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm mb-1" style={{ color: NAVY }}>
                      Founding Members Q&A Session
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      Open discussion · 10:00 AM PT
                    </div>
                    <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                      MEMBERS ONLY
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-64 space-y-4 flex-shrink-0">
            {/* Ask the Professor Card */}
            <div 
              className="rounded-2xl overflow-hidden text-white"
              style={{ background: `linear-gradient(135deg, ${NAVY}, #122443)` }}
            >
              <div className="px-4 py-3 flex items-center gap-3">
                <div 
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
                  style={{ background: TEAL }}
                >
                  🎓
                </div>
                <div className="font-bold text-sm">Ask the Professor</div>
              </div>
              <div className="px-4 pb-4">
                <p className="text-xs text-gray-300 mb-3">
                  Bring your challenges. Think deeply.
                </p>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Sessions</span>
                  <span className="font-bold">
                    {usage?.professor_sessions_this_month || 3} of 50
                  </span>
                </div>
                <div 
                  className="h-1.5 rounded-full mb-3 overflow-hidden"
                  style={{ background: '#2d4a7c' }}
                >
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      background: TEAL,
                      width: `${((usage?.professor_sessions_this_month || 3) / 50) * 100}%`
                    }}
                  />
                </div>
                <button 
                  onClick={onStartProfessor}
                  className="w-full py-2 rounded-lg font-bold text-xs text-white"
                  style={{ background: TEAL }}
                >
                  Start a Session
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-300 p-4">
              <h3 className="font-bold mb-3 text-sm" style={{ color: NAVY }}>
                Quick Actions
              </h3>
              <div className="space-y-2">
                <div 
                  onClick={() => onNavigate('constraint-report')}
                  className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-50 group"
                >
                  <span className="text-sm">📄</span>
                  <span className="text-xs text-gray-700 group-hover:text-[#00a0b0]">
                    Constraint Assessment Report
                  </span>
                </div>
                <div 
                  onClick={() => onNavigate('goals')}
                  className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-50 group"
                >
                  <span className="text-sm">🎯</span>
                  <span className="text-xs text-gray-700 group-hover:text-[#00a0b0]">
                    Update 90-day goals
                  </span>
                </div>
                <div 
                  onClick={() => onNavigate('team')}
                  className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-50 group"
                >
                  <span className="text-sm">👥</span>
                  <span className="text-xs text-gray-700 group-hover:text-[#00a0b0]">
                    Invite team members
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-gray-300 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-300">
                <h3 className="font-bold text-sm" style={{ color: NAVY }}>
                  Recent Activity
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: TEAL }} />
                  <div>
                    <div className="text-xs text-gray-700">Strategic Plan completed</div>
                    <div className="text-[10px] text-gray-400">3 days ago</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 bg-purple-500" />
                  <div>
                    <div className="text-xs text-gray-700">Downloaded Board Self-Assessment</div>
                    <div className="text-[10px] text-gray-400">5 days ago</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 bg-amber-500" />
                  <div>
                    <div className="text-xs text-gray-700">Coaching session</div>
                    <div className="text-[10px] text-gray-400">2 weeks ago</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Downloads */}
            <div 
              className="rounded-2xl border-2 overflow-hidden"
              style={{ background: TEAL_LIGHT, borderColor: TEAL }}
            >
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">📥</span>
                  <span className="font-bold text-sm" style={{ color: NAVY }}>
                    Report Downloads
                  </span>
                </div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Remaining</span>
                  <span className="font-bold" style={{ color: NAVY }}>
                    {25 - (usage?.downloads_this_month || 7)} of 25
                  </span>
                </div>
                <div 
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: 'rgba(0,160,176,0.2)' }}
                >
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      background: TEAL,
                      width: `${((25 - (usage?.downloads_this_month || 7)) / 25) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
