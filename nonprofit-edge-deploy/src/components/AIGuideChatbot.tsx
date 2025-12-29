/**
 * THE NONPROFIT EDGE - AI Guide Chatbot
 * Floating chat assistant for navigation help
 */

import React, { useState, useRef, useEffect } from 'react';

const NAVY = '#1a365d';
const TEAL = '#00a0b0';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AIGuideChatbotProps {
  user: any;
  organization: any;
  onNavigate: (page: string) => void;
}

const quickActions = [
  { label: '📚 Browse Resources', action: 'library' },
  { label: '🎓 Ask the Professor', action: 'professor' },
  { label: '📅 View Events', action: 'events' },
  { label: '❓ How do I get started?', action: 'help-start' }
];

const AIGuideChatbot: React.FC<AIGuideChatbotProps> = ({ user, organization, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [hasNewMessage, setHasNewMessage] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const firstName = user?.full_name?.split(' ')[0] || 'there';

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add welcome message when opened for first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const hour = new Date().getHours();
      const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
      
      setMessages([{
        role: 'assistant',
        content: `${greeting}, ${firstName}! 👋 I'm here to help you navigate The Nonprofit Edge. What would you like to explore today?`
      }]);
      setHasNewMessage(false);
    }
  }, [isOpen, firstName]);

  const handleOpen = () => {
    setIsOpen(true);
    setHasNewMessage(false);
  };

  const handleQuickAction = (action: string) => {
    if (action === 'help-start') {
      setMessages(prev => [
        ...prev,
        { role: 'user', content: 'How do I get started?' },
        { role: 'assistant', content: `Great question! Here's how to get the most out of The Nonprofit Edge:\n\n1️⃣ **Start with the Strategic Plan Check-Up** - See how your current plan scores\n\n2️⃣ **Explore the Template Vault** - 147+ ready-to-use documents\n\n3️⃣ **Ask the Professor** - Get AI-powered strategic guidance\n\n4️⃣ **Join a Live Event** - Connect with other nonprofit leaders\n\nWould you like me to take you to any of these?` }
      ]);
    } else {
      onNavigate(action);
      setIsOpen(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim().toLowerCase();
    setMessages(prev => [...prev, { role: 'user', content: inputValue }]);
    setInputValue('');

    // Simple keyword matching for navigation
    setTimeout(() => {
      let response = '';

      if (userMessage.includes('template') || userMessage.includes('resource') || userMessage.includes('library')) {
        response = 'I\'ll take you to the Resource Library where you can browse 147+ templates and guides!';
        setTimeout(() => onNavigate('library'), 1500);
      } else if (userMessage.includes('event') || userMessage.includes('webinar')) {
        response = 'Let me show you our upcoming events and webinars!';
        setTimeout(() => onNavigate('events'), 1500);
      } else if (userMessage.includes('professor') || userMessage.includes('advice') || userMessage.includes('help with')) {
        response = 'Ask the Professor is perfect for that! It\'s like having a nonprofit consultant on call 24/7.';
        setTimeout(() => onNavigate('professor'), 1500);
      } else if (userMessage.includes('board') || userMessage.includes('assessment')) {
        response = 'The Board Assessment tool helps you evaluate your board\'s effectiveness. Let me take you there!';
        setTimeout(() => onNavigate('board-assessment'), 1500);
      } else if (userMessage.includes('strategic') || userMessage.includes('plan')) {
        response = 'The Strategic Plan Check-Up will analyze your plan and give you actionable recommendations!';
        setTimeout(() => onNavigate('strategic-checkup'), 1500);
      } else if (userMessage.includes('team') || userMessage.includes('invite') || userMessage.includes('member')) {
        response = 'You can manage your team members in the Team section. I\'ll take you there!';
        setTimeout(() => onNavigate('team'), 1500);
      } else {
        response = `I'd be happy to help with that! Here are some things I can assist with:\n\n• Navigate to any tool or section\n• Explain how features work\n• Recommend where to start\n\nTry asking about templates, events, the Professor, or any specific tool!`;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 500);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        id="chatbot-button"
        onClick={handleOpen}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:scale-110 transition-transform z-50"
        style={{ backgroundColor: TEAL }}
      >
        🎓
        {hasNewMessage && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
            1
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-200">
          {/* Header */}
          <div 
            className="px-4 py-3 flex items-center justify-between"
            style={{ backgroundColor: NAVY }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">🎓</span>
              <div>
                <div className="text-white font-bold text-sm">Platform Guide</div>
                <div className="text-green-400 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Online
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-sm whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-[#00a0b0] text-white rounded-br-sm'
                      : 'bg-white border border-gray-200 text-gray-700 rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="px-4 py-2 border-t border-gray-100 bg-white">
              <div className="text-xs text-gray-400 mb-2">Quick actions:</div>
              <div className="flex flex-wrap gap-1">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickAction(action.action)}
                    className="text-xs px-2 py-1 rounded-full border border-gray-200 hover:bg-gray-50 transition"
                    style={{ color: NAVY }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-white flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything..."
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#00a0b0]"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="px-3 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
              style={{ backgroundColor: TEAL }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIGuideChatbot;
