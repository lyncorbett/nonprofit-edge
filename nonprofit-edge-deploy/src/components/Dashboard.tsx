/**
 * THE NONPROFIT EDGE - Dashboard
 * With Product Tour and New Member Experience
 * 
 * Roles:
 *   owner  → Sees: Content Manager + Platform Admin + Owner Dashboard + Marketing + Links
 *   admin  → Sees: Content Manager only
 *   member → Sees: Neither (regular dashboard only)
 */

import React, { useState, useEffect } from 'react';
import ProductTour from './ProductTour';

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
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  const [showTour, setShowTour] = useState(false);
  const [tourCompleted, setTourCompleted] = useState(false);

  // Check if tour was already completed (stored in localStorage)
  useEffect(() => {
    const completed = localStorage.getItem('nonprofit-edge-tour-completed');
    if (completed) {
      setTourCompleted(true);
      setShowWelcomeBanner(false);
    }
  }, []);

  // Determine if user is new (no tools used, no downloads)
  const isNewMember = !usage || (
    (usage.tools_used_this_month || 0) === 0 && 
    (usage.downloads_this_month || 0) === 0 &&
    (usage.professor_sessions_this_month || 0) === 0
  );

  // Tool data with carefully selected professional images
  const tools: Tool[] = [
    {
      id: 'board-assessment',
      name: 'Board Assessment',
      status: isNewMember ? 'Ready' : 'In Process',
      statusColor: isNewMember ? '#6b7280' : TEAL,
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=600&fit=crop',
      route: 'board-assessment',
      isActive: !isNewMember
    },
    {
      id: 'strategic-plan',
      name: 'Strategic Plan Check-Up',
      status: isNewMember ? 'Ready' : 'Score: 92',
      statusColor: '#6b7280',
      image: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=1200&h=600&fit=crop',
      route: 'strategic-checkup'
    },
    {
      id: 'ceo-evaluation',
      name: 'CEO Evaluation',
      status: isNewMember ? 'Ready' : 'Completed',
      statusColor: isNewMember ? '#6b7280' : '#16a34a',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&h=600&fit=crop',
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
      id: 'template-vault',
      name: 'Template Vault',
      status: '147 templates',
      statusColor: '#6b7280',
      image: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=1200&h=600&fit=crop',
      route: 'templates'
    },
    {
      id: 'grant-review',
      name: 'Grant & RFP Review',
      status: 'Ready',
      statusColor: '#6b7280',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=600&fit=crop',
      route: 'grant-review'
    }
  ];

  // Check admin access
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!supabase || !user?.email) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('role')
          .eq('email', user.email)
          .single();

        if (data && !error) {
          setAdminAccess({
            isAdmin: data.role === 'admin' || data.role === 'owner',
            isOwner: data.role === 'owner',
            role: data.role
          });
        }
      } catch (err) {
        console.log('Not an admin user');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [supabase, user?.email]);

  // Handle tour completion
  const handleTourComplete = () => {
    setShowTour(false);
    setTourCompleted(true);
    setShowWelcomeBanner(false);
    localStorage.setItem('nonprofit-edge-tour-completed', 'true');
  };

  // Get tier info
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Product Tour */}
      <ProductTour 
        isOpen={showTour}
        onClose={() => setShowTour(false)}
        onComplete={handleTourComplete}
      />

      {/* Sidebar */}
      <aside className="w-52 bg-white border-r border-gray-200 fixed h-screen flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: NAVY }}
            >
              NE
            </div>
            <span className="font-bold text-sm" style={{ color: NAVY }}>
              The Nonprofit Edge
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <a 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer"
            style={{ backgroundColor: TEAL_LIGHT, color: NAVY }}
          >
            Dashboard
          </a>
          
          <a 
            id="sidebar-library"
            onClick={() => onNavigate('library')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50"
          >
            Resource Library
          </a>

          <a 
            id="sidebar-events"
            onClick={() => onNavigate('events')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50"
          >
            Events
          </a>

          <a 
            onClick={() => onNavigate('team')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50"
          >
            Team
          </a>

          <a 
            onClick={() => onNavigate('reports')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50"
          >
            My Reports
          </a>

          {/* Admin Section */}
          {(adminAccess.isAdmin || adminAccess.isOwner) && (
            <>
              <div className="pt-4 pb-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3">
                  Admin
                </div>
              </div>
              
              <a 
                onClick={() => onNavigate('content-manager')}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50"
              >
                Content Manager
              </a>

              {adminAccess.isOwner && (
                <>
                  <a 
                    onClick={() => onNavigate('owner-dashboard')}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50"
                  >
                    Platform Admin
                  </a>
                  <a 
                    onClick={() => onNavigate('enhanced-owner')}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50"
                  >
                    Owner Dashboard
                  </a>
                  <a 
                    onClick={() => onNavigate('marketing')}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50"
                  >
                    Marketing
                  </a>
                  <a 
                    onClick={() => onNavigate('link-manager')}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50"
                  >
                    Link Manager
                  </a>
                  <a 
                    onClick={() => onNavigate('team-access')}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50"
                  >
                    Team Access
                  </a>
                </>
              )}
            </>
          )}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div 
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: TEAL }}
            >
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate" style={{ color: NAVY }}>
                {user?.full_name || 'User'}
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

            {/* Welcome Banner - For new members, with Tour button */}
            {isNewMember && showWelcomeBanner && !tourCompleted && (
              <div 
                className="rounded-2xl p-6 text-white relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${TEAL}, #008090)` }}
              >
                <button
                  onClick={() => setShowWelcomeBanner(false)}
                  className="absolute top-4 right-4 text-white/70 hover:text-white text-xl"
                >
                  ✕
                </button>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🎉</span>
                  <h2 className="text-xl font-bold">Welcome to The Nonprofit Edge, {firstName}!</h2>
                </div>
                <p className="text-white/90 mb-4 max-w-xl">
                  You now have access to strategic tools built specifically for nonprofit leaders like you. 
                  Take a quick 30-second tour to get familiar with the platform.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowTour(true)}
                    className="px-4 py-2 bg-white rounded-lg font-semibold text-sm hover:bg-gray-100 transition"
                    style={{ color: NAVY }}
                  >
                    Take a Quick Tour (30 sec)
                  </button>
                  <button
                    onClick={() => setShowWelcomeBanner(false)}
                    className="px-4 py-2 bg-white/20 rounded-lg font-semibold text-sm text-white hover:bg-white/30 transition"
                  >
                    I'll explore on my own
                  </button>
                </div>
              </div>
            )}

            {/* Recommended First Steps - For new members */}
            {isNewMember && (
              <div className="bg-white rounded-2xl border border-gray-300 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-300">
                  <h2 className="text-sm font-bold" style={{ color: NAVY }}>Recommended First Steps</h2>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-4 gap-4">
                    {/* Step 1: Complete Profile */}
                    <div 
                      onClick={() => onNavigate('settings')}
                      className="rounded-xl border-2 border-gray-200 p-4 cursor-pointer hover:shadow-lg hover:border-[#00a0b0] transition bg-white group"
                    >
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mb-3 group-hover:scale-110 transition"
                        style={{ backgroundColor: NAVY }}
                      >
                        1
                      </div>
                      <div className="font-bold text-sm mb-1" style={{ color: NAVY }}>
                        Complete Your Profile
                      </div>
                      <div className="text-xs text-gray-500">
                        Upload your pic and agency logo
                      </div>
                    </div>

                    {/* Step 2: Template Vault */}
                    <div 
                      onClick={() => onNavigate('templates')}
                      className="rounded-xl border-2 border-gray-200 p-4 cursor-pointer hover:shadow-lg hover:border-[#00a0b0] transition bg-white group"
                    >
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mb-3 group-hover:scale-110 transition"
                        style={{ backgroundColor: NAVY }}
                      >
                        2
                      </div>
                      <div className="font-bold text-sm mb-1" style={{ color: NAVY }}>
                        Explore the Template Vault
                      </div>
                      <div className="text-xs text-gray-500">
                        147+ ready-to-use templates
                      </div>
                    </div>

                    {/* Step 3: Strategic Plan Check-Up (Highlighted) */}
                    <div 
                      onClick={() => onNavigate('strategic-checkup')}
                      className="rounded-xl border-2 p-4 cursor-pointer hover:shadow-lg transition group"
                      style={{ borderColor: TEAL, backgroundColor: TEAL_LIGHT }}
                    >
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mb-3 group-hover:scale-110 transition"
                        style={{ backgroundColor: TEAL }}
                      >
                        3
                      </div>
                      <div className="font-bold text-sm mb-1" style={{ color: NAVY }}>
                        Run Your Strategic Plan Check-Up
                      </div>
                      <div className="text-xs text-gray-500">
                        See how your plan scores
                      </div>
                    </div>

                    {/* Step 4: Scenario Planner */}
                    <div 
                      onClick={() => onNavigate('scenario-planner')}
                      className="rounded-xl border-2 border-gray-200 p-4 cursor-pointer hover:shadow-lg hover:border-[#00a0b0] transition bg-white group"
                    >
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mb-3 group-hover:scale-110 transition"
                        style={{ backgroundColor: NAVY }}
                      >
                        4
                      </div>
                      <div className="font-bold text-sm mb-1" style={{ color: NAVY }}>
                        Test Your Future Strategy
                      </div>
                      <div className="text-xs text-gray-500">
                        With our Scenario Planner
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
            <div id="tools-section" className="bg-white rounded-2xl border border-gray-300 overflow-hidden">
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
                      <div className="h-40 overflow-hidden relative bg-gray-100">
                        <img 
                          src={tool.image} 
                          alt={tool.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
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

            {/* Recommended For You - For returning members */}
            {!isNewMember && (
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
                    <div 
                      onClick={() => onNavigate('library')}
                      className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition"
                    >
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
                    <div 
                      onClick={() => onNavigate('library')}
                      className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition"
                    >
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
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-72 space-y-6">
            {/* Ask the Professor Card */}
            <div 
              id="professor-card"
              className="rounded-2xl p-5 text-white cursor-pointer hover:shadow-xl transition"
              style={{ background: `linear-gradient(135deg, ${TEAL}, #007d8a)` }}
              onClick={onStartProfessor}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🎓</span>
                <span className="font-bold">Ask the Professor</span>
              </div>
              <p className="text-sm text-white/80 mb-3">
                Need a thinking partner? Get expert guidance on strategy, governance, and leadership.
              </p>
              <div className="text-xs bg-white/20 rounded-lg px-3 py-2 text-center">
                {usage?.professor_sessions_this_month || 0} / {organization?.tier === 'essential' ? '10' : '∞'} sessions this month
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl border border-gray-300 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-300 flex justify-between items-center">
                <h3 className="text-sm font-bold" style={{ color: NAVY }}>Upcoming Events</h3>
                <a 
                  onClick={() => onNavigate('events')}
                  className="text-xs font-semibold cursor-pointer hover:underline"
                  style={{ color: TEAL }}
                >
                  See all →
                </a>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div 
                    className="w-12 h-12 rounded-lg flex flex-col items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: NAVY }}
                  >
                    <span>JAN</span>
                    <span className="text-lg">15</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold" style={{ color: NAVY }}>
                      Board Engagement Strategies
                    </div>
                    <div className="text-xs text-gray-500">
                      12:00 PM PT · Live Webinar
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div 
                    className="w-12 h-12 rounded-lg flex flex-col items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: TEAL }}
                  >
                    <span>JAN</span>
                    <span className="text-lg">22</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold" style={{ color: NAVY }}>
                      Strategic Planning Workshop
                    </div>
                    <div className="text-xs text-gray-500">
                      10:00 AM PT · Interactive
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl border border-gray-300 p-4">
              <h3 className="text-sm font-bold mb-3" style={{ color: NAVY }}>This Month</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Tools Used</span>
                  <span className="text-sm font-bold" style={{ color: NAVY }}>
                    {usage?.tools_used_this_month || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Downloads</span>
                  <span className="text-sm font-bold" style={{ color: NAVY }}>
                    {usage?.downloads_this_month || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Professor Sessions</span>
                  <span className="text-sm font-bold" style={{ color: NAVY }}>
                    {usage?.professor_sessions_this_month || 0}
                  </span>
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
