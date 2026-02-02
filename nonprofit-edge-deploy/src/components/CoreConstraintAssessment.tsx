import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Target, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

interface CoreConstraintAssessmentProps {
  onNavigate?: (route: string) => void;
}

const questions = [
  { id: 1, text: "Our strategic priorities are clear and understood by all staff.", domain: "Strategic Clarity" },
  { id: 2, text: "We make decisions quickly because we know what matters most.", domain: "Strategic Clarity" },
  { id: 3, text: "Our programs and initiatives are tightly aligned with our mission.", domain: "Strategic Clarity" },
  { id: 4, text: "We have the financial resources needed to achieve our goals.", domain: "Resource Alignment" },
  { id: 5, text: "We often pursue opportunities that stretch us too thin.", domain: "Resource Alignment", reverse: true },
  { id: 6, text: "Our budget allocations reflect our true priorities.", domain: "Resource Alignment" },
  { id: 7, text: "Leadership transitions have disrupted our progress in the past.", domain: "Leadership Impact", reverse: true },
  { id: 8, text: "Our board and executive team have a strong, productive partnership.", domain: "Leadership Impact" },
  { id: 9, text: "We develop leaders at all levels of the organization.", domain: "Leadership Impact" },
  { id: 10, text: "Our systems and processes help us work efficiently.", domain: "Operational Capacity" },
  { id: 11, text: "Staff burnout is a recurring challenge for us.", domain: "Operational Capacity", reverse: true },
  { id: 12, text: "We can scale our programs without proportionally scaling our problems.", domain: "Operational Capacity" },
  { id: 13, text: "We adapt well to unexpected challenges and changes.", domain: "Organizational Resilience" },
  { id: 14, text: "We are heavily dependent on a single funding source.", domain: "Organizational Resilience", reverse: true },
  { id: 15, text: "Our organization would thrive even if key people left.", domain: "Organizational Resilience" },
];

const patterns: Record<string, { name: string; description: string; teaser: string }> = {
  "Strategic Clarity|Resource Alignment": {
    name: "The Scattered Mission",
    description: "Without clear priorities, resources get spread thin across too many initiatives.",
    teaser: "Your organization may be trying to do too much. Clarity would unlock focus."
  },
  "Strategic Clarity|Leadership Impact": {
    name: "The Drifting Ship",
    description: "Leadership energy is consumed by ambiguity rather than execution.",
    teaser: "Your leaders are working hard but may be pulling in different directions."
  },
  "Strategic Clarity|Operational Capacity": {
    name: "The Busy Blur",
    description: "Operations run constantly but without a clear north star.",
    teaser: "You're busy but may not be making the progress you want."
  },
  "Strategic Clarity|Organizational Resilience": {
    name: "The Reactive Cycle",
    description: "Without strategic clarity, every challenge feels like a crisis.",
    teaser: "You may be constantly responding to the urgent instead of the important."
  },
  "Resource Alignment|Strategic Clarity": {
    name: "The Resource Trap",
    description: "Limited resources make it hard to think strategically.",
    teaser: "Financial pressure may be driving decisions more than mission."
  },
  "Resource Alignment|Leadership Impact": {
    name: "The Scarcity Mindset",
    description: "Leaders spend more time on survival than vision.",
    teaser: "Your leaders may be focused on keeping the lights on rather than growth."
  },
  "Resource Alignment|Operational Capacity": {
    name: "The Underfunded Engine",
    description: "Operations are constrained by resource limitations.",
    teaser: "You may know what to do but lack the resources to do it well."
  },
  "Resource Alignment|Organizational Resilience": {
    name: "The Precarious Balance",
    description: "Financial instability creates organizational fragility.",
    teaser: "One funding setback could significantly disrupt your work."
  },
  "Leadership Impact|Strategic Clarity": {
    name: "The Leadership Vacuum",
    description: "Unclear leadership direction creates strategic drift.",
    teaser: "Your organization may need stronger leadership alignment."
  },
  "Leadership Impact|Resource Alignment": {
    name: "The Talent Drain",
    description: "Leadership challenges affect your ability to attract resources.",
    teaser: "Leadership stability could unlock new funding opportunities."
  },
  "Leadership Impact|Operational Capacity": {
    name: "The Bottleneck",
    description: "Too much depends on too few leaders.",
    teaser: "Key people may be carrying too much of the organizational weight."
  },
  "Leadership Impact|Organizational Resilience": {
    name: "The Key Person Risk",
    description: "The organization's future is tied to specific individuals.",
    teaser: "What would happen if a key leader left tomorrow?"
  },
  "Operational Capacity|Strategic Clarity": {
    name: "The Efficiency Trap",
    description: "Operational focus without strategic direction.",
    teaser: "You may be efficiently doing the wrong things."
  },
  "Operational Capacity|Resource Alignment": {
    name: "The Stretched Team",
    description: "Operations outpace available resources.",
    teaser: "Your team may be doing more with less—but at what cost?"
  },
  "Operational Capacity|Leadership Impact": {
    name: "The Overwhelmed Organization",
    description: "Operational demands consume leadership capacity.",
    teaser: "Leaders may be too busy managing to lead."
  },
  "Operational Capacity|Organizational Resilience": {
    name: "The Fragile Machine",
    description: "Operations work but can't handle disruption.",
    teaser: "Everything works—until something breaks."
  },
  "Organizational Resilience|Strategic Clarity": {
    name: "The Survival Mode",
    description: "Constant adaptation without clear direction.",
    teaser: "You're surviving but may not be thriving."
  },
  "Organizational Resilience|Resource Alignment": {
    name: "The Vulnerable Position",
    description: "Resilience challenges stem from resource instability.",
    teaser: "Building reserves could transform your organization's confidence."
  },
  "Organizational Resilience|Leadership Impact": {
    name: "The Succession Gap",
    description: "Organizational resilience depends too heavily on current leaders.",
    teaser: "Your organization's future may be too tied to present leadership."
  },
  "Organizational Resilience|Operational Capacity": {
    name: "The Rigid Structure",
    description: "Operations can't flex to meet changing needs.",
    teaser: "Your systems may be limiting your ability to adapt."
  },
};

type Screen = 'intro' | 'questions' | 'contact' | 'loading' | 'results';

interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
}

interface Results {
  oneThing: string;
  influencedBy: string;
  pattern: { name: string; description: string; teaser: string };
  scores: Record<string, number>;
}

const CoreConstraintAssessment: React.FC<CoreConstraintAssessmentProps> = ({ onNavigate }) => {
  const [screen, setScreen] = useState<Screen>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [contact, setContact] = useState<Contact>({ firstName: '', lastName: '', email: '', organization: '' });
  const [results, setResults] = useState<Results | null>(null);
  const [showScores, setShowScores] = useState(false);

  const navigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.location.href = route;
    }
  };

  const calculateResults = (): Results => {
    const domains: Record<string, number[]> = {
      "Strategic Clarity": [1, 2, 3],
      "Resource Alignment": [4, 5, 6],
      "Leadership Impact": [7, 8, 9],
      "Operational Capacity": [10, 11, 12],
      "Organizational Resilience": [13, 14, 15],
    };

    const scores: Record<string, number> = {};

    for (const domain in domains) {
      let total = 0;
      const questionIds = domains[domain];
      for (const qId of questionIds) {
        const q = questions.find(q => q.id === qId);
        let response = responses[qId] || 3;
        if (q?.reverse) response = 6 - response;
        total += response;
      }
      scores[domain] = Math.round((total / 3) * 10) / 10;
    }

    const ranked = Object.keys(scores).sort((a, b) => scores[a] - scores[b]);
    const oneThing = ranked[0];
    const influencedBy = ranked[1];
    const patternKey = `${oneThing}|${influencedBy}`;
    const pattern = patterns[patternKey] || {
      name: "Unique Pattern",
      description: "Your constraint pattern is unique.",
      teaser: "Let's explore what's holding your organization back."
    };

    return { oneThing, influencedBy, pattern, scores };
  };

  const handleSubmit = async () => {
    if (!contact.firstName || !contact.email) {
      alert('Please fill in your name and email.');
      return;
    }

    setScreen('loading');
    const calculatedResults = calculateResults();
    setResults(calculatedResults);

    try {
      await fetch('https://thenonprofitedge.app.n8n.cloud/webhook/constraint-mini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact,
          responses,
          results: calculatedResults,
          submittedAt: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error submitting:', error);
    }

    setTimeout(() => setScreen('results'), 2000);
  };

  const progress = Math.round(((currentQuestion + 1) / questions.length) * 100);

  // Intro Screen
  if (screen === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1B365D] to-[#2a4a7a] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-8 text-center">
          <div className="w-16 h-16 bg-[#0097A9] rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Find Your ONE Thing
          </h1>
          <p className="text-gray-600 mb-6">
            Every nonprofit has ONE constraint that, if addressed, would unlock everything else. This 3-minute assessment will identify yours.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <p className="font-medium text-gray-800 mb-2">You'll discover:</p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-[#0097A9]">✓</span>
                Your primary constraint (the ONE thing holding you back)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0097A9]">✓</span>
                The pattern affecting your organization
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0097A9]">✓</span>
                Initial insights to start addressing it
              </li>
            </ul>
          </div>
          <button
            onClick={() => setScreen('questions')}
            className="w-full py-4 bg-[#0097A9] text-white rounded-xl font-semibold hover:bg-[#007a8a] transition-colors"
          >
            Start Assessment →
          </button>
          <p className="text-xs text-gray-400 mt-4">Takes about 3 minutes • 15 questions</p>
        </div>
      </div>
    );
  }

  // Questions Screen
  if (screen === 'questions') {
    const q = questions[currentQuestion];
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white border-b px-4 py-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Question {currentQuestion + 1} of {questions.length}</span>
              <span className="text-sm font-medium text-[#0097A9]">{progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#0097A9] transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <p className="text-xs text-[#0097A9] font-medium mb-2">{q.domain}</p>
            <h2 className="text-2xl font-bold text-gray-800 mb-8">{q.text}</h2>

            <div className="space-y-3">
              {[
                { value: 1, label: 'Strongly Disagree' },
                { value: 2, label: 'Disagree' },
                { value: 3, label: 'Neutral' },
                { value: 4, label: 'Agree' },
                { value: 5, label: 'Strongly Agree' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setResponses(prev => ({ ...prev, [q.id]: option.value }));
                    if (currentQuestion < questions.length - 1) {
                      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 200);
                    } else {
                      setTimeout(() => setScreen('contact'), 200);
                    }
                  }}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    responses[q.id] === option.value
                      ? 'border-[#0097A9] bg-[#0097A9]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium text-gray-800">{option.label}</span>
                </button>
              ))}
            </div>

            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className="mt-6 flex items-center gap-2 text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Contact Screen
  if (screen === 'contact') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Almost there!</h2>
          <p className="text-gray-600 mb-6">Enter your details to see your results and receive your personalized report.</p>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input
                  type="text"
                  value={contact.firstName}
                  onChange={(e) => setContact(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={contact.lastName}
                  onChange={(e) => setContact(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => setContact(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
              <input
                type="text"
                value={contact.organization}
                onChange={(e) => setContact(prev => ({ ...prev, organization: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9]"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full mt-6 py-4 bg-[#0097A9] text-white rounded-xl font-semibold hover:bg-[#007a8a] transition-colors"
          >
            See My Results →
          </button>

          <p className="text-xs text-gray-400 text-center mt-4">
            We'll send you a detailed report with actionable next steps.
          </p>
        </div>
      </div>
    );
  }

  // Loading Screen
  if (screen === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1B365D] to-[#2a4a7a] flex items-center justify-center p-4">
        <div className="text-center text-white">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Analyzing Your Responses</h2>
          <p className="text-blue-200">Identifying your ONE constraint...</p>
        </div>
      </div>
    );
  }

  // Results Screen
  if (screen === 'results' && results) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="text-center mb-8">
              <p className="text-sm text-[#0097A9] font-medium mb-2">Your ONE Thing</p>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{results.oneThing}</h1>
              <p className="text-gray-600">is your primary constraint</p>
            </div>

            <div className="bg-gradient-to-br from-[#1B365D] to-[#2a4a7a] rounded-xl p-6 text-white mb-6">
              <h3 className="font-bold text-lg mb-2">{results.pattern.name}</h3>
              <p className="text-blue-100 mb-4">{results.pattern.description}</p>
              <p className="text-sm text-blue-200 italic">"{results.pattern.teaser}"</p>
            </div>

            <div className="border-t pt-6">
              <button
                onClick={() => setShowScores(!showScores)}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="font-medium text-gray-700">View All Domain Scores</span>
                {showScores ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              
              {showScores && (
                <div className="mt-4 space-y-3">
                  {Object.entries(results.scores)
                    .sort(([,a], [,b]) => a - b)
                    .map(([domain, score]) => (
                      <div key={domain}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={domain === results.oneThing ? 'font-bold text-[#0097A9]' : 'text-gray-600'}>
                            {domain} {domain === results.oneThing && '(Primary)'}
                          </span>
                          <span className="font-medium">{score.toFixed(1)}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${domain === results.oneThing ? 'bg-[#0097A9]' : 'bg-gray-300'}`}
                            style={{ width: `${(score / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#0097A9] rounded-2xl p-6 text-white text-center">
            <h3 className="font-bold text-xl mb-2">Want the Full Diagnosis?</h3>
            <p className="text-blue-100 mb-4">
              Get a comprehensive analysis with specific action steps, common traps to avoid, and a 90-day roadmap.
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-3 bg-white text-[#0097A9] rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Free Trial →
            </button>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            Check your email for your personalized report with additional insights.
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default CoreConstraintAssessment;
