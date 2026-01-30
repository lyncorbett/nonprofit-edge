'use client';

import React, { useState, useEffect } from 'react';
import { 
  Star, Search, FileText, Wrench, BookOpen, 
  ArrowLeft, ExternalLink, Trash2, Filter, Calendar
} from 'lucide-react';

interface FavoriteItem {
  id: string;
  name: string;
  type: 'resource' | 'tool' | 'article';
  description: string;
  savedAt: string;  // ISO date string
  url?: string;
}

interface SavedFavoritesProps {
  onNavigate?: (route: string) => void;
}

const SavedFavorites: React.FC<SavedFavoritesProps> = ({ onNavigate }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('nonprofit_edge_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    } else {
      // Initialize with sample data if none exists
      const sampleFavorites: FavoriteItem[] = [
        {
          id: '1',
          name: 'Strategic Planning Guide',
          type: 'resource',
          description: 'Comprehensive guide to creating a 3-year strategic plan',
          savedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          url: '/resources/strategic-planning-guide',
        },
        {
          id: '2',
          name: 'Board Assessment Tool',
          type: 'tool',
          description: 'Evaluate your board\'s effectiveness across 8 dimensions',
          savedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          url: '/board-assessment/use',
        },
        {
          id: '3',
          name: 'Good to Great Summary',
          type: 'article',
          description: 'Key takeaways from Jim Collins\' classic business book',
          savedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          url: '/resources/book-summaries/good-to-great',
        },
        {
          id: '4',
          name: 'Scenario Planner',
          type: 'tool',
          description: 'PIVOT framework for strategic scenario planning',
          savedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          url: '/scenario-planner/use',
        },
        {
          id: '5',
          name: 'Grant Writing Checklist',
          type: 'resource',
          description: '50-point checklist for winning grant proposals',
          savedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          url: '/resources/grant-writing-checklist',
        },
      ];
      setFavorites(sampleFavorites);
      localStorage.setItem('nonprofit_edge_favorites', JSON.stringify(sampleFavorites));
    }
  }, []);

  // Add to favorites (can be called from other components)
  const addToFavorites = (item: Omit<FavoriteItem, 'id' | 'savedAt'>) => {
    const newFavorite: FavoriteItem = {
      ...item,
      id: `fav_${Date.now()}`,
      savedAt: new Date().toISOString(),
    };
    
    const updatedFavorites = [newFavorite, ...favorites];
    setFavorites(updatedFavorites);
    localStorage.setItem('nonprofit_edge_favorites', JSON.stringify(updatedFavorites));
    
    return newFavorite;
  };

  // Remove from favorites
  const removeFavorite = (id: string) => {
    if (confirm('Remove this item from your favorites?')) {
      const updatedFavorites = favorites.filter(f => f.id !== id);
      setFavorites(updatedFavorites);
      localStorage.setItem('nonprofit_edge_favorites', JSON.stringify(updatedFavorites));
    }
  };

  // Format date for display
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  // Format full date/time
  const formatFullDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Get icon and colors for type
  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'resource':
        return { 
          icon: <FileText size={20} color="#2563eb" />, 
          bg: '#eff6ff', 
          color: '#2563eb',
          label: 'Resource'
        };
      case 'tool':
        return { 
          icon: <Wrench size={20} color="#0097A9" />, 
          bg: '#ecfeff', 
          color: '#0097A9',
          label: 'Tool'
        };
      case 'article':
        return { 
          icon: <BookOpen size={20} color="#7c3aed" />, 
          bg: '#f5f3ff', 
          color: '#7c3aed',
          label: 'Article'
        };
      default:
        return { 
          icon: <FileText size={20} color="#64748b" />, 
          bg: '#f8fafc', 
          color: '#64748b',
          label: 'Item'
        };
    }
  };

  // Filter favorites
  const filteredFavorites = favorites.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const navigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.location.href = route;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '8px',
              color: '#475569',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0D2C54', margin: 0 }}>
            Saved Favorites
          </h1>
        </div>
        
        {/* Count */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: '#fef9c3',
          borderRadius: '8px',
        }}>
          <Star size={18} color="#ca8a04" fill="#ca8a04" />
          <span style={{ fontSize: '14px', color: '#854d0e', fontWeight: 500 }}>
            {favorites.length} saved items
          </span>
        </div>
      </header>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px' }}>
        {/* Search and Filter Bar */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 40px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>
          
          {/* Type Filter */}
          <div style={{ position: 'relative' }}>
            <Filter size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                padding: '10px 14px 10px 40px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'white',
                cursor: 'pointer',
                minWidth: '150px',
              }}
            >
              <option value="all">All Types</option>
              <option value="resource">Resources</option>
              <option value="tool">Tools</option>
              <option value="article">Articles</option>
            </select>
          </div>
        </div>

        {/* Favorites Grid */}
        {filteredFavorites.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '48px',
            textAlign: 'center',
          }}>
            <Star size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
            <p style={{ color: '#64748b', margin: 0 }}>
              {searchQuery || filterType !== 'all' 
                ? 'No favorites match your search' 
                : 'No saved favorites yet'}
            </p>
            <button
              onClick={() => navigate('/resources')}
              style={{
                marginTop: '16px',
                padding: '10px 20px',
                background: '#0097A9',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Browse Resources
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
          }}>
            {filteredFavorites.map((item) => {
              const typeConfig = getTypeConfig(item.type);
              return (
                <div
                  key={item.id}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    padding: '20px',
                    position: 'relative',
                    transition: 'box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Remove button */}
                  <button
                    onClick={() => removeFavorite(item.id)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      padding: '6px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      color: '#94a3b8',
                      opacity: 0.7,
                      transition: 'opacity 0.2s',
                    }}
                    title="Remove from favorites"
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7'; }}
                  >
                    <Trash2 size={14} />
                  </button>
                  
                  {/* Type badge and icon */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: typeConfig.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {typeConfig.icon}
                    </div>
                    <span style={{
                      padding: '4px 10px',
                      background: typeConfig.bg,
                      color: typeConfig.color,
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                    }}>
                      {typeConfig.label}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <h3 style={{ 
                    fontSize: '15px', 
                    fontWeight: 600, 
                    color: '#1e293b', 
                    marginBottom: '8px',
                    marginTop: 0,
                    paddingRight: '30px',
                  }}>
                    {item.name}
                  </h3>
                  <p style={{ 
                    fontSize: '13px', 
                    color: '#64748b', 
                    margin: '0 0 16px 0',
                    lineHeight: '1.5',
                  }}>
                    {item.description}
                  </p>
                  
                  {/* Footer */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid #f1f5f9',
                  }}>
                    {/* Saved date */}
                    <div 
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      title={formatFullDate(item.savedAt)}
                    >
                      <Calendar size={14} color="#94a3b8" />
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                        Saved {formatDate(item.savedAt)}
                      </span>
                    </div>
                    
                    {/* Open link */}
                    <button
                      onClick={() => item.url && navigate(item.url)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        background: typeConfig.bg,
                        color: typeConfig.color,
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      Open
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Browse More Link */}
        {filteredFavorites.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button
              onClick={() => navigate('/resources')}
              style={{
                padding: '10px 24px',
                background: 'white',
                color: '#0097A9',
                border: '1px solid #0097A9',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Discover More Resources
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedFavorites;
