/**
 * Homepage - The Nonprofit Edge
 * Uses regular anchor tags for navigation
 */

import React from 'react'

const NAVY = '#1a365d'
const TEAL = '#00a0b0'

const Homepage: React.FC = () => {
  const tools = [
    { 
      image: '/tool-strategic.jpg',
      title: 'Strategic Plan Analysis', 
      desc: 'Diagnose your current plan in minutes with scores & specific fixes.',
      link: '/tools/strategic-plan-analysis'
    },
    { 
      image: '/tool-grant.jpg',
      title: 'Grant Review', 
      desc: 'Win more grants with expert scoring, comments, and funder-ready polish.',
      link: '/tools/grant-review'
    },
    { 
      image: '/tool-scenario.jpg',
      title: 'Strategy & Scenario Planning', 
      desc: 'Stress-test strategy with clear "what-if" scenarios before risks hit.',
      link: '/tools/scenario-planning'
    },
    { 
      image: '/tool-ceo.jpg',
      title: 'CEO Evaluation', 
      desc: 'Build stronger leadership with fair, confidential performance reviews.',
      link: '/tools/ceo-evaluation'
    },
    { 
      image: '/board-hero.jpg',
      title: 'Board Assessment', 
      desc: 'Strengthen governance with measurable board practices & next steps.',
      link: '/tools/board-assessment'
    },
    { 
      image: '/tool-resources.jpg',
      title: 'Member Resources', 
      desc: 'Access templates, guides, and trainings—new tools added each month.',
      link: '/resources'
    },
  ]

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-16 md:py-20 px-6" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e6f7f9 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
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
                <a 
                  href="/signup"
                  className="px-6 py-3 text-base font-semibold text-white rounded-lg transition hover:opacity-90 hover:shadow-lg inline-block"
                  style={{ backgroundColor: TEAL }}
                >
                  Start Your Free Trial
                </a>
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
            
            {/* Right: Hero Image */}
            <div className="flex justify-center md:justify-end">
              <div 
                className="overflow-hidden"
                style={{ 
                  width: '100%',
                  maxWidth: '450px',
                }}
              >
                <img 
                  src="/hero-image.png"
                  alt="Nonprofit leader"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 px-6 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
            Trusted By
          </div>
          <div className="flex justify-center">
            <img 
              src="/trusted-logos.png" 
              alt="Trusted by Salvation Army, YMCA, American Red Cross, San Diego Zoo"
              className="h-12 md:h-16 object-contain"
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
                    Launch Tool →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Ask the Professor Section */}
      <section className="py-16 px-6 bg-white" id="professor">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Image */}
            <div className="relative">
              <div 
                className="rounded-2xl overflow-hidden bg-gray-100"
                style={{ maxWidth: '320px' }}
              >
                <img 
                  src="/dr-corbett.jpg"
                  alt="Dr. Lyn Corbett"
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Badge */}
              <div 
                className="absolute bottom-4 left-4 right-4 rounded-xl py-3 px-4 text-center text-white text-sm font-semibold"
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
              <p className="text-gray-600 mb-6 leading-relaxed">
                It's like having an expert consultant in your back pocket. Get expert-level strategic advice, available 24/7. Trained on Dr. Lyn Corbett's decades of nonprofit consulting — not generic AI.
              </p>
              
              <div className="mb-6">
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
              
              <a
                href="/ask-the-professor"
                className="inline-block px-6 py-3 text-base font-semibold text-white rounded-lg transition hover:opacity-90"
                style={{ backgroundColor: NAVY }}
              >
                Ask Your First Question — Free
              </a>
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
          <a
            href="/assessment"
            className="inline-block mt-4 px-6 py-3 text-base font-semibold rounded-lg transition hover:opacity-90"
            style={{ backgroundColor: TEAL, color: 'white' }}
          >
            Take the Assessment →
          </a>
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
              <a 
                href="/signup"
                className="block w-full py-2.5 text-center text-sm font-semibold rounded-lg border border-gray-200 hover:border-gray-300 transition"
                style={{ color: NAVY }}
              >
                Start 3-Day Trial
              </a>
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
              <a 
                href="/signup"
                className="block w-full py-2.5 text-center text-sm font-semibold text-white rounded-lg transition hover:opacity-90"
                style={{ backgroundColor: TEAL }}
              >
                Start 3-Day Trial
              </a>
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
              <a 
                href="/signup"
                className="block w-full py-2.5 text-center text-sm font-semibold rounded-lg border border-gray-200 hover:border-gray-300 transition"
                style={{ color: NAVY }}
              >
                Start 3-Day Trial
              </a>
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
  )
}

export default Homepage
