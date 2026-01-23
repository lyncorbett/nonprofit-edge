import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AskTheProfessorProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const AskTheProfessor: React.FC<AskTheProfessorProps> = ({ isOpen = true, onClose }) => {
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

  // Generate initial greeting from API
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

      // Filter out greeting marker
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
    "My board isn't engaged. What should I do?",
    "How do I create a strategic plan that actually gets used?",
    "We're struggling with fundraising. Where do I start?",
    "How do I handle a difficult staff situation?",
  ];

  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-full bg-white rounded-l-xl shadow-2xl overflow-hidden w-full min-w-[420px] max-w-[520px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#003d5c] to-[#008B9A] px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-xl">🎓</span>
            </div>
            <div>
              <h2 className="text-white font-semibold">Ask the Professor</h2>
              <p className="text-white/70 text-xs">Available 24/7</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={startNewConversation}
              className="text-white/70 hover:text-white text-xs px-2 py-1 rounded border border-white/30 hover:border-white/60 transition-colors"
            >
              New
            </button>
            <a
              href="/ask-professor"
              className="text-white/70 hover:text-white p-1.5 rounded border border-white/30 hover:border-white/60 transition-colors"
              title="Open full screen"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </a>
            {onClose && (
              <button onClick={onClose} className="text-white/70 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" style={{ minHeight: 0 }}>
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              message.role === 'user'
                ? 'bg-[#003d5c] text-white rounded-br-md'
                : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
            }`}>
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-1 text-[#008B9A] font-medium text-xs">
                  <span>🎓</span> The Professor
                </div>
              )}
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
            </div>
          </div>
        ))}

        {/* Starter questions */}
        {messages.length === 1 && !isLoading && (
          <div className="space-y-2 mt-4">
            <p className="text-xs text-gray-500 px-1">Try asking:</p>
            {starterQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setInput(q)}
                className="block w-full text-left p-3 rounded-lg border border-gray-200 hover:border-[#008B9A] hover:bg-[#008B9A]/5 transition-colors text-sm text-gray-700"
              >
                {q}
              </button>
            ))}
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

      {/* Input */}
      <div className="border-t border-gray-200 p-3 bg-white flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about board engagement, strategy, funding..."
            className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:border-[#008B9A] focus:ring-2 focus:ring-[#008B9A]/20 transition-all text-sm"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2.5 bg-[#008B9A] hover:bg-[#007a88] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Ask the Professor • AI can make mistakes. Please double-check responses.
        </p>
      </div>
    </div>
  );
};

export default AskTheProfessor;
