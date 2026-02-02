import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface DimensionScore {
  raw: number;
  max: number;
  weighted: number;
  maxWeighted: number;
  percentage: number;
  zone: 'developing' | 'common' | 'leading';
}

interface Scores {
  clarity: DimensionScore;
  investment: DimensionScore;
  ownership: DimensionScore;
  reflection: DimensionScore;
}

const dimensionDetails = {
  clarity: {
    name: 'Vision & Clarity',
    icon: '🎯',
    color: '#1B365D',
    lightColor: '#e8edf4',
    question: 'Do I know what I stand for and where we\'re going—and can others see it too?',
    zones: {
      leading: {
        title: 'Leading Edge',
        description: 'You articulate direction in ways that pull people forward. Your team sees the values lived, not just posted.',
        reflection: 'Where is there still a gap between what you say you value and how you actually operate?',
      },
      common: {
        title: 'Common Practice',
        description: 'You have a sense of direction, but it may not be consistently communicated or deeply felt by others.',
        reflection: 'What would change if everyone on your team could describe your mission in their own words?',
      },
      developing: {
        title: 'Developing',
        description: 'Clarity is emerging. You may be still discovering what you stand for or struggling to articulate it.',
        reflection: 'What is one thing you could say clearly this week that would help your team know where you\'re headed?',
      },
    },
  },
  investment: {
    name: 'People Investment',
    icon: '🤝',
    color: '#0097A9',
    lightColor: '#e6f7f9',
    question: 'Do I put real time into the people and priorities that matter most?',
    zones: {
      leading: {
        title: 'Leading Edge',
        description: 'You invest deeply in developing others. People around you grow, and they know you see their potential.',
        reflection: 'Who is the next person you need to intentionally pour into?',
      },
      common: {
        title: 'Common Practice',
        description: 'You care about people, but development may happen reactively rather than intentionally.',
        reflection: 'What would it look like to move one relationship from transactional to transformational?',
      },
      developing: {
        title: 'Developing',
        description: 'People investment may feel like a luxury you can\'t afford right now. Tasks dominate your calendar.',
        reflection: 'What is one 15-minute conversation you could have this week that would matter to someone?',
      },
    },
  },
  ownership: {
    name: 'Radical Ownership',
    icon: '🔥',
    color: '#C4A052',
    lightColor: '#faf5e8',
    question: 'Do I own my decisions, challenges, and my part in what happens?',
    zones: {
      leading: {
        title: 'Leading Edge',
        description: 'You own outcomes fully—the good and the hard. People trust you because you don\'t deflect.',
        reflection: 'Where might you be protecting yourself from feedback that could make you better?',
      },
      common: {
        title: 'Common Practice',
        description: 'You take responsibility when it\'s clear, but may hesitate when the situation is ambiguous.',
        reflection: 'What\'s one thing you\'ve been waiting for someone else to fix that you could address yourself?',
      },
      developing: {
        title: 'Developing',
        description: 'Ownership feels risky. You may find yourself explaining rather than owning.',
        reflection: 'What would change if you stopped explaining and started owning?',
      },
    },
  },
  reflection: {
    name: 'Growth & Reflection',
    icon: '🌱',
    color: '#27ae60',
    lightColor: '#e8f8ef',
    question: 'Do I slow down, learn from experience, and keep growing?',
    zones: {
      leading: {
        title: 'Leading Edge',
        description: 'You have a rhythm of reflection built into your life. Learning is continuous, not occasional.',
        reflection: 'What is the next edge of growth you\'re being invited into?',
      },
      common: {
        title: 'Common Practice',
        description: 'You reflect when prompted, but may not have a consistent practice. Growth happens in spurts.',
        reflection: 'What would a weekly reflection practice look like for you?',
      },
      developing: {
        title: 'Developing',
        description: 'The pace of work leaves little room for reflection. You\'re doing more than you\'re learning.',
        reflection: 'What is one thing you could stop doing to create space for growth?',
      },
    },
  },
};

const growthPlan = {
  clarity: {
    30: 'Write your personal leadership manifesto in 100 words or less. Share it with one trusted colleague for feedback.',
    60: 'Conduct a "values audit" — ask 3 team members what they think you stand for. Compare to your intent.',
    90: 'Create a "clarity ritual" — a monthly practice where you reconnect with why this work matters.',
  },
  investment: {
    30: 'Identify one person who deserves more of your time. Schedule three 1:1s with them this month.',
    60: 'Create a "development plan" for your top 3 direct reports. What do they need to grow?',
    90: 'Build a succession map. Who could step into your role? What do they need to be ready?',
  },
  ownership: {
    30: 'Identify one problem you\'ve been waiting for someone else to solve. Own it this week.',
    60: 'Ask your team: "What do I avoid addressing?" Act on what you hear.',
    90: 'Build an "accountability partner" relationship with a peer. Meet monthly to truth-tell.',
  },
  reflection: {
    30: 'Block 30 minutes every Friday for reflection. Use a simple prompt: What did I learn? What will I do differently?',
    60: 'Find a mentor, coach, or peer group. Commit to monthly learning conversations.',
    90: 'Create a personal "board of advisors" — 3-4 people who will tell you the truth about your leadership.',
  },
};

export default function LeadershipReport() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scores, setScores] = useState<Scores | null>(location.state?.scores || null);
  const [loading, setLoading] = useState(!location.state?.scores);
  const [user, setUser] = useState<any>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!scores && user) {
        const { data } = await supabase
          .from('leadership_assessments')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false })
          .limit(1)
          .single();

        if (data?.scores) {
          setScores(data.scores);
        }
      }
      setLoading(false);
    };
    loadData();
  }, [scores]);

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleEmailReport = async () => {
    // This would integrate with your email service (Resend, etc.)
    alert('Report will be sent to your email shortly!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1B365D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!scores) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Assessment Found</h2>
          <p className="text-gray-600 mb-6">Take the Edge Leadership Profile to see your detailed results.</p>
          <Link
            to="/leadership-assessment"
            className="inline-flex items-center px-6 py-3 bg-[#1B365D] text-white rounded-lg hover:bg-[#142847] transition-colors"
          >
            Take Assessment
          </Link>
        </div>
      </div>
    );
  }

  const sortedDimensions = Object.entries(scores)
    .sort((a, b) => b[1].percentage - a[1].percentage)
    .map(([key]) => key as keyof Scores);

  const overallAvg = Math.round(
    Object.values(scores).reduce((sum, s) => sum + s.percentage, 0) / 4
  );

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case 'leading': return 'text-green-600 bg-green-50 border-green-200';
      case 'common': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'developing': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getZoneLabel = (zone: string) => {
    switch (zone) {
      case 'leading': return 'Leading Edge';
      case 'common': return 'Common Practice';
      case 'developing': return 'Developing';
      default: return zone;
    }
  };

  // Find lowest scoring dimension for focus
  const lowestDimension = sortedDimensions[sortedDimensions.length - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 print:bg-white">
      {/* Header */}
      <header className="bg-[#1B365D] text-white py-8 px-4 print:py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm uppercase tracking-wider mb-1">Your Results</p>
              <h1 className="text-3xl md:text-4xl font-serif font-semibold">The Edge Leadership Profile™</h1>
            </div>
            <div className="text-right hidden print:block">
              <p className="text-sm text-blue-200">Generated {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Actions Bar */}
      <div className="bg-white border-b print:hidden sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/dashboard" className="text-gray-600 hover:text-gray-800 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={handleEmailReport}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Report
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-[#C4A052] text-white rounded-lg hover:bg-[#a8863f] flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main ref={reportRef} className="max-w-4xl mx-auto px-4 py-8">
        {/* Summary Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-2xl font-serif font-semibold text-gray-800 mb-2">Your Leadership Summary</h2>
              <p className="text-gray-600">
                Based on your responses across 48 questions measuring four dimensions of leadership effectiveness.
              </p>
            </div>
            <div className="text-center px-6 py-4 bg-gradient-to-br from-[#1B365D] to-[#0097A9] rounded-xl text-white">
              <div className="text-4xl font-bold">{overallAvg}%</div>
              <div className="text-sm text-blue-100">Overall Score</div>
            </div>
          </div>

          {/* Zone Summary */}
          <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Object.values(scores).filter(s => s.zone === 'leading').length}
              </div>
              <div className="text-sm text-gray-500">Leading Edge</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">
                {Object.values(scores).filter(s => s.zone === 'common').length}
              </div>
              <div className="text-sm text-gray-500">Common Practice</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {Object.values(scores).filter(s => s.zone === 'developing').length}
              </div>
              <div className="text-sm text-gray-500">Developing</div>
            </div>
          </div>
        </div>

        {/* Dimension Cards */}
        <div className="space-y-6 mb-8">
          {sortedDimensions.map((dimKey, index) => {
            const dim = dimensionDetails[dimKey];
            const score = scores[dimKey];
            const zoneInfo = dim.zones[score.zone];

            return (
              <div 
                key={dimKey}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                {/* Dimension Header */}
                <div 
                  className="p-6"
                  style={{ backgroundColor: dim.lightColor }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{dim.icon}</span>
                      <div>
                        <h3 className="text-xl font-semibold" style={{ color: dim.color }}>
                          {dim.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-0.5">{dim.question}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold" style={{ color: dim.color }}>
                        {score.percentage}%
                      </div>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${getZoneColor(score.zone)}`}>
                        {getZoneLabel(score.zone)}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="h-3 bg-white/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${score.percentage}%`,
                          backgroundColor: dim.color,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span className="text-gray-400">|60%</span>
                      <span className="text-gray-400">|80%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                {/* Interpretation */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-800 mb-2">{zoneInfo.title}</h4>
                  <p className="text-gray-600 mb-4">{zoneInfo.description}</p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 border-l-4" style={{ borderColor: dim.color }}>
                    <p className="text-sm font-medium text-gray-700 mb-1">Reflection Prompt</p>
                    <p className="text-gray-600 italic">{zoneInfo.reflection}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 30-60-90 Growth Plan */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8 print:break-before-page">
          <h2 className="text-2xl font-serif font-semibold text-gray-800 mb-2">Your 30-60-90 Day Growth Plan</h2>
          <p className="text-gray-600 mb-6">
            Based on your results, here's a focused development path starting with your area of greatest opportunity: <strong className="text-[#1B365D]">{dimensionDetails[lowestDimension].name}</strong>
          </p>

          <div className="space-y-6">
            {/* 30 Days */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-[#1B365D] to-[#2a4a7a] rounded-xl flex flex-col items-center justify-center text-white">
                <span className="text-2xl font-bold">30</span>
                <span className="text-xs">DAYS</span>
              </div>
              <div className="flex-1 bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-1">Foundation</h4>
                <p className="text-gray-600">{growthPlan[lowestDimension][30]}</p>
              </div>
            </div>

            {/* 60 Days */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-[#0097A9] to-[#00b3c7] rounded-xl flex flex-col items-center justify-center text-white">
                <span className="text-2xl font-bold">60</span>
                <span className="text-xs">DAYS</span>
              </div>
              <div className="flex-1 bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-1">Momentum</h4>
                <p className="text-gray-600">{growthPlan[lowestDimension][60]}</p>
              </div>
            </div>

            {/* 90 Days */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-[#C4A052] to-[#d4b872] rounded-xl flex flex-col items-center justify-center text-white">
                <span className="text-2xl font-bold">90</span>
                <span className="text-xs">DAYS</span>
              </div>
              <div className="flex-1 bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-1">Mastery</h4>
                <p className="text-gray-600">{growthPlan[lowestDimension][90]}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-[#1B365D] to-[#0097A9] rounded-2xl p-8 text-white print:hidden">
          <h2 className="text-2xl font-serif font-semibold mb-4">What's Next?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 rounded-xl p-5">
              <div className="text-2xl mb-2">💬</div>
              <h3 className="font-semibold mb-2">Ask the Professor</h3>
              <p className="text-blue-100 text-sm mb-4">
                Get personalized coaching on your results. Our AI advisor can help you create an action plan.
              </p>
              <Link
                to="/tools/ask-the-professor"
                className="inline-flex items-center text-sm font-medium text-white hover:text-[#C4A052]"
              >
                Start Conversation →
              </Link>
            </div>
            <div className="bg-white/10 rounded-xl p-5">
              <div className="text-2xl mb-2">📅</div>
              <h3 className="font-semibold mb-2">Reassess in 90 Days</h3>
              <p className="text-blue-100 text-sm mb-4">
                We'll remind you to retake the assessment and track your growth over time.
              </p>
              <button className="inline-flex items-center text-sm font-medium text-white hover:text-[#C4A052]">
                Set Reminder →
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 print:mt-12">
          <p>The Edge Leadership Profile™ is part of The Nonprofit Edge platform.</p>
          <p className="mt-1">© {new Date().getFullYear()} The Pivotal Group Consultants Inc.</p>
        </div>
      </main>
    </div>
  );
}
