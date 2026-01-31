'use client';

import React, { useState } from 'react';
import { 
  Target, ArrowLeft, ArrowRight, CheckCircle, 
  AlertTriangle, Lightbulb, ChevronRight
} from 'lucide-react';

interface ConstraintAssessmentProps {
  onNavigate?: (page: string) => void;
  onComplete?: (score: number) => void;
}

const ConstraintAssessment: React.FC<ConstraintAssessmentProps> = ({ onNavigate, onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const navigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      window.location.href = `/${page}`;
    }
  };

  const questions = [
    {
      category: 'Funding & Resources',
      question: 'Our organization consistently has the financial resources needed to achieve our strategic goals.',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
    },
    {
      category: 'Funding & Resources',
      question: 'We have diverse, sustainable revenue streams that reduce financial risk.',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
    },
    {
      category: 'Leadership & Governance',
      question: 'Our board provides effective strategic guidance and oversight.',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
    },
    {
      category: 'Leadership & Governance',
      question: 'We have strong leadership succession plans in place.',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
    },
    {
      category: 'Operations & Capacity',
      question: 'Our team has the skills and capacity to execute our strategic plan.',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
    },
    {
      category: 'Operations & Capacity',
      question: 'Our systems and processes support efficient operations.',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
    },
    {
      category: 'Strategy & Focus',
      question: 'We have a clear, focused strategy that everyone understands.',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
    },
    {
      category: 'Strategy & Focus',
      question: 'We effectively measure and track progress toward our goals.',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
    },
  ];

  const totalSteps = questions.length + 1; // questions + results
  const progress = ((step + 1) / totalSteps) * 100;

  const handleAnswer = (value: number) => {
    setAnswers({ ...answers, [step]: value });
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Show results
      setStep(questions.length);
      if (onComplete) {
        const avgScore = Object.values({ ...answers, [step]: value }).reduce((a, b) => a + b, 0) / questions.length;
        onComplete(Math.round(avgScore * 20));
      }
    }
  };

  const getConstraintResult = () => {
    const scores: Record<string, number[]> = {};
    questions.forEach((q, idx) => {
      if (!scores[q.category]) scores[q.category] = [];
      if (answers[idx] !== undefined) scores[q.category].push(answers[idx]);
    });
    
    let lowestCategory = '';
    let lowestScore = Infinity;
    
    Object.entries(scores).forEach(([category, categoryScores]) => {
      const avg = categoryScores.reduce((a, b) => a + b, 0) / categoryScores.length;
      if (avg < lowestScore) {
        lowestScore = avg;
        lowestCategory = category;
      }
    });
    
    return { category: lowestCategory, score: lowestScore };
  };

  // Results screen
  if (step === questions.length) {
    const result = getConstraintResult();
    
    return (
      <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <header className="bg-white border-b border-slate-200 px-8 py-4">
          <div className="max-w-3xl mx-auto flex items-center gap-4">
            <button onClick={() => navigate('dashboard')} className="text-slate-400 hover:text-[#0097A9]">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-[#0D2C54]">Core Constraint Assessment</h1>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-8 py-12">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-[#0097A9]/10 flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-[#0097A9]" />
            </div>
            
            <h2 className="text-2xl font-bold text-[#0D2C54] mb-2">Your Core Constraint</h2>
            <p className="text-slate-500 mb-6">Based on your responses, here's what's holding your organization back:</p>
            
            <div className="bg-gradient-to-r from-[#0D2C54] to-[#1a3a5c] rounded-xl p-6 text-white mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-[#0097A9]" />
                <span className="text-sm font-semibold text-[#0097A9]">PRIMARY CONSTRAINT</span>
              </div>
              <h3 className="text-2xl font-bold">{result.category}</h3>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-left">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-800 mb-1">What This Means</h4>
                  <p className="text-sm text-amber-700">
                    According to the Theory of Constraints, focusing improvement efforts on this ONE area 
                    will have the greatest impact on your overall organizational performance.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('dashboard')}
                className="flex-1 py-3 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => navigate('constraint-report')}
                className="flex-1 py-3 bg-[#0097A9] text-white rounded-lg font-medium hover:bg-[#007f8f] flex items-center justify-center gap-2"
              >
                View Full Report
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Question screen
  const currentQuestion = questions[step];

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header className="bg-white border-b border-slate-200 px-8 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate('dashboard')} className="text-slate-400 hover:text-[#0097A9]">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-[#0D2C54]">Core Constraint Assessment</h1>
            <div className="h-1.5 bg-slate-100 rounded-full mt-2">
              <div 
                className="h-full bg-[#0097A9] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span className="text-sm text-slate-500">{step + 1} of {questions.length}</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-8 py-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <span className="inline-block px-3 py-1 bg-[#0097A9]/10 text-[#0097A9] text-sm font-semibold rounded-full mb-4">
            {currentQuestion.category}
          </span>
          
          <h2 className="text-xl font-semibold text-[#0D2C54] mb-8">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                  answers[step] === idx
                    ? 'border-[#0097A9] bg-[#0097A9]/5'
                    : 'border-slate-200 hover:border-[#0097A9]/50'
                }`}
              >
                <span className="font-medium text-[#0D2C54]">{option}</span>
              </button>
            ))}
          </div>

          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="mt-6 text-slate-500 hover:text-[#0097A9] font-medium flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConstraintAssessment;
