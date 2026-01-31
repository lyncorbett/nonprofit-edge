'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, X, MessageSquare, Wrench, FileText, BookOpen, 
  Bookmark, PlayCircle, Users, Award, Download, ChevronRight,
  Star
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface ResourceLibraryProps {
  user?: {
    id: string;
    name: string;
    full_name?: string;
  };
  organization?: {
    id: string;
    name: string;
    tier: string;
  };
  onNavigate?: (path: string) => void;
  onStartProfessor?: () => void;
  onLogout?: () => void;
}

interface Resource {
  name: string;
  type: string;
  url: string;
  tags: string[];
  description?: string;
  price?: string;
  partner?: string | null;
}

interface CategoryConfig {
  label: string;
  icon: React.ElementType;
  color: string;
  hoverColor: string;
  route: string;
  count: string;
  description: string;
  sampleItems: string[];
}

// ============================================
// DATA
// ============================================

const categoryConfig: Record<string, CategoryConfig> = {
  tools: {
    label: 'Tools',
    icon: Wrench,
    color: '#0097A9',
    hoverColor: '#0097A9',
    route: '/tools',
    count: '9 tools',
    description: 'AI-powered assessments and analysis tools for leadership and organizational development.',
    sampleItems: ['Leadership Profile', 'Board Assessment', 'Grant Review', 'Dashboards']
  },
  templates: {
    label: 'Templates',
    icon: FileText,
    color: '#0D2C54',
    hoverColor: '#0D2C54',
    route: '/resources/templates',
    count: '147+ templates',
    description: 'Ready-to-use templates for strategic plans, board packets, evaluations, and more.',
    sampleItems: ['Governance', 'Strategic Planning', 'HR']
  },
  guides: {
    label: 'Leadership Guides',
    icon: BookOpen,
    color: '#0097A9',
    hoverColor: '#0097A9',
    route: '/resources/guides',
    count: '30+ guides',
    description: 'In-depth guides on nonprofit leadership, from board governance to strategic decision-making.',
    sampleItems: ['Governance', 'Delegation', 'Team Building']
  },
  books: {
    label: 'Book Summaries',
    icon: Bookmark,
    color: '#b45309',
    hoverColor: '#b45309',
    route: '/resources/book-summaries',
    count: '52+ summaries',
    description: 'Key insights from essential leadership books, distilled into actionable summaries.',
    sampleItems: ['Leadership', 'Strategy', 'Management']
  },
  playbooks: {
    label: 'Playbooks',
    icon: PlayCircle,
    color: '#7c3aed',
    hoverColor: '#7c3aed',
    route: '/resources/playbooks',
    count: '27+ playbooks',
    description: 'Step-by-step playbooks for fundraising, succession planning, and board retreats.',
    sampleItems: ['Fundraising', 'Succession', 'Board Retreats']
  },
  kits: {
    label: 'Facilitation Kits',
    icon: Users,
    color: '#be185d',
    hoverColor: '#be185d',
    route: '/resources/facilitation-kits',
    count: '20+ kits',
    description: 'Complete kits for running board retreats, strategic planning sessions, and team workshops.',
    sampleItems: ['Board Retreats', 'Team Workshops', 'Planning Sessions']
  },
  certs: {
    label: 'Certifications',
    icon: Award,
    color: '#22c55e',
    hoverColor: '#22c55e',
    route: '/certifications',
    count: '5 programs',
    description: 'Earn credentials in DiSC, Five Behaviors, governance, and strategic leadership.',
    sampleItems: ['DiSC', 'Five Behaviors', 'Governance']
  }
};

const resources: Resource[] = [
  // Tools
  { name: 'Edge Leadership Profile™', type: 'tools', url: '/tools/leadership-profile', tags: ['leadership', 'assessment'] },
  { name: 'Board Assessment', type: 'tools', url: '/tools/board-assessment', tags: ['board', 'governance', 'assessment'] },
  { name: 'Core Constraint Assessment', type: 'tools', url: '/tools/core-constraint', tags: ['strategy', 'assessment'] },
  { name: 'Grant/RFP Review', type: 'tools', url: '/tools/grant-review', tags: ['grants', 'fundraising'] },
  { name: 'Scenario Planner', type: 'tools', url: '/tools/scenario-planner', tags: ['strategy', 'planning'] },
  { name: 'Strategic Planning Tracker', type: 'tools', url: '/tools/strategic-tracker', tags: ['strategy', 'planning'] },
  { name: 'Dashboards', type: 'tools', url: '/tools/dashboards', tags: ['data', 'tracking'] },
  { name: 'CEO Evaluation', type: 'tools', url: '/tools/ceo-evaluation', tags: ['leadership', 'evaluation'] },
  { name: 'Strategic Plan Check-Up', type: 'tools', url: '/tools/strategic-checkup', tags: ['strategy', 'assessment'] },
  
  // Templates
  { name: 'Board Meeting Agenda', type: 'templates', url: '/templates/board-agenda', tags: ['board', 'governance', 'meetings'] },
  { name: 'Board Member Agreement', type: 'templates', url: '/templates/board-agreement', tags: ['board', 'governance'] },
  { name: 'Board Self-Assessment Survey', type: 'templates', url: '/templates/board-self-assessment', tags: ['board', 'governance', 'assessment'] },
  { name: 'Board Recruitment Matrix', type: 'templates', url: '/templates/board-recruitment', tags: ['board', 'governance', 'recruitment'] },
  { name: 'Board Committee Charters', type: 'templates', url: '/templates/committee-charters', tags: ['board', 'governance'] },
  { name: 'Conflict of Interest Policy', type: 'templates', url: '/templates/conflict-interest', tags: ['board', 'governance', 'policy'] },
  { name: 'Strategic Plan Template', type: 'templates', url: '/templates/strategic-plan', tags: ['strategy', 'planning'] },
  { name: 'SWOT Analysis Worksheet', type: 'templates', url: '/templates/swot', tags: ['strategy', 'planning'] },
  { name: 'Annual Report Template', type: 'templates', url: '/templates/annual-report', tags: ['reporting', 'communications'] },
  { name: 'Job Description Template', type: 'templates', url: '/templates/job-description', tags: ['hr', 'hiring'] },
  { name: 'Performance Review Form', type: 'templates', url: '/templates/performance-review', tags: ['hr', 'evaluation'] },
  { name: 'Employee Handbook Template', type: 'templates', url: '/templates/employee-handbook', tags: ['hr', 'policy'] },
  { name: 'Grant Budget Template', type: 'templates', url: '/templates/grant-budget', tags: ['grants', 'fundraising', 'finance'] },
  { name: 'Donor Acknowledgment Letters', type: 'templates', url: '/templates/donor-letters', tags: ['fundraising', 'donors'] },
  { name: 'Board Governance Policies', type: 'templates', url: '/templates/governance-policies', tags: ['board', 'governance', 'policy'] },
  
  // Leadership Guides
  { name: 'Board Governance Essentials', type: 'guides', url: '/guides/governance-essentials', tags: ['board', 'governance'] },
  { name: 'Effective Delegation', type: 'guides', url: '/guides/delegation', tags: ['leadership', 'management'] },
  { name: 'Difficult Conversations', type: 'guides', url: '/guides/difficult-conversations', tags: ['leadership', 'communication'] },
  { name: 'Building High-Performing Teams', type: 'guides', url: '/guides/team-building', tags: ['leadership', 'teams'] },
  { name: 'ED First 90 Days', type: 'guides', url: '/guides/ed-first-90-days', tags: ['leadership', 'transition'] },
  { name: 'Working with Your Board Chair', type: 'guides', url: '/guides/board-chair', tags: ['board', 'governance', 'relationships'] },
  
  // Book Summaries
  { name: 'Governance as Leadership', type: 'books', url: '/books/governance-as-leadership', tags: ['board', 'governance'] },
  { name: 'Good to Great (Social Sector)', type: 'books', url: '/books/good-to-great', tags: ['strategy', 'leadership'] },
  { name: 'The Five Dysfunctions of a Team', type: 'books', url: '/books/five-dysfunctions', tags: ['teams', 'leadership'] },
  { name: 'Forces for Good', type: 'books', url: '/books/forces-for-good', tags: ['nonprofit', 'impact'] },
  
  // Playbooks
  { name: 'Board Retreat Playbook', type: 'playbooks', url: '/playbooks/board-retreat', tags: ['board', 'governance', 'facilitation'] },
  { name: 'Grant Writing Playbook', type: 'playbooks', url: '/playbooks/grant-writing', tags: ['grants', 'fundraising'] },
  { name: 'Succession Planning Playbook', type: 'playbooks', url: '/playbooks/succession', tags: ['leadership', 'planning'] },
  { name: 'Fundraising Campaign Playbook', type: 'playbooks', url: '/playbooks/fundraising-campaign', tags: ['fundraising'] },
  
  // Facilitation Kits
  { name: 'Board Retreat Facilitation Kit', type: 'kits', url: '/kits/board-retreat', tags: ['board', 'governance', 'facilitation'] },
  { name: 'Strategic Planning Workshop Kit', type: 'kits', url: '/kits/strategic-planning', tags: ['strategy', 'planning', 'facilitation'] },
  { name: 'Team Building Workshop Kit', type: 'kits', url: '/kits/team-building', tags: ['teams', 'facilitation'] },
];

const certifications: Resource[] = [
  { name: 'DiSC Certification', type: 'certs', url: '/certifications/disc', tags: ['assessment', 'certification'], description: 'Become certified to administer and interpret DiSC assessments.', price: '$1,495', partner: 'Wiley' },
  { name: 'Five Behaviors Certification', type: 'certs', url: '/certifications/five-behaviors', tags: ['teams', 'certification'], description: 'Lead teams using Patrick Lencioni\'s proven model.', price: '$1,695', partner: 'Wiley' },
  { name: 'Nonprofit Governance Certificate', type: 'certs', url: '/certifications/governance', tags: ['board', 'governance', 'certification'], description: 'Master board governance best practices and earn your credential.', price: '$497', partner: null },
  { name: 'Strategic Leadership Certificate', type: 'certs', url: '/certifications/strategic-leadership', tags: ['leadership', 'certification'], description: 'Develop strategic thinking and decision-making skills.', price: '$397', partner: null },
  { name: 'Nonprofit Consulting Certificate', type: 'certs', url: '/certifications/consulting', tags: ['consulting', 'certification'], description: 'Learn to consult effectively with nonprofit organizations.', price: '$597', partner: null },
];

const subcategories: Record<string, string[]> = {
  tools: [],
  templates: ['All', 'Governance', 'Strategic Planning', 'HR', 'Operations', 'Fundraising', 'Finance'],
  guides: ['All', 'Governance', 'Leadership', 'Management', 'Communication'],
  books: ['All', 'Leadership', 'Strategy', 'Management', 'Nonprofit'],
  playbooks: ['All', 'Fundraising', 'Board', 'Succession', 'Crisis'],
  kits: ['All', 'Board Retreats', 'Strategic Planning', 'Team Workshops'],
  certs: []
};

const topDownloads = [
  { name: 'Board Meeting Agenda', type: 'Template', downloads: 2847, url: '/templates/board-agenda' },
  { name: 'Strategic Plan Template', type: 'Template', downloads: 2156, url: '/templates/strategic-plan' },
  { name: 'Board Retreat Playbook', type: 'Playbook', downloads: 1823, url: '/playbooks/board-retreat' },
  { name: 'ED First 90 Days', type: 'Guide', downloads: 1654, url: '/guides/ed-first-90-days' },
];

// ============================================
// COMPONENT
// ============================================

const ResourceLibrary: React.FC<ResourceLibraryProps> = ({
  user = { id: '1', name: 'Lyn' },
  organization = { id: '1', name: 'The Pivotal Group', tier: 'professional' },
  onNavigate,
  onStartProfessor,
  onLogout
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Resource[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState('all');
  const [modalSearchQuery, setModalSearchQuery] = useState('');

  // Navigation helper - uses onNavigate prop from App.tsx
  const navigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      window.location.href = page.startsWith('/') ? page : `/${page}`;
    }
  };

  // Search handler
  useEffect(() => {
    if (searchQuery.length < 2) {
      setShowSearchResults(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const matches = resources.filter(r =>
      r.name.toLowerCase().includes(query) ||
      r.tags.some(tag => tag.includes(query))
    );
    setSearchResults(matches);
    setShowSearchResults(true);
  }, [searchQuery]);

  // Group search results by category
  const groupedResults = searchResults.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, Resource[]>);

  // Modal handlers
  const openModal = (category: string) => {
    setActiveModal(category);
    setActiveSubcategory('all');
    setModalSearchQuery('');
  };

  const closeModal = () => {
    setActiveModal(null);
    setActiveSubcategory('all');
    setModalSearchQuery('');
  };

  // Get filtered items for modal
  const getModalItems = () => {
    if (!activeModal) return [];
    
    if (activeModal === 'certs') {
      return modalSearchQuery
        ? certifications.filter(c => c.name.toLowerCase().includes(modalSearchQuery.toLowerCase()))
        : certifications;
    }

    let items = resources.filter(r => r.type === activeModal);
    
    if (activeSubcategory !== 'all') {
      items = items.filter(r =>
        r.tags.some(tag => tag.toLowerCase().includes(activeSubcategory.replace('-', ' ')))
      );
    }
    
    if (modalSearchQuery) {
      items = items.filter(r => r.name.toLowerCase().includes(modalSearchQuery.toLowerCase()));
    }
    
    return items;
  };

  // Close search on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.search-section')) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Close modal on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
        setShowSearchResults(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isFullPageModal = activeModal === 'templates' || activeModal === 'certs';

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header className="bg-[#0D2C54] py-3 px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('dashboard')} className="hover:opacity-80 transition-opacity">
            <svg width="160" height="45" viewBox="0 0 500 140" fill="none">
              <g transform="translate(0, 10)">
                <path d="M60 10 A50 50 0 1 1 20 70" stroke="#FFFFFF" strokeWidth="8" fill="none" strokeLinecap="round"/>
                <path d="M15 45 L45 70 L75 35" stroke="#0097A9" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M45 70 L45 25" stroke="#0097A9" strokeWidth="8" fill="none" strokeLinecap="round"/>
              </g>
              <text x="115" y="42" fontFamily="system-ui" fontSize="28" fontWeight="700" fill="#FFFFFF">THE</text>
              <text x="115" y="78" fontFamily="system-ui" fontSize="32" fontWeight="800" fill="#0097A9">NONPROFIT</text>
              <text x="115" y="115" fontFamily="system-ui" fontSize="32" fontWeight="800" fill="#FFFFFF">EDGE</text>
            </svg>
          </button>
          <nav className="flex items-center gap-6">
            {[
              { label: 'Dashboard', page: 'dashboard' },
              { label: 'Tools', page: 'dashboard' },
              { label: 'Resources', page: 'member-resources' },
              { label: 'Events', page: 'events' },
              { label: 'Profile', page: 'settings' }
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.page)}
                className={`text-sm font-medium transition-colors ${
                  item.label === 'Resources' ? 'text-[#0097A9]' : 'text-white/80 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('dashboard')}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-[#0097A9] text-sm mb-4"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Return to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-[#0D2C54] mb-2">Member Resources</h1>
          <p className="text-slate-500">Everything you need to lead your organization forward</p>
        </div>

        {/* Search */}
        <div className="search-section relative mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search all resources..."
              className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl text-base focus:outline-none focus:border-[#0097A9] transition-colors"
            />
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && (
            <div className="absolute top-full left-0 right-0 bg-white border-2 border-[#0097A9] border-t-0 rounded-b-xl max-h-[450px] overflow-y-auto z-50 shadow-lg">
              {Object.keys(groupedResults).length === 0 ? (
                <div className="p-6 text-center text-slate-500">
                  No resources found for "{searchQuery}"
                </div>
              ) : (
                Object.entries(groupedResults).map(([type, items]) => {
                  const config = categoryConfig[type];
                  if (!config) return null;
                  const Icon = config.icon;
                  return (
                    <div key={type} className="border-b border-slate-100 last:border-b-0">
                      <div className="px-4 py-2 bg-slate-50 flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center"
                          style={{ backgroundColor: config.color }}
                        >
                          <Icon className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          {config.label}
                        </span>
                        <span className="text-xs text-slate-400 ml-auto">
                          {items.length} result{items.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      {items.slice(0, 4).map((item, idx) => (
                        <a
                          key={idx}
                          href={item.url}
                          onClick={(e) => { e.preventDefault(); navigate(item.url); }}
                          className="block px-4 py-3 pl-10 hover:bg-[#e6f7f8] transition-colors"
                        >
                          <span className="text-sm font-medium text-[#0D2C54]">{item.name}</span>
                        </a>
                      ))}
                      {items.length > 4 && (
                        <a
                          href={config.route}
                          onClick={(e) => { e.preventDefault(); openModal(type); setShowSearchResults(false); }}
                          className="block px-4 py-2 pl-10 text-sm font-semibold text-[#0097A9] hover:bg-[#e6f7f8]"
                        >
                          View all {items.length} {config.label.toLowerCase()} →
                        </a>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-3 gap-5 mb-8">
          {/* Ask the Professor - Single column */}
          <div
            onClick={() => onStartProfessor ? onStartProfessor() : navigate('ask-the-professor')}
            className="bg-gradient-to-br from-[#0D2C54] to-[#1a3a5c] rounded-2xl p-5 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all relative overflow-hidden group"
          >
            <div className="absolute top-[-50%] right-[-20%] w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(0,151,169,0.15)_0%,transparent_70%)]" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 bg-[#0097A9] text-white px-2.5 py-0.5 rounded-full text-[10px] font-semibold mb-3">
                <Star className="w-3 h-3" />
                AI-Powered
              </span>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[rgba(0,151,169,0.2)] border border-[#0097A9] flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-[#5fd4e0]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Ask the Professor</h3>
                  <p className="text-xs text-[#5fd4e0]">Your leadership advisor</p>
                </div>
              </div>
              <p className="text-white/70 text-xs mb-4 leading-relaxed line-clamp-2">
                Get instant expert guidance on strategy, governance, fundraising, and leadership.
              </p>
              <div className="flex items-center gap-2 text-[#0097A9] text-sm font-semibold group-hover:text-[#5fd4e0] transition-colors">
                Start Conversation
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Dashboard Creator - Single column */}
          <div
            onClick={() => navigate('dashboard-creator')}
            className="bg-gradient-to-br from-[#D4A84B] to-[#b8922f] rounded-2xl p-5 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all relative overflow-hidden group"
          >
            <div className="absolute top-[-50%] right-[-20%] w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(255,255,255,0.15)_0%,transparent_70%)]" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 bg-white/20 text-white px-2.5 py-0.5 rounded-full text-[10px] font-semibold mb-3">
                <Star className="w-3 h-3" />
                New
              </span>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
                    <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
                    <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
                    <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Dashboard Creator</h3>
                  <p className="text-xs text-white/80">Build custom dashboards</p>
                </div>
              </div>
              <p className="text-white/70 text-xs mb-4 leading-relaxed line-clamp-2">
                Create personalized dashboards to track your organization's key metrics and goals.
              </p>
              <div className="flex items-center gap-2 text-white text-sm font-semibold group-hover:text-white/80 transition-colors">
                Create Dashboard
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Tools */}
          <CategoryCard category="tools" config={categoryConfig.tools} onClick={() => openModal('tools')} />
          
          {/* Templates */}
          <CategoryCard category="templates" config={categoryConfig.templates} onClick={() => openModal('templates')} />
          
          {/* Leadership Guides */}
          <CategoryCard category="guides" config={categoryConfig.guides} onClick={() => openModal('guides')} />
          
          {/* Book Summaries */}
          <CategoryCard category="books" config={categoryConfig.books} onClick={() => openModal('books')} />
          
          {/* Playbooks */}
          <CategoryCard category="playbooks" config={categoryConfig.playbooks} onClick={() => openModal('playbooks')} />
          
          {/* Facilitation Kits */}
          <CategoryCard category="kits" config={categoryConfig.kits} onClick={() => openModal('kits')} />
          
          {/* Certifications */}
          <CategoryCard category="certs" config={categoryConfig.certs} onClick={() => openModal('certs')} />
        </div>

        {/* Top Downloads */}
        <section>
          <h2 className="text-lg font-bold text-[#0D2C54] mb-4">Top Downloads</h2>
          <div className="grid grid-cols-4 gap-4">
            {topDownloads.map((item, idx) => (
              <button
                key={idx}
                onClick={() => navigate(item.url.replace('/', ''))}
                className="bg-white rounded-xl p-4 border border-slate-200 hover:border-[#0097A9] hover:shadow-md transition-all text-left"
              >
                <span className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded mb-3 ${
                  item.type === 'Template' ? 'bg-slate-100 text-slate-600' :
                  item.type === 'Playbook' ? 'bg-purple-100 text-purple-600' :
                  'bg-teal-50 text-teal-600'
                }`}>
                  {item.type}
                </span>
                <h4 className="text-sm font-semibold text-[#0D2C54] mb-2 leading-tight">{item.name}</h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Download className="w-3 h-3" />
                  {item.downloads.toLocaleString()} downloads
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Modal */}
      {activeModal && (
        <div
          className="fixed inset-0 bg-[#0D2C54]/70 flex items-center justify-center z-[100] p-4"
          onClick={closeModal}
        >
          <div
            className={`bg-white rounded-2xl w-full overflow-hidden shadow-2xl flex flex-col ${
              isFullPageModal ? 'max-w-[1000px] max-h-[90vh]' : 'max-w-[700px] max-h-[85vh]'
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'modalSlideIn 0.25s ease' }}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-bold text-[#0D2C54] flex items-center gap-3">
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: categoryConfig[activeModal]?.color }}
                >
                  {(() => {
                    const Icon = categoryConfig[activeModal]?.icon;
                    return Icon ? <Icon className="w-5 h-5 text-white" /> : null;
                  })()}
                </span>
                {categoryConfig[activeModal]?.label}
              </h2>
              <button
                onClick={closeModal}
                className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-red-100 hover:text-red-500 flex items-center justify-center text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Search within modal */}
              <input
                type="text"
                value={modalSearchQuery}
                onChange={(e) => setModalSearchQuery(e.target.value)}
                placeholder={`Search within ${categoryConfig[activeModal]?.label.toLowerCase()}...`}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg text-sm mb-4 focus:outline-none focus:border-[#0097A9]"
              />

              {/* Subcategory tabs */}
              {subcategories[activeModal]?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {subcategories[activeModal].map((sub) => {
                    const subKey = sub.toLowerCase().replace(' ', '-');
                    const isActive = (activeSubcategory === 'all' && sub === 'All') || activeSubcategory === subKey;
                    return (
                      <button
                        key={sub}
                        onClick={() => setActiveSubcategory(subKey)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                          isActive
                            ? 'bg-[#0097A9] border-[#0097A9] text-white'
                            : 'border-slate-200 text-slate-500 hover:border-[#0097A9] hover:text-[#0097A9]'
                        }`}
                      >
                        {sub}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Items list */}
              {activeModal === 'certs' ? (
                <div className={isFullPageModal ? 'grid grid-cols-2 gap-4' : 'space-y-3'}>
                  {getModalItems().map((item, idx) => (
                    <a
                      key={idx}
                      href={item.url}
                      onClick={(e) => { e.preventDefault(); navigate(item.url); }}
                      className="block bg-white border-2 border-slate-100 rounded-xl p-5 hover:border-[#0097A9] hover:shadow-md transition-all"
                    >
                      <h4 className="text-base font-semibold text-[#0D2C54] mb-2">{item.name}</h4>
                      <p className="text-sm text-slate-500 mb-3">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-[#0097A9]">{item.price}</span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          item.partner ? 'bg-amber-100 text-amber-700' : 'bg-teal-50 text-teal-600'
                        }`}>
                          {item.partner ? `${item.partner} Partner` : 'Edge Original'}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className={isFullPageModal ? 'grid grid-cols-2 gap-3' : 'space-y-2'}>
                  {getModalItems().length === 0 ? (
                    <div className="col-span-2 text-center py-8 text-slate-400">
                      No {categoryConfig[activeModal]?.label.toLowerCase()} found
                    </div>
                  ) : (
                    getModalItems().map((item, idx) => (
                      <a
                        key={idx}
                        href={item.url}
                        onClick={(e) => { e.preventDefault(); navigate(item.url); }}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-[#e6f7f8] transition-colors"
                      >
                        <div>
                          <h4 className="text-sm font-semibold text-[#0D2C54] mb-0.5">{item.name}</h4>
                          <p className="text-xs text-slate-400">{item.tags.slice(0, 3).join(' • ')}</p>
                        </div>
                        <span className="px-3 py-1.5 bg-[#0D2C54] text-white text-xs font-semibold rounded hover:bg-[#0097A9] transition-colors flex-shrink-0">
                          {activeModal === 'tools' ? 'Open' : 'View'}
                        </span>
                      </a>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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

// Category Card Component
const CategoryCard: React.FC<{
  category: string;
  config: CategoryConfig;
  onClick: () => void;
}> = ({ category, config, onClick }) => {
  const Icon = config.icon;
  
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-5 border-2 border-transparent hover:border-current cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all"
      style={{ '--hover-color': config.hoverColor } as React.CSSProperties}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${config.color}, ${config.color}dd)` }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#0D2C54]">{config.label}</h3>
          <span className="text-xs text-slate-400">{config.count}</span>
        </div>
      </div>
      <p className="text-sm text-slate-500 mb-3 leading-relaxed">{config.description}</p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {config.sampleItems.map((item, idx) => (
          <span key={idx} className="text-xs px-2 py-1 bg-slate-100 text-slate-500 rounded">
            {item}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: config.color }}>
        Browse {config.label}
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
};

export default ResourceLibrary;
