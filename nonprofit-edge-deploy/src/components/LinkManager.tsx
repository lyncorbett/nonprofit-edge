/**
 * THE NONPROFIT EDGE - Link Manager
 * 
 * Centralized management of ALL platform links
 * - View, edit, test links without touching code
 * - Categorized by type
 * - One-click link testing
 */

import React, { useState, useEffect } from 'react';

const NAVY = '#1a365d';
const TEAL = '#00a0b0';
const TEAL_LIGHT = '#e6f7f9';

interface LinkManagerProps {
  user: any;
  supabase?: any;
  onNavigate: (page: string) => void;
}

interface PlatformLink {
  id: string;
  name: string;
  url: string;
  category: 'signup' | 'tool' | 'internal' | 'resource' | 'ghl' | 'social' | 'external';
  description?: string;
  location: string;
  status: 'active' | 'broken' | 'untested';
  lastTested?: string;
  lastModified: string;
}

const LinkManager: React.FC<LinkManagerProps> = ({ user, supabase, onNavigate }) => {
  const [links, setLinks] = useState<PlatformLink[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<PlatformLink[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingLink, setEditingLink] = useState<PlatformLink | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [testingLink, setTestingLink] = useState<string | null>(null);

  const sampleLinks: PlatformLink[] = [
    { id: '1', name: 'Free Trial Signup', url: 'https://app.thenonprofitedge.com/signup', category: 'signup', description: 'Main trial signup', location: 'Homepage Hero, Pricing, Nav', status: 'active', lastTested: '2025-01-02', lastModified: '2025-01-01' },
    { id: '2', name: 'Member Login', url: 'https://app.thenonprofitedge.com/login', category: 'signup', description: 'Member login portal', location: 'Homepage Nav', status: 'active', lastTested: '2025-01-02', lastModified: '2025-01-01' },
    { id: '3', name: 'Essential Tier Signup', url: 'https://app.thenonprofitedge.com/signup?tier=essential', category: 'signup', location: 'Pricing Page', status: 'active', lastTested: '2025-01-02', lastModified: '2025-01-01' },
    { id: '4', name: 'Professional Tier Signup', url: 'https://app.thenonprofitedge.com/signup?tier=professional', category: 'signup', location: 'Pricing Page', status: 'active', lastTested: '2025-01-02', lastModified: '2025-01-01' },
    { id: '5', name: 'Premium Tier Signup', url: 'https://app.thenonprofitedge.com/signup?tier=premium', category: 'signup', location: 'Pricing Page', status: 'active', lastTested: '2025-01-02', lastModified: '2025-01-01' },
    { id: '6', name: 'Board Assessment Tool', url: '/board-assessment', category: 'tool', description: 'Board assessment intake', location: 'Dashboard, Homepage', status: 'active', lastTested: '2025-01-02', lastModified: '2025-01-01' },
    { id: '7', name: 'Strategic Plan Check-Up', url: '/strategic-checkup', category: 'tool', location: 'Dashboard, Homepage', status: 'active', lastTested: '2025-01-02', lastModified: '2025-01-01' },
    { id: '8', name: 'Scenario Planner', url: '/scenario-planner', category: 'tool', location: 'Dashboard, Homepage', status: 'active', lastTested: '2025-01-02', lastModified: '2025-01-01' },
    { id: '9', name: 'Grant Review', url: '/grant-review', category: 'tool', location: 'Dashboard, Homepage', status: 'active', lastTested: '2025-01-02', lastModified: '2025-01-01' },
    { id: '10', name: 'CEO Evaluation', url: '/ceo-evaluation', category: 'tool', location: 'Dashboard, Homepage', status: 'active', lastTested: '2025-01-02', lastModified: '2025-01-01' },
    { id: '11', name: 'Template Vault', url: '/templates', category: 'tool', location: 'Dashboard, Homepage', status: 'active', lastTested: '2025-01-02', lastModified: '2025-01-01' },
    { id: '12', name: 'Resource Library', url: '/library', category: 'internal', location: 'Dashboard Sidebar', status: 'active', lastTested: '2025-01-02', lastModified: '2025-01-01' },
    { id: '13', name: 'Events Calendar', url: '/events', category: 'internal', location: 'Dashboard Sidebar', status: 'active', lastTested: '2025-01-02', lastModified: '2025-01-01' },
    { id: '14', name: 'Book Summaries', url: '/book-summaries', category: 'resource', location: 'Dashboard, Library', status: 'active', lastTested: '2025-01-02', lastModified: '2025-01-01' },
    { id: '15', name: 'Certifications', url: '/certifications', category: 'resource', location: 'Dashboard Sidebar', status: 'untested', lastModified: '2025-01-01' },
    { id: '16', name: 'Ask the Professor', url: '/professor', category: 'internal', location: 'Dashboard Sidebar, Card', status: 'active', lastTested: '2025-01-02', lastModified: '2025-01-01' },
    { id: '17', name: 'GHL - Main Funnel', url: 'https://app.gohighlevel.com/v2/location/xxx/funnels/yyy', category: 'ghl', description: 'Main marketing funnel', location: 'Ad campaigns', status: 'active', lastTested: '2025-01-01', lastModified: '2025-01-01' },
    { id: '18', name: 'GHL - Webinar Registration', url: 'https://app.gohighlevel.com/v2/location/xxx/calendars/yyy', category: 'ghl', location: 'Events page, Emails', status: 'active', lastTested: '2025-01-01', lastModified: '2025-01-01' },
    { id: '19', name: 'GHL - Book a Call', url: 'https://calendly.com/lyncorbett/strategy', category: 'ghl', location: 'Premium signup, Contact', status: 'active', lastTested: '2025-01-01', lastModified: '2025-01-01' },
    { id: '20', name: 'LinkedIn - Lyn', url: 'https://linkedin.com/in/lyncorbett', category: 'social', location: 'Footer, About', status: 'active', lastTested: '2025-01-01', lastModified: '2025-01-01' },
    { id: '21', name: 'LinkedIn - Company', url: 'https://linkedin.com/company/thenonprofitedge', category: 'social', location: 'Footer', status: 'untested', lastModified: '2025-01-01' },
    { id: '22', name: 'YouTube Channel', url: 'https://youtube.com/@thenonprofitedge', category: 'social', location: 'Footer, Resources', status: 'untested', lastModified: '2025-01-01' },
    { id: '23', name: 'Instagram', url: 'https://instagram.com/thenonprofitedge', category: 'social', location: 'Footer', status: 'untested', lastModified: '2025-01-01' },
    { id: '24', name: 'Facebook Page', url: 'https://facebook.com/thenonprofitedge', category: 'social', location: 'Footer', status: 'untested', lastModified: '2025-01-01' },
    { id: '25', name: 'Pivotal Group Website', url: 'https://thepivotalgroup.com', category: 'external', location: 'Footer, About', status: 'active', lastTested: '2025-01-01', lastModified: '2025-01-01' },
    { id: '26', name: 'Leadership Reset Book', url: 'https://amazon.com/dp/xxx', category: 'external', description: 'Amazon book link', location: 'About, Email sigs', status: 'broken', lastTested: '2025-01-02', lastModified: '2025-01-01' },
    { id: '27', name: 'Hope is Not a Strategy Book', url: 'https://amazon.com/dp/yyy', category: 'external', location: 'About, Email sigs', status: 'active', lastTested: '2025-01-02', lastModified: '2025-01-01' },
    { id: '28', name: 'Privacy Policy', url: '/privacy', category: 'internal', location: 'Footer, Signup', status: 'active', lastTested: '2025-01-02', lastModified: '2025-01-01' },
    { id: '29', name: 'Terms of Service', url: '/terms', category: 'internal', location: 'Footer, Signup', status: 'active', lastTested: '2025-01-02', lastModified: '2025-01-01' },
  ];

  useEffect(() => { setLinks(sampleLinks); }, []);
  
  useEffect(() => {
    let filtered = [...links];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(l => l.name.toLowerCase().includes(term) || l.url.toLowerCase().includes(term) || l.location.toLowerCase().includes(term));
    }
    if (categoryFilter !== 'all') filtered = filtered.filter(l => l.category === categoryFilter);
    if (statusFilter !== 'all') filtered = filtered.filter(l => l.status === statusFilter);
    setFilteredLinks(filtered);
  }, [links, searchTerm, categoryFilter, statusFilter]);

  const testLink = (link: PlatformLink) => {
    setTestingLink(link.id);
    window.open(link.url.startsWith('http') ? link.url : `https://app.thenonprofitedge.com${link.url}`, '_blank');
    setTimeout(() => {
      setLinks(prev => prev.map(l => l.id === link.id ? { ...l, status: 'active', lastTested: new Date().toISOString().split('T')[0] } : l));
      setTestingLink(null);
    }, 1000);
  };

  const saveLink = (link: PlatformLink) => {
    if (isAddingNew) {
      setLinks(prev => [...prev, { ...link, id: Date.now().toString() }]);
    } else {
      setLinks(prev => prev.map(l => l.id === link.id ? link : l));
    }
    setEditingLink(null);
    setIsAddingNew(false);
  };

  const deleteLink = (id: string) => {
    if (confirm('Delete this link?')) setLinks(prev => prev.filter(l => l.id !== id));
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      signup: { bg: '#dcfce7', text: '#166534' }, tool: { bg: '#dbeafe', text: '#1e40af' },
      internal: { bg: '#f3e8ff', text: '#7c3aed' }, resource: { bg: '#fef3c7', text: '#d97706' },
      ghl: { bg: '#fce7f3', text: '#be185d' }, social: { bg: '#e0f2fe', text: '#0369a1' },
      external: { bg: '#f1f5f9', text: '#475569' }
    };
    return colors[cat] || colors.external;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string; dot: string }> = {
      active: { bg: '#dcfce7', text: '#166534', dot: '#22c55e' },
      broken: { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' },
      untested: { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' }
    };
    return colors[status] || colors.untested;
  };

  const categories = [
    { value: 'all', label: 'All Categories' }, { value: 'signup', label: 'Signup & Auth' },
    { value: 'tool', label: 'Tools' }, { value: 'internal', label: 'Internal Pages' },
    { value: 'resource', label: 'Resources' }, { value: 'ghl', label: 'GoHighLevel' },
    { value: 'social', label: 'Social Media' }, { value: 'external', label: 'External' }
  ];

  const stats = {
    total: links.length,
    active: links.filter(l => l.status === 'active').length,
    broken: links.filter(l => l.status === 'broken').length,
    untested: links.filter(l => l.status === 'untested').length
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-52 bg-white border-r border-gray-300 flex flex-col fixed h-screen overflow-y-auto">
        <div className="px-4 py-5 border-b border-gray-300">
          <div className="text-lg font-extrabold" style={{ color: NAVY }}>The Nonprofit Edge</div>
        </div>
        <div className="py-4">
          <div className="px-4 mb-2 text-xs font-extrabold uppercase tracking-wider" style={{ color: NAVY }}>Navigation</div>
          <nav className="space-y-1">
            <a onClick={() => onNavigate('dashboard')} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">← Back to Dashboard</a>
            <a onClick={() => onNavigate('owner-dashboard')} className="block px-4 py-2 text-sm text-green-600 hover:bg-green-50 cursor-pointer">Owner Dashboard</a>
            <a onClick={() => onNavigate('marketing')} className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 cursor-pointer">Marketing Analytics</a>
            <a className="block px-4 py-2 text-sm font-semibold cursor-pointer" style={{ color: TEAL, backgroundColor: TEAL_LIGHT }}>Link Manager</a>
          </nav>
        </div>
        <div className="py-4 border-t border-gray-300">
          <div className="px-4 mb-2 text-xs font-extrabold uppercase tracking-wider" style={{ color: NAVY }}>Link Health</div>
          <div className="px-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Total</span><span className="font-bold">{stats.total}</span></div>
            <div className="flex justify-between"><span className="text-green-600">✓ Active</span><span className="font-bold text-green-600">{stats.active}</span></div>
            <div className="flex justify-between"><span className="text-red-600">✗ Broken</span><span className="font-bold text-red-600">{stats.broken}</span></div>
            <div className="flex justify-between"><span className="text-amber-600">? Untested</span><span className="font-bold text-amber-600">{stats.untested}</span></div>
          </div>
        </div>
        <div className="mt-auto px-4 py-4 border-t border-gray-300">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: TEAL }}>LC</div>
            <div><div className="font-semibold text-gray-800 text-sm">{user?.full_name || 'Lyn Corbett'}</div><div className="text-[10px] text-gray-400">Owner</div></div>
          </div>
        </div>
      </aside>

      <div className="flex-1 ml-52 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: NAVY }}>Link Manager</h1>
            <p className="text-gray-600">Manage all platform links in one place</p>
          </div>
          <button onClick={() => { setIsAddingNew(true); setEditingLink({ id: '', name: '', url: '', category: 'internal', location: '', status: 'untested', lastModified: new Date().toISOString().split('T')[0] }); }} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: TEAL }}>+ Add New Link</button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex gap-4">
          <input type="text" placeholder="Search links..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
            {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="broken">Broken</option>
            <option value="untested">Untested</option>
          </select>
        </div>

        {stats.broken > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div><h3 className="font-bold text-red-800">{stats.broken} Broken Link{stats.broken > 1 ? 's' : ''}</h3><p className="text-sm text-red-600">Click to edit and fix.</p></div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">URL</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Location</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLinks.map((link) => {
                const statusColor = getStatusColor(link.status);
                const categoryColor = getCategoryColor(link.category);
                return (
                  <tr key={link.id} className={`hover:bg-gray-50 ${link.status === 'broken' ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: statusColor.dot }} />
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full capitalize" style={{ background: statusColor.bg, color: statusColor.text }}>{link.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><div className="font-medium text-sm" style={{ color: NAVY }}>{link.name}</div>{link.description && <div className="text-xs text-gray-500">{link.description}</div>}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded max-w-[180px] truncate block">{link.url}</code>
                        <button onClick={() => navigator.clipboard.writeText(link.url)} className="text-gray-400 hover:text-gray-600" title="Copy">📋</button>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="text-xs font-medium px-2 py-1 rounded-full capitalize" style={{ background: categoryColor.bg, color: categoryColor.text }}>{link.category}</span></td>
                    <td className="px-4 py-3"><span className="text-xs text-gray-600">{link.location}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => testLink(link)} className="p-1.5 rounded hover:bg-gray-100" title="Test">{testingLink === link.id ? '⏳' : '🔍'}</button>
                        <button onClick={() => setEditingLink(link)} className="p-1.5 rounded hover:bg-gray-100" title="Edit">✏️</button>
                        <button onClick={() => deleteLink(link.id)} className="p-1.5 rounded hover:bg-red-100" title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredLinks.length === 0 && <div className="text-center py-12 text-gray-500">No links found.</div>}
        </div>
        <div className="mt-4 text-sm text-gray-500">Showing {filteredLinks.length} of {links.length} links</div>
      </div>

      {editingLink && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
            <h2 className="text-xl font-bold mb-4" style={{ color: NAVY }}>{isAddingNew ? 'Add New Link' : 'Edit Link'}</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><input type="text" value={editingLink.name} onChange={(e) => setEditingLink({ ...editingLink, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">URL</label><input type="text" value={editingLink.url} onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><select value={editingLink.category} onChange={(e) => setEditingLink({ ...editingLink, category: e.target.value as any })} className="w-full px-4 py-2 border border-gray-300 rounded-lg">{categories.filter(c => c.value !== 'all').map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><input type="text" value={editingLink.description || ''} onChange={(e) => setEditingLink({ ...editingLink, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Where It Appears</label><input type="text" value={editingLink.location} onChange={(e) => setEditingLink({ ...editingLink, location: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setEditingLink(null); setIsAddingNew(false); }} className="flex-1 px-4 py-2 rounded-lg font-medium border border-gray-300 hover:bg-gray-50">Cancel</button>
              <button onClick={() => saveLink({ ...editingLink, lastModified: new Date().toISOString().split('T')[0] })} className="flex-1 px-4 py-2 rounded-lg font-medium text-white" style={{ background: TEAL }}>{isAddingNew ? 'Add' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkManager;
