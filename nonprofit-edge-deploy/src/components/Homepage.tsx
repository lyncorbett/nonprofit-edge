/**
 * Homepage - The Nonprofit Edge
 * Updated: Added Header with Sign In and Footer
 */

import React, { useState } from 'react'

const NAVY = '#1a365d'
const TEAL = '#00a0b0'

interface HomepageProps {
  onNavigate?: (page: string) => void
}

const Homepage: React.FC<HomepageProps> = ({ onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Navigation handler - works with or without onNavigate prop
  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page)
    } else {
      window.location.href = `/${page}`
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
      link: '/grant-rfp-review'
    },
    { 
      image: '/tool-scenario.jpg',
      title: 'Strategy & Scenario Planning', 
      desc: 'Stress-test strategy with clear "what-if" scenarios before risks hit.',
      link: '/scenario-planner'
    },
    { 
      image: '/tool-ceo.jpg',
      title: 'CEO Evaluation', 
      desc: 'Build stronger leadership with fair, confidential performance reviews.',
      link: '/ceo-evaluation'
    },
    { 
      image: '/board-hero.jpg',
      title: 'Board Assessment', 
      desc: 'Strengthen governance with measurable board practices & next steps.',
      link: '/board-assessment'
    },
    { 
      image: '/tool-resources.jpg',
      title: 'Member Resources', 
      desc: 'Access templates, guides, and trainings—new tools added each month.',
      link: '/resources'
    },
  ]

  return (
    <div className="min-h-screen">
      {/* ==================== HEADER ==================== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button onClick={() => handleNavigate('home')} className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: TEAL }}
              >
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="font-bold text-xl" style={{ color: NAVY }}>The Nonprofit Edge</span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#tools" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Tools
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Pricing
              </a>
              <a href="#professor" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                About
              </a>
              <button 
                onClick={() => handleNavigate('login')}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => handleNavigate('signup')}
                className="px-5 py-2.5 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: TEAL }}
              >
                Start Free Trial
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
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
                <a href="#tools" className="py-2 text-gray-600 hover:text-gray-900 font-medium">
                  Tools
                </a>
                <a href="#pricing" className="py-2 text-gray-600 hover:text-gray-900 font-medium">
                  Pricing
                </a>
                <a href="#professor" className="py-2 text-gray-600 hover:text-gray-900 font-medium">
                  About
                </a>
                <button 
                  onClick={() => handleNavigate('login')}
                  className="py-2 text-gray-600 hover:text-gray-900 font-medium text-left"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => handleNavigate('signup')}
                  className="py-2.5 px-4 text-white rounded-lg font-semibold text-center"
                  style={{ backgroundColor: TEAL }}
                >
                  Start Free Trial
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="pt-16">
        {/* Hero Section */}
        <section className="py-16 md:py-20 px-6" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e6f7f9 100%)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left: Text */}
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight" style={{ color: NAVY }}>
                  Your Mission Deserves More Than Hope—
                  <span style={{ color: TEAL, fontStyle: 'italic' }}>It Needs an Edge.</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Discover the strategic tools top nonprofit leaders use to unlock clarity, funding, and impact.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => handleNavigate('signup')}
                    className="px-6 py-3 text-base font-semibold text-white rounded-lg transition hover:opacity-90 hover:shadow-lg"
                    style={{ backgroundColor: TEAL }}
                  >
                    Start Your Free Trial
                  </button>
                  <a 
                    href="#demo"
                    className="px-6 py-3 text-base font-semibold rounded-lg border-2 border-gray-300 hover:border-gray-400 transition flex items-center gap-2 bg-white"
                    style={{ color: NAVY }}
                  >
                    <span className="w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs">▶</span>
                    See How It Works
                  </a>
                </div>
              </div>
              
              {/* Right: Hero Image - BIGGER and moved LEFT */}
              <div className="flex justify-center md:justify-start md:-ml-8">
                <div 
                  className="overflow-hidden"
                  style={{ 
                    width: '100%',
                    maxWidth: '550px',
                  }}
                >
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

        {/* Trust Bar - LARGER LOGOS */}
        <section className="py-10 px-6 bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-6">
              Trusted By
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
        <section className="py-16 px-6 bg-gray-50" id="tools">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: NAVY }}>
                Stop Guessing. Start Knowing.
              </h2>
              <p className="text-lg text-gray-600">
                Professional tools that transform how nonprofits lead and govern
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {tools.map((tool, idx) => (
                <a 
                  key={idx}
                  href={tool.link}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-gray-100"
                >
                  {/* Image */}
                  <div className="h-36 overflow-hidden">
                    <img 
                      src={tool.image}
                      alt={tool.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-base font-bold mb-2 text-white rounded px-3 py-2" style={{ backgroundColor: NAVY }}>
                      {tool.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{tool.desc}</p>
                    <span className="text-sm font-semibold" style={{ color: TEAL }}>
                      Find out more →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Ask the Professor Section - BALANCED SPACING */}
        <section className="py-16 px-6 bg-white" id="professor">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Left: Image */}
              <div className="relative flex justify-center">
                <div 
                  className="rounded-2xl overflow-hidden bg-gray-100"
                  style={{ maxWidth: '300px' }}
                >
                  <img 
                    src="/dr-corbett.jpg"
                    alt="Dr. Lyn Corbett"
                    className="w-full h-auto object-cover"
                  />
                </div>
                {/* Badge */}
                <div 
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-xl py-3 px-4 text-center text-white text-sm font-semibold"
                  style={{ backgroundColor: NAVY, maxWidth: '280px' }}
                >
                  Over 25 Years of Nonprofit Experience
                </div>
              </div>
              
              {/* Right: Content */}
              <div>
                <h2 className="text-3xl font-extrabold mb-2" style={{ color: NAVY }}>
                  Ask the Professor
                </h2>
                <p className="text-lg mb-4" style={{ color: TEAL }}>
                  Strategic guidance built on 25+ years of real-world experience
                </p>
                <p className="text-gray-600 mb-5 leading-relaxed">
                  It's like having an expert consultant in your back pocket. Get expert-level strategic advice, available 24/7. Trained on Dr. Lyn Corbett's decades of nonprofit consulting — not generic AI.
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
                      "What's the best approach to a difficult ED/Board Chair relationship?"
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleNavigate('ask-professor')}
                  className="px-6 py-3 text-base font-semibold text-white rounded-lg transition hover:opacity-90"
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
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2" style={{ color: NAVY }}>
              Every nonprofit has ONE constraint holding them back. What's yours?
              <span className="text-base font-normal text-gray-500 ml-2">
                Find out in 3 minutes — no login required.
              </span>
            </h2>
            <button
              onClick={() => handleNavigate('assessment')}
              className="mt-4 px-6 py-3 text-base font-semibold rounded-lg transition hover:opacity-90"
              style={{ backgroundColor: TEAL, color: 'white' }}
            >
              Take the Assessment →
            </button>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 px-6 bg-white" id="pricing">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: NAVY }}>
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-gray-600">
                Start free. Upgrade when you're ready. Cancel anytime.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-5">
              {/* Essential */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-2" style={{ color: NAVY }}>Essential</h3>
                <div className="text-3xl font-extrabold mb-1" style={{ color: NAVY }}>$79<span className="text-sm font-normal text-gray-500">/mo</span></div>
                <div className="text-xs font-semibold mb-5" style={{ color: TEAL }}>Founding Member Rate</div>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-start gap-2 text-gray-600">
                    <span style={{ color: TEAL }}>✓</span> 1 person
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span style={{ color: TEAL }}>✓</span> 10 assessments/month
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span style={{ color: TEAL }}>✓</span> 100 Ask the Professor/month
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span style={{ color: TEAL }}>✓</span> Full Resource Library
                  </li>
                </ul>
                <button 
                  onClick={() => handleNavigate('signup')}
                  className="block w-full py-2.5 text-center text-sm font-semibold rounded-lg border border-gray-200 hover:border-gray-300 transition"
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
                  <li className="flex items-start gap-2 text-gray-600">
                    <span style={{ color: TEAL }}>✓</span> Up to 5 team members
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span style={{ color: TEAL }}>✓</span> 25 assessments/month
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span style={{ color: TEAL }}>✓</span> Unlimited Ask the Professor
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span style={{ color: TEAL }}>✓</span> Full Resource Library
                  </li>
                </ul>
                <button 
                  onClick={() => handleNavigate('signup')}
                  className="block w-full py-2.5 text-center text-sm font-semibold text-white rounded-lg transition hover:opacity-90"
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
                  <li className="flex items-start gap-2 text-gray-600">
                    <span style={{ color: TEAL }}>✓</span> Everything in Professional
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span style={{ color: TEAL }}>✓</span> Up to 10 team members
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span style={{ color: TEAL }}>✓</span> Unlimited assessments
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span style={{ color: TEAL }}>✓</span> Monthly coaching call
                  </li>
                </ul>
                <button 
                  onClick={() => handleNavigate('signup')}
                  className="block w-full py-2.5 text-center text-sm font-semibold rounded-lg border border-gray-200 hover:border-gray-300 transition"
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
                  <li className="flex items-start gap-2 text-gray-600">
                    <span style={{ color: TEAL }}>✓</span> Everything in Premium
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span style={{ color: TEAL }}>✓</span> Unlimited users
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span style={{ color: TEAL }}>✓</span> Custom integrations
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span style={{ color: TEAL }}>✓</span> Dedicated success manager
                  </li>
                </ul>
                <a 
                  href="mailto:lyn@thepivotalgroup.com"
                  className="block w-full py-2.5 text-center text-sm font-semibold rounded-lg border border-gray-200 hover:border-gray-300 transition"
                  style={{ color: NAVY }}
                >
                  Contact Sales
                </a>
              </div>
            </div>

            <p className="text-center mt-8 text-sm text-gray-500">
              🔒 <strong className="text-gray-700">Founding Member Rate:</strong> Lock in these prices forever. When we raise rates, yours stays the same as long as you remain a member.
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
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: TEAL }}
                >
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
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
                <li>
                  <button onClick={() => handleNavigate('ask-professor')} className="text-gray-300 hover:text-white text-sm transition-colors">
                    Ask the Professor
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('grant-review')} className="text-gray-300 hover:text-white text-sm transition-colors">
                    Grant Review
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('board-assessment')} className="text-gray-300 hover:text-white text-sm transition-colors">
                    Board Assessment
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('strategic-checkup')} className="text-gray-300 hover:text-white text-sm transition-colors">
                    Strategic Plan Analysis
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('ceo-evaluation')} className="text-gray-300 hover:text-white text-sm transition-colors">
                    CEO Evaluation
                  </button>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold text-lg mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#professor" className="text-gray-300 hover:text-white text-sm transition-colors">About Us</a></li>
                <li><a href="#pricing" className="text-gray-300 hover:text-white text-sm transition-colors">Pricing</a></li>
                <li><a href="mailto:support@thenonprofitedge.com" className="text-gray-300 hover:text-white text-sm transition-colors">Contact</a></li>
                <li><a href="https://thepivotalgroup.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white text-sm transition-colors">The Pivotal Group</a></li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="font-bold text-lg mb-4">Account</h4>
              <ul className="space-y-3">
                <li>
                  <button onClick={() => handleNavigate('login')} className="text-gray-300 hover:text-white text-sm transition-colors">
                    Sign In
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('signup')} className="text-gray-300 hover:text-white text-sm transition-colors">
                    Start Free Trial
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('dashboard')} className="text-gray-300 hover:text-white text-sm transition-colors">
                    Member Dashboard
                  </button>
                </li>
              </ul>
              <button 
                onClick={() => handleNavigate('signup')}
                className="mt-6 px-5 py-2.5 text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
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
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Homepage
