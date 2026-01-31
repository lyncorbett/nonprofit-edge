'use client';

import React, { useState } from 'react';
import { 
  Star, Search, ArrowLeft, Trash2, BookOpen, FileText,
  Target, Presentation, Bookmark, ExternalLink
} from 'lucide-react';

interface SavedFavoritesProps {
  onNavigate?: (page: string) => void;
}

const SavedFavorites: React.FC<SavedFavoritesProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      window.location.href = `/${page}`;
    }
  };

  const favorites = [
    { id: 1, name: 'Governance as Leadership', type: 'Book Summary', icon: Bookmark, color: '#f59e0b', savedDate: '2 days ago' },
    { id: 2, name: 'Board Retreat Playbook', type: 'Playbook', icon: Target, color: '#6366f1', savedDate: '1 week ago' },
    { id: 3, name: 'Strategic Planning That Actually Works', type: 'Guide', icon: BookOpen, color: '#0097A9', savedDate: '1 week ago' },
    { id: 4, name: 'Board Meeting Agenda Template', type: 'Template', icon: FileText, color: '#0D2C54', savedDate: '2 weeks ago' },
    { id: 5, name: 'Annual Board Retreat Kit', type: 'Facilitation Kit', icon: Presentation, color: '#ec4899', savedDate: '3 weeks ago' },
  ];

  const filteredFavorites = favorites.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button 
            onClick={() => navigate('dashboard')}
            className="text-slate-400 hover:text-[#0097A9] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#0D2C54]">Saved Favorites</h1>
            <p className="text-sm text-slate-500">Quick access to your bookmarked resources</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search favorites..."
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0097A9] bg-white"
          />
        </div>

        {/* Favorites Grid */}
        {filteredFavorites.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Star className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-semibold text-[#0D2C54] mb-2">No favorites yet</h3>
            <p className="text-slate-500 mb-4">Start saving resources by clicking the star icon</p>
            <button 
              onClick={() => navigate('member-resources')}
              className="px-4 py-2 bg-[#0097A9] text-white rounded-lg font-medium"
            >
              Browse Resources
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredFavorites.map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 hover:border-[#0097A9] hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors">
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-[#0D2C54] mb-1">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-xs font-medium px-2 py-0.5 rounded"
                      style={{ backgroundColor: `${item.color}15`, color: item.color }}
                    >
                      {item.type}
                    </span>
                    <span className="text-xs text-slate-400">Saved {item.savedDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedFavorites;
