import React, { useState, useEffect } from 'react';

const NAVY = '#0D2C54';
const TEAL = '#0097A7';

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
            <h1 className="text-4xl lg:text-5xl font-extrabold text-[#0D2C54] leading-tight mb-5">
              Your Nonprofit Leadership <span className="text-[#e11d48]">Library</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              147+ templates, 27+ playbooks, book summaries, certifications, and leadership guides — all built specifically for nonprofit leaders. Stop creating from scratch and start leading with confidence.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleGetStarted}
                className="inline-flex items-center justify-center px-6 py-3 bg-[#e11d48] text-white font-semibold rounded-lg hover:bg-[#be123c] transition-all"
              >
                Start Your Free Trial
              </button>
              <a href="/#pricing-section" className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#0D2C54] text-[#0D2C54] font-semibold rounded-lg hover:bg-[#0D2C54] hover:text-white transition-all">
                See Pricing
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <div className="rounded-xl overflow-hidden shadow-2xl">
            <img 
              src="/tool-resources.jpg" 
              alt="Nonprofit leadership resources library"
              className="w-full h-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80';
              }}
            />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0D2C54] text-center mb-4">
            Stop Reinventing the Wheel
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Every hour you spend building a board agenda template or searching for a strategic planning framework is an hour you're not spending on your mission.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                icon: '📄',
                title: '147+ Templates', 
                desc: 'Board agendas, strategic plans, grant budgets, evaluation forms, fundraising trackers, HR policies — ready to customize for your organization.',
                color: '#0097A7'
              },
              { 
                icon: '📘',
                title: '27+ Playbooks', 
                desc: 'Step-by-step guides for board retreats, strategic planning sessions, crisis response, succession planning, and major gift campaigns.',
                color: '#7c3aed'
              },
              { 
                icon: '📚',
                title: '52+ Book Summaries', 
                desc: 'Key insights from top leadership books, reframed for the nonprofit context. Get the takeaways in 10 minutes, not 10 hours.',
                color: '#d97706'
              },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="text-xl font-bold text-[#0D2C54] mb-3">{card.title}</h3>
                <p className="text-gray-600 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0D2C54] text-center mb-12">
            Everything You Need in One Place
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                icon: '📄', 
                title: 'Templates', 
                count: '147+ templates',
                desc: 'Board agendas, strategic plans, grant budgets, evaluation forms — ready to customize.',
                color: '#0097A7',
                examples: ['Board Meeting Agenda', 'Annual Report Template', 'Grant Budget Worksheet', 'Staff Evaluation Form']
              },
              { 
                icon: '📘', 
                title: 'Playbooks', 
                count: '27+ playbooks',
                desc: 'Step-by-step guides for board retreats, planning sessions, and crisis response.',
                color: '#7c3aed',
                examples: ['Board Retreat Facilitator Guide', 'Strategic Planning Kickoff', 'Crisis Communication Plan', 'Major Gift Campaign']
              },
              { 
                icon: '📚', 
                title: 'Book Summaries', 
                count: '52+ summaries',
                desc: 'Key insights from top leadership books, reframed for the nonprofit context.',
                color: '#d97706',
                examples: ['Good to Great (Social Sectors)', 'Leaders Eat Last', 'Dare to Lead', 'The Speed of Trust']
              },
              { 
                icon: '🏅', 
                title: 'Certifications', 
                count: '6 programs',
                desc: 'Earn credentials in nonprofit governance, leadership, and strategy.',
                color: '#059669',
                examples: ['Board Governance Certificate', 'Strategic Planning Pro', 'Nonprofit Leadership', 'DISC Assessment']
              },
              { 
                icon: '👥', 
                title: 'Leadership Guides', 
                count: '15+ guides',
                desc: 'Deep dives on delegation, difficult conversations, managing up, and team building.',
                color: '#e11d48',
                examples: ['Delegation Framework', 'Difficult Conversations', 'Managing Up', 'Building High-Trust Teams']
              },
              { 
                icon: '🧰', 
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
                    <span className="text-3xl">{cat.icon}</span>
                    <span 
                      className="text-xs font-bold px-3 py-1 rounded-full text-white"
                      style={{ backgroundColor: cat.color }}
                    >
                      {cat.count}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#0D2C54] mb-2">{cat.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{cat.desc}</p>
                  <div className="space-y-1.5">
                    {cat.examples.map((ex, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs text-gray-500">
                        <span style={{ color: cat.color }}>✓</span>
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
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0D2C54] text-center mb-4">
            See What's Inside
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Professional resources built by someone who's been in the trenches — not generic business templates with "nonprofit" slapped on top.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                {[
                  { 
                    title: 'Built for Nonprofits', 
                    desc: 'Every template, playbook, and guide is designed specifically for the nonprofit context — governance, compliance, fundraising, and mission-driven leadership.' 
                  },
                  { 
                    title: 'Ready to Use Today', 
                    desc: 'Download, customize with your organization\'s name and details, and put it to work. No hours of formatting or research required.' 
                  },
                  { 
                    title: 'Updated Regularly', 
                    desc: 'New resources added monthly based on member requests, sector trends, and emerging best practices.' 
                  },
                  { 
                    title: 'Expert-Crafted', 
                    desc: 'Created by Dr. Lyn Corbett, who has helped 847+ organizations secure over $100M in funding over 15+ years of nonprofit consulting.' 
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: TEAL }}>
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0D2C54] mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Animated Preview */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
              <div className="bg-[#0D2C54] px-4 py-3 flex items-center gap-2">
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
                  <h3 className="text-sm font-semibold text-[#0D2C54] mb-4">Browse by Category</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: 'Board Governance', count: '32 items', color: '#0097A7' },
                      { name: 'Strategic Planning', count: '28 items', color: '#7c3aed' },
                      { name: 'Fundraising', count: '24 items', color: '#d97706' },
                      { name: 'HR & People', count: '19 items', color: '#059669' },
                      { name: 'Financial Mgmt', count: '22 items', color: '#e11d48' },
                      { name: 'Programs', count: '18 items', color: '#2563eb' },
                    ].map((cat, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                          <span className="text-xs font-semibold text-[#0D2C54]">{cat.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">{cat.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Screen 2 - Template Preview */}
                <div className={`absolute inset-0 p-5 transition-opacity duration-500 ${currentScreen === 1 ? 'opacity-100' : 'opacity-0'}`}>
                  <h3 className="text-sm font-semibold text-[#0D2C54] mb-4">Board Meeting Agenda Template</h3>
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                      <div>
                        <div className="text-xs font-bold text-[#0D2C54]">Board Meeting Agenda</div>
                        <div className="text-xs text-gray-500">Governance Template</div>
                      </div>
                      <div className="bg-[#0097A7]/10 text-[#0097A7] px-2 py-1 rounded text-xs font-semibold">Popular</div>
                    </div>
                    <div className="space-y-2">
                      {['I. Call to Order & Roll Call', 'II. Approval of Minutes', 'III. Executive Director Report', 'IV. Financial Report & Dashboard', 'V. Committee Reports', 'VI. New Business / Action Items'].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="text-[#0097A7]">•</span>
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
                  <h3 className="text-sm font-semibold text-[#0D2C54] mb-4">Board Retreat Facilitator Guide</h3>
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-[#7c3aed]/10 text-[#7c3aed] px-2 py-0.5 rounded text-xs font-semibold">Playbook</span>
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
                          <div className="w-6 h-6 rounded-full bg-[#7c3aed] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">{i + 1}</div>
                          <div>
                            <div className="text-xs font-semibold text-[#0D2C54]">{p.phase}</div>
                            <div className="text-xs text-gray-500">{p.items}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Screen 4 - Book Summary Preview */}
                <div className={`absolute inset-0 p-5 transition-opacity duration-500 ${currentScreen === 3 ? 'opacity-100' : 'opacity-0'}`}>
                  <h3 className="text-sm font-semibold text-[#0D2C54] mb-4">Book Summary Library</h3>
                  <div className="space-y-3">
                    {[
                      { title: 'Good to Great (Social Sectors)', author: 'Jim Collins', time: '8 min read', tag: 'Strategy' },
                      { title: 'Leaders Eat Last', author: 'Simon Sinek', time: '10 min read', tag: 'Leadership' },
                      { title: 'The Speed of Trust', author: 'Stephen M.R. Covey', time: '9 min read', tag: 'Culture' },
                      { title: 'Dare to Lead', author: 'Brené Brown', time: '7 min read', tag: 'Leadership' },
                    ].map((book, i) => (
                      <div key={i} className="bg-white p-3 rounded border border-gray-200 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold text-[#0D2C54]">{book.title}</div>
                          <div className="text-xs text-gray-500">{book.author} • {book.time}</div>
                        </div>
                        <span className="bg-[#d97706]/10 text-[#d97706] px-2 py-0.5 rounded text-xs font-semibold">{book.tag}</span>
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
                    className={`w-2 h-2 rounded-full transition-all ${currentScreen === i ? 'bg-[#0D2C54] scale-125' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0D2C54] text-center mb-12">
            How This Compares to Building Your Own
          </h2>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-3 bg-[#0D2C54] text-white">
              <div className="p-5 text-left font-semibold">What You Get</div>
              <div className="p-5 text-center font-semibold">Building from Scratch</div>
              <div className="p-5 text-center font-semibold">The Nonprofit Edge</div>
            </div>

            {[
              { item: 'Board governance templates', diy: true, edge: true },
              { item: 'Strategic planning frameworks', diy: true, edge: true },
              { item: 'Fundraising & grant tools', diy: true, edge: true },
              { item: 'Nonprofit-specific context', diy: false, edge: true },
              { item: 'Expert-reviewed content', diy: false, edge: true },
              { item: 'Ready to use immediately', diy: false, edge: true },
              { item: 'Updated with best practices', diy: false, edge: true },
              { item: 'Typical time investment', diy: '40+ hours/year', edge: 'Included in membership' },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 border-b border-gray-200 last:border-0">
                <div className="p-4 text-sm font-medium text-[#0D2C54]">{row.item}</div>
                <div className="p-4 text-center text-sm text-gray-600">
                  {typeof row.diy === 'boolean' ? (
                    row.diy ? <span className="text-[#0097A7] text-lg">✓</span> : <span className="text-gray-400 text-lg">✗</span>
                  ) : row.diy}
                </div>
                <div className="p-4 text-center text-sm bg-[#0097A7]/5">
                  {typeof row.edge === 'boolean' ? (
                    row.edge ? <span className="text-[#0097A7] text-lg">✓</span> : <span className="text-gray-400 text-lg">✗</span>
                  ) : <span className="font-medium text-[#0D2C54]">{row.edge}</span>}
                </div>
              </div>
            ))}
          </div>

          <p className="text-center mt-6 text-sm text-gray-500">
            All resources are included with every membership tier — from Essential ($79/mo) to Premium ($329/mo).
          </p>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#e11d48] to-[#be123c]">
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
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0D2C54] mb-4">
            Ready to Lead with Better Resources?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Get instant access to 147+ templates, 27+ playbooks, 52+ book summaries, and more — all built for nonprofit leaders like you.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={handleGetStarted}
              className="inline-flex items-center justify-center px-6 py-3 bg-[#e11d48] text-white font-semibold rounded-lg hover:bg-[#be123c] transition-all"
            >
              Start Your Free Trial
            </button>
            <a href="/#pricing-section" className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#0D2C54] text-[#0D2C54] font-semibold rounded-lg hover:bg-[#0D2C54] hover:text-white transition-all">
              See Pricing
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResourcesLanding;
