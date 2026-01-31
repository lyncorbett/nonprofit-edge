// Stub components for App.tsx imports
// These are minimal implementations to prevent import errors

import React from 'react';

// EnhancedOwnerDashboard
export const EnhancedOwnerDashboard: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <h1>Owner Dashboard</h1>
    <p>Admin functionality coming soon.</p>
    <button onClick={() => onNavigate?.('dashboard')}>Back to Dashboard</button>
  </div>
);

// MarketingDashboard
export const MarketingDashboard: React.FC = () => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <h1>Marketing Dashboard</h1>
    <p>Marketing analytics coming soon.</p>
  </div>
);

// LinkManager
export const LinkManager: React.FC = () => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <h1>Link Manager</h1>
    <p>Link management coming soon.</p>
  </div>
);

// TeamAccessManager
export const TeamAccessManager: React.FC = () => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <h1>Team Access Manager</h1>
    <p>Team access management coming soon.</p>
  </div>
);

// ContentManager
export const ContentManager: React.FC = () => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <h1>Content Manager</h1>
    <p>Content management coming soon.</p>
  </div>
);

// AdminDashboard
export const AdminDashboard: React.FC = () => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <h1>Admin Dashboard</h1>
    <p>Admin functionality coming soon.</p>
  </div>
);

// PlatformOwnerDashboard
export const PlatformOwnerDashboard: React.FC = () => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <h1>Platform Owner Dashboard</h1>
    <p>Platform owner functionality coming soon.</p>
  </div>
);

// Sidebar
export const Sidebar: React.FC = () => null;

// ProductTour
export const ProductTour: React.FC = () => null;

// WelcomeModal
export const WelcomeModal: React.FC = () => null;

export default {
  EnhancedOwnerDashboard,
  MarketingDashboard,
  LinkManager,
  TeamAccessManager,
  ContentManager,
  AdminDashboard,
  PlatformOwnerDashboard,
  Sidebar,
  ProductTour,
  WelcomeModal,
};
