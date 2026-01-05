/**
 * Sidebar Component for The Nonprofit Edge
 * Uses React Router's useNavigate for navigation
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// ============================================
// CONSTANTS
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
};

// ============================================
// LOGO COMPONENT
// ============================================

const Logo = () => (
  <svg viewBox="0 0 1024 768" style={{ height: '200px', width: 'auto' }}>
    <style>{`.st0{fill:#0D2C54;}.st1{fill:#0097A9;}`}</style>
    <g>
      <g>
        <path className="st0" d="M438.46,469.14c-18.16,14.03-40.93,22.38-65.64,22.38c-30.79,0-58.55-12.94-78.16-33.69 c2.85,0.46,5.7,0.81,8.57,1.06c9.13,0.79,17.9,0.49,26.26-0.63c12.72,7.44,27.53,11.71,43.33,11.71 c17.17,0,33.17-5.03,46.59-13.71C422.94,460.11,428.93,465.14,438.46,469.14z"/>
        <path className="st0" d="M294.86,420.29c-8.64,2.53-16.05,3.61-21.74,4.02c-5.05-12.44-7.82-26.05-7.82-40.31 c0-59.37,48.14-107.52,107.52-107.52c25.62,0,49.15,8.96,67.62,23.94c-9.33,2.92-16.19,7.85-20.47,11.69 c-13.54-8.9-29.74-14.08-47.15-14.08c-47.48,0-85.97,38.49-85.97,85.97C286.85,396.97,289.72,409.27,294.86,420.29z"/>
        <path className="st1" d="M258.67,434.74c0,0,61.28,14.58,121.38-60.61l-18.3-13.11l72.86-22.42l0.39,71.06l-18.78-13.01 C416.22,396.64,340.29,479.82,258.67,434.74z"/>
      </g>
      <g>
        <g>
          <path className="st0" d="M491.43,298.55v7.98h-9.88v32.91h-9.08v-32.91h-9.88v-7.98H491.43z"/>
          <path className="st0" d="M528.3,298.55v40.89h-9.08V322.6h-14.13v16.83H496v-40.89h9.08v16.02h14.13v-16.02H528.3z"/>
          <path className="st0" d="M543.91,306.53v8.27h12.17v7.69h-12.17v8.97h13.76v7.98h-22.84v-40.89h22.84v7.98H543.91z"/>
        </g>
        <g>
          <path className="st1" d="M495.94,392.68h-9.08l-15.19-25.22v25.22h-9.08v-40.89h9.08l15.19,25.34v-25.34h9.08V392.68z"/>
          <path className="st1" d="M510.53,390.41c-2.92-1.79-5.24-4.28-6.96-7.48c-1.72-3.2-2.58-6.8-2.58-10.8c0-4,0.86-7.59,2.58-10.78 c1.72-3.18,4.04-5.67,6.96-7.46c2.92-1.79,6.14-2.68,9.64-2.68c3.51,0,6.72,0.89,9.64,2.68c2.92,1.79,5.22,4.27,6.91,7.46 c1.68,3.18,2.52,6.78,2.52,10.78c0,4-0.85,7.6-2.55,10.8c-1.7,3.2-4,5.7-6.91,7.48c-2.9,1.79-6.11,2.68-9.62,2.68 C516.66,393.09,513.45,392.19,510.53,390.41z M527.31,380.74c1.79-2.17,2.68-5.05,2.68-8.62c0-3.61-0.89-6.49-2.68-8.65 c-1.79-2.15-4.17-3.23-7.15-3.23c-3.01,0-5.41,1.07-7.2,3.2c-1.79,2.14-2.68,5.03-2.68,8.68c0,3.61,0.89,6.49,2.68,8.65 c1.79,2.16,4.19,3.23,7.2,3.23C523.14,384,525.52,382.91,527.31,380.74z"/>
          <path className="st1" d="M577.65,392.68h-9.08l-15.19-25.22v25.22h-9.08v-40.89h9.08l15.19,25.34v-25.34h9.08V392.68z"/>
          <path className="st1" d="M611.17,371.45c-0.99,1.96-2.52,3.54-4.57,4.75c-2.05,1.2-4.6,1.81-7.65,1.81h-5.63v14.68h-9.08v-40.89 h14.72c2.98,0,5.49,0.56,7.54,1.69c2.05,1.13,3.59,2.68,4.62,4.66c1.03,1.98,1.54,4.25,1.54,6.81 C612.66,367.32,612.16,369.49,611.17,371.45z M602.14,368.74c0.85-0.89,1.27-2.16,1.27-3.79c0-1.63-0.42-2.89-1.27-3.79 c-0.85-0.89-2.14-1.34-3.88-1.34h-4.94v10.25h4.94C599.99,370.08,601.29,369.63,602.14,368.74z"/>
          <path className="st1" d="M636.4,392.68l-7.76-15.43h-2.18v15.43h-9.08v-40.89h15.25c2.94,0,5.45,0.56,7.52,1.69 c2.07,1.13,3.62,2.67,4.65,4.63c1.03,1.96,1.54,4.15,1.54,6.55c0,2.72-0.7,5.15-2.1,7.28c-1.4,2.14-3.46,3.65-6.19,4.54 l8.61,16.19H636.4z M626.47,370.2h5.63c1.66,0,2.91-0.45,3.75-1.34c0.83-0.89,1.25-2.16,1.25-3.79c0-1.55-0.42-2.78-1.25-3.67 c-0.83-0.89-2.08-1.34-3.75-1.34h-5.63V370.2z"/>
          <path className="st1" d="M660.02,390.41c-2.92-1.79-5.24-4.28-6.96-7.48c-1.72-3.2-2.58-6.8-2.58-10.8c0-4,0.86-7.59,2.58-10.78 c1.72-3.18,4.04-5.67,6.96-7.46c2.92-1.79,6.14-2.68,9.64-2.68c3.51,0,6.72,0.89,9.64,2.68c2.92,1.79,5.22,4.27,6.91,7.46 c1.68,3.18,2.52,6.78,2.52,10.78c0,4-0.85,7.6-2.55,10.8c-1.7,3.2-4,5.7-6.91,7.48c-2.9,1.79-6.11,2.68-9.62,2.68 C666.15,393.09,662.94,392.19,660.02,390.41z M676.8,380.74c1.79-2.17,2.68-5.05,2.68-8.62c0-3.61-0.89-6.49-2.68-8.65 c-1.79-2.15-4.17-3.23-7.15-3.23c-3.01,0-5.41,1.07-7.2,3.2c-1.79,2.14-2.68,5.03-2.68,8.68c0,3.61,0.89,6.49,2.68,8.65 c1.79,2.16,4.19,3.23,7.2,3.23C672.63,384,675.01,382.91,676.8,380.74z"/>
          <path className="st1" d="M718.05,351.79v7.98h-15.19v8.62h11.37v7.75h-11.37v16.54h-9.08v-40.89H718.05z"/>
          <path className="st1" d="M731.92,351.79v40.89h-9.08v-40.89H731.92z"/>
          <path className="st1" d="M765.33,351.79v7.98h-9.88v32.91h-9.08v-32.91h-9.88v-7.98H765.33z"/>
        </g>
        <g>
          <path className="st0" d="M476.97,418.87v13.1h19.27v12.18h-19.27v14.21h21.8v12.64h-36.19v-64.78h36.19v12.64H476.97z"/>
          <path className="st0" d="M546.58,410.29c4.66,2.71,8.26,6.51,10.82,11.4c2.55,4.89,3.83,10.54,3.83,16.93 c0,6.34-1.28,11.97-3.83,16.89c-2.55,4.92-6.17,8.74-10.86,11.44c-4.69,2.71-10.11,4.06-16.29,4.06h-22.14v-64.78h22.14 C536.48,406.23,541.92,407.58,546.58,410.29z M542.03,452.46c3.03-3.26,4.55-7.87,4.55-13.84c0-5.97-1.51-10.61-4.55-13.93 c-3.03-3.32-7.27-4.98-12.71-4.98h-6.82v37.65h6.82C534.77,457.35,539,455.72,542.03,452.46z"/>
          <path className="st0" d="M608.53,426.71c-1.07-2.15-2.6-3.8-4.59-4.94c-1.99-1.14-4.33-1.71-7.03-1.71c-4.66,0-8.39,1.68-11.19,5.03 c-2.81,3.35-4.21,7.83-4.21,13.43c0,5.97,1.47,10.63,4.42,13.98c2.95,3.35,7,5.03,12.16,5.03c3.54,0,6.52-0.98,8.96-2.95 c2.44-1.97,4.22-4.8,5.34-8.49h-18.26v-11.63h31.31v14.67c-1.07,3.94-2.88,7.6-5.43,10.98c-2.55,3.38-5.79,6.12-9.72,8.21 c-3.93,2.09-8.36,3.14-13.3,3.14c-5.84,0-11.04-1.4-15.61-4.2c-4.57-2.8-8.14-6.69-10.69-11.67c-2.55-4.98-3.83-10.67-3.83-17.07 c0-6.4,1.28-12.1,3.83-17.12c2.55-5.01,6.1-8.92,10.65-11.72c4.55-2.8,9.73-4.2,15.57-4.2c7.07,0,13.03,1.88,17.89,5.63 c4.85,3.75,8.07,8.95,9.64,15.6H608.53z"/>
          <path className="st0" d="M647.83,418.87v13.1h19.27v12.18h-19.27v14.21h21.8v12.64h-36.19v-64.78h36.19v12.64H647.83z"/>
        </g>
      </g>
    </g>
  </svg>
);

// ============================================
// STYLES
// ============================================

const styles = {
  sidebar: {
    width: '280px',
    background: COLORS.white,
    borderRight: `1px solid ${COLORS.gray200}`,
    position: 'fixed' as const,
    height: '100vh',
    overflowY: 'auto' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    zIndex: 100,
  },
  sidebarLogo: {
    padding: '4px 8px',
    borderBottom: `1px solid ${COLORS.gray200}`,
    display: 'flex',
    justifyContent: 'center',
  },
  sidebarSection: {
    padding: '20px',
    borderBottom: `1px solid ${COLORS.gray200}`,
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: 800,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.8px',
    color: COLORS.navy,
    marginBottom: '16px',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 14px',
    fontSize: '14px',
    fontWeight: 500,
    color: COLORS.gray600,
    textDecoration: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '4px',
    transition: 'all 0.15s ease',
    border: 'none',
    background: 'transparent',
    width: '100%',
    textAlign: 'left' as const,
  },
  navLinkActive: {
    background: COLORS.gray100,
    color: COLORS.navy,
    fontWeight: 600,
  },
  tocLink: {
    background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyLight} 100%)`,
    color: COLORS.white,
    fontWeight: 500,
    padding: '8px 14px',
    marginBottom: '4px',
    fontSize: '14px',
    textAlign: 'center' as const,
    justifyContent: 'center',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    width: '100%',
  },
  navLinkIcon: {
    fontSize: '16px',
    width: '20px',
    textAlign: 'center' as const,
  },
  activityItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '10px 0',
    borderBottom: `1px solid ${COLORS.gray100}`,
  },
  activityDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    marginTop: '5px',
    flexShrink: 0,
  },
  activityText: {
    fontSize: '13px',
    color: COLORS.gray700,
    lineHeight: 1.4,
    fontWeight: 500,
  },
  activityTime: {
    fontSize: '11px',
    color: COLORS.gray400,
    marginTop: '2px',
  },
  downloadsBox: {
    background: `linear-gradient(135deg, ${COLORS.teal} 0%, ${COLORS.tealDark} 100%)`,
    borderRadius: '10px',
    padding: '14px',
  },
  downloadsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  downloadsLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: COLORS.white,
  },
  downloadsCount: {
    fontSize: '13px',
    fontWeight: 700,
    color: COLORS.white,
  },
  progressBar: {
    height: '8px',
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '4px',
    overflow: 'hidden' as const,
  },
  progressFill: {
    height: '100%',
    background: COLORS.white,
    borderRadius: '4px',
  },
  tierInfo: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid rgba(255, 255, 255, 0.3)',
  },
  tierBadge: {
    display: 'inline-block',
    fontSize: '10px',
    fontWeight: 700,
    padding: '4px 10px',
    background: COLORS.white,
    color: COLORS.navy,
    borderRadius: '4px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  tierLimits: {
    marginTop: '8px',
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 1.5,
  },
  userProfile: {
    padding: '16px 20px',
    borderTop: `1px solid ${COLORS.gray200}`,
    marginTop: 'auto',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyLight})`,
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.white,
    fontWeight: 700,
    fontSize: '16px',
  },
  userName: {
    fontSize: '14px',
    fontWeight: 600,
    color: COLORS.gray900,
  },
  userOrg: {
    fontSize: '12px',
    color: COLORS.gray500,
  },
  ownerBadge: {
    fontSize: '9px',
    fontWeight: 800,
    padding: '4px 8px',
    background: COLORS.teal,
    color: COLORS.white,
    borderRadius: '4px',
  },
  signoutBtn: {
    width: '100%',
    padding: '8px',
    fontSize: '12px',
    fontWeight: 500,
    color: COLORS.gray500,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginTop: '8px',
    borderRadius: '6px',
  },
};

// ============================================
// TIER LIMITS
// ============================================

const TIER_LIMITS = {
  essential: { downloads: 10, atpSessions: 10, seats: 1 },
  professional: { downloads: 25, atpSessions: 50, seats: 5 },
  premium: { downloads: 100, atpSessions: Infinity, seats: 10 },
};

// ============================================
// COMPONENT
// ============================================

interface SidebarProps {
  user?: any;
  organization?: any;
  usageData?: {
    downloads_this_month: number;
    atp_sessions_this_month: number;
  };
  recentActivity?: Array<{
    id: string;
    text: string;
    time: string;
    color: string;
  }>;
  isOwner?: boolean;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  user,
  organization,
  usageData = { downloads_this_month: 7, atp_sessions_this_month: 5 },
  recentActivity = [
    { id: '1', text: 'Board Assessment started', time: 'Today', color: COLORS.teal },
    { id: '2', text: 'Strategic Plan completed', time: '3 days ago', color: '#16a34a' },
    { id: '3', text: 'Downloaded Board Self-Assessment', time: '5 days ago', color: '#8b5cf6' },
    { id: '4', text: 'Coaching session', time: '2 weeks ago', color: '#f59e0b' },
  ],
  isOwner = false,
  onLogout,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  // Get tier info
  const tierKey = (organization?.tier || 'professional').toLowerCase() as keyof typeof TIER_LIMITS;
  const limits = TIER_LIMITS[tierKey] || TIER_LIMITS.professional;
  const remainingDownloads = limits.downloads - usageData.downloads_this_month;
  const downloadPercentage = (remainingDownloads / limits.downloads) * 100;

  // Get user display info
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userInitial = userName.charAt(0).toUpperCase();
  const orgName = organization?.name || 'Organization';

  // Check if route is active
  const isActive = (path: string) => location.pathname === path;

  // Navigation handler
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // Logout handler
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      navigate('/login');
    }
  };

  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.sidebarLogo}>
        <Logo />
      </div>

      {/* Quick Actions */}
      <div style={styles.sidebarSection}>
        <div style={styles.sectionTitle}>Quick Actions</div>
        
        <button
          style={{
            ...styles.navLink,
            ...(isActive('/events') || hoveredNav === 'events' ? styles.navLinkActive : {}),
          }}
          onMouseEnter={() => setHoveredNav('events')}
          onMouseLeave={() => setHoveredNav(null)}
          onClick={() => handleNavigate('/events')}
        >
          <span style={styles.navLinkIcon}>📅</span>
          Events Calendar
        </button>

        <button
          style={{
            ...styles.navLink,
            ...(isActive('/completed-assessments') || hoveredNav === 'completed' ? styles.navLinkActive : {}),
          }}
          onMouseEnter={() => setHoveredNav('completed')}
          onMouseLeave={() => setHoveredNav(null)}
          onClick={() => handleNavigate('/completed-assessments')}
        >
          <span style={styles.navLinkIcon}>📊</span>
          Completed Assessments
        </button>

        <button
          style={styles.tocLink}
          onClick={() => handleNavigate('/theory-of-constraints')}
        >
          Theory of Constraints
        </button>
      </div>

      {/* Member Resources */}
      <div style={styles.sidebarSection}>
        <div style={styles.sectionTitle}>Member Resources</div>
        
        <button
          style={{
            ...styles.navLink,
            ...(isActive('/templates') || hoveredNav === 'templates' ? styles.navLinkActive : {}),
          }}
          onMouseEnter={() => setHoveredNav('templates')}
          onMouseLeave={() => setHoveredNav(null)}
          onClick={() => handleNavigate('/templates')}
        >
          <span style={styles.navLinkIcon}>📄</span>
          Templates
        </button>

        <button
          style={{
            ...styles.navLink,
            ...(isActive('/playbooks') || hoveredNav === 'playbooks' ? styles.navLinkActive : {}),
          }}
          onMouseEnter={() => setHoveredNav('playbooks')}
          onMouseLeave={() => setHoveredNav(null)}
          onClick={() => handleNavigate('/playbooks')}
        >
          <span style={styles.navLinkIcon}>📘</span>
          Playbooks
        </button>

        <button
          style={{
            ...styles.navLink,
            ...(isActive('/certifications') || hoveredNav === 'certifications' ? styles.navLinkActive : {}),
          }}
          onMouseEnter={() => setHoveredNav('certifications')}
          onMouseLeave={() => setHoveredNav(null)}
          onClick={() => handleNavigate('/certifications')}
        >
          <span style={styles.navLinkIcon}>🎓</span>
          Certifications
        </button>
      </div>

      {/* Recent Activity */}
      <div style={styles.sidebarSection}>
        <div style={styles.sectionTitle}>Recent Activity</div>
        {recentActivity.map((activity, index) => (
          <div
            key={activity.id}
            style={{
              ...styles.activityItem,
              borderBottom: index === recentActivity.length - 1 ? 'none' : styles.activityItem.borderBottom,
            }}
          >
            <div style={{ ...styles.activityDot, background: activity.color }} />
            <div>
              <div style={styles.activityText}>{activity.text}</div>
              <div style={styles.activityTime}>{activity.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Remaining Downloads */}
      <div style={styles.sidebarSection}>
        <div style={styles.downloadsBox}>
          <div style={styles.downloadsHeader}>
            <span style={styles.downloadsLabel}>Remaining Downloads</span>
            <span style={styles.downloadsCount}>{remainingDownloads} of {limits.downloads}</span>
          </div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${downloadPercentage}%` }} />
          </div>
          <div style={styles.tierInfo}>
            <span style={styles.tierBadge}>{tierKey.charAt(0).toUpperCase() + tierKey.slice(1)}</span>
            <div style={styles.tierLimits}>
              {limits.downloads} downloads/mo • {limits.atpSessions === Infinity ? 'Unlimited' : limits.atpSessions} ATP sessions • {limits.seats} team seats
            </div>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div style={styles.userProfile}>
        <div
          style={styles.userInfo}
          onClick={() => handleNavigate('/profile')}
        >
          <div style={styles.userAvatar}>{userInitial}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={styles.userName}>{userName}</div>
            <div style={styles.userOrg}>{orgName}</div>
          </div>
          {isOwner && <span style={styles.ownerBadge}>OWNER</span>}
        </div>
        <button style={styles.signoutBtn} onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
