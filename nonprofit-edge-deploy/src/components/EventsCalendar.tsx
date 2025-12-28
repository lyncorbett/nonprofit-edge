import { useState } from 'react'

// ============================================
// EVENTS CALENDAR PAGE
// Brand Colors: Navy #1a365d | Teal #00a0b0
// ============================================

// Brand colors
const NAVY = '#1a365d';
const TEAL = '#00a0b0';
const TEAL_LIGHT = '#e6f7f9';

interface EventsCalendarProps {
  user: {
    id: string
    full_name: string
    email: string
    role: 'owner' | 'admin' | 'member'
  }
  organization: {
    id: string
    name: string
    tier: 'starter' | 'professional' | 'enterprise'
  }
  onNavigate: (page: string) => void
  onLogout: () => void
}

interface Event {
  id: string
  title: string
  description: string
  date: string
  month: string
  monthYear: string
  day: string
  time: string
  type: 'webinar' | 'workshop' | 'qa'
  typeLabel: string
  typeColor: string
  typeBg: string
  host: string
  registered: number
  isRegistered?: boolean
}

const EventsCalendar: React.FC<EventsCalendarProps> = ({
  user,
  organization,
  onNavigate,
  onLogout,
}) => {
  const initials = user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
  const [activeFilter, setActiveFilter] = useState('all')

  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Board Engagement That Actually Works',
      description: 'Learn practical strategies for transforming passive board members into engaged champions of your mission.',
      date: '2025-01-12',
      month: 'JAN',
      monthYear: 'January 2025',
      day: '12',
      time: '12:00 PM PT',
      type: 'webinar',
      typeLabel: 'WEBINAR',
      typeColor: TEAL,
      typeBg: TEAL_LIGHT,
      host: 'Dr. Lyn Corbett',
      registered: 47,
      isRegistered: true
    },
    {
      id: '2',
      title: 'Founding Members Q&A Session',
      description: 'Open discussion for founding members. Bring your questions about the platform or any organizational challenges.',
      date: '2025-01-15',
      month: 'JAN',
      monthYear: 'January 2025',
      day: '15',
      time: '10:00 AM PT',
      type: 'qa',
      typeLabel: 'Q&A SESSION',
      typeColor: '#6366f1',
      typeBg: '#eef2ff',
      host: 'Dr. Lyn Corbett',
      registered: 23
    },
    {
      id: '3',
      title: 'Strategic Planning Workshop: Setting Your 2025 Vision',
      description: 'A hands-on workshop to help you craft a compelling strategic vision for the year ahead.',
      date: '2025-01-22',
      month: 'JAN',
      monthYear: 'January 2025',
      day: '22',
      time: '1:00 PM PT',
      type: 'workshop',
      typeLabel: 'WORKSHOP',
      typeColor: '#f59e0b',
      typeBg: '#fef3c7',
      host: 'Dr. Lyn Corbett',
      registered: 31
    },
    {
      id: '4',
      title: 'CEO Evaluation Best Practices',
      description: 'Learn how to design and implement fair, effective CEO evaluation processes.',
      date: '2025-02-05',
      month: 'FEB',
      monthYear: 'February 2025',
      day: '5',
      time: '11:00 AM PT',
      type: 'webinar',
      typeLabel: 'WEBINAR',
      typeColor: TEAL,
      typeBg: TEAL_LIGHT,
      host: 'Dr. Lyn Corbett',
      registered: 19
    },
    {
      id: '5',
      title: 'Scenario Planning for Uncertain Times',
      description: 'Build resilience by learning to anticipate and prepare for multiple futures.',
      date: '2025-02-12',
      month: 'FEB',
      monthYear: 'February 2025',
      day: '12',
      time: '12:00 PM PT',
      type: 'webinar',
      typeLabel: 'WEBINAR',
      typeColor: TEAL,
      typeBg: TEAL_LIGHT,
      host: 'Dr. Lyn Corbett',
      registered: 28
    },
    {
      id: '6',
      title: 'Founding Members Q&A Session',
      description: 'Monthly open discussion for founding members. Share wins, challenges, and get personalized guidance.',
      date: '2025-02-19',
      month: 'FEB',
      monthYear: 'February 2025',
      day: '19',
      time: '10:00 AM PT',
      type: 'qa',
      typeLabel: 'Q&A SESSION',
      typeColor: '#6366f1',
      typeBg: '#eef2ff',
      host: 'Dr. Lyn Corbett',
      registered: 15
    }
  ])

  const handleRegister = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, isRegistered: !event.isRegistered, registered: event.isRegistered ? event.registered - 1 : event.registered + 1 }
        : event
    ))
  }

  const getTierName = () => {
    const tiers: Record<string, string> = {
      starter: 'Essential',
      professional: 'Professional',
      enterprise: 'Premium'
    }
    return tiers[organization.tier] || 'Professional'
  }

  // Filter events
  const filteredEvents = activeFilter === 'all' 
    ? events 
    : events.filter(e => e.type === activeFilter)

  // Group events by month
  const groupedEvents = filteredEvents.reduce((groups, event) => {
    const month = event.monthYear
    if (!groups[month]) {
      groups[month] = []
    }
    groups[month].push(event)
    return groups
  }, {} as Record<string, Event[]>)

  const filters = [
    { id: 'all', label: 'All Events' },
    { id: 'webinar', label: 'Webinars' },
    { id: 'workshop', label: 'Workshops' },
    { id: 'qa', label: 'Q&A Sessions' }
  ]

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Left Sidebar - Matching Dashboard */}
      <aside className="w-52 bg-white border-r border-gray-300 flex flex-col fixed h-screen overflow-y-auto">
        {/* Logo */}
        <div className="px-4 py-5 border-b border-gray-300">
          <div className="text-lg font-extrabold" style={{ color: NAVY }}>
            The Nonprofit Edge
          </div>
        </div>

        {/* Main Nav */}
        <div className="py-4">
          <div className="px-4 mb-2 text-xs font-extrabold uppercase tracking-wider" style={{ color: NAVY }}>
            Main
          </div>
          <nav>
            <a 
              onClick={() => onNavigate('dashboard')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Dashboard
            </a>
            <a 
              onClick={() => onNavigate('library')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Resource Library
            </a>
            <a 
              onClick={() => onNavigate('events')}
              className="block px-4 py-2 text-sm font-semibold cursor-pointer"
              style={{ color: TEAL, backgroundColor: TEAL_LIGHT }}
            >
              Events
            </a>
          </nav>
        </div>

        {/* Tools */}
        <div className="py-4 border-t border-gray-300">
          <div className="px-4 mb-2 text-xs font-extrabold uppercase tracking-wider" style={{ color: NAVY }}>
            Tools
          </div>
          <nav>
            <a 
              onClick={() => onNavigate('strategic-checkup')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer leading-tight"
            >
              Strategic Plan<br/>Check-Up
            </a>
            <a 
              onClick={() => onNavigate('board-assessment')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Board Assessment
            </a>
            <a 
              onClick={() => onNavigate('scenario-planner')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Scenario Planner
            </a>
            <a 
              onClick={() => onNavigate('grant-review')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Grant Review
            </a>
            <a 
              onClick={() => onNavigate('ceo-evaluation')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              CEO Evaluation
            </a>
          </nav>
        </div>

        {/* Resources */}
        <div className="py-4 border-t border-gray-300">
          <div className="px-4 mb-2 text-xs font-extrabold uppercase tracking-wider" style={{ color: NAVY }}>
            Resources
          </div>
          <nav>
            <a 
              onClick={() => onNavigate('templates')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Templates
            </a>
            <a 
              onClick={() => onNavigate('book-summaries')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Book Summaries
            </a>
            <a 
              onClick={() => onNavigate('certifications')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Certifications
            </a>
          </nav>
          
          {/* Ask the Professor Button */}
          <div className="px-3 pt-3">
            <a 
              onClick={() => onNavigate('professor')}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-white cursor-pointer hover:opacity-90 transition"
              style={{ background: `linear-gradient(135deg, ${NAVY}, #122443)` }}
            >
              <div 
                className="w-7 h-7 rounded-md flex items-center justify-center text-sm"
                style={{ background: TEAL }}
              >
                🎓
              </div>
              <span className="font-semibold text-sm">Ask the Professor</span>
            </a>
          </div>
        </div>

        {/* Manage Team */}
        <div className="py-3 border-t border-gray-300">
          <a 
            onClick={() => onNavigate('team')}
            className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
          >
            Manage Team
          </a>
        </div>

        {/* User Profile */}
        <div className="mt-auto px-4 py-4 border-t border-gray-300">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
              style={{ background: `linear-gradient(135deg, ${TEAL}, #008090)` }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-800 text-sm truncate">
                {user.full_name}
              </div>
              <div className="text-[10px] text-gray-400">{getTierName()}</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="mt-3 w-full text-xs text-gray-500 hover:text-gray-700 py-1"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-52">
        <div className="p-8 max-w-4xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold mb-2" style={{ color: NAVY }}>Events & Webinars</h1>
            <p className="text-gray-500">Live learning sessions, workshops, and Q&A opportunities with Dr. Lyn Corbett.</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-8">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === filter.id 
                    ? 'text-white' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
                style={activeFilter === filter.id ? { backgroundColor: TEAL } : {}}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Events Grouped by Month */}
          {Object.entries(groupedEvents).map(([month, monthEvents]) => (
            <div key={month} className="mb-10">
              {/* Month Header */}
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-lg font-bold" style={{ color: NAVY }}>{month}</h2>
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-sm text-gray-400">{monthEvents.length} event{monthEvents.length !== 1 ? 's' : ''}</span>
              </div>

              {/* Events List */}
              <div className="space-y-4">
                {monthEvents.map(event => (
                  <div
                    key={event.id}
                    className="bg-white rounded-xl border border-gray-200 p-5 transition-all hover:shadow-md hover:border-[#00a0b0]"
                  >
                    <div className="flex gap-5">
                      {/* Date Box */}
                      <div className="flex-shrink-0">
                        <div 
                          className="w-16 rounded-lg text-center py-3"
                          style={{ backgroundColor: NAVY }}
                        >
                          <div className="text-2xl font-extrabold text-white leading-none">{event.day}</div>
                          <div className="text-[10px] font-semibold text-white/70 uppercase mt-1">{event.month}</div>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 min-w-0">
                        {/* Type Badge */}
                        <span 
                          className="inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded mb-2"
                          style={{ backgroundColor: event.typeBg, color: event.typeColor }}
                        >
                          {event.typeLabel}
                        </span>

                        {/* Title */}
                        <h3 className="font-bold text-base mb-1" style={{ color: NAVY }}>
                          {event.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                          {event.description}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>{event.time}</span>
                          <span>•</span>
                          <span>{event.host}</span>
                          <span>•</span>
                          <span>{event.registered} registered</span>
                        </div>
                      </div>

                      {/* Register Button */}
                      <div className="flex-shrink-0 self-center">
                        <button
                          onClick={() => handleRegister(event.id)}
                          className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                            event.isRegistered
                              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              : 'text-white hover:opacity-90'
                          }`}
                          style={!event.isRegistered ? { backgroundColor: TEAL } : {}}
                        >
                          {event.isRegistered ? '✓ Registered' : 'Register'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Empty State */}
          {Object.keys(groupedEvents).length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No events found for this filter.</p>
            </div>
          )}

          {/* Past Events Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ color: NAVY }}>Past Events</h2>
              <a href="#" className="text-sm font-semibold hover:underline" style={{ color: TEAL }}>
                View recordings →
              </a>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-gray-500 text-sm">
                Access recordings of past webinars and workshops in the Resource Library.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventsCalendar
