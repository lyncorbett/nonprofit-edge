/**
 * THE NONPROFIT EDGE - Playbooks Library Page
 * Book summaries and leadership guides for nonprofit executives
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
  orange: '#f59e0b',
  orangeLight: '#fef3c7',
  white: '#ffffff',
  gray50: '#f8fafc',
  gray100: '#f1f5f9',
  gray200: '#e2e8f0',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray900: '#111827',
};

// ============================================
// PLAYBOOK DATA
// ============================================
const CATEGORIES = [
  { id: 'all', name: 'All Playbooks', icon: '📚' },
  { id: 'leadership', name: 'Leadership', icon: '👔' },
  { id: 'strategy', name: 'Strategy', icon: '🎯' },
  { id: 'management', name: 'Management', icon: '📋' },
  { id: 'fundraising', name: 'Fundraising', icon: '💰' },
  { id: 'boards', name: 'Board Governance', icon: '👥' },
];

const PLAYBOOKS = [
  {
    id: '1',
    title: 'Good to Great and the Social Sectors',
    author: 'Jim Collins',
    description: 'Why business thinking is not the answer for nonprofits, and what great social sector organizations do differently.',
    category: 'strategy',
    readTime: '15 min',
    keyTakeaways: [
      'Greatness is not about being big—it\'s about impact relative to mission',
      'Replace the profit motive with the "hedgehog concept"',
      'Build momentum through disciplined people, thought, and action',
    ],
    featured: true,
    coverColor: '#1e3a5f',
  },
  {
    id: '2',
    title: 'The ONE Thing',
    author: 'Gary Keller',
    description: 'The surprisingly simple truth behind extraordinary results. Focus on the single most important thing.',
    category: 'leadership',
    readTime: '12 min',
    keyTakeaways: [
      'Ask: What\'s the ONE thing I can do that makes everything else easier?',
      'Multitasking is a lie—sequential focus beats simultaneous attempts',
      'Time block your ONE thing before anything else',
    ],
    featured: true,
    coverColor: '#b91c1c',
  },
  {
    id: '3',
    title: 'Governance as Leadership',
    author: 'Chait, Ryan & Taylor',
    description: 'Reframing the work of nonprofit boards beyond fiduciary duties to generative governance.',
    category: 'boards',
    readTime: '18 min',
    keyTakeaways: [
      'Move beyond fiduciary mode to generative thinking',
      'Boards should frame problems, not just solve them',
      'Create conditions for strategic leadership, not just oversight',
    ],
    featured: true,
    coverColor: '#0d9488',
  },
  {
    id: '4',
    title: 'The Goal',
    author: 'Eliyahu Goldratt',
    description: 'The foundational book on Theory of Constraints told as a gripping business novel.',
    category: 'management',
    readTime: '20 min',
    keyTakeaways: [
      'Every system has one constraint limiting throughput',
      'Optimizing non-constraints wastes resources',
      'Focus improvement efforts on the bottleneck',
    ],
    featured: true,
    coverColor: '#7c3aed',
  },
  {
    id: '5',
    title: 'Forces for Good',
    author: 'Crutchfield & Grant',
    description: 'What makes high-impact nonprofits different? Six practices of highly effective organizations.',
    category: 'strategy',
    readTime: '16 min',
    keyTakeaways: [
      'Advocate and serve simultaneously',
      'Build nonprofit networks, not just your organization',
      'Share leadership and credit generously',
    ],
    featured: false,
    coverColor: '#059669',
  },
  {
    id: '6',
    title: 'Managing the Nonprofit Organization',
    author: 'Peter Drucker',
    description: 'Timeless principles for nonprofit leadership from the father of modern management.',
    category: 'management',
    readTime: '14 min',
    keyTakeaways: [
      'Mission comes first—everything else follows',
      'Nonprofits need management more than businesses do',
      'Focus on results outside the organization',
    ],
    featured: false,
    coverColor: '#0369a1',
  },
  {
    id: '7',
    title: 'Start with Why',
    author: 'Simon Sinek',
    description: 'How great leaders inspire everyone to take action by starting with purpose.',
    category: 'leadership',
    readTime: '12 min',
    keyTakeaways: [
      'People don\'t buy what you do, they buy why you do it',
      'The Golden Circle: Why → How → What',
      'Inspire action through shared beliefs and values',
    ],
    featured: false,
    coverColor: '#ca8a04',
  },
  {
    id: '8',
    title: 'Nonprofit Sustainability',
    author: 'Bell, Masaoka & Zimmerman',
    description: 'Making strategic decisions for financial viability and mission impact.',
    category: 'strategy',
    readTime: '15 min',
    keyTakeaways: [
      'Financial sustainability requires business model clarity',
      'Diversify revenue but focus on what you do best',
      'Build reserves strategically, not just opportunistically',
    ],
    featured: false,
    coverColor: '#be185d',
  },
  {
    id: '9',
    title: 'The Fundraising Bible',
    author: 'Amy Eisenstein',
    description: 'A comprehensive guide to raising major gifts and building donor relationships.',
    category: 'fundraising',
    readTime: '18 min',
    keyTakeaways: [
      'Major gifts come from relationships, not transactions',
      'Ask for specific amounts for specific purposes',
      'Follow up is where most fundraisers fail',
    ],
    featured: false,
    coverColor: '#dc2626',
  },
  {
    id: '10',
    title: 'Built to Last',
    author: 'Collins & Porras',
    description: 'Successful habits of visionary companies that apply to enduring nonprofits.',
    category: 'strategy',
    readTime: '17 min',
    keyTakeaways: [
      'Preserve the core, stimulate progress',
      'Build the organization, not just programs',
      'Set BHAGs (Big Hairy Audacious Goals)',
    ],
    featured: false,
    coverColor: '#4f46e5',
  },
  {
    id: '11',
    title: 'The Effective Executive',
    author: 'Peter Drucker',
    description: 'The definitive guide to getting the right things done in leadership roles.',
    category: 'leadership',
    readTime: '13 min',
    keyTakeaways: [
      'Effectiveness can be learned',
      'Know where your time goes',
      'Focus on contribution, not effort',
    ],
    featured: false,
    coverColor: '#0891b2',
  },
  {
    id: '12',
    title: 'BoardSource Handbook',
    author: 'BoardSource',
    description: 'Essential guide to nonprofit board service and governance best practices.',
    category: 'boards',
    readTime: '20 min',
    keyTakeaways: [
      'The board\'s primary role is to ensure mission fulfillment',
      'Board development is an ongoing process',
      'Assessment and reflection improve governance',
    ],
    featured: false,
    coverColor: '#475569',
  },
];

// ============================================
// INTERFACES
// ============================================
interface PlaybooksProps {
  user?: any;
  organization?: any;
  supabase?: any;
  navigate?: (path: string) => void;
}

// ============================================
// MAIN COMPONENT
// ============================================
const Playbooks: React.FC<PlaybooksProps> = ({ user, organization, supabase, navigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPlaybook, setExpandedPlaybook] = useState<string | null>(null);

  // Filter playbooks
  const filteredPlaybooks = PLAYBOOKS.filter(playbook => {
    const matchesCategory = selectedCategory === 'all' || playbook.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      playbook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playbook.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playbook.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Featured playbooks
  const featuredPlaybooks = PLAYBOOKS.filter(p => p.featured);

  // Handle read
  const handleRead = async (playbook: typeof PLAYBOOKS[0]) => {
    // Log activity
    if (supabase && organization?.id) {
      try {
        await supabase.from('activity_log').insert({
          organization_id: organization.id,
          user_id: user?.id,
          type: 'playbook_read',
          description: `Read playbook: ${playbook.title}`,
        });
      } catch (err) {
        console.error('Activity log error:', err);
      }
    }

    // In production, this would open the full playbook
    setExpandedPlaybook(expandedPlaybook === playbook.id ? null : playbook.id);
  };

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
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.title}>Playbooks</h1>
            <p style={styles.subtitle}>
              Book summaries and leadership guides for nonprofit executives
            </p>
          </div>
          <div style={styles.headerStats}>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{PLAYBOOKS.length}</span>
              <span style={styles.statLabel}>Playbooks</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>~4hrs</span>
              <span style={styles.statLabel}>Total Read Time</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div style={styles.filterBar}>
        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search playbooks by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.categoryTabs}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                ...styles.categoryTab,
                ...(selectedCategory === cat.id ? styles.categoryTabActive : {}),
              }}
            >
              <span style={styles.categoryIcon}>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Section */}
      {selectedCategory === 'all' && searchQuery === '' && (
        <div style={styles.featuredSection}>
          <h2 style={styles.sectionTitle}>📘 Essential Reading</h2>
          <p style={styles.sectionSubtitle}>Start with these foundational texts for nonprofit leadership</p>
          <div style={styles.featuredGrid}>
            {featuredPlaybooks.map(playbook => (
              <div 
                key={playbook.id} 
                style={styles.featuredCard}
                onClick={() => handleRead(playbook)}
              >
                <div style={{ ...styles.bookCover, background: playbook.coverColor }}>
                  <span style={styles.bookTitle}>{playbook.title}</span>
                  <span style={styles.bookAuthor}>{playbook.author}</span>
                </div>
                <div style={styles.featuredContent}>
                  <div style={styles.readTime}>
                    <span style={styles.clockIcon}>⏱</span>
                    {playbook.readTime} read
                  </div>
                  <p style={styles.featuredDesc}>{playbook.description}</p>
                  <button style={styles.readBtn}>Read Summary →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Playbooks */}
      <div style={styles.playbooksSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'All Playbooks' : CATEGORIES.find(c => c.id === selectedCategory)?.name}
          </h2>
          <span style={styles.resultCount}>{filteredPlaybooks.length} playbooks</span>
        </div>

        {filteredPlaybooks.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>📚</span>
            <h3 style={styles.emptyTitle}>No playbooks found</h3>
            <p style={styles.emptyText}>Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div style={styles.playbooksGrid}>
            {filteredPlaybooks.map(playbook => (
              <div key={playbook.id} style={styles.playbookCard}>
                <div style={styles.cardTop}>
                  <div style={{ ...styles.miniCover, background: playbook.coverColor }}>
                    📖
                  </div>
                  <div style={styles.cardInfo}>
                    <span style={styles.categoryBadge}>
                      {CATEGORIES.find(c => c.id === playbook.category)?.icon} {playbook.category}
                    </span>
                    <h3 style={styles.cardTitle}>{playbook.title}</h3>
                    <p style={styles.cardAuthor}>by {playbook.author}</p>
                  </div>
                </div>
                
                <p style={styles.cardDescription}>{playbook.description}</p>
                
                {expandedPlaybook === playbook.id && (
                  <div style={styles.takeawaysSection}>
                    <h4 style={styles.takeawaysTitle}>Key Takeaways:</h4>
                    <ul style={styles.takeawaysList}>
                      {playbook.keyTakeaways.map((takeaway, i) => (
                        <li key={i} style={styles.takeawayItem}>
                          <span style={styles.takeawayBullet}>💡</span>
                          {takeaway}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div style={styles.cardFooter}>
                  <span style={styles.readTimeSmall}>
                    <span style={styles.clockIcon}>⏱</span>
                    {playbook.readTime}
                  </span>
                  <button 
                    onClick={() => handleRead(playbook)}
                    style={styles.readBtnSmall}
                  >
                    {expandedPlaybook === playbook.id ? 'Show Less' : 'Read Summary'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reading Path */}
      <div style={styles.pathSection}>
        <div style={styles.pathContent}>
          <h3 style={styles.pathTitle}>📚 Suggested Reading Path</h3>
          <p style={styles.pathText}>
            New to nonprofit leadership? Start with these in order:
          </p>
          <div style={styles.pathSteps}>
            <div style={styles.pathStep}>
              <span style={styles.pathNumber}>1</span>
              <span>Start with Why</span>
            </div>
            <span style={styles.pathArrow}>→</span>
            <div style={styles.pathStep}>
              <span style={styles.pathNumber}>2</span>
              <span>Good to Great (Social Sectors)</span>
            </div>
            <span style={styles.pathArrow}>→</span>
            <div style={styles.pathStep}>
              <span style={styles.pathNumber}>3</span>
              <span>The ONE Thing</span>
            </div>
            <span style={styles.pathArrow}>→</span>
            <div style={styles.pathStep}>
              <span style={styles.pathNumber}>4</span>
              <span>Governance as Leadership</span>
            </div>
          </div>
        </div>
      </div>
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
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  header: {
    background: COLORS.white,
    borderBottom: `1px solid ${COLORS.gray200}`,
    padding: '24px 48px',
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
    borderRadius: '8px',
    marginBottom: '16px',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
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
  headerStats: {
    display: 'flex',
    gap: '32px',
  },
  statItem: {
    textAlign: 'center',
  },
  statNumber: {
    display: 'block',
    fontSize: '28px',
    fontWeight: 700,
    color: COLORS.navy,
  },
  statLabel: {
    fontSize: '13px',
    color: COLORS.gray500,
  },

  // Filter Bar
  filterBar: {
    background: COLORS.white,
    borderBottom: `1px solid ${COLORS.gray200}`,
    padding: '20px 48px',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: COLORS.gray50,
    borderRadius: '10px',
    padding: '12px 16px',
    marginBottom: '16px',
    maxWidth: '400px',
  },
  searchIcon: {
    fontSize: '18px',
    opacity: 0.5,
  },
  searchInput: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    fontSize: '15px',
    color: COLORS.gray900,
    outline: 'none',
  },
  categoryTabs: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  categoryTab: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: 500,
    color: COLORS.gray600,
    background: COLORS.gray50,
    border: `1px solid ${COLORS.gray200}`,
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  categoryTabActive: {
    background: COLORS.orange,
    color: COLORS.white,
    borderColor: COLORS.orange,
  },
  categoryIcon: {
    fontSize: '14px',
  },

  // Featured Section
  featuredSection: {
    padding: '40px 48px',
    background: COLORS.orangeLight,
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: 700,
    color: COLORS.navy,
    marginBottom: '8px',
  },
  sectionSubtitle: {
    fontSize: '15px',
    color: COLORS.gray600,
    marginBottom: '24px',
  },
  featuredGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
  featuredCard: {
    background: COLORS.white,
    borderRadius: '16px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: `1px solid ${COLORS.gray200}`,
  },
  bookCover: {
    padding: '32px 24px',
    color: COLORS.white,
    minHeight: '140px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  bookTitle: {
    fontSize: '18px',
    fontWeight: 700,
    lineHeight: 1.3,
    marginBottom: '4px',
  },
  bookAuthor: {
    fontSize: '13px',
    opacity: 0.8,
  },
  featuredContent: {
    padding: '20px 24px',
  },
  readTime: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: COLORS.gray500,
    marginBottom: '12px',
  },
  clockIcon: {
    fontSize: '14px',
  },
  featuredDesc: {
    fontSize: '14px',
    color: COLORS.gray600,
    lineHeight: 1.5,
    marginBottom: '16px',
  },
  readBtn: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    fontWeight: 600,
    color: COLORS.white,
    background: COLORS.orange,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },

  // Playbooks Section
  playbooksSection: {
    padding: '40px 48px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  resultCount: {
    fontSize: '14px',
    color: COLORS.gray500,
  },
  playbooksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
  },
  playbookCard: {
    background: COLORS.white,
    borderRadius: '14px',
    padding: '24px',
    border: `1px solid ${COLORS.gray200}`,
  },
  cardTop: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
  },
  miniCover: {
    width: '60px',
    height: '80px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    flexShrink: 0,
  },
  cardInfo: {
    flex: 1,
  },
  categoryBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    color: COLORS.gray500,
    background: COLORS.gray100,
    padding: '3px 10px',
    borderRadius: '10px',
    marginBottom: '8px',
    textTransform: 'capitalize',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: COLORS.navy,
    lineHeight: 1.3,
    marginBottom: '4px',
  },
  cardAuthor: {
    fontSize: '13px',
    color: COLORS.gray500,
  },
  cardDescription: {
    fontSize: '14px',
    color: COLORS.gray600,
    lineHeight: 1.5,
    marginBottom: '16px',
  },
  takeawaysSection: {
    background: COLORS.gray50,
    borderRadius: '10px',
    padding: '16px',
    marginBottom: '16px',
  },
  takeawaysTitle: {
    fontSize: '13px',
    fontWeight: 700,
    color: COLORS.navy,
    marginBottom: '12px',
  },
  takeawaysList: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  takeawayItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    fontSize: '13px',
    color: COLORS.gray700,
    marginBottom: '10px',
    lineHeight: 1.5,
  },
  takeawayBullet: {
    flexShrink: 0,
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: `1px solid ${COLORS.gray100}`,
  },
  readTimeSmall: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: COLORS.gray500,
  },
  readBtnSmall: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 600,
    color: COLORS.white,
    background: COLORS.orange,
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
  },
  emptyIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: COLORS.navy,
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '15px',
    color: COLORS.gray500,
  },

  // Reading Path Section
  pathSection: {
    padding: '40px 48px 60px',
  },
  pathContent: {
    background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyLight})`,
    borderRadius: '16px',
    padding: '40px',
    textAlign: 'center',
  },
  pathTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: COLORS.white,
    marginBottom: '12px',
  },
  pathText: {
    fontSize: '15px',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: '32px',
  },
  pathSteps: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  pathStep: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(255,255,255,0.1)',
    padding: '12px 20px',
    borderRadius: '10px',
    color: COLORS.white,
    fontSize: '14px',
    fontWeight: 500,
  },
  pathNumber: {
    width: '24px',
    height: '24px',
    background: COLORS.teal,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 700,
  },
  pathArrow: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '20px',
  },
};

export default Playbooks;
