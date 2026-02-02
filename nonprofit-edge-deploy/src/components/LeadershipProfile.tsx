import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

/**
 * LeadershipProfile Component
 * 
 * This component displays the user's Edge Leadership Profile assessment results.
 * It integrates with the existing platform:
 * - Reports are stored in Supabase and accessible via /my-downloads
 * - Appears on the My Leadership Journey page
 * - Can be displayed as a card on the dashboard
 * 
 * VARIANTS:
 * - 'card': Compact card for dashboard tool grid
 * - 'journey-section': Full section for My Leadership Journey page
 * - 'full': Standalone detailed view
 */

interface AssessmentData {
  id: string;
  completed_at: string;
  clarity_score: number;
  investment_score: number;
  ownership_score: number;
  reflection_score: number;
  scores: any;
}

const dimensionInfo = {
  clarity: {
    name: 'Vision & Clarity',
    icon: '🎯',
    color: '#1B365D',
    shortDesc: 'Direction & truth-telling',
  },
  investment: {
    name: 'People Investment',
    icon: '🤝',
    color: '#0097A9',
    shortDesc: 'Development & succession',
  },
  ownership: {
    name: 'Radical Ownership',
    icon: '🔥',
    color: '#C4A052',
    shortDesc: 'Accountability & action',
  },
  reflection: {
    name: 'Growth & Reflection',
    icon: '🌱',
    color: '#27ae60',
    shortDesc: 'Learning & self-awareness',
  },
};

interface LeadershipProfileProps {
  /** Display variant */
  variant?: 'card' | 'full' | 'journey-section';
  /** Navigation handler for SPA routing */
  onNavigate?: (route: string) => void;
  /** Show retake button */
  showRetake?: boolean;
}

export default function LeadershipProfile({ 
  variant = 'full',
  onNavigate,
  showRetake = true 
}: LeadershipProfileProps) {
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [allAssessments, setAllAssessments] = useState<AssessmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Navigation helper that uses onNavigate prop or falls back to Link
  const navigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.location.href = route;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Get most recent assessment
        const { data: recent } = await supabase
          .from('leadership_assessments')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false })
          .limit(1)
          .single();

        if (recent) {
          setAssessment(recent);
        }

        // Get all assessments for history
        const { data: all } = await supabase
          .from('leadership_assessments')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false });

        if (all) {
          setAllAssessments(all);
        }
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const getZoneInfo = (percentage: number) => {
    if (percentage >= 80) return { 
      label: 'Leading Edge', 
      color: 'text-green-600', 
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    };
    if (percentage >= 60) return { 
      label: 'Common Practice', 
      color: 'text-amber-600', 
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    };
    return { 
      label: 'Developing', 
      color: 'text-red-600', 
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-[#1B365D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // =============================================
  // EMPTY STATE - No assessment taken yet
  // =============================================
  if (!assessment) {
    // Compact card version for dashboard
    if (variant === 'card') {
      return (
        <div 
          onClick={() => navigate('/leadership-assessment')}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1B365D] to-[#0097A9] rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Edge Leadership Profile</h3>
              <p className="text-sm text-gray-500">Discover your leadership style</p>
            </div>
          </div>
          <div className="text-center py-2 px-4 bg-[#1B365D] text-white rounded-lg text-sm font-medium">
            Take Assessment
          </div>
        </div>
      );
    }

    // Journey section version
    if (variant === 'journey-section') {
      return (
        <div className="bg-gradient-to-br from-[#1B365D] to-[#0097A9] rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-serif font-semibold mb-2">Edge Leadership Profile™</h3>
              <p className="text-blue-100 text-sm mb-4">
                Understand your strengths across four dimensions of effective nonprofit leadership. Takes ~12 minutes.
              </p>
              <button
                onClick={() => navigate('/leadership-assessment')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#1B365D] rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                Start Assessment
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Full page version
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center max-w-lg mx-auto mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#1B365D] to-[#0097A9] rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-serif font-semibold text-gray-800 mb-3">
            Edge Leadership Profile™
          </h2>
          <p className="text-gray-600">
            Discover your leadership strengths and growth areas across four essential dimensions.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {Object.entries(dimensionInfo).map(([key, info]) => (
            <div key={key} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <span className="text-2xl">{info.icon}</span>
              <div>
                <p className="font-medium text-gray-800">{info.name}</p>
                <p className="text-sm text-gray-500">{info.shortDesc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/leadership-assessment')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1B365D] text-white rounded-lg hover:bg-[#142847] transition-colors font-medium"
          >
            Take Assessment
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <p className="text-sm text-gray-500 mt-3">~12 minutes · 48 questions</p>
        </div>
      </div>
    );
  }

  // =============================================
  // HAS ASSESSMENT - Show results
  // =============================================
  const scores = {
    clarity: assessment.clarity_score,
    investment: assessment.investment_score,
    ownership: assessment.ownership_score,
    reflection: assessment.reflection_score,
  };

  const overallAvg = Math.round(
    (scores.clarity + scores.investment + scores.ownership + scores.reflection) / 4
  );

  const sortedDimensions = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key as keyof typeof scores);

  const strongestDim = sortedDimensions[0];
  const growthDim = sortedDimensions[sortedDimensions.length - 1];

  const daysSinceAssessment = Math.floor(
    (Date.now() - new Date(assessment.completed_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  const dueForReassessment = daysSinceAssessment >= 90;

  // =============================================
  // CARD VARIANT
  // =============================================
  if (variant === 'card') {
    return (
      <div 
        onClick={() => navigate('/leadership-assessment/report')}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1B365D] to-[#0097A9] rounded-lg flex items-center justify-center">
              <span className="text-lg">📊</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Leadership Profile</h3>
              <p className="text-xs text-gray-500">{daysSinceAssessment}d ago</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#1B365D]">{overallAvg}%</div>
          </div>
        </div>
        
        {/* Mini dimension bars */}
        <div className="space-y-2">
          {Object.entries(dimensionInfo).map(([key, info]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-xs w-6">{info.icon}</span>
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${scores[key as keyof typeof scores]}%`,
                    backgroundColor: info.color 
                  }}
                />
              </div>
              <span className="text-xs text-gray-500 w-8">{scores[key as keyof typeof scores]}%</span>
            </div>
          ))}
        </div>

        {dueForReassessment && (
          <div className="mt-3 pt-3 border-t">
            <span className="text-xs text-amber-600 font-medium">⏰ Due for reassessment</span>
          </div>
        )}
      </div>
    );
  }

  // =============================================
  // JOURNEY SECTION VARIANT
  // =============================================
  if (variant === 'journey-section') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1B365D] to-[#2a4a7a] p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-serif font-semibold">Edge Leadership Profile™</h3>
              <p className="text-sm text-blue-200">
                Last assessed {daysSinceAssessment === 0 ? 'today' : `${daysSinceAssessment} days ago`}
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{overallAvg}%</div>
              <div className="text-xs text-blue-200">Overall</div>
            </div>
          </div>
        </div>

        {/* Dimension Scores */}
        <div className="p-5">
          <div className="grid grid-cols-2 gap-4 mb-5">
            {Object.entries(dimensionInfo).map(([key, info]) => {
              const score = scores[key as keyof typeof scores];
              const zone = getZoneInfo(score);
              
              return (
                <div key={key} className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-lg">{info.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{info.name}</span>
                  </div>
                  <div className="text-2xl font-bold mb-1" style={{ color: info.color }}>
                    {score}%
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                    <div 
                      className="h-full rounded-full"
                      style={{ width: `${score}%`, backgroundColor: info.color }}
                    />
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${zone.bgColor} ${zone.color}`}>
                    {zone.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Insights */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-xs text-green-600 font-medium mb-1">💪 Strength</p>
              <p className="text-sm text-gray-800">{dimensionInfo[strongestDim as keyof typeof dimensionInfo].name}</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-3">
              <p className="text-xs text-amber-600 font-medium mb-1">📈 Growth Area</p>
              <p className="text-sm text-gray-800">{dimensionInfo[growthDim as keyof typeof dimensionInfo].name}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/leadership-assessment/report')}
              className="flex-1 text-center py-2 px-4 bg-[#1B365D] text-white rounded-lg hover:bg-[#142847] transition-colors text-sm font-medium"
            >
              View Full Report
            </button>
            {dueForReassessment && showRetake && (
              <button
                onClick={() => navigate('/leadership-assessment')}
                className="flex-1 text-center py-2 px-4 bg-[#C4A052] text-white rounded-lg hover:bg-[#a8863f] transition-colors text-sm font-medium"
              >
                Retake Assessment
              </button>
            )}
          </div>
        </div>

        {/* Link to My Downloads where reports are stored */}
        {allAssessments.length > 1 && (
          <div className="px-5 pb-5">
            <button
              onClick={() => navigate('/my-downloads')}
              className="block w-full text-center text-sm text-gray-500 hover:text-[#1B365D]"
            >
              View {allAssessments.length} past assessment reports in My Downloads →
            </button>
          </div>
        )}
      </div>
    );
  }

  // =============================================
  // FULL VARIANT
  // =============================================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-serif font-semibold text-gray-800">Edge Leadership Profile™</h2>
            <p className="text-sm text-gray-500 mt-1">
              Completed {new Date(assessment.completed_at).toLocaleDateString()}
              {dueForReassessment && (
                <span className="ml-2 text-amber-600">· Due for reassessment</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/leadership-assessment/report')}
              className="px-4 py-2 text-[#1B365D] border border-[#1B365D] rounded-lg hover:bg-[#1B365D] hover:text-white transition-colors text-sm font-medium"
            >
              View Full Report
            </button>
            {showRetake && (
              <button
                onClick={() => navigate('/leadership-assessment')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  dueForReassessment 
                    ? 'bg-[#C4A052] text-white hover:bg-[#a8863f]'
                    : 'text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {dueForReassessment ? 'Retake Now' : 'Retake'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Score Grid */}
      <div className="grid md:grid-cols-5 gap-4">
        {/* Overall */}
        <div className="bg-gradient-to-br from-[#1B365D] to-[#0097A9] rounded-2xl p-6 text-white">
          <p className="text-sm text-blue-200 mb-1">Overall Score</p>
          <div className="text-4xl font-bold">{overallAvg}%</div>
          <div className="mt-3 text-sm text-blue-100">
            {Object.values(scores).filter(s => s >= 80).length}/4 Leading Edge
          </div>
        </div>

        {/* Dimensions */}
        {Object.entries(dimensionInfo).map(([key, info]) => {
          const score = scores[key as keyof typeof scores];
          const zone = getZoneInfo(score);
          
          return (
            <div key={key} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{info.icon}</span>
                <span className="text-sm font-medium text-gray-700">{info.name}</span>
              </div>
              <div className="text-2xl font-bold mb-2" style={{ color: info.color }}>
                {score}%
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full rounded-full"
                  style={{ width: `${score}%`, backgroundColor: info.color }}
                />
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded border ${zone.bgColor} ${zone.color} ${zone.borderColor}`}>
                {zone.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Assessment History - Links to My Downloads */}
      {allAssessments.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Assessment History</h3>
            <button
              onClick={() => navigate('/my-downloads')}
              className="text-sm text-[#0097A9] hover:underline"
            >
              View all in My Downloads →
            </button>
          </div>
          <div className="space-y-2">
            {allAssessments.slice(0, 3).map((a, idx) => {
              const avg = Math.round((a.clarity_score + a.investment_score + a.ownership_score + a.reflection_score) / 4);
              return (
                <div
                  key={a.id}
                  onClick={() => navigate(`/leadership-assessment/report/${a.id}`)}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">#{allAssessments.length - idx}</span>
                    <span className="text-sm text-gray-600">
                      {new Date(a.completed_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#1B365D]">{avg}%</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
