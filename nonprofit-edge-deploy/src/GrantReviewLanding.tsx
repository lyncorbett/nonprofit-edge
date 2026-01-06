import React, { useState, useEffect } from 'react';

interface GrantReviewLandingProps {
  onNavigate?: (route: string) => void;
  onGetStarted?: () => void;
}

const GrantReviewLanding: React.FC<GrantReviewLandingProps> = ({ onNavigate, onGetStarted }) => {
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
      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              Grant & RFP Review
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-[#0D2C54] leading-tight mb-5">
              Stop Leaving <span className="text-emerald-600">Grant Money</span> on the Table
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Get expert-level feedback on your grant proposals and RFP responses before you submit. Our AI-powered review identifies gaps, strengthens your narrative, and increases your win rate.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleGetStarted}
                className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all"
              >
                Start Your Free Trial
              </button>
              <a href="/samples/grant-review-report.pdf" className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#0D2C54] text-[#0D2C54] font-semibold rounded-lg hover:bg-[#0D2C54] hover:text-white transition-all">
                View Sample Report
              </a>
            </div>
          </div>
          {/* Hero Image */}
          <div className="rounded-xl overflow-hidden shadow-2xl">
            <img src="/grant-review-hero.jpg" alt="Grant writing success" className="w-full h-auto" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-[#0D2C54]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
          <div>
            <div className="text-5xl font-extrabold mb-2">80%</div>
            <div className="opacity-85">of grant applications get rejected</div>
          </div>
          <div>
            <div className="text-5xl font-extrabold mb-2">$2.3T</div>
            <div className="opacity-85">in grants awarded annually in the US</div>
          </div>
          <div>
            <div className="text-5xl font-extrabold mb-2">3x</div>
            <div className="opacity-85">higher win rate with professional review</div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0D2C54] text-center mb-4">Why Good Proposals Get Rejected</h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">It's rarely about your program. It's about how you present it.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { img: '/tool-grant.jpg', title: 'Weak Problem Statement', desc: "You know the need is real, but funders can't feel the urgency. Data without story doesn't move reviewers." },
              { img: '/tool-strategic.jpg', title: 'Vague Outcomes', desc: '"Improve lives" isn\'t measurable. Funders want specific, trackable results they can report to their boards.' },
              { img: '/tool-resources.jpg', title: 'Missing Alignment', desc: "Your program is great, but does it match what THIS funder wants? Misalignment kills more proposals than weak writing." },
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
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0D2C54] text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            {[
              { num: 1, title: 'Upload', desc: 'Submit your draft proposal or RFP response' },
              { num: 2, title: 'Analysis', desc: 'AI reviews against funder priorities and best practices' },
              { num: 3, title: 'Feedback', desc: 'Get specific suggestions for each section' },
              { num: 4, title: 'Strengthen', desc: 'Revise with confidence and submit a winner' },
            ].map((step, i) => (
              <div key={i} className="text-center relative">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">{step.num}</div>
                <h3 className="text-lg font-bold text-[#0D2C54] mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
                {i < 3 && <span className="hidden sm:block absolute right-0 top-6 text-2xl text-gray-300">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get + Animated Mockup */}
      <section className="py-20 px-6 bg-[#0D2C54] text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">What You Get</h2>
          <p className="text-lg text-center opacity-85 max-w-xl mx-auto mb-12">Comprehensive feedback that transforms good proposals into funded ones.</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {[
                { title: 'Section-by-Section Review', desc: 'Detailed feedback on problem statement, goals, methods, evaluation, and budget narrative.' },
                { title: 'Funder Alignment Check', desc: 'Analysis of how well your proposal matches the specific funder\'s priorities and language.' },
                { title: 'Outcome Strengthening', desc: 'Transform vague outcomes into SMART objectives that reviewers love.' },
                { title: 'Red Flag Alerts', desc: 'Catch common mistakes that lead to automatic rejection before you submit.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 py-4 border-b border-white/15 last:border-0">
                  <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center text-sm flex-shrink-0 mt-1">✓</div>
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
                <div className="flex-1 ml-3 bg-white rounded px-3 py-1 text-xs text-gray-500">thenonprofitedge.com/tools/grant-review</div>
              </div>
              <div className="h-[340px] relative bg-gray-50 p-5">
                {/* Screen 1: Upload */}
                <div className={`absolute inset-0 p-5 transition-opacity duration-500 ${currentScreen === 0 ? 'opacity-100' : 'opacity-0'}`}>
                  <h3 className="text-sm font-semibold text-[#0D2C54] mb-4">Upload Your Proposal</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="text-4xl mb-2">📄</div>
                    <div className="text-sm text-gray-600 mb-2">Drop your proposal here</div>
                    <div className="text-xs text-gray-400">PDF, Word, or Google Doc</div>
                  </div>
                  <div className="mt-4 bg-emerald-50 p-3 rounded-lg flex items-center gap-3">
                    <span className="text-emerald-600">✓</span>
                    <span className="text-xs text-emerald-800">Community_Grant_2026.pdf uploaded</span>
                  </div>
                </div>

                {/* Screen 2: Analysis */}
                <div className={`absolute inset-0 p-5 transition-opacity duration-500 ${currentScreen === 1 ? 'opacity-100' : 'opacity-0'}`}>
                  <h3 className="text-sm font-semibold text-[#0D2C54] mb-4">Proposal Analysis</h3>
                  <div className="space-y-3">
                    {[
                      { section: 'Problem Statement', score: 72, status: 'Needs Work' },
                      { section: 'Goals & Objectives', score: 45, status: 'Weak' },
                      { section: 'Methods', score: 88, status: 'Strong' },
                      { section: 'Evaluation Plan', score: 65, status: 'Needs Work' },
                    ].map((item, i) => (
                      <div key={i} className="bg-white p-3 rounded border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-semibold text-[#0D2C54]">{item.section}</span>
                          <span className={`text-xs px-2 py-1 rounded ${item.score >= 80 ? 'bg-green-100 text-green-700' : item.score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{item.status}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded overflow-hidden">
                          <div className={`h-full rounded ${item.score >= 80 ? 'bg-green-500' : item.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${item.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Screen 3: Feedback */}
                <div className={`absolute inset-0 p-5 transition-opacity duration-500 ${currentScreen === 2 ? 'opacity-100' : 'opacity-0'}`}>
                  <h3 className="text-sm font-semibold text-[#0D2C54] mb-4">Key Recommendations</h3>
                  <div className="space-y-3">
                    <div className="bg-red-50 p-3 rounded border-l-3 border-red-500">
                      <div className="text-xs font-bold text-red-700 mb-1">🚨 Critical: Goals Need SMART Format</div>
                      <div className="text-xs text-red-600">"Improve youth outcomes" → "Increase high school graduation rate by 15% among 200 participants by June 2027"</div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded border-l-3 border-yellow-500">
                      <div className="text-xs font-bold text-yellow-700 mb-1">⚠️ Add Local Data</div>
                      <div className="text-xs text-yellow-600">Problem statement uses national stats. Add county-level data to strengthen local need.</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded border-l-3 border-green-500">
                      <div className="text-xs font-bold text-green-700 mb-1">✓ Strong Partnership Section</div>
                      <div className="text-xs text-green-600">MOUs and letters of support are well-documented.</div>
                    </div>
                  </div>
                </div>

                {/* Screen 4: Report */}
                <div className={`absolute inset-0 p-5 transition-opacity duration-500 ${currentScreen === 3 ? 'opacity-100' : 'opacity-0'}`}>
                  <h3 className="text-sm font-semibold text-[#0D2C54] mb-4">Your Review Report</h3>
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                      <div>
                        <div className="text-sm font-bold text-[#0D2C54]">Overall Readiness</div>
                        <div className="text-xs text-gray-500">Community Youth Grant 2026</div>
                      </div>
                      <div className="text-2xl font-bold text-yellow-600">68%</div>
                    </div>
                    <div className="text-xs text-gray-600 mb-3">Address 3 critical items before submission:</div>
                    <div className="space-y-2">
                      {['Rewrite goals in SMART format', 'Add local needs data', 'Strengthen evaluation timeline'].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <span className="w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center text-gray-400">○</span>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 px-4 py-3 flex justify-center gap-2 border-t border-gray-200">
                {screens.map((_, i) => (
                  <button key={i} onClick={() => setCurrentScreen(i)} className={`w-2 h-2 rounded-full transition-all ${currentScreen === i ? 'bg-emerald-600 scale-125' : 'bg-gray-300'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0D2C54] text-center mb-12">How This Compares to Hiring a Grant Writer</h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-3 bg-[#0D2C54] text-white">
              <div className="p-5 text-left font-semibold">What You Get</div>
              <div className="p-5 text-center font-semibold">Professional Grant Writer</div>
              <div className="p-5 text-center font-semibold">The Nonprofit Edge</div>
            </div>
            {[
              { item: 'Section-by-section feedback', consultant: true, edge: true },
              { item: 'SMART objective rewrites', consultant: true, edge: true },
              { item: 'Funder alignment analysis', consultant: true, edge: true },
              { item: 'Instant turnaround', consultant: false, edge: true },
              { item: 'Unlimited revisions', consultant: false, edge: true },
              { item: 'Typical cost per proposal', consultant: '$500 – $5,000', edge: 'Included in membership' },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 border-b border-gray-200 last:border-0">
                <div className="p-4 text-sm font-medium text-[#0D2C54]">{row.item}</div>
                <div className="p-4 text-center text-sm">{typeof row.consultant === 'boolean' ? (row.consultant ? <span className="text-emerald-600 text-lg">✓</span> : <span className="text-gray-400 text-lg">✗</span>) : row.consultant}</div>
                <div className="p-4 text-center text-sm bg-emerald-50">{typeof row.edge === 'boolean' ? (row.edge ? <span className="text-emerald-600 text-lg">✓</span> : <span className="text-gray-400 text-lg">✗</span>) : <span className="font-medium text-[#0D2C54]">{row.edge}</span>}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-24 px-6 bg-gradient-to-br from-emerald-600 to-emerald-800">
        <div className="max-w-4xl mx-auto text-center text-white">
          <blockquote className="text-2xl lg:text-3xl font-semibold italic leading-relaxed">
            "The difference between a funded proposal and a rejected one often comes down to how clearly you articulate impact. This tool helps you find and fix those gaps."
          </blockquote>
          <cite className="block mt-6 text-base not-italic opacity-70">— From The Nonprofit Edge</cite>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0D2C54] mb-4">Ready to Win More Grants?</h2>
          <p className="text-lg text-gray-600 mb-8">Get expert-level feedback on your next proposal in minutes, not weeks.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={handleGetStarted}
              className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all"
            >
              Start Your Free Trial
            </button>
            <a href="/samples/grant-review-report.pdf" className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#0D2C54] text-[#0D2C54] font-semibold rounded-lg hover:bg-[#0D2C54] hover:text-white transition-all">
              View Sample Report
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GrantReviewLanding;
