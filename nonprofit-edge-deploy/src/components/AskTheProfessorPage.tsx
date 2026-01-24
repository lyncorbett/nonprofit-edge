import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AskTheProfessorPage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('there');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Fetch user name on mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, first_name')
          .eq('id', user.id)
          .single();
        if (profile) {
          setUserName(profile.full_name || profile.first_name || 'there');
        }
      }
    };
    fetchUser();
  }, []);

  // Generate initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      generateGreeting();
    }
  }, []);

  const generateGreeting = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/ask-professor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: '[GREETING]' }],
          accessToken: session?.access_token,
        }),
      });

      const data = await response.json();
      if (data.response) {
        setMessages([{ role: 'assistant', content: data.response }]);
      }
    } catch (error) {
      console.error('Greeting error:', error);
      setMessages([{ role: 'assistant', content: `Hey ${userName}! What's on your mind today?` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const apiMessages = updatedMessages
        .filter(m => m.content !== '[GREETING]')
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/ask-professor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          accessToken: session?.access_token,
        }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      setMessages([...updatedMessages, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: "I'm having trouble connecting. Please try again in a moment." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    generateGreeting();
  };

  const starterQuestions = [
    "My board isn't engaged",
    "Help with strategic planning",
    "Fundraising challenges",
    "Difficult staff situation",
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#003d5c] to-[#008B9A] px-4 py-3 flex-shrink-0 safe-area-top">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-white p-2 -ml-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">🎓</span>
            <div>
              <h1 className="text-white font-semibold text-lg">Ask the Professor</h1>
            </div>
          </div>
          <button
            onClick={startNewConversation}
            className="text-white/80 hover:text-white text-sm px-2 py-1"
          >
            New
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-[#003d5c] text-white rounded-br-md'
                  : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-1 text-[#008B9A] font-medium text-xs">
                  <span>🎓</span> The Professor
                </div>
              )}
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.content}
              </div>
            </div>
          </div>
        ))}

        {/* Starter questions */}
        {messages.length === 1 && !isLoading && (
          <div className="space-y-2 mt-4">
            <p className="text-xs text-gray-500 px-1">Quick topics:</p>
            <div className="flex flex-wrap gap-2">
              {starterQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="px-3 py-2 rounded-full border border-gray-200 hover:border-[#008B9A] hover:bg-[#008B9A]/5 transition-colors text-sm text-gray-700"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 text-[#008B9A] font-medium text-xs mb-1">
                <span>🎓</span> The Professor
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#008B9A] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-[#008B9A] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-[#008B9A] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-3 bg-white flex-shrink-0 safe-area-bottom">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask anything..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#008B9A] focus:ring-2 focus:ring-[#008B9A]/20 transition-all text-base"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 bg-[#008B9A] hover:bg-[#007a88] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-full transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          AI can make mistakes. Please double-check responses.
        </p>
      </div>
    </div>
  );
};

export default AskTheProfessorPage;
