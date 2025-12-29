/**
 * SHARED SIDEBAR COMPONENT
 * Used by Dashboard, ResourceLibrary, EventsCalendar, etc.
 * Ensures consistent navigation across all pages
 */

import React, { useState, useEffect } from 'react';

const NAVY = '#1a365d';
const TEAL = '#00a0b0';
const TEAL_LIGHT = '#e6f7f9';

interface SidebarProps {
  user: {
    full_name: string;
    email: string;
  };
  organization?: {
    tier?: string;
  };
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  supabase?: any;
}

interface AdminAccess {
  isAdmin: boolean;
  isOwner: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  user,
  organization,
  currentPage,
  onNavigate,
  onLogout,
  supabase
}) => {
  const [adminAccess, setAdminAccess] = useState<AdminAccess>({ isAdmin: false, isOwner: false });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check admin access
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!supabase || !user?.email) return;

      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('role')
          .eq('email', user.email)
          .single();

        if (data && !error) {
          setAdminAccess({
            isAdmin: data.role === 'admin' || data.role === 'owner',
            isOwner: data.role === 'owner'
          });
        }
      } catch (err) {
        console.log('Not an admin user');
      }
    };

    checkAdminAccess();
  }, [supabase, user?.email]);

  const getTierInfo = () => {
    const tier = organization?.tier || 'professional';
    const tiers: Record<string, { name: string; color: string }> = {
      essential: { name: 'Essential', color: '#6b7280' },
      professional: { name: 'Professional', color: TEAL },
      premium: { name: 'Premium', color: '#8b5cf6' },
      enterprise: { name: 'Enterprise', color: '#f59e0b' }
    };
    return tiers[tier] || tiers.professional;
  };

  const tierInfo = getTierInfo();

  const handleNavigate = (page: string) => {
    setMobileMenuOpen(false);
    onNavigate(page);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'library', label: 'Resource Library' },
    { id: 'events', label: 'Events' },
    { id: 'team', label: 'Team' },
    { id: 'reports', label: 'My Reports' },
  ];

  const adminItems = [
    { id: 'content-manager', label: 'Content Manager', requiresOwner: false },
    { id: 'owner-dashboard', label: 'Platform Admin', requiresOwner: true },
    { id: 'enhanced-owner', label: 'Owner Dashboard', requiresOwner: true },
    { id: 'marketing', label: 'Marketing', requiresOwner: true },
    { id: 'link-manager', label: 'Link Manager', requiresOwner: true },
    { id: 'team-access', label: 'Team Access', requiresOwner: true },
  ];

  const NavLink = ({ id, label }: { id: string; label: string }) => {
    const isActive = currentPage === id;
    return (
      <a
        onClick={() => handleNavigate(id)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition ${
          isActive
            ? ''
            : 'text-gray-600 hover:bg-gray-50'
        }`}
        style={isActive ? { backgroundColor: TEAL_LIGHT, color: NAVY } : undefined}
      >
        {label}
      </a>
    );
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: NAVY }}
            >
              NE
            </div>
            <span className="font-bold text-sm" style={{ color: NAVY }}>
              The Nonprofit Edge
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-out Menu */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: NAVY }}
            >
              NE
            </div>
            <span className="font-bold text-sm" style={{ color: NAVY }}>
              The Nonprofit Edge
            </span>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.id} id={item.id} label={item.label} />
          ))}

          {(adminAccess.isAdmin || adminAccess.isOwner) && (
            <>
              <div className="pt-4 pb-2">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400 px-3">
                  Admin
                </div>
              </div>
              {adminItems
                .filter((item) => !item.requiresOwner || adminAccess.isOwner)
                .map((item) => (
                  <NavLink key={item.id} id={item.id} label={item.label} />
                ))}
            </>
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: TEAL }}
            >
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="font-semibold" style={{ color: NAVY }}>
                {user?.full_name || 'User'}
              </div>
              <div className="text-xs text-gray-400">{tierInfo.name}</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-52 bg-white border-r border-gray-200 fixed h-screen flex-col">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: NAVY }}
            >
              NE
            </div>
            <span className="font-bold text-sm" style={{ color: NAVY }}>
              The Nonprofit Edge
            </span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink key={item.id} id={item.id} label={item.label} />
          ))}

          {(adminAccess.isAdmin || adminAccess.isOwner) && (
            <>
              <div className="pt-4 pb-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3">
                  Admin
                </div>
              </div>
              {adminItems
                .filter((item) => !item.requiresOwner || adminAccess.isOwner)
                .map((item) => (
                  <NavLink key={item.id} id={item.id} label={item.label} />
                ))}
            </>
          )}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: TEAL }}
            >
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate" style={{ color: NAVY }}>
                {user?.full_name || 'User'}
              </div>
              <div className="text-[10px] text-gray-400">{tierInfo.name}</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="mt-3 w-full text-xs text-gray-500 hover:text-gray-700 py-1"
          >
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
