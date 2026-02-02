import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Loader2, Upload, X, FileText, GraduationCap } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AskTheProfessorProps {
  onNavigate?: (route: string) => void;
}

const AskTheProfessor: React.FC<AskTheProfessorProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm Dr. Lyn Corbett, your nonprofit leadership advisor. I've spent 15+ years working with over 800 nonprofit organizations, helping them build sustainable impact.\n\nHow can I help you today? You can ask me about strategic planning, board governance, fundraising, leadership development, or any other nonprofit challenge you're facing.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !uploadedFile) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: uploadedFile 
        ? `[Attached: ${uploadedFile.name}]\n\n${input}` 
        : input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('message', input);
      formData.append('conversationHistory', JSON.stringify(messages));
      
      if (uploadedFile) {
        formData.append('file', uploadedFile);
      }

      // Try Vercel API first, fall back to n8n
      let response;
      try {
        response = await fetch('/api/ask-professor', {
          method: 'POST',
          body: formData,
        });
      } catch {
        // Fallback to n8n
        response = await fetch('https://thenonprofitedge.app.n8n.cloud/webhook/professor', {
          method: 'POST',
          body: formData,
        });
      }

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response || data.output || data.message || "I apologize, but I couldn't process that request. Please try again.",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setUploadedFile(null);
    }
  };

  const suggestedQuestions = [
    "How do I create an effective strategic plan?",
    "What makes a high-performing board?",
    "How can I diversify our funding sources?",
    "What's the best way to develop emerging leaders?",
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => onNavigate?.('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1B365D] to-[#0097A9] rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Ask the Professor</h1>
              <p className="text-sm text-gray-500">AI-powered nonprofit coaching</p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-6 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-[#1B365D] text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                    <GraduationCap className="w-4 h-4 text-[#0097A9]" />
                    <span className="text-sm font-medium text-[#0097A9]">Dr. Lyn Corbett</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start mb-6">
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#0097A9]" />
                  <span className="text-gray-500">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested Questions (show only if few messages) */}
      {messages.length <= 2 && (
        <div className="max-w-4xl mx-auto px-4 pb-4">
          <p className="text-sm text-gray-500 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question)}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-[#0097A9] hover:text-[#0097A9] transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {uploadedFile && (
            <div className="mb-3 flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 flex-1 truncate">{uploadedFile.name}</span>
              <button onClick={() => setUploadedFile(null)} className="p-1 hover:bg-gray-200 rounded">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex items-end gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-gray-400 hover:text-[#0097A9] hover:bg-gray-50 rounded-xl transition-colors"
              title="Attach a document"
            >
              <Upload className="w-5 h-5" />
            </button>

            <div className="flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Ask me anything about nonprofit leadership..."
                rows={1}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0097A9] focus:border-transparent resize-none"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || (!input.trim() && !uploadedFile)}
              className={`p-3 rounded-xl transition-all ${
                isLoading || (!input.trim() && !uploadedFile)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#0097A9] text-white hover:bg-[#007a8a]'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          
          <p className="text-xs text-gray-400 text-center mt-3">
            Powered by Dr. Lyn Corbett's nonprofit expertise • Responses are AI-generated guidance
          </p>
        </div>
      </div>
    </div>
  );
};

export default AskTheProfessor;
