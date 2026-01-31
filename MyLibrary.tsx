'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, Download, Star, FileText, Award, User,
  Search, Filter, Calendar, Clock, ChevronRight, 
  BookOpen, Target, Users, BarChart3, Briefcase, CheckCircle, Heart
} from 'lucide-react';

interface MyLibraryProps {
  onNavigate?: (page: string) => void;
}

// Sample data - Leadership Profile (null if not taken)
const leadershipProfile: {
  patternName: string;
  completedAt: string;
  scores: { presence: number; clarity: number; ownership: number; investment: number; reflection: number };
  growthEdge: string;
  keyInsight: string;
} | null = {
  patternName: 'The Visionary Catalyst',
  completedAt: '2026-01-28',
  scores: {
    presence: 82,
    clarity: 75,
    ownership: 88,
    investment: 72,
    reflection: 65
  },
  growthEdge: 'Reflection',
  keyInsight: 'You excel at inspiring others and taking decisive action, but could benefit from more structured time for strategic reflection.'
};

// Sample commitments
const sampleCommitments = [
  { id: '1', text: 'Schedule board retreat planning session', deadline: 'this_week', deadlineDate: '2026-02-05', status: 'active' },
  { id: '2', text: 'Complete strategic plan review', deadline: 'this_month', deadlineDate: '2026-02-28', status: 'active' },
  { id: '3', text: 'Update governance policies', deadline: 'today', deadlineDate: '2026-01-30', status: 'completed' },
];

const completedAssessments = [
  {
    id: '1',
    type: 'leadership',
    name: 'Edge Leadership Profile',
    completedAt: '2026-01-28',
    score: 78,
    pattern: 'The Visionary Catalyst',
    pdfUrl: '/assessments/leadership-profile.pdf'
  },
  {
    id: '2',
    type: 'constraint',
    name: 'Core Constraint Assessment',
    completedAt: '2026-01-25',
    result: 'Operations & Capacity',
    pdfUrl: '/assessments/constraint-report.pdf'
  },
  {
    id: '3',
    type: 'board',
    name: 'Board Assessment',
    completedAt: '2026-01-20',
    score: 72,
    zone: 'Effective',
    pdfUrl: '/assessments/board-assessment.pdf'
  }
];

const downloads = [
  { id: '1', name: 'Board Meeting Agenda Template', type: 'Template', size: '24 KB', date: '2026-01-28' },
  { id: '2', name: 'Strategic Planning Guide', type: 'Guide', size: '1.2 MB', date: '2026-01-25' },
  { id: '3', name: 'CEO Evaluation Summary', type: 'Report', size: '156 KB', date: '2026-01-22' },
  { id: '4', name: 'Board Retreat Facilitation Kit', type: 'Kit', size: '3.4 MB', date: '2026-01-18' },
  { id: '5', name: 'Grant Writing Playbook', type: 'Playbook', size: '890 KB', date: '2026-01-15' },
];

const favorites = [
  { id: '1', name: 'Governance as Leadership', type: 'Book Summary', icon: BookOpen },
  { id: '2', name: 'Board Retreat Playbook', type: 'Playbook', icon: Target },
  { id: '3', name: 'Strategic Planning Guide', type: 'Guide', icon: BarChart3 },
  { id: '4', name: 'Board Meeting Template', type: 'Template', icon: FileText },
];

const MyLibrary: React.FC<MyLibraryProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'assessments' | 'commitments' | 'downloads' | 'favorites'>('assessments');
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      window.location.href = `/${page}`;
    }
  };

  const getAssessmentIcon = (type: string) => {
    switch (type) {
      case 'leadership': return User;
      case 'constraint': return Target;
      case 'board': return Users;
      default: return FileText;
    }
  };

  const getAssessmentColor = (type: string) => {
    switch (type) {
      case 'leadership': return { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' };
      case 'constraint': return { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' };
      case 'board': return { bg: 'bg-teal-100', text: 'text-teal-600', border: 'border-teal-200' };
      default: return { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('dashboard')}
              className="hover:opacity-80 transition-opacity"
            >
              <img 
                src="/images/nonprofit-edge-logo.png" 
                alt="The Nonprofit Edge" 
                className="h-10"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<div style="font-weight:800;color:#0D2C54;font-size:16px;">THE NONPROFIT EDGE</div>';
                }}
              />
            </button>
            <span className="text-slate-300">|</span>
            <div>
              <h1 className="text-lg font-bold text-[#0D2C54]">My Library</h1>
              <p className="text-sm text-slate-500">Your assessments, commitments, and saved resources</p>
            </div>
          </div>
          <button
            onClick={() => navigate('dashboard')}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-[#0097A9] font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Leadership Profile Card - show prompt if not taken */}
        {leadershipProfile ? (
          <div className="bg-gradient-to-br from-[#0D2C54] to-[#1a3a5c] rounded-2xl p-6 mb-8 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <Award className="w-8 h-8 text-[#0097A9]" />
                </div>
              <div>
                <div className="text-xs text-[#0097A9] font-semibold uppercase tracking-wider mb-1">
                  Your Leadership Profile
                </div>
                <h2 className="text-2xl font-bold mb-1">{leadershipProfile.patternName}</h2>
                <p className="text-white/60 text-sm">
                  Completed {new Date(leadershipProfile.completedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-[#0097A9] rounded-lg text-sm font-semibold hover:bg-[#007f8f] transition-colors">
              View Full Profile
            </button>
          </div>

          {/* Score bars */}
          <div className="grid grid-cols-5 gap-4 mt-6">
            {Object.entries(leadershipProfile.scores).map(([dimension, score]) => (
              <div key={dimension}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/70 capitalize">{dimension}</span>
                  <span className="text-xs font-semibold">{score}</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#0097A9] rounded-full transition-all"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Growth Edge */}
          <div className="mt-6 p-4 bg-white/10 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-[#0097A9]" />
              <span className="text-sm font-semibold">Growth Edge: {leadershipProfile.growthEdge}</span>
            </div>
            <p className="text-sm text-white/70">{leadershipProfile.keyInsight}</p>
          </div>
        </div>
        ) : (
          /* No Leadership Profile - Prompt to take it */
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <User className="w-8 h-8 text-purple-200" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">Discover Your Leadership Profile</h2>
                  <p className="text-white/70 text-sm">
                    Take the Edge Leadership Profile assessment to understand your leadership style and unlock personalized growth recommendations.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => navigate('leadership-assessment')}
                className="px-5 py-3 bg-white text-purple-700 rounded-xl font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2"
              >
                Take Assessment
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { id: 'assessments', label: 'Completed Assessments', count: completedAssessments.length },
            { id: 'commitments', label: 'My Commitments', count: sampleCommitments.filter(c => c.status === 'active').length },
            { id: 'downloads', label: 'Downloads', count: downloads.length },
            { id: 'favorites', label: 'Saved Favorites', count: favorites.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#0D2C54] text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0097A9]"
          />
        </div>

        {/* Content */}
        {activeTab === 'assessments' && (
          <div className="space-y-4">
            {completedAssessments.map((assessment) => {
              const Icon = getAssessmentIcon(assessment.type);
              const colors = getAssessmentColor(assessment.type);
              
              return (
                <div 
                  key={assessment.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${colors.text}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0D2C54]">{assessment.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(assessment.completedAt).toLocaleDateString()}
                          </span>
                          {assessment.score && (
                            <span className={`text-xs font-semibold ${colors.text}`}>
                              Score: {assessment.score}%
                            </span>
                          )}
                          {assessment.pattern && (
                            <span className="text-xs text-purple-600 font-medium">
                              {assessment.pattern}
                            </span>
                          )}
                          {assessment.result && (
                            <span className="text-xs text-amber-600 font-medium">
                              Primary: {assessment.result}
                            </span>
                          )}
                          {assessment.zone && (
                            <span className="text-xs text-teal-600 font-medium">
                              Zone: {assessment.zone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-[#0097A9] hover:bg-slate-50 rounded-lg transition-colors">
                        <Download className="w-5 h-5" />
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-[#0097A9] text-white rounded-lg text-sm font-medium hover:bg-[#007f8f] transition-colors">
                        View Report
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Take Another Assessment CTA */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 border-dashed rounded-xl p-6 text-center">
              <p className="text-slate-600 mb-3">Ready for another assessment?</p>
              <button 
                onClick={() => navigate('member-resources')}
                className="px-4 py-2 bg-[#0D2C54] text-white rounded-lg text-sm font-medium hover:bg-[#0a2445] transition-colors"
              >
                Browse Tools
              </button>
            </div>
          </div>
        )}

        {activeTab === 'commitments' && (
          <div className="space-y-4">
            {sampleCommitments.filter(c => c.status === 'active').map((commitment) => {
              const daysUntil = Math.ceil(
                (new Date(commitment.deadlineDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );
              const isOverdue = daysUntil < 0;
              const isDueToday = daysUntil === 0;
              
              return (
                <div 
                  key={commitment.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isOverdue ? 'bg-red-100' : isDueToday ? 'bg-amber-100' : 'bg-teal-100'
                      }`}>
                        <Target className={`w-6 h-6 ${
                          isOverdue ? 'text-red-600' : isDueToday ? 'text-amber-600' : 'text-teal-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0D2C54]">{commitment.text}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Due: {new Date(commitment.deadlineDate).toLocaleDateString()}
                          </span>
                          <span className={`text-xs font-semibold ${
                            isOverdue ? 'text-red-600' : isDueToday ? 'text-amber-600' : 'text-teal-600'
                          }`}>
                            {isOverdue ? 'Overdue' : isDueToday ? 'Due today' : `${daysUntil} days left`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#0097A9] text-white rounded-lg text-sm font-medium hover:bg-[#007f8f] transition-colors">
                      <CheckCircle className="w-4 h-4" />
                      Mark Complete
                    </button>
                  </div>
                </div>
              );
            })}
            
            {/* Completed commitments */}
            {sampleCommitments.filter(c => c.status === 'completed').length > 0 && (
              <>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mt-6 mb-3">Completed</h3>
                {sampleCommitments.filter(c => c.status === 'completed').map((commitment) => (
                  <div 
                    key={commitment.id}
                    className="bg-slate-50 rounded-xl border border-slate-200 p-5 opacity-70"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-500 line-through">{commitment.text}</h3>
                        <span className="text-xs text-green-600 font-medium">Completed</span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
            
            {/* Make New Commitment CTA */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 border-dashed rounded-xl p-6 text-center">
              <Heart className="w-8 h-8 text-amber-500 mx-auto mb-3" />
              <p className="text-slate-600 mb-3">Ready to commit to your next leadership action?</p>
              <button 
                onClick={() => navigate('dashboard')}
                className="px-4 py-2 bg-[#D4A84B] text-white rounded-lg text-sm font-medium hover:bg-[#c49a3d] transition-colors"
              >
                Make a Commitment
              </button>
            </div>
          </div>
        )}

        {activeTab === 'downloads' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">File</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Size</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {downloads.map((file) => (
                  <tr key={file.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-slate-400" />
                        <span className="font-medium text-[#0D2C54]">{file.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                        {file.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">{file.size}</td>
                    <td className="px-5 py-4 text-sm text-slate-500">{file.date}</td>
                    <td className="px-5 py-4">
                      <button className="p-2 text-[#0097A9] hover:bg-[#0097A9]/10 rounded-lg transition-colors">
                        <Download className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="grid grid-cols-2 gap-4">
            {favorites.map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-[#0097A9] transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#0097A9]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0D2C54]">{item.name}</h3>
                        <p className="text-xs text-slate-400">{item.type}</p>
                      </div>
                    </div>
                    <button className="text-amber-400 hover:text-amber-500">
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                </div>
              );
            })}
            
            {/* Browse More CTA */}
            <div 
              onClick={() => navigate('member-resources')}
              className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-5 flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <div className="text-center">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Browse more resources</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLibrary;
