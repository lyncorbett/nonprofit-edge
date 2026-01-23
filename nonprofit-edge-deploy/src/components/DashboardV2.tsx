import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  FolderOpen, User, Target, Calendar, Users, Clock, PenLine, 
  ChevronDown, ChevronRight, Settings, MessageCircle, Lightbulb,
  ArrowRight, X, Send, Check, Loader2
} from 'lucide-react';

// Logo component inline to avoid import issues
const Logo = ({ width = 180 }: { width?: number }) => (
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

// Import images - replace with local hosted versions
const toolImages = {
  boardAssessment: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
  strategicPlan: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
  grantReview: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
  ceoEvaluation: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop',
  scenarioPlanner: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop',
  dashboards: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&h=300&fit=crop',
};

interface CommitmentOption {
  icon: React.ElementType;
  text: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const DashboardV2: React.FC = () => {
  const [isProfessorOpen, setIsProfessorOpen] = useState(false);
  const [isCommitmentOpen, setIsCommitmentOpen] = useState(false);
  const [selectedCommitment, setSelectedCommitment] = useState<string | null>(null);
  const [customCommitment, setCustomCommitment] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // FIXED: Start with empty messages - greeting comes from API
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [greetingLoaded, setGreetingLoaded] = useState(false);
  
  const [chatInput, setChatInput] = useState('');
  const [userName, setUserName] = useState('there');

  // Fetch user info on mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, first_name')
          .eq('id', user.id)
          .single();
        if (profile) {
          setUserName(profile.full_name || profile.first_name || 'there');
        }
      }
    };
    fetchUser();
  }, []);

  // Fetch greeting from API when panel opens
  useEffect(() => {
    const fetchGreeting = async () => {
      if (isProfessorOpen && !greetingLoaded && chatMessages.length === 0) {
        setIsLoading(true);
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          const response = await fetch('/api/ask-professor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [{ role: 'user', content: '[GREETING]' }],
              accessToken: session?.access_token,
            })
          });
          const data = await response.json();
          if (data.response) {
            setChatMessages([{ role: 'assistant', content: data.response }]);
          } else {
            setChatMessages([{ role: 'assistant', content: `Hey ${userName}! What's on your mind today?` }]);
          }
        } catch (error) {
          console.error('Greeting error:', error);
          setChatMessages([{ role: 'assistant', content: `Hey ${userName}! What's on your mind today?` }]);
        } finally {
          setIsLoading(false);
          setGreetingLoaded(true);
        }
      }
    };
    fetchGreeting();
  }, [isProfessorOpen, greetingLoaded, chatMessages.length, userName]);

  const commitmentOptions: CommitmentOption[] = [
    { icon: Calendar, text: "Schedule this conversation this week" },
    { icon: Users, text: "Discuss at next board meeting" },
    { icon: Clock, text: "Block 30 minutes to reflect on this" },
    { icon: Target, text: "Add to my quarterly goals" },
  ];

  const tools = [
    { name: 'Board Assessment', image: toolImages.boardAssessment, route: '/tools/board-assessment' },
    { name: 'Strategic Plan Check-Up', image: toolImages.strategicPlan, route: '/tools/strategic-plan' },
    { name: 'Grant Review', image: toolImages.grantReview, route: '/tools/grant-review' },
    { name: 'CEO Evaluation', image: toolImages.ceoEvaluation, route: '/tools/ceo-evaluation' },
    { name: 'Scenario Planner', image: toolImages.scenarioPlanner, route: '/tools/scenario-planner' },
    { name: 'Dashboards', image: toolImages.dashboards, route: '/tools/dashboards' },
  ];

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) return;
    
    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatInput('');
    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Build messages array for Claude (skip greeting marker)
      const messagesForAPI = chatMessages
        .filter(msg => msg.content !== '[GREETING]')
        .map(msg => ({ role: msg.role, content: msg.content }));
      messagesForAPI.push({ role: 'user', content: userMessage });

      const response = await fetch('/api/ask-professor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesForAPI,
          accessToken: session?.access_token,
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response 
      }]);

    } catch (error) {
      console.error('Error sending message:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting right now. Please try again in a moment." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommitmentSelect = (commitment: string) => {
    setSelectedCommitment(commitment);
    setIsCommitmentOpen(false);
    setShowCustomInput(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const startNewConversation = () => {
    setChatMessages([]);
    setGreetingLoaded(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
      display: 'flex',
      zoom: 0.9
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
        {/* Logo */}
        <div style={{ marginBottom: '32px' }}>
          <Logo width={160} />
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
        transition: 'margin-right 0.3s ease',
        marginRight: isProfessorOpen ? '440px' : '0'
      }}>
        <div style={{ maxWidth: '1000px' }}>
          {/* Welcome */}
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#0D2C54', marginBottom: '6px' }}>
              Good morning, {userName}
            </h1>
            <p style={{ color: '#64748b', fontSize: '15px' }}>
              You chose <strong style={{ color: '#0097A9', fontWeight: 600 }}>Board Engagement</strong> as your focus area
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px', alignItems: 'stretch' }}>
            {/* Today's Insight Card */}
            <div style={{
              background: 'linear-gradient(135deg, #0097A9 0%, #00b4cc 100%)',
              borderRadius: '16px',
              padding: '28px',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}>
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
                <Lightbulb size={14} />
                Today's Insight
              </div>
              <p style={{ fontSize: '16px', lineHeight: 1.65, flex: 1, marginBottom: '24px' }}>
                The most effective boards don't just govern—they champion. When was the last time you asked your board members what excites them about your mission?
              </p>

              {/* Commitment Dropdown */}
              <div style={{ position: 'relative', marginTop: 'auto' }}>
                {!selectedCommitment ? (
                  <button
                    onClick={() => setIsCommitmentOpen(!isCommitmentOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      background: 'rgba(255,255,255,0.2)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '10px',
                      padding: '12px 18px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 500,
                      width: '100%',
                      fontFamily: 'inherit'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Target size={16} />
                      Make a Commitment
                    </span>
                    <ChevronDown size={16} style={{ transform: isCommitmentOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease' }} />
                  </button>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(255,255,255,0.2)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '10px',
                    padding: '12px 18px'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <Check size={16} style={{ color: '#4ade80' }} />
                      {selectedCommitment}
                    </span>
                    <button
                      onClick={() => setSelectedCommitment(null)}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: '4px' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* Dropdown Menu */}
                {isCommitmentOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    right: 0,
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    overflow: 'hidden',
                    zIndex: 100
                  }}>
                    {commitmentOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleCommitmentSelect(option.text)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          width: '100%',
                          padding: '14px 18px',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: '#0D2C54',
                          textAlign: 'left',
                          fontFamily: 'inherit',
                          borderBottom: index < commitmentOptions.length - 1 ? '1px solid #f1f5f9' : 'none'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f8f9fa')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                      >
                        <option.icon size={16} style={{ color: '#0097A9' }} />
                        {option.text}
                      </button>
                    ))}
                    
                    {!showCustomInput ? (
                      <button
                        onClick={() => setShowCustomInput(true)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          width: '100%',
                          padding: '14px 18px',
                          border: 'none',
                          background: '#f8f9fa',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: '#64748b',
                          textAlign: 'left',
                          fontFamily: 'inherit',
                          fontStyle: 'italic'
                        }}
                      >
                        <PenLine size={16} />
                        Write my own commitment...
                      </button>
                    ) : (
                      <div style={{ padding: '12px 18px', background: '#f8f9fa' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            placeholder="I will..."
                            value={customCommitment}
                            onChange={(e) => setCustomCommitment(e.target.value)}
                            style={{
                              flex: 1,
                              padding: '10px 14px',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              fontSize: '14px',
                              outline: 'none',
                              fontFamily: 'inherit'
                            }}
                            autoFocus
                          />
                          <button
                            onClick={() => {
                              if (customCommitment.trim()) {
                                handleCommitmentSelect(customCommitment);
                                setCustomCommitment('');
                              }
                            }}
                            style={{
                              background: '#0097A9',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '10px 14px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: 500
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Ask the Professor Card */}
            <div
              onClick={() => setIsProfessorOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #0D2C54 0%, #1a4175 100%)',
                borderRadius: '16px',
                padding: '28px',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
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
            </div>
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
        </div>
      </main>

      {/* Panel Overlay */}
      {isProfessorOpen && (
        <div
          onClick={() => setIsProfessorOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: '280px',
            right: '440px',
            bottom: 0,
            background: 'rgba(0,0,0,0.05)',
            zIndex: 999,
            cursor: 'pointer'
          }}
        />
      )}

      {/* Ask the Professor Slide-out Panel */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '440px',
        height: '100vh',
        background: 'white',
        boxShadow: isProfessorOpen ? '-8px 0 40px rgba(0,0,0,0.12)' : 'none',
        transform: isProfessorOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000
      }}>
        {/* Panel Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0D2C54 0%, #1a4175 100%)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MessageCircle size={20} style={{ color: '#0097A9' }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '16px' }}>Ask the Professor</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Available 24/7</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={startNewConversation}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
                color: 'white',
                fontSize: '12px',
                fontWeight: 500
              }}
            >
              New
            </button>
            <button
              onClick={() => setIsProfessorOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {chatMessages.map((message, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.role === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                maxWidth: '85%',
                padding: '14px 18px',
                borderRadius: message.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: message.role === 'user' 
                  ? 'linear-gradient(135deg, #0097A9 0%, #00b4cc 100%)' 
                  : '#f1f5f9',
                color: message.role === 'user' ? 'white' : '#0D2C54',
                fontSize: '14px',
                lineHeight: 1.6
              }}>
                {message.content}
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}>
              <div style={{
                maxWidth: '85%',
                padding: '14px 18px',
                borderRadius: '16px 16px 16px 4px',
                background: '#f1f5f9',
                color: '#64748b',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div style={{
          padding: '20px 24px',
          borderTop: '1px solid #e2e8f0',
          background: '#f8f9fa'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about board engagement, strategy, funding..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '14px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '14px',
                resize: 'none',
                minHeight: '48px',
                maxHeight: '120px',
                outline: 'none',
                fontFamily: 'inherit',
                lineHeight: 1.5,
                opacity: isLoading ? 0.6 : 1
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !chatInput.trim()}
              style={{
                background: isLoading || !chatInput.trim() 
                  ? '#94a3b8' 
                  : 'linear-gradient(135deg, #0D2C54 0%, #1a4175 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '14px',
                cursor: isLoading || !chatInput.trim() ? 'not-allowed' : 'pointer',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={18} />
            </button>
          </div>
          <div style={{ marginTop: '12px', textAlign: 'center' }}>
            <a href="/conversations" style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: '13px',
              cursor: 'pointer',
              textDecoration: 'underline',
              textUnderlineOffset: '3px'
            }}>
              View All Conversations
            </a>
          </div>
        </div>
      </div>

      {/* CSS for loading spinner */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
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
