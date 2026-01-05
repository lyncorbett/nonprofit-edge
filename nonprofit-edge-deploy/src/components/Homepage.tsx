import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Brand Colors
const NAVY = '#0D2C54';
const TEAL = '#0097A9';

// Edge Logo Component
const EdgeLogo: React.FC<{ height?: number }> = ({ height = 60 }) => (
  <svg height={height} viewBox="220 260 560 240" xmlns="http://www.w3.org/2000/svg" style={{ width: 'auto' }}>
    <g>
      <g>
        <path fill="#0D2C54" d="M438.46,469.14c-18.16,14.03-40.93,22.38-65.64,22.38c-30.79,0-58.55-12.94-78.16-33.69c2.85,0.46,5.7,0.81,8.57,1.06c9.13,0.79,17.9,0.49,26.26-0.63c12.72,7.44,27.53,11.71,43.33,11.71c17.17,0,33.17-5.03,46.59-13.71C422.94,460.11,428.93,465.14,438.46,469.14z"/>
        <path fill="#0D2C54" d="M294.86,420.29c-8.64,2.53-16.05,3.61-21.74,4.02c-5.05-12.44-7.82-26.05-7.82-40.31c0-59.37,48.14-107.52,107.52-107.52c25.62,0,49.15,8.96,67.62,23.94c-9.33,2.92-16.19,7.85-20.47,11.69c-13.54-8.9-29.74-14.08-47.15-14.08c-47.48,0-85.97,38.49-85.97,85.97C286.85,396.97,289.72,409.27,294.86,420.29z"/>
        <path fill="#0097A9" d="M258.67,434.74c0,0,61.28,14.58,121.38-60.61l-18.3-13.11l72.86-22.42l0.39,71.06l-18.78-13.01C416.22,396.64,340.29,479.82,258.67,434.74z"/>
      </g>
      <g>
        <g>
          <path fill="#0D2C54" d="M491.43,298.55v7.98h-9.88v32.91h-9.08v-32.91h-9.88v-7.98H491.43z"/>
          <path fill="#0D2C54" d="M528.3,298.55v40.89h-9.08V322.6h-14.13v16.83H496v-40.89h9.08v16.02h14.13v-16.02H528.3z"/>
          <path fill="#0D2C54" d="M543.91,306.53v8.27h12.17v7.69h-12.17v8.97h13.76v7.98h-22.84v-40.89h22.84v7.98H543.91z"/>
        </g>
        <g>
          <path fill="#0097A9" d="M495.94,392.68h-9.08l-15.19-25.22v25.22h-9.08v-40.89h9.08l15.19,25.34v-25.34h9.08V392.68z"/>
          <path fill="#0097A9" d="M510.53,390.41c-2.92-1.79-5.24-4.28-6.96-7.48c-1.72-3.2-2.58-6.8-2.58-10.8c0-4,0.86-7.59,2.58-10.78c1.72-3.18,4.04-5.67,6.96-7.46c2.92-1.79,6.14-2.68,9.64-2.68c3.51,0,6.72,0.89,9.64,2.68c2.92,1.79,5.22,4.27,6.91,7.46c1.68,3.18,2.52,6.78,2.52,10.78c0,4-0.85,7.6-2.55,10.8c-1.7,3.2-4,5.7-6.91,7.48c-2.9,1.79-6.11,2.68-9.62,2.68C516.66,393.09,513.45,392.19,510.53,390.41z M527.31,380.74c1.79-2.17,2.68-5.05,2.68-8.62c0-3.61-0.89-6.49-2.68-8.65c-1.79-2.15-4.17-3.23-7.15-3.23c-3.01,0-5.41,1.07-7.2,3.2c-1.79,2.14-2.68,5.03-2.68,8.68c0,3.61,0.89,6.49,2.68,8.65c1.79,2.16,4.19,3.23,7.2,3.23C523.14,384,525.52,382.91,527.31,380.74z"/>
          <path fill="#0097A9" d="M577.65,392.68h-9.08l-15.19-25.22v25.22h-9.08v-40.89h9.08l15.19,25.34v-25.34h9.08V392.68z"/>
          <path fill="#0097A9" d="M611.17,371.45c-0.99,1.96-2.52,3.54-4.57,4.75c-2.05,1.2-4.6,1.81-7.65,1.81h-5.63v14.68h-9.08v-40.89h14.72c2.98,0,5.49,0.56,7.54,1.69c2.05,1.13,3.59,2.68,4.62,4.66c1.03,1.98,1.54,4.25,1.54,6.81C612.66,367.32,612.16,369.49,611.17,371.45z M602.14,368.74c0.85-0.89,1.27-2.16,1.27-3.79c0-1.63-0.42-2.89-1.27-3.79c-0.85-0.89-2.14-1.34-3.88-1.34h-4.94v10.25h4.94C599.99,370.08,601.29,369.63,602.14,368.74z"/>
          <path fill="#0097A9" d="M636.4,392.68l-7.76-15.43h-2.18v15.43h-9.08v-40.89h15.25c2.94,0,5.45,0.56,7.52,1.69c2.07,1.13,3.62,2.67,4.65,4.63c1.03,1.96,1.54,4.15,1.54,6.55c0,2.72-0.7,5.15-2.1,7.28c-1.4,2.14-3.46,3.65-6.19,4.54l8.61,16.19H636.4z M626.47,370.2h5.63c1.66,0,2.91-0.45,3.75-1.34c0.83-0.89,1.25-2.16,1.25-3.79c0-1.55-0.42-2.78-1.25-3.67c-0.83-0.89-2.08-1.34-3.75-1.34h-5.63V370.2z"/>
          <path fill="#0097A9" d="M660.02,390.41c-2.92-1.79-5.24-4.28-6.96-7.48c-1.72-3.2-2.58-6.8-2.58-10.8c0-4,0.86-7.59,2.58-10.78c1.72-3.18,4.04-5.67,6.96-7.46c2.92-1.79,6.14-2.68,9.64-2.68c3.51,0,6.72,0.89,9.64,2.68c2.92,1.79,5.22,4.27,6.91,7.46c1.68,3.18,2.52,6.78,2.52,10.78c0,4-0.85,7.6-2.55,10.8c-1.7,3.2-4,5.7-6.91,7.48c-2.9,1.79-6.11,2.68-9.62,2.68C666.15,393.09,662.94,392.19,660.02,390.41z M676.8,380.74c1.79-2.17,2.68-5.05,2.68-8.62c0-3.61-0.89-6.49-2.68-8.65c-1.79-2.15-4.17-3.23-7.15-3.23c-3.01,0-5.41,1.07-7.2,3.2c-1.79,2.14-2.68,5.03-2.68,8.68c0,3.61,0.89,6.49,2.68,8.65c1.79,2.16,4.19,3.23,7.2,3.23C672.63,384,675.01,382.91,676.8,380.74z"/>
          <path fill="#0097A9" d="M718.05,351.79v7.98h-15.19v8.62h11.37v7.75h-11.37v16.54h-9.08v-40.89H718.05z"/>
          <path fill="#0097A9" d="M731.92,351.79v40.89h-9.08v-40.89H731.92z"/>
          <path fill="#0097A9" d="M765.33,351.79v7.98h-9.88v32.91h-9.08v-32.91h-9.88v-7.98H765.33z"/>
        </g>
        <g>
          <path fill="#0D2C54" d="M476.97,418.87v13.1h19.27v12.18h-19.27v14.21h21.8v12.64h-36.19v-64.78h36.19v12.64H476.97z"/>
          <path fill="#0D2C54" d="M546.58,410.29c4.66,2.71,8.26,6.51,10.82,11.4c2.55,4.89,3.83,10.54,3.83,16.93c0,6.34-1.28,11.97-3.83,16.89c-2.55,4.92-6.17,8.74-10.86,11.44c-4.69,2.71-10.11,4.06-16.29,4.06h-22.14v-64.78h22.14C536.48,406.23,541.92,407.58,546.58,410.29z M542.03,452.46c3.03-3.26,4.55-7.87,4.55-13.84c0-5.97-1.51-10.61-4.55-13.93c-3.03-3.32-7.27-4.98-12.71-4.98h-6.82v37.65h6.82C534.77,457.35,539,455.72,542.03,452.46z"/>
          <path fill="#0D2C54" d="M608.53,426.71c-1.07-2.15-2.6-3.8-4.59-4.94c-1.99-1.14-4.33-1.71-7.03-1.71c-4.66,0-8.39,1.68-11.19,5.03c-2.81,3.35-4.21,7.83-4.21,13.43c0,5.97,1.47,10.63,4.42,13.98c2.95,3.35,7,5.03,12.16,5.03c3.54,0,6.52-0.98,8.96-2.95c2.44-1.97,4.22-4.8,5.34-8.49h-18.26v-11.63h31.31v14.67c-1.07,3.94-2.88,7.6-5.43,10.98c-2.55,3.38-5.79,6.12-9.72,8.21c-3.93,2.09-8.36,3.14-13.3,3.14c-5.84,0-11.04-1.4-15.61-4.2c-4.57-2.8-8.14-6.69-10.69-11.67c-2.55-4.98-3.83-10.67-3.83-17.07c0-6.4,1.28-12.1,3.83-17.12c2.55-5.01,6.1-8.92,10.65-11.72c4.55-2.8,9.73-4.2,15.57-4.2c7.07,0,13.03,1.88,17.89,5.63c4.85,3.75,8.07,8.95,9.64,15.6H608.53z"/>
          <path fill="#0D2C54" d="M647.83,418.87v13.1h19.27v12.18h-19.27v14.21h21.8v12.64h-36.19v-64.78h36.19v12.64H647.83z"/>
        </g>
      </g>
    </g>
  </svg>
);

const tools = [
  {
    id: 'strategic-checkup',
    title: 'Strategic Plan Check-Up',
    description: 'Upload your strategic plan and get an instant health assessment with specific recommendations.',
    icon: '📋'
  },
  {
    id: 'board-assessment',
    title: 'Board Assessment',
    description: 'Evaluate your board\'s effectiveness across governance, fundraising, and strategic oversight.',
    icon: '👥'
  },
  {
    id: 'grant-review',
    title: 'Grant & RFP Review',
    description: 'Get AI-powered feedback on your grant applications before you submit.',
    icon: '📝'
  },
  {
    id: 'scenario-planner',
    title: 'PIVOT Scenario Planner',
    description: 'Model different futures and stress-test your strategy against multiple scenarios.',
    icon: '🔄'
  },
  {
    id: 'template-vault',
    title: 'Template Vault',
    description: 'Access proven templates for board reports, strategic plans, and more.',
    icon: '📁'
  },
  {
    id: 'ask-professor',
    title: 'Ask the Professor',
    description: 'Get expert answers to your nonprofit leadership questions, powered by AI.',
    icon: '🎓'
  }
];

const pricingTiers = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    description: 'Try before you commit',
    features: [
      '1 Strategic Plan Check-Up',
      '3 Ask the Professor questions',
      'Core Constraint Assessment',
      'Limited template access'
    ],
    cta: 'Get Started Free',
    highlighted: false
  },
  {
    name: 'Essential',
    price: '$79',
    period: '/month',
    description: 'For emerging nonprofits',
    features: [
      '5 Strategic Plan Check-Ups/month',
      'Unlimited Ask the Professor',
      'Board Assessment (1/quarter)',
      'Full template vault access',
      'Email support'
    ],
    cta: 'Start Essential',
    highlighted: false
  },
  {
    name: 'Professional',
    price: '$159',
    period: '/month',
    description: 'For growing organizations',
    features: [
      'Unlimited Strategic Plan Check-Ups',
      'Unlimited Ask the Professor',
      'Board Assessment (unlimited)',
      'Grant & RFP Review (10/month)',
      'PIVOT Scenario Planner',
      'Priority support'
    ],
    cta: 'Start Professional',
    highlighted: true
  },
  {
    name: 'Premium',
    price: '$329',
    period: '/month',
    description: 'For established nonprofits',
    features: [
      'Everything in Professional',
      'Unlimited Grant & RFP Reviews',
      'Custom template creation',
      'Team accounts (up to 5)',
      'Quarterly strategy call',
      'Dedicated success manager'
    ],
    cta: 'Start Premium',
    highlighted: false
  }
];

const faqs = [
  {
    question: 'What is The Nonprofit Edge?',
    answer: 'The Nonprofit Edge is an AI-powered platform built specifically for nonprofit leaders. It provides strategic planning tools, board assessments, grant review assistance, and expert guidance—all designed to help you move from complexity to clarity.'
  },
  {
    question: 'Who is this for?',
    answer: 'The Nonprofit Edge is designed for Executive Directors, CEOs, board members, and senior leaders at nonprofit organizations of all sizes. Whether you\'re a startup nonprofit or an established organization, our tools scale to meet your needs.'
  },
  {
    question: 'How is "Ask the Professor" different from ChatGPT?',
    answer: 'Ask the Professor is trained specifically on nonprofit leadership, governance, and strategy. It draws from Dr. Lyn Corbett\'s 25+ years of consulting experience with 800+ nonprofits. You get expert-level guidance, not generic AI responses.'
  },
  {
    question: 'Can I try it before I pay?',
    answer: 'Absolutely! Our free tier includes a Strategic Plan Check-Up, 3 Ask the Professor questions, and the Core Constraint Assessment. No credit card required to get started.'
  },
  {
    question: 'How do I cancel?',
    answer: 'You can cancel anytime from your account settings. No long-term contracts, no cancellation fees. If you cancel, you\'ll retain access through the end of your billing period.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. We use enterprise-grade encryption and never share your organizational data. Your strategic plans, assessments, and conversations remain completely confidential.'
  }
];

const Homepage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/homepage">
            <EdgeLogo height={70} />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#why" className="text-gray-600 hover:text-gray-900 transition">Why We Exist</a>
            <a href="#tools" className="text-gray-600 hover:text-gray-900 transition">Tools</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition">Pricing</a>
            <Link 
              to="/signin" 
              className="px-6 py-2.5 rounded-lg font-semibold transition"
              style={{ backgroundColor: TEAL, color: 'white' }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - LARGER IMAGE */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight" style={{ color: NAVY }}>
                Your Mission Deserves More Than Hope
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                AI-powered tools for nonprofit leaders ready to move from complexity to clarity. 
                Strategic planning, board development, and expert guidance—all in one platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup"
                  className="px-8 py-4 text-lg font-semibold text-white rounded-lg transition hover:opacity-90 text-center"
                  style={{ backgroundColor: TEAL }}
                >
                  Start Your Free Trial
                </Link>
                <Link
                  to="/assessment"
                  className="px-8 py-4 text-lg font-semibold rounded-lg transition text-center border-2"
                  style={{ borderColor: NAVY, color: NAVY }}
                >
                  Take Free Assessment
                </Link>
              </div>
              <p className="text-sm text-gray-500 mt-4">No credit card required • Free tier available</p>
            </div>
            {/* HERO IMAGE - LARGER SIZE (max-w-2xl instead of max-w-md) */}
            <div className="relative">
              <img 
                src="/hero-image.png" 
                alt="Nonprofit leader planning strategy"
                className="w-full max-w-2xl mx-auto rounded-2xl shadow-2xl"
              />
              <div 
                className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 hidden lg:block"
                style={{ borderLeft: `4px solid ${TEAL}` }}
              >
                <p className="text-sm font-semibold" style={{ color: NAVY }}>Trusted by 800+ nonprofits</p>
                <p className="text-xs text-gray-500">Including Red Cross, YMCA, Salvation Army</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm text-gray-500 mb-6">TRUSTED BY LEADING NONPROFITS</p>
          <div className="flex justify-center items-center gap-12 flex-wrap opacity-60">
            <span className="text-gray-400 font-semibold">Salvation Army</span>
            <span className="text-gray-400 font-semibold">YMCA</span>
            <span className="text-gray-400 font-semibold">Red Cross</span>
            <span className="text-gray-400 font-semibold">San Diego Zoo</span>
            <span className="text-gray-400 font-semibold">Habitat for Humanity</span>
          </div>
        </div>
      </section>

      {/* Why We Exist Section */}
      <section id="why" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6" style={{ color: NAVY }}>
            Why We Exist
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Most nonprofits are led by passionate people working incredibly hard—yet still feeling stuck. 
            Strategic plans collect dust. Board meetings feel circular. Good intentions don't translate to measurable impact.
          </p>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            <strong style={{ color: NAVY }}>The Nonprofit Edge</strong> was built to change that. 
            We take 25+ years of hands-on consulting experience with 800+ organizations and make it accessible 24/7 through AI-powered tools.
          </p>
          <p className="text-lg text-gray-500 italic">
            From complexity to clarity. From hope to strategy. From stuck to moving.
          </p>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: NAVY }}>
              Everything You Need to Lead with Confidence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Six powerful tools designed specifically for nonprofit leaders. No generic AI—just expert guidance built on 25+ years of consulting experience.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <div 
                key={tool.id} 
                className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{tool.icon}</div>
                <h3 className="text-xl font-bold mb-3" style={{ color: NAVY }}>{tool.title}</h3>
                <p className="text-gray-600">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ask the Professor Section */}
      <section className="py-20 px-6" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src="/dr-corbett.jpg" 
                alt="Dr. Lyn Corbett"
                className="w-full max-w-md mx-auto rounded-2xl shadow-xl"
              />
              <div 
                className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur rounded-xl p-4 shadow-lg mx-auto max-w-sm"
              >
                <p className="font-semibold text-center" style={{ color: NAVY }}>Over 25 Years of Nonprofit Experience</p>
              </div>
            </div>
            <div>
              <div 
                className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-6"
                style={{ backgroundColor: `${TEAL}20`, color: TEAL }}
              >
                MEET YOUR ADVISOR
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6" style={{ color: NAVY }}>
                Ask the Professor
              </h2>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Get expert-level strategic advice, available 24/7. Trained on Dr. Lyn Corbett's decades of nonprofit consulting—not generic AI.
              </p>
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
                  Questions Leaders Are Asking:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-gray-600">
                    <span style={{ color: TEAL }}>→</span>
                    "How do I transition my board from operational to strategic?"
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <span style={{ color: TEAL }}>→</span>
                    "Should we accept this major restricted gift?"
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <span style={{ color: TEAL }}>→</span>
                    "What's the best approach to a difficult ED/Board Chair relationship?"
                  </div>
                </div>
              </div>
              <Link
                to="/ask-the-professor"
                className="inline-block px-8 py-4 text-lg font-semibold text-white rounded-lg transition hover:opacity-90"
                style={{ backgroundColor: NAVY }}
              >
                Ask Your First Question — Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Free Assessment CTA - LINKS TO /assessment */}
      <section className="py-16 px-6" style={{ backgroundColor: NAVY }}>
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-6"
            style={{ backgroundColor: TEAL, color: 'white' }}
          >
            FREE ASSESSMENT
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
            Every nonprofit has ONE constraint holding them back. What's yours?
          </h2>
          <p className="text-gray-300 mb-8">
            Find out in 5 minutes — no login required.
          </p>
          <Link
            to="/assessment"
            className="inline-block px-8 py-4 text-lg font-semibold rounded-lg transition hover:opacity-90"
            style={{ backgroundColor: TEAL, color: 'white' }}
          >
            Take the Free Assessment →
          </Link>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: NAVY }}>
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free. Upgrade when you're ready. Cancel anytime.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier) => (
              <div 
                key={tier.name}
                className={`rounded-2xl p-8 ${tier.highlighted ? 'ring-2 shadow-xl' : 'border border-gray-200'}`}
                style={{ 
                  ringColor: tier.highlighted ? TEAL : undefined,
                  backgroundColor: tier.highlighted ? `${TEAL}05` : 'white'
                }}
              >
                {tier.highlighted && (
                  <div 
                    className="text-xs font-bold uppercase tracking-wider mb-4 text-center py-1 rounded-full"
                    style={{ backgroundColor: TEAL, color: 'white' }}
                  >
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2" style={{ color: NAVY }}>{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-extrabold" style={{ color: NAVY }}>{tier.price}</span>
                  <span className="text-gray-500">{tier.period}</span>
                </div>
                <p className="text-gray-600 text-sm mb-6">{tier.description}</p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span style={{ color: TEAL }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className={`block w-full py-3 rounded-lg font-semibold text-center transition hover:opacity-90 ${
                    tier.highlighted ? 'text-white' : ''
                  }`}
                  style={{ 
                    backgroundColor: tier.highlighted ? TEAL : 'transparent',
                    border: tier.highlighted ? 'none' : `2px solid ${NAVY}`,
                    color: tier.highlighted ? 'white' : NAVY
                  }}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: NAVY }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between"
                >
                  <span className="font-semibold" style={{ color: NAVY }}>{faq.question}</span>
                  <span className="text-2xl text-gray-400">
                    {openFaq === index ? '−' : '+'}
                  </span>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6" style={{ backgroundColor: NAVY }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
            Ready to Lead with Clarity?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join 800+ nonprofit leaders who've moved from hope to strategy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-4 text-lg font-semibold rounded-lg transition hover:opacity-90"
              style={{ backgroundColor: TEAL, color: 'white' }}
            >
              Start Your Free Trial
            </Link>
            <Link
              to="/assessment"
              className="px-8 py-4 text-lg font-semibold rounded-lg transition border-2 border-white text-white hover:bg-white/10"
            >
              Take Free Assessment
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <EdgeLogo height={40} />
              <p className="mt-4 text-sm">
                AI-powered tools for nonprofit leaders ready to move from complexity to clarity.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Tools</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/strategic-checkup" className="hover:text-white transition">Strategic Plan Check-Up</Link></li>
                <li><Link to="/board-assessment" className="hover:text-white transition">Board Assessment</Link></li>
                <li><Link to="/grant-review" className="hover:text-white transition">Grant & RFP Review</Link></li>
                <li><Link to="/scenario-planner" className="hover:text-white transition">PIVOT Scenario Planner</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-white transition">About</Link></li>
                <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Get Started</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/signup" className="hover:text-white transition">Free Trial</Link></li>
                <li><Link to="/assessment" className="hover:text-white transition">Free Assessment</Link></li>
                <li><Link to="/login" className="hover:text-white transition">Member Login</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} The Nonprofit Edge. All rights reserved.</p>
            <p className="mt-2">A product of The Pivotal Group Consultants, Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
