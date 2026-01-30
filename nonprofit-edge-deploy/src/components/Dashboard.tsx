'use client';

import React from 'react';
import { 
  Folder, Download, Star, Settings, ChevronRight, ChevronDown,
  Lightbulb, MessageSquare, CheckCircle, LogOut
} from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* LEFT SIDEBAR */}
      <aside className="w-[280px] bg-white border-r border-slate-200 p-6 flex flex-col fixed top-0 left-0 h-screen overflow-y-auto">
        {/* Logo */}
        <div className="mb-8">
          <img src="/logo.png" alt="The Nonprofit Edge" className="w-[220px] h-auto" />
        </div>

        {/* Quick Actions */}
        <nav className="mb-6">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-3 pl-3">
            Quick Actions
          </div>
          <a href="/member-resources" className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-[#0D2C54] text-sm font-medium">
            <Folder className="w-5 h-5" />
            Member Resources
          </a>
          <a href="/my-downloads" className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-[#0D2C54] text-sm font-medium">
            <Download className="w-5 h-5" />
            My Downloads
          </a>
          <a href="/favorites" className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-[#0D2C54] text-sm font-medium">
            <Star className="w-5 h-5" />
            Saved Favorites
          </a>
        </nav>

        {/* Recent Activity */}
        <div className="mb-6">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-3 pl-3">
            Recent Activity
          </div>
          <div className="flex items-start gap-3 px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-[#0097A9] mt-1.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-slate-700">Board Assessment started</div>
              <div className="text-xs text-slate-400">Today</div>
            </div>
          </div>
          <div className="flex items-start gap-3 px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-[#D4A84B] mt-1.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-slate-700">Strategic Plan completed</div>
              <div className="text-xs text-slate-400">3 days ago</div>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mb-6">
          <div className="flex justify-between items-center px-3 mb-3">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Upcoming Events
            </span>
            <a href="/events" className="text-xs text-[#0097A9] font-medium">View All</a>
          </div>
          <div className="flex items-center gap-3 px-3 py-3 border-b border-slate-100">
            <div className="bg-[#0D2C54] rounded-lg px-3 py-2 text-center min-w-[48px]">
              <div className="text-base font-bold text-white">21</div>
              <div className="text-[10px] text-white/80 uppercase">Jan</div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-700">Live Q&A Session</div>
              <div className="text-xs text-slate-400">2:00 PM EST</div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3 py-3">
            <div className="bg-[#0D2C54] rounded-lg px-3 py-2 text-center min-w-[48px]">
              <div className="text-base font-bold text-white">24</div>
              <div className="text-[10px] text-white/80 uppercase">Feb</div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-700">🚀 Platform Launch</div>
              <div className="text-xs text-slate-400">12:00 PM EST</div>
            </div>
          </div>
        </div>

        {/* Downloads Counter */}
        <div className="bg-gradient-to-br from-[#0097A9] to-[#00b4cc] rounded-xl p-4 text-white mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[13px] font-semibold">Remaining Downloads</span>
            <span className="text-xs font-semibold">18 of 25</span>
          </div>
          <div className="h-1.5 bg-white/30 rounded-full mb-3">
            <div className="w-[72%] h-full bg-white rounded-full" />
          </div>
          <span className="inline-block text-[10px] font-bold bg-white text-[#0D2C54] px-2.5 py-1 rounded tracking-wide">
            PROFESSIONAL
          </span>
        </div>

        {/* Settings */}
        <a href="/settings" className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-[#0D2C54] text-sm font-medium">
          <Settings className="w-5 h-5" />
          Settings
        </a>

        {/* User Profile */}
        <div className="mt-auto pt-4 border-t border-slate-200">
          <div className="flex items-center gap-3 py-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0D2C54] to-[#164677] text-white flex items-center justify-center font-semibold text-base">
              L
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-700">Lyn</div>
              <div className="text-xs text-slate-400">The Pivotal Group</div>
            </div>
          </div>
          <button className="text-[13px] text-slate-400 hover:text-red-500 px-3 py-2 w-full text-left flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-[280px] p-8">
        <div className="max-w-[1000px]">
          {/* Welcome */}
          <div className="mb-7">
            <h1 className="text-[28px] font-bold text-[#0D2C54] mb-1">Good morning, Lyn</h1>
            <p className="text-slate-500 text-[15px]">
              You chose <strong className="text-[#0097A9] font-semibold">Board Engagement</strong> as your focus area
              <button className="ml-3 text-[13px] text-slate-400 underline underline-offset-2">
                Change focus
              </button>
            </p>
          </div>

          {/* Top Cards */}
          <div className="grid grid-cols-2 gap-5 mb-8">
            {/* Today's Insight */}
            <div className="bg-gradient-to-br from-[#0097A9] to-[#00b4cc] rounded-2xl p-7 text-white flex flex-col">
              <div className="text-[11px] uppercase tracking-widest opacity-85 mb-4 font-semibold flex items-center gap-2">
                <Lightbulb className="w-3.5 h-3.5" />
                Today's Insight
              </div>
              <p className="text-base leading-relaxed flex-1 mb-6">
                The most effective boards don't just govern—they champion. When was the last time you asked your board members what excites them about your mission?
              </p>
              <button className="flex items-center justify-between gap-2 bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white text-sm font-medium w-full">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Make a Commitment
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Ask the Professor */}
            <a href="/ask-the-professor" className="bg-gradient-to-br from-[#0D2C54] to-[#164677] rounded-2xl p-7 text-white flex flex-col hover:-translate-y-0.5 hover:shadow-xl transition-all cursor-pointer">
              <div className="text-[11px] uppercase tracking-widest opacity-85 mb-4 font-semibold flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-[#0097A9]" />
                Ask the Professor
              </div>
              <p className="text-base leading-relaxed flex-1 mb-6">
                Your personal nonprofit leadership advisor, available 24/7. Get strategic guidance tailored to your challenges.
              </p>
              <div className="flex items-center justify-between gap-2 bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-sm font-medium">
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Ask me anything
                </span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </a>
          </div>

          {/* Your Tools */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-[#0D2C54]">Your Tools</h2>
          </div>

          <div className="grid grid-cols-3 gap-5 mb-8">
            {[
              { name: 'Board Assessment', href: '/tools/board-assessment', img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop' },
              { name: 'Strategic Plan Check-Up', href: '/tools/strategic-plan', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop' },
              { name: 'Grant Review', href: '/tools/grant-review', img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop' },
              { name: 'CEO Evaluation', href: '/tools/ceo-evaluation', img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop' },
              { name: 'Scenario Planner', href: '/tools/scenario-planner', img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop' },
              { name: 'Constraint Assessment', href: '/dashboard/constraint-assessment', img: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&h=300&fit=crop' },
            ].map((tool) => (
              <a
                key={tool.name}
                href={tool.href}
                className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:-translate-y-1 hover:shadow-lg transition-all"
              >
                <div
                  className="h-[120px] bg-cover bg-center flex items-end p-4 relative"
                  style={{ backgroundImage: `url('${tool.img}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0D2C54]/85" />
                  <span className="relative text-white font-semibold text-[15px]">{tool.name}</span>
                </div>
              </a>
            ))}
          </div>

          {/* Quote of the Day */}
          <div className="bg-white rounded-2xl border border-slate-200 px-10 py-8 flex items-center justify-between">
            <div className="flex items-start gap-5 flex-1">
              <div className="text-5xl text-slate-200 font-serif leading-none">"</div>
              <p className="text-xl italic text-slate-600 leading-relaxed">
                You can't read the label from inside the jar.
              </p>
            </div>
            <div className="text-right min-w-[120px]">
              <div className="font-semibold text-[#0D2C54] text-[15px]">Unknown</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Quote of the Day</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
