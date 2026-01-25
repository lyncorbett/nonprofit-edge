import React, { useState, useRef, useEffect } from 'react';
import { supabase } from './lib/supabase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const BetaPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        setUserEmail(session.user.email || '');
        
        // Get user name from profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, first_name')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUserName(profile.full_name || profile.first_name || '');
        }
      }
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, []);

  // Generate greeting when logged in
  useEffect(() => {
    if (isLoggedIn && messages.length === 0) {
      generateGreeting();
    }
  }, [isLoggedIn]);

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
      } else {
        setMessages([{ role: 'assistant', content: `Hey${userName ? ` ${userName}` : ''}! What's on your mind today?` }]);
      }
    } catch (error) {
      console.error('Greeting error:', error);
      setMessages([{ role: 'assistant', content: `Hey${userName ? ` ${userName}` : ''}! What's on your mind today?` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;

      if (data.session) {
        setIsLoggedIn(true);
        setUserEmail(data.session.user.email || '');
        setShowLogin(false);
        
        // Get user name
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, first_name')
          .eq('id', data.session.user.id)
          .single();
        
        if (profile) {
          setUserName(profile.full_name || profile.first_name || '');
        }
      }
    } catch (error: any) {
      setLoginError(error.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setMessages([]);
    setUserName('');
    setUserEmail('');
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

  // Loading state
  if (isCheckingAuth) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0D2C54 0%, #1a4175 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎓</div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in - show welcome screen
  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0D2C54 0%, #1a4175 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
      }}>
        <div style={{
          maxWidth: '480px',
          width: '100%',
          textAlign: 'center',
        }}>
          {/* Logo/Header */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎓</div>
            <h1 style={{ 
              color: 'white', 
              fontSize: '32px', 
              fontWeight: 700,
              marginBottom: '8px'
            }}>
              Ask the Professor
            </h1>
            <p style={{ 
              color: 'rgba(255,255,255,0.7)', 
              fontSize: '16px',
              lineHeight: 1.6
            }}>
              Early Access Preview
            </p>
          </div>

          {/* Beta Badge */}
          <div style={{
            display: 'inline-block',
            background: '#0097A9',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '1px',
            marginBottom: '32px',
          }}>
            🚀 FOUNDING MEMBER PREVIEW
          </div>

          {/* Description */}
          <p style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '16px',
            lineHeight: 1.7,
            marginBottom: '32px',
          }}>
            Welcome! You're one of a select few getting early access to The Nonprofit Edge's AI-powered strategic advisor before our February 24th launch.
          </p>

          {!showLogin ? (
            <button
              onClick={() => setShowLogin(true)}
              style={{
                background: '#0097A9',
                color: 'white',
                border: 'none',
                padding: '16px 48px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Sign In to Start
            </button>
          ) : (
            <form onSubmit={handleLogin} style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'left',
            }}>
              <h2 style={{ 
                color: '#0D2C54', 
                fontSize: '20px', 
                fontWeight: 700,
                marginBottom: '24px',
                textAlign: 'center'
              }}>
                Sign In
              </h2>

              {loginError && (
                <div style={{
                  background: '#fee2e2',
                  color: '#dc2626',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  marginBottom: '16px',
                }}>
                  {loginError}
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  color: '#64748b', 
                  fontSize: '14px',
                  marginBottom: '6px',
                  fontWeight: 500
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  color: '#64748b', 
                  fontSize: '14px',
                  marginBottom: '6px',
                  fontWeight: 500
                }}>
                  Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                style={{
                  width: '100%',
                  background: loginLoading ? '#94a3b8' : '#0D2C54',
                  color: 'white',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: loginLoading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  marginBottom: '16px',
                }}
              >
                {loginLoading ? 'Signing in...' : 'Sign In'}
              </button>

              <button
                type="button"
                onClick={() => setShowLogin(false)}
                style={{
                  width: '100%',
                  background: 'none',
                  color: '#64748b',
                  border: 'none',
                  padding: '8px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Cancel
              </button>
            </form>
          )}

          <p style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '13px',
            marginTop: '32px',
          }}>
            The Nonprofit Edge • Launching February 24, 2026
          </p>
        </div>
      </div>
    );
  }

  // Logged in - show chat
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
        background: 'linear-gradient(135deg, #0D2C54 0%, #1a4175 100%)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '32px' }}>🎓</span>
          <div>
            <h1 style={{ color: 'white', fontSize: '20px', fontWeight: 700, margin: 0 }}>
              Ask the Professor
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: 0 }}>
              Early Access Preview
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
            {userEmail}
          </span>
          <button
            onClick={startNewConversation}
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            New Chat
          </button>
          <button
            onClick={handleSignOut}
            style={{
              background: 'none',
              color: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div style={{
        flex: 1,
        maxWidth: '800px',
        width: '100%',
        margin: '0 auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          marginBottom: '24px',
        }}>
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '16px',
              }}
            >
              <div style={{
                maxWidth: '75%',
                padding: '16px 20px',
                borderRadius: message.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                background: message.role === 'user' 
                  ? 'linear-gradient(135deg, #0D2C54 0%, #1a4175 100%)' 
                  : 'white',
                color: message.role === 'user' ? 'white' : '#0D2C54',
                boxShadow: message.role === 'assistant' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                fontSize: '15px',
                lineHeight: 1.7,
              }}>
                {message.role === 'assistant' && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    marginBottom: '8px',
                    color: '#0097A9',
                    fontWeight: 600,
                    fontSize: '13px'
                  }}>
                    🎓 The Professor
                  </div>
                )}
                <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
              </div>
            </div>
          ))}

          {/* Loading */}
          {isLoading && (
            <div style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginBottom: '16px',
            }}>
              <div style={{
                background: 'white',
                padding: '16px 20px',
                borderRadius: '20px 20px 20px 4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '8px',
                  color: '#0097A9',
                  fontWeight: 600,
                  fontSize: '13px'
                }}>
                  🎓 The Professor
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: '#0097A9',
                    borderRadius: '50%',
                    animation: 'bounce 1s infinite',
                    animationDelay: '0ms',
                  }} />
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: '#0097A9',
                    borderRadius: '50%',
                    animation: 'bounce 1s infinite',
                    animationDelay: '150ms',
                  }} />
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: '#0097A9',
                    borderRadius: '50%',
                    animation: 'bounce 1s infinite',
                    animationDelay: '300ms',
                  }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about board engagement, strategy, fundraising, leadership..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '14px 18px',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '15px',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              style={{
                background: !input.trim() || isLoading ? '#94a3b8' : '#0097A9',
                color: 'white',
                border: 'none',
                padding: '14px 24px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              Send
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
          <p style={{
            color: '#94a3b8',
            fontSize: '12px',
            textAlign: 'center',
            marginTop: '12px',
            marginBottom: 0,
          }}>
            AI can make mistakes. Please double-check important information.
          </p>
        </div>
      </div>

      {/* Feedback Banner */}
      <div style={{
        background: '#0097A9',
        padding: '12px 24px',
        textAlign: 'center',
      }}>
        <p style={{ color: 'white', fontSize: '14px', margin: 0 }}>
          💬 We'd love your feedback! Reply to Lyn's email with your thoughts on Ask the Professor.
        </p>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
};

export default BetaPage;
