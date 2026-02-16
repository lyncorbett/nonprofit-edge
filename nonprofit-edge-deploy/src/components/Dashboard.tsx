'use client';

import React, { useState, useEffect } from 'react';
import { 
  Folder, Download, Star, Settings, ChevronRight, ChevronDown,
  Lightbulb, MessageSquare, CheckCircle, LogOut, X, Play, HelpCircle,
  Target, Calendar, Heart, Menu
} from 'lucide-react';
import { CommitmentModal } from './CommitmentTracker';

// ============================================
// TYPES
// ============================================

interface Commitment {
  id: string;
  text: string;
  deadline: 'today' | 'this_week' | 'this_month' | 'custom';
  deadlineDate: Date;
  createdAt: Date;
  completedAt?: Date;
  status: 'active' | 'completed' | 'missed';
}

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
    id: 'leadership-profile',
    name: 'Edge Leadership Assessment', 
    description: 'Assess leadership capacity across four dimensions: Vision & Clarity, People Investment, Radical Ownership, and Growth & Reflection.',
    href: 'leadership-assessment', 
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
    features: ['Assess your own leadership', 'Assess a team member', '180° assessment with employee', 'PDF report with coaching insights']
  },
  { 
    id: 'strategic-plan',
    name: 'Strategic Plan Check-Up', 
    description: 'Diagnose the health of your strategic plan and identify gaps before they become problems.',
    href: 'strategic-checkup', 
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    features: ['Plan health score', 'Gap analysis', 'Implementation tracker', 'Quarterly check-ins']
  },
  { 
    id: 'grant-review',
    name: 'Grant Review', 
    description: 'Get AI-powered feedback on your grant proposals before you submit. Improve clarity, alignment, and competitiveness.',
    href: 'grant-review', 
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    features: ['Proposal scoring', 'Alignment check', 'Narrative feedback', 'Budget review']
  },
  { 
    id: 'ceo-board',
    name: 'CEO Evaluation & Board Assessment', 
    description: 'Three governance tools in one place — CEO self-assessment, board effectiveness assessment, and board-led CEO evaluation.',
    href: 'ceo-evaluation', 
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop',
    features: ['CEO/ED self-assessment', 'Board effectiveness assessment', 'Board-led CEO evaluation', 'Facilitation guides']
  },
  { 
    id: 'scenario-planner',
    name: 'Scenario Planner', 
    description: 'Use the PIVOT framework to stress-test your strategy against multiple future scenarios.',
    href: 'scenario-planner', 
    img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop',
    features: ['3 scenario models', 'Risk assessment', 'Decision matrix', 'Contingency plans']
  },
  { 
    id: 'constraint-assessment',
    name: 'Core Constraint Assessment', 
    description: 'Identify the ONE constraint holding your organization back using Theory of Constraints methodology.',
    href: 'constraint-assessment', 
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
  const [modalStep, setModalStep] = useState(1);
  const [lpMode, setLpMode] = useState('self');
  const [cbMode, setCbMode] = useState('ceo-self');
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [showCommitmentModal, setShowCommitmentModal] = useState(false);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showHealthPopup, setShowHealthPopup] = useState(false);

  // Load commitments from localStorage
  useEffect(() => {
    try {
      const savedCommitments = localStorage.getItem('nonprofit_edge_commitments');
      if (savedCommitments) {
        const parsed = JSON.parse(savedCommitments);
        setCommitments(parsed.map((c: any) => ({
          ...c,
          deadlineDate: new Date(c.deadlineDate),
          createdAt: new Date(c.createdAt),
          completedAt: c.completedAt ? new Date(c.completedAt) : undefined
        })));
      }
    } catch (e) {
      console.error('Error loading commitments:', e);
    }
  }, []);

  // Close sidebar when navigating on mobile
  const handleNavigateAndClose = (page: string) => {
    setSidebarOpen(false);
    navigate(page);
  };

  // Save commitment
  const handleSaveCommitment = (commitment: Commitment) => {
    const updated = [...commitments, commitment];
    setCommitments(updated);
    localStorage.setItem('nonprofit_edge_commitments', JSON.stringify(updated));
    console.log('Commitment saved:', commitment);
  };

  // Mark commitment complete
  const handleMarkComplete = (id: string) => {
    const updated = commitments.map(c => 
      c.id === id ? { ...c, status: 'completed' as const, completedAt: new Date() } : c
    );
    setCommitments(updated);
    localStorage.setItem('nonprofit_edge_commitments', JSON.stringify(updated));
  };

  // Check for first-time visitor
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('nonprofit_edge_tour_completed');
    if (!hasSeenTour) {
      const timer = setTimeout(() => setShowTour(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Navigation helper
  const navigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      window.location.href = page.startsWith('/') ? page : `/${page}`;
    }
  };

  // Handle tool click
  const handleToolClick = (tool: Tool) => {
    setSelectedTool(tool);
  };

  // Start tool
  const handleStartTool = () => {
    if (selectedTool) {
      if ((selectedTool.id === 'leadership-profile' || selectedTool.id === 'ceo-board') && modalStep === 1) {
        setModalStep(2);
        return;
      }
      navigate(selectedTool.href);
      setSelectedTool(null);
      setModalStep(1);
    }
  };

  // Close modal
  const closeModal = () => {
    setSelectedTool(null);
    setModalStep(1);
    setLpMode('self');
    setCbMode('ceo-self');
  };

  // Tour steps
  const tourSteps = [
    { title: 'Welcome to The Nonprofit Edge! 🎉', content: 'Let\'s take a quick tour to help you get the most out of your membership.', target: null, position: 'center' },
    { title: 'Your Tools', content: 'Access powerful AI-driven assessments and planning tools. Click any tool to learn more and get started.', target: 'tools-section', position: 'top' },
    { title: 'Ask the Professor', content: 'Your 24/7 nonprofit leadership advisor. Get strategic guidance tailored to your specific challenges.', target: 'professor-card', position: 'bottom' },
    { title: 'Member Resources', content: 'Browse templates, playbooks, book summaries, and facilitation kits in the sidebar.', target: 'sidebar-resources', position: 'right' },
    { title: 'You\'re All Set!', content: 'Start by exploring a tool or asking the Professor a question. We\'re here to help you lead with confidence.', target: null, position: 'center' }
  ];

  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (showTour && tourSteps[tourStep].target) {
      const element = document.getElementById(tourSteps[tourStep].target!);
      if (element) {
        setHighlightRect(element.getBoundingClientRect());
      }
    } else {
      setHighlightRect(null);
    }
  }, [showTour, tourStep]);

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
    <div className="min-h-screen bg-slate-50 lg:flex">
      {/* MOBILE HEADER */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 text-slate-600 hover:text-slate-900"
        >
          <Menu className="w-6 h-6" />
        </button>
        <img src="/logo.svg" alt="The Nonprofit Edge" className="h-10" />
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0D2C54] to-[#164677] text-white flex items-center justify-center font-semibold text-sm">
          {user.name.charAt(0).toUpperCase()}
        </div>
      </header>

      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR */}
      <aside className={`
        bg-white border-r border-slate-200 p-6 flex flex-col z-50 fixed top-0 left-0 h-screen lg:relative lg:h-auto lg:overflow-visible
        w-[280px] transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Close button - mobile only */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="mb-2">
          <img src="/logo.svg" alt="The Nonprofit Edge" className="w-[360px] h-auto" />
        </div>

        {/* Quick Actions */}
        <nav className="mb-6" id="sidebar-resources">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-3 pl-3">
            Quick Actions
          </div>
          <button 
            onClick={() => handleNavigateAndClose('library')}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-[#0D2C54] text-sm font-medium w-full text-left"
          >
            <Folder className="w-5 h-5" />
            Member Resources
          </button>
          <button 
            onClick={() => handleNavigateAndClose('my-downloads')}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-[#0D2C54] text-sm font-medium w-full text-left"
          >
            <Download className="w-5 h-5" />
            My Downloads
          </button>
          <button 
            onClick={() => handleNavigateAndClose('favorites')}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-[#0D2C54] text-sm font-medium w-full text-left"
          >
            <Star className="w-5 h-5" />
            Saved Favorites
          </button>
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
            <button 
              onClick={() => handleNavigateAndClose('events')}
              className="text-xs text-[#0097A9] font-medium hover:underline"
            >
              View All
            </button>
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
        <button 
          onClick={() => handleNavigateAndClose('settings')}
          className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-[#0D2C54] text-sm font-medium w-full text-left"
        >
          <Settings className="w-5 h-5" />
          Settings
        </button>
        <button 
          onClick={() => { setTourStep(0); setShowTour(true); setSidebarOpen(false); }}
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
      <main className="lg:ml-0 p-4 lg:p-8 flex-1 pt-20 lg:pt-8">
        <div className="max-w-[1000px] mx-auto">
          {/* Welcome */}
          <div className="mb-6 lg:mb-7">
            <h1 className="text-2xl lg:text-[28px] font-bold text-[#0D2C54] mb-1">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user.name}
            </h1>
            <p className="text-slate-500 text-sm lg:text-[15px]">
              You chose <strong className="text-[#0097A9] font-semibold">Board Engagement</strong> as your focus area
              <button className="ml-2 lg:ml-3 text-xs lg:text-[13px] text-slate-400 underline underline-offset-2 hover:text-[#0097A9]">
                Change focus
              </button>
            </p>
          </div>

          {/* Top Cards - Stack on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 mb-6 lg:mb-8">
            {/* Today's Insight */}
            <div className="bg-gradient-to-br from-[#0097A9] to-[#00b4cc] rounded-2xl p-4 lg:p-5 text-white flex flex-col">
              <div className="text-[11px] uppercase tracking-widest opacity-85 mb-3 lg:mb-4 font-semibold flex items-center gap-2">
                <Lightbulb className="w-3.5 h-3.5" />
                Today's Insight
              </div>
              <p className="text-sm lg:text-base leading-relaxed flex-1 mb-4 lg:mb-6">
                The most effective boards don't just govern—they champion. When was the last time you asked your board members what excites them about your mission?
              </p>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCommitmentModal(true);
                }}
                className="flex items-center justify-between gap-2 bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white text-sm font-medium w-full hover:bg-white/30 transition-colors"
              >
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
              onClick={() => {
                if (onStartProfessor) {
                  onStartProfessor();
                } else {
                  navigate('ask-the-professor');
                }
              }}
              className="bg-gradient-to-br from-[#0D2C54] to-[#164677] rounded-2xl p-4 lg:p-5 text-white flex flex-col hover:-translate-y-0.5 hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="text-[11px] uppercase tracking-widest opacity-85 mb-3 lg:mb-4 font-semibold flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-[#0097A9]" />
                Ask the Professor
              </div>
              <p className="text-sm lg:text-base leading-relaxed flex-1 mb-4 lg:mb-6">
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

          {/* Tools Grid - 2 cols on mobile, 3 on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5 mb-6 lg:mb-8">
            {tools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => handleToolClick(tool)}
                className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer"
              >
                <div
                  className="h-[80px] lg:h-[120px] bg-cover bg-center flex items-end p-3 lg:p-4 relative"
                  style={{ backgroundImage: `url('${tool.img}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0D2C54]/85" />
                  <span className="relative text-white font-semibold text-xs lg:text-[15px] line-clamp-2">{tool.name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quote of the Day */}
          {(() => {
            const quotes = [
              { text: "You can't read the label from inside the jar.", author: "Unknown" },
              { text: "Culture eats strategy for breakfast.", author: "Peter Drucker" },
              { text: "If you want to go fast, go alone. If you want to go far, go together.", author: "African Proverb" },
              { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
              { text: "People don't care how much you know until they know how much you care.", author: "Theodore Roosevelt" },
              { text: "Begin with the end in mind.", author: "Stephen Covey" },
              { text: "What gets measured gets managed.", author: "Peter Drucker" },
              { text: "The most important thing in communication is hearing what isn't said.", author: "Peter Drucker" },
              { text: "Leadership is not about being in charge. It's about taking care of those in your charge.", author: "Simon Sinek" },
              { text: "Vision without execution is hallucination.", author: "Thomas Edison" },
              { text: "The bottleneck is always at the top of the bottle.", author: "Peter Drucker" },
              { text: "A leader is one who knows the way, goes the way, and shows the way.", author: "John C. Maxwell" },
              { text: "The greatest leader is not necessarily one who does the greatest things, but one who gets people to do the greatest things.", author: "Ronald Reagan" },
              { text: "Strategy is about making choices, trade-offs; it's about deliberately choosing to be different.", author: "Michael Porter" },
            ];
            const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
            const todaysQuote = quotes[dayOfYear % quotes.length];
            
            return (
              <div className="bg-gradient-to-r from-[#0D2C54] to-[#1a3a5c] rounded-2xl px-5 lg:px-8 py-5 lg:py-6 shadow-lg">
                <div className="flex items-start gap-3 lg:gap-4">
                  <div className="text-3xl lg:text-4xl text-[#0097A9] font-serif leading-none">"</div>
                  <div className="flex-1">
                    <p className="text-sm lg:text-lg italic text-white/90 leading-relaxed mb-2 lg:mb-3">
                      {todaysQuote.text}
                    </p>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-1">
                      <span className="text-xs lg:text-sm font-medium text-[#0097A9]">— {todaysQuote.author}</span>
                      <span className="text-[10px] text-white/40 uppercase tracking-wider">Quote of the Day</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Organizational Health Score Progress Tracker */}
          <div className="mt-6 lg:mt-8 bg-white rounded-xl border border-slate-200 p-5 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base lg:text-lg font-bold text-[#0D2C54]">🏥 Organizational Health Score</h3>
                <p className="text-xs lg:text-sm text-slate-500 mt-1">Complete any 4 assessments to unlock your score</p>
              </div>
              <button
                onClick={() => setShowHealthPopup(true)}
                className="text-xs lg:text-sm text-[#0097A9] font-semibold hover:underline bg-transparent border-none cursor-pointer"
              >
                View All Assessments →
              </button>
            </div>
            {(() => {
              const completed = 0;
              const needed = 4;
              const pct = Math.min(100, Math.round((completed / needed) * 100));
              return (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1 bg-slate-100 rounded-full h-3">
                      <div className="h-3 rounded-full bg-gradient-to-r from-[#0097A9] to-[#0D2C54] transition-all duration-500" style={{ width: pct + "%" }} />
                    </div>
                    <span className="text-sm font-bold text-[#0D2C54]">{completed}/{needed}</span>
                  </div>
                  {completed === 0 && (
                    <p className="text-sm text-slate-400 italic">No assessments completed yet. Start your first one from the tools above!</p>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </main>


      {/* HEALTH SCORE POPUP */}
      {showHealthPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4" onClick={() => setShowHealthPopup(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 lg:p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#0D2C54]">🏥 Organizational Health Score</h2>
              <button onClick={() => setShowHealthPopup(false)} className="text-slate-400 hover:text-slate-600 text-2xl bg-transparent border-none cursor-pointer">×</button>
            </div>
            <p className="text-sm text-slate-600 mb-5">Complete <strong>any 4</strong> of the following assessments to unlock your Organizational Health Score — a composite view of your nonprofit's strengths and growth areas.</p>
            <div className="space-y-3">
              {[
                { name: "Strategic Plan Check-Up", desc: "Evaluate your strategic plan's clarity, metrics, and timeline", route: "strategic-checkup" },
                { name: "Board Assessment", desc: "Assess board engagement, governance, and effectiveness", route: "board-assessment" },
                { name: "CEO Evaluation", desc: "Evaluate executive leadership alignment and performance", route: "ceo-evaluation" },
                { name: "PIVOT Scenario Planner", desc: "Test your organization's adaptability and resilience", route: "scenario-planner" },
                { name: "Grant/RFP Review", desc: "Analyze your funding readiness and proposal strength", route: "grant-review" },
                { name: "Ask the Professor", desc: "Complete a structured strategic coaching session", route: "ask-professor" },
                { name: "Leadership Assessment", desc: "Discover your leadership style and growth areas", route: "leadership-assessment" },
                { name: "Constraint Assessment", desc: "Identify your organization's primary bottleneck", route: "constraint-assessment" },
              ].map((tool, i) => (
                <button
                  key={i}
                  onClick={() => { setShowHealthPopup(false); onNavigate(tool.route); }}
                  className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-[#0097A9] hover:bg-[#0097A9]/5 transition-all bg-white cursor-pointer"
                >
                  <div className="font-semibold text-sm text-[#0D2C54]">⭕ {tool.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{tool.desc}</div>
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-4 text-center">Pick the assessments most relevant to your organization</p>
          </div>
        </div>
      )}

      {/* TOOL MODAL */}
      {selectedTool && (
        <div 
          className="fixed inset-0 bg-[#0D2C54]/70 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-[500px] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'modalSlideIn 0.25s ease' }}
          >
            {/* Tool Image Header */}
            <div 
              className="h-[140px] lg:h-[180px] bg-cover bg-center relative"
              style={{ backgroundImage: `url('${selectedTool.img}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#0D2C54]/30 to-[#0D2C54]/90" />
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-5 right-5 lg:left-6 lg:right-6">
                <h3 className="text-xl lg:text-2xl font-bold text-white">{selectedTool.name}</h3>
              </div>
            </div>

            {/* Content - Step 1 */}
            {modalStep === 1 && (
            <div className="p-5 lg:p-6">
              <p className="text-slate-600 mb-5 leading-relaxed text-sm lg:text-base">
                {selectedTool.description}
              </p>
              <div className="mb-6">
                <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">
                  {selectedTool.id === 'leadership-profile' || selectedTool.id === 'ceo-board' ? "What's Available" : "What's Included"}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  {selectedTool.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-[#0097A9] flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={closeModal} className="flex-1 px-4 py-3 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors text-sm lg:text-base">Cancel</button>
                <button onClick={handleStartTool} className="flex-1 px-4 py-3 bg-[#0097A9] hover:bg-[#007f8f] text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm lg:text-base">
                  <Play className="w-4 h-4" />
                  Start Tool
                </button>
              </div>
            </div>
            )}

            {/* Step 2: Leadership Profile */}
            {modalStep === 2 && selectedTool.id === 'leadership-profile' && (
            <div className="p-5 lg:p-6">
              <div className="bg-[#0D2C54] -mx-5 -mt-5 lg:-mx-6 lg:-mt-6 px-6 py-5 mb-5">
                <div style={{fontSize:'10px',fontWeight:700,color:'#0097A9',letterSpacing:'1.2px',textTransform:'uppercase',marginBottom:'4px'}}>Edge Leadership Profile™</div>
                <h2 className="text-lg font-extrabold text-white">Who is this assessment for?</h2>
              </div>
              {[
                {id:'self',icon:'👤',title:'Assess Myself',desc:'Rate yourself on all 48 questions. Get your full report with scores, insights, and growth plan.'},
                {id:'staff',icon:'👥',title:'Assess a Team Member',desc:'Rate a direct report. They get a development report. You get a coaching guide for the conversation.'},
                {id:'180',icon:'🔄',title:'180° Assessment',desc:'You assess an employee and they assess themselves. Both get a combined report with a conversation guide.'},
              ].map((mode) => (
                <button key={mode.id} onClick={() => setLpMode(mode.id)}
                  className="w-full flex items-start gap-3 p-4 mb-2 border-2 rounded-xl text-left transition-all"
                  style={{borderColor: lpMode===mode.id ? '#0097A9' : '#e2e8f0', background: lpMode===mode.id ? 'rgba(0,151,169,0.05)' : '#fff'}}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{background: lpMode===mode.id ? '#0097A9' : '#f1f5f9'}}>{mode.icon}</div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-[#0D2C54]">{mode.title}</div>
                    <div className="text-xs text-slate-500 leading-snug mt-0.5">{mode.desc}</div>
                  </div>
                  <div className="w-5 h-5 rounded-full flex-shrink-0 mt-1.5 transition-all" style={{border: lpMode===mode.id ? '6px solid #0097A9' : '2px solid #cbd5e1'}} />
                </button>
              ))}
              <div className="flex gap-3 mt-4">
                <button onClick={() => setModalStep(1)} className="flex-1 px-4 py-3 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors text-sm">← Back</button>
                <button onClick={handleStartTool} className="flex-1 px-4 py-3 bg-[#0097A9] hover:bg-[#007f8f] text-white rounded-lg font-medium text-sm transition-colors">
                  {lpMode === 'self' ? 'Start Assessment →' : 'Start & Send Invitation →'}
                </button>
              </div>
            </div>
            )}

            {/* Step 2: CEO & Board */}
            {modalStep === 2 && selectedTool.id === 'ceo-board' && (
            <div className="p-5 lg:p-6">
              <div className="bg-[#0D2C54] -mx-5 -mt-5 lg:-mx-6 lg:-mt-6 px-6 py-5 mb-5">
                <div style={{fontSize:'10px',fontWeight:700,color:'#0097A9',letterSpacing:'1.2px',textTransform:'uppercase',marginBottom:'4px'}}>CEO & Board Assessments</div>
                <h2 className="text-lg font-extrabold text-white">What would you like to do?</h2>
              </div>
              {[
                {id:'ceo-self',icon:'👤',title:'CEO Self-Assessment',desc:'Reflect on your executive leadership privately. Covers board relationship, strategic positioning, organizational health, and succession readiness. ~10 min.',badge:''},
                {id:'board',icon:'📋',title:'Board Assessment',desc:'Evaluate board effectiveness across governance, strategy, fundraising, and oversight. Sent to all board members. CEO participation is optional. Responses aggregated anonymously.',badge:''},
                {id:'eval',icon:'📊',title:'CEO Evaluation',desc:'Board members evaluate the CEO anonymously. CEO self-assessment is optional. Both sides receive a combined report with a structured meeting agenda.',badge:'Board → CEO · Responses aggregated anonymously'},
              ].map((path) => (
                <button key={path.id} onClick={() => setCbMode(path.id)}
                  className="w-full flex items-start gap-3 p-4 mb-2 border-2 rounded-xl text-left transition-all"
                  style={{borderColor: cbMode===path.id ? '#0097A9' : '#e2e8f0', background: cbMode===path.id ? 'rgba(0,151,169,0.05)' : '#fff'}}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{background: cbMode===path.id ? '#0097A9' : '#f1f5f9'}}>{path.icon}</div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-[#0D2C54]">{path.title}</div>
                    <div className="text-xs text-slate-500 leading-snug mt-0.5">{path.desc}</div>
                    {path.badge && <div className="inline-block mt-1.5 px-2 py-0.5 bg-red-50 text-red-600 text-xs font-semibold rounded">{path.badge}</div>}
                  </div>
                  <div className="w-5 h-5 rounded-full flex-shrink-0 mt-1.5 transition-all" style={{border: cbMode===path.id ? '6px solid #0097A9' : '2px solid #cbd5e1'}} />
                </button>
              ))}
              <div className="flex gap-3 mt-4">
                <button onClick={() => setModalStep(1)} className="flex-1 px-4 py-3 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors text-sm">← Back</button>
                <button onClick={handleStartTool} className="flex-1 px-4 py-3 bg-[#0097A9] hover:bg-[#007f8f] text-white rounded-lg font-medium text-sm transition-colors">
                  {cbMode === 'ceo-self' ? 'Start Self-Assessment →' : cbMode === 'board' ? 'Send to Board →' : 'Set Up Evaluation →'}
                </button>
              </div>
            </div>
            )}
          </div>
        </div>
      )}

      {/* PRODUCT TOUR - Hidden on mobile for better UX */}
      {showTour && (
        <>
          <div 
            className="fixed inset-0 z-[98]"
            style={{
              background: highlightRect ? 'transparent' : 'rgba(13, 44, 84, 0.8)'
            }}
          />

          {highlightRect && (
            <div 
              className="fixed z-[99] pointer-events-none transition-all duration-300 hidden lg:block"
              style={{
                top: highlightRect.top - 8,
                left: highlightRect.left - 8,
                width: highlightRect.width + 16,
                height: highlightRect.height + 16,
                border: '3px solid #0097A9',
                borderRadius: '16px',
                boxShadow: '0 0 0 9999px rgba(13, 44, 84, 0.8)',
              }}
            />
          )}
          
          <div 
            className="fixed z-[100] bg-white rounded-2xl w-[calc(100%-32px)] lg:w-[420px] overflow-hidden shadow-2xl left-4 right-4 lg:left-auto lg:right-auto"
            style={{
              ...(highlightRect && window.innerWidth >= 1024 ? {
                top: tourSteps[tourStep].position === 'top' 
                  ? highlightRect.top - 240
                  : tourSteps[tourStep].position === 'bottom'
                  ? highlightRect.bottom + 20
                  : highlightRect.top + highlightRect.height / 2,
                left: tourSteps[tourStep].position === 'right'
                  ? highlightRect.right + 20
                  : Math.max(20, Math.min(highlightRect.left + highlightRect.width / 2 - 210, window.innerWidth - 440)),
                transform: tourSteps[tourStep].position === 'right' ? 'translateY(-50%)' : 'none'
              } : {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }),
              animation: 'modalSlideIn 0.3s ease'
            }}
          >
            <div className="h-1 bg-slate-100">
              <div 
                className="h-full bg-[#0097A9] transition-all duration-300"
                style={{ width: `${((tourStep + 1) / tourSteps.length) * 100}%` }}
              />
            </div>

            <div className="p-5 lg:p-6">
              <h3 className="text-lg lg:text-xl font-bold text-[#0D2C54] mb-2 text-center">
                {tourSteps[tourStep].title}
              </h3>
              <p className="text-slate-600 mb-5 lg:mb-6 leading-relaxed text-center text-sm lg:text-base">
                {tourSteps[tourStep].content}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleTourSkip}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-slate-500 font-medium hover:bg-slate-50 transition-colors text-sm"
                >
                  Skip Tour
                </button>
                <button
                  onClick={handleTourNext}
                  className="flex-1 px-4 py-2.5 bg-[#0097A9] hover:bg-[#007f8f] text-white rounded-lg font-medium transition-colors text-sm"
                >
                  {tourStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
                </button>
              </div>

              <div className="flex justify-center gap-2 mt-4">
                {tourSteps.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === tourStep ? 'bg-[#0097A9]' : idx < tourStep ? 'bg-[#0097A9]/50' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Commitment Modal */}
      <CommitmentModal
        isOpen={showCommitmentModal}
        onClose={() => setShowCommitmentModal(false)}
        onSave={handleSaveCommitment}
        existingCommitments={commitments}
        userEmail={user?.email}
      />

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
