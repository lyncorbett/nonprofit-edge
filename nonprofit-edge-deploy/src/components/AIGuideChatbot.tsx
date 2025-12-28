import { useState, useEffect, useRef } from 'react'

// ============================================
// AI GUIDE CHATBOT - Dashboard Version
// Engaging but not annoying
// Brand Colors: Navy #1a365d | Teal #00a0b0
// ============================================

const NAVY = '#1a365d'
const TEAL = '#00a0b0'

interface ChatMessage {
  role: 'assistant' | 'user'
  content: string
  quickActions?: { label: string; action: string }[]
}

interface AIGuideChatbotProps {
  user: {
    id: string
    full_name: string
    email: string
  }
  organization?: {
    name: string
    tier: string
  }
  incompleteTools?: string[]
  onNavigate: (page: string) => void
}

const AIGuideChatbot: React.FC<AIGuideChatbotProps> = ({
  user,
  organization,
  incompleteTools = [],
  onNavigate,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [showNotification, setShowNotification] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const firstName = user?.full_name?.split(' ')[0] || 'there'

  // Generate welcome message based on context
  const getWelcomeMessage = (): ChatMessage => {
    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
    
    // If they have incomplete tools, gently remind
    if (incompleteTools.length > 0) {
      return {
        role: 'assistant',
        content: `${greeting}, ${firstName}! 👋 Welcome back. I noticed you started the ${incompleteTools[0]} - would you like to continue where you left off?`,
        quickActions: [
          { label: `Continue ${incompleteTools[0]}`, action: incompleteTools[0].toLowerCase().replace(/\s+/g, '-') },
          { label: 'Show me something new', action: 'suggest' }
        ]
      }
    }

    // Default welcome
    return {
      role: 'assistant',
      content: `${greeting}, ${firstName}! 👋 How can I help you today?`,
      quickActions: [
        { label: 'Browse Templates', action: 'templates' },
        { label: 'Start an Assessment', action: 'board-assessment' },
        { label: 'View Events', action: 'events' }
      ]
    }
  }

  // Initialize with welcome message when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([getWelcomeMessage()])
    }
  }, [isOpen])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle quick action clicks
  const handleQuickAction = (action: string) => {
    if (action === 'suggest') {
      setMessages(prev => [...prev, 
        { role: 'user', content: 'Show me something new' } as ChatMessage,
        { 
          role: 'assistant', 
          content: "Here are some things you might find valuable:\n\n• **Strategic Plan Check-Up** - See how your plan scores against best practices\n• **Template Vault** - 147+ ready-to-use nonprofit templates\n• **Upcoming Events** - Live webinars and Q&A sessions",
          quickActions: [
            { label: 'Strategic Check-Up', action: 'strategic-checkup' },
            { label: 'Templates', action: 'templates' },
            { label: 'Events', action: 'events' }
          ]
        } as ChatMessage
      ])
    } else {
      onNavigate(action)
      setIsOpen(false)
    }
  }

  // Get response based on user input
  const getResponse = (input: string): ChatMessage => {
    const lower = input.toLowerCase()

    // Navigation requests
    if (lower.includes('template')) {
      return {
        role: 'assistant',
        content: "I'll take you to the Template Vault - we have 147+ templates for board packets, strategic plans, policies, and more!",
        quickActions: [{ label: 'Open Templates', action: 'templates' }]
      }
    }
    if (lower.includes('board') || lower.includes('assessment')) {
      return {
        role: 'assistant',
        content: "The Board Assessment evaluates your board's effectiveness across 12 key governance dimensions. You'll get a detailed report with specific recommendations.",
        quickActions: [{ label: 'Start Board Assessment', action: 'board-assessment' }]
      }
    }
    if (lower.includes('strategic') || lower.includes('plan') || lower.includes('check')) {
      return {
        role: 'assistant',
        content: "The Strategic Plan Check-Up analyzes your plan against best practices and gives you a health score with improvement recommendations.",
        quickActions: [{ label: 'Start Check-Up', action: 'strategic-checkup' }]
      }
    }
    if (lower.includes('grant') || lower.includes('rfp') || lower.includes('proposal')) {
      return {
        role: 'assistant',
        content: "Our Grant & RFP Review tool analyzes your proposals and provides feedback to strengthen them before submission.",
        quickActions: [{ label: 'Review a Grant', action: 'grant-review' }]
      }
    }
    if (lower.includes('scenario') || lower.includes('pivot') || lower.includes('future')) {
      return {
        role: 'assistant',
        content: "The Scenario Planner helps you prepare for multiple futures using our PIVOT framework. Great for strategic thinking!",
        quickActions: [{ label: 'Start Scenario Planner', action: 'scenario-planner' }]
      }
    }
    if (lower.includes('ceo') || lower.includes('evaluation') || lower.includes('executive')) {
      return {
        role: 'assistant',
        content: "The CEO Evaluation tool provides fair, comprehensive frameworks for executive assessment.",
        quickActions: [{ label: 'Start CEO Evaluation', action: 'ceo-evaluation' }]
      }
    }
    if (lower.includes('event') || lower.includes('webinar') || lower.includes('workshop')) {
      return {
        role: 'assistant',
        content: "Check out our upcoming events - webinars, workshops, and Q&A sessions with Dr. Corbett!",
        quickActions: [{ label: 'View Events', action: 'events' }]
      }
    }
    if (lower.includes('resource') || lower.includes('library')) {
      return {
        role: 'assistant',
        content: "The Resource Library has 265+ guides, book summaries, templates, playbooks, and more!",
        quickActions: [{ label: 'Open Library', action: 'library' }]
      }
    }
    if (lower.includes('team') || lower.includes('invite') || lower.includes('member')) {
      return {
        role: 'assistant',
        content: "You can manage your team and invite new members from the Team page.",
        quickActions: [{ label: 'Manage Team', action: 'team' }]
      }
    }
    if (lower.includes('dashboard') || lower.includes('home')) {
      return {
        role: 'assistant',
        content: "I'll take you back to the Dashboard.",
        quickActions: [{ label: 'Go to Dashboard', action: 'dashboard' }]
      }
    }
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      return {
        role: 'assistant',
        content: `Hello! How can I help you today, ${firstName}?`,
        quickActions: [
          { label: 'Browse Templates', action: 'templates' },
          { label: 'View Events', action: 'events' }
        ]
      }
    }
    if (lower.includes('thank')) {
      return {
        role: 'assistant',
        content: "You're welcome! Let me know if you need anything else.",
        quickActions: []
      }
    }

    // Default helpful response
    return {
      role: 'assistant',
      content: "I can help you navigate to any of our tools or resources. Try asking about templates, assessments, events, or the resource library!",
      quickActions: [
        { label: 'Browse Tools', action: 'dashboard' },
        { label: 'View Events', action: 'events' }
      ]
    }
  }

  const handleSend = () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = { role: 'user', content: inputValue }
    const response = getResponse(inputValue)
    
    setMessages(prev => [...prev, userMessage, response])
    setInputValue('')
  }

  const handleOpen = () => {
    setIsOpen(true)
    setShowNotification(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div 
            className="px-4 py-3 flex items-center justify-between"
            style={{ backgroundColor: NAVY }}
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                style={{ backgroundColor: TEAL }}
              >
                🎓
              </div>
              <div>
                <span className="text-white font-semibold text-sm">Your Guide</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-white/60 text-xs">Online</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white text-lg"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="h-72 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx}>
                <div 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-[#00a0b0] text-white rounded-br-sm' 
                        : 'bg-white text-gray-700 shadow-sm rounded-bl-sm'
                    }`}
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    {msg.content}
                  </div>
                </div>
                
                {/* Quick Actions */}
                {msg.quickActions && msg.quickActions.length > 0 && msg.role === 'assistant' && (
                  <div className="flex flex-wrap gap-2 mt-2 ml-1">
                    {msg.quickActions.map((action, actionIdx) => (
                      <button
                        key={actionIdx}
                        onClick={() => handleQuickAction(action.action)}
                        className="text-xs px-3 py-1.5 rounded-full border border-[#00a0b0] text-[#00a0b0] hover:bg-[#00a0b0] hover:text-white transition"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#00a0b0]"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="px-3 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition"
                style={{ backgroundColor: TEAL }}
              >
                →
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Notification dot */}
          {showNotification && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-white text-xs">1</span>
            </div>
          )}
          
          <button
            onClick={handleOpen}
            className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white text-xl hover:scale-105 transition-transform"
            style={{ backgroundColor: TEAL }}
            title="Need help?"
          >
            🎓
          </button>
        </div>
      )}
    </div>
  )
}

export default AIGuideChatbot
