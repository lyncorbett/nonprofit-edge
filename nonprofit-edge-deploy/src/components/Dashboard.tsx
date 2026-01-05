/**
 * THE NONPROFIT EDGE - Dashboard Component
 * Version: Final for GitHub Deployment
 * 
 * Features:
 * - Large prominent logo
 * - Left sidebar with Quick Actions, Member Resources, Recent Activity
 * - Theory of Constraints link (centered, navy button)
 * - Remaining Downloads with teal background
 * - Tool cards with images (CEO Evaluation uses local image)
 * - Ask the Professor card (text + icon only, teal background)
 * - Daily insight quote with visible quotation mark
 * - Recommended For You section
 * - All tracking and counters connected to Supabase
 * - Tier-based limits enforcement
 * - Responsive max-widths to prevent stretching
 */

import React, { useState, useEffect } from 'react';

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================

const COLORS = {
  navy: '#0D2C54',
  navyLight: '#1a4175',
  teal: '#0097A9',
  tealDark: '#007d8c',
  tealLight: '#00b5c9',
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

const TIER_LIMITS = {
  essential: { downloads: 10, atpSessions: 10, seats: 1 },
  professional: { downloads: 25, atpSessions: 50, seats: 5 },
  premium: { downloads: 100, atpSessions: Infinity, seats: 10 },
};

const N8N_WEBHOOKS = {
  'board-assessment': 'https://thenonprofitedge.app.n8n.cloud/webhook/board-assessment',
  'strategic-checkup': 'https://thenonprofitedge.app.n8n.cloud/webhook/strategic-checkup',
  'ceo-evaluation': 'https://thenonprofitedge.app.n8n.cloud/webhook/ceo-evaluation',
  'scenario-planner': 'https://thenonprofitedge.app.n8n.cloud/webhook/scenario-planner',
  'grant-review': 'https://thenonprofitedge.app.n8n.cloud/webhook/grant-review',
  'ask-professor': 'https://thenonprofitedge.app.n8n.cloud/webhook/ask-professor',
};

const TOOLS = [
  {
    id: 'board-assessment',
    name: 'Board Assessment',
    status: 'Ready',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80',
    route: '/board-assessment',
    webhookKey: 'board-assessment',
  },
  {
    id: 'strategic-plan',
    name: 'Strategic Plan Check-Up',
    status: 'Ready',
    image: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=600&q=80',
    route: '/strategic-checkup',
    webhookKey: 'strategic-checkup',
  },
  {
    id: 'ceo-evaluation',
    name: 'CEO Evaluation',
    status: 'Ready',
    image: '/ceo-evaluation.jpg', // Local image from public folder
    route: '/ceo-evaluation',
    webhookKey: 'ceo-evaluation',
  },
  {
    id: 'scenario-planner',
    name: 'Scenario Planner',
    status: 'Ready',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    route: '/scenario-planner',
    webhookKey: 'scenario-planner',
  },
  {
    id: 'grant-review',
    name: 'Grant Review',
    status: 'Ready',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80',
    route: '/grant-review',
    webhookKey: 'grant-review',
  },
];

const RECOMMENDATIONS = [
  { type: 'template', title: 'Board Self-Assessment Survey', desc: 'Annual evaluation tool for board members' },
  { type: 'playbook', title: 'Good to Great (Social Sectors)', desc: 'Jim Collins on nonprofit excellence' },
  { type: 'template', title: 'Strategic Plan Template', desc: '3-year planning framework' },
  { type: 'playbook', title: 'The ONE Thing', desc: 'Focus methodology for leaders' },
];

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
  dashboard: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    background: COLORS.gray50,
  },

  // Sidebar
  sidebar: {
    width: '280px',
    background: COLORS.white,
    borderRight: `1px solid ${COLORS.gray200}`,
    position: 'fixed' as const,
    height: '100vh',
    overflowY: 'auto' as const,
    display: 'flex',
    flexDirection: 'column' as const,
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
  navLinkHover: {
    background: COLORS.gray100,
    color: COLORS.navy,
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

  // Activity
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

  // Downloads Box
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
    transition: 'width 0.3s ease',
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

  // User Profile
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
    transition: 'background 0.15s ease',
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
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userOrg: {
    fontSize: '12px',
    color: COLORS.gray500,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  ownerBadge: {
    fontSize: '9px',
    fontWeight: 800,
    padding: '4px 8px',
    background: COLORS.teal,
    color: COLORS.white,
    borderRadius: '4px',
    letterSpacing: '0.5px',
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
    transition: 'all 0.15s ease',
  },

  // Main Content
  mainContent: {
    flex: 1,
    marginLeft: '280px',
    padding: '28px 36px',
    maxWidth: '1200px',
  },
  welcomeHeader: {
    marginBottom: '24px',
  },
  welcomeTitle: {
    fontSize: '26px',
    fontWeight: 700,
    color: COLORS.navy,
    marginBottom: '4px',
  },
  welcomeSubtitle: {
    fontSize: '14px',
    color: COLORS.gray500,
  },

  // Quote
  insightQuote: {
    background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyLight} 100%)`,
    borderRadius: '14px',
    padding: '28px 32px 24px 32px',
    marginBottom: '28px',
    position: 'relative' as const,
    overflow: 'hidden',
    maxWidth: '900px',
  },
  quoteMark: {
    position: 'absolute' as const,
    top: '8px',
    left: '24px',
    fontSize: '80px',
    color: 'rgba(0, 151, 169, 0.3)',
    fontFamily: 'Georgia, serif',
    lineHeight: 1,
    zIndex: 0,
  },
  quoteText: {
    fontSize: '16px',
    fontStyle: 'italic' as const,
    color: COLORS.white,
    lineHeight: 1.6,
    marginBottom: '12px',
    marginLeft: '40px',
    position: 'relative' as const,
    zIndex: 1,
  },
  quoteAuthor: {
    fontSize: '13px',
    color: COLORS.teal,
    fontWeight: 500,
    position: 'relative' as const,
    zIndex: 1,
    textAlign: 'right' as const,
  },

  // Section Card
  sectionCard: {
    background: COLORS.white,
    border: `1px solid ${COLORS.gray200}`,
    borderRadius: '14px',
    overflow: 'hidden',
    marginBottom: '28px',
    maxWidth: '1000px',
  },
  sectionHeader: {
    padding: '16px 24px',
    borderBottom: `1px solid ${COLORS.gray200}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeaderTitle: {
    fontSize: '14px',
    fontWeight: 800,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    color: COLORS.navy,
  },
  sectionHeaderLink: {
    fontSize: '13px',
    fontWeight: 600,
    color: COLORS.teal,
    textDecoration: 'none',
    cursor: 'pointer',
  },
  sectionBody: {
    padding: '20px',
  },

  // Tools Grid
  toolsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(200px, 300px))',
    gap: '18px',
  },
  toolCard: {
    position: 'relative' as const,
    height: '130px',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  toolImage: {
    position: 'absolute' as const,
    inset: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'transform 0.3s ease',
  },
  toolOverlay: {
    position: 'absolute' as const,
    inset: 0,
    background: `linear-gradient(to top, rgba(13, 44, 84, 0.9) 0%, rgba(13, 44, 84, 0.4) 50%, rgba(13, 44, 84, 0.1) 100%)`,
  },
  toolContent: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    padding: '14px',
  },
  toolName: {
    color: COLORS.white,
    fontSize: '15px',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  toolStatus: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '12px',
    marginTop: '4px',
  },
  toolActiveDot: {
    position: 'absolute' as const,
    top: '10px',
    right: '10px',
    width: '10px',
    height: '10px',
    background: COLORS.teal,
    borderRadius: '50%',
    border: '2px solid white',
  },

  // Professor Card
  professorCard: {
    background: `linear-gradient(135deg, ${COLORS.teal} 0%, ${COLORS.tealDark} 100%)`,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    padding: '20px',
    height: '130px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  professorIcon: {
    fontSize: '36px',
    marginBottom: '10px',
  },
  professorTitle: {
    color: COLORS.white,
    fontSize: '18px',
    fontWeight: 800,
    lineHeight: 1.2,
  },

  // Recommendations
  recommendationsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(200px, 400px))',
    gap: '18px',
  },
  recCard: {
    background: COLORS.gray50,
    borderRadius: '12px',
    padding: '18px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    border: `1px solid ${COLORS.gray200}`,
  },
  recBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    padding: '5px 10px',
    borderRadius: '6px',
    marginBottom: '10px',
    letterSpacing: '0.3px',
  },
  recBadgeTemplate: {
    background: COLORS.teal,
    color: COLORS.white,
  },
  recBadgePlaybook: {
    background: '#f59e0b',
    color: COLORS.white,
  },
  recTitle: {
    fontSize: '15px',
    fontWeight: 700,
    color: COLORS.navy,
    marginBottom: '4px',
    lineHeight: 1.3,
  },
  recDesc: {
    fontSize: '13px',
    color: COLORS.gray500,
    lineHeight: 1.4,
  },
};

// ============================================
// MAIN COMPONENT
// ============================================

interface DashboardProps {
  user?: any;
  organization?: any;
  supabase?: any;
  navigate?: (path: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  organization,
  supabase,
  navigate,
}) => {
  // State
  const [usageData, setUsageData] = useState({
    downloads_this_month: 7,
    atp_sessions_this_month: 5,
    completed_assessments: 12,
  });
  const [recentActivity, setRecentActivity] = useState([
    { id: '1', text: 'Board Assessment started', time: 'Today', color: COLORS.teal },
    { id: '2', text: 'Strategic Plan completed', time: '3 days ago', color: '#16a34a' },
    { id: '3', text: 'Downloaded Board Self-Assessment', time: '5 days ago', color: '#8b5cf6' },
    { id: '4', text: 'Coaching session', time: '2 weeks ago', color: '#f59e0b' },
  ]);
  const [adminAccess, setAdminAccess] = useState({ isAdmin: false, isOwner: false });
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get tier info
  const tierKey = (organization?.tier || 'professional').toLowerCase() as keyof typeof TIER_LIMITS;
  const limits = TIER_LIMITS[tierKey] || TIER_LIMITS.professional;
  const remainingDownloads = limits.downloads - usageData.downloads_this_month;
  const downloadPercentage = (remainingDownloads / limits.downloads) * 100;

  // Get user display info
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userInitial = userName.charAt(0).toUpperCase();
  const userEmail = user?.email || 'user@example.com';
  const orgName = organization?.name || 'Organization';

  // Check admin access
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!supabase || !user?.email) return;
      try {
        const { data } = await supabase
          .from('platform_admins')
          .select('role')
          .eq('email', user.email.toLowerCase())
          .single();
        if (data) {
          setAdminAccess({ isAdmin: true, isOwner: data.role === 'owner' });
        }
      } catch (err) {
        console.log('Admin check:', err);
      }
    };
    checkAdminAccess();
  }, [supabase, user?.email]);

  // Fetch usage data
  useEffect(() => {
    const fetchUsageData = async () => {
      if (!supabase || !organization?.id) return;
      try {
        const { data } = await supabase
          .from('usage_tracking')
          .select('*')
          .eq('organization_id', organization.id)
          .single();
        if (data) {
          setUsageData({
            downloads_this_month: data.downloads_this_month || 0,
            atp_sessions_this_month: data.atp_sessions_this_month || 0,
            completed_assessments: data.completed_assessments || 0,
          });
        }
      } catch (err) {
        console.log('Usage fetch:', err);
      }
    };
    fetchUsageData();
  }, [supabase, organization?.id]);

  // Fetch recent activity
  useEffect(() => {
    const fetchRecentActivity = async () => {
      if (!supabase || !organization?.id) return;
      try {
        const { data } = await supabase
          .from('activity_log')
          .select('*')
          .eq('organization_id', organization.id)
          .order('created_at', { ascending: false })
          .limit(4);
        if (data && data.length > 0) {
          setRecentActivity(data.map((item: any) => ({
            id: item.id,
            text: item.description,
            time: formatTimeAgo(item.created_at),
            color: getActivityColor(item.type),
          })));
        }
      } catch (err) {
        console.log('Activity fetch:', err);
      }
    };
    fetchRecentActivity();
  }, [supabase, organization?.id]);

  // Helper functions
  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  const getActivityColor = (type: string) => {
    const colors: Record<string, string> = {
      tool_start: COLORS.teal,
      tool_complete: '#16a34a',
      download: '#8b5cf6',
      professor: '#f59e0b',
    };
    return colors[type] || COLORS.teal;
  };

  // Navigation handler
  const handleNavigate = (path: string) => {
    if (navigate) {
      navigate(path);
    } else {
      window.location.href = path;
    }
  };

  // Tool click handler
  const handleToolClick = async (tool: typeof TOOLS[0]) => {
    if (isLoading) return;
    setIsLoading(true);

    // Log activity
    if (supabase && organization?.id) {
      try {
        await supabase.from('activity_log').insert({
          organization_id: organization.id,
          user_id: user?.id,
          type: 'tool_start',
          description: `${tool.name} started`,
          tool_id: tool.id,
        });

        // Trigger n8n webhook
        if (tool.webhookKey && N8N_WEBHOOKS[tool.webhookKey]) {
          fetch(N8N_WEBHOOKS[tool.webhookKey], {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              organization_id: organization.id,
              user_id: user?.id,
              user_email: user?.email,
              tool: tool.id,
              timestamp: new Date().toISOString(),
            }),
          }).catch(console.error);
        }
      } catch (err) {
        console.error('Tool start error:', err);
      }
    }

    setTimeout(() => {
      setIsLoading(false);
      handleNavigate(tool.route);
    }, 300);
  };

  // Ask the Professor handler
  const handleAskProfessor = async () => {
    // Check limit
    if (limits.atpSessions !== Infinity && usageData.atp_sessions_this_month >= limits.atpSessions) {
      alert('You have reached your ATP session limit for this month. Please upgrade your plan.');
      return;
    }

    if (supabase && organization?.id) {
      try {
        // Increment session count
        await supabase.rpc('increment_atp_sessions', { org_id: organization.id });

        // Log activity
        await supabase.from('activity_log').insert({
          organization_id: organization.id,
          user_id: user?.id,
          type: 'professor',
          description: 'Ask the Professor session',
        });
      } catch (err) {
        console.error('ATP session error:', err);
      }
    }

    handleNavigate('/ask-professor');
  };

  // Download handler
  const handleDownload = async (resourceTitle: string) => {
    // Check limit
    if (usageData.downloads_this_month >= limits.downloads) {
      alert('You have reached your download limit for this month. Please upgrade your plan.');
      return;
    }

    if (supabase && organization?.id) {
      try {
        // Increment download count
        await supabase.rpc('increment_downloads', { org_id: organization.id });

        // Log activity
        await supabase.from('activity_log').insert({
          organization_id: organization.id,
          user_id: user?.id,
          type: 'download',
          description: `Downloaded ${resourceTitle}`,
        });

        // Update local state
        setUsageData(prev => ({
          ...prev,
          downloads_this_month: prev.downloads_this_month + 1,
        }));
      } catch (err) {
        console.error('Download error:', err);
      }
    }
  };

  // Logout handler
  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    handleNavigate('/login');
  };

  return (
    <div style={styles.dashboard}>
      {/* ==========================================
          LEFT SIDEBAR
          ========================================== */}
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
              ...(hoveredNav === 'events' ? styles.navLinkHover : {}),
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
              ...(hoveredNav === 'completed' ? styles.navLinkHover : {}),
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
              ...(hoveredNav === 'templates' ? styles.navLinkHover : {}),
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
              ...(hoveredNav === 'playbooks' ? styles.navLinkHover : {}),
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
              ...(hoveredNav === 'certifications' ? styles.navLinkHover : {}),
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
            {adminAccess.isOwner && (
              <span style={styles.ownerBadge}>OWNER</span>
            )}
          </div>
          <button style={styles.signoutBtn} onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ==========================================
          MAIN CONTENT
          ========================================== */}
      <main style={styles.mainContent}>
        {/* Welcome Header */}
        <div style={styles.welcomeHeader}>
          <h1 style={styles.welcomeTitle}>Welcome back, {userName}!</h1>
          <p style={styles.welcomeSubtitle}>Here's what's happening with your organization</p>
        </div>

        {/* Daily Insight Quote */}
        <div style={styles.insightQuote}>
          <span style={styles.quoteMark}>"</span>
          <p style={styles.quoteText}>
            "The job of a board member isn't to run the organization. It's to make sure the organization is well-run."
          </p>
          <p style={styles.quoteAuthor}>— Chait, Ryan & Taylor, "Governance as Leadership"</p>
        </div>

        {/* Your Tools */}
        <div style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionHeaderTitle}>Your Tools</span>
          </div>
          <div style={styles.sectionBody}>
            <div style={styles.toolsGrid}>
              {TOOLS.map((tool) => (
                <div
                  key={tool.id}
                  style={styles.toolCard}
                  onClick={() => handleToolClick(tool)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ ...styles.toolImage, backgroundImage: `url(${tool.image})` }} />
                  <div style={styles.toolOverlay} />
                  <div style={styles.toolContent}>
                    <div style={styles.toolName}>{tool.name}</div>
                    <div style={styles.toolStatus}>{tool.status}</div>
                  </div>
                  {tool.id === 'board-assessment' && <div style={styles.toolActiveDot} />}
                </div>
              ))}

              {/* Ask the Professor Card */}
              <div
                style={styles.professorCard}
                onClick={handleAskProfessor}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={styles.professorIcon}>🎓</div>
                <div style={styles.professorTitle}>Ask the Professor</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended For You */}
        <div style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionHeaderTitle}>Recommended For You</span>
            <span
              style={styles.sectionHeaderLink}
              onClick={() => handleNavigate('/templates')}
            >
              See all →
            </span>
          </div>
          <div style={styles.sectionBody}>
            <div style={styles.recommendationsGrid}>
              {RECOMMENDATIONS.map((rec, index) => (
                <div
                  key={index}
                  style={styles.recCard}
                  onClick={() => handleDownload(rec.title)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = COLORS.gray100;
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = COLORS.gray50;
                    e.currentTarget.style.borderColor = COLORS.gray200;
                  }}
                >
                  <span
                    style={{
                      ...styles.recBadge,
                      ...(rec.type === 'template' ? styles.recBadgeTemplate : styles.recBadgePlaybook),
                    }}
                  >
                    {rec.type === 'template' ? '📄 Template' : '📘 Playbook'}
                  </span>
                  <div style={styles.recTitle}>{rec.title}</div>
                  <div style={styles.recDesc}>{rec.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
