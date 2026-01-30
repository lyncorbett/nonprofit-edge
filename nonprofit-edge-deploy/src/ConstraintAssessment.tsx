'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Target, Loader2, CheckCircle } from 'lucide-react';

// Types
interface IntakeData {
  name: string;
  email: string;
  organization: string;
  role: string;
  orgAge: string;
  budget: string;
  staffSize: string;
}

interface Answer {
  questionId: number;
  value: number;
}

// Questions - ordered for triangulation (not grouped by domain)
const questions = [
  { id: 1, text: "Our staff could name our top 3 priorities without hesitation.", domain: "SC" },
  { id: 2, text: "Most decisions get made once and stick.", domain: "SC" },
  { id: 3, text: "Our mission statement actively guides our daily decisions.", domain: "SC" },
  { id: 4, text: "We can clearly measure whether we're succeeding.", domain: "SC" },
  { id: 5, text: "We know exactly what we'd say NO to, even if funding were available.", domain: "SC" },
  { id: 6, text: "Our strategic plan drives our actual work, not just our grant applications.", domain: "SC" },
  { id: 7, text: "Our leadership team is aligned on where we're headed.", domain: "LI" },
  { id: 8, text: "Staff can make day-to-day decisions without checking with leadership.", domain: "LI" },
  { id: 9, text: "Information flows freely between leadership and staff.", domain: "LI" },
  { id: 10, text: "Our leaders model the values we espouse.", domain: "LI" },
  { id: 11, text: "We have clear succession plans for key roles.", domain: "LI" },
  { id: 12, text: "Leadership actively develops future leaders.", domain: "LI" },
  { id: 13, text: "I'm confident delegated projects will be done well.", domain: "LI" },
  { id: 14, text: "When resources are tight, everyone agrees what gets cut first.", domain: "RA" },
  { id: 15, text: "Our budget reflects our stated priorities.", domain: "RA" },
  { id: 16, text: "We have the right people in the right roles.", domain: "RA" },
  { id: 17, text: "Our funding sources are diversified enough to weather losing one.", domain: "RA" },
  { id: 18, text: "We invest in building capacity, not just delivering programs.", domain: "RA" },
  { id: 19, text: "Staff workload is sustainable without heroic effort.", domain: "RA" },
  { id: 20, text: "Our processes are documented so anyone could follow them.", domain: "OC" },
  { id: 21, text: "We use technology effectively to reduce manual work.", domain: "OC" },
  { id: 22, text: "Critical knowledge isn't trapped in any one person's head.", domain: "OC" },
  { id: 23, text: "Our service quality is consistent regardless of who delivers it.", domain: "OC" },
  { id: 24, text: "We learn from mistakes and adjust our processes.", domain: "OC" },
  { id: 25, text: "I could take a 2-week vacation and operations would run smoothly.", domain: "OC" },
  { id: 26, text: "Our team has the energy to take on new challenges.", domain: "OR" },
  { id: 27, text: "Our stated values match how we actually operate.", domain: "OR" },
  { id: 28, text: "We retain our best people.", domain: "OR" },
  { id: 29, text: "We adapt quickly when circumstances change.", domain: "OR" },
  { id: 30, text: "Staff feel psychologically safe raising concerns.", domain: "OR" },
];

const domainNames: Record<string, string> = {
  SC: "Strategic Clarity",
  LI: "Leadership Impact",
  RA: "Resource Alignment",
  OC: "Operational Capacity",
  OR: "Organizational Resilience"
};

// Pattern detection logic
const patterns: Record<string, { name: string; markers: number[]; thresholds: number[] }> = {
  "SC-priority-diffusion": { 
    name: "Priority Diffusion", 
    markers: [1, 14, 2], 
    thresholds: [3, 3, 3] 
  },
  "SC-vision-drift": { 
    name: "Vision Drift", 
    markers: [3, 5, 6], 
    thresholds: [3, 3, 3] 
  },
  "LI-trust-deficit": { 
    name: "Trust Deficit", 
    markers: [13, 8, 25], 
    thresholds: [3, 3, 3] 
  },
  "LI-decision-paralysis": { 
    name: "Decision Paralysis", 
    markers: [2, 8, 7], 
    thresholds: [3, 3, 3] 
  },
  "RA-legacy-drag": { 
    name: "Legacy Drag", 
    markers: [15, 14, 18], 
    thresholds: [3, 3, 3] 
  },
  "RA-funding-fragility": { 
    name: "Funding Fragility", 
    markers: [17, 19, 18], 
    thresholds: [3, 3, 3] 
  },
  "OC-process-debt": { 
    name: "Process Debt", 
    markers: [20, 22, 23], 
    thresholds: [3, 3, 3] 
  },
  "OC-knowledge-silos": { 
    name: "Knowledge Silos", 
    markers: [22, 25, 20], 
    thresholds: [3, 3, 3] 
  },
  "OR-burnout-pattern": { 
    name: "Burnout Pattern", 
    markers: [26, 19, 28], 
    thresholds: [3, 3, 3] 
  },
  "OR-culture-erosion": { 
    name: "Culture Erosion", 
    markers: [27, 30, 28], 
    thresholds: [3, 3, 3] 
  },
};

const interactionPatterns: Record<string, string> = {
  "SC-LI": "Vision Vacuum",
  "SC-RA": "Scattered Scarcity",
  "SC-OC": "Busy but Lost",
  "SC-OR": "Drifting Mission",
  "LI-SC": "Rudderless Ship",
  "LI-RA": "Burnout Spiral",
  "LI-OC": "Bottleneck at the Top",
  "LI-OR": "Succession Cliff",
  "RA-SC": "Survival Mode",
  "RA-LI": "Carrying the Weight",
  "RA-OC": "Infrastructure Deficit",
  "RA-OR": "Fragile Foundation",
  "OC-SC": "Executing What?",
  "OC-LI": "Systems Without Strategy",
  "OC-RA": "Efficiency Trap",
  "OC-OR": "Rigidity Trap",
  "OR-SC": "Resilient but Adrift",
  "OR-LI": "Team Without a Captain",
  "OR-RA": "Grit Without Resources",
  "OR-OC": "Spirit Without Systems",
};

const ConstraintAssessment: React.FC = () => {
  const [screen, setScreen] = useState<'intro' | 'intake' | 'questions' | 'processing' | 'complete'>('intro');
  const [intake, setIntake] = useState<IntakeData>({
    name: '',
    email: '',
    organization: '',
    role: '',
    orgAge: '',
    budget: '',
    staffSize: ''
  });
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [processingStep, setProcessingStep] = useState(0);

  const handleIntakeChange = (field: keyof IntakeData, value: string) => {
    setIntake(prev => ({ ...prev, [field]: value }));
  };

  const isIntakeValid = () => {
    return intake.name && intake.email && intake.organization && intake.role;
  };

  const handleAnswer = (value: number) => {
    const questionId = questions[currentQuestion].id;
    setAnswers(prev => {
      const existing = prev.findIndex(a => a.questionId === questionId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { questionId, value };
        return updated;
      }
      return [...prev, { questionId, value }];
    });

    // Auto-advance after brief delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        startProcessing();
      }
    }, 300);
  };

  const getCurrentAnswer = () => {
    const questionId = questions[currentQuestion].id;
    return answers.find(a => a.questionId === questionId)?.value;
  };

  const startProcessing = () => {
    setScreen('processing');
    const steps = [
      "Analyzing your responses...",
      "Detecting constraint patterns...",
      "Calculating domain scores...",
      "Identifying primary constraint...",
      "Generating your diagnosis..."
    ];
    
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setProcessingStep(step);
      if (step >= steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          calculateAndSubmit();
        }, 800);
      }
    }, 1200);
  };

  const calculateDomainScores = () => {
    const domains: Record<string, number[]> = { SC: [], LI: [], RA: [], OC: [], OR: [] };
    
    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (question) {
        domains[question.domain].push(answer.value);
      }
    });

    return Object.entries(domains).map(([domain, scores]) => ({
      domain,
      name: domainNames[domain],
      score: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
    })).sort((a, b) => a.score - b.score);
  };

  const detectPatterns = () => {
    const detected: string[] = [];
    
    Object.entries(patterns).forEach(([patternId, pattern]) => {
      const markerValues = pattern.markers.map(qId => {
        const answer = answers.find(a => a.questionId === qId);
        return answer?.value || 3;
      });
      
      const allLow = markerValues.every((val, i) => val <= pattern.thresholds[i]);
      if (allLow) {
        detected.push(patternId);
      }
    });

    return detected;
  };

  const calculateAndSubmit = async () => {
    const domainScores = calculateDomainScores();
    const detectedPatterns = detectPatterns();
    
    const primaryConstraint = domainScores[0];
    const secondaryConstraint = domainScores[1];
    const strength = domainScores[domainScores.length - 1];
    
    const interactionKey = `${primaryConstraint.domain}-${secondaryConstraint.domain}`;
    const interactionPattern = interactionPatterns[interactionKey] || "Complex Interaction";

    // Get the specific pattern for the primary constraint
    const constraintPattern = detectedPatterns.find(p => p.startsWith(primaryConstraint.domain)) || "";
    const patternName = constraintPattern ? patterns[constraintPattern]?.name : "General Constraint";

    const results = {
      intake,
      answers,
      domainScores: domainScores.map(d => ({ domain: d.domain, name: d.name, score: d.score.toFixed(1) })),
      primaryConstraint: {
        domain: primaryConstraint.domain,
        name: primaryConstraint.name,
        score: primaryConstraint.score.toFixed(1),
        pattern: patternName
      },
      secondaryConstraint: {
        domain: secondaryConstraint.domain,
        name: secondaryConstraint.name,
        score: secondaryConstraint.score.toFixed(1)
      },
      interactionPattern,
      strength: {
        domain: strength.domain,
        name: strength.name,
        score: strength.score.toFixed(1)
      },
      detectedPatterns,
      completedAt: new Date().toISOString()
    };

    // TODO: Submit to Supabase
    console.log('Assessment Results:', results);
    
    // Store in localStorage for report page
    localStorage.setItem('constraintAssessmentResults', JSON.stringify(results));
    
    setScreen('complete');
  };

  // RENDER: Intro Screen
  if (screen === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Target className="w-4 h-4" />
              The ONE Thing Assessment
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Find Your Organization's<br />
              <span className="text-cyan-400">Primary Constraint</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              This isn't a report card. It's a diagnosis. In 7 minutes, you'll discover the ONE thing limiting your impact—and why fixing it unlocks everything else.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">What You'll Discover</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Your primary constraint (not a list of problems)",
                "The pattern your answers reveal",
                "Why fixing this fixes other things",
                "Specific actions for this week"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50 mb-8">
            <p className="text-slate-400 text-sm">
              <strong className="text-slate-300">How this works:</strong> You'll answer 30 questions about your organization. Answer based on how things actually are, not how you wish they were. There are no right or wrong answers—only honest ones.
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={() => setScreen('intake')}
              className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-8 py-4 rounded-xl text-lg transition-all"
            >
              Start Assessment
              <ChevronRight className="w-5 h-5" />
            </button>
            <p className="text-slate-500 text-sm mt-4">Takes about 7 minutes</p>
          </div>
        </div>
      </div>
    );
  }

  // RENDER: Intake Screen
  if (screen === 'intake') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-xl mx-auto px-6 py-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Tell Us About Your Organization</h2>
            <p className="text-slate-400">This helps us personalize your diagnosis</p>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Name *</label>
                <input
                  type="text"
                  value={intake.name}
                  onChange={(e) => handleIntakeChange('name', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  placeholder="Sarah Chen"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                <input
                  type="email"
                  value={intake.email}
                  onChange={(e) => handleIntakeChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  placeholder="sarah@organization.org"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Organization *</label>
                <input
                  type="text"
                  value={intake.organization}
                  onChange={(e) => handleIntakeChange('organization', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  placeholder="Bay Area Youth Services"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Role *</label>
                <select
                  value={intake.role}
                  onChange={(e) => handleIntakeChange('role', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="">Select your role</option>
                  <option value="ed-ceo">Executive Director / CEO</option>
                  <option value="senior-leader">Senior Leader</option>
                  <option value="manager">Manager</option>
                  <option value="board-member">Board Member</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Organization Age</label>
                  <select
                    value={intake.orgAge}
                    onChange={(e) => handleIntakeChange('orgAge', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Select</option>
                    <option value="0-2">Less than 2 years</option>
                    <option value="2-5">2-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Staff Size</label>
                  <select
                    value={intake.staffSize}
                    onChange={(e) => handleIntakeChange('staffSize', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Select</option>
                    <option value="1-5">1-5</option>
                    <option value="6-15">6-15</option>
                    <option value="16-50">16-50</option>
                    <option value="50+">50+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Annual Budget</label>
                <select
                  value={intake.budget}
                  onChange={(e) => handleIntakeChange('budget', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="">Select</option>
                  <option value="under-500k">Under $500K</option>
                  <option value="500k-2m">$500K - $2M</option>
                  <option value="2m-5m">$2M - $5M</option>
                  <option value="5m+">$5M+</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setScreen('intro')}
                className="flex-1 px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700/50 transition-all"
              >
                Back
              </button>
              <button
                onClick={() => setScreen('questions')}
                disabled={!isIntakeValid()}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  isIntakeValid()
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-900'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // RENDER: Questions Screen
  if (screen === 'questions') {
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const currentValue = getCurrentAnswer();

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-2xl mx-auto px-6 py-8">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 mb-6">
            <p className="text-2xl text-white leading-relaxed mb-8">
              {question.text}
            </p>

            <div className="space-y-3">
              {[
                { value: 1, label: "Strongly Disagree" },
                { value: 2, label: "Disagree" },
                { value: 3, label: "Neutral" },
                { value: 4, label: "Agree" },
                { value: 5, label: "Strongly Agree" }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                    currentValue === option.value
                      ? 'border-cyan-500 bg-cyan-500/10 text-white'
                      : 'border-slate-600 hover:border-slate-500 text-slate-300 hover:bg-slate-700/30'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                    currentValue === option.value
                      ? 'border-cyan-500 bg-cyan-500 text-slate-900'
                      : 'border-slate-500'
                  }`}>
                    {option.value}
                  </div>
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                currentQuestion === 0
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            {currentQuestion === questions.length - 1 && currentValue && (
              <button
                onClick={startProcessing}
                className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold px-6 py-2 rounded-lg transition-all"
              >
                Complete Assessment
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // RENDER: Processing Screen
  if (screen === 'processing') {
    const steps = [
      "Analyzing your responses...",
      "Detecting constraint patterns...",
      "Calculating domain scores...",
      "Identifying primary constraint...",
      "Generating your diagnosis..."
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center px-6">
          <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-8" />
          <h2 className="text-2xl font-bold text-white mb-4">Analyzing Your Organization</h2>
          <div className="space-y-3 max-w-sm mx-auto">
            {steps.map((step, i) => (
              <div 
                key={i}
                className={`flex items-center gap-3 transition-all duration-300 ${
                  i < processingStep ? 'text-cyan-400' : i === processingStep ? 'text-white' : 'text-slate-600'
                }`}
              >
                {i < processingStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : i === processingStep ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-600" />
                )}
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // RENDER: Complete Screen
  if (screen === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center px-6 max-w-lg">
          <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Assessment Complete!</h2>
          <p className="text-slate-400 mb-8">
            Your constraint diagnosis is ready. Click below to see your results.
          </p>
          <a
            href="/dashboard/constraint-report"
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-8 py-4 rounded-xl text-lg transition-all"
          >
            View Your Diagnosis
            <ChevronRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    );
  }

  return null;
};

export default ConstraintAssessment;
