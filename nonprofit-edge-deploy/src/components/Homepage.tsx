/**
 * THE NONPROFIT EDGE - Homepage Component
 * 
 * A bold, editorial-inspired homepage that positions strategic clarity as the 
 * competitive advantage for nonprofit leaders.
 */

import React, { useState, useEffect } from 'react';

// Brand colors
const NAVY = '#1a365d';
const NAVY_DEEP = '#0f1a2e';
const TEAL = '#00a0b0';
const TEAL_LIGHT = '#e6f7f9';

interface HomepageProps {
  onNavigate?: (page: string) => void;
}

const Homepage: React.FC<HomepageProps> = ({ onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [billingAnnual, setBillingAnnual] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tools = [
    {
      name: 'Strategic Plan Check-Up',
      description: 'Identify exactly where your strategy breaks down—and fix it.',
      icon: '🎯',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop'
    },
    {
      name: 'Board Assessment',
      description: 'Transform passive board members into engaged champions.',
      icon: '📊',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop'
    },
    {
      name: 'Scenario Planner',
      description: 'Stress-test your organization against multiple futures.',
      icon: '🔮',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'
    },
    {
      name: 'Grant Review',
      description: 'Expert AI analysis of your proposals before you submit.',
      icon: '📝',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=400&fit=crop'
    },
    {
      name: 'CEO Evaluation',
      description: 'Fair, effective leadership assessment frameworks.',
      icon: '⭐',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=400&fit=crop'
    },
    {
      name: 'Template Vault',
      description: '147 battle-tested templates from successful nonprofits.',
      icon: '🗂️',
      image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop'
    }
  ];

  const logos = [
    'Aspiranet',
    'SD Workforce Partnership', 
    'San Diego Museum of Art',
    'American Red Cross'
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      
      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'backdrop-blur-lg bg-white/95 shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="text-xl font-extrabold tracking-tight cursor-pointer"
              style={{ color: NAVY }}
              onClick={() => onNavigate?.('home')}
            >
              The Nonprofit <span style={{ color: TEAL }}>Edge</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#tools" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition">Tools</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition">Pricing</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition">About</a>
              <button
                onClick={() => onNavigate?.('login')}
                className="px-5 py-2 rounded-lg font-semibold text-sm text-white transition hover:opacity-90"
                style={{ background: NAVY }}
              >
                Member Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-20 px-6" style={{ background: `linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)` }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div 
                className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6"
                style={{ background: TEAL_LIGHT, color: TEAL }}
              >
                For Nonprofit Leaders Who Think Strategically
              </div>
              
              <h1 
                className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6"
                style={{ color: NAVY }}
              >
                Stop Managing Chaos.
                <br />
                <span style={{ color: TEAL }}>Start Leading Change.</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                The Nonprofit Edge gives you AI-powered strategic tools, expert frameworks, 
                and on-demand coaching—so you can focus on impact, not firefighting.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <button
                  onClick={() => onNavigate?.('signup')}
                  className="px-8 py-4 rounded-xl font-bold text-white text-lg transition hover:opacity-90 hover:shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #122443 100%)` }}
                >
                  Start Free Trial
                </button>
                <button
                  onClick={() => onNavigate?.('demo')}
                  className="px-8 py-4 rounded-xl font-bold text-lg transition hover:bg-gray-100"
                  style={{ color: NAVY, border: `2px solid ${NAVY}` }}
                >
                  Watch Demo
                </button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-6">
                <div className="flex -space-x-2">
                  {[1,2,3,4,5].map((i) => (
                    <div 
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: i % 2 === 0 ? TEAL : NAVY }}
                    >
                      {['LC', 'MR', 'JK', 'AB', 'SG'][i-1]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="font-bold" style={{ color: NAVY }}>847+ organizations served</div>
                  <div className="text-sm text-gray-500">$100M+ in funding secured</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div 
                className="absolute -top-4 -left-4 w-full h-full rounded-2xl"
                style={{ background: `linear-gradient(135deg, ${TEAL}20 0%, ${NAVY}20 100%)` }}
              />
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
                alt="Nonprofit leaders collaborating"
                className="relative rounded-2xl shadow-2xl w-full"
              />
              
              {/* Floating Stats Card */}
              <div 
                className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                    style={{ background: TEAL_LIGHT }}
                  >
                    🎓
                  </div>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: NAVY }}>92%</div>
                    <div className="text-xs text-gray-500">Strategy Score Improvement</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Bar */}
      <section className="py-12 px-6 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm text-gray-400 uppercase tracking-widest mb-8">
            Trusted by leading nonprofits
          </p>
          <div className="flex justify-center items-center gap-12 flex-wrap opacity-60">
            {logos.map((logo, i) => (
              <div key={i} className="text-lg font-bold text-gray-400">{logo}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-4xl font-extrabold mb-6"
            style={{ color: NAVY }}
          >
            You Didn't Become a Nonprofit Leader to Push Paper
          </h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Yet here you are—drowning in board reports, grant applications, strategic plans that 
            gather dust, and evaluations that go nowhere. Sound familiar?
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '😰', problem: 'Reactive Leadership', stat: '73% of nonprofit leaders feel like they\'re constantly putting out fires' },
              { icon: '📉', problem: 'Strategic Drift', stat: '68% of strategic plans are abandoned within 18 months' },
              { icon: '🤷', problem: 'Board Disengagement', stat: '61% of board members are "passive" or "disengaged"' }
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 text-left">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold mb-2" style={{ color: NAVY }}>{item.problem}</h3>
                <p className="text-sm text-gray-600">{item.stat}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-20 px-6" style={{ background: `linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)` }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div 
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{ background: TEAL_LIGHT, color: TEAL }}
            >
              Your Strategic Toolkit
            </div>
            <h2 
              className="text-4xl font-extrabold mb-4"
              style={{ color: NAVY }}
            >
              Six Tools. One Constraint. Total Clarity.
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every tool is designed around the ONE Thing philosophy—identify your 
              primary constraint and eliminate it.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, i) => (
              <div 
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl hover:border-transparent transition-all cursor-pointer group"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={tool.image}
                    alt={tool.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="text-3xl mb-3">{tool.icon}</div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: NAVY }}>{tool.name}</h3>
                  <p className="text-gray-600">{tool.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ask the Professor Section */}
      <section className="py-20 px-6 text-white" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #122443 100%)` }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                  style={{ background: TEAL }}
                >
                  🎓
                </div>
                <div>
                  <div className="text-sm text-gray-400 uppercase tracking-widest">AI-Powered Coaching</div>
                  <div className="text-2xl font-bold">Ask the Professor</div>
                </div>
              </div>
              
              <h2 className="text-4xl font-extrabold mb-6">
                Expert Guidance.
                <br />
                <span style={{ color: TEAL }}>On Demand.</span>
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Imagine having a PhD-level nonprofit strategist available 24/7. Ask about 
                board dynamics, strategic pivots, funding strategies, or leadership challenges. 
                Get thoughtful, research-backed responses—not generic advice.
              </p>

              <div className="flex items-center gap-4 mb-8">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                  alt="Dr. Lyn Corbett"
                  className="w-16 h-16 rounded-full border-2"
                  style={{ borderColor: TEAL }}
                />
                <div>
                  <div className="font-bold">Trained by Dr. Lyn Corbett</div>
                  <div className="text-sm text-gray-400">PhD, 15+ years as nonprofit ED, 847+ orgs consulted</div>
                </div>
              </div>

              <button
                onClick={() => onNavigate?.('signup')}
                className="px-8 py-4 rounded-xl font-bold text-lg transition hover:opacity-90"
                style={{ background: TEAL }}
              >
                Try Ask the Professor →
              </button>
            </div>

            {/* Chat Preview */}
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-700">YOU</div>
                  <div className="flex-1 bg-white/10 rounded-xl p-4 text-sm">
                    Our board chair keeps micromanaging operations. How do I address this without damaging our relationship?
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg" style={{ background: TEAL }}>🎓</div>
                  <div className="flex-1 bg-white/20 rounded-xl p-4 text-sm">
                    This is one of the most common governance challenges. The key is reframing the conversation from "boundaries" to "impact." Here's a framework I've used with dozens of EDs...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div 
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{ background: TEAL_LIGHT, color: TEAL }}
            >
              Founding Member Pricing
            </div>
            <h2 
              className="text-4xl font-extrabold mb-4"
              style={{ color: NAVY }}
            >
              Lock In Your Rate Forever
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Join as a founding member and keep your rate—even when prices increase.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`font-medium ${!billingAnnual ? 'text-gray-900' : 'text-gray-400'}`}>Monthly</span>
              <button
                onClick={() => setBillingAnnual(!billingAnnual)}
                className="w-14 h-8 rounded-full p-1 transition"
                style={{ background: billingAnnual ? TEAL : '#e5e7eb' }}
              >
                <div 
                  className={`w-6 h-6 rounded-full bg-white shadow transition-transform ${
                    billingAnnual ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`font-medium ${billingAnnual ? 'text-gray-900' : 'text-gray-400'}`}>
                Annual <span className="text-green-600 text-sm">(Save 20%)</span>
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Essential */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h3 className="text-lg font-bold mb-2" style={{ color: NAVY }}>Essential</h3>
              <p className="text-sm text-gray-500 mb-6">For individual leaders</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold" style={{ color: NAVY }}>
                  ${billingAnnual ? '66' : '79'}
                </span>
                <span className="text-gray-500">/month</span>
                {billingAnnual && <div className="text-sm text-gray-400">billed annually</div>}
              </div>
              <ul className="space-y-3 mb-8">
                {['1 user', 'All 6 strategic tools', '10 Ask the Professor sessions/mo', 'Template Vault access', 'Email support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span style={{ color: TEAL }}>✓</span> {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onNavigate?.('signup-essential')}
                className="w-full py-3 rounded-xl font-bold transition border-2 hover:bg-gray-50"
                style={{ borderColor: NAVY, color: NAVY }}
              >
                Start Free Trial
              </button>
            </div>

            {/* Professional - Most Popular */}
            <div 
              className="rounded-2xl p-8 text-white relative"
              style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #122443 100%)` }}
            >
              <div 
                className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                style={{ background: TEAL }}
              >
                MOST POPULAR
              </div>
              <h3 className="text-lg font-bold mb-2">Professional</h3>
              <p className="text-sm text-gray-400 mb-6">For teams up to 5</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">
                  ${billingAnnual ? '133' : '159'}
                </span>
                <span className="text-gray-400">/month</span>
                {billingAnnual && <div className="text-sm text-gray-400">billed annually</div>}
              </div>
              <ul className="space-y-3 mb-8">
                {['Up to 5 team members', 'Everything in Essential', '25 Ask the Professor sessions/mo', 'Board portal access', 'Priority support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <span style={{ color: TEAL }}>✓</span> {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onNavigate?.('signup-professional')}
                className="w-full py-3 rounded-xl font-bold transition hover:opacity-90"
                style={{ background: TEAL }}
              >
                Start Free Trial
              </button>
            </div>

            {/* Premium */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h3 className="text-lg font-bold mb-2" style={{ color: NAVY }}>Premium</h3>
              <p className="text-sm text-gray-500 mb-6">For larger teams</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold" style={{ color: NAVY }}>
                  ${billingAnnual ? '274' : '329'}
                </span>
                <span className="text-gray-500">/month</span>
                {billingAnnual && <div className="text-sm text-gray-400">billed annually</div>}
              </div>
              <ul className="space-y-3 mb-8">
                {['Up to 10 team members', 'Everything in Professional', '50 Ask the Professor sessions/mo', 'Monthly strategy call', 'Custom reporting'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span style={{ color: TEAL }}>✓</span> {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onNavigate?.('signup-premium')}
                className="w-full py-3 rounded-xl font-bold transition border-2 hover:bg-gray-50"
                style={{ borderColor: NAVY, color: NAVY }}
              >
                Start Free Trial
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            All plans include a 3-day free trial. No credit card required to start.
          </p>
        </div>
      </section>

      {/* About / Credibility Section */}
      <section id="about" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=face"
                alt="Dr. Lyn Corbett"
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <div 
                className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6"
                style={{ background: TEAL_LIGHT, color: TEAL }}
              >
                About the Founder
              </div>
              <h2 
                className="text-4xl font-extrabold mb-6"
                style={{ color: NAVY }}
              >
                Built by Someone Who's Been There
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Dr. Lyn Corbett spent 15+ years as a nonprofit Executive Director before founding 
                The Pivotal Group Consultants. He's helped 847+ organizations secure over $100M 
                in funding and develop strategies that actually stick.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                The Nonprofit Edge is everything he wished he had as an ED—strategic frameworks, 
                expert guidance, and tools that respect how busy nonprofit leaders actually work.
              </p>
              
              <div className="grid grid-cols-3 gap-6">
                {[
                  { stat: '847+', label: 'Organizations Served' },
                  { stat: '$100M+', label: 'Funding Secured' },
                  { stat: 'PhD', label: 'Organizational Leadership' }
                ].map((item, i) => (
                  <div key={i}>
                    <div className="text-2xl font-extrabold" style={{ color: TEAL }}>{item.stat}</div>
                    <div className="text-sm text-gray-500">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 text-white" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #122443 100%)` }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold mb-6">
            Ready to Lead with Clarity?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join 847+ nonprofit leaders who've stopped managing chaos and started driving real change.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => onNavigate?.('signup')}
              className="px-8 py-4 rounded-xl font-bold text-lg transition hover:opacity-90"
              style={{ background: TEAL }}
            >
              Start Your Free Trial
            </button>
            <button
              onClick={() => onNavigate?.('demo')}
              className="px-8 py-4 rounded-xl font-bold text-lg transition border-2 border-white/30 hover:bg-white/10"
            >
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Lead Magnet - Core Constraint Assessment */}
      <section className="py-20 px-6" style={{ background: TEAL_LIGHT }}>
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6"
            style={{ background: 'white', color: TEAL }}
          >
            Free Assessment
          </div>
          <h2 
            className="text-4xl font-extrabold mb-6"
            style={{ color: NAVY }}
          >
            What's Really Holding Your Organization Back?
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Take our 5-minute Core Constraint Assessment and discover the ONE thing 
            blocking your nonprofit's growth. Get a personalized report with actionable 
            recommendations—completely free.
          </p>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-6 mb-8">
              {[
                { icon: '🎯', label: 'Identify Your Constraint', desc: 'Pinpoint the bottleneck' },
                { icon: '
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-xl font-extrabold text-white mb-4">
                The Nonprofit <span style={{ color: TEAL }}>Edge</span>
              </div>
              <p className="text-sm">
                Strategic tools for nonprofit leaders who refuse to settle for "good enough."
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Tools</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Strategic Plan Check-Up</a></li>
                <li><a href="#" className="hover:text-white transition">Board Assessment</a></li>
                <li><a href="#" className="hover:text-white transition">Scenario Planner</a></li>
                <li><a href="#" className="hover:text-white transition">Grant Review</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Template Vault</a></li>
                <li><a href="#" className="hover:text-white transition">Book Summaries</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Events</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            © 2025 The Nonprofit Edge. A product of The Pivotal Group Consultants Inc.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
