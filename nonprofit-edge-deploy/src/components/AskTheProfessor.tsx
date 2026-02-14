/**
 * THE NONPROFIT EDGE - Ask the Professor
 * Real Claude API Integration via /api/ask-professor
 * 
 * UPDATED: February 6, 2026
 * - Fixed starter questions
 * - Added New Chat button
 * - Added Chat History button
 * - Fixed greeting to use user's name
 * - Session tracking via API (not page reloads)
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, User, Lightbulb, History, Plus,
  BookOpen, Target, Users, DollarSign, X, ArrowLeft
} from 'lucide-react';
import { supabase } from '../lib/supabase';

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
    color: '#0D2C54'
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
  const [sessionStart, setSessionStart] = useState<number | null>(null);
  const [sessionMinutes, setSessionMinutes] = useState(0);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [warningSent, setWarningSent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
          setUserName(data.full_name || data.first_name || 'there');
        }
      }
    };
    fetchUserName();
  }, [user]);

  // Fetch conversation history
  const fetchConversations = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || user?.id;
    console.log("Fetching for userId:", userId);
    if (!userId) return;
    console.log("Fetching conversations for user:", user?.id);
    
    const { data } = await supabase
      .from('professor_conversations')
      .select('id, created_at, messages')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (data) {
      const formatted = data.map(conv => ({
        id: conv.id,
        created_at: conv.created_at,
        messages: conv.messages || [],
        preview: conv.messages?.find(m => m.role === 'user')?.content?.substring(0, 60) || 'New conversation'
      }));
      setConversations(formatted);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Session timer — track elapsed minutes
  useEffect(() => {
    if (!sessionStart) return;
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionStart) / 60000);
      setSessionMinutes(elapsed);
      
      // At 45 minutes, inject a warning from the Professor
      if (elapsed >= 45 && !warningSent && !sessionEnded) {
        setWarningSent(true);
        const warningMessage: Message = {
          id: `warning-${Date.now()}`,
          role: 'assistant',
          content: "We've got about 5 minutes left in this session. What's your biggest takeaway, and what's your first move this week?",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, warningMessage]);
      }
      
      // At 50 minutes, end the session
      if (elapsed >= 50 && !sessionEnded) {
        setSessionEnded(true);
        const closingMessage: Message = {
          id: `closing-${Date.now()}`,
          role: 'assistant',
          content: "That's our time for this session. You've got a plan — now go execute. Start a new session anytime you need me.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, closingMessage]);
        clearInterval(interval);
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [sessionStart, warningSent, sessionEnded]);

  // Start a new chat
  const startNewChat = () => {
    setMessages([]);
    setCurrentConversationId(null);
    setShowHistory(false);
    setSessionStart(null);
    setSessionMinutes(0);
    setSessionEnded(false);
    setWarningSent(false);
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
    if (!content.trim() || isLoading || sessionEnded) return;

    // Start session timer on first message
    if (!sessionStart) {
      setSessionStart(Date.now());
    }

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
          conversationId: currentConversationId // Pass existing conversation ID if continuing
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

  // Format message content with basic markdown
  const formatContent = (text: string) => {
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\n/g, '<br/>');
    return { __html: formatted };
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        gap: '12px',
      }}>
        {/* Left side - Logo and title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          <div style={{
            width: '36px',
            height: '36px',
            minWidth: '36px',
            background: 'linear-gradient(135deg, #0D2C54 0%, #1a4175 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Sparkles style={{ width: '18px', height: '18px', color: '#0097A9' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ 
              fontSize: '16px', 
              fontWeight: 700, 
              color: '#1e293b', 
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              Ask the Professor
            </h1>
            <p style={{ 
              fontSize: '12px', 
              color: '#64748b', 
              margin: 0,
              display: 'none',
            }}
            className="header-subtitle"
            >
              AI-powered nonprofit leadership advisor
            </p>
          </div>
        </div>
        
        {/* Right side - Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* History Button - Icon only on mobile */}
          <button
            onClick={() => {
              fetchConversations();
              setShowHistory(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px',
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#475569',
              cursor: 'pointer',
              transition: 'all 0.2s',
              minWidth: '40px',
              height: '40px',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
            onMouseOut={(e) => e.currentTarget.style.background = 'white'}
            title="Chat History"
          >
            <History style={{ width: '18px', height: '18px' }} />
            <span className="button-text" style={{ display: 'none' }}>History</span>
          </button>
          
          {/* New Chat Button - Icon only on mobile */}
          <button
            onClick={startNewChat}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px',
              background: '#0D2C54',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
              minWidth: '40px',
              height: '40px',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#1a4175'}
            onMouseOut={(e) => e.currentTarget.style.background = '#0D2C54'}
            title="New Chat"
          >
            <Plus style={{ width: '18px', height: '18px' }} />
            <span className="button-text" style={{ display: 'none' }}>New</span>
          </button>
          
          {/* Back to Dashboard - Icon only on mobile */}
          <button
            onClick={() => onNavigate?.('/dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px',
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#475569',
              cursor: 'pointer',
              minWidth: '40px',
              height: '40px',
            }}
            title="Back to Dashboard"
          >
            <ArrowLeft style={{ width: '18px', height: '18px' }} />
            <span className="button-text" style={{ display: 'none' }}>Dashboard</span>
          </button>
        </div>
      </header>

      {/* Chat History Sidebar - Full screen on mobile */}
      {showHistory && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 100,
        }}
        onClick={() => setShowHistory(false)}
        >
          <div 
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: '360px',
              background: 'white',
              boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Chat History</h2>
              <button
                onClick={() => setShowHistory(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X style={{ width: '24px', height: '24px', color: '#64748b' }} />
              </button>
            </div>
            
            <div style={{ flex: 1, overflow: 'auto', padding: '12px' }}>
              {conversations.length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px 20px' }}>
                  No previous conversations yet.
                </p>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => loadConversation(conv)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: currentConversationId === conv.id ? '#f1f5f9' : 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseOut={(e) => e.currentTarget.style.background = currentConversationId === conv.id ? '#f1f5f9' : 'white'}
                  >
                    <p style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#1e293b',
                      margin: '0 0 4px 0',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {conv.preview}...
                    </p>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                      {formatDate(conv.created_at)}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        
        {/* Empty State / Welcome */}
        {messages.length === 0 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #0D2C54 0%, #1a4175 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}>
              <Sparkles style={{ width: '32px', height: '32px', color: '#0097A9' }} />
            </div>
            
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', marginBottom: '8px', textAlign: 'center' }}>
              Hello, {userName}!
            </h2>
            <p style={{ fontSize: '15px', color: '#64748b', textAlign: 'center', maxWidth: '400px', lineHeight: 1.6, marginBottom: '32px', padding: '0 8px' }}>
              I'm your nonprofit leadership advisor. Ask me anything about strategy, governance, fundraising, team leadership, or any challenge you're facing.
            </p>
            
            {/* Suggested Questions - Single column on mobile */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(1, 1fr)',
              gap: '12px', 
              width: '100%', 
              maxWidth: '600px',
              padding: '0 16px',
            }}
            className="questions-grid"
            >
              {SUGGESTED_QUESTIONS.map((item, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(item.question)}
                  style={{
                    padding: '20px',
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = item.color;
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <item.icon style={{ width: '18px', height: '18px', color: item.color }} />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: item.color, letterSpacing: '0.5px' }}>
                      {item.category}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#1e293b', margin: 0, lineHeight: 1.4 }}>
                    {item.question}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '20px',
                }}
              >
                <div style={{
                  maxWidth: '80%',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  background: message.role === 'user' ? '#0D2C54' : 'white',
                  color: message.role === 'user' ? 'white' : '#1e293b',
                  border: message.role === 'assistant' ? '1px solid #e2e8f0' : 'none',
                  boxShadow: message.role === 'assistant' ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
                }}>
                  {message.role === 'assistant' && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '12px',
                      paddingBottom: '12px',
                      borderBottom: '1px solid #f1f5f9',
                    }}>
                      <Sparkles style={{ width: '16px', height: '16px', color: '#0097A9' }} />
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#0097A9' }}>The Professor</span>
                    </div>
                  )}
                  <div 
                    style={{ fontSize: '15px', lineHeight: 1.7 }}
                    dangerouslySetInnerHTML={formatContent(message.content)}
                  />
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
                <div style={{
                  padding: '16px 20px',
                  borderRadius: '16px',
                  background: 'white',
                  border: '1px solid #e2e8f0',
                }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0097A9', animation: 'bounce 1s infinite' }} />
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0097A9', animation: 'bounce 1s infinite 0.15s' }} />
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0097A9', animation: 'bounce 1s infinite 0.3s' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Area */}
        <div style={{
          padding: '12px 16px',
          background: 'white',
          borderTop: '1px solid #e2e8f0',
        }}>
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'flex-end',
            maxWidth: '800px',
            margin: '0 auto',
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={sessionEnded ? "Session ended — start a new conversation" : "Ask me anything..."}
              rows={1}
              disabled={sessionEnded}
              style={{
                flex: 1,
                padding: '12px 14px',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '16px',
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit',
                minHeight: '48px',
                maxHeight: '120px',
                opacity: sessionEnded ? 0.5 : 1,
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading || sessionEnded}
              style={{
                padding: '12px 16px',
                background: !input.trim() || isLoading || sessionEnded ? '#94a3b8' : '#0097A9',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                cursor: !input.trim() || isLoading || sessionEnded ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '48px',
                height: '48px',
              }}
            >
              <Send style={{ width: '20px', height: '20px' }} />
            </button>
          </div>
          <p style={{
            fontSize: '11px',
            color: '#94a3b8',
            textAlign: 'center',
            marginTop: '8px',
          }}>
            Each coaching session is approximately 45 minutes{sessionStart && !sessionEnded ? ` · ${50 - sessionMinutes} min remaining` : ''}
          </p>
        </div>
      </div>

      {/* CSS Animation and Responsive Styles */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        
        /* Desktop styles */
        @media (min-width: 768px) {
          .header-subtitle {
            display: block !important;
          }
          .button-text {
            display: inline !important;
          }
          .questions-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 16px !important;
            padding: 0 !important;
          }
        }
        
        /* Mobile adjustments */
        @media (max-width: 767px) {
          .message-bubble {
            max-width: 90% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AskTheProfessor;
