/**
 * THE NONPROFIT EDGE - Events Calendar Page
 * Shows upcoming webinars, Q&A sessions, and member events
 */

import React, { useState } from 'react';

// Brand colors
const NAVY = '#1a365d';
const TEAL = '#00a0b0';
const TEAL_LIGHT = '#e6f7f9';

interface EventsCalendarProps {
  user: any;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  day: number;
  month: string;
  time: string;
  type: 'webinar' | 'qa' | 'workshop' | 'office-hours';
  image: string;
  host: string;
  registeredCount?: number;
  isRegistered?: boolean;
  isFeatured?: boolean;
}

const EventsCalendar: React.FC<EventsCalendarProps> = ({
  user,
  onNavigate,
  onLogout
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Sample events data
  const events: Event[] = [
    {
      id: '1',
      title: 'Board Engagement That Actually Works',
      description: 'Learn practical strategies for transforming passive board members into engaged champions of your mission. We\'ll cover meeting design, communication cadence, and accountability structures.',
      date: '2025-01-12',
      day: 12,
      month: 'JAN',
      time: '12:00 PM PT',
      type: 'webinar',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
      host: 'Dr. Lyn Corbett',
      registeredCount: 47,
      isRegistered: true,
      isFeatured: true
    },
    {
      id: '2',
      title: 'Founding Members Q&A Session',
      description: 'Open discussion for founding members. Bring your questions about the platform, strategic planning, or any organizational challenges you\'re facing.',
      date: '2025-01-15',
      day: 15,
      month: 'JAN',
      time: '10:00 AM PT',
      type: 'qa',
      image: 'https://images.unsplash.com/photo-1531498860502-7c67cf02f657?w=600&h=400&fit=crop',
      host: 'Dr. Lyn Corbett',
      registeredCount: 23,
      isRegistered: false
    },
    {
      id: '3',
      title: 'Strategic Planning Workshop: Setting Your 2025 Vision',
      description: 'A hands-on workshop to help you craft a compelling strategic vision for the year ahead. We\'ll use the ONE Thing framework to identify your primary constraint.',
      date: '2025-01-22',
      day: 22,
      month: 'JAN',
      time: '1:00 PM PT',
      type: 'workshop',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
      host: 'Dr. Lyn Corbett',
      registeredCount: 31,
      isRegistered: false,
      isFeatured: true
    },
    {
      id: '4',
      title: 'Office Hours: Grant Writing & RFP Strategy',
      description: 'Drop in for personalized feedback on your grant proposals or RFP responses. First come, first served for individual review.',
      date: '2025-01-28',
      day: 28,
      month: 'JAN',
      time: '2:00 PM PT',
      type: 'office-hours',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=400&fit=crop',
      host: 'Dr. Lyn Corbett',
      registeredCount: 12,
      isRegistered: false
    },
    {
      id: '5',
      title: 'CEO Evaluation Best Practices',
      description: 'Learn how to design and implement a fair, effective CEO evaluation process that strengthens both leadership and governance.',
      date: '2025-02-05',
      day: 5,
      month: 'FEB',
      time: '11:00 AM PT',
      type: 'webinar',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=400&fit=crop',
      host: 'Dr. Lyn Corbett',
      registeredCount: 19,
      isRegistered: false
    },
    {
      id: '6',
      title: 'Scenario Planning for Uncertain Times',
      description: 'Master the art of scenario planning to prepare your organization for multiple futures. We\'ll walk through the PIVOT framework live.',
      date: '2025-02-12',
      day: 12,
      month: 'FEB',
      time: '12:00 PM PT',
      type: 'webinar',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      host: 'Dr. Lyn Corbett',
      registeredCount: 28,
      isRegistered: false
    }
  ];

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(e => e.type === filter);

  const getTypeLabel = (type: string) => {
    const labels: Record<string, { text: string; bg: string; color: string }> = {
      'webinar': { text: 'WEBINAR', bg: TEAL_LIGHT, color: TEAL },
      'qa': { text: 'Q&A SESSION', bg: '#dbeafe', color: '#1d4ed8' },
      'workshop': { text: 'WORKSHOP', bg: '#fef3c7', color: '#d97706' },
      'office-hours': { text: 'OFFICE HOURS', bg: '#f3e8ff', color: '#7c3aed' }
    };
    return labels[type] || labels.webinar;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar - Same as Dashboard */}
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
            <a onClick={() => onNavigate('strategic-checkup')} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer leading-tight">
              Strategic Plan<br/>Check-Up
            </a>
            <a onClick={() => onNavigate('board-assessment')} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
              Board Assessment
            </a>
            <a onClick={() => onNavigate('scenario-planner')} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
              Scenario Planner
            </a>
            <a onClick={() => onNavigate('grant-review')} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
              Grant Review
            </a>
            <a onClick={() => onNavigate('ceo-evaluation')} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
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
            <a onClick={() => onNavigate('templates')} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
              Templates
            </a>
            <a onClick={() => onNavigate('book-summaries')} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
              Book Summaries
            </a>
            <a onClick={() => onNavigate('certifications')} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
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
              <div className="w-7 h-7 rounded-md flex items-center justify-center text-sm" style={{ background: TEAL }}>
                🎓
              </div>
              <span className="font-semibold text-sm">Ask the Professor</span>
            </a>
          </div>
        </div>

        {/* User Profile */}
        <div className="mt-auto px-4 py-4 border-t border-gray-300">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
              style={{ background: `linear-gradient(135deg, ${TEAL}, #008090)` }}
            >
              {user?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-800 text-sm truncate">
                {user?.full_name || user?.email || 'User'}
              </div>
              <div className="text-[10px] text-gray-400">Professional</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-52">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold" style={{ color: NAVY }}>
              Events & Webinars
            </h1>
            <p className="text-gray-600 mt-1">
              Live sessions, workshops, and Q&A with Dr. Lyn Corbett
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'All Events' },
                { value: 'webinar', label: 'Webinars' },
                { value: 'workshop', label: 'Workshops' },
                { value: 'qa', label: 'Q&A Sessions' },
                { value: 'office-hours', label: 'Office Hours' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filter === option.value
                      ? 'text-white'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                  style={filter === option.value ? { background: NAVY } : {}}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Event */}
          {filteredEvents.find(e => e.isFeatured) && (
            <div className="mb-8">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: NAVY }}>
                Featured Event
              </h2>
              {filteredEvents.filter(e => e.isFeatured).slice(0, 1).map((event) => {
                const typeLabel = getTypeLabel(event.type);
                return (
                  <div 
                    key={event.id}
                    className="bg-white rounded-2xl border border-gray-300 overflow-hidden hover:shadow-lg transition cursor-pointer"
                  >
                    <div className="flex">
                      <div className="w-96 h-64 flex-shrink-0">
                        <img 
                          src={event.image} 
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex items-start gap-4">
                          <div 
                            className="w-16 flex-shrink-0 rounded-lg text-center py-2"
                            style={{ background: NAVY }}
                          >
                            <div className="text-2xl font-extrabold text-white leading-none">{event.day}</div>
                            <div className="text-[10px] font-semibold text-white/70 uppercase">{event.month}</div>
                          </div>
                          <div className="flex-1">
                            <span 
                              className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded mb-2"
                              style={{ background: typeLabel.bg, color: typeLabel.color }}
                            >
                              {typeLabel.text}
                            </span>
                            <h3 className="text-xl font-bold mb-2" style={{ color: NAVY }}>
                              {event.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {event.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                              <span>🕐 {event.time}</span>
                              <span>👤 {event.host}</span>
                              <span>👥 {event.registeredCount} registered</span>
                            </div>
                            <button
                              className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition ${
                                event.isRegistered
                                  ? 'bg-green-100 text-green-700'
                                  : 'text-white hover:opacity-90'
                              }`}
                              style={!event.isRegistered ? { background: TEAL } : {}}
                            >
                              {event.isRegistered ? '✓ Registered' : 'Register Now'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Upcoming Events Grid */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: NAVY }}>
              Upcoming Events
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {filteredEvents.filter(e => !e.isFeatured || filteredEvents.filter(x => x.isFeatured).length > 1).map((event) => {
                const typeLabel = getTypeLabel(event.type);
                return (
                  <div 
                    key={event.id}
                    className="bg-white rounded-2xl border border-gray-300 overflow-hidden hover:shadow-lg transition cursor-pointer"
                  >
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-14 flex-shrink-0 rounded-lg text-center py-2"
                          style={{ background: NAVY }}
                        >
                          <div className="text-xl font-extrabold text-white leading-none">{event.day}</div>
                          <div className="text-[10px] font-semibold text-white/70 uppercase">{event.month}</div>
                        </div>
                        <div className="flex-1">
                          <span 
                            className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded mb-1"
                            style={{ background: typeLabel.bg, color: typeLabel.color }}
                          >
                            {typeLabel.text}
                          </span>
                          <h3 className="text-base font-bold mb-1" style={{ color: NAVY }}>
                            {event.title}
                          </h3>
                          <div className="text-xs text-gray-500 mb-3">
                            {event.time} · {event.registeredCount} registered
                          </div>
                          <button
                            className={`w-full py-2 rounded-lg font-semibold text-sm transition ${
                              event.isRegistered
                                ? 'bg-green-100 text-green-700'
                                : 'text-white hover:opacity-90'
                            }`}
                            style={!event.isRegistered ? { background: TEAL } : {}}
                          >
                            {event.isRegistered ? '✓ Registered' : 'Register'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Past Events Link */}
          <div className="mt-8 text-center">
            <a 
              className="text-sm font-semibold cursor-pointer hover:underline"
              style={{ color: TEAL }}
            >
              View Past Event Recordings →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsCalendar;
