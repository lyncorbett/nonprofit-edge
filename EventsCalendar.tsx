'use client';

import React, { useState } from 'react';
import { 
  Calendar, Clock, MapPin, Users, Video, ArrowLeft,
  ChevronLeft, ChevronRight, Bell, ExternalLink
} from 'lucide-react';

interface EventsCalendarProps {
  user?: any;
  organization?: any;
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

const EventsCalendar: React.FC<EventsCalendarProps> = ({ onNavigate }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const navigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      window.location.href = `/${page}`;
    }
  };

  const events = [
    {
      id: 1,
      title: 'Founding Member Early Access',
      date: 'Feb 10, 2026',
      time: '12:00 PM EST',
      type: 'Launch',
      description: 'Be among the first to access The Nonprofit Edge platform.',
      color: '#0097A9',
      isUpcoming: true
    },
    {
      id: 2,
      title: '🚀 Platform Launch',
      date: 'Feb 24, 2026',
      time: '12:00 PM EST',
      type: 'Launch',
      description: 'Official launch of The Nonprofit Edge platform.',
      color: '#0D2C54',
      isUpcoming: true
    },
    {
      id: 3,
      title: 'Live Q&A: Board Governance',
      date: 'Mar 5, 2026',
      time: '2:00 PM EST',
      type: 'Webinar',
      description: 'Ask your board governance questions live with Dr. Lyn.',
      color: '#6366f1',
      isUpcoming: true
    },
    {
      id: 4,
      title: 'Strategic Planning Workshop',
      date: 'Mar 15, 2026',
      time: '10:00 AM EST',
      type: 'Workshop',
      description: 'Hands-on workshop for creating your strategic plan.',
      color: '#ec4899',
      isUpcoming: true
    },
    {
      id: 5,
      title: 'Monthly Member Roundtable',
      date: 'Mar 20, 2026',
      time: '1:00 PM EST',
      type: 'Community',
      description: 'Connect with fellow nonprofit leaders.',
      color: '#f59e0b',
      isUpcoming: true
    },
  ];

  const upcomingEvents = events.filter(e => e.isUpcoming).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('dashboard')}
              className="hover:opacity-80 transition-opacity"
            >
              <svg width="160" height="45" viewBox="0 0 500 140" fill="none"><g transform="translate(0, 10)"><path d="M60 10 A50 50 0 1 1 20 70" stroke="#0D2C54" strokeWidth="8" fill="none" strokeLinecap="round"/><path d="M15 45 L45 70 L75 35" stroke="#0097A9" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M45 70 L45 25" stroke="#0097A9" strokeWidth="8" fill="none" strokeLinecap="round"/></g><text x="115" y="42" fontFamily="system-ui" fontSize="28" fontWeight="700" fill="#0D2C54">THE</text><text x="115" y="78" fontFamily="system-ui" fontSize="32" fontWeight="800" fill="#0097A9">NONPROFIT</text><text x="115" y="115" fontFamily="system-ui" fontSize="32" fontWeight="800" fill="#0D2C54">EDGE</text></svg>
            </button>
            <span className="text-slate-300">|</span>
            <div>
              <h1 className="text-lg font-bold text-[#0D2C54]">Events & Webinars</h1>
              <p className="text-sm text-slate-500">Live sessions, workshops, and community events</p>
            </div>
          </div>
          <button
            onClick={() => navigate('dashboard')}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-[#0097A9] font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Featured Event */}
        <div className="bg-gradient-to-r from-[#0D2C54] to-[#1a3a5c] rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-[#0097A9] rounded-full text-xs font-semibold">FEATURED</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">🚀 Platform Launch - February 24, 2026</h2>
          <p className="text-white/70 mb-6 max-w-2xl">
            Join us for the official launch of The Nonprofit Edge. Be the first to experience AI-powered 
            nonprofit leadership tools, templates, and resources.
          </p>
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#0097A9]" />
              <span>February 24, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#0097A9]" />
              <span>12:00 PM EST</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-[#0097A9]" />
              <span>Virtual Event</span>
            </div>
          </div>
          <button className="px-6 py-3 bg-[#0097A9] hover:bg-[#007f8f] rounded-lg font-semibold transition-colors">
            Add to Calendar
          </button>
        </div>

        {/* Upcoming Events */}
        <h2 className="text-lg font-bold text-[#0D2C54] mb-4">Upcoming Events</h2>
        <div className="grid grid-cols-1 gap-4 mb-8">
          {events.map((event) => (
            <div 
              key={event.id}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#0097A9] hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0"
                    style={{ backgroundColor: event.color }}
                  >
                    <span className="text-lg font-bold">{event.date.split(' ')[1].replace(',', '')}</span>
                    <span className="text-[10px] uppercase">{event.date.split(' ')[0]}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        className="text-xs font-semibold px-2 py-0.5 rounded"
                        style={{ backgroundColor: `${event.color}15`, color: event.color }}
                      >
                        {event.type}
                      </span>
                    </div>
                    <h3 className="font-semibold text-[#0D2C54] mb-1">{event.title}</h3>
                    <p className="text-sm text-slate-500 mb-2">{event.description}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        Virtual
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-[#0097A9] hover:bg-[#0097A9]/10 rounded-lg transition-colors">
                    <Bell className="w-5 h-5" />
                  </button>
                  <button className="px-4 py-2 bg-[#0097A9] text-white rounded-lg text-sm font-medium hover:bg-[#007f8f] transition-colors">
                    Register
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Past Events */}
        <h2 className="text-lg font-bold text-[#0D2C54] mb-4">Past Events & Recordings</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
          <Video className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-[#0D2C54] mb-2">No recordings yet</h3>
          <p className="text-slate-500">Past event recordings will appear here after the platform launches.</p>
        </div>
      </div>
    </div>
  );
};

export default EventsCalendar;
