/**
 * THE NONPROFIT EDGE - Dashboard
 * With Product Tour, Chatbot, and Owner Access
 * 
 * Owner email: lyncorbett@thepivotalgroup.com
 */

import React, { useState, useEffect } from 'react';
import ProductTour from './ProductTour';
import AIGuideChatbot from './AIGuideChatbot';

// Brand colors
const NAVY = '#1a365d';
const TEAL = '#00a0b0';
const TEAL_LIGHT = '#e6f7f9';

// Owner email - gets full admin access
const OWNER_EMAIL = 'lyn@thepivotalgroup.com';

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
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  const [showTour, setShowTour] = useState(false);
  const [tourCompleted, setTourCompleted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if user is the owner
  const isOwner = user?.email?.toLowerCase() === OWNER_EMAIL.toLowerCase();

  // Check if tour was already completed
  useEffect(() => {
    const completed = localStorage.getItem('nonprofit-edge-tour-completed');
    if (completed) {
      setTourCompleted(true);
      setShowWelcomeBanner(false);
    }
  }, []);

  // Determine if user is new (no activity)
  const isNewMember = !usage || (
    (usage.tools_used_this_month || 0) === 0 && 
    (usage.downloads_this_month || 0) === 0 &&
    (usage.professor_sessions_this_month || 0) === 0
  );

  // Tool data
  const tools: Tool[] = [
    {
      id: 'board-assessment',
      name: 'Board Assessment',
      status: isNewMember ? 'Ready' : 'In Process',
      statusColor: isNewMember ? '#6b7280' : TEAL,
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=400&fit=crop',
      route: 'board-assessment',
      isActive: !isNewMember
    },
    {
      id: 'strategic-plan',
      name: 'Strategic Plan Check-Up',
      status: isNewMember ? 'Ready' : 'Score: 92',
      statusColor: '#6b7280',
      image: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=800&h=400&fit=crop',
      route: 'strategic-checkup'
    },
    {
      id: 'ceo-evaluation',
      name: 'CEO Evaluation',
      status: isNewMember ? 'Ready' : 'Completed',
      statusColor: isNewMember ? '#6b7280' : '#16a34a',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=400&fit=crop',
      route: 'ceo-evaluation'
    },
    {
      id: 'scenario-planner',
      name: 'Scenario Planner',
      status: 'Ready',
      statusColor: '#6b7280',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
      route: 'scenario-planner'
    },
    {
      id: 'template-vault',
      name: 'Template Vault',
      status: '147 templates',
      statusColor: '#6b7280',
      image: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=800&h=400&fit=crop',
      route: 'library'
    },
    {
      id: 'grant-review',
      name: 'Grant & RFP Review',
      status: 'Ready',
      statusColor: '#6b7280',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=400&fit=crop',
      route: 'grant-review'
    }
  ];

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

  // Sidebar Component (reusable)
  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside className={`
      ${mobile 
        ? 'fixed inset-0 z-50 bg-black/50 lg:hidden' 
        : 'hidden lg:flex w-56 bg-white border-r border-gray-200 fixed h-screen flex-col'
      }
    `}>
      {mobile && (
        <div 
          className="absolute inset-0" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <div className={`
        ${mobile 
          ? 'absolute left-0 top-0 bottom-0 w-64 bg-white flex flex-col' 
          : 'flex flex-col h-full'
        }
      `}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
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
          {mobile && (
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-500 text-xl"
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <a 
            onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer"
            style={{ backgroundColor: TEAL_LIGHT, color: NAVY }}
          >
            Dashboard
          </a>
          
          <a 
            id="sidebar-library"
            onClick={() => { onNavigate('library'); setMobileMenuOpen(false); }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50"
          >
            Resource Library
          </a>

          <a 
            id="sidebar-events"
            onClick={() => { onNavigate('events'); setMobileMenuOpen(false); }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50"
          >
            Events
          </a>

          <a 
            onClick={() => { onNavigate('team'); setMobileMenuOpen(false); }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50"
          >
            Team
          </a>

          <a 
            onClick={() => { onNavigate('reports'); setMobileMenuOpen(false); }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50"
          >
            My Reports
          </a>

          {/* Owner Admin Section */}
          {isOwner && (
            <>
              <div className="pt-4 pb-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3">
                  Admin
                </div>
              </div>
              
              <a 
                onClick={() => { onNavigate('content-manager'); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50"
              >
                Content Manager
              </a>

              <a 
                onClick={() => { onNavigate('owner-dashboard'); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50"
              >
                Platform Admin
              </a>

              <a 
                onClick={() => { onNavigate('enhanced-owner'); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50"
              >
                Owner Dashboard
              </a>

              <a 
                onClick={() => { onNavigate('marketing'); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50"
              >
                Marketing
              </a>

              <a 
                onClick={() => { onNavigate('link-manager'); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50"
              >
                Link Manager
              </a>

              <a 
                onClick={() => { onNavigate('team-access'); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-50"
              >
                Team Access
              </a>
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
              <div className="text-[10px] text-gray-400">
                {isOwner ? 'Owner' : tierInfo.name}
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="mt-3 w-full text-xs text-gray-500 hover:text-gray-700 py-1"
          >
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Product Tour */}
      <ProductTour 
        isOpen={showTour}
        onClose={() => setShowTour(false)}
        onComplete={handleTourComplete}
      />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      {mobileMenuOpen && <Sidebar mobile />}

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-40">
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="text-2xl"
          style={{ color: NAVY }}
        >
          ☰
        </button>
        <span className="font-bold text-sm" style={{ color: NAVY }}>The Nonprofit Edge</span>
        <div className="w-8" />
      </div>

      {/* Main Content */}
      <div className="lg:ml-56 pt-14 lg:pt-0">
        <div className="p-4 lg:p-6 flex flex-col lg:flex-row gap-6">
          {/* Center Content */}
          <div className="flex-1 space-y-6">

            {/* Welcome Banner - For new members */}
            {isNewMember && showWelcomeBanner && !tourCompleted && (
              <div 
                className="rounded-2xl p-5 lg:p-6 text-white relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${TEAL}, #008090)` }}
              >
                <button
                  onClick={() => setShowWelcomeBanner(false)}
                  className="absolute top-3 right-3 text-white/70 hover:text-white text-xl"
                >
                  ✕
                </button>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🎉</span>
                  <h2 className="text-lg lg:text-xl font-bold">Welcome, {firstName}!</h2>
                </div>
                <p className="text-white/90 mb-4 text-sm lg:text-base">
                  You now have access to strategic tools built for nonprofit leaders. 
                  Take a quick tour to get started.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
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
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h2 className="text-sm font-bold" style={{ color: NAVY }}>Recommended First Steps</h2>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { num: 1, title: 'Complete Your Profile', desc: 'Upload your pic and logo', route: 'settings' },
                      { num: 2, title: 'Explore Templates', desc: '147+ ready-to-use docs', route: 'library' },
                      { num: 3, title: 'Strategic Check-Up', desc: 'See how your plan scores', route: 'strategic-checkup', highlight: true },
                      { num: 4, title: 'Scenario Planner', desc: 'Test future strategies', route: 'scenario-planner' }
                    ].map((step) => (
                      <div 
                        key={step.num}
                        onClick={() => onNavigate(step.route)}
                        className={`rounded-xl border-2 p-3 cursor-pointer hover:shadow-lg transition group ${
                          step.highlight ? 'border-[#00a0b0] bg-[#e6f7f9]' : 'border-gray-200 hover:border-[#00a0b0]'
                        }`}
                      >
                        <div 
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold mb-2 group-hover:scale-110 transition"
                          style={{ backgroundColor: step.highlight ? TEAL : NAVY }}
                        >
                          {step.num}
                        </div>
                        <div className="font-bold text-xs mb-1" style={{ color: NAVY }}>{step.title}</div>
                        <div className="text-[10px] text-gray-500">{step.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Today's Insight */}
            <div 
              className="rounded-2xl p-4 lg:p-5 text-white"
              style={{ background: `linear-gradient(135deg, ${NAVY}, #122443)` }}
            >
              <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                TODAY'S INSIGHT
              </div>
              <p className="text-sm lg:text-base font-semibold leading-relaxed mb-2">
                "The board's job isn't to run the organization. It's to make sure the organization is well-run."
              </p>
              <p className="text-xs text-gray-400">
                — "Governance as Leadership" by Chait, Ryan & Taylor
              </p>
            </div>

            {/* Your Tools */}
            <div id="tools-section" className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-sm font-bold" style={{ color: NAVY }}>Your Tools</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                  {tools.map((tool) => (
                    <div 
                      key={tool.id}
                      onClick={() => onNavigate(tool.route)}
                      className={`rounded-xl border-2 cursor-pointer hover:shadow-lg transition-all overflow-hidden group ${
                        tool.isActive ? 'border-[#00a0b0]' : 'border-gray-200 hover:border-[#00a0b0]'
                      }`}
                    >
                      <div className="h-24 lg:h-32 overflow-hidden bg-gray-100">
                        <img 
                          src={tool.image} 
                          alt={tool.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      <div 
                        className="p-2 lg:p-3 text-center"
                        style={{ backgroundColor: tool.isActive ? TEAL_LIGHT : '#fff' }}
                      >
                        <div className="font-semibold text-xs lg:text-sm" style={{ color: NAVY }}>
                          {tool.name}
                        </div>
                        <div 
                          className="text-[10px] lg:text-xs mt-1 font-medium"
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
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-sm font-bold" style={{ color: NAVY }}>Recommended For You</h2>
                  <a 
                    onClick={() => onNavigate('library')}
                    className="text-xs font-semibold cursor-pointer hover:underline"
                    style={{ color: TEAL }}
                  >
                    See all →
                  </a>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div 
                      onClick={() => onNavigate('library')}
                      className="bg-gray-50 rounded-xl p-3 cursor-pointer hover:bg-gray-100 transition"
                    >
                      <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded mb-2 bg-blue-100 text-blue-700">
                        TEMPLATE
                      </span>
                      <div className="font-bold text-sm mb-1" style={{ color: NAVY }}>
                        Board Member Agreement
                      </div>
                      <div className="text-xs text-gray-500">
                        Clarify roles and commitments
                      </div>
                    </div>
                    <div 
                      onClick={() => onNavigate('library')}
                      className="bg-gray-50 rounded-xl p-3 cursor-pointer hover:bg-gray-100 transition"
                    >
                      <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded mb-2 bg-amber-100 text-amber-700">
                        BOOK SUMMARY
                      </span>
                      <div className="font-bold text-sm mb-1" style={{ color: NAVY }}>
                        Governance as Leadership
                      </div>
                      <div className="text-xs text-gray-500">
                        Reframing board work · 8 min
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Moves below on mobile */}
          <div className="w-full lg:w-72 space-y-6">
            {/* Ask the Professor */}
            <div 
              id="professor-card"
              className="rounded-2xl p-4 lg:p-5 text-white cursor-pointer hover:shadow-xl transition"
              style={{ background: `linear-gradient(135deg, ${TEAL}, #007d8a)` }}
              onClick={onStartProfessor}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🎓</span>
                <span className="font-bold">Ask the Professor</span>
              </div>
              <p className="text-sm text-white/80 mb-3">
                Get expert guidance on strategy, governance, and leadership.
              </p>
              <div className="text-xs bg-white/20 rounded-lg px-3 py-2 text-center">
                {usage?.professor_sessions_this_month || 0} / {organization?.tier === 'essential' ? '10' : '∞'} sessions
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-sm font-bold" style={{ color: NAVY }}>Upcoming Events</h3>
                <a 
                  onClick={() => onNavigate('events')}
                  className="text-xs font-semibold cursor-pointer hover:underline"
                  style={{ color: TEAL }}
                >
                  See all →
                </a>
              </div>
              <div className="p-3 space-y-2">
                {[
                  { month: 'JAN', day: '15', title: 'Board Engagement Strategies', time: '12:00 PM PT', color: NAVY },
                  { month: 'JAN', day: '22', title: 'Strategic Planning Workshop', time: '10:00 AM PT', color: TEAL }
                ].map((event, i) => (
                  <div key={i} className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div 
                      className="w-11 h-11 rounded-lg flex flex-col items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: event.color }}
                    >
                      <span className="text-[10px]">{event.month}</span>
                      <span className="text-base">{event.day}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate" style={{ color: NAVY }}>
                        {event.title}
                      </div>
                      <div className="text-xs text-gray-500">{event.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
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

      {/* AI Chatbot */}
      <AIGuideChatbot 
        user={user}
        organization={organization}
        onNavigate={onNavigate}
      />
    </div>
  );
};

export default Dashboard;
