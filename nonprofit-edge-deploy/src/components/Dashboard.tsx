/**
 * THE NONPROFIT EDGE - Dashboard
 * Final version - Ready for deployment
 * 
 * Features:
 * - Image-based tool cards in 3x2 grid
 * - Today's Insight with dark navy background
 * - Getting Started panel (4 steps)
 * - AI Assistant chatbot (bottom right)
 * - Avatar selection modal
 * - Role-based admin access (owner/admin/member)
 * - No icons in sidebar navigation
 * 
 * Roles:
 *   owner  → Sees: Content Manager + Platform Admin + Owner Dashboard
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
  const [showAIChat, setShowAIChat] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Check admin access on mount
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

  // Tool data with professional images
  // REPLACE these URLs with your own images
  const tools: Tool[] = [
    {
      id: 'board-assessment',
      name: 'Board Assessment',
      status: 'Ready',
      statusColor: '#6b7280',
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=600&fit=crop',
      route: 'board-assessment',
      isActive: true
    },
    {
      id: 'strategic-plan',
      name: 'Strategic Plan Check-Up',
      status: 'Ready',
      statusColor: '#6b7280',
      image: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=1200&h=600&fit=crop',
      route: 'strategic-checkup'
    },
    {
      id: 'ceo-evaluation',
      name: 'CEO Evaluation',
      status: 'Ready',
      statusColor: '#6b7280',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop',
      route: 'ceo-evaluation'
    },
    {
      id: 'scenario-planner',
      name: 'Scenario Planner',
      status: 'Ready',
      statusColor: '#6b7280',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
      route: 'scenario-planner'
    },
    {
      id: 'grant-review',
      name: 'Grant Review',
      status: 'Ready',
      statusColor: '#6b7280',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=600&fit=crop',
      route: 'grant-review'
    },
    {
      id: 'template-vault',
      name: 'Template Vault',
      status: '147 templates',
      statusColor: '#6b7280',
      image: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=1200&h=600&fit=crop',
      route: 'templates'
    }
  ];

  // Recommendations data
  const recommendations = [
    {
      type: 'template',
      title: 'Board Self-Assessment Survey',
      desc: 'Annual evaluation tool for board members'
    },
    {
      type: 'book',
      title: 'Good to Great (Social Sectors)',
      desc: 'Jim Collins on nonprofit excellence'
    },
    {
      type: 'template',
      title: 'Strategic Plan Template',
      desc: '3-year planning framework'
    },
    {
      type: 'book',
      title: 'The ONE Thing',
      desc: 'Focus methodology for leaders'
    }
  ];

  // Events data
  const events = [
    {
      day: '15',
      month: 'JAN',
      title: 'Board Governance Masterclass',
      meta: 'Virtual • 2:00 PM EST',
      tag: 'WORKSHOP',
      tagColor: 'bg-purple-100 text-purple-700'
    },
    {
      day: '22',
      month: 'JAN',
      title: 'Strategic Planning Deep Dive',
      meta: 'Virtual • 1:00 PM EST',
      tag: 'TRAINING',
      tagColor: 'bg-blue-100 text-blue-700'
    },
    {
      day: '05',
      month: 'FEB',
      title: 'Grant Writing Workshop',
      meta: 'Virtual • 11:00 AM EST',
      tag: 'WORKSHOP',
      tagColor: 'bg-purple-100 text-purple-700'
    }
  ];

  // Recent activity data
  const recentActivity = [
    { color: '#00a0b0', text: 'Board Assessment started', time: 'Today' },
    { color: '#16a34a', text: 'Strategic Plan completed', time: '3 days ago' },
    { color: '#8b5cf6', text: 'Downloaded Board Self-Assessment', time: '5 days ago' },
    { color: '#f59e0b', text: 'Coaching session', time: '2 weeks ago' }
  ];

  // Avatar options
  const avatarColors = ['#1a365d', '#00a0b0', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981'];

  return (
    <div className="flex min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Left Sidebar */}
      <aside className="w-56 bg-white border-r-2 border-gray-300 flex flex-col fixed h-screen overflow-y-auto">
        {/* Logo - REPLACE with your actual logo */}
        <div className="px-4 py-4 border-b-2 border-gray-300">
          {/* Replace this div with: <img src="/logo.png" alt="The Nonprofit Edge" className="h-8" /> */}
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
            <a 
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-sm font-medium"
              style={{ background: TEAL_LIGHT, color: TEAL }}
            >
              <span>Home</span>
            </a>
            <a 
              onClick={() => onNavigate('library')}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-50 text-sm"
            >
              <span>Resource Library</span>
            </a>
            <a 
              onClick={() => onNavigate('events')}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-50 text-sm"
            >
              <span>Events Calendar</span>
            </a>
          </nav>

          {/* Tools Section */}
          <div className="mt-4 pt-4 border-t-2 border-gray-300">
            <div className="px-3 mb-2">
              <span className="text-xs font-extrabold tracking-wider text-gray-600 uppercase">Tools</span>
            </div>
            <nav className="space-y-0.5 px-2">
              {tools.map(tool => (
                <a
                  key={tool.id}
                  onClick={() => onNavigate(tool.route)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-50 text-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: tool.isActive ? TEAL : '#d1d5db' }} />
                  <span>{tool.name}</span>
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
              <a 
                onClick={() => onNavigate('templates')}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-50 text-sm"
              >
                <span>Templates</span>
              </a>
              <a 
                onClick={() => onNavigate('book-summaries')}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-50 text-sm"
              >
                <span>Book Summaries</span>
              </a>
              <a 
                onClick={() => onNavigate('certifications')}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-50 text-sm"
              >
                <span>Certifications</span>
              </a>
              {/* Ask the Professor - Main Tool */}
              <a 
                onClick={onStartProfessor}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-sm font-medium text-white"
                style={{ background: NAVY }}
              >
                <span>Ask the Professor</span>
              </a>
            </nav>
          </div>

          {/* Admin Section - Only visible to admins */}
          {adminAccess.isAdmin && (
            <div className="mt-4 pt-4 border-t-2 border-gray-300">
              <div className="px-3 mb-2">
                <span className="text-xs font-extrabold tracking-wider text-gray-600 uppercase">Admin</span>
              </div>
              <nav className="space-y-0.5 px-2">
                <a 
                  onClick={() => onNavigate('content-manager')}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-50 text-sm"
                >
                  <span>Content Manager</span>
                </a>
                {adminAccess.isOwner && (
                  <>
                    <a 
                      onClick={() => onNavigate('platform-admin')}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-50 text-sm"
                    >
                      <span>Platform Admin</span>
                    </a>
                    <a 
                      onClick={() => onNavigate('owner-dashboard')}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-50 text-sm"
                    >
                      <span>Owner Dashboard</span>
                    </a>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>

        {/* User Profile at Bottom */}
        <div className="p-3 border-t-2 border-gray-300">
          <div 
            onClick={() => setShowAvatarModal(true)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer group"
          >
            <div className="relative">
              <div 
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ background: NAVY }}
              >
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white rounded-full border border-gray-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="text-[8px]">✏️</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {user?.email || 'User'}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {organization?.name || 'Organization'}
              </div>
            </div>
            {adminAccess.isOwner && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: TEAL_LIGHT, color: TEAL }}>
                OWNER
              </span>
            )}
            {adminAccess.isAdmin && !adminAccess.isOwner && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
                ADMIN
              </span>
            )}
          </div>
          <button
            onClick={onLogout}
            className="w-full mt-2 text-xs text-gray-500 hover:text-gray-700 py-1"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
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
                <button
                  onClick={() => onNavigate('constraint-assessment')}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ background: TEAL }}
                >
                  Constraint Assessment Report
                </button>
              </div>

              {/* Today's Insight - Dark Background */}
              <div 
                className="rounded-xl p-5 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #1a365d 0%, #0f1f38 100%)' }}
              >
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
                    <button 
                      onClick={() => setShowOnboarding(false)}
                      className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                    >
                      ✓ I'm done with onboarding
                    </button>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-4 gap-4">
                      {/* Step 1: Complete Profile - HIGHLIGHTED */}
                      <div 
                        onClick={() => onNavigate('settings')}
                        className="rounded-xl border-2 p-4 cursor-pointer hover:shadow-lg transition bg-white group"
                        style={{ borderColor: TEAL, background: '#f0fafb' }}
                      >
                        <div className="text-[10px] font-bold uppercase tracking-wide mb-2 px-2 py-0.5 rounded inline-block text-white" style={{ background: TEAL }}>
                          FIRST
                        </div>
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mb-3 group-hover:scale-110 transition"
                          style={{ background: TEAL }}
                        >
                          1
                        </div>
                        <div className="font-bold text-sm mb-1" style={{ color: NAVY }}>Complete Profile</div>
                        <div className="text-xs text-gray-500">Add your photo & org details</div>
                      </div>

                      {/* Step 2: Constraint Assessment */}
                      <div 
                        onClick={() => onNavigate('constraint-assessment')}
                        className="rounded-xl border-2 border-gray-200 p-4 cursor-pointer hover:shadow-lg hover:border-[#00a0b0] transition bg-white group"
                      >
                        <div className="text-[10px] font-bold uppercase tracking-wide mb-2 px-2 py-0.5 rounded inline-block bg-blue-100 text-blue-700">
                          ASSESS
                        </div>
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mb-3 group-hover:scale-110 transition"
                          style={{ background: NAVY }}
                        >
                          2
                        </div>
                        <div className="font-bold text-sm mb-1" style={{ color: NAVY }}>Constraint Assessment</div>
                        <div className="text-xs text-gray-500">Find your organization's ONE Thing</div>
                      </div>

                      {/* Step 3: Browse Templates */}
                      <div 
                        onClick={() => onNavigate('templates')}
                        className="rounded-xl border-2 border-gray-200 p-4 cursor-pointer hover:shadow-lg hover:border-[#00a0b0] transition bg-white group"
                      >
                        <div className="text-[10px] font-bold uppercase tracking-wide mb-2 px-2 py-0.5 rounded inline-block bg-purple-100 text-purple-700">
                          EXPLORE
                        </div>
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mb-3 group-hover:scale-110 transition"
                          style={{ background: NAVY }}
                        >
                          3
                        </div>
                        <div className="font-bold text-sm mb-1" style={{ color: NAVY }}>Browse Templates</div>
                        <div className="text-xs text-gray-500">147+ ready-to-use resources</div>
                      </div>

                      {/* Step 4: Strategic Plan Check-Up */}
                      <div 
                        onClick={() => onNavigate('strategic-checkup')}
                        className="rounded-xl border-2 border-gray-200 p-4 cursor-pointer hover:shadow-lg hover:border-[#00a0b0] transition bg-white group"
                      >
                        <div className="text-[10px] font-bold uppercase tracking-wide mb-2 px-2 py-0.5 rounded inline-block bg-amber-100 text-amber-700">
                          TRY THIS
                        </div>
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mb-3 group-hover:scale-110 transition"
                          style={{ background: NAVY }}
                        >
                          4
                        </div>
                        <div className="font-bold text-sm mb-1" style={{ color: NAVY }}>Strategic Plan Check-Up</div>
                        <div className="text-xs text-gray-500">Assess your org's health</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tools Grid - Image Cards */}
              <div className="rounded-xl border-2 border-gray-300 overflow-hidden bg-white">
                <div className="px-5 py-3 border-b-2 border-gray-300">
                  <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: NAVY }}>Your Tools</h2>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-3">
                    {tools.map(tool => (
                      <div
                        key={tool.id}
                        onClick={() => onNavigate(tool.route)}
                        className="relative rounded-lg overflow-hidden cursor-pointer group"
                        style={{ height: '100px' }}
                      >
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                          style={{ backgroundImage: `url(${tool.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <div className="text-white font-bold text-sm leading-tight">{tool.name}</div>
                          <div className="text-xs mt-0.5 text-gray-300">{tool.status}</div>
                        </div>
                        {tool.isActive && (
                          <div className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: TEAL }} />
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
                  <a 
                    onClick={() => onNavigate('library')}
                    className="text-xs font-semibold cursor-pointer hover:underline"
                    style={{ color: TEAL }}
                  >
                    See all →
                  </a>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {recommendations.map((rec, index) => (
                      <div
                        key={index}
                        onClick={() => onDownload(rec.title)}
                        className="bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition"
                      >
                        <span className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded mb-2 ${
                          rec.type === 'template' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                        }`}>
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
                  <a 
                    onClick={() => onNavigate('events')}
                    className="text-xs font-semibold cursor-pointer hover:underline"
                    style={{ color: TEAL }}
                  >
                    View calendar →
                  </a>
                </div>
                <div className="p-4 space-y-3">
                  {events.map((event, index) => (
                    <div key={index} className="flex gap-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex flex-col items-center justify-center flex-shrink-0"
                        style={{ background: NAVY }}
                      >
                        <div className="text-lg font-bold text-white leading-none">{event.day}</div>
                        <div className="text-[10px] font-medium text-gray-300">{event.month}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm" style={{ color: NAVY }}>{event.title}</div>
                        <div className="text-xs text-gray-500 mb-1">{event.meta}</div>
                        <span className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded ${event.tagColor}`}>
                          {event.tag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-64 space-y-4 flex-shrink-0">
              {/* Quick Actions */}
              <div className="rounded-xl border-2 border-gray-300 overflow-hidden bg-white">
                <div className="px-4 py-3 border-b-2 border-gray-300">
                  <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: NAVY }}>Quick Actions</h2>
                </div>
                <div className="p-3 space-y-2">
                  <button 
                    onClick={() => onNavigate('getting-started')}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm hover:bg-[#e6f7f9] transition flex items-center gap-3 border border-transparent hover:border-[#00a0b0]"
                  >
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: TEAL }}>🚀</span>
                    <div>
                      <div className="font-semibold" style={{ color: NAVY }}>Getting Started</div>
                      <div className="text-[10px] text-gray-500">Complete your onboarding</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => onNavigate('constraint-assessment')}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm hover:bg-[#e6f7f9] transition flex items-center gap-3 border border-transparent hover:border-[#00a0b0]"
                  >
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: '#8b5cf6' }}>📋</span>
                    <div>
                      <div className="font-semibold" style={{ color: NAVY }}>Constraint Assessment Report</div>
                      <div className="text-[10px] text-gray-500">Find your organization's ONE Thing</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => onNavigate('events')}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm hover:bg-[#e6f7f9] transition flex items-center gap-3 border border-transparent hover:border-[#00a0b0]"
                  >
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: '#f59e0b' }}>📅</span>
                    <div>
                      <div className="font-semibold" style={{ color: NAVY }}>Attend a Webinar</div>
                      <div className="text-[10px] text-gray-500">Join live sessions & workshops</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => onNavigate('tour')}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm hover:bg-[#e6f7f9] transition flex items-center gap-3 border border-transparent hover:border-[#00a0b0]"
                  >
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: NAVY }}>✨</span>
                    <div>
                      <div className="font-semibold" style={{ color: NAVY }}>Get to Know the Edge</div>
                      <div className="text-[10px] text-gray-500">Tour features & resources</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="rounded-xl border-2 border-gray-300 overflow-hidden bg-white">
                <div className="px-4 py-3 border-b-2 border-gray-300">
                  <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: NAVY }}>Recent Activity</h2>
                </div>
                <div className="p-3 space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div 
                        className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: activity.color }}
                      />
                      <div>
                        <div className="text-xs text-gray-700">{activity.text}</div>
                        <div className="text-[10px] text-gray-400">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Report Downloads Tracker */}
              <div 
                className="rounded-xl border-2 overflow-hidden"
                style={{ background: TEAL_LIGHT, borderColor: TEAL }}
              >
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base">📥</span>
                    <span className="font-bold text-sm" style={{ color: NAVY }}>Report Downloads</span>
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

      {/* AI Assistant Chatbot - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setShowAIChat(!showAIChat)}
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-105 transition-transform"
          style={{ background: 'linear-gradient(135deg, #1a365d, #00a0b0)' }}
        >
          <span className="text-2xl">💬</span>
        </button>
        
        {showAIChat && (
          <div className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div 
              className="px-4 py-3 flex items-center gap-3"
              style={{ background: 'linear-gradient(135deg, #1a365d, #0f1f38)' }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: TEAL }}>
                <span className="text-xl">💬</span>
              </div>
              <div className="flex-1">
                <div className="font-bold text-white text-sm">AI Assistant</div>
                <div className="text-xs text-gray-300">Here to help you</div>
              </div>
              <button 
                onClick={() => setShowAIChat(false)} 
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
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
                <input 
                  type="text" 
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  placeholder="Ask me anything..." 
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#00a0b0]"
                />
                <button className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ background: TEAL }}>
                  →
                </button>
              </div>
              <div className="flex gap-1 mt-2 flex-wrap">
                <button className="text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                  Where do I start?
                </button>
                <button className="text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                  Show me templates
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-bold text-lg" style={{ color: NAVY }}>Choose Your Avatar</h3>
              <p className="text-sm text-gray-500">Select an image or upload your own</p>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <div 
                  className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold"
                  style={{ background: NAVY }}
                >
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <p className="text-xs text-gray-500 mt-2">Current</p>
              </div>
              
              <p className="text-sm font-semibold text-gray-700 mb-3">Choose an illustration:</p>
              <div className="grid grid-cols-6 gap-3 mb-4">
                {['👤', '👩‍💼', '👨‍💼', '👩‍🏫', '👨‍🏫', '🧑‍💼'].map((emoji, i) => (
                  <div 
                    key={i}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg cursor-pointer hover:scale-110 transition"
                    style={{ background: `linear-gradient(135deg, ${avatarColors[i]}, ${avatarColors[(i+1) % 6]})` }}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              
              <p className="text-sm font-semibold text-gray-700 mb-3">Or choose a color for your initials:</p>
              <div className="flex gap-2 mb-6">
                {avatarColors.map((color, i) => (
                  <div 
                    key={i}
                    className="w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition"
                    style={{ background: color }}
                  />
                ))}
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#00a0b0] transition cursor-pointer">
                <span className="text-2xl">📷</span>
                <p className="text-sm text-gray-600 mt-1">Upload your own photo</p>
                <p className="text-xs text-gray-400">JPG, PNG up to 2MB</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button 
                onClick={() => setShowAvatarModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowAvatarModal(false)}
                className="px-4 py-2 text-sm font-semibold text-white rounded-lg"
                style={{ background: TEAL }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
