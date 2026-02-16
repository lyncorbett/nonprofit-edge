import React, { useState, useEffect } from 'react';

const NAVY = '#0D2C54';
const TEAL = '#0097A7';

interface ScenarioPlannerLandingProps {
  onNavigate?: (route: string) => void;
  onGetStarted?: () => void;
}

const ScenarioPlannerLanding: React.FC<ScenarioPlannerLandingProps> = ({ onNavigate, onGetStarted }) => {
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
              Prepare Today — <span className="text-[#e11d48]">So Your Mission Survives Tomorrow</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Most nonprofits don't fail because of bad strategy. They struggle because something unexpected happens — and they weren't ready. This tool helps you think through possible futures before they arrive.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleGetStarted}
                className="inline-flex items-center justify-center px-6 py-3 bg-[#e11d48] text-white font-semibold rounded-lg hover:bg-[#be123c] transition-all"
              >
                Start Your Free Trial
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="rounded-xl overflow-hidden shadow-2xl">
            <img 
              src="/scenario-hero.jpg" 
              alt="Leadership team planning together"
              className="w-full h-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80';
              }}
            />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0D2C54] text-center mb-4">
            When Uncertainty Hits, Will You Be Ready?
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
            The organizations that thrive through disruption aren't the ones who predicted what would happen. They're the ones who thought it through before it did.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                img: '/scenario-leadership.jpg',
                fallback: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80',
                title: 'Leadership Transitions', 
                desc: "Your founding ED is retiring. They hold most of the donor relationships. The board hasn't led a search in 15 years. What's your plan?" 
              },
              { 
                img: '/scenario-funding.jpg',
                fallback: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80',
                title: 'Funding Shifts', 
                desc: "Your largest funder is signaling changes. You've heard 'budget cuts' mentioned. How would you absorb a 20% reduction? 40%?" 
              },
              { 
                img: '/scenario-disruption.jpg',
                fallback: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&q=80',
                title: 'External Disruption', 
                desc: "Economic downturn. Policy changes. Public health crisis. The question isn't if something will happen — it's whether you'll be ready." 
              },
            ].map((card, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden min-h-[320px] flex flex-col justify-end">
                <div 
                  className="absolute inset-0 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${card.img}), url(${card.fallback})` }} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
                <div className="relative z-10 p-8 text-white">
                  <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                  <p className="text-sm opacity-90 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0D2C54] text-center mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: 1, title: 'Choose a Scenario', desc: 'Select the situation that feels most important to explore right now' },
              { num: 2, title: 'Describe Futures', desc: 'Walk through best-case, most-likely, and worst-case for each scenario' },
              { num: 3, title: 'Assess Readiness', desc: 'Rate your confidence across four key dimensions' },
              { num: 4, title: 'Get Your Report', desc: 'Receive a board-ready document with patterns, questions, and playbook' },
            ].map((step, i) => (
              <div key={i} className="text-center relative">
                <div className="w-12 h-12 bg-[#0D2C54] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-[#0D2C54] mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
                {i < 3 && (
                  <span className="hidden lg:block absolute right-0 top-6 text-2xl text-gray-300">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get + Animated Mockup */}
      <section className="py-20 px-6 bg-[#0D2C54] text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">What You Get</h2>
          <p className="text-lg text-center opacity-85 max-w-xl mx-auto mb-12">
            A 5-7 page board-ready report that reflects your thinking and surfaces what you might have missed.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {[
                { title: 'Readiness Scorecard', desc: 'Your self-assessed scores across four dimensions with interpretation of what your pattern suggests.' },
                { title: 'Three Futures Analysis', desc: 'Your scenarios organized with insights about opportunities, strain points, and trigger points you identified.' },
                { title: 'Contingency Playbook', desc: 'Your first decisions, 30-day response plan, and stakeholder message — ready to share with your board.' },
                { title: 'Patterns Worth Discussing', desc: 'Cross-cutting themes from your responses — framed as board conversation starters, not problems to solve.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 py-4 border-b border-white/15 last:border-0">
                  <div className="w-6 h-6 bg-[#0097A7] rounded flex items-center justify-center text-sm flex-shrink-0 mt-1">✓</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm opacity-80 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Animated Mockup */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                <div className="w-3 h-3 rounded-full bg-gray-300" />
                <div className="w-3 h-3 rounded-full bg-gray-300" />
                <div className="w-3 h-3 rounded-full bg-gray-300" />
                <div className="flex-1 ml-3 bg-white rounded px-3 py-1 text-xs text-gray-500">
                  thenonprofitedge.com/tools/scenario-planner
                </div>
              </div>

              <div className="h-[340px] relative bg-gray-50 p-5">
                {/* Screen 1 */}
                <div className={`absolute inset-0 p-5 transition-opacity duration-500 ${currentScreen === 0 ? 'opacity-100' : 'opacity-0'}`}>
                  <h3 className="text-sm font-semibold text-[#0D2C54] mb-4">What scenario are you preparing for?</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['Leadership Transition', 'Funding Shift', 'Demand Increase', 'Workforce Strain', 'Technology Event', 'Regulatory Changes'].map((s, i) => (
                      <div key={i} className={`px-3 py-2 rounded text-xs border ${i === 0 ? 'bg-[#0D2C54] text-white border-[#0D2C54]' : 'bg-white text-gray-600 border-gray-200'}`}>
                        {s}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Screen 2 */}
                <div className={`absolute inset-0 p-5 transition-opacity duration-500 ${currentScreen === 1 ? 'opacity-100' : 'opacity-0'}`}>
                  <h3 className="text-sm font-semibold text-[#0D2C54] mb-4">Describe Your Three Futures</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Best Case', text: 'Smooth transition with 3-month overlap...' },
                      { label: 'Most Likely', text: 'Transition takes longer than expected...' },
                      { label: 'Worst Case', text: 'ED search fails. Contract cut 30%+...' },
                    ].map((f, i) => (
                      <div key={i} className="bg-white p-3 rounded border border-gray-200">
                        <h4 className="text-xs font-semibold text-[#0D2C54] uppercase tracking-wide mb-1">{f.label}</h4>
                        <p className="text-xs text-gray-600">{f.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Screen 3 */}
                <div className={`absolute inset-0 p-5 transition-opacity duration-500 ${currentScreen === 2 ? 'opacity-100' : 'opacity-0'}`}>
                  <h3 className="text-sm font-semibold text-[#0D2C54] mb-4">Your Readiness Self-Assessment</h3>
                  <div className="bg-white p-4 rounded border border-gray-200">
                    {[
                      { label: 'Operations', value: 3, width: '60%' },
                      { label: 'Finances', value: 2, width: '40%' },
                      { label: 'People', value: 3, width: '60%' },
                      { label: 'Reputation', value: 4, width: '80%' },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center mb-3 last:mb-0">
                        <span className="w-20 text-xs font-semibold text-[#0D2C54]">{s.label}</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded mx-3 overflow-hidden">
                          <div className="h-full bg-[#0D2C54] rounded" style={{ width: s.width }} />
                        </div>
                        <span className="w-8 text-right text-xs font-semibold text-gray-600">{s.value}/5</span>
                      </div>
                    ))}
                    <div className="text-center pt-3 mt-3 border-t border-gray-200">
                      <div className="text-xl font-bold text-[#0D2C54]">3.0 / 5</div>
                      <div className="text-xs font-semibold text-gray-500 uppercase">Mixed Readiness</div>
                    </div>
                  </div>
                </div>

                {/* Screen 4 */}
                <div className={`absolute inset-0 p-5 transition-opacity duration-500 ${currentScreen === 3 ? 'opacity-100' : 'opacity-0'}`}>
                  <h3 className="text-sm font-semibold text-[#0D2C54] mb-4">Your Scenario Readiness Report</h3>
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-200">
                      <div>
                        <div className="text-xs font-bold text-[#0D2C54]">Scenario Readiness Report</div>
                        <div className="text-xs text-gray-500">Harbor Community Services</div>
                      </div>
                      <div className="bg-gray-100 text-[#0D2C54] px-2 py-1 rounded text-xs font-semibold">3.0 / 5</div>
                    </div>
                    <div className="mb-3">
                      <h4 className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">Patterns Worth Discussing</h4>
                      <div className="flex gap-1 flex-wrap">
                        <span className="bg-gray-100 text-[#0D2C54] px-2 py-1 rounded text-xs font-semibold border border-gray-200">Concentration of Capacity</span>
                        <span className="bg-gray-100 text-[#0D2C54] px-2 py-1 rounded text-xs font-semibold border border-gray-200">Single Vulnerability</span>
                      </div>
                    </div>
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
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0D2C54] text-center mb-12">
            How This Compares to Hiring a Consultant
          </h2>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-3 bg-[#0D2C54] text-white">
              <div className="p-5 text-left font-semibold">What You Get</div>
              <div className="p-5 text-center font-semibold">Traditional Consultant</div>
              <div className="p-5 text-center font-semibold">The Nonprofit Edge</div>
            </div>

            {[
              { item: 'Scenario planning framework', consultant: true, edge: true },
              { item: 'Three futures analysis', consultant: true, edge: true },
              { item: 'Readiness assessment', consultant: true, edge: true },
              { item: 'Board-ready report', consultant: true, edge: true },
              { item: 'Available on your schedule', consultant: false, edge: true },
              { item: 'Results in under an hour', consultant: false, edge: true },
              { item: 'Repeat as often as needed', consultant: false, edge: true },
              { item: 'Typical cost', consultant: '$3,000 – $10,000+', edge: 'Included in membership' },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 border-b border-gray-200 last:border-0">
                <div className="p-4 text-sm font-medium text-[#0D2C54]">{row.item}</div>
                <div className="p-4 text-center text-sm text-gray-600">
                  {typeof row.consultant === 'boolean' ? (
                    row.consultant ? <span className="text-[#0097A7] text-lg">✓</span> : <span className="text-gray-400 text-lg">✗</span>
                  ) : row.consultant}
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
            This tool doesn't replace deep consulting engagements — it gives you a strong foundation to work from.
          </p>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#e11d48] to-[#be123c]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <blockquote className="text-2xl lg:text-3xl font-semibold italic leading-relaxed">
            "Scenario planning doesn't predict the future — it prepares you to lead through it."
          </blockquote>
          <cite className="block mt-6 text-base not-italic opacity-70">— From The Nonprofit Edge</cite>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0D2C54] mb-4">
            Ready to Think Through What's Ahead?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Take 20 minutes to explore the uncertainties that matter most to your organization. Your report will be ready immediately.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={handleGetStarted}
              className="inline-flex items-center justify-center px-6 py-3 bg-[#e11d48] text-white font-semibold rounded-lg hover:bg-[#be123c] transition-all"
            >
              Start Your Free Trial
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScenarioPlannerLanding;
