import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ToolIntroModal from './ToolIntroModal';
import { 
  FolderOpen, User, Target, Calendar, Users, Clock, 
  ChevronRight, Settings, MessageCircle, Lightbulb,
  ArrowRight, RefreshCw, Menu, X
} from 'lucide-react';

// Logo component - Uses PNG image for clean scaling
const Logo = ({ width = 180 }: { width?: number }) => (
  <img 
    src="/logo-color.png" 
    alt="The Nonprofit Edge" 
    style={{ 
      width: width, 
      height: 'auto',
      objectFit: 'contain'
    }} 
  />
);

// Check if mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

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
  dashboards: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
};

const DashboardV2: React.FC = () => {
  const [userName, setUserName] = useState('there');
  const [focusArea, setFocusArea] = useState('Board Engagement');
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [isCommitted, setIsCommitted] = useState(false);
  const [dailyQuote, setDailyQuote] = useState(quotes[0]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentActivity, setRecentActivity] = useState<{name: string; time: string; href: string; completed?: boolean}[]>([]);
  const isMobile = useIsMobile();
  
  // Modal state
  const [activeToolModal, setActiveToolModal] = useState<string | null>(null);
  const [pendingNavigation, setPendingNavigation] = useState<{ route: string; setupRoute?: string } | null>(null);

  // Fetch user info and recent activity on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch profile
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

        // Fetch recent activity (tool usage)
        const { data: activity } = await supabase
          .from('tool_usage')
          .select('tool_name, created_at, completed')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (activity && activity.length > 0) {
          const formattedActivity = activity.map(item => {
            const date = new Date(item.created_at);
            const now = new Date();
            const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
            let timeStr = 'Today';
            if (diffDays === 1) timeStr = 'Yesterday';
            else if (diffDays > 1) timeStr = `${diffDays} days ago`;
            
            const toolRoutes: Record<string, string> = {
              'Board Assessment': '/board-assessment/setup',
              'Strategic Plan Check-Up': '/strategic-plan-checkup/use',
              'Grant Review': '/grant-review/use',
              'CEO Evaluation': '/ceo-evaluation/setup',
              'Scenario Planner': '/scenario-planner/use',
              'Ask the Professor': '/ask-professor',
            };
            
            return {
              name: `${item.tool_name} ${item.completed ? 'completed' : 'started'}`,
              time: timeStr,
              href: toolRoutes[item.tool_name] || '/dashboard',
              completed: item.completed
            };
          });
          setRecentActivity(formattedActivity);
        }

        // Check if user already committed to today's challenge
        const today = new Date().toISOString().split('T')[0];
        const { data: commitment } = await supabase
          .from('challenge_commitments')
          .select('id')
          .eq('user_id', user.id)
          .eq('date', today)
          .single();
        
        if (commitment) {
          setIsCommitted(true);
        }
      }
    };
    fetchUserData();

    // Set daily quote based on date
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    setDailyQuote(quotes[dayOfYear % quotes.length]);
  }, []);

  // Handle commitment
  const handleCommit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && !isCommitted) {
      const today = new Date().toISOString().split('T')[0];
      await supabase
        .from('challenge_commitments')
        .upsert({
          user_id: user.id,
          date: today,
          challenge_text: challenges[currentChallenge],
          focus_area: focusArea
        });
    }
    setIsCommitted(true);
  };

  // Tools with modal IDs and routes
  const tools = [
    { name: 'Board Assessment', image: toolImages.boardAssessment, toolId: 'board-assessment', route: '/board-assessment/setup' },
    { name: 'Strategic Plan Check-Up', image: toolImages.strategicPlan, toolId: 'strategic-plan', route: '/strategic-plan-checkup/use' },
    { name: 'Grant Review', image: toolImages.grantReview, toolId: 'grant-review', route: '/grant-review/use' },
    { name: 'CEO Evaluation', image: toolImages.ceoEvaluation, toolId: 'ceo-evaluation', route: '/ceo-evaluation/setup' },
    { name: 'Scenario Planner', image: toolImages.scenarioPlanner, toolId: 'scenario-planner', route: '/scenario-planner/use' },
    { name: 'Dashboards', image: toolImages.dashboards, toolId: 'dashboards', route: '/dashboards' },
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

  const handleToolClick = (tool: typeof tools[0]) => {
    setActiveToolModal(tool.toolId);
    setPendingNavigation({ route: tool.route, setupRoute: tool.setupRoute });
  };

  // Get time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: '14px',
      lineHeight: 1.5,
      display: 'flex',
      zoom: '0.9', // 90% zoom to show more content
      WebkitTextSizeAdjust: '100%',
    }}>
      {/* Mobile Header */}
      {isMobile && (
        <header style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'white',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 100
        }}>
          <Logo width={140} />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              color: '#0D2C54'
            }}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>
      )}

      {/* Sidebar Overlay for Mobile */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 199
          }}
        />
      )}

      {/* Left Sidebar */}
      <aside style={{
        width: isMobile ? '280px' : '250px',
        background: 'white',
        borderRight: '1px solid #e2e8f0',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: isMobile ? '60px' : 0,
        left: isMobile ? (sidebarOpen ? 0 : '-300px') : 0,
        height: isMobile ? 'calc(100vh - 60px)' : '100vh',
        overflowY: 'auto',
        zIndex: 200,
        transition: 'left 0.3s ease'
      }}>
        {/* Logo - Desktop Only */}
        {!isMobile && (
          <div style={{ marginBottom: '24px' }}>
            <Logo width={170} />
          </div>
        )}

        {/* Quick Actions */}
        <nav style={{ marginBottom: '20px' }}>
          <div style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '1.2px',
            color: '#94a3b8',
            marginBottom: '10px',
            fontWeight: 600
          }}>
            Quick Actions
          </div>
          <NavLink href="/member-resources" icon={FolderOpen}>Member Resources</NavLink>
          <NavLink href="/leadership-profile" icon={User}>My Leadership Profile</NavLink>
          <NavLink href="/constraint-report" icon={Target}>Our Constraint Report</NavLink>
        </nav>

        {/* Recent Activity */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <span style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
              color: '#94a3b8',
              fontWeight: 600
            }}>
              Recent Activity
            </span>
            <a href="/my-activity" style={{ fontSize: '12px', color: '#0097A9', textDecoration: 'none', fontWeight: 500 }}>
              View All
            </a>
          </div>
          {recentActivity.length > 0 ? (
            recentActivity.slice(0, 3).map((item, index) => (
              <ActivityItem 
                key={index}
                name={item.name} 
                time={item.time} 
                href={item.href}
                completed={item.completed}
              />
            ))
          ) : (
            <>
              <ActivityItem 
                name="Board Assessment started" 
                time="Today" 
                href="/board-assessment/setup"
              />
              <ActivityItem 
                name="Strategic Plan completed" 
                time="3 days ago" 
                completed 
                href="/strategic-plan-checkup/use"
              />
            </>
          )}
        </div>

        {/* Upcoming Events */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
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
          <EventItem 
            day="21" 
            month="Jan" 
            name="Live Q&A Session" 
            time="2:00 PM EST" 
            href="/events"
          />
          <EventItem 
            day="24" 
            month="Feb" 
            name="🚀 Platform Launch" 
            time="12:00 PM EST" 
            href="/events"
          />
        </div>

        {/* Downloads */}
        <div style={{
          marginBottom: '16px',
          padding: '14px',
          background: '#0097A9',
          borderRadius: '10px',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600 }}>Remaining Downloads</span>
            <span style={{ fontSize: '11px', fontWeight: 600 }}>18 of 25</span>
          </div>
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.3)', borderRadius: '3px', marginBottom: '8px' }}>
            <div style={{ width: '72%', height: '100%', background: 'white', borderRadius: '3px' }} />
          </div>
          <span style={{
            display: 'inline-block',
            fontSize: '9px',
            fontWeight: 700,
            background: 'white',
            color: '#0D2C54',
            padding: '3px 8px',
            borderRadius: '4px',
            letterSpacing: '0.5px'
          }}>
            PROFESSIONAL
          </span>
        </div>

        {/* Settings */}
        <div style={{ marginBottom: '12px' }}>
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
        marginLeft: isMobile ? 0 : '250px',
        marginTop: isMobile ? '60px' : 0,
        padding: isMobile ? '20px 16px' : '24px 32px',
      }}>
        <div style={{ maxWidth: '1100px' }}>
          {/* Welcome */}
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ 
              fontSize: '26px', 
              fontWeight: 700, 
              color: '#0D2C54', 
              marginBottom: '4px',
              fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif"
            }}>
              {greeting}, {userName}.
            </h1>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              You chose <strong style={{ color: '#0097A9', fontWeight: 600 }}>{focusArea}</strong> as your focus area
              {!isMobile && (
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
              )}
            </p>
          </div>

          {/* Top Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
            gap: '16px', 
            marginBottom: '20px', 
            alignItems: 'stretch' 
          }}>
            {/* Today's Challenge Card */}
            <div style={{
              background: 'linear-gradient(135deg, #0097A9 0%, #00b4cc 100%)',
              borderRadius: '14px',
              padding: isMobile ? '20px' : '22px',
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
                top: '-40px',
                right: '-40px',
                width: '120px',
                height: '120px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
              }} />

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '12px',
              }}>
                <div style={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  opacity: 0.9,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Lightbulb size={13} />
                  Today's Challenge
                </div>
                <span style={{
                  display: 'inline-block',
                  padding: '3px 10px',
                  borderRadius: '10px',
                  fontSize: '10px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  background: tagStyle.background,
                  color: tagStyle.color,
                }}>
                  {shortFocus}
                </span>
              </div>

              <p style={{ fontSize: '16px', lineHeight: 1.55, fontWeight: 500, flex: 1, marginBottom: '16px' }}>
                {challenges[currentChallenge]}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={handleCommit}
                  disabled={isCommitted}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: isCommitted ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.2)',
                    border: isCommitted ? 'none' : '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    color: isCommitted ? '#0097A9' : 'white',
                    cursor: isCommitted ? 'default' : 'pointer',
                    fontSize: '13px',
                    fontWeight: 500,
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                    flex: 1,
                  }}
                >
                  <span style={{
                    width: '18px',
                    height: '18px',
                    border: isCommitted ? 'none' : '2px solid rgba(255,255,255,0.5)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isCommitted ? '#0097A9' : 'transparent',
                    transition: 'all 0.2s',
                  }}>
                    {isCommitted && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
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
                    padding: '10px',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Show another challenge"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            {/* Ask the Professor Card */}
            <div
              onClick={() => {
                setActiveToolModal('ask-professor');
                setPendingNavigation({ route: '/ask-professor' });
              }}
              style={{
                background: 'linear-gradient(135deg, #0D2C54 0%, #1a4175 100%)',
                borderRadius: '14px',
                padding: isMobile ? '20px' : '22px',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(13,44,84,0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                opacity: 0.85,
                marginBottom: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <MessageCircle size={13} style={{ color: '#0097A9' }} />
                Ask the Professor
              </div>
              <p style={{ fontSize: '15px', lineHeight: 1.55, flex: 1, marginBottom: '16px' }}>
                Your personal nonprofit leadership advisor, available 24/7. Get strategic guidance tailored to your challenges.
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: 'white',
                fontSize: '13px',
                fontWeight: 500,
                marginTop: 'auto'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MessageCircle size={14} />
                  Ask me anything
                </span>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>

          {/* Tools Section */}
          <div style={{ 
            marginBottom: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0D2C54', margin: 0 }}>Your Tools</h2>
            <a 
              href="/tools" 
              style={{ 
                fontSize: '13px', 
                color: '#0097A9', 
                textDecoration: 'none', 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              View All <ChevronRight size={14} />
            </a>
          </div>

          {/* Tool Cards Grid - WITH MODAL TRIGGERS */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', 
            gap: isMobile ? '12px' : '14px' 
          }}>
            {tools.map((tool, index) => (
              <div
                key={index}
                onClick={() => handleToolClick(tool)}
                style={{
                  background: 'white',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  height: isMobile ? '80px' : '100px',
                  backgroundImage: `linear-gradient(to bottom, rgba(13,44,84,0) 0%, rgba(13,44,84,0.85) 100%), url(${tool.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: isMobile ? '10px' : '12px'
                }}>
                  <span style={{ 
                    color: 'white', 
                    fontWeight: 600, 
                    fontSize: '13px',
                    fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif"
                  }}>{tool.name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quote of the Day */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: isMobile ? '20px' : '24px 28px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: isMobile ? '16px' : '32px',
            marginTop: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
              <span style={{
                fontSize: isMobile ? '48px' : '56px',
                color: '#0097A9',
                opacity: 0.25,
                fontFamily: "'Playfair Display', Georgia, serif",
                lineHeight: 1,
                flexShrink: 0
              }}>"</span>
              <p style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: isMobile ? '16px' : '18px',
                fontStyle: 'italic',
                color: '#0D2C54',
                lineHeight: 1.5,
                fontWeight: 400,
              }}>
                {dailyQuote.text}
              </p>
            </div>
            <div style={{ textAlign: isMobile ? 'left' : 'right', flexShrink: 0 }}>
              <p style={{ color: '#0D2C54', fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>
                {dailyQuote.author}
              </p>
              <span style={{
                fontSize: '9px',
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

      {/* Tool Intro Modal */}
      {activeToolModal && (
        <ToolIntroModal
          toolId={activeToolModal as any}
          isOpen={true}
          onClose={() => {
            setActiveToolModal(null);
            setPendingNavigation(null);
          }}
          onStart={() => {
            setActiveToolModal(null);
            if (pendingNavigation?.route) {
              window.location.href = pendingNavigation.route;
            }
          }}
          onSetup={pendingNavigation?.setupRoute ? () => {
            setActiveToolModal(null);
            window.location.href = pendingNavigation.setupRoute!;
          } : undefined}
        />
      )}

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
      gap: '10px',
      padding: '10px 12px',
      borderRadius: '8px',
      color: '#475569',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: 500,
      marginBottom: '2px',
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
    <Icon size={18} />
    {children}
  </a>
);

const ActivityItem: React.FC<{ name: string; time: string; completed?: boolean; href?: string }> = ({ name, time, completed, href }) => {
  const content = (
    <>
      <span style={{
        width: '7px',
        height: '7px',
        borderRadius: '50%',
        background: completed ? '#D4A84B' : '#0097A9',
        marginTop: '5px',
        flexShrink: 0
      }} />
      <div>
        <div style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>{name}</div>
        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{time}</div>
      </div>
    </>
  );

  if (href) {
    return (
      <a 
        href={href}
        style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: '8px', 
          padding: '6px 0',
          textDecoration: 'none',
          borderRadius: '6px',
          transition: 'background 0.15s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        {content}
      </a>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '6px 0' }}>
      {content}
    </div>
  );
};

const EventItem: React.FC<{ day: string; month: string; name: string; time: string; href?: string }> = ({ day, month, name, time, href }) => {
  const content = (
    <>
      <div style={{
        background: '#0D2C54',
        borderRadius: '6px',
        padding: '5px 8px',
        textAlign: 'center',
        minWidth: '38px'
      }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>{day}</div>
        <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' }}>{month}</div>
      </div>
      <div>
        <div style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>{name}</div>
        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{time}</div>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 4px',
          borderBottom: '1px solid #f1f5f9',
          textDecoration: 'none',
          borderRadius: '6px',
          transition: 'background 0.15s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        {content}
      </a>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 0',
      borderBottom: '1px solid #f1f5f9'
    }}>
      {content}
    </div>
  );
};

export default DashboardV2;
