import React from 'react';
import { useNavigate } from 'react-router-dom';

interface DashboardMobileProps {
  userName: string;
  focusArea?: string;
  recentActivity?: Array<{
    title: string;
    date: string;
    type: 'board' | 'strategic' | 'grant' | 'scenario';
  }>;
  remainingDownloads?: number;
  totalDownloads?: number;
}

const DashboardMobile: React.FC<DashboardMobileProps> = ({
  userName,
  focusArea = 'nonprofit strategy',
  recentActivity = [],
  remainingDownloads = 18,
  totalDownloads = 25,
}) => {
  const navigate = useNavigate();

  const tools = [
    { id: 'board', name: 'Board Assessment', icon: '📋', route: '/tools/board-assessment' },
    { id: 'strategic', name: 'Plan Check-Up', icon: '🎯', route: '/tools/strategic-plan' },
    { id: 'grant', name: 'Grant Review', icon: '📝', route: '/tools/grant-review' },
    { id: 'ceo', name: 'CEO Evaluation', icon: '👤', route: '/tools/ceo-evaluation' },
    { id: 'scenario', name: 'Scenario Planner', icon: '🔄', route: '/tools/scenario-planner' },
    { id: 'templates', name: 'Templates', icon: '📁', route: '/templates' },
  ];

  const quickActions = [
    { name: 'Member Resources', icon: '📂', route: '/resources' },
    { name: 'My Leadership Profile', icon: '👤', route: '/leadership-profile' },
    { name: 'Our Constraint Report', icon: '📊', route: '/constraint-report' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#003d5c] to-[#008B9A] px-4 pt-12 pb-6 safe-area-top">
        <div className="flex items-center justify-between mb-4">
          <img src="/logo-white.png" alt="The Nonprofit Edge" className="h-8" />
          <button className="text-white/80 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <h1 className="text-white text-2xl font-bold">Hey, {userName}!</h1>
        <p className="text-white/70 text-sm mt-1">Focus: {focusArea}</p>
      </div>

      {/* Ask the Professor Card */}
      <div className="px-4 -mt-4">
        <button
          onClick={() => navigate('/ask-professor')}
          className="w-full bg-[#003d5c] rounded-xl p-4 text-left shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎓</span>
              <div>
                <h2 className="text-white font-semibold">Ask the Professor</h2>
                <p className="text-white/60 text-sm">Your 24/7 advisor</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</h3>
        <div className="space-y-2">
          {quickActions.map((action) => (
            <button
              key={action.name}
              onClick={() => navigate(action.route)}
              className="w-full flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm"
            >
              <span className="text-lg">{action.icon}</span>
              <span className="text-gray-800 text-sm font-medium">{action.name}</span>
              <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="px-4 mt-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Recent Activity</h3>
          <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
            {recentActivity.map((activity, index) => (
              <div key={index} className="p-3 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'board' ? 'bg-blue-500' :
                  activity.type === 'strategic' ? 'bg-yellow-500' :
                  activity.type === 'grant' ? 'bg-green-500' : 'bg-purple-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tools Grid */}
      <div className="px-4 mt-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Tools</h3>
        <div className="grid grid-cols-3 gap-3">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => navigate(tool.route)}
              className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center gap-2"
            >
              <span className="text-2xl">{tool.icon}</span>
              <span className="text-xs text-gray-700 text-center font-medium leading-tight">{tool.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Downloads Counter */}
      <div className="px-4 mt-6">
        <div className="bg-[#008B9A] rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-white/80 text-xs">Remaining Downloads</p>
            <p className="text-white text-2xl font-bold">{remainingDownloads} <span className="text-white/60 text-sm font-normal">of {totalDownloads}</span></p>
          </div>
          <button className="bg-white/20 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
            Upgrade
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 safe-area-bottom">
        <div className="flex justify-around">
          <button className="flex flex-col items-center gap-1 text-[#008B9A]">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span className="text-xs font-medium">Home</span>
          </button>
          <button 
            onClick={() => navigate('/ask-professor')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <span className="text-2xl">🎓</span>
            <span className="text-xs">Ask</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            <span className="text-xs">Tools</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardMobile;
