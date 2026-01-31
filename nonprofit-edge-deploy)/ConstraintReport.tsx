'use client';

import React from 'react';
import { 
  Target, ArrowLeft, Download, Share2, 
  AlertTriangle, CheckCircle, Lightbulb, TrendingUp
} from 'lucide-react';

interface ConstraintReportProps {
  onNavigate?: (page: string) => void;
}

const ConstraintReport: React.FC<ConstraintReportProps> = ({ onNavigate }) => {
  const navigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      window.location.href = `/${page}`;
    }
  };

  const scores = {
    'Funding & Resources': 65,
    'Leadership & Governance': 78,
    'Operations & Capacity': 52,
    'Strategy & Focus': 71,
  };

  const lowestCategory = Object.entries(scores).reduce((a, b) => a[1] < b[1] ? a : b);

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('dashboard')} className="hover:opacity-80 transition-opacity">
              <svg width="160" height="45" viewBox="0 0 500 140" fill="none"><g transform="translate(0, 10)"><path d="M60 10 A50 50 0 1 1 20 70" stroke="#0D2C54" strokeWidth="8" fill="none" strokeLinecap="round"/><path d="M15 45 L45 70 L75 35" stroke="#0097A9" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M45 70 L45 25" stroke="#0097A9" strokeWidth="8" fill="none" strokeLinecap="round"/></g><text x="115" y="42" fontFamily="system-ui" fontSize="28" fontWeight="700" fill="#0D2C54">THE</text><text x="115" y="78" fontFamily="system-ui" fontSize="32" fontWeight="800" fill="#0097A9">NONPROFIT</text><text x="115" y="115" fontFamily="system-ui" fontSize="32" fontWeight="800" fill="#0D2C54">EDGE</text></svg>
            </button>
            <span className="text-slate-300">|</span>
            <div>
              <h1 className="text-lg font-bold text-[#0D2C54]">Constraint Analysis Report</h1>
              <p className="text-sm text-slate-500">The Pivotal Group • Generated Jan 30, 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('dashboard')}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-[#0097A9] font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0097A9] text-white rounded-lg hover:bg-[#007f8f]">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-8 py-8">
        {/* Primary Constraint */}
        <div className="bg-gradient-to-r from-[#0D2C54] to-[#1a3a5c] rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#0097A9]/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-[#0097A9]" />
            </div>
            <div>
              <span className="text-sm text-[#0097A9] font-semibold">PRIMARY CONSTRAINT IDENTIFIED</span>
              <h2 className="text-2xl font-bold">{lowestCategory[0]}</h2>
            </div>
          </div>
          <p className="text-white/70 mb-4">
            Based on your assessment, this is the ONE area that, if improved, will have the greatest 
            positive impact on your organization's overall performance.
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-white/50">Current Score:</span>
            <span className="font-bold text-[#0097A9]">{lowestCategory[1]}%</span>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <h3 className="text-lg font-bold text-[#0D2C54] mb-6">Score Breakdown by Category</h3>
          <div className="space-y-4">
            {Object.entries(scores).map(([category, score]) => {
              const isLowest = category === lowestCategory[0];
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${isLowest ? 'text-[#0097A9]' : 'text-slate-600'}`}>
                      {category}
                      {isLowest && (
                        <span className="ml-2 text-xs bg-[#0097A9]/10 text-[#0097A9] px-2 py-0.5 rounded-full">
                          Primary Constraint
                        </span>
                      )}
                    </span>
                    <span className={`font-bold ${isLowest ? 'text-[#0097A9]' : 'text-slate-700'}`}>{score}%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${isLowest ? 'bg-[#0097A9]' : 'bg-slate-300'}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <h3 className="text-lg font-bold text-[#0D2C54] mb-6">Recommended Actions</h3>
          <div className="space-y-4">
            {[
              {
                title: 'Conduct a capacity audit',
                description: 'Assess current team skills, workload, and gaps against strategic priorities.',
                priority: 'High'
              },
              {
                title: 'Develop systems documentation',
                description: 'Create or update standard operating procedures for key processes.',
                priority: 'High'
              },
              {
                title: 'Implement project management tools',
                description: 'Consider tools like Asana or Monday.com to track work and capacity.',
                priority: 'Medium'
              },
              {
                title: 'Create a professional development plan',
                description: 'Identify training needs and allocate budget for team skill-building.',
                priority: 'Medium'
              },
            ].map((action, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  action.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-[#0D2C54]">{action.title}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      action.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {action.priority} Priority
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{action.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-[#0097A9]/5 border border-[#0097A9]/20 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <Lightbulb className="w-6 h-6 text-[#0097A9] flex-shrink-0" />
            <div>
              <h3 className="font-bold text-[#0D2C54] mb-2">What's Next?</h3>
              <p className="text-slate-600 mb-4">
                Schedule time with your leadership team to review this report and prioritize 2-3 actions 
                for the next 90 days. Focus on your primary constraint first—progress here will unlock 
                improvements everywhere else.
              </p>
              <button 
                onClick={() => navigate('ask-the-professor')}
                className="px-4 py-2 bg-[#0097A9] text-white rounded-lg font-medium hover:bg-[#007f8f]"
              >
                Discuss with Ask the Professor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConstraintReport;
