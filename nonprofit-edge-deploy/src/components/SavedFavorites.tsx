'use client';

import React, { useState } from 'react';
import { Star, FileText, BookOpen, Wrench, Trash2, ExternalLink, Search } from 'lucide-react';

interface FavoriteItem {
  id: string;
  name: string;
  type: 'resource' | 'tool' | 'article';
  category: string;
  savedAt: string;
  href: string;
}

const mockFavorites: FavoriteItem[] = [
  { id: '1', name: 'Board Self-Assessment Template', type: 'resource', category: 'Board Governance', savedAt: '2026-01-27', href: '/resources/board-self-assessment' },
  { id: '2', name: 'Strategic Plan Check-Up', type: 'tool', category: 'Strategic Planning', savedAt: '2026-01-25', href: '/tools/strategic-plan' },
  { id: '3', name: '5 Signs Your Board Needs a Reset', type: 'article', category: 'Board Governance', savedAt: '2026-01-22', href: '/articles/board-reset-signs' },
  { id: '4', name: 'Grant Review Tool', type: 'tool', category: 'Fundraising', savedAt: '2026-01-20', href: '/tools/grant-review' },
  { id: '5', name: 'CEO Evaluation Framework', type: 'resource', category: 'Leadership', savedAt: '2026-01-18', href: '/resources/ceo-evaluation' },
  { id: '6', name: 'Constraint Assessment', type: 'tool', category: 'Strategy', savedAt: '2026-01-15', href: '/dashboard/constraint-assessment' },
];

const SavedFavorites: React.FC = () => {
  const [favorites, setFavorites] = useState(mockFavorites);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'resource' | 'tool' | 'article'>('all');

  const filteredFavorites = favorites.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'resource': return <FileText className="w-5 h-5" />;
      case 'tool': return <Wrench className="w-5 h-5" />;
      case 'article': return <BookOpen className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'resource': return 'bg-blue-100 text-blue-700';
      case 'tool': return 'bg-purple-100 text-purple-700';
      case 'article': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0D2C54] mb-2">Saved Favorites</h1>
            <p className="text-slate-500">Quick access to your bookmarked content</p>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span className="font-semibold">{favorites.length} items saved</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search favorites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0097A9]"
              />
            </div>
            <div className="flex items-center gap-2">
              {(['all', 'resource', 'tool', 'article'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    typeFilter === type
                      ? 'bg-[#0097A9] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Favorites Grid */}
        {filteredFavorites.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Star className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No favorites found</h3>
            <p className="text-slate-500 mb-6">
              {favorites.length === 0
                ? "You haven't saved any favorites yet"
                : "Try adjusting your search or filter"}
            </p>
            <a
              href="/member-resources"
              className="inline-flex items-center gap-2 bg-[#0097A9] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#007A8A] transition-all"
            >
              Browse Resources
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredFavorites.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#0097A9] hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeStyle(item.type)}`}>
                    {getIcon(item.type)}
                  </div>
                  <button
                    onClick={() => removeFavorite(item.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2">{item.name}</h3>
                
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${getTypeStyle(item.type)}`}>
                    {item.type}
                  </span>
                  <span className="text-xs text-slate-400">{item.category}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-400">Saved {formatDate(item.savedAt)}</span>
                  <a
                    href={item.href}
                    className="flex items-center gap-1 text-sm font-medium text-[#0097A9] hover:underline"
                  >
                    Open <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedFavorites;
