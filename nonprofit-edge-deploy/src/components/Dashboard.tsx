'use client';

import React, { useState, useEffect } from 'react';
import { 
  Folder, Download, Star, Settings, ChevronRight, ChevronDown,
  Lightbulb, MessageSquare, CheckCircle, LogOut, X, Play, HelpCircle
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface DashboardProps {
  user?: {
    id: string;
    name: string;
    full_name?: string;
    email: string;
    avatar_url?: string | null;
    profile_photo?: string | null;
  };
  organization?: {
    id: string;
    name: string;
    tier: 'essential' | 'professional' | 'premium';
  };
  usage?: {
    tools_used_this_month: number;
    downloads_this_month: number;
    professor_sessions_this_month: number;
  };
  onNavigate?: (page: string) => void;
  onStartProfessor?: () => void;
  onLogout?: () => void;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  href: string;
  img: string;
  features: string[];
}

// ============================================
// TOOL DATA
// ============================================

const tools: Tool[] = [
  { 
    id: 'board-assessment',
    name: 'Board Assessment', 
    description: 'Evaluate your board\'s effectiveness across governance, engagement, and strategic contribution using BoardSource-aligned criteria.',
    href: '/board-assessment/use', 
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    features: ['30-question assessment', 'Benchmark comparisons', 'Action recommendations', 'PDF report']
  },
  { 
    id: 'strategic-plan',
    name: 'Strategic Plan Check-Up', 
    description: 'Diagnose the health of your strategic plan and identify gaps before they become problems.',
    href: '/strategic-plan-checkup/use', 
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
    features: ['Plan health score', 'Gap analysis', 'Implementation tracker', 'Quarterly check-ins']
  },
  { 
    id: 'grant-review',
    name: 'Grant Review', 
    description: 'Get AI-powered feedback on your grant proposals before you submit. Improve clarity, alignment, and competitiveness.',
    href: '/grant-review/use', 
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    features: ['Proposal scoring', 'Alignment check', 'Narrative feedback', 'Budget review']
  },
  { 
    id: 'ceo-evaluation',
    name: 'CEO Evaluation', 
    description: 'Conduct comprehensive, fair CEO performance evaluations that strengthen board-ED relationships.',
    href: '/ceo-evaluation/use', 
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop',
    features: ['360° feedback', 'Goal alignment', 'Development plan', 'Board summary']
  },
  { 
    id: 'scenario-planner',
    name: 'Scenario Planner', 
    description: 'Use the PIVOT framework to stress-test your strategy against multiple future scenarios.',
    href: '/scenario-planner/use', 
    img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop',
    features: ['3 scenario models', 'Risk assessment', 'Decision matrix', 'Contingency plans']
  },
  { 
    id: 'constraint-assessment',
    name: 'Core Constraint', 
    description: 'Identify the ONE constraint holding your organization back using Theory of Constraints methodology.',
    href: '/constraint-assessment', 
    img: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&h=300&fit=crop',
    features: ['Constraint diagnosis', 'Root cause analysis', 'Breakthrough strategy', '90-day action plan']
  },
];

// ============================================
// DASHBOARD COMPONENT
// ============================================

const Dashboard: React.FC<DashboardProps> = ({
  user = { id: '1', name: 'Lyn', email: 'lyn@example.com' },
  organization = { id: '1', name: 'The Pivotal Group', tier: 'professional' },
  usage = { tools_used_this_month: 7, downloads_this_month: 18, professor_sessions_this_month: 3 },
  onNavigate,
  onStartProfessor,
  onLogout
}) => {
  // State
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // Check for first-time visitor
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('nonprofit_edge_tour_completed');
    if (!hasSeenTour) {
      // Show tour after a short delay
      const timer = setTimeout(() => setShowTour(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Navigation helper
  const navigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
  };

  // Handle tool click - open modal
  const handleToolClick = (tool: Tool) => {
    setSelectedTool(tool);
  };

  // Start tool
  const handleStartTool = () => {
    if (selectedTool) {
      navigate(selectedTool.href);
      setSelectedTool(null);
    }
  };

  // Close modal
  const closeModal = () => {
    setSelectedTool(null);
  };

  // Tour steps
  const tourSteps = [
    {
      title: 'Welcome to The Nonprofit Edge! 🎉',
      content: 'Let\'s take a quick tour to help you get the most out of your membership.',
      target: null
    },
    {
      title: 'Your Tools',
      content: 'Access powerful AI-driven assessments and planning tools. Click any tool to learn more and get started.',
      target: 'tools-section'
    },
    {
      title: 'Ask the Professor',
      content: 'Your 24/7 nonprofit leadership advisor. Get strategic guidance tailored to your specific challenges.',
      target: 'professor-card'
    },
    {
      title: 'Member Resources',
      content: 'Browse templates, playbooks, book summaries, and facilitation kits in the sidebar.',
      target: 'sidebar-resources'
    },
    {
      title: 'You\'re All Set!',
      content: 'Start by exploring a tool or asking the Professor a question. We\'re here to help you lead with confidence.',
      target: null
    }
  ];

  const handleTourNext = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      localStorage.setItem('nonprofit_edge_tour_completed', 'true');
      setShowTour(false);
      setTourStep(0);
    }
  };

  const handleTourSkip = () => {
    localStorage.setItem('nonprofit_edge_tour_completed', 'true');
    setShowTour(false);
    setTourStep(0);
  };

  // Download limits by tier
  const downloadLimits = { essential: 10, professional: 25, premium: 100 };
  const maxDownloads = downloadLimits[organization.tier] || 25;
  const downloadPercent = (usage.downloads_this_month / maxDownloads) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* LEFT SIDEBAR */}
      <aside className="w-[280px] bg-white border-r border-slate-200 p-6 flex flex-col fixed top-0 left-0 h-screen overflow-y-auto">
        {/* Logo */}
        <div className="mb-8">
          <img src="/images/nonprofit-edge-logo.png" alt="The Nonprofit Edge" className="w-[220px] h-auto" />
        </div>

        {/* Quick Actions */}
        <nav className="mb-6" id="sidebar-resources">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-3 pl-3">
            Quick Actions
          </div>
          <a 
            href="/member-resources" 
            onClick={(e) => { e.preventDefault(); navigate('/member-resources'); }}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-[#0D2C54] text-sm font-medium"
          >
            <Folder className="w-5 h-5" />
            Member Resources
          </a>
          <a 
            href="/my-downloads"
            onClick={(e) => { e.preventDefault(); navigate('/my-downloads'); }}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-[#0D2C54] text-sm font-medium"
          >
            <Download className="w-5 h-5" />
            My Downloads
          </a>
          <a 
            href="/favorites"
            onClick={(e) => { e.preventDefault(); navigate('/favorites'); }}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-[#0D2C54] text-sm font-medium"
          >
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
            <a 
              href="/events" 
              onClick={(e) => { e.preventDefault(); navigate('/events'); }}
              className="text-xs text-[#0097A9] font-medium"
            >
              View All
            </a>
          </div>
          <div className="flex items-center gap-3 px-3 py-3 border-b border-slate-100">
            <div className="bg-[#0D2C54] rounded-lg px-3 py-2 text-center min-w-[48px]">
              <div className="text-base font-bold text-white">10</div>
              <div className="text-[10px] text-white/80 uppercase">Feb</div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-700">Founding Member Access</div>
              <div className="text-xs text-slate-400">Early Access Begins</div>
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
            <span className="text-xs font-semibold">{maxDownloads - usage.downloads_this_month} of {maxDownloads}</span>
          </div>
          <div className="h-1.5 bg-white/30 rounded-full mb-3">
            <div 
              className="h-full bg-white rounded-full transition-all" 
              style={{ width: `${100 - downloadPercent}%` }}
            />
          </div>
          <span className="inline-block text-[10px] font-bold bg-white text-[#0D2C54] px-2.5 py-1 rounded tracking-wide uppercase">
            {organization.tier}
          </span>
        </div>

        {/* Settings & Tour */}
        <a 
          href="/settings"
          onClick={(e) => { e.preventDefault(); navigate('/settings'); }}
          className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-[#0D2C54] text-sm font-medium"
        >
          <Settings className="w-5 h-5" />
          Settings
        </a>
        <button 
          onClick={() => { setTourStep(0); setShowTour(true); }}
          className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-[#0D2C54] text-sm font-medium w-full text-left"
        >
          <HelpCircle className="w-5 h-5" />
          Take the Tour
        </button>

        {/* User Profile */}
        <div className="mt-auto pt-4 border-t border-slate-200">
          <div className="flex items-center gap-3 py-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0D2C54] to-[#164677] text-white flex items-center justify-center font-semibold text-base">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-700">{user.name}</div>
              <div className="text-xs text-slate-400">{organization.name}</div>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="text-[13px] text-slate-400 hover:text-red-500 px-3 py-2 w-full text-left flex items-center gap-2"
          >
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
            <h1 className="text-[28px] font-bold text-[#0D2C54] mb-1">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user.name}
            </h1>
            <p className="text-slate-500 text-[15px]">
              You chose <strong className="text-[#0097A9] font-semibold">Board Engagement</strong> as your focus area
              <button className="ml-3 text-[13px] text-slate-400 underline underline-offset-2 hover:text-[#0097A9]">
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
              <button className="flex items-center justify-between gap-2 bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white text-sm font-medium w-full hover:bg-white/30 transition-colors">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Make a Commitment
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Ask the Professor */}
            <div 
              id="professor-card"
              onClick={() => onStartProfessor ? onStartProfessor() : navigate('/ask-the-professor/use')}
              className="bg-gradient-to-br from-[#0D2C54] to-[#164677] rounded-2xl p-7 text-white flex flex-col hover:-translate-y-0.5 hover:shadow-xl transition-all cursor-pointer"
            >
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
            </div>
          </div>

          {/* Your Tools */}
          <div className="flex justify-between items-center mb-4" id="tools-section">
            <h2 className="text-lg font-bold text-[#0D2C54]">Your Tools</h2>
          </div>

          <div className="grid grid-cols-3 gap-5 mb-8">
            {tools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => handleToolClick(tool)}
                className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer"
              >
                <div
                  className="h-[120px] bg-cover bg-center flex items-end p-4 relative"
                  style={{ backgroundImage: `url('${tool.img}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0D2C54]/85" />
                  <span className="relative text-white font-semibold text-[15px]">{tool.name}</span>
                </div>
              </div>
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

      {/* TOOL MODAL */}
      {selectedTool && (
        <div 
          className="fixed inset-0 bg-[#0D2C54]/70 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-[500px] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'modalSlideIn 0.25s ease' }}
          >
            {/* Tool Image Header */}
            <div 
              className="h-[180px] bg-cover bg-center relative"
              style={{ backgroundImage: `url('${selectedTool.img}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#0D2C54]/30 to-[#0D2C54]/90" />
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <h3 className="text-2xl font-bold text-white">{selectedTool.name}</h3>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-slate-600 mb-5 leading-relaxed">
                {selectedTool.description}
              </p>

              {/* Features */}
              <div className="mb-6">
                <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">
                  What's Included
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {selectedTool.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-[#0097A9]" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartTool}
                  className="flex-1 px-4 py-3 bg-[#0097A9] hover:bg-[#007f8f] text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Start Tool
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT TOUR */}
      {showTour && (
        <div className="fixed inset-0 bg-[#0D2C54]/80 flex items-center justify-center z-[100] p-4">
          <div 
            className="bg-white rounded-2xl w-full max-w-[450px] overflow-hidden shadow-2xl"
            style={{ animation: 'modalSlideIn 0.3s ease' }}
          >
            {/* Progress */}
            <div className="h-1 bg-slate-100">
              <div 
                className="h-full bg-[#0097A9] transition-all duration-300"
                style={{ width: `${((tourStep + 1) / tourSteps.length) * 100}%` }}
              />
            </div>

            <div className="p-8 text-center">
              <h3 className="text-xl font-bold text-[#0D2C54] mb-3">
                {tourSteps[tourStep].title}
              </h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                {tourSteps[tourStep].content}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleTourSkip}
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-lg text-slate-500 font-medium hover:bg-slate-50 transition-colors"
                >
                  Skip Tour
                </button>
                <button
                  onClick={handleTourNext}
                  className="flex-1 px-4 py-3 bg-[#0097A9] hover:bg-[#007f8f] text-white rounded-lg font-medium transition-colors"
                >
                  {tourStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
                </button>
              </div>

              {/* Step indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {tourSteps.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === tourStep ? 'bg-[#0097A9]' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation keyframes */}
      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
