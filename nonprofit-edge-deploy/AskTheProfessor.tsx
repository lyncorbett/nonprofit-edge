/**
 * THE NONPROFIT EDGE - Ask the Professor
 * Real Claude API Integration via /api/ask-professor
 * 
 * UPDATED: February 11, 2026
 * - 4 prompt cards across on desktop
 * - 2x2 grid on tablet
 * - Stacked on mobile
 * - Fixed conversation history tracking
 * - Passes conversationId to API for proper upsert
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, User, Lightbulb, History, Plus,
  BookOpen, Target, Users, DollarSign, X, ArrowLeft
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// Brand colors
const NAVY = '#0D2C54';
const TEAL = '#0097A9';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  created_at: string;
  messages: Message[];
  preview: string;
}

interface AskTheProfessorProps {
  user?: {
    id: string;
    name: string;
    email: string;
  };
  onNavigate?: (page: string) => void;
}

const SUGGESTED_QUESTIONS = [
  {
    icon: Users,
    category: 'BOARD GOVERNANCE',
    question: 'How can I improve board meeting engagement?',
    color: NAVY
  },
  {
    icon: Target,
    category: 'STRATEGIC PLANNING',
    question: 'What makes a strategic plan actually work?',
    color: TEAL
  },
  {
    icon: DollarSign,
    category: 'FUNDRAISING',
    question: 'How do I approach a major donor who has stopped giving?',
    color: '#D4A84B'
  },
  {
    icon: BookOpen,
    category: 'LEADERSHIP',
    question: 'How do I handle a difficult team member?',
    color: '#6366f1'
  }
];

const AskTheProfessor: React.FC<AskTheProfessorProps> = ({ user, onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [userName, setUserName] = useState(user?.name || 'there');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch user name on mount
  useEffect(() => {
    const fetchUserName = async () => {
      if (user?.id) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, first_name')
          .eq('id', user.id)
          .single();
        if (data) {
          setUserName(data.first_name || data.full_name?.split(' ')[0] || 'there');
        }
      }
    };
    fetchUserName();
    fetchConversations();
  }, [user]);

  // Fetch conversation history
  const fetchConversations = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('professor_conversations')
        .select('id, created_at, messages, title')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error('Error fetching conversations:', error);
        return;
      }
      
      if (data) {
        const formatted = data.map(conv => ({
          id: conv.id,
          created_at: conv.created_at,
          messages: conv.messages || [],
          preview: conv.title || conv.messages?.[0]?.content?.substring(0, 60) || 'New conversation'
        }));
        setConversations(formatted);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
  };

  // Start new chat
  const startNewChat = () => {
    setMessages([]);
    setCurrentConversationId(null);
    setShowHistory(false);
  };

  // Load a conversation from history
  const loadConversation = (conv: Conversation) => {
    setMessages(conv.messages);
    setCurrentConversationId(conv.id);
    setShowHistory(false);
  };

  // Format date for history display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Send message to API
  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/ask-professor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          accessToken: session?.access_token,
          localHour: new Date().getHours(),
          conversationId: currentConversationId // Pass existing conversation ID
        }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      // Update conversation ID if new one was created
      if (data.conversationId && !currentConversationId) {
        setCurrentConversationId(data.conversationId);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages([...updatedMessages, assistantMessage]);
      
      // Refresh history after new message
      fetchConversations();
      
    } catch (error) {
      console.error('Error:', error);
      setMessages([
        ...updatedMessages,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please try again in a moment.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleQuestionClick = (question: string) => {
    sendMessage(question);
  };

  return (
    <div className="ask-professor-container">
      <style>{`
        .ask-professor-container {
          min-height: 100vh;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
        }

        /* Header */
        .professor-header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-icon {
          width: 40px;
          height: 40px;
          background: ${NAVY};
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .header-title {
          font-size: 18px;
          font-weight: 700;
          color: ${NAVY};
        }

        .header-subtitle {
          font-size: 13px;
          color: #64748b;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          border: none;
        }

        .btn-history {
          background: #f1f5f9;
          color: #475569;
        }

        .btn-history:hover {
          background: #e2e8f0;
        }

        .btn-new {
          background: ${TEAL};
          color: white;
        }

        .btn-new:hover {
          background: #008999;
        }

        .btn-dashboard {
          background: transparent;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }

        .btn-dashboard:hover {
          background: #f8fafc;
          color: ${NAVY};
        }

        /* Main content */
        .professor-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
          padding: 0 24px;
        }

        /* Empty state / Welcome */
        .welcome-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          text-align: center;
        }

        .welcome-icon {
          width: 72px;
          height: 72px;
          background: ${NAVY};
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 24px;
        }

        .welcome-title {
          font-size: 28px;
          font-weight: 700;
          color: ${NAVY};
          margin-bottom: 12px;
        }

        .welcome-subtitle {
          font-size: 16px;
          color: #64748b;
          max-width: 500px;
          line-height: 1.6;
          margin-bottom: 40px;
        }

        /* Suggested questions grid - RESPONSIVE */
        .suggestions-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          width: 100%;
          max-width: 900px;
        }

        @media (max-width: 1024px) {
          .suggestions-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .suggestions-grid {
            grid-template-columns: 1fr;
          }
        }

        .suggestion-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .suggestion-card:hover {
          border-color: ${TEAL};
          box-shadow: 0 4px 12px rgba(0, 151, 169, 0.15);
          transform: translateY(-2px);
        }

        .suggestion-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }

        .suggestion-category {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .suggestion-question {
          font-size: 14px;
          color: #334155;
          line-height: 1.5;
        }

        /* Messages */
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 24px 0;
        }

        .message {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .message-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .avatar-user {
          background: ${TEAL};
          color: white;
        }

        .avatar-assistant {
          background: ${NAVY};
          color: white;
        }

        .message-content {
          flex: 1;
          padding: 16px 20px;
          border-radius: 12px;
          font-size: 15px;
          line-height: 1.7;
        }

        .content-user {
          background: ${TEAL};
          color: white;
          border-bottom-left-radius: 4px;
        }

        .content-assistant {
          background: white;
          color: #334155;
          border: 1px solid #e2e8f0;
          border-bottom-left-radius: 4px;
        }

        .content-assistant p {
          margin-bottom: 12px;
        }

        .content-assistant p:last-child {
          margin-bottom: 0;
        }

        .content-assistant strong {
          color: ${NAVY};
        }

        .content-assistant ul, .content-assistant ol {
          margin: 12px 0;
          padding-left: 24px;
        }

        .content-assistant li {
          margin-bottom: 8px;
        }

        /* Loading indicator */
        .loading-indicator {
          display: flex;
          gap: 6px;
          padding: 8px 0;
        }

        .loading-dot {
          width: 8px;
          height: 8px;
          background: ${TEAL};
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .loading-dot:nth-child(1) { animation-delay: -0.32s; }
        .loading-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        /* Input area */
        .input-container {
          padding: 16px 0 24px;
          background: #f8fafc;
          position: sticky;
          bottom: 0;
        }

        .input-wrapper {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          display: flex;
          align-items: flex-end;
          padding: 8px;
          transition: border-color 0.2s;
        }

        .input-wrapper:focus-within {
          border-color: ${TEAL};
        }

        .input-textarea {
          flex: 1;
          border: none;
          outline: none;
          padding: 12px 16px;
          font-size: 15px;
          resize: none;
          max-height: 120px;
          line-height: 1.5;
          font-family: inherit;
        }

        .input-textarea::placeholder {
          color: #94a3b8;
        }

        .send-btn {
          width: 48px;
          height: 48px;
          background: ${TEAL};
          border: none;
          border-radius: 12px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }

        .send-btn:hover:not(:disabled) {
          background: #008999;
        }

        .send-btn:disabled {
          background: #cbd5e1;
          cursor: not-allowed;
        }

        .input-hint {
          text-align: center;
          font-size: 12px;
          color: #94a3b8;
          margin-top: 8px;
        }

        /* History sidebar */
        .history-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          z-index: 100;
          animation: fadeIn 0.2s ease;
        }

        .history-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: 360px;
          max-width: 100%;
          height: 100%;
          background: white;
          box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
          z-index: 101;
          display: flex;
          flex-direction: column;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .history-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .history-title {
          font-size: 18px;
          font-weight: 700;
          color: ${NAVY};
        }

        .history-close {
          width: 36px;
          height: 36px;
          border: none;
          background: #f1f5f9;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
        }

        .history-close:hover {
          background: #e2e8f0;
        }

        .history-list {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }

        .history-item {
          padding: 16px;
          border-radius: 10px;
          cursor: pointer;
          margin-bottom: 8px;
          transition: background 0.15s;
        }

        .history-item:hover {
          background: #f8fafc;
        }

        .history-item.active {
          background: #e6f7f8;
          border: 1px solid ${TEAL};
        }

        .history-preview {
          font-size: 14px;
          color: #334155;
          font-weight: 500;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .history-date {
          font-size: 12px;
          color: #94a3b8;
        }

        .history-empty {
          text-align: center;
          padding: 48px 24px;
          color: #94a3b8;
        }

        /* Mobile adjustments */
        @media (max-width: 640px) {
          .professor-header {
            padding: 12px 16px;
          }

          .header-title {
            font-size: 16px;
          }

          .header-subtitle {
            display: none;
          }

          .header-btn span {
            display: none;
          }

          .header-btn {
            padding: 10px;
          }

          .professor-main {
            padding: 0 16px;
          }

          .welcome-section {
            padding: 32px 16px;
          }

          .welcome-title {
            font-size: 24px;
          }

          .history-panel {
            width: 100%;
          }
        }
      `}</style>

      {/* Header */}
      <header className="professor-header">
        <div className="header-left">
          <div className="header-icon">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="header-title">Ask the Professor</div>
            <div className="header-subtitle">AI-powered nonprofit leadership advisor</div>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="header-btn btn-history"
            onClick={() => setShowHistory(true)}
            title="Chat History"
          >
            <History size={18} />
            <span>History</span>
          </button>
          <button 
            className="header-btn btn-new"
            onClick={startNewChat}
            title="New Chat"
          >
            <Plus size={18} />
            <span>New</span>
          </button>
          {onNavigate && (
            <button 
              className="header-btn btn-dashboard"
              onClick={() => onNavigate('dashboard')}
            >
              <ArrowLeft size={18} />
              <span>Dashboard</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="professor-main">
        {messages.length === 0 ? (
          // Empty state with suggestions
          <div className="welcome-section">
            <div className="welcome-icon">
              <Sparkles size={32} />
            </div>
            <h1 className="welcome-title">Hello, {userName}!</h1>
            <p className="welcome-subtitle">
              I'm your nonprofit leadership advisor. Ask me anything about 
              strategy, governance, fundraising, team leadership, or any 
              challenge you're facing.
            </p>
            
            <div className="suggestions-grid">
              {SUGGESTED_QUESTIONS.map((item, idx) => (
                <div
                  key={idx}
                  className="suggestion-card"
                  onClick={() => handleQuestionClick(item.question)}
                >
                  <div 
                    className="suggestion-icon"
                    style={{ background: `${item.color}15`, color: item.color }}
                  >
                    <item.icon size={20} />
                  </div>
                  <div 
                    className="suggestion-category"
                    style={{ color: item.color }}
                  >
                    {item.category}
                  </div>
                  <div className="suggestion-question">{item.question}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Chat messages
          <div className="messages-container">
            {messages.map((msg) => (
              <div key={msg.id} className="message">
                <div className={`message-avatar ${msg.role === 'user' ? 'avatar-user' : 'avatar-assistant'}`}>
                  {msg.role === 'user' ? <User size={18} /> : <Sparkles size={18} />}
                </div>
                <div 
                  className={`message-content ${msg.role === 'user' ? 'content-user' : 'content-assistant'}`}
                  dangerouslySetInnerHTML={{ 
                    __html: msg.role === 'assistant' 
                      ? msg.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n\n/g, '</p><p>')
                          .replace(/\n/g, '<br>')
                          .replace(/^(.*)$/, '<p>$1</p>')
                      : msg.content 
                  }}
                />
              </div>
            ))}
            {isLoading && (
              <div className="message">
                <div className="message-avatar avatar-assistant">
                  <Sparkles size={18} />
                </div>
                <div className="message-content content-assistant">
                  <div className="loading-indicator">
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input */}
        <div className="input-container">
          <div className="input-wrapper">
            <textarea
              ref={inputRef}
              className="input-textarea"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={1}
            />
            <button
              className="send-btn"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
            >
              <Send size={20} />
            </button>
          </div>
          <div className="input-hint">
            AI assistant — please double-check important information.
          </div>
        </div>
      </main>

      {/* History Panel */}
      {showHistory && (
        <>
          <div className="history-overlay" onClick={() => setShowHistory(false)} />
          <div className="history-panel">
            <div className="history-header">
              <h2 className="history-title">Chat History</h2>
              <button className="history-close" onClick={() => setShowHistory(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="history-list">
              {conversations.length > 0 ? (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`history-item ${currentConversationId === conv.id ? 'active' : ''}`}
                    onClick={() => loadConversation(conv)}
                  >
                    <div className="history-preview">{conv.preview}</div>
                    <div className="history-date">{formatDate(conv.created_at)}</div>
                  </div>
                ))
              ) : (
                <div className="history-empty">
                  <Lightbulb size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
                  <p>No conversations yet</p>
                  <p style={{ fontSize: 13, marginTop: 4 }}>Start chatting to build your history</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AskTheProfessor;
