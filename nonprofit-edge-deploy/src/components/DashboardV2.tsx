import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  FolderOpen, User, Target, Calendar, Users, Clock, 
  ChevronRight, Settings, MessageCircle, Lightbulb,
  ArrowRight, RefreshCw
} from 'lucide-react';

// Logo component - DOUBLED SIZE (320px width)
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

// Challenges by focus area
const challengesByFocus: Record<string, string[]> = {
  'Board Engagement': [
    "Reach out to one board member this week — coffee, not agenda. Just ask: \"What made you say yes to joining us?\"",
    "Text your board chair just to say thanks. No ask attached.",
    "Ask a board member: \"What's the one thing we could do better?\"",
    "Invite a board member to see your program in action this month.",
    "Send a 2-minute voice memo update to your board instead of an email.",
  ],
  'Staff Leadership': [
    "Recognize one staff member today — in the way that matters to THEM. Not everyone wants public praise.",
    "Take 10 minutes to walk around. No laptop. Just listen.",
    "Send a handwritten note to someone who's been grinding quietly.",
    "Ask a team member: \"What's getting in your way that I could help remove?\"",
    "Have lunch with someone you don't usually talk to.",
  ],
  'Fundraising': [
    "Call one donor today just to say thank you. No ask. No agenda. Just gratitude.",
    "Review your top 10 donors. When did you last talk to them personally?",
    "Write a thank you note by hand to a donor who gave this month.",
    "Share one impact story with a donor — no ask, just connection.",
    "Text a board member asking who they could introduce you to.",
  ],
  'Strategic Planning': [
    "Can you name your top 3 strategic priorities without looking? If not, neither can your team.",
    "Ask a frontline staff member: \"What's the one thing getting in your way?\"",
    "Open your strategic plan. When did you last look at it?",
    "Share one strategic win with your team this week.",
    "Block 30 minutes to think about what's NOT working.",
  ],
  'Self-Care': [
    "Block 30 minutes on your calendar this week that's just for you. Protect it like a board meeting.",
    "Leave on time today. The work will still be there tomorrow.",
    "Take a real lunch break — away from your desk.",
    "Say no to one thing today that doesn't align with your priorities.",
    "Call someone who energizes you. Not about work.",
  ],
};

// Quotes library
const quotes = [
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Culture eats strategy for breakfast.", author: "Peter Drucker" },
  { text: "People don't care how much you know until they know how much you care.", author: "Theodore Roosevelt" },
  { text: "Give me six hours to chop down a tree and I will spend the first four sharpening the axe.", author: "Abraham Lincoln" },
  { text: "The main thing is to keep the main thing the main thing.", author: "Stephen Covey" },
  { text: "If you want to go fast, go alone. If you want to go far, go together.", author: "African Proverb" },
  { text: "What got you here won't get you there.", author: "Marshall Goldsmith" },
  { text: "However beautiful the strategy, you should occasionally look at the results.", author: "Winston Churchill" },
  { text: "You can't read the label from inside the jar.", author: "Unknown" },
  { text: "Leadership is not about being in charge. It's about taking care of those in your charge.", author: "Simon Sinek" },
];

// Focus tag colors
const focusTagStyles: Record<string, { background: string; color: string }> = {
  'Board Engagement': { background: '#0D2C54', color: 'white' },
  'Staff Leadership': { background: '#6366f1', color: 'white' },
  'Fundraising': { background: '#f59e0b', color: 'white' },
  'Strategic Planning': { background: '#10b981', color: 'white' },
  'Self-Care': { background: '#ec4899', color: 'white' },
};

// Tool images
const toolImages = {
  boardAssessment: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
  strategicPlan: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
  grantReview: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
  ceoEvaluation: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop',
  scenarioPlanner: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop',
  dashboards: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&h=300&fit=crop',
};

const DashboardV2: React.FC = () => {
  const [userName, setUserName] = useState('there');
  const [focusArea, setFocusArea] = useState('Board Engagement');
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [isCommitted, setIsCommitted] = useState(false);
  const [dailyQuote, setDailyQuote] = useState(quotes[0]);

  // Fetch user info on mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, first_name, focus_area')
          .eq('id', user.id)
          .single();
        if (profile) {
          setUserName(profile.full_name || profile.first_name || 'there');
          if (profile.focus_area) {
            setFocusArea(profile.focus_area);
          }
        }
      }
    };
    fetchUser();

    // Set daily quote based on date
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    setDailyQuote(quotes[dayOfYear % quotes.length]);
  }, []);

  const tools = [
    { name: 'Board Assessment', image: toolImages.boardAssessment, route: '/tools/board-assessment' },
    { name: 'Strategic Plan Check-Up', image: toolImages.strategicPlan, route: '/tools/strategic-plan' },
    { name: 'Grant Review', image: toolImages.grantReview, route: '/tools/grant-review' },
    { name: 'CEO Evaluation', image: toolImages.ceoEvaluation, route: '/tools/ceo-evaluation' },
    { name: 'Scenario Planner', image: toolImages.scenarioPlanner, route: '/tools/scenario-planner' },
    { name: 'Dashboards', image: toolImages.dashboards, route: '/tools/dashboards' },
  ];

  const challenges = challengesByFocus[focusArea] || challengesByFocus['Board Engagement'];
  const tagStyle = focusTagStyles[focusArea] || focusTagStyles['Board Engagement'];
  const shortFocus = focusArea.split(' ')[0]; // "Board", "Staff", etc.

  const handleRefreshChallenge = () => {
    setCurrentChallenge((prev) => (prev + 1) % challenges.length);
    setIsCommitted(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  // Get time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
      display: 'flex',
    }}>
      {/* Left Sidebar */}
      <aside style={{
        width: '280px',
        background: 'white',
        borderRight: '1px solid #e2e8f0',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        overflowY: 'auto'
      }}>
        {/* Logo - DOUBLED */}
        <div style={{ marginBottom: '32px' }}>
          <Logo width={220} />
        </div>

        {/* Quick Actions */}
        <nav style={{ marginBottom: '24px' }}>
          <div style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '1.2px',
            color: '#94a3b8',
            marginBottom: '12px',
            fontWeight: 600
          }}>
            Quick Actions
          </div>
          <NavLink href="/member-resources" icon={FolderOpen}>Member Resources</NavLink>
          <NavLink href="/leadership-profile" icon={User}>My Leadership Profile</NavLink>
          <NavLink href="/constraint-report" icon={Target}>Our Constraint Report</NavLink>
        </nav>

        {/* Recent Activity */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '1.2px',
            color: '#94a3b8',
            marginBottom: '12px',
            fontWeight: 600
          }}>
            Recent Activity
          </div>
          <ActivityItem name="Board Assessment started" time="Today" />
          <ActivityItem name="Strategic Plan completed" time="3 days ago" completed />
        </div>

        {/* Upcoming Events */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <span style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
              color: '#94a3b8',
              fontWeight: 600
            }}>
              Upcoming Events
            </span>
            <a href="/events" style={{ fontSize: '12px', color: '#0097A9', textDecoration: 'none', fontWeight: 500 }}>
              View All
            </a>
          </div>
          <EventItem day="21" month="Jan" name="Live Q&A Session" time="2:00 PM EST" />
          <EventItem day="24" month="Feb" name="🚀 Platform Launch" time="12:00 PM EST" />
        </div>

        {/* Downloads */}
        <div style={{
          marginBottom: '20px',
          padding: '16px',
          background: '#0097A9',
          borderRadius: '10px',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Remaining Downloads</span>
            <span style={{ fontSize: '12px', fontWeight: 600 }}>18 of 25</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.3)', borderRadius: '3px', marginBottom: '10px' }}>
            <div style={{ width: '72%', height: '100%', background: 'white', borderRadius: '3px' }} />
          </div>
          <span style={{
            display: 'inline-block',
            fontSize: '10px',
            fontWeight: 700,
            background: 'white',
            color: '#0D2C54',
            padding: '4px 10px',
            borderRadius: '4px',
            letterSpacing: '0.5px'
          }}>
            PROFESSIONAL
          </span>
        </div>

        {/* Settings */}
        <div style={{ marginBottom: '16px' }}>
          <NavLink href="/settings" icon={Settings}>Settings</NavLink>
        </div>

        {/* User Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 0',
          borderTop: '1px solid #e2e8f0',
          marginTop: 'auto'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: '#0097A9',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            fontSize: '14px'
          }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>{userName}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>The Pivotal Group</div>
          </div>
        </div>
        <button 
          onClick={handleSignOut}
          style={{
            fontSize: '13px',
            color: '#94a3b8',
            textDecoration: 'none',
            paddingLeft: '48px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        marginLeft: '280px',
        padding: '32px 40px',
      }}>
        <div style={{ maxWidth: '1000px' }}>
          {/* Welcome */}
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#0D2C54', marginBottom: '6px' }}>
              {greeting}, {userName}.
            </h1>
            <p style={{ color: '#64748b', fontSize: '15px' }}>
              You chose <strong style={{ color: '#0097A9', fontWeight: 600 }}>{focusArea}</strong> as your focus area
              <button style={{
                marginLeft: '12px',
                fontSize: '13px',
                color: '#94a3b8',
                textDecoration: 'underline',
                textUnderlineOffset: '2px',
                cursor: 'pointer',
                background: 'none',
                border: 'none'
              }}>
                Change focus
              </button>
            </p>
          </div>

          {/* Top Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', alignItems: 'stretch' }}>
            {/* Today's Challenge Card */}
            <div style={{
              background: 'linear-gradient(135deg, #0097A9 0%, #00b4cc 100%)',
              borderRadius: '16px',
              padding: '28px',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Background circle decoration */}
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '150px',
                height: '150px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
              }} />

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
              }}>
                <div style={{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  opacity: 0.9,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Lightbulb size={14} />
                  Today's Challenge
                </div>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  background: tagStyle.background,
                  color: tagStyle.color,
                }}>
                  {shortFocus}
                </span>
              </div>

              <p style={{ fontSize: '18px', lineHeight: 1.6, fontWeight: 500, flex: 1, marginBottom: '20px' }}>
                {challenges[currentChallenge]}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => setIsCommitted(!isCommitted)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: isCommitted ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.2)',
                    border: isCommitted ? 'none' : '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '10px',
                    padding: '12px 20px',
                    color: isCommitted ? '#0097A9' : 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                    flex: 1,
                  }}
                >
                  <span style={{
                    width: '22px',
                    height: '22px',
                    border: isCommitted ? 'none' : '2px solid rgba(255,255,255,0.5)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isCommitted ? '#0097A9' : 'transparent',
                    transition: 'all 0.2s',
                  }}>
                    {isCommitted && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </span>
                  {isCommitted ? "I'm committed!" : "I'll do this"}
                </button>
                <button
                  onClick={handleRefreshChallenge}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Show another challenge"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>

            {/* Ask the Professor Card */}
            <a
              href="/ask-professor"
              style={{
                background: 'linear-gradient(135deg, #0D2C54 0%, #1a4175 100%)',
                borderRadius: '16px',
                padding: '28px',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(13,44,84,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                opacity: 0.85,
                marginBottom: '16px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <MessageCircle size={14} style={{ color: '#0097A9' }} />
                Ask the Professor
              </div>
              <p style={{ fontSize: '16px', lineHeight: 1.65, flex: 1, marginBottom: '24px' }}>
                Your personal nonprofit leadership advisor, available 24/7. Get strategic guidance tailored to your challenges.
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '10px',
                padding: '12px 18px',
                color: 'white',
                fontSize: '14px',
                fontWeight: 500,
                marginTop: 'auto'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageCircle size={16} />
                  Ask me anything
                </span>
                <ArrowRight size={16} />
              </div>
            </a>
          </div>

          {/* Tools Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0D2C54' }}>Your Tools</h2>
            <a href="/tools" style={{
              fontSize: '14px',
              color: '#0097A9',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 500
            }}>
              View All <ChevronRight size={16} />
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {tools.map((tool, index) => (
              <ToolCard key={index} name={tool.name} image={tool.image} route={tool.route} />
            ))}
          </div>

          {/* Quote of the Day */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px 40px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '40px',
            marginTop: '32px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flex: 1 }}>
              <span style={{
                fontSize: '48px',
                color: '#0097A9',
                opacity: 0.3,
                fontFamily: "'Playfair Display', Georgia, serif",
                lineHeight: 1,
                marginTop: '-8px',
              }}>"</span>
              <p style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '22px',
                fontStyle: 'italic',
                color: '#0D2C54',
                lineHeight: 1.5,
                fontWeight: 400,
              }}>
                {dailyQuote.text}
              </p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ color: '#0D2C54', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                {dailyQuote.author}
              </p>
              <span style={{
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#94a3b8',
              }}>
                Quote of the Day
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Google Font for quotes */}
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital@0;1&display=swap" rel="stylesheet" />
    </div>
  );
};

// Helper Components
const NavLink: React.FC<{ href: string; icon: React.ElementType; children: React.ReactNode }> = ({ href, icon: Icon, children }) => (
  <a
    href={href}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 14px',
      borderRadius: '10px',
      color: '#475569',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: 500,
      marginBottom: '4px',
      transition: 'all 0.15s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = '#f1f5f9';
      e.currentTarget.style.color = '#0D2C54';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.color = '#475569';
    }}
  >
    <Icon size={20} />
    {children}
  </a>
);

const ActivityItem: React.FC<{ name: string; time: string; completed?: boolean }> = ({ name, time, completed }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 0' }}>
    <span style={{
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: completed ? '#D4A84B' : '#0097A9',
      marginTop: '5px',
      flexShrink: 0
    }} />
    <div>
      <div style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>{name}</div>
      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{time}</div>
    </div>
  </div>
);

const EventItem: React.FC<{ day: string; month: string; name: string; time: string }> = ({ day, month, name, time }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 0',
    borderBottom: '1px solid #f1f5f9'
  }}>
    <div style={{
      background: '#0D2C54',
      borderRadius: '6px',
      padding: '6px 10px',
      textAlign: 'center',
      minWidth: '44px'
    }}>
      <div style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>{day}</div>
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' }}>{month}</div>
    </div>
    <div>
      <div style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>{name}</div>
      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{time}</div>
    </div>
  </div>
);

const ToolCard: React.FC<{ name: string; image: string; route: string }> = ({ name, image, route }) => (
  <a
    href={route}
    style={{
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid #e2e8f0',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textDecoration: 'none',
      display: 'block'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
  >
    <div style={{
      height: '120px',
      backgroundImage: `linear-gradient(to bottom, rgba(13,44,84,0) 0%, rgba(13,44,84,0.85) 100%), url(${image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'flex-end',
      padding: '16px'
    }}>
      <span style={{ color: 'white', fontWeight: 600, fontSize: '15px' }}>{name}</span>
    </div>
  </a>
);

export default DashboardV2;
