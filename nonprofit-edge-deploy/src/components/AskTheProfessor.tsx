/**
 * THE NONPROFIT EDGE - Ask the Professor
 * Real Claude API Integration via /api/ask-professor
 * 
 * UPDATED: February 3, 2026
 * - Replaced canned responses with real API call
 * - Added disclaimer about AI responses
 * - Auto-scroll to latest message
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, User, Lightbulb, 
  BookOpen, Target, Users, DollarSign
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AskTheProfessorProps {
  user?: {
    id: string;
    name: string;
    email: string;
  };
  organization?: {
    id: string;
    name: string;
    tier: string;
  };
  onNavigate?: (page: string) => void;
}

const SUGGESTED_QUESTIONS = [
  {
    icon: Users,
    category: 'Board Governance',
    question: 'How can I improve board meeting engagement?',
    color: '#0D2C54'
  },
  {
    icon: Target,
    category: 'Strategic Planning',
    question: 'What makes a strategic plan actually work?',
    color: '#0097A9'
  },
  {
    icon: DollarSign,
    category: 'Fundraising',
    question: 'How do I approach a major donor ask?',
    color: '#D4A84B'
  },
  {
    icon: BookOpen,
    category: 'Leadership',
    question: 'How do I handle a difficult board member?',
    color: '#6366f1'
  }
];

const AskTheProfessor: React.FC<AskTheProfessorProps> = ({ user, organization, onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Format markdown-like content for display
  const formatContent = (text: string) => {
    // Convert **bold** to <strong>
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Convert numbered lists
    formatted = formatted.replace(/^(\d+)\.\s/gm, '<br/>$1. ');
    // Convert bullet points
    formatted = formatted.replace(/^[-•]\s/gm, '<br/>• ');
    return formatted;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);
    setError(null);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    try {
      // Build conversation history for context
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }));
      conversationHistory.push({ role: 'user', content: currentInput });

      const response = await fetch('/api/ask-professor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationHistory,
          userId: user?.id || null,
          organizationName: organization?.name || null,
          userRole: user?.name || null,
          tier: organization?.tier || 'essential',
          focusArea: null,
          sessionId: `session_${Date.now()}`
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error (${response.status})`);
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: data.response || 'I apologize, but I received an empty response. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Ask Professor error:', err);
      setError(err.message || 'Connection failed');
      
      const errorMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment. If this continues, check that your internet connection is working.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  const userName = user?.name?.split(' ')[0] || 'there';

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: 'calc(100vh - 73px)',
      maxWidth: '900px',
      margin: '0 auto',
      padding: '0 24px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 0',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0D2C54 0%, #1a3a5c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={20} color="#0097A9" />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0D2C54', margin: 0 }}>
              Ask the Professor
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              AI-powered nonprofit leadership advisor
            </p>
          </div>
        </div>
        {onNavigate && (
          <button
            onClick={() => onNavigate('dashboard')}
            style={{
              padding: '8px 16px',
              background: '#f1f5f9',
              color: '#475569',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← Back to Dashboard
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '24px 0',
      }}>
        {messages.length === 0 ? (
          /* Welcome State */
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #0D2C54 0%, #1a3a5c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <Sparkles size={36} color="#0097A9" />
            </div>
            
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: 700, 
              color: '#0D2C54', 
              marginBottom: '12px' 
            }}>
              Hello, {userName}!
            </h2>
            
            <p style={{ 
              color: '#64748b', 
              fontSize: '16px', 
              maxWidth: '500px', 
              margin: '0 auto 40px',
              lineHeight: 1.6
            }}>
              I'm your nonprofit leadership advisor. Ask me anything about strategy, 
              governance, fundraising, team leadership, or any challenge you're facing.
            </p>

            {/* Suggested Questions */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '12px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              {SUGGESTED_QUESTIONS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedQuestion(item.question)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '16px',
                      background: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#0097A9';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: `${item.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Icon size={18} color={item.color} />
                    </div>
                    <div>
                      <div style={{ 
                        fontSize: '11px', 
                        color: item.color, 
                        fontWeight: 600,
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {item.category}
                      </div>
                      <div style={{ 
                        fontSize: '14px', 
                        color: '#0D2C54',
                        fontWeight: 500
                      }}>
                        {item.question}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Messages */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start'
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: message.role === 'user' 
                    ? 'linear-gradient(135deg, #0097A9 0%, #00b4cc 100%)'
                    : 'linear-gradient(135deg, #0D2C54 0%, #1a3a5c 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {message.role === 'user' ? (
                    <User size={18} color="white" />
                  ) : (
                    <Sparkles size={18} color="#0097A9" />
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    fontSize: '13px', 
                    fontWeight: 600, 
                    color: '#64748b',
                    marginBottom: '6px'
                  }}>
                    {message.role === 'user' ? 'You' : 'The Professor'}
                  </div>
                  <div 
                    style={{
                      background: message.role === 'user' ? '#f1f5f9' : 'white',
                      border: message.role === 'user' ? 'none' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '16px',
                      fontSize: '15px',
                      lineHeight: 1.7,
                      color: '#1e293b',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}
                    dangerouslySetInnerHTML={{ 
                      __html: formatContent(message.content) 
                    }}
                  />
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0D2C54 0%, #1a3a5c 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Sparkles size={18} color="#0097A9" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
                    The Professor
                  </div>
                  <div style={{
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#0097A9',
                            animation: `bounce 1.4s infinite ease-in-out both`,
                            animationDelay: `${i * 0.16}s`
                          }}
                        />
                      ))}
                    </div>
                    <span style={{ color: '#64748b', fontSize: '14px' }}>Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{ 
        padding: '16px 0 24px',
        borderTop: '1px solid #e2e8f0',
        background: '#f8fafc'
      }}>
        {error && (
          <div style={{
            padding: '8px 12px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#dc2626',
            fontSize: '13px',
            marginBottom: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Connection issue: {error}</span>
            <button 
              onClick={() => setError(null)}
              style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 600 }}
            >
              ✕
            </button>
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: '12px',
          background: 'white',
          border: '2px solid #e2e8f0',
          borderRadius: '16px',
          padding: '12px 16px',
          alignItems: 'flex-end',
          transition: 'border-color 0.2s',
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask me anything about nonprofit leadership..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: '15px',
              lineHeight: 1.5,
              minHeight: '24px',
              maxHeight: '120px',
              fontFamily: 'inherit'
            }}
            rows={1}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 120) + 'px';
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: input.trim() && !isLoading ? '#0097A9' : '#e2e8f0',
              border: 'none',
              cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              flexShrink: 0
            }}
          >
            <Send size={20} color={input.trim() && !isLoading ? 'white' : '#94a3b8'} />
          </button>
        </div>
        
        <p style={{ 
          textAlign: 'center', 
          fontSize: '12px', 
          color: '#94a3b8', 
          marginTop: '12px' 
        }}>
          Ask the Professor is an AI assistant and can make mistakes. Please double-check responses.
        </p>
      </div>

      {/* Bounce animation */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default AskTheProfessor;
