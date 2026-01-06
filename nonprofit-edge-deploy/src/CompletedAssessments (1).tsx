/**
 * THE NONPROFIT EDGE - Completed Assessments Page
 * Shows all assessments the organization has completed
 * with scores, dates, and links to reports
 */

import React, { useState, useEffect } from 'react';

// ============================================
// COLORS
// ============================================
const COLORS = {
  navy: '#0D2C54',
  navyLight: '#1a4175',
  teal: '#0097A9',
  tealDark: '#007d8c',
  white: '#ffffff',
  gray50: '#f8fafc',
  gray100: '#f1f5f9',
  gray200: '#e2e8f0',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray900: '#111827',
  green500: '#22c55e',
  green100: '#dcfce7',
  orange500: '#f59e0b',
  orange100: '#fef3c7',
};

// ============================================
// TOOL DEFINITIONS
// ============================================
const TOOL_INFO: Record<string, { name: string; icon: string; description: string }> = {
  'board-assessment': {
    name: 'Board Assessment',
    icon: '👥',
    description: 'Board effectiveness and governance evaluation',
  },
  'strategic-plan': {
    name: 'Strategic Plan Check-Up',
    icon: '📋',
    description: 'Strategic plan health and progress assessment',
  },
  'ceo-evaluation': {
    name: 'CEO Evaluation',
    icon: '👔',
    description: 'Executive leadership evaluation framework',
  },
  'scenario-planner': {
    name: 'Scenario Planner',
    icon: '🔮',
    description: 'What-if analysis and future planning',
  },
  'grant-review': {
    name: 'Grant Review',
    icon: '💰',
    description: 'AI-powered grant application feedback',
  },
};

const ALL_TOOLS = Object.keys(TOOL_INFO);

// ============================================
// INTERFACES
// ============================================
interface CompletedAssessment {
  id: string;
  tool_id: string;
  completed_at: string;
  score: number | null;
  report_url: string | null;
  user_id: string;
  notes: string | null;
}

interface CompletedAssessmentsProps {
  user?: any;
  organization?: any;
  supabase?: any;
  navigate?: (path: string) => void;
}

// ============================================
// MAIN COMPONENT
// ============================================
const CompletedAssessments: React.FC<CompletedAssessmentsProps> = ({
  user,
  organization,
  supabase,
  navigate,
}) => {
  const [assessments, setAssessments] = useState<CompletedAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  // Fetch completed assessments
  useEffect(() => {
    const fetchAssessments = async () => {
      if (!supabase || !organization?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('completed_assessments')
          .select('*')
          .eq('organization_id', organization.id)
          .order('completed_at', { ascending: false });

        if (error) throw error;
        setAssessments(data || []);
      } catch (err) {
        console.error('Error fetching assessments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [supabase, organization?.id]);

  // Get completed tool IDs
  const completedToolIds = assessments.map(a => a.tool_id);
  const pendingTools = ALL_TOOLS.filter(id => !completedToolIds.includes(id));

  // Filter logic
  const getDisplayItems = () => {
    if (filter === 'completed') {
      return { completed: assessments, pending: [] };
    }
    if (filter === 'pending') {
      return { completed: [], pending: pendingTools };
    }
    return { completed: assessments, pending: pendingTools };
  };

  const { completed, pending } = getDisplayItems();

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get score color
  const getScoreColor = (score: number | null) => {
    if (score === null) return { bg: COLORS.gray100, text: COLORS.gray500 };
    if (score >= 80) return { bg: COLORS.green100, text: '#15803d' };
    if (score >= 60) return { bg: COLORS.orange100, text: '#b45309' };
    return { bg: '#fee2e2', text: '#b91c1c' };
  };

  // Navigate to tool
  const handleStartTool = (toolId: string) => {
    const webhooks: Record<string, string> = {
      'board-assessment': 'https://thenonprofitedge.app.n8n.cloud/webhook/board-assessment',
      'strategic-plan': 'https://thenonprofitedge.app.n8n.cloud/webhook/strategic-checkup',
      'ceo-evaluation': 'https://thenonprofitedge.app.n8n.cloud/webhook/ceo-evaluation',
      'scenario-planner': 'https://thenonprofitedge.app.n8n.cloud/webhook/scenario-planner',
      'grant-review': 'https://thenonprofitedge.app.n8n.cloud/webhook/grant-review',
    };

    const webhookUrl = webhooks[toolId];
    if (webhookUrl) {
      const url = new URL(webhookUrl);
      url.searchParams.append('org_id', organization?.id || '');
      url.searchParams.append('user_id', user?.id || '');
      url.searchParams.append('user_email', user?.email || '');
      window.open(url.toString(), '_blank');
    }
  };

  // Navigate back
  const handleBack = () => {
    if (navigate) navigate('/dashboard');
    else window.location.href = '/dashboard';
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={handleBack} style={styles.backButton}>
          ← Back to Dashboard
        </button>
        <div>
          <h1 style={styles.title}>Completed Assessments</h1>
          <p style={styles.subtitle}>
            Track your organization's assessment progress and view reports
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{assessments.length}</div>
          <div style={styles.statLabel}>Completed</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{pendingTools.length}</div>
          <div style={styles.statLabel}>Remaining</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {ALL_TOOLS.length > 0 
              ? Math.round((assessments.length / ALL_TOOLS.length) * 100) 
              : 0}%
          </div>
          <div style={styles.statLabel}>Progress</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={styles.progressContainer}>
        <div style={styles.progressLabel}>
          <span>Overall Progress</span>
          <span>{assessments.length} of {ALL_TOOLS.length} assessments</span>
        </div>
        <div style={styles.progressBar}>
          <div 
            style={{
              ...styles.progressFill,
              width: `${(assessments.length / ALL_TOOLS.length) * 100}%`,
            }} 
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={styles.filterTabs}>
        {(['all', 'completed', 'pending'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              ...styles.filterTab,
              ...(filter === tab ? styles.filterTabActive : {}),
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span style={styles.filterCount}>
              {tab === 'all' ? ALL_TOOLS.length : tab === 'completed' ? assessments.length : pendingTools.length}
            </span>
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div style={styles.loading}>
          <div style={styles.spinner} />
          Loading assessments...
        </div>
      )}

      {/* Completed Assessments */}
      {!loading && completed.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.checkIcon}>✓</span>
            Completed Assessments
          </h2>
          <div style={styles.assessmentGrid}>
            {completed.map(assessment => {
              const tool = TOOL_INFO[assessment.tool_id];
              const scoreColors = getScoreColor(assessment.score);
              
              return (
                <div key={assessment.id} style={styles.assessmentCard}>
                  <div style={styles.cardHeader}>
                    <span style={styles.toolIcon}>{tool?.icon || '📊'}</span>
                    <div style={styles.completedBadge}>
                      <span style={styles.completedDot} />
                      Completed
                    </div>
                  </div>
                  
                  <h3 style={styles.cardTitle}>{tool?.name || assessment.tool_id}</h3>
                  <p style={styles.cardDescription}>{tool?.description}</p>
                  
                  <div style={styles.cardMeta}>
                    <div style={styles.metaItem}>
                      <span style={styles.metaLabel}>Completed</span>
                      <span style={styles.metaValue}>{formatDate(assessment.completed_at)}</span>
                    </div>
                    
                    {assessment.score !== null && (
                      <div style={styles.metaItem}>
                        <span style={styles.metaLabel}>Score</span>
                        <span style={{
                          ...styles.scoreBadge,
                          background: scoreColors.bg,
                          color: scoreColors.text,
                        }}>
                          {assessment.score}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div style={styles.cardActions}>
                    {assessment.report_url && (
                      <a 
                        href={assessment.report_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={styles.viewReportBtn}
                      >
                        View Report →
                      </a>
                    )}
                    <button 
                      onClick={() => handleStartTool(assessment.tool_id)}
                      style={styles.retakeBtn}
                    >
                      Retake
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pending Assessments */}
      {!loading && pending.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.pendingIcon}>○</span>
            Not Yet Started
          </h2>
          <div style={styles.assessmentGrid}>
            {pending.map(toolId => {
              const tool = TOOL_INFO[toolId];
              
              return (
                <div key={toolId} style={{ ...styles.assessmentCard, ...styles.pendingCard }}>
                  <div style={styles.cardHeader}>
                    <span style={styles.toolIcon}>{tool?.icon || '📊'}</span>
                    <div style={styles.pendingBadge}>
                      Not Started
                    </div>
                  </div>
                  
                  <h3 style={styles.cardTitle}>{tool?.name || toolId}</h3>
                  <p style={styles.cardDescription}>{tool?.description}</p>
                  
                  <div style={styles.cardActions}>
                    <button 
                      onClick={() => handleStartTool(toolId)}
                      style={styles.startBtn}
                    >
                      Start Assessment →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && assessments.length === 0 && filter === 'completed' && (
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon}>📋</span>
          <h3 style={styles.emptyTitle}>No Completed Assessments Yet</h3>
          <p style={styles.emptyText}>
            Start your first assessment to begin building your organizational profile.
          </p>
          <button onClick={handleBack} style={styles.startFirstBtn}>
            Go to Dashboard →
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================
// STYLES
// ============================================
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: COLORS.gray50,
    padding: '32px 48px',
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  header: {
    marginBottom: '32px',
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 500,
    color: COLORS.teal,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    marginBottom: '16px',
    borderRadius: '8px',
    transition: 'background 0.15s',
  },
  title: {
    fontSize: '32px',
    fontWeight: 700,
    color: COLORS.navy,
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: COLORS.gray500,
  },

  // Stats
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginBottom: '32px',
    maxWidth: '600px',
  },
  statCard: {
    background: COLORS.white,
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    border: `1px solid ${COLORS.gray200}`,
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: 700,
    color: COLORS.navy,
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '14px',
    color: COLORS.gray500,
    fontWeight: 500,
  },

  // Progress
  progressContainer: {
    background: COLORS.white,
    borderRadius: '12px',
    padding: '20px 24px',
    marginBottom: '32px',
    border: `1px solid ${COLORS.gray200}`,
    maxWidth: '800px',
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    fontSize: '14px',
    fontWeight: 500,
    color: COLORS.gray700,
  },
  progressBar: {
    height: '12px',
    background: COLORS.gray100,
    borderRadius: '6px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: `linear-gradient(90deg, ${COLORS.teal}, ${COLORS.tealDark})`,
    borderRadius: '6px',
    transition: 'width 0.5s ease',
  },

  // Filter Tabs
  filterTabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '32px',
  },
  filterTab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 500,
    color: COLORS.gray600,
    background: COLORS.white,
    border: `1px solid ${COLORS.gray200}`,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  filterTabActive: {
    background: COLORS.navy,
    color: COLORS.white,
    borderColor: COLORS.navy,
  },
  filterCount: {
    fontSize: '12px',
    padding: '2px 8px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.2)',
  },

  // Loading
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '60px',
    color: COLORS.gray500,
    fontSize: '16px',
  },
  spinner: {
    width: '24px',
    height: '24px',
    border: `3px solid ${COLORS.gray200}`,
    borderTopColor: COLORS.teal,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },

  // Section
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '18px',
    fontWeight: 700,
    color: COLORS.navy,
    marginBottom: '20px',
  },
  checkIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    background: COLORS.green500,
    color: COLORS.white,
    borderRadius: '50%',
    fontSize: '14px',
  },
  pendingIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    border: `2px solid ${COLORS.gray400}`,
    borderRadius: '50%',
    fontSize: '14px',
  },

  // Assessment Grid
  assessmentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
  },
  assessmentCard: {
    background: COLORS.white,
    borderRadius: '14px',
    padding: '24px',
    border: `1px solid ${COLORS.gray200}`,
    transition: 'box-shadow 0.2s, transform 0.2s',
  },
  pendingCard: {
    borderStyle: 'dashed',
    background: COLORS.gray50,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  toolIcon: {
    fontSize: '32px',
  },
  completedBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: 600,
    color: COLORS.green500,
    background: COLORS.green100,
    padding: '4px 10px',
    borderRadius: '12px',
  },
  completedDot: {
    width: '6px',
    height: '6px',
    background: COLORS.green500,
    borderRadius: '50%',
  },
  pendingBadge: {
    fontSize: '12px',
    fontWeight: 500,
    color: COLORS.gray500,
    background: COLORS.gray100,
    padding: '4px 10px',
    borderRadius: '12px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 700,
    color: COLORS.navy,
    marginBottom: '8px',
  },
  cardDescription: {
    fontSize: '14px',
    color: COLORS.gray500,
    lineHeight: 1.5,
    marginBottom: '20px',
  },
  cardMeta: {
    display: 'flex',
    gap: '24px',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: `1px solid ${COLORS.gray100}`,
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  metaLabel: {
    fontSize: '12px',
    color: COLORS.gray400,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  metaValue: {
    fontSize: '14px',
    fontWeight: 600,
    color: COLORS.gray700,
  },
  scoreBadge: {
    display: 'inline-block',
    fontSize: '14px',
    fontWeight: 700,
    padding: '4px 10px',
    borderRadius: '6px',
  },
  cardActions: {
    display: 'flex',
    gap: '12px',
  },
  viewReportBtn: {
    flex: 1,
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: 600,
    color: COLORS.white,
    background: COLORS.teal,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center',
  },
  retakeBtn: {
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: 500,
    color: COLORS.gray600,
    background: COLORS.gray100,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  startBtn: {
    width: '100%',
    padding: '14px 24px',
    fontSize: '15px',
    fontWeight: 600,
    color: COLORS.white,
    background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.tealDark})`,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },

  // Empty State
  emptyState: {
    textAlign: 'center',
    padding: '80px 40px',
    background: COLORS.white,
    borderRadius: '16px',
    border: `1px solid ${COLORS.gray200}`,
    maxWidth: '500px',
    margin: '0 auto',
  },
  emptyIcon: {
    fontSize: '64px',
    display: 'block',
    marginBottom: '20px',
  },
  emptyTitle: {
    fontSize: '22px',
    fontWeight: 700,
    color: COLORS.navy,
    marginBottom: '12px',
  },
  emptyText: {
    fontSize: '15px',
    color: COLORS.gray500,
    marginBottom: '28px',
    lineHeight: 1.6,
  },
  startFirstBtn: {
    padding: '14px 32px',
    fontSize: '15px',
    fontWeight: 600,
    color: COLORS.white,
    background: COLORS.teal,
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
  },
};

export default CompletedAssessments;
