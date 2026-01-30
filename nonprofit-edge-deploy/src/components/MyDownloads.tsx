'use client';

import React, { useState } from 'react';
import { Download, FileText, Calendar, Search, Filter, ChevronDown, ExternalLink } from 'lucide-react';

interface DownloadItem {
  id: string;
  name: string;
  type: string;
  category: string;
  downloadedAt: string;
  size: string;
}

const mockDownloads: DownloadItem[] = [
  { id: '1', name: 'Board Self-Assessment Template', type: 'XLSX', category: 'Board Governance', downloadedAt: '2026-01-28', size: '245 KB' },
  { id: '2', name: 'Strategic Planning Workbook', type: 'PDF', category: 'Strategic Planning', downloadedAt: '2026-01-25', size: '1.2 MB' },
  { id: '3', name: 'Grant Proposal Checklist', type: 'DOCX', category: 'Fundraising', downloadedAt: '2026-01-22', size: '89 KB' },
  { id: '4', name: 'CEO Performance Review Framework', type: 'PDF', category: 'Leadership', downloadedAt: '2026-01-20', size: '456 KB' },
  { id: '5', name: 'Budget Template - Nonprofit', type: 'XLSX', category: 'Finance', downloadedAt: '2026-01-18', size: '312 KB' },
  { id: '6', name: 'Stakeholder Analysis Matrix', type: 'XLSX', category: 'Strategic Planning', downloadedAt: '2026-01-15', size: '178 KB' },
];

const MyDownloads: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = ['all', ...new Set(mockDownloads.map(d => d.category))];

  const filteredDownloads = mockDownloads.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PDF': return 'bg-red-100 text-red-700';
      case 'XLSX': return 'bg-green-100 text-green-700';
      case 'DOCX': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0D2C54] mb-2">My Downloads</h1>
            <p className="text-slate-500">Access your previously downloaded resources</p>
          </div>
          <div className="bg-gradient-to-br from-[#0097A9] to-[#00b4cc] rounded-xl px-5 py-3 text-white">
            <div className="text-sm opacity-80">Downloads This Month</div>
            <div className="text-2xl font-bold">7 of 25</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search downloads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0097A9]"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-9 pr-8 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0097A9] appearance-none bg-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Downloads List */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {filteredDownloads.length === 0 ? (
            <div className="p-12 text-center">
              <Download className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No downloads found</h3>
              <p className="text-slate-500">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredDownloads.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-all"
                >
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-slate-500" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-800 truncate">{item.name}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${getTypeColor(item.type)}`}>
                        {item.type}
                      </span>
                      <span className="text-xs text-slate-400">{item.category}</span>
                      <span className="text-xs text-slate-400">{item.size}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    {formatDate(item.downloadedAt)}
                  </div>

                  <button className="flex items-center gap-2 text-sm font-medium text-[#0097A9] hover:text-[#007A8A] px-3 py-2 rounded-lg hover:bg-[#0097A9]/5 transition-all">
                    <Download className="w-4 h-4" />
                    Re-download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Browse More */}
        <div className="mt-8 text-center">
          <a
            href="/member-resources"
            className="inline-flex items-center gap-2 text-[#0097A9] font-semibold hover:underline"
          >
            Browse Member Resources
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default MyDownloads;
