/**
 * Why We Exist - The Nonprofit Edge
 * Route: /why-we-exist
 */

import React from 'react';

const NAVY = '#0D2C54';
const TEAL = '#0097A9';

interface WhyWeExistProps {
  onNavigate?: (route: string) => void;
}

const WhyWeExist: React.FC<WhyWeExistProps> = ({ onNavigate }) => {
  const navigate = (path: string) => {
    if (path.startsWith('http') || path.startsWith('mailto:')) {
      window.open(path, '_blank');
      return;
    }
    if (onNavigate) onNavigate(path);
    else window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-20 px-6 text-center text-white" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a4a7a 100%)` }}>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Why We Exist
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-4" style={{ color: '#5eead4' }}>
            Every nonprofit has ONE Thing that, when focused on,
            will change everything.
          </p>
          <p className="text-lg opacity-75">
            Most leaders are too buried in everything else to find it.
            We built The Nonprofit Edge to fix that.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-6" style={{ color: NAVY }}>
            You're Expected to Be an Expert in Everything
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Fundraising. Board management. HR. Strategy. Compliance. Communications. Finance.
            You wear every hat — often at the same time — with no playbook and no backup.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "You're stretched thin.",
                desc: "Every decision feels urgent, but you're making most of them alone."
              },
              {
                title: "Technology treats you like a for-profit.",
                desc: "Generic business tools don't understand your constraints, your funders, or your mission."
              },
              {
                title: "Consulting is out of reach.",
                desc: "Good strategic advice costs $300–$500/hour. Most nonprofit budgets can't afford it."
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-white font-bold" style={{ backgroundColor: NAVY }}>
                  {i + 1}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Insight */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl p-8 md:p-12 text-white" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a4a7a 100%)` }}>
            <h2 className="text-3xl font-extrabold mb-6">
              There's always <span style={{ color: '#5eead4' }}>ONE Thing</span>.
            </h2>
            <p className="text-lg opacity-90 mb-6 leading-relaxed">
              In 25+ years of consulting with 800+ nonprofits, Dr. Lyn Corbett noticed a pattern: every organization has a single primary constraint — one bottleneck that, once addressed, unlocks momentum across the entire organization.
            </p>
            <p className="text-lg opacity-90 mb-6 leading-relaxed">
              The problem? Most leaders can't see it. They're too close. Too busy. Too overwhelmed by the dozen things competing for their attention.
            </p>
            <p className="text-lg font-semibold" style={{ color: '#5eead4' }}>
              The Nonprofit Edge was built to help you find that ONE Thing — and give you the tools to act on it.
            </p>
          </div>
        </div>
      </section>

      {/* Who Built This */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="rounded-2xl overflow-hidden bg-gray-200" style={{ maxWidth: '380px' }}>
                <img 
                  src="/lyn-corbett.jpg"
                  alt="Dr. Lyn Corbett"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: TEAL }}>Meet the Founder</p>
              <h2 className="text-3xl font-extrabold mb-4" style={{ color: NAVY }}>Dr. Lyn Corbett</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                15+ years as a nonprofit Executive Director. PhD in Organizational Leadership from USD.
                Named to San Diego Business Journal's Top 500 Leaders. Featured in Forbes and USA Today.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Through The Pivotal Group, Lyn has worked with 847+ organizations and helped secure over $100 million in funding. He's seen the patterns — what works, what doesn't, and what transforms.
              </p>
              <p className="text-gray-600 leading-relaxed font-medium">
                "I built The Nonprofit Edge because every leader deserves access to the strategy tools that used to be reserved for organizations that could afford $500/hour consultants."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Us, By Us */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-4" style={{ color: NAVY }}>
            Built by Practitioners, Not Outsiders
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            This isn't another tech company that discovered nonprofits last year. The Nonprofit Edge was built from the inside — by people who've sat in your chair, faced your budget, and navigated your board dynamics.
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { stat: '847+', label: 'Organizations Served' },
              { stat: '$100M+', label: 'In Funding Secured' },
              { stat: '25+', label: 'Years of Experience' },
              { stat: '15+', label: 'Years as an ED' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6">
                <div className="text-3xl font-extrabold mb-1" style={{ color: TEAL }}>{item.stat}</div>
                <div className="text-sm text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6" style={{ backgroundColor: TEAL }}>
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-extrabold mb-4">Ready to Find Your Edge?</h2>
          <p className="text-lg opacity-90 mb-8">
            Start with the free Core Constraint Assessment and discover the ONE Thing holding your organization back.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/assessment')}
              className="px-6 py-3 bg-white rounded-lg font-semibold hover:bg-gray-100 transition-colors border-none cursor-pointer"
              style={{ color: NAVY }}
            >
              Take the Free Assessment
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-3 bg-transparent rounded-lg font-semibold border-2 border-white text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              Start Your Free Trial
            </button>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <div className="py-8 text-center bg-gray-50">
        <button
          onClick={() => navigate('/')}
          className="text-sm font-medium hover:underline bg-transparent border-none cursor-pointer"
          style={{ color: TEAL }}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default WhyWeExist;