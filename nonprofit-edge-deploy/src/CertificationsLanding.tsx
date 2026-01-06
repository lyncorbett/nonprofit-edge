import React from 'react';

interface CertificationsLandingProps {
  onNavigate?: (route: string) => void;
  onGetStarted?: () => void;
}

const CertificationsLanding: React.FC<CertificationsLandingProps> = ({ onNavigate, onGetStarted }) => {
  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else if (onNavigate) {
      onNavigate('/signup');
    }
  };

  const handleNavigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    }
  };

  const certifications = [
    {
      id: 'governance',
      title: 'Board Governance Excellence',
      description: 'Master the fundamentals of effective nonprofit board leadership, from fiduciary duties to strategic oversight.',
      duration: '4 weeks',
      modules: 6,
      image: '/cert-governance.jpg',
      color: 'purple',
      topics: ['Fiduciary Responsibilities', 'Strategic Planning Oversight', 'CEO Evaluation', 'Risk Management', 'Financial Oversight', 'Board Development'],
    },
    {
      id: 'leadership',
      title: 'Executive Leadership',
      description: 'Develop the skills to lead your nonprofit through growth, change, and challenging times.',
      duration: '6 weeks',
      modules: 8,
      image: '/cert-leadership.jpg',
      color: 'blue',
      topics: ['Vision & Strategy', 'Team Building', 'Change Management', 'Stakeholder Relations', 'Crisis Leadership', 'Organizational Culture'],
    },
    {
      id: 'disc',
      title: 'DISC Assessment Facilitator',
      description: 'Become certified to administer and interpret DISC assessments for team development.',
      duration: '2 weeks',
      modules: 4,
      image: '/cert-disc.jpg',
      color: 'teal',
      topics: ['DISC Theory', 'Assessment Administration', 'Results Interpretation', 'Team Facilitation'],
    },
    {
      id: 'five-behaviors',
      title: 'Five Behaviors Facilitator',
      description: 'Lead teams through the Five Behaviors model to build cohesion and high performance.',
      duration: '3 weeks',
      modules: 5,
      image: '/cert-five-behaviors.png',
      color: 'orange',
      topics: ['Trust Building', 'Healthy Conflict', 'Commitment', 'Accountability', 'Results Focus'],
    },
    {
      id: 'strategic-planning',
      title: 'Strategic Planning Professional',
      description: 'Learn to facilitate strategic planning processes that produce actionable, implementable plans.',
      duration: '5 weeks',
      modules: 7,
      image: '/tool-strategic.jpg',
      color: 'green',
      topics: ['Environmental Scanning', 'Mission & Vision', 'Goal Setting', 'Implementation Planning', 'Progress Monitoring', 'Plan Refresh'],
    },
    {
      id: 'consultant',
      title: 'Nonprofit Consulting Foundations',
      description: 'Build the skills to serve as an effective consultant to nonprofit organizations.',
      duration: '8 weeks',
      modules: 10,
      image: '/cert-consultant.jpg',
      color: 'indigo',
      topics: ['Consulting Frameworks', 'Client Engagement', 'Needs Assessment', 'Solution Design', 'Project Management', 'Ethical Practice'],
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; light: string; border: string }> = {
      purple: { bg: 'bg-purple-600', text: 'text-purple-600', light: 'bg-purple-100', border: 'border-purple-600' },
      blue: { bg: 'bg-blue-600', text: 'text-blue-600', light: 'bg-blue-100', border: 'border-blue-600' },
      teal: { bg: 'bg-teal-600', text: 'text-teal-600', light: 'bg-teal-100', border: 'border-teal-600' },
      orange: { bg: 'bg-orange-600', text: 'text-orange-600', light: 'bg-orange-100', border: 'border-orange-600' },
      green: { bg: 'bg-green-600', text: 'text-green-600', light: 'bg-green-100', border: 'border-green-600' },
      indigo: { bg: 'bg-indigo-600', text: 'text-indigo-600', light: 'bg-indigo-100', border: 'border-indigo-600' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#0D2C54] to-[#0a2040]">
        <div className="max-w-6xl mx-auto text-center text-white">
          <span className="inline-block bg-white/10 text-white px-4 py-1 rounded-full text-sm font-semibold mb-6 backdrop-blur">
            Professional Development
          </span>
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
            Nonprofit Leadership <span className="text-[#0097A7]">Certifications</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Advance your career and your organization with credentials that demonstrate expertise in nonprofit leadership, governance, and consulting.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={handleGetStarted}
              className="inline-flex items-center justify-center px-8 py-4 bg-[#0097A7] text-white font-semibold rounded-lg hover:bg-[#007b8a] transition-all"
            >
              Explore Certifications
            </button>
            <button 
              onClick={() => handleNavigate('/pricing')}
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all backdrop-blur border border-white/20"
            >
              View Pricing
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 bg-gray-50 border-b border-gray-200">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: '500+', label: 'Certified Leaders' },
            { number: '6', label: 'Certification Programs' },
            { number: '98%', label: 'Completion Rate' },
            { number: '4.9★', label: 'Average Rating' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-3xl font-extrabold text-[#0D2C54] mb-1">{stat.number}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0D2C54] mb-4">Available Certifications</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each certification includes video lessons, interactive exercises, real-world case studies, and a final assessment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certifications.map((cert) => {
              const colors = getColorClasses(cert.color);
              return (
                <div key={cert.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
                  {/* Image */}
                  <div className="h-48 relative overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${cert.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className={`inline-block ${colors.bg} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                        {cert.duration} • {cert.modules} modules
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#0D2C54] mb-2">{cert.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{cert.description}</p>
                    
                    {/* Topics Preview */}
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Topics Covered</div>
                      <div className="flex flex-wrap gap-1">
                        {cert.topics.slice(0, 3).map((topic, i) => (
                          <span key={i} className={`${colors.light} ${colors.text} text-xs px-2 py-1 rounded`}>
                            {topic}
                          </span>
                        ))}
                        {cert.topics.length > 3 && (
                          <span className="text-xs text-gray-400 px-2 py-1">
                            +{cert.topics.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={handleGetStarted}
                      className={`w-full py-3 rounded-lg font-semibold text-sm border-2 ${colors.border} ${colors.text} hover:${colors.bg} hover:text-white transition-all`}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0D2C54] mb-4">How Certification Works</h2>
            <p className="text-lg text-gray-600">A flexible, self-paced learning experience designed for busy nonprofit leaders.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: 1, title: 'Enroll', desc: 'Choose your certification and get instant access to all materials', icon: '📚' },
              { num: 2, title: 'Learn', desc: 'Complete video lessons and interactive exercises at your own pace', icon: '🎓' },
              { num: 3, title: 'Apply', desc: 'Work through real-world case studies and practical assignments', icon: '💼' },
              { num: 4, title: 'Certify', desc: 'Pass the final assessment and receive your digital credential', icon: '🏆' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="w-10 h-10 bg-[#0D2C54] text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-[#0D2C54] mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructor */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#0D2C54] rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Image */}
              <div className="h-64 lg:h-auto relative">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: 'url(/dr-corbett.jpg)' }}
                />
              </div>
              
              {/* Content */}
              <div className="p-8 lg:p-12 text-white">
                <span className="inline-block bg-white/10 text-white px-3 py-1 rounded-full text-xs font-semibold mb-4">
                  Your Instructor
                </span>
                <h3 className="text-2xl lg:text-3xl font-bold mb-4">Dr. Lyn Corbett</h3>
                <p className="text-white/80 mb-6 leading-relaxed">
                  With over 15 years of nonprofit consulting experience and a PhD in Organizational Leadership, Dr. Corbett has helped 800+ organizations strengthen their leadership, governance, and strategic capacity.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-2xl font-bold text-[#0097A7]">800+</div>
                    <div className="text-white/60">Organizations Served</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#0097A7]">$100M+</div>
                    <div className="text-white/60">Funding Secured</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-2xl lg:text-3xl font-medium text-[#0D2C54] italic leading-relaxed mb-8">
            "The Board Governance certification transformed how I approach my role. The practical frameworks and real-world examples made all the difference."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              MJ
            </div>
            <div className="text-left">
              <div className="font-semibold text-[#0D2C54]">Maria Johnson</div>
              <div className="text-sm text-gray-600">Board Chair, Community Health Alliance</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0D2C54] mb-4">Included in Your Membership</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            All certifications are included with Professional and Premium memberships. Essential members can purchase individual certifications.
          </p>
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto border border-gray-100">
            <div className="text-sm font-semibold text-[#0097A7] mb-2">PROFESSIONAL & PREMIUM</div>
            <div className="text-4xl font-extrabold text-[#0D2C54] mb-2">All Access</div>
            <div className="text-gray-600 mb-6">Unlimited certifications included</div>
            <button 
              onClick={handleGetStarted}
              className="w-full py-3 bg-[#0D2C54] text-white rounded-lg font-semibold hover:bg-[#0a2040] transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-[#0D2C54]">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Level Up Your Leadership?</h2>
          <p className="text-xl text-white/80 mb-8">
            Join hundreds of nonprofit leaders who have advanced their skills with our certification programs.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={handleGetStarted}
              className="inline-flex items-center justify-center px-8 py-4 bg-[#0097A7] text-white font-semibold rounded-lg hover:bg-[#007b8a] transition-all"
            >
              Start Your Free Trial
            </button>
            <button 
              onClick={() => handleNavigate('/contact')}
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all backdrop-blur border border-white/20"
            >
              Talk to Our Team
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CertificationsLanding;
