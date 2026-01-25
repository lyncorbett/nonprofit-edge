import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Search, Filter, Plus, Archive, Trash2, Clock, MessageCircle,
  Home, FolderOpen, User, Target, Settings, ChevronRight
} from 'lucide-react';

interface Conversation {
  id: string;
  title: string;
  preview: string;
  messages: any[];
  has_unread_response: boolean;
  last_message_at: string;
  created_at: string;
}

const ConversationHistory: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState('there');

  useEffect(() => {
    fetchConversations();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, first_name')
        .eq('id', user.id)
        .single();
      if (profile) {
        setUserName(profile.first_name || profile.full_name || 'there');
      }
    }
  };

  const fetchConversations = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data, error } = await supabase
        .from('professor_conversations')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_archived', false)
        .order('last_message_at', { ascending: false });
      
      if (!error && data) {
        setConversations(data);
      }
    }
    setIsLoading(false);
  };

  const handleArchive = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    await supabase
      .from('professor_conversations')
      .update({ is_archived: true })
      .eq('id', id);
    
    setConversations(prev => prev.filter(c => c.id !== id));
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this conversation?')) return;
    
    await supabase
      .from('professor_conversations')
      .delete()
      .eq('id', id);
    
    setConversations(prev => prev.filter(c => c.id !== id));
  };

  const markAsRead = async (id: string) => {
    await supabase
      .from('professor_conversations')
      .update({ has_unread_response: false })
      .eq('id', id);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  // Group conversations by date
  const groupByDate = (convos: Conversation[]) => {
    const groups: { [key: string]: Conversation[] } = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    convos.forEach(convo => {
      const date = new Date(convo.last_message_at);
      date.setHours(0, 0, 0, 0);
      
      let key: string;
      if (date.getTime() === today.getTime()) {
        key = 'Today';
      } else if (date.getTime() === yesterday.getTime()) {
        key = 'Yesterday';
      } else if (date > lastWeek) {
        key = 'Last 7 Days';
      } else {
        key = 'Older';
      }
      
      if (!groups[key]) groups[key] = [];
      groups[key].push(convo);
    });

    return groups;
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hours ago`;
    if (hours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Filter conversations
  const filteredConversations = conversations.filter(c =>
    c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.preview?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedConversations = groupByDate(filteredConversations);
  const unreadCount = conversations.filter(c => c.has_unread_response).length;

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
        {/* Logo */}
        <div style={{ marginBottom: '32px' }}>
          <img src="/logo.png" alt="The Nonprofit Edge" style={{ width: '180px', height: 'auto' }} />
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
          <NavLink href="/dashboard" icon={Home}>Dashboard</NavLink>
          <NavLink href="/ask-professor" icon={MessageCircle} badge={unreadCount > 0 ? unreadCount : undefined}>
            Ask the Professor
          </NavLink>
          <NavLink href="/conversations" icon={Clock} active>Conversation History</NavLink>
          <NavLink href="/member-resources" icon={FolderOpen}>Member Resources</NavLink>
        </nav>

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
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            paddingLeft: '48px'
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
        <div style={{ maxWidth: '900px' }}>
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            marginBottom: '32px'
          }}>
            <div>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: 700, 
                color: '#0D2C54', 
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span>🎓</span>
                Conversation History
              </h1>
              <p style={{ color: '#64748b', fontSize: '15px' }}>
                Your past conversations with the Professor
              </p>
            </div>
            <a
              href="/ask-professor"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #0097A9 0%, #00b4cc 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'none'
              }}
            >
              <Plus size={18} />
              New Conversation
            </a>
          </div>

          {/* Search & Filters */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={18} style={{ 
                position: 'absolute', 
                left: '14px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#94a3b8' 
              }} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 44px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              fontSize: '14px',
              color: '#475569',
              cursor: 'pointer'
            }}>
              <Filter size={18} />
              Filter
            </button>
          </div>

          {/* Conversation List */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
              Loading conversations...
            </div>
          ) : filteredConversations.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: 'white',
              borderRadius: '16px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 16px',
                background: '#f1f5f9',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px'
              }}>
                🎓
              </div>
              <h3 style={{ fontSize: '18px', color: '#0D2C54', marginBottom: '8px' }}>
                No conversations yet
              </h3>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
                Start a conversation with the Professor to get personalized guidance
              </p>
              <a
                href="/ask-professor"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #0097A9 0%, #00b4cc 100%)',
                  color: 'white',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                <Plus size={18} />
                Start Conversation
              </a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(groupedConversations).map(([date, convos]) => (
                <React.Fragment key={date}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    margin: '24px 0 16px'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {date}
                    </span>
                    <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                  </div>

                  {convos.map((convo) => (
                    <a
                      key={convo.id}
                      href={`/ask-professor?id=${convo.id}`}
                      onClick={() => convo.has_unread_response && markAsRead(convo.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '16px',
                        padding: '20px',
                        background: convo.has_unread_response 
                          ? 'linear-gradient(90deg, #f0fdfa 0%, white 100%)' 
                          : 'white',
                        borderRadius: '14px',
                        border: '1px solid #e2e8f0',
                        borderLeft: convo.has_unread_response ? '4px solid #0097A9' : '1px solid #e2e8f0',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        position: 'relative',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: '#0D2C54',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontSize: '24px'
                      }}>
                        🎓
                      </div>
                      
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '6px'
                        }}>
                          <div style={{
                            fontSize: '15px',
                            fontWeight: 600,
                            color: '#0D2C54',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            {convo.has_unread_response && (
                              <span style={{
                                width: '8px',
                                height: '8px',
                                background: '#0097A9',
                                borderRadius: '50%',
                                flexShrink: 0
                              }} />
                            )}
                            {convo.title || 'Untitled conversation'}
                          </div>
                          <span style={{ fontSize: '12px', color: '#94a3b8', flexShrink: 0 }}>
                            {formatTime(convo.last_message_at)}
                          </span>
                        </div>
                        
                        <p style={{
                          fontSize: '13px',
                          color: '#64748b',
                          lineHeight: 1.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          marginBottom: '10px'
                        }}>
                          {convo.preview || 'No preview available'}
                        </p>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            color: '#94a3b8'
                          }}>
                            <MessageCircle size={14} />
                            {convo.messages?.length || 0} messages
                          </span>
                        </div>
                      </div>

                      {/* Action buttons - show on hover via CSS */}
                      <div className="conversation-actions" style={{
                        display: 'flex',
                        gap: '8px',
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        opacity: 0,
                        transition: 'opacity 0.2s'
                      }}>
                        <button
                          onClick={(e) => handleArchive(convo.id, e)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#f1f5f9',
                            color: '#64748b',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Archive"
                        >
                          <Archive size={16} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(convo.id, e)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#FEE2E2',
                            color: '#DC2626',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </a>
                  ))}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </main>

      <style>{`
        a:hover .conversation-actions {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

// NavLink helper
const NavLink: React.FC<{ 
  href: string; 
  icon: React.ElementType; 
  children: React.ReactNode; 
  active?: boolean;
  badge?: number;
}> = ({ href, icon: Icon, children, active, badge }) => (
  <a
    href={href}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 14px',
      borderRadius: '10px',
      color: active ? '#0097A9' : '#475569',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: active ? 600 : 500,
      marginBottom: '4px',
      background: active ? '#f0fdfa' : 'transparent',
      transition: 'all 0.15s ease'
    }}
  >
    <Icon size={20} />
    <span style={{ flex: 1 }}>{children}</span>
    {badge && (
      <span style={{
        background: '#DC2626',
        color: 'white',
        fontSize: '11px',
        fontWeight: 700,
        padding: '2px 8px',
        borderRadius: '10px',
        minWidth: '20px',
        textAlign: 'center'
      }}>
        {badge}
      </span>
    )}
  </a>
);

export default ConversationHistory;
