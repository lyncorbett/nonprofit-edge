import React, { useState, useEffect } from 'react';

const CEOEvaluationLanding: React.FC = () => {
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
            <span className="inline-block bg-teal-100 text-teal-700 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              CEO Evaluation
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-[#0D2C54] leading-tight mb-5">
              Make the Annual Review <span className="text-[#0097A7]">Actually Useful</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              A structured, fair, and growth-focused evaluation process that strengthens the board-CEO relationship.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/signup" className="inline-flex items-center justify-center px-6 py-3 bg-[#0D2C54] text-white font-semibold rounded-lg hover:bg-[#0a2040] transition-all">
                Start Your Free Trial
              </a>
              <a href="/samples/ceo-evaluation-report.pdf" className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#0D2C54] text-[#0D2C54] font-semibold rounded-lg hover:bg-[#0D2C54] hover:text-white transition-all">
                View Sample Report
              </a>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden shadow-2xl">
            <img src="/images/ceo-celebration.jpg" alt="Celebrating leadership success" className="w-full h-auto" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-[#0D2C54]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
          <div><div className="text-5xl font-extrabold mb-2">45%</div><div className="opacity-85">of boards don't do formal CEO evaluations</div></div>
          <div><div className="text-5xl font-extrabold mb-2">70%</div><div className="opacity-85">of EDs say their evaluation process is "unclear"</div></div>
          <div><div className="text-5xl font-extrabold mb-2">2.5x</div><div className="opacity-85">longer tenure with regular structured reviews</div></div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0D2C54] text-center mb-4">Why CEO Evaluations Go Wrong</h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">Good intentions, poor execution.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { img: '/images/ceo-no-criteria.jpg', title: 'No Clear Criteria', desc: "Evaluation based on vibes, not goals. The CEO doesn't know what 'success' looks like." },
              { img: '/images/ceo-surprise.jpg', title: 'Surprise Feedback', desc: 'Issues raised in annual review that were never discussed during the year.' },
              { img: '/images/ceo-skipped.jpg', title: 'Skipped Entirely', desc: "Things are going fine — but often they aren't. Boards avoid the conversation altogether." },
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
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0D2C54] text-center mb-12">A Better Evaluation Process</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { num: 1, title: 'Set Goals Together', desc: 'Align on success criteria at the start of the year.' },
              { num: 2, title: 'Gather Feedback', desc: '360° input from board, staff, and self-assessment.' },
              { num: 3, title: 'Create Growth Plan', desc: 'Actionable development goals — not a report card.' },
            ].map((step, i) => (
              <div key={i} className="text-center relative">
                <div className="w-12 h-12 bg-[#0D2C54] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">{step.num}</div>
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
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">Your Complete Evaluation Package</h2>
          <p className="text-lg text-center opacity-85 max-w-xl mx-auto mb-12">Everything you need for a fair, growth-focused CEO review.</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {[
                { title: 'Goal Framework', desc: 'Template for setting measurable annual objectives together.' },
                { title: 'Survey Tools', desc: 'Anonymous 360° feedback surveys ready to send.' },
                { title: 'Analysis Report', desc: 'Synthesized feedback with themes and patterns.' },
                { title: 'Development Plan', desc: 'Structured growth goals for the year ahead.' },
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
                <div className="w-3 h-3 rounded-full bg-gray-300" /><div className="w-3 h-3 rounded-full bg-gray-300" /><div className="w-3 h-3 rounded-full bg-gray-300" />
                <div className="flex-1 ml-3 bg-white rounded px-3 py-1 text-xs text-gray-500">thenonprofitedge.com/tools/ceo-evaluation</div>
              </div>
              <div className="h-[340px] relative bg-gray-50 p-5">
                <div className={`absolute inset-0 p-5 transition-opacity duration-500 ${currentScreen === 0 ? 'opacity-100' : 'opacity-0'}`}>
                  <h3 className="text-sm font-semibold text-[#0D2C54] mb-4">Annual Goals Framework</h3>
                  <div className="bg-white p-4 rounded border border-gray-200">
                    {['Increase donor base by 25%', 'Launch new program serving 500 youth', 'Achieve 90% staff retention', 'Build 6-month operating reserve'].map((g, i) => (
                      <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                        <span className="w-6 h-6 bg-[#0D2C54] text-white rounded-full text-xs flex items-center justify-center font-bold">{i+1}</span>
                        <span className="text-xs text-gray-700">{g}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={`absolute inset-0 p-5 transition-opacity duration-500 ${currentScreen === 1 ? 'opacity-100' : 'opacity-0'}`}>
                  <h3 className="text-sm font-semibold text-[#0D2C54] mb-4">360° Feedback Collection</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ label: 'Board Members', count: '7/9', status: 'complete' }, { label: 'Direct Reports', count: '5/5', status: 'complete' }, { label: 'Key Partners', count: '2/4', status: 'pending' }, { label: 'Self-Assessment', count: '1/1', status: 'complete' }].map((s, i) => (
                      <div key={i} className="bg-white p-3 rounded border border-gray-200 text-center">
                        <div className="text-xs font-semibold text-[#0D2C54] mb-1">{s.label}</div>
                        <div className="text-xs text-gray-500 mb-2">{s.count}</div>
                        <span className={`text-xs px-2 py-1 rounded ${s.status === 'complete' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{s.status === 'complete' ? 'Complete' : 'Pending'}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={`absolute inset-0 p-5 transition-opacity duration-500 ${currentScreen === 2 ? 'opacity-100' : 'opacity-0'}`}>
                  <h3 className="text-sm font-semibold text-[#0D2C54] mb-4">Synthesized Analysis</h3>
                  <div className="bg-white p-4 rounded border border-gray-200">
                    {[{ label: 'Strategic Vision', value: 4.5 }, { label: 'Communication', value: 3.8 }, { label: 'Staff Leadership', value: 4.2 }, { label: 'Financial Mgmt', value: 4.4 }].map((s, i) => (
                      <div key={i} className="flex items-center mb-3 last:mb-0">
                        <span className="w-28 text-xs font-semibold text-[#0D2C54]">{s.label}</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded mx-3 overflow-hidden"><div className="h-full bg-[#0D2C54] rounded" style={{ width: `${s.value * 20}%` }} /></div>
                        <span className="w-10 text-right text-xs font-semibold text-gray-600">{s.value}/5</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={`absolute inset-0 p-5 transition-opacity duration-500 ${currentScreen === 3 ? 'opacity-100' : 'opacity-0'}`}>
                  <h3 className="text-sm font-semibold text-[#0D2C54] mb-4">Development Plan</h3>
                  <div className="bg-white p-4 rounded border border-gray-200">
                    {['Executive coaching — monthly sessions', 'Board communication — weekly brief updates', 'Peer network — join CEO learning cohort'].map((g, i) => (
                      <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs ${i === 0 ? 'bg-[#0097A7] border-[#0097A7] text-white' : 'border-gray-300'}`}>{i === 0 && '✓'}</div>
                        <span className="text-xs text-gray-700">{g}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 px-4 py-3 flex justify-center gap-2 border-t border-gray-200">
                {screens.map((_, i) => (<button key={i} onClick={() => setCurrentScreen(i)} className={`w-2 h-2 rounded-full transition-all ${currentScreen === i ? 'bg-[#0D2C54] scale-125' : 'bg-gray-300'}`} />))}
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
              { item: 'Goal-setting framework', consultant: true, edge: true },
              { item: '360° feedback surveys', consultant: true, edge: true },
              { item: 'Synthesized analysis', consultant: true, edge: true },
              { item: 'Development plan template', consultant: false, edge: true },
              { item: 'Repeat annually at no extra cost', consultant: false, edge: true },
              { item: 'Typical cost', consultant: '$3,000 – $8,000', edge: 'Included in membership' },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 border-b border-gray-200 last:border-0">
                <div className="p-4 text-sm font-medium text-[#0D2C54]">{row.item}</div>
                <div className="p-4 text-center text-sm">{typeof row.consultant === 'boolean' ? (row.consultant ? <span className="text-[#0097A7] text-lg">✓</span> : <span className="text-gray-400 text-lg">✗</span>) : row.consultant}</div>
                <div className="p-4 text-center text-sm bg-[#0097A7]/10">{typeof row.edge === 'boolean' ? (row.edge ? <span className="text-[#0097A7] text-lg">✓</span> : <span className="text-gray-400 text-lg">✗</span>) : <span className="font-medium text-[#0D2C54]">{row.edge}</span>}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0D2C54] mb-4">Ready for Better Conversations?</h2>
          <p className="text-lg text-gray-600 mb-8">Build a CEO evaluation process that actually strengthens leadership.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/signup" className="inline-flex items-center justify-center px-6 py-3 bg-[#0D2C54] text-white font-semibold rounded-lg hover:bg-[#0a2040] transition-all">Start Your Free Trial</a>
            <a href="/samples/ceo-evaluation-report.pdf" className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#0D2C54] text-[#0D2C54] font-semibold rounded-lg hover:bg-[#0D2C54] hover:text-white transition-all">View Sample Report</a>
          </div>
          <p className="mt-6 text-sm text-gray-500">Starting at $97/month for teams · Cancel anytime</p>
        </div>
      </section>
    </div>
  );
};

export default CEOEvaluationLanding;
