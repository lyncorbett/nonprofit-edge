import React, { useState, useEffect } from 'react';

const BoardAssessmentLanding: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const screens = ['screen1', 'screen2', 'screen3', 'screen4'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScreen((prev) => (prev + 1) % screens.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <span className="inline-block bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              Board Assessment
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-[#0D2C54] leading-tight mb-5">
              Is Your Board a <span className="text-purple-600">Strategic Asset</span> or a Compliance Burden?
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Transform underperforming boards into engaged, skilled partners who advance your mission — not just approve minutes.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/signup" className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all">
                Start Your Free Trial
              </a>
              <a href="/samples/board-assessment-report.pdf" className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#0D2C54] text-[#0D2C54] font-semibold rounded-lg hover:bg-[#0D2C54] hover:text-white transition-all">
                View Sample Report
              </a>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden shadow-2xl">
            <img src="/images/board-meeting.jpg" alt="Engaged board meeting" className="w-full h-auto" />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0D2C54] text-center mb-4">Board Dysfunction Costs You Every Month</h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">Half your board shows up. The other half just says yes. And you're left doing all the work.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { img: '/images/board-disengaged.jpg', title: 'Disengaged Members', desc: 'Half your board shows up. The other half just nods along. Meetings drag without decisions.' },
              { img: '/images/board-skills.jpg', title: 'Missing Skills', desc: 'You need marketing expertise but have three lawyers. Major decisions lack diverse input.' },
              { img: '/images/board-fundraising.jpg', title: 'Fundraising Failures', desc: 'Board gives $500/year per person. "Give or get" exists on paper only.' },
            ].map((card, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden min-h-[320px] flex flex-col justify-end">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${card.img})` }} />
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
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0D2C54] text-center mb-12">From Assessment to Action</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { num: 1, title: 'Send Assessment', desc: 'Board members receive anonymous survey. Automated reminders ensure participation.' },
              { num: 2, title: 'Get Analysis', desc: 'Instant skills matrix, gap analysis, and engagement scores.' },
              { num: 3, title: 'Take Action', desc: 'Use facilitation guides and templates to improve your board.' },
            ].map((step, i) => (
              <div key={i} className="text-center relative">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">{step.num}</div>
                <h3 className="text-lg font-bold text-[#0D2C54] mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
                {i < 2 && <span className="hidden sm:block absolute right-0 top-6 text-2xl text-gray-300">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get + Animated Mockup */}
      <section className="py-20 px-6 bg-[#0D2C54] text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">What You Get</h2>
          <p className="text-lg text-center opacity-85 max-w-xl mx-auto mb-12">Everything you need to build an exceptional board.</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {[
                { title: 'Skills Matrix Mapping', desc: "Visual heat map showing exactly which skills you have and what's missing." },
                { title: 'Engagement Analytics', desc: 'Track attendance, participation, giving, and committee work at a glance.' },
                { title: 'Gap Analysis', desc: 'Instant identification of missing expertise, connections, and diversity.' },
                { title: 'Recruitment Profiles', desc: 'Get exact job descriptions for the board members you need.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 py-4 border-b border-white/15 last:border-0">
                  <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center text-sm flex-shrink-0 mt-1">✓</div>
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
                <div className="w-3 h-3 rounded-full bg-gray-300" /><div className="w-3 h-3 rounded-full bg-gray-300" /><div className="w-3 h-3 rounded-full bg-gray-300" />
                <div className="flex-1 ml-3 bg-white rounded px-3 py-1 text-xs text-gray-500">thenonprofitedge.com/tools/board-assessment</div>
              </div>
              <div className="h-[340px] relative bg-gray-50 p-5">
                <div className={`absolute inset-0 p-5 transition-opacity duration-500 ${currentScreen === 0 ? 'opacity-100' : 'opacity-0'}`}>
                  <h3 className="text-sm font-semibold text-[#0D2C54] mb-4">Board Self-Assessment Survey</h3>
                  <div className="bg-white p-4 rounded border border-gray-200">
                    {['Jane Davis - Chair', 'Michael Rodriguez - Treasurer', 'Sarah Kim - Member'].map((m, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="text-xs text-gray-700">{m}</span>
                        <span className={`text-xs px-2 py-1 rounded ${i < 2 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{i < 2 ? 'Complete' : 'Pending'}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={`absolute inset-0 p-5 transition-opacity duration-500 ${currentScreen === 1 ? 'opacity-100' : 'opacity-0'}`}>
                  <h3 className="text-sm font-semibold text-[#0D2C54] mb-4">Board Skills Matrix</h3>
                  <div className="flex flex-wrap gap-2">
                    {[{ skill: 'Finance', level: 'strong' }, { skill: 'Legal', level: 'gap' }, { skill: 'Marketing', level: 'moderate' }, { skill: 'Fundraising', level: 'strong' }, { skill: 'Technology', level: 'gap' }, { skill: 'HR', level: 'moderate' }].map((s, i) => (
                      <span key={i} className={`px-3 py-1 rounded-full text-xs font-medium ${s.level === 'strong' ? 'bg-purple-600 text-white' : s.level === 'gap' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600'}`}>{s.skill}</span>
                    ))}
                  </div>
                </div>
                <div className={`absolute inset-0 p-5 transition-opacity duration-500 ${currentScreen === 2 ? 'opacity-100' : 'opacity-0'}`}>
                  <h3 className="text-sm font-semibold text-[#0D2C54] mb-4">Engagement Scores</h3>
                  <div className="bg-white p-4 rounded border border-gray-200">
                    {[{ label: 'Attendance', value: 87 }, { label: 'Participation', value: 62 }, { label: 'Giving', value: 50 }].map((s, i) => (
                      <div key={i} className="flex items-center mb-3 last:mb-0">
                        <span className="w-24 text-xs font-semibold text-[#0D2C54]">{s.label}</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded mx-3 overflow-hidden"><div className="h-full bg-purple-600 rounded" style={{ width: `${s.value}%` }} /></div>
                        <span className="w-10 text-right text-xs font-semibold text-gray-600">{s.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={`absolute inset-0 p-5 transition-opacity duration-500 ${currentScreen === 3 ? 'opacity-100' : 'opacity-0'}`}>
                  <h3 className="text-sm font-semibold text-[#0D2C54] mb-4">Board Assessment Report</h3>
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-[#0D2C54]">Overall Grade</span>
                      <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">B+</span>
                    </div>
                    <div className="bg-green-50 p-3 rounded text-xs text-green-800"><strong>Recommended:</strong> Recruit 2 members with Legal and Tech expertise</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 px-4 py-3 flex justify-center gap-2 border-t border-gray-200">
                {screens.map((_, i) => (<button key={i} onClick={() => setCurrentScreen(i)} className={`w-2 h-2 rounded-full transition-all ${currentScreen === i ? 'bg-purple-600 scale-125' : 'bg-gray-300'}`} />))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0D2C54] text-center mb-12">How This Compares to Hiring a Consultant</h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-3 bg-[#0D2C54] text-white">
              <div className="p-5 text-left font-semibold">What You Get</div>
              <div className="p-5 text-center font-semibold">Traditional Consultant</div>
              <div className="p-5 text-center font-semibold">The Nonprofit Edge</div>
            </div>
            {[
              { item: 'Skills matrix analysis', consultant: true, edge: true },
              { item: 'Gap identification', consultant: true, edge: true },
              { item: 'Anonymous feedback', consultant: false, edge: true },
              { item: 'Repeat annually at no extra cost', consultant: false, edge: true },
              { item: 'Typical cost', consultant: '$5,000 – $15,000', edge: 'Included in membership' },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 border-b border-gray-200 last:border-0">
                <div className="p-4 text-sm font-medium text-[#0D2C54]">{row.item}</div>
                <div className="p-4 text-center text-sm">{typeof row.consultant === 'boolean' ? (row.consultant ? <span className="text-purple-600 text-lg">✓</span> : <span className="text-gray-400 text-lg">✗</span>) : row.consultant}</div>
                <div className="p-4 text-center text-sm bg-purple-50">{typeof row.edge === 'boolean' ? (row.edge ? <span className="text-purple-600 text-lg">✓</span> : <span className="text-gray-400 text-lg">✗</span>) : <span className="font-medium text-[#0D2C54]">{row.edge}</span>}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-24 px-6 bg-gradient-to-br from-purple-600 to-purple-800">
        <div className="max-w-4xl mx-auto text-center text-white">
          <blockquote className="text-2xl lg:text-3xl font-semibold italic leading-relaxed">"Your board can be your greatest asset — or your biggest bottleneck. This tool shows you which one you have."</blockquote>
          <cite className="block mt-6 text-base not-italic opacity-70">— From The Nonprofit Edge</cite>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0D2C54] mb-4">Your Board Can Be Your Greatest Asset</h2>
          <p className="text-lg text-gray-600 mb-8">Stop settling for dysfunction. Build the board your mission deserves.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/signup" className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all">Start Your Free Trial</a>
            <a href="/samples/board-assessment-report.pdf" className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#0D2C54] text-[#0D2C54] font-semibold rounded-lg hover:bg-[#0D2C54] hover:text-white transition-all">View Sample Report</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BoardAssessmentLanding;
