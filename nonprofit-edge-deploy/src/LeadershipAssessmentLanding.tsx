import React, { useState, useEffect } from 'react';

const NAVY = '#0D2C54';
const TEAL = '#0097A7';

interface LeadershipAssessmentLandingProps {
  onNavigate?: (route: string) => void;
  onGetStarted?: () => void;
}

const LeadershipAssessmentLanding: React.FC<LeadershipAssessmentLandingProps> = ({ onNavigate, onGetStarted }) => {
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
            <span className="inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4" style={{ backgroundColor: '#0097A715', color: TEAL }}>
              Edge Leadership Assessment
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-5" style={{ color: NAVY }}>
              What Kind of Leader Are You <span style={{ color: TEAL }}>Becoming?</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Most leadership assessments tell you what type you are. The Edge Leadership Profile tells you what's actually working, what's not, and what to do next — across four dimensions that determine whether a leader can sustain impact over time.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleGetStarted}
                className="inline-flex items-center justify-center px-6 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
                style={{ backgroundColor: TEAL }}
              >
                Start Your Free Trial
              </button>
              <a href="/samples/leadership-profile-report.pdf" className="inline-flex items-center justify-center px-6 py-3 border-2 font-semibold rounded-lg hover:text-white transition-all" style={{ borderColor: NAVY, color: NAVY }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = NAVY; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = NAVY; }}
              >
                View Sample Report
              </a>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden shadow-2xl">
            <img 
              src="/leaderlanding.jpg" 
              alt="Leadership assessment" 
              className="w-full h-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/leaderlanding.jpg';
              }}
            />
          </div>
        </div>
      </section>

      {/* The Four Dimensions */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4" style={{ color: NAVY }}>Four Dimensions That Actually Matter</h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">We don't believe leadership is a personality type — it's a set of practices. And practices can be measured, developed, and strengthened over time.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { 
                color: '#10b981',
                title: 'Vision & Clarity', 
                question: 'Do I know what I stand for and where we\'re going?',
                desc: 'Measures your ability to articulate direction in ways that pull people forward — not just having a vision, but ensuring others can see it, feel it, and act on it.' 
              },
              { 
                color: '#f97316',
                title: 'People Investment', 
                question: 'Do I put real time into the people and priorities that matter most?',
                desc: 'Measures whether you develop people intentionally or reactively. Grounded in servant leadership theory and research on delegation and succession planning.' 
              },
              { 
                color: '#8b5cf6',
                title: 'Radical Ownership', 
                question: 'Do I own my decisions, challenges, and my part in what happens?',
                desc: 'Measures your willingness to own outcomes without deflecting. Not just taking responsibility, but creating cultures where ownership is shared.' 
              },
              { 
                color: '#eab308',
                title: 'Growth & Reflection', 
                question: 'Do I slow down, learn from experience, and keep growing?',
                desc: 'Measures whether growth is a discipline or an accident. The dimension that determines whether your other three scores improve over time.' 
              },
            ].map((dim, i) => (
              <div key={i} className="bg-white rounded-xl p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dim.color }} />
                  <h3 className="text-lg font-bold" style={{ color: NAVY }}>{dim.title}</h3>
                </div>
                <p className="text-sm font-semibold italic mb-3" style={{ color: dim.color }}>{dim.question}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{dim.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Ways to Use It */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4" style={{ color: NAVY }}>Three Ways to Use It</h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">Same 48 questions, different perspectives. Choose the mode that fits your situation.</p>
          <div className="space-y-6">
            {[
              { 
                title: 'Self-Assessment', 
                badge: 'You only',
                badgeColor: TEAL,
                desc: 'Take the assessment yourself and get your personal leadership profile. 15-20 minutes, report is instant.',
                who: 'Just you. Results are private.'
              },
              { 
                title: 'Staff Assessment', 
                badge: 'Manager → Employee',
                badgeColor: '#7c3aed',
                desc: 'Assess a direct report\'s leadership across all four dimensions. They receive a personalized development report.',
                who: 'You assess your employee. They get the report.'
              },
              { 
                title: '180° Assessment', 
                badge: 'Manager + Employee',
                badgeColor: '#d97706',
                desc: 'You assess an employee and they assess themselves. Both perspectives combine into one report with a conversation guide.',
                who: 'You assess them, they self-assess. Combined report goes to both.'
              },
            ].map((mode, i) => (
              <div key={i} className="bg-white rounded-xl p-8 border border-gray-200 flex flex-col sm:flex-row sm:items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold" style={{ color: NAVY }}>{mode.title}</h3>
                    <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: mode.badgeColor + '15', color: mode.badgeColor }}>{mode.badge}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{mode.desc}</p>
                  <p className="text-xs text-gray-500"><strong style={{ color: NAVY }}>Who takes it:</strong> {mode.who}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get + Animated Mockup */}
      <section className="py-20 px-6" style={{ backgroundColor: NAVY }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-white mb-4">What Your Report Includes</h2>
          <p className="text-lg text-center text-white opacity-85 max-w-xl mx-auto mb-12">Not a generic personality label — a specific, actionable development plan.</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {[
                { title: 'Dimension Scores with Benchmarks', desc: 'Each dimension scored 0-100% and placed into Leading Edge, Common Practice, or Developing zones.' },
                { title: 'Pattern Analysis', desc: 'How your dimensions interact — revealing blind spots like high ownership masking low delegation.' },
                { title: 'Coaching Insights', desc: 'Expert commentary on what your scores actually mean and where the leverage points are.' },
                { title: '30-60-90 Day Growth Plan', desc: 'Focused on your highest-leverage growth area with specific milestones and actions.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 py-4 border-b border-white/15 last:border-0">
                  <div className="w-6 h-6 rounded flex items-center justify-center text-sm flex-shrink-0 mt-1" style={{ backgroundColor: TEAL }}>✓</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-white opacity-80 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Animated Mockup */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-gray-400 font-medium">Edge Leadership Profile</span>
              </div>
              <div className="p-6" style={{ minHeight: '320px' }}>
                {/* Screen 1: Overall Score */}
                {currentScreen === 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Executive Summary</p>
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center" style={{ borderColor: TEAL }}>
                        <span className="text-2xl font-extrabold" style={{ color: NAVY }}>76%</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: NAVY }}>Overall Leadership Score</p>
                        <p className="text-xs text-gray-500">Sarah Mitchell, Executive Director</p>
                      </div>
                    </div>
                    {[
                      { name: 'Vision & Clarity', score: 82, color: '#10b981' },
                      { name: 'People Investment', score: 64, color: '#f97316' },
                      { name: 'Radical Ownership', score: 85, color: '#8b5cf6' },
                      { name: 'Growth & Reflection', score: 73, color: '#eab308' },
                    ].map((d, i) => (
                      <div key={i} className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold" style={{ color: NAVY }}>{d.name}</span>
                          <span className="font-bold" style={{ color: d.color }}>{d.score}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${d.score}%`, backgroundColor: d.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Screen 2: Pattern Analysis */}
                {currentScreen === 1 && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Pattern Analysis</p>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                      <p className="text-sm font-bold" style={{ color: NAVY }}>The Ownership Paradox</p>
                      <p className="text-xs text-gray-600 mt-1">High Ownership (85%) + Low Delegation (64%) = you're carrying too much.</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                      <p className="text-sm font-bold" style={{ color: NAVY }}>The Reflection Deficit</p>
                      <p className="text-xs text-gray-600 mt-1">Self-Awareness (82%) outpaces Reflective Practice (61%).</p>
                    </div>
                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                      <p className="text-sm font-bold" style={{ color: NAVY }}>Clarity Without Dialogue</p>
                      <p className="text-xs text-gray-600 mt-1">Vision (82%) flows one direction — from you outward.</p>
                    </div>
                  </div>
                )}

                {/* Screen 3: Growth Plan */}
                {currentScreen === 2 && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">30-60-90 Day Growth Plan</p>
                    <p className="text-xs text-gray-500 mb-4">Focused on People Investment — your highest-leverage area</p>
                    {[
                      { day: '30', title: 'Build the Baseline', items: ['Schedule 3 development 1:1s', 'Map your delegation patterns'] },
                      { day: '60', title: 'Systematize Development', items: ['Create plans for top 3 reports', 'Delegate one major responsibility'] },
                      { day: '90', title: 'Build the Bench', items: ['Build a succession map', 'Track leadership moments'] },
                    ].map((phase, i) => (
                      <div key={i} className="flex gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: TEAL }}>
                          {phase.day}d
                        </div>
                        <div>
                          <p className="text-sm font-bold" style={{ color: NAVY }}>{phase.title}</p>
                          {phase.items.map((item, j) => (
                            <p key={j} className="text-xs text-gray-500">• {item}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Screen 4: Coaching Insight */}
                {currentScreen === 3 && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Coaching Insight</p>
                    <div className="bg-gray-50 rounded-lg p-5 mb-4">
                      <p className="text-sm font-semibold mb-2" style={{ color: NAVY }}>Radical Ownership — 85%</p>
                      <p className="text-xs text-gray-600 leading-relaxed italic">
                        "Your Accountability (92%) is exceptional, but your Shared Ownership (72%) reveals a tension: you own so much that others may have learned to let you. Your strength, unchecked, becomes the ceiling for everyone else."
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1 text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-xs font-bold text-green-700">Accountability</p>
                        <p className="text-lg font-extrabold text-green-600">92%</p>
                      </div>
                      <div className="flex-1 text-center p-3 bg-amber-50 rounded-lg">
                        <p className="text-xs font-bold text-amber-700">Shared Ownership</p>
                        <p className="text-lg font-extrabold text-amber-600">72%</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Dots */}
              <div className="flex justify-center gap-2 pb-4">
                {screens.map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full transition-all" style={{ backgroundColor: i === currentScreen ? TEAL : '#e2e8f0' }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-24 px-6" style={{ background: `linear-gradient(135deg, ${TEAL}, #00838F)` }}>
        <div className="max-w-3xl mx-auto text-center text-white">
          <p className="text-2xl lg:text-3xl font-semibold italic leading-relaxed mb-6">
            "Nonprofit leaders don't fail because they lack passion — they fail because the systems around them never measured the things that actually matter."
          </p>
          <p className="font-semibold text-lg">Dr. Lyn Corbett</p>
          <p className="text-sm opacity-80">Founder, The Nonprofit Edge</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: NAVY }}>Find Out What Kind of Leader You're Becoming</h2>
          <p className="text-lg text-gray-600 mb-8">48 questions. 15 minutes. A report that actually tells you something useful.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={handleGetStarted}
              className="inline-flex items-center justify-center px-6 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
              style={{ backgroundColor: TEAL }}
            >
              Start Your Free Trial
            </button>
            <a href="/samples/leadership-profile-report.pdf" className="inline-flex items-center justify-center px-6 py-3 border-2 font-semibold rounded-lg hover:text-white transition-all" style={{ borderColor: NAVY, color: NAVY }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = NAVY; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = NAVY; }}
            >
              View Sample Report
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LeadershipAssessmentLanding;
