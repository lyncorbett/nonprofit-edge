/**
 * Homepage - The Nonprofit Edge
 * Updated: Feb 6, 2026
 * - Fixed Ask the Professor links to /ask-the-professor/use
 * - All links use onNavigate for SPA routing (no full page reloads)
 * - Fixed pricing to $97/$197/$397
 */

import React, { useState } from 'react'

const NAVY = '#0D2C54'
const TEAL = '#0097A9'

interface HomepageProps {
  onNavigate?: (page: string) => void
}

const Homepage: React.FC<HomepageProps> = ({ onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavigate = (path: string) => {
    // Handle anchor links (scroll to section)
    if (path.startsWith('#')) {
      const el = document.getElementById(path.slice(1))
      if (el) el.scrollIntoView({ behavior: 'smooth' })
      return
    }
    // Handle external links
    if (path.startsWith('http') || path.startsWith('mailto:')) {
      window.open(path, '_blank')
      return
    }
    // SPA navigation
    if (onNavigate) {
      onNavigate(path)
    } else {
      window.location.href = path
    }
  }

  const tools = [
    { 
      image: '/tool-strategic.jpg',
      title: 'Strategic Plan Analysis', 
      desc: 'Diagnose your current plan in minutes with scores & specific fixes.',
      link: '/strategic-plan-checkup'
    },
    { 
      image: '/tool-grant.jpg',
      title: 'Grant Review', 
      desc: 'Win more grants with expert scoring, comments, and funder-ready polish.',
      link: '/grant-review'
    },
    { 
      image: '/tool-scenario.jpg',
      title: 'Scenario Planning', 
      desc: 'Stress-test strategy with clear "what-if" scenarios before risks hit.',
      link: '/scenario-planner'
    },
    {
      image: '/cert-leadership.jpg',
      title: 'Edge Leadership\nAssessment',
      desc: 'Assess leadership across four dimensions — self, staff, or 180° with your team.',
      link: '/leadership-assessment'
    },
    { 
      image: '/tool-ceo.jpg',
      title: 'Board & CEO\nAssessment', 
      desc: 'CEO self-assessment, board effectiveness, and board-led CEO evaluation — all in one place.',
      link: '/ceo-board'
    },
    { 
      image: '/tool-resources.jpg',
      title: 'Member\nResources', 
      desc: 'Access templates, guides, and trainings—new tools added each month.',
      link: '/resources'
    },
  ]

  return (
    <div className="min-h-screen">
      {/* ==================== HEADER ==================== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between" style={{ height: '120px' }}>
            <button onClick={() => handleNavigate('/')} className="flex items-center border-none bg-transparent cursor-pointer p-0">
              <img 
                src="/logo.svg" 
                alt="The Nonprofit Edge" 
                style={{ width: '280px', height: 'auto' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.jpg'
                }}
              />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => handleNavigate('/why-we-exist')} className="text-gray-600 hover:text-gray-900 font-medium transition-colors bg-transparent border-none cursor-pointer text-base">
                Why We Exist
              </button>
              <button onClick={() => handleNavigate('#tools-section')} className="text-gray-600 hover:text-gray-900 font-medium transition-colors bg-transparent border-none cursor-pointer text-base">
                Tools
              </button>
              <button onClick={() => handleNavigate('#pricing-section')} className="text-gray-600 hover:text-gray-900 font-medium transition-colors bg-transparent border-none cursor-pointer text-base">
                Pricing
              </button>
              <button 
                onClick={() => handleNavigate('/login')}
                className="px-5 py-2.5 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity border-none cursor-pointer text-base"
                style={{ backgroundColor: TEAL }}
              >
                Sign In
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 bg-transparent border-none cursor-pointer"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-4 pb-2 border-t border-gray-100 mt-4">
              <div className="flex flex-col space-y-3">
                <button onClick={() => { handleNavigate('/why-we-exist'); setMobileMenuOpen(false); }} className="py-2 text-gray-600 hover:text-gray-900 font-medium bg-transparent border-none cursor-pointer text-left text-base">
                  Why We Exist
                </button>
                <button onClick={() => { handleNavigate('#tools-section'); setMobileMenuOpen(false); }} className="py-2 text-gray-600 hover:text-gray-900 font-medium bg-transparent border-none cursor-pointer text-left text-base">
                  Tools
                </button>
                <button onClick={() => { handleNavigate('#pricing-section'); setMobileMenuOpen(false); }} className="py-2 text-gray-600 hover:text-gray-900 font-medium bg-transparent border-none cursor-pointer text-left text-base">
                  Pricing
                </button>
                <button 
                  onClick={() => { handleNavigate('/login'); setMobileMenuOpen(false); }}
                  className="py-2.5 px-4 text-white rounded-lg font-semibold text-center border-none cursor-pointer text-base"
                  style={{ backgroundColor: TEAL }}
                >
                  Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="pt-32">
        {/* Hero Section */}
        <section className="py-16 md:py-20 px-6" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e6f7f9 100%)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight" style={{ color: NAVY }}>
                  Your Mission Deserves More Than Hope—
                  <span style={{ color: TEAL, fontStyle: 'italic' }}>It Needs an Edge.</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  The strategic toolkit behind $100M+ in nonprofit funding. Join 800+ leaders who've stopped guessing and started winning.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => handleNavigate('/signup')}
                    className="px-6 py-3 text-base font-semibold text-white rounded-lg transition hover:opacity-90 hover:shadow-lg border-none cursor-pointer"
                    style={{ backgroundColor: TEAL }}
                  >
                    Start Your Free Trial
                  </button>
                  <button 
                    onClick={() => handleNavigate('#tools-section')}
                    className="px-6 py-3 text-base font-semibold rounded-lg border-2 border-gray-300 hover:border-gray-400 transition flex items-center gap-2 bg-white cursor-pointer"
                    style={{ color: NAVY }}
                  >
                    <span className="w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs">▶</span>
                    See How It Works
                  </button>
                </div>
              </div>
              
              <div className="flex justify-center md:justify-start md:-ml-8">
                <div className="overflow-hidden" style={{ width: '100%', maxWidth: '550px' }}>
                  <img 
                    src="/hero-image.png"
                    alt="Nonprofit leader"
                    className="w-full h-auto object-contain scale-110"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="py-10 px-6 bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-6">
              Trusted by teams at
            </div>
            <div className="flex justify-center">
              <img 
                src="/trusted-logos.png" 
                alt="Trusted by Salvation Army, YMCA, American Red Cross, San Diego Zoo"
                className="h-16 md:h-20 lg:h-24 object-contain"
              />
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section className="py-16 px-6 bg-gray-50 scroll-mt-24" id="tools-section">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: NAVY }}>
                Stop Guessing. Start Knowing.
              </h2>
              <p className="text-lg text-gray-600">
                Professional-grade tools that transform how nonprofits lead, govern, and grow.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {tools.map((tool, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleNavigate(tool.link)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-gray-100 text-left cursor-pointer p-0"
                >
                  <div className="h-36 overflow-hidden">
                    <img 
                      src={tool.image}
                      alt={tool.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-bold mb-2 text-white rounded px-3 py-2" style={{ backgroundColor: NAVY, whiteSpace: 'pre-line', minHeight: '52px', display: 'flex', alignItems: 'center' }}>
                      {tool.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{tool.desc}</p>
                    <span className="text-sm font-semibold" style={{ color: TEAL }}>
                      Find out more →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Ask the Professor / Why We Exist Section */}
        <section className="py-16 px-6 bg-white scroll-mt-24" id="why-section">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="relative flex justify-center">
                <div className="rounded-2xl overflow-hidden bg-gray-100" style={{ maxWidth: '400px' }}>
                  <img 
                    src="/lyn-corbett.jpg"
                    alt="Dr. Lyn Corbett"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div 
                  className="absolute left-1/2 -translate-x-1/2 rounded-xl py-3 px-4 text-center text-white text-sm font-semibold"
                  style={{ backgroundColor: NAVY, maxWidth: '320px', bottom: '-16px' }}
                >
                  Over 25 Years of Nonprofit Experience
                </div>
              </div>
              
              <div>
                <h2 className="text-3xl font-extrabold mb-2" style={{ color: NAVY }}>
                  Ask the Professor
                </h2>
                <p className="text-lg mb-4" style={{ color: TEAL }}>
                  Like having a $500/hour consultant — available 24/7.
                </p>
                <p className="text-gray-600 mb-5 leading-relaxed">
                  Get expert strategic advice trained on Dr. Lyn Corbett's 25+ years of nonprofit consulting — real frameworks that have helped take organizations to the next level.
                </p>
                
                <div className="mb-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                    Questions Leaders Are Asking:
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-gray-600 text-sm">
                      <span style={{ color: TEAL }}>→</span>
                      "How do I transition my board from operational to strategic?"
                    </div>
                    <div className="flex items-start gap-2 text-gray-600 text-sm">
                      <span style={{ color: TEAL }}>→</span>
                      "Should we accept this major restricted gift?"
                    </div>
                    <div className="flex items-start gap-2 text-gray-600 text-sm">
                      <span style={{ color: TEAL }}>→</span>
                      "My board chair and ED had a major blow up. What's the best approach?"
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleNavigate('/ask-the-professor')}
                  className="inline-block px-6 py-3 text-base font-semibold text-white rounded-lg transition hover:opacity-90 border-none cursor-pointer"
                  style={{ backgroundColor: NAVY }}
                >
                  Ask Your First Question — Free
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Free Assessment CTA */}
        <section className="py-12 px-6 bg-gray-100">
          <div className="max-w-4xl mx-auto">
            <div 
              className="inline-block px-3 py-1 rounded text-xs font-bold mb-4"
              style={{ backgroundColor: NAVY, color: 'white' }}
            >
              FREE ASSESSMENT
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3" style={{ color: NAVY }}>
              Find the ONE Thing Holding Your Organization Back
            </h2>
            <p className="text-gray-600 mb-4">
              The Theory of Constraints tells us that every system has ONE bottleneck limiting everything else. Your nonprofit is no different — there's one thing standing between where you are and your next breakthrough. Find it in 3 minutes, and everything else starts to move. No login required.
            </p>
            <button
              onClick={() => handleNavigate('/assessment')}
              className="inline-block px-6 py-3 text-base font-semibold rounded-lg transition hover:opacity-90 border-none cursor-pointer"
              style={{ backgroundColor: TEAL, color: 'white' }}
            >
              Take the Free Assessment →
            </button>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 px-6 bg-white scroll-mt-32" id="pricing-section">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: NAVY }}>
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-gray-600">
                Start free. Upgrade when ready. Cancel anytime.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-5">
              {/* Essential */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-2" style={{ color: NAVY }}>Essential</h3>
                <div className="text-3xl font-extrabold mb-1" style={{ color: NAVY }}>$79<span className="text-sm font-normal text-gray-500">/mo</span></div>
                <div className="text-xs font-semibold mb-5" style={{ color: TEAL }}>Founding Member Rate</div>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> 1 user</li>
                  <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> 10 assessments/mo</li>
                  <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> 10 coaching sessions/mo</li>
                  <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> Full Resource Library</li>
                </ul>
                <button 
                  onClick={() => handleNavigate('/signup')}
                  className="block w-full py-2.5 text-center text-sm font-semibold rounded-lg border border-gray-200 hover:border-gray-300 transition bg-white cursor-pointer"
                  style={{ color: NAVY }}
                >
                  Start 3-Day Trial
                </button>
              </div>

              {/* Professional - Popular */}
              <div className="bg-white border-2 rounded-2xl p-6 relative shadow-lg" style={{ borderColor: TEAL }}>
                <div 
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: TEAL }}
                >
                  MOST POPULAR
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: NAVY }}>Professional</h3>
                <div className="text-3xl font-extrabold mb-1" style={{ color: NAVY }}>$159<span className="text-sm font-normal text-gray-500">/mo</span></div>
                <div className="text-xs font-semibold mb-5" style={{ color: TEAL }}>Founding Member Rate</div>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> Up to 5 team members</li>
                  <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> 25 assessments/mo</li>
                  <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> 25 coaching sessions per person/mo</li>
                  <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> Full Resource Library</li>
                </ul>
                <button 
                  onClick={() => handleNavigate('/signup')}
                  className="block w-full py-2.5 text-center text-sm font-semibold text-white rounded-lg transition hover:opacity-90 border-none cursor-pointer"
                  style={{ backgroundColor: TEAL }}
                >
                  Start 3-Day Trial
                </button>
              </div>

              {/* Premium */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-2" style={{ color: NAVY }}>Premium</h3>
                <div className="text-3xl font-extrabold mb-1" style={{ color: NAVY }}>$329<span className="text-sm font-normal text-gray-500">/mo</span></div>
                <div className="text-xs font-semibold mb-5" style={{ color: TEAL }}>Founding Member Rate</div>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> Everything in Professional</li>
                  <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> Up to 10 team members</li>
                  <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> Unlimited assessments</li>
                  <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> 500 coaching sessions/mo</li>
                  <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> Monthly coaching call</li>
                </ul>
                <button 
                  onClick={() => handleNavigate('/signup')}
                  className="block w-full py-2.5 text-center text-sm font-semibold rounded-lg border border-gray-200 hover:border-gray-300 transition bg-white cursor-pointer"
                  style={{ color: NAVY }}
                >
                  Start 3-Day Trial
                </button>
              </div>

              {/* Enterprise */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-2" style={{ color: NAVY }}>Enterprise</h3>
                <div className="text-3xl font-extrabold mb-1" style={{ color: NAVY }}>Let's Talk</div>
                <div className="text-xs font-semibold mb-5" style={{ color: TEAL }}>Custom solutions</div>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> Everything in Premium</li>
                  <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> Unlimited users</li>
                  <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> Custom integrations</li>
                  <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> Dedicated success manager</li>
                </ul>
                <button 
                  onClick={() => handleNavigate('mailto:lyn@thepivotalgroup.com')}
                  className="block w-full py-2.5 text-center text-sm font-semibold rounded-lg border border-gray-200 hover:border-gray-300 transition bg-white cursor-pointer"
                  style={{ color: NAVY }}
                >
                  Contact Sales
                </button>
              </div>
            </div>

            <p className="text-center mt-8 text-sm text-gray-500">
              🔒 <strong className="text-gray-700">Founding Member Rate:</strong> Lock in these prices forever. When we raise rates, yours stays the same.
            </p>
          </div>
        </section>
      </div>

      {/* ==================== FOOTER ==================== */}
      <footer style={{ backgroundColor: NAVY }} className="text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/logo.svg" 
                  alt="The Nonprofit Edge" 
                  className="h-14 w-auto brightness-0 invert"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.jpg'
                  }}
                />
                <span className="font-bold text-xl">The Nonprofit Edge</span>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                AI-powered strategic tools for nonprofit leaders. From complexity to clarity.
              </p>
              <p className="text-gray-400 text-sm">
                A product of The Pivotal Group Consultants Inc.
              </p>
            </div>

            {/* Tools */}
            <div>
              <h4 className="font-bold text-lg mb-4">Tools</h4>
              <ul className="space-y-3">
                <li><button onClick={() => handleNavigate('/ask-the-professor')} className="text-gray-300 hover:text-white text-sm transition-colors bg-transparent border-none cursor-pointer p-0">Ask the Professor</button></li>
                <li><button onClick={() => handleNavigate('/grant-review')} className="text-gray-300 hover:text-white text-sm transition-colors bg-transparent border-none cursor-pointer p-0">Grant Review</button></li>
                <li><button onClick={() => handleNavigate('/board-assessment')} className="text-gray-300 hover:text-white text-sm transition-colors bg-transparent border-none cursor-pointer p-0">Board Assessment</button></li>
                <li><button onClick={() => handleNavigate('/strategic-plan-checkup')} className="text-gray-300 hover:text-white text-sm transition-colors bg-transparent border-none cursor-pointer p-0">Strategic Plan Analysis</button></li>
                <li><button onClick={() => handleNavigate('/ceo-evaluation')} className="text-gray-300 hover:text-white text-sm transition-colors bg-transparent border-none cursor-pointer p-0">CEO Evaluation</button></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold text-lg mb-4">Company</h4>
              <ul className="space-y-3">
                <li><button onClick={() => handleNavigate('/why-we-exist')} className="text-gray-300 hover:text-white text-sm transition-colors bg-transparent border-none cursor-pointer p-0">Why We Exist</button></li>
                <li><button onClick={() => handleNavigate('#pricing-section')} className="text-gray-300 hover:text-white text-sm transition-colors bg-transparent border-none cursor-pointer p-0">Pricing</button></li>
                <li><a href="mailto:lyn@thepivotalgroup.com" className="text-gray-300 hover:text-white text-sm transition-colors">Contact</a></li>
                <li><a href="https://thepivotalgroup.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white text-sm transition-colors">The Pivotal Group</a></li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="font-bold text-lg mb-4">Account</h4>
              <ul className="space-y-3">
                <li><button onClick={() => handleNavigate('/login')} className="text-gray-300 hover:text-white text-sm transition-colors bg-transparent border-none cursor-pointer p-0">Sign In</button></li>
                <li><button onClick={() => handleNavigate('/signup')} className="text-gray-300 hover:text-white text-sm transition-colors bg-transparent border-none cursor-pointer p-0">Start Free Trial</button></li>
                <li><button onClick={() => handleNavigate('/dashboard')} className="text-gray-300 hover:text-white text-sm transition-colors bg-transparent border-none cursor-pointer p-0">Member Dashboard</button></li>
              </ul>
              <button 
                onClick={() => handleNavigate('/signup')}
                className="mt-6 inline-block px-5 py-2.5 text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity border-none cursor-pointer"
                style={{ backgroundColor: TEAL }}
              >
                Get Started Free →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-sm">© 2026 The Nonprofit Edge. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <button onClick={() => handleNavigate('/privacy')} className="text-gray-400 hover:text-white text-sm transition-colors bg-transparent border-none cursor-pointer p-0">Privacy Policy</button>
                <button onClick={() => handleNavigate('/terms')} className="text-gray-400 hover:text-white text-sm transition-colors bg-transparent border-none cursor-pointer p-0">Terms of Service</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Homepage
