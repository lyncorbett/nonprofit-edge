
/**
 * THE NONPROFIT EDGE - Dashboard
 * Updated with Role-Based Access System
 * 
 * Roles:
 *   owner  → Sees: Content Manager + Owner Dashboard
 *   admin  → Sees: Content Manager only
 *   member → Sees: Neither (regular dashboard only)
 */

import React, { useState, useEffect } from 'react';

// Brand colors
const NAVY = '#0D2C54';
const TEAL = '#0097A9';

interface DashboardProps {
  user: any;
  organization: any;
  usage: any;
  teamCount: number;
  onNavigate: (page: string) => void;
  onDownload: (resourceId: string) => void;
  onStartProfessor: () => void;
  onLogout: () => void;
  supabase?: any; // Add supabase client for role checking
}

interface AdminAccess {
  isAdmin: boolean;
  isOwner: boolean;
  role: string | null;
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

  // Check admin access on mount
  useEffect(() => {
    checkAdminAccess();
  }, [user.email]);

  const checkAdminAccess = async () => {
    if (!supabase) {
      // Fallback: check by email if supabase not passed
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
      // Check platform_admins table
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

  // Get tier display info
  const getTierInfo = () => {
    const tier = organization?.subscription_tier || 'essential';
    const tiers: Record<string, { name: string; color: string; bgColor: string }> = {
      essential: { name: 'Essential', color: NAVY, bgColor: '#E8F4F8' },
      professional: { name: 'Professional', color: TEAL, bgColor: '#E0F7FA' },
      premium: { name: 'Premium', color: '#7C3AED', bgColor: '#F3E8FF' }
    };
    return tiers[tier] || tiers.essential;
  };

  const tierInfo = getTierInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header 
        className="bg-white border-b border-gray-200 px-6 py-4"
        style={{ borderBottomColor: '#E5E7EB' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="/logo.png" 
              alt="The Nonprofit Edge" 
              className="h-10"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <h1 className="text-lg font-bold" style={{ color: NAVY }}>
                {organization?.name || 'Your Organization'}
              </h1>
              <span 
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ 
                  backgroundColor: tierInfo.bgColor,
                  color: tierInfo.color
                }}
              >
                {tierInfo.name} Member
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user.full_name || user.email}
            </span>
            <button
              onClick={onLogout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <nav className="py-4">
            {/* Main Navigation */}
            <div className="px-4 mb-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Main
              </span>
            </div>
            
            <a 
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-3 px-4 py-2.5 cursor-pointer bg-gray-50 border-r-2"
              style={{ borderRightColor: TEAL }}
            >
              <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-sm">
                📊
              </span>
              <span className="flex-1 text-sm font-medium" style={{ color: NAVY }}>
                Dashboard
              </span>
            </a>

            <a 
              onClick={() => onNavigate('library')}
              className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-gray-600 hover:bg-gray-50 transition-all"
            >
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-sm">
                📚
              </span>
              <span className="flex-1 text-sm font-medium">Resource Library</span>
            </a>

            {/* Tools Section */}
            <div className="px-4 mt-6 mb-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Tools
              </span>
            </div>

            <a 
              onClick={() => onNavigate('board-assessment')}
              className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-gray-600 hover:bg-gray-50 transition-all"
            >
              <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-sm">
                📋
              </span>
              <span className="flex-1 text-sm font-medium">Board Assessment</span>
            </a>

            <a 
              onClick={() => onNavigate('strategic-checkup')}
              className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-gray-600 hover:bg-gray-50 transition-all"
            >
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-sm">
                🎯
              </span>
              <span className="flex-1 text-sm font-medium">Strategic Check-Up</span>
            </a>

            <a 
              onClick={() => onNavigate('scenario-planner')}
              className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-gray-600 hover:bg-gray-50 transition-all"
            >
              <span className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-sm">
                🔄
              </span>
              <span className="flex-1 text-sm font-medium">Scenario Planner</span>
            </a>

            <a 
              onClick={() => onNavigate('grant-review')}
              className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-gray-600 hover:bg-gray-50 transition-all"
            >
              <span className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center text-sm">
                📝
              </span>
              <span className="flex-1 text-sm font-medium">Grant/RFP Review</span>
            </a>

            {/* AI Coach */}
            <div className="px-4 mt-6 mb-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                AI Support
              </span>
            </div>

            <a 
              onClick={onStartProfessor}
              className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-gray-600 hover:bg-gray-50 transition-all"
            >
              <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-sm">
                🎓
              </span>
              <span className="flex-1 text-sm font-medium">Ask the Professor</span>
            </a>

            {/* Team Management */}
            {(organization?.subscription_tier === 'professional' || 
              organization?.subscription_tier === 'premium') && (
              <>
                <div className="px-4 mt-6 mb-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Team
                  </span>
                </div>
                <a 
                  onClick={() => onNavigate('team')}
                  className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-gray-600 hover:bg-gray-50 transition-all"
                >
                  <span className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center text-sm">
                    👥
                  </span>
                  <span className="flex-1 text-sm font-medium">Manage Team</span>
                  <span className="text-xs text-gray-400">{teamCount}</span>
                </a>
              </>
            )}

            {/* ========================================== */}
            {/* ADMIN SECTION - Role-Based Access         */}
            {/* ========================================== */}
            {!loading && adminAccess.isAdmin && (
              <>
                <div className="px-4 mt-6 mb-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Admin
                  </span>
                </div>

                {/* Content Manager - visible to all admins (owner + admin roles) */}
                <a 
                  onClick={() => onNavigate('content-manager')}
                  className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-gray-600 hover:bg-gray-50 transition-all"
                >
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-sm">
                    📁
                  </span>
                  <span className="flex-1 text-sm font-medium text-blue-600">
                    Content Manager
                  </span>
                </a>

                {/* Platform Admin - visible to all admins */}
                <a 
                  onClick={() => onNavigate('admin')}
                  className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-gray-600 hover:bg-gray-50 transition-all"
                >
                  <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-sm">
                    ⚙️
                  </span>
                  <span className="flex-1 text-sm font-medium text-orange-600">
                    Platform Admin
                  </span>
                </a>

                {/* Owner Dashboard - ONLY visible to owner role */}
                {adminAccess.isOwner && (
                  <a 
                    onClick={() => onNavigate('owner-dashboard')}
                    className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    <span className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-sm">
                      💰
                    </span>
                    <span className="flex-1 text-sm font-medium text-emerald-600">
                      Owner Dashboard
                    </span>
                  </a>
                )}

                {/* Team Access Manager - ONLY visible to owner */}
                {adminAccess.isOwner && (
                  <a 
                    onClick={() => onNavigate('team-access')}
                    className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    <span className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center text-sm">
                      🔐
                    </span>
                    <span className="flex-1 text-sm font-medium text-violet-600">
                      Manage Admin Access
                    </span>
                  </a>
                )}

                {/* Role indicator */}
                <div className="px-4 py-2 mt-2">
                  <span 
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: adminAccess.isOwner ? '#DCFCE7' : '#DBEAFE',
                      color: adminAccess.isOwner ? '#166534' : '#1E40AF'
                    }}
                  >
                    {adminAccess.isOwner ? '👑 Owner' : '🛡️ Admin'}
                  </span>
                </div>
              </>
            )}
          </nav>

          {/* Upgrade CTA (for non-premium) */}
          {organization?.subscription_tier !== 'premium' && (
            <div className="absolute bottom-4 left-4 right-4">
              <div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: '#F0F9FF' }}
              >
                <p className="text-sm font-medium" style={{ color: NAVY }}>
                  Unlock more features
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Upgrade to access advanced tools and team features.
                </p>
                <a 
                  href="#upgrade"
                  className="inline-block mt-3 text-sm font-medium"
                  style={{ color: TEAL }}
                >
                  View Plans →
                </a>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold" style={{ color: NAVY }}>
              Welcome back, {user.full_name?.split(' ')[0] || 'there'}!
            </h2>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your organization today.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">📥</span>
                <span className="text-xs text-gray-400">This month</span>
              </div>
              <p className="text-3xl font-bold" style={{ color: NAVY }}>
                {usage?.downloads_this_month || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">Downloads</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">🎓</span>
                <span className="text-xs text-gray-400">This month</span>
              </div>
              <p className="text-3xl font-bold" style={{ color: NAVY }}>
                {usage?.professor_sessions_this_month || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">AI Sessions</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">🛠️</span>
                <span className="text-xs text-gray-400">This month</span>
              </div>
              <p className="text-3xl font-bold" style={{ color: NAVY }}>
                {usage?.tools_used_this_month || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">Tools Used</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">👥</span>
                <span className="text-xs text-gray-400">Active</span>
              </div>
              <p className="text-3xl font-bold" style={{ color: NAVY }}>
                {teamCount}
              </p>
              <p className="text-sm text-gray-500 mt-1">Team Members</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4" style={{ color: NAVY }}>
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => onNavigate('board-assessment')}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-all"
              >
                <span className="text-3xl mb-2">📋</span>
                <span className="text-sm font-medium text-gray-700">
                  Board Assessment
                </span>
              </button>
              <button
                onClick={() => onNavigate('strategic-checkup')}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-all"
              >
                <span className="text-3xl mb-2">🎯</span>
                <span className="text-sm font-medium text-gray-700">
                  Strategic Check-Up
                </span>
              </button>
              <button
                onClick={onStartProfessor}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-all"
              >
                <span className="text-3xl mb-2">🎓</span>
                <span className="text-sm font-medium text-gray-700">
                  Ask the Professor
                </span>
              </button>
              <button
                onClick={() => onNavigate('library')}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-all"
              >
                <span className="text-3xl mb-2">📚</span>
                <span className="text-sm font-medium text-gray-700">
                  Browse Library
                </span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
