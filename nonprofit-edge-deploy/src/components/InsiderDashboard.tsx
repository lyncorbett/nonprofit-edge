import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Users, Activity, MousePointer, Mail, MessageSquare,
  Clock, CheckCircle, AlertCircle, TrendingUp, Eye,
  BarChart3, RefreshCw, ChevronDown, ChevronRight,
  Star, Zap, FileText, ArrowLeft
} from 'lucide-react';

interface InsiderTester {
  id: string;
  email: string;
  name: string;
  organization?: string;
  status: 'pending' | 'invited' | 'active' | 'expired';
  invited_at?: string;
  activated_at?: string;
  last_login?: string;
  login_count: number;
  tools_used: number;
  feedback_count: number;
  total_sessions: number;
}

interface ToolUsageStat {
  tool_name: string;
  count: number;
  users: string[];
}

interface FeedbackItem {
  id: string;
  user_name: string;
  user_email: string;
  type: 'bug' | 'feature' | 'general';
  message: string;
  rating?: number;
  created_at: string;
}

const InsiderDashboard: React.FC = () => {
  const [testers, setTesters] = useState<InsiderTester[]>([]);
  const [toolUsage, setToolUsage] = useState<ToolUsageStat[]>([]);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedTester, setExpandedTester] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'testers' | 'feedback'>('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch beta testers with their activity
      const { data: testerData, error: testerError } = await supabase
        .from('beta_testers')
        .select('*')
        .order('created_at', { ascending: false });

      if (testerError) throw testerError;

      // Fetch user activity for each tester
      const testersWithActivity = await Promise.all(
        (testerData || []).map(async (tester) => {
          // Get login count from auth logs or profiles
          const { data: profile } = await supabase
            .from('profiles')
            .select('last_sign_in, login_count')
            .eq('email', tester.email)
            .single();

          // Get tool usage count
          const { count: toolCount } = await supabase
            .from('tool_usage')
            .select('*', { count: 'exact', head: true })
            .eq('user_email', tester.email);

          // Get feedback count
          const { count: feedbackCount } = await supabase
            .from('user_feedback')
            .select('*', { count: 'exact', head: true })
            .eq('user_email', tester.email);

          return {
            ...tester,
            last_login: profile?.last_sign_in || null,
            login_count: profile?.login_count || 0,
            tools_used: toolCount || 0,
            feedback_count: feedbackCount || 0,
            total_sessions: (profile?.login_count || 0) + (toolCount || 0)
          };
        })
      );

      setTesters(testersWithActivity);

      // Fetch aggregated tool usage
      const { data: usageData } = await supabase
        .from('tool_usage')
        .select('tool_name, user_email')
        .order('created_at', { ascending: false });

      if (usageData) {
        const usageMap: Record<string, { count: number; users: Set<string> }> = {};
        usageData.forEach(item => {
          if (!usageMap[item.tool_name]) {
            usageMap[item.tool_name] = { count: 0, users: new Set() };
          }
          usageMap[item.tool_name].count++;
          usageMap[item.tool_name].users.add(item.user_email);
        });

        const toolStats: ToolUsageStat[] = Object.entries(usageMap).map(([name, data]) => ({
          tool_name: name,
          count: data.count,
          users: Array.from(data.users)
        })).sort((a, b) => b.count - a.count);

        setToolUsage(toolStats);
      }

      // Fetch recent feedback
      const { data: feedbackData } = await supabase
        .from('user_feedback')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      setFeedback(feedbackData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      // Use mock data if tables don't exist yet
      setTesters([]);
      setToolUsage([]);
      setFeedback([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stats
  const stats = {
    total: testers.length,
    active: testers.filter(t => t.status === 'active' || t.login_count > 0).length,
    invited: testers.filter(t => t.status === 'invited').length,
    pending: testers.filter(t => t.status === 'pending').length,
    totalLogins: testers.reduce((sum, t) => sum + t.login_count, 0),
    totalToolUses: testers.reduce((sum, t) => sum + t.tools_used, 0),
    totalFeedback: testers.reduce((sum, t) => sum + t.feedback_count, 0),
    avgEngagement: testers.length > 0 
      ? Math.round(testers.reduce((sum, t) => sum + t.total_sessions, 0) / testers.length) 
      : 0
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getEngagementLevel = (tester: InsiderTester) => {
    const score = tester.login_count + tester.tools_used * 2 + tester.feedback_count * 3;
    if (score >= 10) return { label: 'High', color: '#10b981' };
    if (score >= 5) return { label: 'Medium', color: '#f59e0b' };
    if (score >= 1) return { label: 'Low', color: '#94a3b8' };
    return { label: 'None', color: '#ef4444' };
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif"
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0D2C54 0%, #1a4175 100%)',
        padding: '32px 40px',
        color: 'white'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Star size={24} />
                </div>
                <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0 }}>
                  Insider Dashboard
                </h1>
              </div>
              <p style={{ opacity: 0.8, fontSize: '15px' }}>
                Track engagement and feedback from your 12 founding beta testers
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={fetchData}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              <a
                href="/admin/beta-testers"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: '#0097A9',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Manage Testers
              </a>
            </div>
          </div>

          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { label: 'Total Insiders', value: stats.total, target: 12, icon: Users, color: '#0097A9' },
              { label: 'Active Users', value: stats.active, icon: Activity, color: '#10b981' },
              { label: 'Total Logins', value: stats.totalLogins, icon: MousePointer, color: '#6366f1' },
              { label: 'Feedback Received', value: stats.totalFeedback, icon: MessageSquare, color: '#f59e0b' }
            ].map((stat, idx) => (
              <div key={idx} style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255,255,255,0.15)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <stat.icon size={20} style={{ opacity: 0.8 }} />
                  {stat.target && (
                    <span style={{ fontSize: '12px', opacity: 0.7 }}>{stat.value}/{stat.target}</span>
                  )}
                </div>
                <div style={{ fontSize: '32px', fontWeight: 700 }}>{stat.value}</div>
                <div style={{ fontSize: '13px', opacity: 0.8 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 40px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'testers', label: 'All Testers', icon: Users },
            { id: 'feedback', label: 'Feedback', icon: MessageSquare }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: activeTab === tab.id ? '#0D2C54' : 'white',
                color: activeTab === tab.id ? 'white' : '#475569',
                border: activeTab === tab.id ? 'none' : '1px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <RefreshCw size={32} style={{ color: '#94a3b8', animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '16px', color: '#64748b' }}>Loading insider data...</p>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                {/* Tool Usage */}
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  padding: '24px'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0D2C54', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={20} style={{ color: '#0097A9' }} />
                    Tool Usage
                  </h3>
                  {toolUsage.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {toolUsage.map((tool, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px'
                        }}>
                          <div style={{ width: '140px', fontSize: '14px', fontWeight: 500, color: '#0D2C54' }}>
                            {tool.tool_name}
                          </div>
                          <div style={{ flex: 1, height: '24px', background: '#f1f5f9', borderRadius: '12px', overflow: 'hidden' }}>
                            <div style={{
                              width: `${Math.min((tool.count / Math.max(...toolUsage.map(t => t.count))) * 100, 100)}%`,
                              height: '100%',
                              background: 'linear-gradient(90deg, #0097A9, #00b4cc)',
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              paddingRight: '12px'
                            }}>
                              <span style={{ fontSize: '12px', fontWeight: 600, color: 'white' }}>{tool.count}</span>
                            </div>
                          </div>
                          <div style={{ width: '60px', fontSize: '13px', color: '#64748b' }}>
                            {tool.users.length} users
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>
                      No tool usage data yet
                    </p>
                  )}
                </div>

                {/* Engagement Leaderboard */}
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  padding: '24px'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0D2C54', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp size={20} style={{ color: '#10b981' }} />
                    Most Engaged
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {testers
                      .sort((a, b) => b.total_sessions - a.total_sessions)
                      .slice(0, 5)
                      .map((tester, idx) => {
                        const engagement = getEngagementLevel(tester);
                        return (
                          <div key={tester.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            background: '#f8fafc',
                            borderRadius: '10px'
                          }}>
                            <span style={{
                              width: '24px',
                              height: '24px',
                              background: idx < 3 ? '#f59e0b' : '#e2e8f0',
                              color: idx < 3 ? 'white' : '#64748b',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 700
                            }}>
                              {idx + 1}
                            </span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '14px', fontWeight: 600, color: '#0D2C54' }}>{tester.name}</div>
                              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                                {tester.login_count} logins • {tester.tools_used} tools
                              </div>
                            </div>
                            <span style={{
                              padding: '4px 10px',
                              background: `${engagement.color}20`,
                              color: engagement.color,
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 600
                            }}>
                              {engagement.label}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                  {testers.length === 0 && (
                    <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>
                      Add testers to see engagement
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Testers Tab */}
            {activeTab === 'testers' && (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden'
              }}>
                {/* Table Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1fr 100px',
                  padding: '16px 20px',
                  background: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <div>Name</div>
                  <div>Email</div>
                  <div>Status</div>
                  <div>Logins</div>
                  <div>Tools</div>
                  <div>Last Active</div>
                  <div>Engagement</div>
                </div>

                {/* Table Body */}
                {testers.length > 0 ? testers.map(tester => {
                  const engagement = getEngagementLevel(tester);
                  return (
                    <div
                      key={tester.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1fr 100px',
                        padding: '16px 20px',
                        borderBottom: '1px solid #f1f5f9',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, color: '#0D2C54' }}>{tester.name}</div>
                        {tester.organization && (
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>{tester.organization}</div>
                        )}
                      </div>
                      <div style={{ fontSize: '14px', color: '#64748b' }}>{tester.email}</div>
                      <div>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          background: 
                            tester.status === 'active' ? '#d1fae5' :
                            tester.status === 'invited' ? '#ddd6fe' :
                            tester.status === 'pending' ? '#fef3c7' : '#fee2e2',
                          color:
                            tester.status === 'active' ? '#065f46' :
                            tester.status === 'invited' ? '#6d28d9' :
                            tester.status === 'pending' ? '#92400e' : '#991b1b'
                        }}>
                          {tester.status}
                        </span>
                      </div>
                      <div style={{ fontWeight: 600, color: '#0D2C54' }}>{tester.login_count}</div>
                      <div style={{ fontWeight: 600, color: '#0D2C54' }}>{tester.tools_used}</div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>{formatDate(tester.last_login)}</div>
                      <div>
                        <span style={{
                          padding: '4px 10px',
                          background: `${engagement.color}20`,
                          color: engagement.color,
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600
                        }}>
                          {engagement.label}
                        </span>
                      </div>
                    </div>
                  );
                }) : (
                  <div style={{ padding: '60px', textAlign: 'center' }}>
                    <Users size={48} style={{ color: '#e2e8f0', marginBottom: '16px' }} />
                    <p style={{ color: '#64748b', marginBottom: '16px' }}>No beta testers added yet</p>
                    <a
                      href="/admin/beta-testers"
                      style={{
                        display: 'inline-flex',
                        padding: '10px 20px',
                        background: '#0097A9',
                        color: 'white',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 600,
                        textDecoration: 'none'
                      }}
                    >
                      Add Beta Testers
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Feedback Tab */}
            {activeTab === 'feedback' && (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '24px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0D2C54', marginBottom: '20px' }}>
                  Recent Feedback
                </h3>
                {feedback.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {feedback.map(item => (
                      <div key={item.id} style={{
                        padding: '20px',
                        background: '#f8fafc',
                        borderRadius: '12px',
                        borderLeft: `4px solid ${
                          item.type === 'bug' ? '#ef4444' :
                          item.type === 'feature' ? '#6366f1' : '#0097A9'
                        }`
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <div>
                            <span style={{ fontWeight: 600, color: '#0D2C54' }}>{item.user_name}</span>
                            <span style={{ color: '#94a3b8', marginLeft: '8px', fontSize: '13px' }}>{item.user_email}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              background: item.type === 'bug' ? '#fee2e2' : item.type === 'feature' ? '#e0e7ff' : '#e0f2fe',
                              color: item.type === 'bug' ? '#991b1b' : item.type === 'feature' ? '#4338ca' : '#0369a1'
                            }}>
                              {item.type}
                            </span>
                            <span style={{ fontSize: '13px', color: '#94a3b8' }}>{formatDate(item.created_at)}</span>
                          </div>
                        </div>
                        <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>{item.message}</p>
                        {item.rating && (
                          <div style={{ marginTop: '12px', display: 'flex', gap: '4px' }}>
                            {[1,2,3,4,5].map(star => (
                              <Star 
                                key={star} 
                                size={16} 
                                fill={star <= item.rating! ? '#f59e0b' : 'none'} 
                                color={star <= item.rating! ? '#f59e0b' : '#e2e8f0'} 
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '60px' }}>
                    <MessageSquare size={48} style={{ color: '#e2e8f0', marginBottom: '16px' }} />
                    <p style={{ color: '#64748b' }}>No feedback received yet</p>
                    <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px' }}>
                      Feedback from beta testers will appear here
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Back Button */}
        <button
          onClick={() => window.location.href = '/dashboard'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#64748b',
            cursor: 'pointer',
            marginTop: '32px'
          }}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default InsiderDashboard;
