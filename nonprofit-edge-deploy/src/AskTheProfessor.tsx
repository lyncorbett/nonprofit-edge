import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  fileName?: string;
}

const AskTheProfessor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Welcome message on mount
  useEffect(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: `Hello! I'm the AI Professor, your nonprofit strategy advisor with 25+ years of expertise built in. 

I can help you with:
• **Strategic planning** - Mission clarity, goal setting, implementation
• **Board governance** - Roles, engagement, best practices  
• **Financial sustainability** - Revenue diversification, reserves, budgeting
• **Leadership challenges** - Team dynamics, change management, succession
• **Organizational development** - Capacity building, scaling, partnerships

You can also upload a document (PDF, Word, or text file) and I'll analyze it and provide guidance.

What's on your mind today?`,
        timestamp: new Date(),
      },
    ]);
  }, []);

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix to get just base64
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() && !selectedFile) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue || `[Uploaded file: ${selectedFile?.name}]`,
      timestamp: new Date(),
      fileName: selectedFile?.name,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Prepare payload for n8n webhook
      const payload: any = {
        message: inputValue || `Please analyze this document: ${selectedFile?.name}`,
      };

      if (selectedFile) {
        payload.file = await toBase64(selectedFile);
        payload.file_name = selectedFile.name;
      }

      const response = await fetch(
        'https://thenonprofitedge.app.n8n.cloud/webhook/professor',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const responseText = await response.text();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText || 'I apologize, but I encountered an issue processing your request. Please try again.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling AI Professor:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (isValidFileType(file)) {
        setSelectedFile(file);
      }
    }
  };

  const isValidFileType = (file: File): boolean => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    return validTypes.includes(file.type);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (isValidFileType(file)) {
        setSelectedFile(file);
      }
    }
  };

  const formatContent = (content: string) => {
    // Convert markdown-style formatting to HTML
    return content
      .split('\n')
      .map((line, i) => {
        // Bold text
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Bullet points
        if (line.startsWith('• ') || line.startsWith('- ')) {
          return `<li key="${i}">${line.substring(2)}</li>`;
        }
        // Numbered lists
        if (/^\d+\.\s/.test(line)) {
          return `<li key="${i}">${line.replace(/^\d+\.\s/, '')}</li>`;
        }
        return line;
      })
      .join('<br />');
  };

  const suggestedQuestions = [
    "How do I engage my board more effectively?",
    "What should be in a strong strategic plan?",
    "How do I diversify our funding sources?",
    "What are signs of a healthy nonprofit culture?",
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        background: '#0D2C54',
        color: 'white',
        padding: '20px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: '#0097A9',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          🎓
        </div>
        <div>
          <h1 style={{ 
            margin: 0, 
            fontSize: '1.5rem',
            fontFamily: 'Merriweather, serif',
            fontWeight: 700
          }}>
            Ask The Professor
          </h1>
          <p style={{ margin: 0, opacity: 0.8, fontSize: '0.875rem' }}>
            AI-powered nonprofit strategy coaching
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{
        flex: 1,
        maxWidth: '900px',
        width: '100%',
        margin: '0 auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        overflowY: 'auto'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: '16px 20px',
                borderRadius: message.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                background: message.role === 'user' ? '#0D2C54' : 'white',
                color: message.role === 'user' ? 'white' : '#1e293b',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              {message.fileName && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  padding: '8px 12px',
                  background: message.role === 'user' ? 'rgba(255,255,255,0.1)' : '#f1f5f9',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}>
                  📎 {message.fileName}
                </div>
              )}
              <div
                style={{ lineHeight: 1.6 }}
                dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
              />
              <div style={{
                fontSize: '0.75rem',
                opacity: 0.5,
                marginTop: '8px',
                textAlign: message.role === 'user' ? 'right' : 'left'
              }}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '16px 20px',
              borderRadius: '20px 20px 20px 4px',
              background: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                display: 'flex',
                gap: '4px'
              }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#0097A9',
                      animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite both`,
                    }}
                  />
                ))}
              </div>
              <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                Thinking...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />

        {/* Suggested Questions (only show if no user messages yet) */}
        {messages.length === 1 && (
          <div style={{ marginTop: '16px' }}>
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#64748b',
              marginBottom: '12px'
            }}>
              Try asking:
            </p>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {suggestedQuestions.map((question, i) => (
                <button
                  key={i}
                  onClick={() => setInputValue(question)}
                  style={{
                    padding: '8px 16px',
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    color: '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#0097A9';
                    e.currentTarget.style.color = '#0097A9';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.color = '#475569';
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{
        background: 'white',
        borderTop: '1px solid #e2e8f0',
        padding: '16px 24px',
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
        }}>
          {/* File Drop Zone */}
          {selectedFile && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: '#f0fdfa',
              border: '1px solid #0097A9',
              borderRadius: '8px',
              marginBottom: '12px',
              fontSize: '0.875rem'
            }}>
              <span>📎</span>
              <span style={{ flex: 1 }}>{selectedFile.name}</span>
              <button
                onClick={() => setSelectedFile(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  fontSize: '1.25rem',
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px' }}>
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                background: dragActive ? '#f0fdfa' : '#f8fafc',
                border: `2px solid ${dragActive ? '#0097A9' : '#e2e8f0'}`,
                borderRadius: '12px',
                transition: 'all 0.2s'
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  fontSize: '1.25rem',
                  padding: '4px'
                }}
                title="Attach a file"
              >
                📎
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about nonprofit strategy..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  fontSize: '1rem',
                  outline: 'none',
                  color: '#1e293b'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || (!inputValue.trim() && !selectedFile)}
              style={{
                padding: '12px 24px',
                background: isLoading || (!inputValue.trim() && !selectedFile) ? '#cbd5e1' : '#0097A9',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: isLoading || (!inputValue.trim() && !selectedFile) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isLoading ? 'Sending...' : 'Send'}
              {!isLoading && <span>→</span>}
            </button>
          </form>

          <p style={{
            fontSize: '0.75rem',
            color: '#94a3b8',
            marginTop: '8px',
            textAlign: 'center'
          }}>
            Powered by AI with 25+ years of nonprofit expertise • Drop files here or click 📎 to upload
          </p>
        </div>
      </div>

      {/* CSS Animation for loading dots */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default AskTheProfessor;
