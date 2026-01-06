/**
 * THE NONPROFIT EDGE - Member Dashboard
 * 
 * Features:
 * - Welcome Assistant (subtle, dismissible help message)
 * - Tour Banner for new users
 * - Tool cards with n8n webhook integration
 * - Events panel
 * - Activity tracking
 * 
 * Brand Colors: Navy #0D2C54 | Teal #0097A9
 */

import React, { useState, useEffect } from 'react'

const NAVY = '#0D2C54'
const TEAL = '#0097A9'

interface DashboardProps {
  user?: any
  organization?: any
  supabase?: any
  onNavigate?: (page: string) => void
  onLogout?: () => void
}

// Tool definitions with n8n webhook URLs
const TOOLS = [
  {
    id: 'strategic-plan',
    title: 'Strategic Plan Check-Up',
    description: 'Diagnose your current plan with scores & specific fixes.',
    icon: '📋',
    color: '#0097A9',
    webhook: 'https://thenonprofitedge.app.n8n.cloud/webhook/strategic-plan-checkup',
  },
  {
    id: 'board-assessment',
    title: 'Board Assessment',
    description: 'Strengthen governance with measurable board practices.',
    icon: '👥',
    color: '#0D2C54',
    webhook: 'https://thenonprofitedge.app.n8n.cloud/webhook/board-assessment',
  },
  {
    id: 'grant-review',
    title: 'Grant Review',
    description: 'Win more grants with expert scoring and polish.',
    icon: '💰',
    color: '#10B981',
    webhook: 'https://thenonprofitedge.app.n8n.cloud/webhook/grant-review',
  },
  {
    id: 'scenario-planner',
    title: 'Scenario Planner',
    description: 'Stress-test strategy with "what-if" scenarios.',
    icon: '🎯',
    color: '#8B5CF6',
    webhook: 'https://thenonprofitedge.app.n8n.cloud/webhook/scenario-planner',
  },
  {
    id: 'ceo-evaluation',
    title: 'CEO Evaluation',
    description: 'Build stronger leadership with fair reviews.',
    icon: '⭐',
    color: '#F59E0B',
    webhook: 'https://thenonprofitedge.app.n8n.cloud/webhook/ceo-evaluation',
  },
  {
    id: 'ask-professor',
    title: 'Ask the Professor',
    description: 'Get expert advice from Dr. Lyn Corbett 24/7.',
    icon: '🎓',
    color: '#0D2C54',
    webhook: 'https://thenonprofitedge.app.n8n.cloud/webhook/ask-the-professor',
  },
]

const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  organization, 
  supabase,
  onNavigate,
  onLogout 
}) => {
  const [showTourBanner, setShowTourBanner] = useState(false)
  const [showWelcomeAssistant, setShowWelcomeAssistant] = useState(true)
  const [events, setEvents] = useState<any[]>([])
  const [usageStats, setUsageStats] = useState({
    downloadsUsed: 0,
    downloadsLimit: 10,
    professorSessions: 0,
    professorLimit: 100,
  })
  const [dailyQuote, setDailyQuote] = useState({
    quote: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb"
  })

  // Check if user is new (show tour banner)
  useEffect(() => {
    const checkNewUser = async () => {
      if (!supabase || !user?.id) return
      
      try {
        const { data } = await supabase
          .from('user_preferences')
          .select('has_seen_tour')
          .eq('user_id', user.id)
          .single()
        
        if (!data || !data.has_seen_tour) {
          setShowTourBanner(true)
        }
      } catch (err) {
        // New user, show tour
        setShowTourBanner(true)
      }
    }
    
    checkNewUser()
  }, [supabase, user])

  // Check if returning user (show welcome assistant)
  useEffect(() => {
    const assistantDismissed = localStorage.getItem('welcomeAssistantDismissed')
    const lastDismissed = assistantDismissed ? new Date(assistantDismissed) : null
    const now = new Date()
    
    // Show assistant if never dismissed or dismissed more than 24 hours ago
    if (!lastDismissed || (now.getTime() - lastDismissed.getTime()) > 24 * 60 * 60 * 1000) {
      setShowWelcomeAssistant(true)
    } else {
      setShowWelcomeAssistant(false)
    }
  }, [])

  // Load events
  useEffect(() => {
    const loadEvents = async () => {
      if (!supabase) {
        // Sample events
        setEvents([
          { id: 1, title: 'Board Governance Webinar', event_date: '2026-01-15', event_time: '2:00 PM EST', tag: 'WEBINAR', registration_url: '#' },
          { id: 2, title: 'Strategic Planning Workshop', event_date: '2026-01-22', event_time: '10:00 AM EST', tag: 'WORKSHOP', registration_url: '#' },
        ])
        return
      }
      
      try {
        const today = new Date().toISOString().split('T')[0]
        const { data } = await supabase
          .from('events')
          .select('*')
          .eq('is_active', true)
          .gte('event_date', today)
          .order('event_date', { ascending: true })
          .limit(3)
        
        if (data) setEvents(data)
      } catch (err) {
        console.error('Error loading events:', err)
      }
    }
    
    loadEvents()
  }, [supabase])

  // Load usage stats
  useEffect(() => {
    const loadUsage = async () => {
      if (!supabase || !organization?.id) return
      
      try {
        const { data } = await supabase
          .from('monthly_usage')
          .select('*')
          .eq('organization_id', organization.id)
          .single()
        
        if (data) {
          setUsageStats({
            downloadsUsed: data.report_downloads || 0,
            downloadsLimit: organization.monthly_downloads_limit || 10,
            professorSessions: data.professor_sessions || 0,
            professorLimit: organization.monthly_professor_limit || 100,
          })
        }
      } catch (err) {
        console.error('Error loading usage:', err)
      }
    }
    
    loadUsage()
  }, [supabase, organization])

  // Load daily quote
  useEffect(() => {
    const loadQuote = async () => {
      if (!supabase) return
      
      try {
        const { data } = await supabase
          .from('daily_quotes')
          .select('*')
          .eq('is_active', true)
          .limit(1)
          .single()
        
        if (data) {
          setDailyQuote({ quote: data.quote, author: data.author })
        }
      } catch (err) {
        console.error('Error loading quote:', err)
      }
    }
    
    loadQuote()
  }, [supabase])

  // Dismiss tour banner
  const dismissTourBanner = async () => {
    setShowTourBanner(false)
    
    if (supabase && user?.id) {
      try {
        await supabase
          .from('user_preferences')
          .upsert({ user_id: user.id, has_seen_tour: true })
      } catch (err) {
        console.error('Error saving preference:', err)
      }
    }
  }

  // Dismiss welcome assistant
  const dismissWelcomeAssistant = () => {
    setShowWelcomeAssistant(false)
    localStorage.setItem('welcomeAssistantDismissed', new Date().toISOString())
  }

  // Open tool webhook
  const openTool = (tool: typeof TOOLS[0]) => {
    window.open(tool.webhook, '_blank')
  }

  // Navigate helper
  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page)
    } else {
      window.location.href = `/${page}`
    }
  }

  // Format date for events
  const formatEventDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: date.getDate().toString(),
    }
  }

  const userName = user?.full_name?.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/logo.svg" 
                alt="The Nonprofit Edge" 
                style={{ height: '45px', width: 'auto' }}
                onError={(e) => {
                  const img = e.target as HTMLImageElement
                  if (img.src.includes('.svg')) {
                    img.src = '/logo.png'
                  } else if (img.src.includes('.png')) {
                    img.src = '/logo.jpg'
                  }
                }}
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleNavigate('templates')}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Templates
              </button>
              <button
                onClick={() => handleNavigate('resources')}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Resources
              </button>
              <button
                onClick={() => handleNavigate('events')}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Events
              </button>
              <div className="h-5 w-px bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: `linear-gradient(135deg, ${TEAL}, ${NAVY})` }}
                >
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700">{userName}</span>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="text-gray-400 hover:text-gray-600 text-sm"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tour Banner for New Users */}
        {showTourBanner && (
          <div 
            className="mb-6 rounded-xl p-5 text-white relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${NAVY}, ${TEAL})` }}
          >
            <button 
              onClick={dismissTourBanner}
              className="absolute top-3 right-3 text-white/70 hover:text-white text-xl"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2">🎉 Welcome to The Nonprofit Edge!</h2>
            <p className="text-white/90 mb-4">
              You now have access to AI-powered tools trusted by 800+ nonprofit leaders. Here's how to get started:
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => openTool(TOOLS.find(t => t.id === 'ask-professor')!)}
                className="px-4 py-2 bg-white text-[#0D2C54] rounded-lg font-semibold text-sm hover:bg-gray-100 transition"
              >
                Try Ask the Professor →
              </button>
              <button
                onClick={() => handleNavigate('templates')}
                className="px-4 py-2 bg-white/20 text-white rounded-lg font-semibold text-sm hover:bg-white/30 transition"
              >
                Browse Templates
              </button>
              <button
                onClick={dismissTourBanner}
                className="px-4 py-2 text-white/70 hover:text-white text-sm"
              >
                I'll explore on my own
              </button>
            </div>
          </div>
        )}

        {/* Welcome Back Assistant - Subtle, bottom right */}
        {showWelcomeAssistant && !showTourBanner && (
          <div 
            className="fixed bottom-6 right-6 bg-white rounded-xl shadow-lg border border-gray-200 p-4 max-w-sm z-50"
            style={{ animation: 'slideUp 0.3s ease-out' }}
          >
            <button 
              onClick={dismissWelcomeAssistant}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-lg leading-none"
            >
              ×
            </button>
            <p className="text-sm text-gray-700 pr-4">
              <span className="font-semibold" style={{ color: NAVY }}>Welcome back, {userName}!</span>
              {' '}Need help finding something? Try the{' '}
              <button 
                onClick={() => handleNavigate('templates')}
                className="font-medium underline hover:no-underline"
                style={{ color: TEAL }}
              >
                Template Vault
              </button>
              {' '}or{' '}
              <button 
                onClick={() => handleNavigate('resources')}
                className="font-medium underline hover:no-underline"
                style={{ color: TEAL }}
              >
                Resource Library
              </button>.
            </p>
          </div>
        )}

        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold" style={{ color: NAVY }}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {userName}!
          </h1>
          <p className="text-gray-600">Here's what's happening with your organization.</p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Tools */}
          <div className="lg:col-span-2 space-y-6">
            {/* Your Tools */}
            <div>
              <h2 className="text-lg font-bold mb-4" style={{ color: NAVY }}>Your Tools</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {TOOLS.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => openTool(tool)}
                    className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:shadow-lg hover:border-gray-300 transition-all group"
                  >
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-3"
                      style={{ backgroundColor: `${tool.color}15` }}
                    >
                      {tool.icon}
                    </div>
                    <h3 className="font-bold text-sm mb-1" style={{ color: NAVY }}>{tool.title}</h3>
                    <p className="text-xs text-gray-500 mb-2">{tool.description}</p>
                    <span 
                      className="text-xs font-semibold group-hover:underline"
                      style={{ color: TEAL }}
                    >
                      Launch →
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold" style={{ color: NAVY }}>Upcoming Events</h2>
                <button 
                  onClick={() => handleNavigate('events')}
                  className="text-sm font-medium hover:underline"
                  style={{ color: TEAL }}
                >
                  View all →
                </button>
              </div>
              
              {events.length > 0 ? (
                <div className="space-y-3">
                  {events.map((event) => {
                    const { month, day } = formatEventDate(event.event_date)
                    return (
                      <div 
                        key={event.id}
                        className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4"
                      >
                        <div 
                          className="w-14 h-14 rounded-lg flex flex-col items-center justify-center text-white"
                          style={{ backgroundColor: NAVY }}
                        >
                          <span className="text-[10px] font-bold">{month}</span>
                          <span className="text-lg font-bold leading-none">{day}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm" style={{ color: NAVY }}>{event.title}</h3>
                          <p className="text-xs text-gray-500">{event.event_time}</p>
                        </div>
                        <span 
                          className="px-2 py-1 rounded text-xs font-semibold"
                          style={{ 
                            backgroundColor: event.tag === 'WEBINAR' ? '#e6fffa' : event.tag === 'WORKSHOP' ? '#dbeafe' : '#fef3c7',
                            color: event.tag === 'WEBINAR' ? '#0d9488' : event.tag === 'WORKSHOP' ? '#1d4ed8' : '#d97706'
                          }}
                        >
                          {event.tag}
                        </span>
                        <a
                          href={event.registration_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg"
                          style={{ backgroundColor: TEAL, color: 'white' }}
                        >
                          Register
                        </a>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500">
                  No upcoming events scheduled.
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Stats & Quote */}
          <div className="space-y-6">
            {/* Usage Stats */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-sm mb-4" style={{ color: NAVY }}>This Month's Usage</h3>
              
              {/* Downloads */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Report Downloads</span>
                  <span className="font-semibold">{usageStats.downloadsUsed}/{usageStats.downloadsLimit}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${Math.min((usageStats.downloadsUsed / usageStats.downloadsLimit) * 100, 100)}%`,
                      backgroundColor: TEAL 
                    }}
                  />
                </div>
              </div>

              {/* Professor Sessions */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Ask the Professor</span>
                  <span className="font-semibold">{usageStats.professorSessions}/{usageStats.professorLimit}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${Math.min((usageStats.professorSessions / usageStats.professorLimit) * 100, 100)}%`,
                      backgroundColor: NAVY 
                    }}
                  />
                </div>
              </div>

              {organization?.tier && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Current Plan</span>
                    <span 
                      className="px-2 py-1 rounded text-xs font-bold uppercase"
                      style={{ backgroundColor: `${TEAL}20`, color: TEAL }}
                    >
                      {organization.tier}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Daily Quote */}
            <div 
              className="rounded-xl p-5 text-white"
              style={{ background: `linear-gradient(135deg, ${NAVY}, #1a4a7a)` }}
            >
              <div className="text-2xl mb-3">💡</div>
              <p className="text-sm italic mb-3 leading-relaxed">"{dailyQuote.quote}"</p>
              <p className="text-xs text-white/70">— {dailyQuote.author}</p>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-sm mb-3" style={{ color: NAVY }}>Quick Links</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleNavigate('templates')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition flex items-center gap-2"
                >
                  📁 Template Vault
                </button>
                <button
                  onClick={() => handleNavigate('resources')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition flex items-center gap-2"
                >
                  📚 Resource Library
                </button>
                <button
                  onClick={() => handleNavigate('book-summaries')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition flex items-center gap-2"
                >
                  📖 Book Summaries
                </button>
                <button
                  onClick={() => handleNavigate('certifications')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition flex items-center gap-2"
                >
                  🏆 Certifications
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default Dashboard
