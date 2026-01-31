'use client';

import React, { useState } from 'react';
import { 
  Download, FileText, Search, Calendar, Filter,
  ArrowLeft, Trash2, FolderOpen, Clock
} from 'lucide-react';

interface MyDownloadsProps {
  onNavigate?: (page: string) => void;
}

const MyDownloads: React.FC<MyDownloadsProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const navigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      window.location.href = `/${page}`;
    }
  };

  const downloads = [
    { id: 1, name: 'Board Meeting Agenda Template', type: 'Template', date: '2 days ago', size: '45 KB', category: 'Governance' },
    { id: 2, name: 'Strategic Plan Check-Up Report', type: 'Report', date: '1 week ago', size: '1.2 MB', category: 'Strategy' },
    { id: 3, name: 'CEO Evaluation Summary', type: 'Report', date: '2 weeks ago', size: '890 KB', category: 'Leadership' },
    { id: 4, name: 'Board Retreat Facilitation Kit', type: 'Kit', date: '3 weeks ago', size: '5.4 MB', category: 'Facilitation' },
    { id: 5, name: 'Grant Writing Playbook', type: 'Playbook', date: '1 month ago', size: '2.1 MB', category: 'Fundraising' },
    { id: 6, name: 'Governance as Leadership Summary', type: 'Book Summary', date: '1 month ago', size: '320 KB', category: 'Books' },
  ];

  const filteredDownloads = downloads.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || item.type.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Template': return 'bg-slate-100 text-slate-600';
      case 'Report': return 'bg-teal-50 text-teal-600';
      case 'Kit': return 'bg-pink-50 text-pink-600';
      case 'Playbook': return 'bg-purple-50 text-purple-600';
      case 'Book Summary': return 'bg-amber-50 text-amber-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

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
            <h1 className="text-xl font-bold text-[#0D2C54]">My Downloads</h1>
            <p className="text-sm text-slate-500">Access all your downloaded resources</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0097A9]/10 flex items-center justify-center">
                <Download className="w-5 h-5 text-[#0097A9]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0D2C54]">{downloads.length}</p>
                <p className="text-sm text-slate-500">Total Downloads</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0D2C54]">18</p>
                <p className="text-sm text-slate-500">This Month</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0D2C54]">7</p>
                <p className="text-sm text-slate-500">Remaining</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search downloads..."
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0097A9]"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0097A9] bg-white"
          >
            <option value="all">All Types</option>
            <option value="template">Templates</option>
            <option value="report">Reports</option>
            <option value="kit">Kits</option>
            <option value="playbook">Playbooks</option>
            <option value="book summary">Book Summaries</option>
          </select>
        </div>

        {/* Downloads List */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {filteredDownloads.length === 0 ? (
            <div className="p-12 text-center">
              <Download className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No downloads found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredDownloads.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#0D2C54]">{item.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${getTypeColor(item.type)}`}>
                          {item.type}
                        </span>
                        <span className="text-xs text-slate-400">{item.size}</span>
                        <span className="text-xs text-slate-400">{item.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-[#0097A9] hover:bg-[#0097A9]/10 rounded-lg transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyDownloads;
