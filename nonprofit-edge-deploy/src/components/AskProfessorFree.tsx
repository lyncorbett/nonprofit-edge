/**
 * Ask the Professor - FREE Public Version
 * No login required. One question only.
 * Shows quality of response, then encourages signup.
 * Route: /ask-the-professor (public) or /ask-free
 */

import React, { useState } from 'react';
import { Send, Loader2, GraduationCap, ArrowRight, MessageCircle, Lock } from 'lucide-react';

const NAVY = '#0D2C54';
const TEAL = '#0097A9';

interface AskProfessorFreeProps {
  onNavigate?: (route: string) => void;
}

const AskProfessorFree: React.FC<AskProfessorFreeProps> = ({ onNavigate }) => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAsked, setHasAsked] = useState(false);
  const [error, setError] = useState('');

  const navigate = (path: string) => {
    if (onNavigate) onNavigate(path);
    else window.location.href = path;
  };

  const suggestedQuestions = [
    "How do I move my board from operational to strategic?",
    "What's the best way to diversify our funding beyond grants?",
    "How should I handle conflict between my board chair and ED?",
    "Our strategic plan feels stale — where do we start?",
  ];

  const handleAsk = async () => {
    if (!question.trim()) return;
    setIsLoading(true);
    setError('');

    try {
      // Try Vercel API first, fall back to n8n
      let res;
      try {
        res = await fetch('/api/ask-professor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: question,
            conversationHistory: [],
            mode: 'free-preview',
          }),
        });
      } catch {
        res = await fetch('https://thenonprofitedge.app.n8n.cloud/webhook/professor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: question,
            conversationHistory: [],
            mode: 'free-preview',
          }),
        });
      }

      if (res.ok) {
        const data = await res.json();
        const text = data.response || data.output || data.message || '';
        setResponse(text);
        setHasAsked(true);
      } else {
        throw new Error('Request failed');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Having trouble connecting. Please try again in a moment.');
    } finally {
      setIsLoading(false);
    }
  };

  // If they've already asked their question — show the response + CTA
  if (hasAsked && response) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors bg-transparent border-none cursor-pointer">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: TEAL }}>
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Ask the Professor</h1>
              <p className="text-xs text-gray-500">Free Preview</p>
            </div>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Their question */}
          <div className="flex justify-end mb-6">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tr-sm px-5 py-3 max-w-md shadow-sm">
              <p className="text-gray-800 text-sm">{question}</p>
            </div>
          </div>

          {/* Professor's response */}
          <div className="flex gap-3 mb-8">
            <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: NAVY }}>
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex-1">
              <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{response}</p>
            </div>
          </div>

          {/* Locked follow-up */}
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center mb-6">
            <Lock className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800 mb-2">Want to Go Deeper?</h3>
            <p className="text-gray-600 text-sm mb-1">
              This was just a preview of what Ask the Professor can do.
            </p>
            <p className="text-gray-600 text-sm mb-5">
              Members get unlimited follow-up questions, document uploads, and personalized strategic guidance — like having a $500/hour consultant on call 24/7.
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity border-none cursor-pointer text-sm flex items-center gap-2 mx-auto"
              style={{ backgroundColor: TEAL }}
            >
              Start Your Free Trial <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Social proof */}
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-2">TRUSTED BY 800+ NONPROFIT LEADERS</p>
            <p className="text-sm text-gray-500 italic">
              "This is like having a strategic advisor who actually understands nonprofits."
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Initial screen — ask your question
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors bg-transparent border-none cursor-pointer">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: TEAL }}>
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">Ask the Professor</h1>
            <p className="text-xs text-gray-500">Free Preview — See the quality for yourself</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: NAVY }}>
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Go Ahead — Ask Me Anything
          </h2>
          <p className="text-gray-600 max-w-lg mx-auto">
            This is your free preview. Ask one real question about your nonprofit — strategy, board governance, fundraising, leadership — and see the quality of guidance you'll get as a member.
          </p>
          <p className="text-sm mt-2" style={{ color: TEAL }}>
            No login required. No strings attached.
          </p>
        </div>

        {/* Suggested questions */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 text-center">
            Or try one of these:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {suggestedQuestions.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => setQuestion(sq)}
                className="text-left px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-gray-400 transition-colors text-sm text-gray-700 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 inline mr-2 opacity-40" />
                {sq}
              </button>
            ))}
          </div>
        </div>

        {/* Input area */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your nonprofit leadership question here..."
            rows={4}
            className="w-full resize-none border-none outline-none text-gray-800 placeholder-gray-400 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
          />
          
          {error && (
            <p className="text-red-500 text-xs mb-2">{error}</p>
          )}

          <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              One free question • Press Enter to send
            </p>
            <button
              onClick={handleAsk}
              disabled={!question.trim() || isLoading}
              className="px-5 py-2 text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity border-none cursor-pointer disabled:opacity-50 flex items-center gap-2"
              style={{ backgroundColor: TEAL }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  Ask the Professor
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Powered by 25+ years of nonprofit consulting experience from Dr. Lyn Corbett
        </p>
      </div>
    </div>
  );
};

export default AskProfessorFree;