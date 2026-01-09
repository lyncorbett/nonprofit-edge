/**
 * THE NONPROFIT EDGE - Why We Exist Page
 * The real story: Theory of Constraints, 15 years as ED, ONE Thing philosophy
 */

import React from 'react';

const NAVY = '#1a365d'
const TEAL = '#00a0b0'

interface WhyWeExistProps {
  onNavigate?: (path: string) => void;
}

const WhyWeExist: React.FC<WhyWeExistProps> = ({ onNavigate }) => {
  const navigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
  };

  return (
    <div className="min-h-screen">
      {/* ==================== HEADER ==================== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between" style={{ height: '120px' }}>
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="flex items-center">
              <img 
                src="/logo.svg" 
                alt="The Nonprofit Edge" 
                style={{ width: '280px', height: 'auto' }}
                onError={(e) => { (e.target as HTMLImageElement).src = '/logo.jpg' }}
              />
            </a>
            <nav className="hidden md:flex items-center gap-8">
              <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="text-gray-600 hover:text-gray-900 font-medium">Home</a>
              <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="px-5 py-2.5 text-white rounded-lg font-semibold hover:opacity-90" style={{ backgroundColor: TEAL }}>Sign In</a>
            </nav>
          </div>
        </div>
      </header>

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="pt-32">
        
        {/* HERO - The Hook */}
        <section className="py-20 px-6 text-white" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #2c5282 100%)` }}>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg opacity-80 mb-4">847+ organizations consulted. One painful truth discovered.</p>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Every Nonprofit Has <span style={{ color: TEAL }}>ONE Thing</span> Holding It Back.
            </h1>
            <p className="text-xl opacity-90">
              Most leaders are too buried in everything else to find it.<br />
              We built The Nonprofit Edge to fix that.
            </p>
          </div>
        </section>

        {/* ORIGIN STORY - I've Been In Your Seat */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <div className="relative flex justify-center">
                <div className="rounded-2xl overflow-hidden shadow-xl" style={{ maxWidth: '400px' }}>
                  <img 
                    src="/lyn-corbett.jpg" 
                    alt="Dr. Lyn Corbett"
                    className="w-full h-auto"
                  />
                </div>
                <div 
                  className="absolute left-1/2 -translate-x-1/2 rounded-xl py-3 px-5 text-white text-sm font-semibold"
                  style={{ backgroundColor: NAVY, bottom: '-20px' }}
                >
                  Dr. Lyn Corbett, Founder
                </div>
              </div>
              
              {/* Story */}
              <div className="mt-8 md:mt-0">
                <h2 className="text-3xl font-extrabold mb-6" style={{ color: NAVY }}>
                  I Spent 15 Years in Your Seat. I Know How Heavy It Gets.
                </h2>
                <p className="text-lg text-gray-600 mb-5 leading-relaxed">
                  Before I ever consulted a nonprofit, I led one. For 15 years, I sat in the Executive Director's chair — navigating board dynamics, chasing funding, managing burnout, and trying to move a mission forward with never enough time or resources.
                </p>
                <p className="text-lg text-gray-600 mb-5 leading-relaxed">
                  I know what it's like to stare at a strategic plan that feels more like a wish list than a roadmap. I know what it's like to wonder if your board is helping or hindering. I know what it's like to lose a grant and never really understand why.
                </p>
                <p className="text-lg font-semibold mb-5 p-4 rounded-lg" style={{ backgroundColor: '#f0fdfa', color: NAVY, borderLeft: `4px solid ${TEAL}` }}>
                  And I know what it's like to feel like you're trying to fix everything at once — and making progress on nothing.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  That's why I built The Nonprofit Edge.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* THE TURNING POINT - Theory of Constraints */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4" style={{ backgroundColor: TEAL, color: 'white' }}>
                The Turning Point
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: NAVY }}>
                The Moment Everything Changed
              </h2>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-8">
              <p className="text-xl text-gray-700 italic leading-relaxed">
                "After consulting with hundreds of organizations, I kept seeing the same pattern: leaders trying to solve fifteen problems at once, spreading themselves thin, making incremental progress on everything and <span className="font-semibold" style={{ color: NAVY }}>breakthrough progress on nothing</span>."
              </p>
            </div>
            
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                Then I discovered Eliyahu Goldratt's <strong>Theory of Constraints</strong> — the same methodology that transformed manufacturing, healthcare, and project management. The core insight is deceptively simple:
              </p>
              
              <div className="p-6 rounded-xl text-center" style={{ backgroundColor: NAVY }}>
                <p className="text-xl md:text-2xl font-bold text-white">
                  Every system has <span style={{ color: TEAL }}>ONE constraint</span> that limits its output.<br />
                  Find it. Fix it. The whole system improves.
                </p>
              </div>
              
              <p>
                I started applying this to nonprofits. Instead of giving clients a 50-page audit with 47 recommendations, I helped them find the <strong>ONE thing</strong> holding them back. The results were transformative. Organizations that had been stuck for years suddenly had momentum.
              </p>
              
              <p className="font-semibold" style={{ color: NAVY }}>
                That's when I knew: nonprofit leaders don't need more noise. They need clarity.
              </p>
            </div>
          </div>
        </section>

        {/* THE FIVE CONSTRAINTS */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: NAVY }}>
                The Five Constraints That Hold Nonprofits Back
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                After working with 847+ organizations, we've identified the five areas where constraints typically hide.
              </p>
            </div>
            
            <div className="grid md:grid-cols-5 gap-4">
              {[
                { icon: '🎯', title: 'Strategic Clarity', desc: 'Unclear priorities pulling in every direction' },
                { icon: '💰', title: 'Resource Alignment', desc: 'Money and people not matching mission' },
                { icon: '👥', title: 'Leadership Capacity', desc: 'Too much on too few shoulders' },
                { icon: '⚙️', title: 'Operational Systems', desc: 'Processes that slow instead of scale' },
                { icon: '🛡️', title: 'Board Governance', desc: 'Oversight that hinders instead of helps' },
              ].map((item, i) => (
                <div key={i} className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-bold mb-2" style={{ color: NAVY }}>{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
            
            <p className="text-center mt-8 text-lg text-gray-600">
              Your constraint is probably in one of these five areas. Our tools help you find exactly which one — and what to do about it.
            </p>
          </div>
        </section>

        {/* CREDENTIALS - The Proof */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-extrabold mb-6" style={{ color: NAVY }}>
                  The Experience Behind the Platform
                </h2>
                <ul className="space-y-4">
                  {[
                    '15 years as a nonprofit Executive Director',
                    'PhD in Organizational Leadership, University of San Diego',
                    'Adjunct Faculty, USD School of Leadership',
                    'Author of "The Leadership Reset"',
                    'Featured in Forbes, USA Today, San Diego Business Journal',
                    'Goldman Sachs 10,000 Small Businesses Alumni',
                    'San Diego Top 500 Leaders (2025)',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span style={{ color: TEAL }} className="text-xl">✓</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                {[
                  { stat: '847+', label: 'Organizations Served' },
                  { stat: '$100M+', label: 'Funding Secured' },
                  { stat: '25+', label: 'Years Experience' },
                  { stat: 'PhD', label: 'Organizational Leadership' },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl shadow-sm text-center">
                    <div className="text-3xl font-extrabold" style={{ color: NAVY }}>{item.stat}</div>
                    <div className="text-sm text-gray-500 mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FOR US, BY US */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 rounded-2xl border-2" style={{ borderColor: TEAL, backgroundColor: '#f0fdfa' }}>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="text-6xl">🏆</div>
                <div>
                  <h2 className="text-2xl font-extrabold mb-2" style={{ color: NAVY }}>
                    Built For Us, By Us
                  </h2>
                  <p className="text-gray-700 mb-4">
                    The Nonprofit Edge is powered by <strong>The Pivotal Group Consultants Inc.</strong> — a certified minority-owned business enterprise (MBE) founded in 2013. We're not tech people who discovered nonprofits. We're nonprofit people who built the technology we wished existed.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white rounded-full text-sm font-medium" style={{ color: NAVY }}>Certified MBE</span>
                    <span className="px-3 py-1 bg-white rounded-full text-sm font-medium" style={{ color: NAVY }}>Founded 2013</span>
                    <span className="px-3 py-1 bg-white rounded-full text-sm font-medium" style={{ color: NAVY }}>San Diego, CA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 text-center text-white" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #2c5282 100%)` }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Ready to Find Your ONE Thing?
            </h2>
            <p className="text-xl opacity-90 mb-4">
              Stop fixing everything. Start with what matters.
            </p>
            <p className="text-lg opacity-80 mb-8">
              Take our free Core Constraint Assessment and discover what's really holding your organization back.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/assessment')}
                className="px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: TEAL }}
              >
                Take the Free Assessment →
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="px-8 py-4 rounded-lg font-semibold text-lg border-2 border-white hover:bg-white hover:text-gray-900 transition-colors"
              >
                Start Your Free Trial
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* ==================== FOOTER ==================== */}
      <footer style={{ backgroundColor: NAVY }} className="text-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <img 
              src="/logo.svg" 
              alt="The Nonprofit Edge" 
              className="h-12 w-auto brightness-0 invert"
            />
            <p className="text-gray-400 text-sm">
              © 2026 The Nonprofit Edge. A product of The Pivotal Group Consultants Inc.
            </p>
            <div className="flex items-center gap-6">
              <a href="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy</a>
              <a href="/terms" className="text-gray-400 hover:text-white text-sm">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WhyWeExist;
