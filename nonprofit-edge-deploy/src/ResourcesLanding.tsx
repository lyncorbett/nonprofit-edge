import React, { useState, useEffect } from 'react';

const NAVY = '#0D2C54';
const TEAL = '#0097A7';

// Modern SVG Icons
const Icons = {
  templates: (color: string) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  playbooks: (color: string) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="8" y1="7" x2="16" y2="7" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  ),
  bookSummaries: (color: string) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  certifications: (color: string) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  ),
  leadership: (color: string) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  facilitation: (color: string) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <line x1="6" y1="11" x2="10" y2="11" />
      <line x1="14" y1="11" x2="18" y2="11" />
    </svg>
  ),
};

interface ResourcesLandingProps {
  onNavigate?: (route: string) => void;
  onGetStarted?: () => void;
}

const ResourcesLanding: React.FC<ResourcesLandingProps> = ({ onNavigate, onGetStarted }) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const screens = ['screen1', 'screen2', 'screen3', 'screen4'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScreen((prev) => (prev + 1) % screens.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else if (onNavigate) {
      onNavigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between" style={{ height: '120px' }}>
            <a href="/" className="flex items-center">
              <img 
                src="/logo.svg" 
                alt="The Nonprofit Edge" 
                style={{ width: '280px', height: 'auto' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.jpg'
                }}
              />
            </a>
            <nav className="hidden md:flex items-center gap-8">
              <a href="/why-we-exist" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Why We Exist</a>
              <a href="/#tools-section" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Tools</a>
              <a href="/#pricing-section" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Pricing</a>
              <a href="/login" className="px-5 py-2.5 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: TEAL }}>Sign In</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6" style={{ marginTop: '120px' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-5" style={{ color: NAVY }}>
              Your Nonprofit Leadership <span style={{ color: TEAL }}>Library</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              100+ templates, 27+ playbooks, book summaries, certifications, and leadership guides — all built specifically for nonprofit leaders. Stop creating from scratch and start leading with confidence.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleGetStarted}
                className="inline-flex items-center justify-center px-6 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
                style={{ backgroundColor: TEAL }}
              >
                Start Your Free Trial
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="rounded-xl overflow-hidden shadow-2xl">
            <img 
              src="/resources-hero.jpg" 
              alt="Nonprofit leader browsing resources on tablet"
              className="w-full h-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/tool-resources.jpg';
              }}
            />
          </div>
        </div>
      </section>

      {/* Everything You Need Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4" style={{ color: NAVY }}>
            Everything You Need in One Place
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Professional resources built by someone who's been in the trenches — not generic business templates with "nonprofit" slapped on top.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                icon: Icons.templates,
                title: 'Templates', 
                count: '100+ templates',
                desc: 'Board agendas, strategic plans, grant budgets, evaluation forms — ready to customize.',
                color: '#0097A7',
                examples: ['Board Meeting Agenda', 'Annual Report Template', 'Grant Budget Worksheet', 'Staff Evaluation Form']
              },
              { 
                icon: Icons.playbooks,
                title: 'Playbooks', 
                count: '27+ playbooks',
                desc: 'Step-by-step guides for board retreats, planning sessions, and crisis response.',
                color: '#7c3aed',
                examples: ['Board Retreat Facilitator Guide', 'Strategic Planning Kickoff', 'Crisis Communication Plan', 'Major Gift Campaign']
              },
              { 
                icon: Icons.bookSummaries,
                title: 'Book Summaries', 
                count: '52+ summaries',
                desc: 'Key insights from top leadership books, reframed for the nonprofit context.',
                color: '#d97706',
                examples: ['Good to Great (Social Sectors)', 'Leaders Eat Last', 'Dare to Lead', 'The Speed of Trust']
              },
              { 
                icon: Icons.certifications,
                title: 'Certifications', 
                count: '6 programs',
                desc: 'Earn credentials in nonprofit governance, leadership, and strategy.',
                color: '#059669',
                examples: ['Board Governance Certificate', 'Strategic Planning Pro', 'Nonprofit Leadership', 'DISC Assessment']
              },
              { 
                icon: Icons.leadership,
                title: 'Leadership Guides', 
                count: '15+ guides',
                desc: 'Deep dives on delegation, difficult conversations, managing up, and team building.',
                color: '#dc2626',
                examples: ['Delegation Framework', 'Difficult Conversations', 'Managing Up', 'Building High-Trust Teams']
              },
              { 
                icon: Icons.facilitation,
                title: 'Facilitation Kits', 
                count: '12+ kits',
                desc: 'Everything you need to run effective meetings, workshops, and training sessions.',
                color: '#2563eb',
                examples: ['Workshop Facilitation Kit', 'Team Building Activities', 'Board Orientation Package', 'Staff Training Modules']
              },
            ].map((cat, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${cat.color}15` }}
                    >
                      {cat.icon(cat.color)}
                    </div>
                    <span 
                      className="text-xs font-bold px-3 py-1 rounded-full text-white"
                      style={{ backgroundColor: cat.color }}
                    >
                      {cat.count}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: NAVY }}>{cat.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{cat.desc}</p>
                  <div className="space-y-1.5">
                    {cat.examples.map((ex, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs text-gray-500">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={cat.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{ex}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Preview */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4" style={{ color: NAVY }}>
            See What's Inside
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Every resource is expert-crafted by Dr. Lyn Corbett, who has helped 847+ organizations secure over $100M in funding.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                {[
                  { 
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    ),
                    title: 'Built for Nonprofits', 
                    desc: 'Every template, playbook, and guide is designed specifically for the nonprofit context — governance, compliance, fundraising, and mission-driven leadership.' 
                  },
                  { 
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                    ),
                    title: 'Ready to Use Today', 
                    desc: 'Download, customize with your organization\'s name and details, and put it to work. No hours of formatting or research required.' 
                  },
                  { 
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                        <polyline points="17 6 23 6 23 12" />
                      </svg>
                    ),
                    title: 'Updated Regularly', 
                    desc: 'New resources added monthly based on member requests, sector trends, and emerging best practices.' 
                  },
                  { 
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    ),
                    title: 'Expert-Crafted', 
                    desc: '15+ years of nonprofit consulting distilled into practical, ready-to-use tools you can trust.' 
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: TEAL }}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-bold mb-1" style={{ color: NAVY }}>{item.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Animated Preview */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
              <div className="px-4 py-3 flex items-center gap-2" style={{ backgroundColor: NAVY }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-white/60 ml-2">Member Resource Library</span>
              </div>
              
              <div className="relative" style={{ height: '380px' }}>
                {/* Screen 1 - Template Categories */}
                <div className={`absolute inset-0 p-5 transition-opacity duration-500 ${currentScreen === 0 ? 'opacity-100' : 'opacity-0'}`}>
                  <h3 className="text-sm font-semibold mb-4" style={{ color: NAVY }}>Browse by Category</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: 'Board Governance', count: '32 items', color: '#0097A7' },
                      { name: 'Strategic Planning', count: '28 items', color: '#7c3aed' },
                      { name: 'Fundraising', count: '24 items', color: '#d97706' },
                      { name: 'HR & People', count: '19 items', color: '#059669' },
                      { name: 'Financial Mgmt', count: '22 items', color: '#dc2626' },
                      { name: 'Programs', count: '18 items', color: '#2563eb' },
                    ].map((cat, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                          <span className="text-xs font-semibold" style={{ color: NAVY }}>{cat.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">{cat.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Screen 2 - Template Preview */}
                <div className={`absolute inset-0 p-5 transition-opacity duration-500 ${currentScreen === 1 ? 'opacity-100' : 'opacity-0'}`}>
                  <h3 className="text-sm font-semibold mb-4" style={{ color: NAVY }}>Board Meeting Agenda Template</h3>
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                      <div>
                        <div className="text-xs font-bold" style={{ color: NAVY }}>Board Meeting Agenda</div>
                        <div className="text-xs text-gray-500">Governance Template</div>
                      </div>
                      <div className="px-2 py-1 rounded text-xs font-semibold" style={{ backgroundColor: `${TEAL}15`, color: TEAL }}>Popular</div>
                    </div>
                    <div className="space-y-2">
                      {['I. Call to Order & Roll Call', 'II. Approval of Minutes', 'III. Executive Director Report', 'IV. Financial Report & Dashboard', 'V. Committee Reports', 'VI. New Business / Action Items'].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                          <span style={{ color: TEAL }}>•</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">DOCX</span>
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">PDF</span>
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">Google Doc</span>
                    </div>
                  </div>
                </div>

                {/* Screen 3 - Playbook Preview */}
                <div className={`absolute inset-0 p-5 transition-opacity duration-500 ${currentScreen === 2 ? 'opacity-100' : 'opacity-0'}`}>
                  <h3 className="text-sm font-semibold mb-4" style={{ color: NAVY }}>Board Retreat Facilitator Guide</h3>
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: '#7c3aed15', color: '#7c3aed' }}>Playbook</span>
                      <span className="text-xs text-gray-500">• 45 pages • 6-hour retreat</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        { phase: 'Pre-Retreat', items: 'Surveys, logistics, materials' },
                        { phase: 'Opening', items: 'Icebreaker, ground rules, objectives' },
                        { phase: 'Strategic Review', items: 'Mission alignment, SWOT analysis' },
                        { phase: 'Visioning', items: 'Future state, priorities, goals' },
                        { phase: 'Action Planning', items: 'Commitments, timelines, owners' },
                      ].map((p, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full text-white flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ backgroundColor: '#7c3aed' }}>{i + 1}</div>
                          <div>
                            <div className="text-xs font-semibold" style={{ color: NAVY }}>{p.phase}</div>
                            <div className="text-xs text-gray-500">{p.items}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Screen 4 - Book Summary Preview */}
                <div className={`absolute inset-0 p-5 transition-opacity duration-500 ${currentScreen === 3 ? 'opacity-100' : 'opacity-0'}`}>
                  <h3 className="text-sm font-semibold mb-4" style={{ color: NAVY }}>Book Summary Library</h3>
                  <div className="space-y-3">
                    {[
                      { title: 'Good to Great (Social Sectors)', author: 'Jim Collins', time: '8 min read', tag: 'Strategy' },
                      { title: 'Leaders Eat Last', author: 'Simon Sinek', time: '10 min read', tag: 'Leadership' },
                      { title: 'The Speed of Trust', author: 'Stephen M.R. Covey', time: '9 min read', tag: 'Culture' },
                      { title: 'Dare to Lead', author: 'Brené Brown', time: '7 min read', tag: 'Leadership' },
                    ].map((book, i) => (
                      <div key={i} className="bg-white p-3 rounded border border-gray-200 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold" style={{ color: NAVY }}>{book.title}</div>
                          <div className="text-xs text-gray-500">{book.author} • {book.time}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: '#d9770615', color: '#d97706' }}>{book.tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 px-4 py-3 flex justify-center gap-2 border-t border-gray-200">
                {screens.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentScreen(i)}
                    className={`w-2 h-2 rounded-full transition-all ${currentScreen === i ? 'scale-125' : ''}`}
                    style={{ backgroundColor: currentScreen === i ? NAVY : '#d1d5db' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 px-6" style={{ background: `linear-gradient(135deg, ${TEAL}, #00838F)` }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <blockquote className="text-2xl lg:text-3xl font-semibold italic leading-relaxed">
            "The best nonprofit leaders don't have more time — they have better tools."
          </blockquote>
          <cite className="block mt-6 text-base not-italic opacity-70">— From The Nonprofit Edge</cite>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: NAVY }}>
            Ready to Lead with Better Resources?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Get instant access to 100+ templates, 27+ playbooks, 52+ book summaries, and more — all built for nonprofit leaders like you.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={handleGetStarted}
              className="inline-flex items-center justify-center px-6 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
              style={{ backgroundColor: TEAL }}
            >
              Start Your Free Trial
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResourcesLanding;
