import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Question {
  id: number;
  text: string;
  dimension: 'clarity' | 'investment' | 'ownership' | 'reflection';
  weight: number;
}

const questions: Question[] = [
  // CLARITY (12 questions)
  { id: 1, text: "When I make a difficult decision, people can trace it back to what I've said matters.", dimension: 'clarity', weight: 1 },
  { id: 2, text: "I can describe where we're going in a way that makes people want to be part of it.", dimension: 'clarity', weight: 1 },
  { id: 3, text: "My calendar reflects my stated priorities.", dimension: 'clarity', weight: 1 },
  { id: 4, text: "I tell people the truth, even when it's uncomfortable.", dimension: 'clarity', weight: 1.2 },
  { id: 5, text: "I make expectations clear—people know what success looks like.", dimension: 'clarity', weight: 1 },
  { id: 6, text: "When I talk about our mission, it's specific enough that people can picture it.", dimension: 'clarity', weight: 1 },
  { id: 7, text: "I make hard calls rather than avoiding them.", dimension: 'clarity', weight: 1.2 },
  { id: 8, text: "I say what I stand for—and it's consistent over time.", dimension: 'clarity', weight: 1 },
  { id: 9, text: "The people we serve would recognize themselves in how I describe our work.", dimension: 'clarity', weight: 1 },
  { id: 10, text: "I provide direction, not just inspiration.", dimension: 'clarity', weight: 1 },
  { id: 11, text: "I help people believe the future can be better than today.", dimension: 'clarity', weight: 1 },
  { id: 12, text: "I challenge things that aren't working—even when it's uncomfortable to name them.", dimension: 'clarity', weight: 1 },

  // INVESTMENT (12 questions)
  { id: 13, text: "I spend regular time developing the people on my team—not just managing tasks.", dimension: 'investment', weight: 1 },
  { id: 14, text: "I know what's going on in my people's lives—not just their work.", dimension: 'investment', weight: 1 },
  { id: 15, text: "I give people real responsibility, not just assignments.", dimension: 'investment', weight: 1 },
  { id: 16, text: "I think about who will carry this work forward after me.", dimension: 'investment', weight: 1.2 },
  { id: 17, text: "When making decisions, I ask whose voice isn't in the room.", dimension: 'investment', weight: 1 },
  { id: 18, text: "I pay attention to who gets opportunities—and who consistently doesn't.", dimension: 'investment', weight: 1 },
  { id: 19, text: "I recognize people in ways that are specific to what they did and who they are.", dimension: 'investment', weight: 1 },
  { id: 20, text: "I've built a team that could succeed without me.", dimension: 'investment', weight: 1.2 },
  { id: 21, text: "I actively create space for people to lead, even when I could do it myself.", dimension: 'investment', weight: 1 },
  { id: 22, text: "I notice when someone is struggling and make time to check in.", dimension: 'investment', weight: 1 },
  { id: 23, text: "I help people see their potential, not just their performance.", dimension: 'investment', weight: 1 },
  { id: 24, text: "I celebrate progress, not just outcomes.", dimension: 'investment', weight: 1 },

  // OWNERSHIP (12 questions)
  { id: 25, text: "When things go wrong, I look at my role first.", dimension: 'ownership', weight: 1.2 },
  { id: 26, text: "I follow through on what I say I'll do.", dimension: 'ownership', weight: 1 },
  { id: 27, text: "I take responsibility for the culture my leadership creates.", dimension: 'ownership', weight: 1 },
  { id: 28, text: "I own my mistakes publicly, not just privately.", dimension: 'ownership', weight: 1.2 },
  { id: 29, text: "I act on problems rather than waiting for someone else to fix them.", dimension: 'ownership', weight: 1 },
  { id: 30, text: "I hold myself to the same standards I expect from others.", dimension: 'ownership', weight: 1 },
  { id: 31, text: "I address difficult conversations directly rather than avoiding them.", dimension: 'ownership', weight: 1 },
  { id: 32, text: "I make decisions and stand behind them.", dimension: 'ownership', weight: 1 },
  { id: 33, text: "I take accountability for results, not just effort.", dimension: 'ownership', weight: 1 },
  { id: 34, text: "I create clarity when things are ambiguous rather than waiting for direction.", dimension: 'ownership', weight: 1 },
  { id: 35, text: "I speak up when I see something that needs to change.", dimension: 'ownership', weight: 1 },
  { id: 36, text: "I prioritize what matters most, even when it's not what's most urgent.", dimension: 'ownership', weight: 1 },

  // REFLECTION (12 questions)
  { id: 37, text: "I make time to reflect on how I'm leading, not just what I'm doing.", dimension: 'reflection', weight: 1 },
  { id: 38, text: "I ask for feedback—and actually change based on what I hear.", dimension: 'reflection', weight: 1.2 },
  { id: 39, text: "I can name what I'm learning right now.", dimension: 'reflection', weight: 1 },
  { id: 40, text: "I notice when I'm reacting out of fear or ego.", dimension: 'reflection', weight: 1 },
  { id: 41, text: "I learn from failures rather than just moving past them.", dimension: 'reflection', weight: 1 },
  { id: 42, text: "I take time to rest and recover—not just power through.", dimension: 'reflection', weight: 1 },
  { id: 43, text: "I'm honest with myself about my limitations.", dimension: 'reflection', weight: 1 },
  { id: 44, text: "I revisit my assumptions when things aren't working.", dimension: 'reflection', weight: 1 },
  { id: 45, text: "I have people in my life who will tell me the truth.", dimension: 'reflection', weight: 1.2 },
  { id: 46, text: "I can sit with uncertainty without rushing to resolve it.", dimension: 'reflection', weight: 1 },
  { id: 47, text: "I notice patterns in my leadership—both strengths and blind spots.", dimension: 'reflection', weight: 1 },
  { id: 48, text: "I invest in my own growth, not just the growth of others.", dimension: 'reflection', weight: 1 },
];

const dimensionInfo = {
  clarity: {
    name: 'Vision & Clarity',
    description: 'Do I know what I stand for and where we\'re going—and can others see it too?',
    color: '#1B365D',
  },
  investment: {
    name: 'People Investment',
    description: 'Do I put real time into the people and priorities that matter most?',
    color: '#0097A9',
  },
  ownership: {
    name: 'Radical Ownership',
    description: 'Do I own my decisions, challenges, and my part in what happens?',
    color: '#C4A052',
  },
  reflection: {
    name: 'Growth & Reflection',
    description: 'Do I slow down, learn from experience, and keep growing?',
    color: '#27ae60',
  },
};

export default function LeadershipAssessment() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const progress = (Object.keys(answers).length / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const currentDimension = dimensionInfo[currentQ.dimension];

  const handleAnswer = (value: number) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: value }));
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 300);
    }
  };

  const calculateScores = () => {
    const scores: Record<string, { raw: number; max: number; weighted: number; maxWeighted: number }> = {
      clarity: { raw: 0, max: 0, weighted: 0, maxWeighted: 0 },
      investment: { raw: 0, max: 0, weighted: 0, maxWeighted: 0 },
      ownership: { raw: 0, max: 0, weighted: 0, maxWeighted: 0 },
      reflection: { raw: 0, max: 0, weighted: 0, maxWeighted: 0 },
    };

    questions.forEach(q => {
      const answer = answers[q.id] || 0;
      scores[q.dimension].raw += answer;
      scores[q.dimension].max += 5;
      scores[q.dimension].weighted += answer * q.weight;
      scores[q.dimension].maxWeighted += 5 * q.weight;
    });

    return Object.entries(scores).reduce((acc, [key, value]) => {
      const percentage = Math.round((value.weighted / value.maxWeighted) * 100);
      let zone: 'developing' | 'common' | 'leading';
      if (percentage >= 80) zone = 'leading';
      else if (percentage >= 60) zone = 'common';
      else zone = 'developing';
      
      acc[key] = {
        ...value,
        percentage,
        zone,
      };
      return acc;
    }, {} as Record<string, any>);
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    setIsSubmitting(true);
    const scores = calculateScores();

    try {
      const { error } = await supabase.from('leadership_assessments').insert({
        user_id: user?.id,
        answers: answers,
        scores: scores,
        clarity_score: scores.clarity.percentage,
        investment_score: scores.investment.percentage,
        ownership_score: scores.ownership.percentage,
        reflection_score: scores.reflection.percentage,
        completed_at: new Date().toISOString(),
      });

      if (error) throw error;

      navigate('/leadership-assessment/report', { state: { scores, answers } });
    } catch (error) {
      console.error('Error saving assessment:', error);
      alert('There was an error saving your assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isComplete = Object.keys(answers).length === questions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-[#1B365D] text-white py-6 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-serif font-semibold">The Edge Leadership Profile™</h1>
          <p className="text-blue-200 mt-1">48 questions · ~12 minutes</p>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#1B365D] to-[#0097A9] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Dimension Badge */}
        <div 
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-white mb-6"
          style={{ backgroundColor: currentDimension.color }}
        >
          <span className="w-2 h-2 bg-white/50 rounded-full" />
          {currentDimension.name}
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <p className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed mb-8">
            {currentQ.text}
          </p>

          {/* Rating Scale */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-500 px-2">
              <span>Rarely</span>
              <span>Always</span>
            </div>
            <div className="flex justify-between gap-3">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  className={`flex-1 aspect-square max-w-[80px] rounded-xl text-2xl font-semibold transition-all duration-200 
                    ${answers[currentQ.id] === value
                      ? 'bg-[#1B365D] text-white shadow-lg scale-105'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:scale-102'
                    }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <div className="flex gap-1">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentQuestion
                    ? 'bg-[#1B365D] w-6'
                    : answers[questions[idx].id]
                      ? 'bg-[#0097A9]'
                      : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {currentQuestion < questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestion(prev => prev + 1)}
              className="px-4 py-2 text-[#1B365D] hover:text-[#0097A9] flex items-center gap-2"
            >
              Next
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isComplete || isSubmitting}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                isComplete
                  ? 'bg-[#C4A052] text-white hover:bg-[#a8863f] shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'View My Results'}
            </button>
          )}
        </div>

        {/* Quick Nav */}
        {Object.keys(answers).length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Jump to Dimension</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(dimensionInfo).map(([key, info]) => {
                const dimQuestions = questions.filter(q => q.dimension === key);
                const answered = dimQuestions.filter(q => answers[q.id]).length;
                const firstUnanswered = dimQuestions.find(q => !answers[q.id]);
                
                return (
                  <button
                    key={key}
                    onClick={() => {
                      const idx = firstUnanswered 
                        ? questions.findIndex(q => q.id === firstUnanswered.id)
                        : questions.findIndex(q => q.dimension === key);
                      setCurrentQuestion(idx);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-white border hover:border-gray-300 transition-colors"
                  >
                    <span 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: info.color }}
                    />
                    <span className="text-gray-700">{info.name}</span>
                    <span className="text-gray-400">({answered}/12)</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
