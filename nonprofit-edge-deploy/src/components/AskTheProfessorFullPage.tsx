import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Logo component - doubled in size
const Logo = ({ width = 320 }: { width?: number }) => (
  <svg width={width} height={width * 0.4} viewBox="250 270 500 220">
    <g>
      <path fill="#0D2C54" d="M438.46,469.14c-18.16,14.03-40.93,22.38-65.64,22.38c-30.79,0-58.55-12.94-78.16-33.69c2.85,0.46,5.7,0.81,8.57,1.06c9.13,0.79,17.9,0.49,26.26-0.63c12.72,7.44,27.53,11.71,43.33,11.71c17.17,0,33.17-5.03,46.59-13.71C422.94,460.11,428.93,465.14,438.46,469.14z"/>
      <path fill="#0D2C54" d="M294.86,420.29c-8.64,2.53-16.05,3.61-21.74,4.02c-5.05-12.44-7.82-26.05-7.82-40.31c0-59.37,48.14-107.52,107.52-107.52c25.62,0,49.15,8.96,67.62,23.94c-9.33,2.92-16.19,7.85-20.47,11.69c-13.54-8.9-29.74-14.08-47.15-14.08c-47.48,0-85.97,38.49-85.97,85.97C286.85,396.97,289.72,409.27,294.86,420.29z"/>
      <path fill="#0097A9" d="M258.67,434.74c0,0,61.28,14.58,121.38-60.61l-18.3-13.11l72.86-22.42l0.39,71.06l-18.78-13.01C416.22,396.64,340.29,479.82,258.67,434.74z"/>
      <g>
        <path fill="#0D2C54" d="M491.43,298.55v7.98h-9.88v32.91h-9.08v-32.91h-9.88v-7.98H491.43z"/>
        <path fill="#0D2C54" d="M528.3,298.55v40.89h-9.08V322.6h-14.13v16.83H496v-40.89h9.08v16.02h14.13v-16.02H528.3z"/>
        <path fill="#0D2C54" d="M543.91,306.53v8.27h12.17v7.69h-12.17v8.97h13.76v7.98h-22.84v-40.89h22.84v7.98H543.91z"/>
      </g>
      <g>
        <path fill="#0097A9" d="M495.94,392.68h-9.08l-15.19-25.22v25.22h-9.08v-40.89h9.08l15.19,25.34v-25.34h9.08V392.68z"/>
        <path fill="#0097A9" d="M510.53,390.41c-2.92-1.79-5.24-4.28-6.96-7.48c-1.72-3.2-2.58-6.8-2.58-10.8c0-4,0.86-7.59,2.58-10.78c1.72-3.18,4.04-5.67,6.96-7.46c2.92-1.79,6.14-2.68,9.64-2.68c3.51,0,6.72,0.89,9.64,2.68c2.92,1.79,5.22,4.27,6.91,7.46c1.68,3.18,2.52,6.78,2.52,10.78c0,4-0.85,7.6-2.55,10.8c-1.7,3.2-4,5.7-6.91,7.48c-2.9,1.79-6.11,2.68-9.62,2.68C516.66,393.09,513.45,392.19,510.53,390.41z"/>
        <path fill="#0097A9" d="M577.65,392.68h-9.08l-15.19-25.22v25.22h-9.08v-40.89h9.08l15.19,25.34v-25.34h9.08V392.68z"/>
      </g>
      <g>
        <path fill="#0D2C54" d="M476.97,418.87v13.1h19.27v12.18h-19.27v14.21h21.8v12.64h-36.19v-64.78h36.19v12.64H476.97z"/>
        <path fill="#0D2C54" d="M546.58,410.29c4.66,2.71,8.26,6.51,10.82,11.4c2.55,4.89,3.83,10.54,3.83,16.93c0,6.34-1.28,11.97-3.83,16.89c-2.55,4.92-6.17,8.74-10.86,11.44c-4.69,2.71-10.11,4.06-16.29,4.06h-22.14v-64.78h22.14C536.48,406.23,541.92,407.58,546.58,410.29z"/>
        <path fill="#0D2C54" d="M608.53,426.71c-1.07-2.15-2.6-3.8-4.59-4.94c-1.99-1.14-4.33-1.71-7.03-1.71c-4.66,0-8.39,1.68-11.19,5.03c-2.81,3.35-4.21,7.83-4.21,13.43c0,5.97,1.47,10.63,4.42,13.98c2.95,3.35,7,5.03,12.16,5.03c3.54,0,6.52-0.98,8.96-2.95c2.44-1.97,4.22-4.8,5.34-8.49h-18.26v-11.63h31.31v14.67c-1.07,3.94-2.88,7.6-5.43,10.98c-2.55,3.38-5.79,6.12-9.72,8.21c-3.93,2.09-8.36,3.14-13.3,3.14c-5.84,0-11.04-1.4-15.61-4.2c-4.57-2.8-8.14-6.69-10.69-11.67c-2.55-4.98-3.83-10.67-3.83-17.07c0-6.4,1.28-12.1,3.83-17.12c2.55-5.01,6.1-8.92,10.65-11.72c4.55-2.8,9.73-4.2,15.57-4.2c7.07,0,13.03,1.88,17.89,5.63c4.85,3.75,8.07,8.95,9.64,15.6H608.53z"/>
        <path fill="#0D2C54" d="M647.83,418.87v13.1h19.27v12.18h-19.27v14.21h21.8v12.64h-36.19v-64.78h36.19v12.64H647.83z"/>
      </g>
    </g>
  </svg>
);

const AskTheProfessorFullPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('there');
  const [isClosing, setIsClosing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Fetch user info and generate greeting on mount
  useEffect(() => {
    const init = async () => {
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
      generateGreeting();
    };
    init();
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
      } else {
        setMessages([{ role: 'assistant', content: `Hey ${userName}! What's on your mind today?` }]);
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

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 300);
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        animation: isClosing ? 'slideOut 0.3s ease forwards' : 'slideIn 0.3s ease',
      }}
    >
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #0D2C54 0%, #1a4175 100%)',
        padding: '20px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Logo width={180} />
          <div style={{
            width: '1px',
            height: '40px',
            background: 'rgba(255,255,255,0.2)',
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '40px' }}>🎓</span>
            <div>
              <h1 style={{ color: 'white', fontSize: '22px', fontWeight: 700, margin: 0 }}>
                Ask the Professor
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: 0 }}>
                Your 24/7 nonprofit leadership advisor
              </p>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={startNewConversation}
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
          >
            New Chat
          </button>
          <button
            onClick={handleClose}
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Dashboard
          </button>
          <button
            onClick={handleClose}
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: 'none',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            title="Close"
          >
            ✕
          </button>
        </div>
      </header>

      {/* Chat Container */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        padding: '32px',
        overflowY: 'auto',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '900px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Messages */}
          <div style={{ flex: 1, marginBottom: '24px' }}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '20px',
                }}
              >
                <div style={{
                  maxWidth: '70%',
                  padding: '18px 24px',
                  borderRadius: message.role === 'user' ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
                  background: message.role === 'user' 
                    ? 'linear-gradient(135deg, #0097A9 0%, #00b4cc 100%)' 
                    : 'white',
                  color: message.role === 'user' ? 'white' : '#0D2C54',
                  boxShadow: message.role === 'assistant' ? '0 2px 12px rgba(0,0,0,0.08)' : 'none',
                  fontSize: '15px',
                  lineHeight: 1.7,
                }}>
                  {message.role === 'assistant' && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      marginBottom: '12px',
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
                marginBottom: '20px',
              }}>
                <div style={{
                  background: 'white',
                  padding: '18px 24px',
                  borderRadius: '24px 24px 24px 4px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    marginBottom: '12px',
                    color: '#0097A9',
                    fontWeight: 600,
                    fontSize: '13px'
                  }}>
                    🎓 The Professor
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <div className="loading-dot" style={{
                      width: '10px',
                      height: '10px',
                      background: '#0097A9',
                      borderRadius: '50%',
                      animation: 'bounce 1s infinite',
                    }} />
                    <div className="loading-dot" style={{
                      width: '10px',
                      height: '10px',
                      background: '#0097A9',
                      borderRadius: '50%',
                      animation: 'bounce 1s infinite',
                      animationDelay: '150ms',
                    }} />
                    <div className="loading-dot" style={{
                      width: '10px',
                      height: '10px',
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
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div style={{
        borderTop: '1px solid #e2e8f0',
        background: 'white',
        padding: '20px 32px',
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
        }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about board engagement, strategic planning, fundraising, leadership..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '16px 24px',
                border: '2px solid #e2e8f0',
                borderRadius: '16px',
                fontSize: '16px',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#0097A9'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              style={{
                background: !input.trim() || isLoading 
                  ? '#94a3b8' 
                  : 'linear-gradient(135deg, #0097A9 0%, #00b4cc 100%)',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '16px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'transform 0.2s',
              }}
            >
              Send
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

      {/* Animations */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default AskTheProfessorFullPage;
