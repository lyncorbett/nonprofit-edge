import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  FolderOpen, User, Target, Settings, Home,
  Search, BookOpen, FileText, Bookmark, Award, Users, Presentation,
  ChevronRight, Clock, ArrowRight
} from 'lucide-react';

// Resource categories with their details
const RESOURCE_CATEGORIES = [
  {
    id: 'guides',
    name: 'Leadership Guides',
    description: 'In-depth guides on nonprofit leadership, from board governance to strategic decision-making.',
    count: 15,
    icon: BookOpen,
    color: '#0097A9',
    route: '/resources/guides'
  },
  {
    id: 'book-summaries',
    name: 'Book Summaries',
    description: 'Key insights from essential leadership and nonprofit books, distilled into actionable summaries.',
    count: 52,
    icon: Bookmark,
    color: '#f59e0b',
    route: '/resources/book-summaries'
  },
  {
    id: 'templates',
    name: 'Templates',
    description: 'Ready-to-use templates for strategic plans, board packets, evaluations, and more.',
    count: 147,
    icon: FileText,
    color: '#0D2C54',
    route: '/templates'
  },
  {
    id: 'playbooks',
    name: 'Playbooks',
    description: 'Step-by-step playbooks for common nonprofit challenges, from fundraising to succession planning.',
    count: 27,
    icon: Target,
    color: '#6366f1',
    route: '/resources/playbooks'
  },
  {
    id: 'certifications',
    name: 'Certifications',
    description: 'Earn credentials in DiSC, Five Behaviors, governance, consulting, and strategic leadership.',
    count: 5,
    icon: Award,
    color: '#10b981',
    route: '/certifications'
  },
  {
    id: 'facilitation-kits',
    name: 'Facilitation Kits',
    description: 'Complete kits for running board retreats, strategic planning sessions, and team workshops.',
    count: 20,
    icon: Presentation,
    color: '#ec4899',
    route: '/resources/facilitation-kits'
  },
];

// Mock recent items (would come from Supabase in production)
const RECENT_ITEMS = [
  { type: 'TEMPLATE', name: 'Board Member Expectations Agreement', time: '2 days ago', color: '#0D2C54' },
  { type: 'BOOK', name: 'Governance as Leadership', time: '3 days ago', color: '#f59e0b' },
  { type: 'GUIDE', name: 'CEO Succession Planning', time: '1 week ago', color: '#0097A9' },
  { type: 'PLAYBOOK', name: '90-Day Strategic Reset', time: '1 week ago', color: '#6366f1' },
];

const ResourceLibrary: React.FC = () => {
  const [userName, setUserName] = useState('there');
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const totalResources = RESOURCE_CATEGORIES.reduce((acc, cat) => acc + cat.count, 0);

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
          <img src="/logo.png" alt="The Nonprofit Edge" style={{ width: '220px', height: 'auto' }} />
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
          <NavLink href="/member-resources" icon={FolderOpen} active>Member Resources</NavLink>
          <NavLink href="/leadership-profile" icon={User}>My Leadership Profile</NavLink>
          <NavLink href="/constraint-report" icon={Target}>Our Constraint Report</NavLink>
        </nav>

        {/* Resource Categories */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '1.2px',
            color: '#94a3b8',
            marginBottom: '12px',
            fontWeight: 600
          }}>
            Resources
          </div>
          <ResourceNavLink href="/resources/guides" icon={BookOpen} count={15}>Leadership Guides</ResourceNavLink>
          <ResourceNavLink href="/resources/book-summaries" icon={Bookmark} count={52}>Book Summaries</ResourceNavLink>
          <ResourceNavLink href="/templates" icon={FileText} count={147}>Templates</ResourceNavLink>
          <ResourceNavLink href="/resources/playbooks" icon={Target} count={27}>Playbooks</ResourceNavLink>
          <ResourceNavLink href="/certifications" icon={Award} count={5}>Certifications</ResourceNavLink>
          <ResourceNavLink href="/resources/facilitation-kits" icon={Presentation} count={20}>Facilitation Kits</ResourceNavLink>
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
      }}>
        <div style={{ maxWidth: '1100px' }}>
          {/* Header */}
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0D2C54', marginBottom: '8px' }}>
              Resource Library
            </h1>
            <p style={{ color: '#64748b', fontSize: '16px', lineHeight: 1.6 }}>
              {totalResources}+ resources to help you lead with clarity, build stronger teams, and drive lasting impact.
            </p>
          </div>

          {/* Search Bar */}
          <div style={{ 
            position: 'relative', 
            marginBottom: '32px',
            maxWidth: '500px'
          }}>
            <Search size={20} style={{ 
              position: 'absolute', 
              left: '16px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#94a3b8' 
            }} />
            <input
              type="text"
              placeholder="Search templates, guides, playbooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 14px 14px 48px',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '15px',
                background: 'white',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#0097A9'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Resource Categories Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '20px',
            marginBottom: '40px'
          }}>
            {RESOURCE_CATEGORIES.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>

          {/* Recently Accessed */}
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0D2C54', margin: 0 }}>
                Recently Accessed
              </h2>
              <a href="/resources/history" style={{
                fontSize: '14px',
                color: '#0097A9',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 500
              }}>
                View history <ArrowRight size={16} />
              </a>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '16px' 
            }}>
              {RECENT_ITEMS.map((item, index) => (
                <RecentCard key={index} item={item} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Category Card Component
interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    description: string;
    count: number;
    icon: React.ElementType;
    color: string;
    route: string;
  };
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const Icon = category.icon;
  
  return (
    <a
      href={category.route}
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #e2e8f0',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
        e.currentTarget.style.borderColor = category.color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#e2e8f0';
      }}
    >
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: category.color + '15',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
      }}>
        <Icon size={24} color={category.color} />
      </div>
      
      <h3 style={{ 
        fontSize: '17px', 
        fontWeight: 600, 
        color: '#0D2C54', 
        margin: '0 0 8px 0' 
      }}>
        {category.name}
      </h3>
      
      <p style={{ 
        fontSize: '14px', 
        color: '#64748b', 
        lineHeight: 1.5,
        margin: '0 0 16px 0',
        flex: 1
      }}>
        {category.description}
      </p>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <span style={{ 
          fontSize: '14px', 
          color: category.color, 
          fontWeight: 600 
        }}>
          {category.count}+ {category.id === 'certifications' ? 'programs' : category.id}
        </span>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <ChevronRight size={18} color="#94a3b8" />
        </div>
      </div>
    </a>
  );
};

// Recent Card Component
interface RecentCardProps {
  item: {
    type: string;
    name: string;
    time: string;
    color: string;
  };
}

const RecentCard: React.FC<RecentCardProps> = ({ item }) => (
  <a
    href="#"
    style={{
      background: 'white',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid #e2e8f0',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textDecoration: 'none',
      display: 'block',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = item.color;
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = '#e2e8f0';
      e.currentTarget.style.boxShadow = 'none';
    }}
  >
    <span style={{
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: 700,
      background: item.color + '15',
      color: item.color,
      marginBottom: '10px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    }}>
      {item.type}
    </span>
    <h4 style={{ 
      fontSize: '14px', 
      fontWeight: 600, 
      color: '#0D2C54', 
      margin: '0 0 6px 0',
      lineHeight: 1.4
    }}>
      {item.name}
    </h4>
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '4px',
      fontSize: '12px', 
      color: '#94a3b8' 
    }}>
      <Clock size={12} />
      Accessed {item.time}
    </div>
  </a>
);

// NavLink Component
const NavLink: React.FC<{ href: string; icon: React.ElementType; children: React.ReactNode; active?: boolean }> = ({ 
  href, 
  icon: Icon, 
  children, 
  active 
}) => (
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
    {children}
  </a>
);

// Resource NavLink with count
const ResourceNavLink: React.FC<{ 
  href: string; 
  icon: React.ElementType; 
  count: number;
  children: React.ReactNode; 
}> = ({ href, icon: Icon, count, children }) => (
  <a
    href={href}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 14px',
      borderRadius: '8px',
      color: '#475569',
      textDecoration: 'none',
      fontSize: '13px',
      fontWeight: 500,
      marginBottom: '2px',
      transition: 'all 0.15s ease'
    }}
  >
    <Icon size={18} />
    <span style={{ flex: 1 }}>{children}</span>
    <span style={{ 
      fontSize: '11px', 
      color: '#94a3b8',
      background: '#f1f5f9',
      padding: '2px 8px',
      borderRadius: '10px',
    }}>
      {count}
    </span>
  </a>
);

export default ResourceLibrary;
