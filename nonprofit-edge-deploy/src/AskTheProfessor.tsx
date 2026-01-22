import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AskTheProfessorProps {
  userName?: string;
  focusArea?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const AskTheProfessor: React.FC<AskTheProfessorProps> = ({ 
  userName = 'there',
  focusArea = 'nonprofit strategy',
  isOpen = true,
  onClose 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial greeting based on focus area
  useEffect(() => {
    if (messages.length === 0) {
      const greeting: Message = {
        role: 'assistant',
        content: `Good morning, ${userName}. I noticed your focus is on ${focusArea}. What's the most pressing challenge you're facing with your ${focusArea.toLowerCase()} right now?`
      };
      setMessages([greeting]);
    }
  }, [userName, focusArea]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Filter out the initial greeting for API call (only send actual conversation)
      const apiMessages = updatedMessages
        .slice(1) // Remove initial greeting
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/ask-professor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          conversationId,
          focusArea,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: data.response 
      };
      
      setMessages([...updatedMessages, assistantMessage]);
      
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

    } catch (error) {
      console.error('Error:', error);
      setMessages([
        ...updatedMessages,
        { 
          role: 'assistant', 
          content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment." 
        },
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
    setMessages([{
      role: 'assistant',
      content: `Good morning, ${userName}. I noticed your focus is on ${focusArea}. What's the most pressing challenge you're facing with your ${focusArea.toLowerCase()} right now?`
    }]);
    setConversationId(null);
  };

  const starterQuestions = [
    "My board isn't engaged. What should I do?",
    "How do I create a strategic plan that actually gets used?",
    "We're struggling with fundraising. Where do I start?",
    "How do I handle a difficult staff situation?",
  ];

  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#003d5c] to-[#008B9A] px-4 py-3">
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
              New Chat
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
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

        {/* Starter questions - show only when just the greeting exists */}
        {messages.length === 1 && (
          <div className="space-y-2 mt-4">
            <p className="text-xs text-gray-500 px-1">Try asking:</p>
            {starterQuestions.map((question, i) => (
              <button
                key={i}
                onClick={() => setInput(question)}
                className="block w-full text-left p-3 rounded-lg border border-gray-200 hover:border-[#008B9A] hover:bg-[#008B9A]/5 transition-colors text-sm text-gray-700"
              >
                {question}
              </button>
            ))}
          </div>
        )}

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
      <div className="border-t border-gray-200 p-3 bg-white">
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
            className="px-4 py-2.5 bg-[#008B9A] hover:bg-[#007a88] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center gap-2"
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
