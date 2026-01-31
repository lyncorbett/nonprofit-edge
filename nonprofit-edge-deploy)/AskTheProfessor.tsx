'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, User, Bot, Lightbulb, 
  BookOpen, Target, Users, DollarSign, ArrowRight
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AskTheProfessorProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  organization: {
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

const AskTheProfessor: React.FC<AskTheProfessorProps> = ({ user, organization }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulated AI response (replace with actual API call)
  const getAIResponse = async (userMessage: string): Promise<string> => {
    // In production, this would call your Claude API endpoint
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Sample responses based on keywords
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('board') && lowerMessage.includes('meeting')) {
      return `Great question about board meetings! Here are some strategies I've seen work well with hundreds of nonprofits:

**1. Start with Mission Moments**
Begin each meeting with a 5-minute story about impact. This reminds everyone why they're there and energizes the conversation.

**2. Shift from Reports to Decisions**
Instead of reading reports (send those in advance), focus board time on decisions that need their input. Frame agenda items as questions: "Should we..." rather than "Update on..."

**3. Use the Consent Agenda**
Bundle routine items (minutes approval, committee reports) into a consent agenda that's approved with one vote unless someone pulls an item for discussion.

**4. Create Discussion Frameworks**
For complex topics, give board members a framework: "We have 20 minutes to discuss this. Let's spend 5 minutes on concerns, 10 on options, and 5 on next steps."

Would you like me to dive deeper into any of these strategies?`;
    }
    
    if (lowerMessage.includes('strategic') && lowerMessage.includes('plan')) {
      return `I've seen hundreds of strategic plans succeed and fail. Here's what separates the ones that actually work:

**The One-Page Test**
If you can't summarize your strategy on one page, it's too complicated to execute. Aim for 3-5 strategic priorities, each with 2-3 measurable goals.

**The "Who Does What By When" Rule**
Every goal needs an owner and a deadline. Vague accountability is no accountability.

**Quarterly Check-Ins**
Build in structured moments to review progress. Not to punish, but to learn and adjust. I recommend our Strategic Plan Check-Up tool for this.

**The Constraint Question**
Ask: "What's the ONE thing that, if we solved it, would make everything else easier?" Focus there first. This is the Theory of Constraints in action.

**Living Document**
Your strategic plan should be referenced in every board meeting, every staff meeting. If it lives in a drawer, it's already dead.

What specific aspect of strategic planning would you like to explore further?`;
    }
    
    if (lowerMessage.includes('donor') || lowerMessage.includes('fundraising') || lowerMessage.includes('ask')) {
      return `Major donor asks are both an art and a science. Here's my framework:

**Before the Ask: The 7-Touch Rule**
Before any major ask, a donor should have had at least 7 meaningful touchpoints with your organization. These build relationship and understanding.

**The Ask Meeting Structure**
1. **Reconnect** (5 min) - Personal connection, gratitude for their past support
2. **Inspire** (10 min) - Share the vision and specific impact
3. **Invite** (5 min) - Make the specific ask
4. **Listen** (remaining time) - Their response tells you everything

**The Ask Itself**
Be specific: "Would you consider a gift of $25,000 to fund our youth leadership program?"

Then be quiet. The next person to speak usually loses negotiating power, and you want them thinking, not you filling silence.

**After a "No" or "Not Now"**
Ask: "What would need to be true for you to consider this in the future?" You'll learn invaluable information.

Want me to help you prepare for a specific donor conversation?`;
    }
    
    if (lowerMessage.includes('difficult') && lowerMessage.includes('board')) {
      return `Ah, the difficult board member challenge. I've helped many EDs navigate this sensitively. Here's my approach:

**First, Diagnose the Type**
- **The Dominator**: Takes up all airtime
- **The Skeptic**: Questions everything, slows progress  
- **The Absentee**: Rarely shows up or engages
- **The Micromanager**: Wants to run operations
- **The Negative**: Always finds problems

**The Board Chair Conversation**
This is primarily the Board Chair's responsibility. If you're the ED, have a private conversation with your Chair about the issue. Come with specific examples and suggest approaches.

**The Direct Conversation**
Sometimes people don't know how they're coming across. A caring, private conversation that says "I've noticed X, and I'm wondering if everything is okay" can work wonders.

**The Term Limit Solution**
This is why term limits exist. If someone isn't serving well, the natural end of their term provides a graceful exit.

**The Nuclear Option**
In extreme cases, boards can ask members to resign. This requires careful documentation and usually a governance committee recommendation.

Which type of challenge are you dealing with? I can give more specific advice.`;
    }
    
    // Default response
    return `That's a great question! As a nonprofit leadership advisor, I draw on 15+ years of consulting experience with 800+ organizations.

Based on what you're asking, I'd recommend we break this down:

1. **Clarify the core challenge** - What's the specific outcome you're trying to achieve?

2. **Identify constraints** - What's currently preventing progress? (Often it's not what we first think)

3. **Explore options** - What approaches have you already considered?

4. **Plan action** - What's the smallest next step that would create momentum?

I'm here to think through this with you. Could you tell me more about your specific situation? The more context you share, the more tailored my guidance can be.

Remember: You know your organization better than anyone. My role is to ask the right questions and share patterns I've seen work elsewhere.`;
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
    setInput('');
    setIsLoading(true);

    try {
      const response = await getAIResponse(userMessage.content);
      
      const assistantMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
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

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: 'calc(100vh - 73px)',
      maxWidth: '900px',
      margin: '0 auto',
      padding: '0 24px'
    }}>
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
              Hello, {user.name.split(' ')[0]}! 👋
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
                  <div style={{
                    background: message.role === 'user' ? '#f1f5f9' : 'white',
                    border: message.role === 'user' ? 'none' : '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '15px',
                    lineHeight: 1.7,
                    color: '#1e293b',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {message.content}
                  </div>
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
            onKeyPress={handleKeyPress}
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
              transition: 'all 0.2s'
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
          The Professor draws from 15+ years of nonprofit consulting experience. 
          Your conversations are private and secure.
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
