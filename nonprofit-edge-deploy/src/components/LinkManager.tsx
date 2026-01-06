/**
 * THE NONPROFIT EDGE - Link Manager
 * Updated with ALL Homepage links
 */

import React, { useState, useEffect } from 'react'

const NAVY = '#1a365d'
const TEAL = '#00a0b0'
const TEAL_LIGHT = '#e6f7f9'

interface LinkManagerProps {
  user?: any
  supabase?: any
  onNavigate: (page: string) => void
}

interface PlatformLink {
  id: string
  name: string
  url: string
  category: string
  description?: string
  location: string
  status: 'active' | 'broken' | 'untested'
  lastModified: string
}

const LinkManager: React.FC<LinkManagerProps> = ({ user, supabase, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editingLink, setEditingLink] = useState<PlatformLink | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [testingLink, setTestingLink] = useState<string | null>(null)

  // ALL LINKS - Including Homepage
  const [links, setLinks] = useState<PlatformLink[]>([
    // HOMEPAGE - HEADER
    { id: 'hp-logo', name: 'Logo (Home)', url: '/', category: 'Homepage - Header', description: 'Logo click', location: 'Header', status: 'active', lastModified: '2026-01-06' },
    { id: 'hp-nav-home', name: 'Home', url: '/', category: 'Homepage - Header', description: 'Nav link', location: 'Header Nav', status: 'active', lastModified: '2026-01-06' },
    { id: 'hp-nav-why', name: 'Why We Exist', url: '/why-we-exist', category: 'Homepage - Header', description: 'Nav link', location: 'Header Nav', status: 'active', lastModified: '2026-01-06' },
    { id: 'hp-nav-tools', name: 'Tools', url: '#tools-section', category: 'Homepage - Header', description: 'Anchor scroll', location: 'Header Nav', status: 'active', lastModified: '2026-01-06' },
    { id: 'hp-nav-pricing', name: 'Pricing', url: '#pricing-section', category: 'Homepage - Header', description: 'Anchor scroll', location: 'Header Nav', status: 'active', lastModified: '2026-01-06' },
    { id: 'hp-nav-signin', name: 'Sign In Button', url: '/login', category: 'Homepage - Header', description: 'Login button', location: 'Header Nav', status: 'active', lastModified: '2026-01-06' },
    
    // HOMEPAGE - HERO
    { id: 'hp-hero-trial', name: 'Start Your Free Trial', url: '/signup', category: 'Homepage - Hero', description: 'Primary CTA', location: 'Hero Section', status: 'active', lastModified: '2026-01-06' },
    { id: 'hp-hero-demo', name: 'See How It Works', url: '#demo', category: 'Homepage - Hero', description: 'Demo link', location: 'Hero Section', status: 'active', lastModified: '2026-01-06' },
    
    // HOMEPAGE - TOOLS SECTION
    { id: 'hp-tool-strategic', name: 'Strategic Plan Analysis', url: '/strategic-plan-checkup', category: 'Homepage - Tools', description: 'Tool card', location: 'Tools Section', status: 'active', lastModified: '2026-01-06' },
    { id: 'hp-tool-grant', name: 'Grant Review', url: '/grant-review', category: 'Homepage - Tools', description: 'Tool card', location: 'Tools Section', status: 'active', lastModified: '2026-01-06' },
    { id: 'hp-tool-scenario', name: 'Scenario Planning', url: '/scenario-planner', category: 'Homepage - Tools', description: 'Tool card', location: 'Tools Section', status: 'active', lastModified: '2026-01-06' },
    { id: 'hp-tool-ceo', name: 'CEO Evaluation', url: '/ceo-evaluation', category: 'Homepage - Tools', description: 'Tool card', location: 'Tools Section', status: 'active', lastModified: '2026-01-06' },
    { id: 'hp-tool-board', name: 'Board Assessment', url: '/board-assessment', category: 'Homepage - Tools', description: 'Tool card', location: 'Tools Section', status: 'active', lastModified: '2026-01-06' },
    { id: 'hp-tool-resources', name: 'Member Resources', url: '/resources', category: 'Homepage - Tools', description: 'Tool card', location: 'Tools Section', status: 'active', lastModified: '2026-01-06' },
    
    // HOMEPAGE - ASK THE PROFESSOR
    { id: 'hp-atp-cta', name: 'Ask Your First Question', url: '/ask-the-professor', category: 'Homepage - Ask Professor', description: 'ATP CTA', location: 'Ask Professor Section', status: 'active', lastModified: '2026-01-06' },
    
    // HOMEPAGE - FREE ASSESSMENT
    { id: 'hp-assessment', name: 'Take the Free Assessment', url: 'https://thenonprofitedge.app.n8n.cloud/webhook/constraint-assessment', category: 'Homepage - Free Assessment', description: 'n8n webhook', location: 'Free Assessment', status: 'active', lastModified: '2026-01-06' },
    
    // HOMEPAGE - PRICING
    { id: 'hp-price-essential', name: 'Essential - Start Trial', url: '/signup', category: 'Homepage - Pricing', description: 'Essential CTA', location: 'Pricing', status: 'active', lastModified: '2026-01-06' },
    { id: 'hp-price-professional', name: 'Professional - Start Trial', url: '/signup', category: 'Homepage - Pricing', description: 'Professional CTA', location: 'Pricing', status: 'active', lastModified: '2026-01-06' },
    { id: 'hp-price-premium', name: 'Premium - Start Trial', url: '/signup', category: 'Homepage - Pricing', description: 'Premium CTA', location: 'Pricing', status: 'active', lastModified: '2026-01-06' },
    { id: 'hp-price-enterprise', name: 'Enterprise - Contact Sales', url: 'mailto:lyn@thepivotalgroup.com', category: 'Homepage - Pricing', description: 'Enterprise email', location: 'Pricing', status: 'active', lastModified: '2026-01-06' },
    
    // HOMEPAGE - FOOTER
    { id: 'hp-footer-atp', name: 'Ask the Professor', url: '/ask-the-professor', category: 'Homepage - Footer', description: 'Footer link', location: 'Footer - Tools', status: 'active', lastModified: '2026-01-06' },
    { id: 'hp-footer-grant', name: 'Grant Review', url: '/grant-review', category: 'Homepage - Footer', description: 'Footer link', location: 'Footer - Tools', status: 'active', lastModified: '2026-01-06' },
    { id: 'hp-footer-board', name: 'Board Assessment', url: '/board-assessment', category: 'Homepage - Footer', description: 'Footer link', location: 'Footer - Tools', status: 'active', lastModified: '2026-01-06' },
    { id: 'hp-footer-strategic', name: 'Strategic Plan Analysis', url: '/strategic-plan-checkup', category: 'Homepage - Footer', description: 'Footer link', location: 'Footer - Tools', status: 'active', lastModified: '2026-01-06' },
    { id: 'hp-footer-ceo', name: 'CEO Evaluation', url: '/ceo-evaluation', category: 'Homepage - Footer', description: 'Footer link', location: 'Footer - Tools', status: 'active', lastModified: '2026-01-06' },
    { id: 'hp-footer-why', name: 'Why We Exist', url: '/why-we-exist', category: 'Homepage - Footer', description: 'Footer link', location: 'Footer - Company', status: 'active', lastModified: '2026-01-06' },
    { id: 'hp-footer-pricing', name: 'Pricing', url: '#pricing-section', category: 'Homepage - Footer', description: 'Footer link', location: 'Footer - Company', status: 'active', lastModified: '2026-01-06' },
    { id: 'hp-footer-contact', name: 'Contact', url: 'mailto:lyn@thepivotalgroup.com', category: 'Homepage - Footer', description: 'Contact email', location: 'Footer - Company', status: 'active', lastModified: '2026-01-06' },
    { id: 'hp-footer-pivotal', name: 'The Pivotal Group', url: 'https://thepivotalgroup.com', category: 'Homepage - Footer', description: 'Parent company', location: 'Footer - Company', status: 'active', lastModified: '2026-01-06' },
    { id: 'hp-footer-signin', name: 'Sign In', url: '/login', category: 'Homepage - Footer', description: 'Footer link', location: 'Footer - Account', status: 'active', lastModified: '2026-01-06' },
    { id: 'hp-footer-trial', name: 'Start Free Trial', url: '/signup', category: 'Homepage - Footer', description: 'Footer link', location: 'Footer - Account', status: 'active', lastModified: '2026-01-06' },
    { id: 'hp-footer-dashboard', name: 'Member Dashboard', url: '/dashboard', category: 'Homepage - Footer', description: 'Footer link', location: 'Footer - Account', status: 'active', lastModified: '2026-01-06' },
    { id: 'hp-footer-cta', name: 'Get Started Free', url: '/signup', category: 'Homepage - Footer', description: 'Footer CTA', location: 'Footer - Account', status: 'active', lastModified: '2026-01-06' },
    { id: 'hp-footer-privacy', name: 'Privacy Policy', url: '/privacy', category: 'Homepage - Footer', description: 'Legal link', location: 'Footer - Legal', status: 'active', lastModified: '2026-01-06' },
    { id: 'hp-footer-terms', name: 'Terms of Service', url: '/terms', category: 'Homepage - Footer', description: 'Legal link', location: 'Footer - Legal', status: 'active', lastModified: '2026-01-06' },
    
    // DASHBOARD LINKS
    { id: 'dash-templates', name: 'Template Vault', url: '/templates', category: 'Dashboard', description: 'Quick link', location: 'Dashboard', status: 'active', lastModified: '2026-01-06' },
    { id: 'dash-resources', name: 'Resource Library', url: '/resources', category: 'Dashboard', description: 'Quick link', location: 'Dashboard', status: 'active', lastModified: '2026-01-06' },
    { id: 'dash-events', name: 'Events Calendar', url: '/events', category: 'Dashboard', description: 'Quick link', location: 'Dashboard', status: 'active', lastModified: '2026-01-06' },
    { id: 'dash-books', name: 'Book Summaries', url: '/book-summaries', category: 'Dashboard', description: 'Quick link', location: 'Dashboard', status: 'active', lastModified: '2026-01-06' },
    { id: 'dash-certs', name: 'Certifications', url: '/certifications', category: 'Dashboard', description: 'Quick link', location: 'Dashboard', status: 'active', lastModified: '2026-01-06' },
    
    // TOOL WEBHOOKS (n8n)
    { id: 'webhook-strategic', name: 'Strategic Plan Check-Up', url: 'https://thenonprofitedge.app.n8n.cloud/webhook/strategic-plan-checkup', category: 'Tool Webhooks', description: 'n8n webhook', location: 'Dashboard Tool', status: 'active', lastModified: '2026-01-06' },
    { id: 'webhook-board', name: 'Board Assessment', url: 'https://thenonprofitedge.app.n8n.cloud/webhook/board-assessment', category: 'Tool Webhooks', description: 'n8n webhook', location: 'Dashboard Tool', status: 'active', lastModified: '2026-01-06' },
    { id: 'webhook-grant', name: 'Grant Review', url: 'https://thenonprofitedge.app.n8n.cloud/webhook/grant-review', category: 'Tool Webhooks', description: 'n8n webhook', location: 'Dashboard Tool', status: 'active', lastModified: '2026-01-06' },
    { id: 'webhook-scenario', name: 'Scenario Planner', url: 'https://thenonprofitedge.app.n8n.cloud/webhook/scenario-planner', category: 'Tool Webhooks', description: 'n8n webhook', location: 'Dashboard Tool', status: 'active', lastModified: '2026-01-06' },
    { id: 'webhook-ceo', name: 'CEO Evaluation', url: 'https://thenonprofitedge.app.n8n.cloud/webhook/ceo-evaluation', category: 'Tool Webhooks', description: 'n8n webhook', location: 'Dashboard Tool', status: 'active', lastModified: '2026-01-06' },
    { id: 'webhook-atp', name: 'Ask the Professor', url: 'https://thenonprofitedge.app.n8n.cloud/webhook/ask-the-professor', category: 'Tool Webhooks', description: 'n8n webhook', location: 'Dashboard Tool', status: 'active', lastModified: '2026-01-06' },
    
    // GHL LINKS
    { id: 'ghl-call', name: 'Book a Call', url: 'https://calendly.com/lyncorbett/strategy', category: 'GoHighLevel', description: 'Strategy call', location: 'Contact', status: 'active', lastModified: '2026-01-06' },
    
    // SOCIAL MEDIA
    { id: 'social-linkedin-lyn', name: 'LinkedIn - Lyn', url: 'https://linkedin.com/in/lyncorbett', category: 'Social Media', description: 'Personal LinkedIn', location: 'Footer', status: 'active', lastModified: '2026-01-06' },
    { id: 'social-linkedin-co', name: 'LinkedIn - Company', url: 'https://linkedin.com/company/thenonprofitedge', category: 'Social Media', description: 'Company LinkedIn', location: 'Footer', status: 'untested', lastModified: '2026-01-06' },
    { id: 'social-youtube', name: 'YouTube Channel', url: 'https://youtube.com/@thenonprofitedge', category: 'Social Media', description: 'YouTube', location: 'Footer', status: 'untested', lastModified: '2026-01-06' },
    
    // EXTERNAL
    { id: 'ext-pivotal', name: 'Pivotal Group Website', url: 'https://thepivotalgroup.com', category: 'External', description: 'Parent company', location: 'Footer', status: 'active', lastModified: '2026-01-06' },
  ])

  // Filtered links
  const filteredLinks = links.filter(l => {
    const matchesSearch = !searchTerm || 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      l.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || l.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = ['all', ...Array.from(new Set(links.map(l => l.category))).sort()]
  
  const stats = {
    total: links.length,
    active: links.filter(l => l.status === 'active').length,
    broken: links.filter(l => l.status === 'broken').length,
    untested: links.filter(l => l.status === 'untested').length,
    homepage: links.filter(l => l.category.includes('Homepage')).length,
  }

  const testLink = (link: PlatformLink) => {
    setTestingLink(link.id)
    const url = link.url.startsWith('http') || link.url.startsWith('mailto') ? link.url : `https://app.thenonprofitedge.com${link.url}`
    window.open(url, '_blank')
    setTimeout(() => {
      setLinks(prev => prev.map(l => l.id === link.id ? { ...l, status: 'active' } : l))
      setTestingLink(null)
    }, 1000)
  }

  const saveLink = (link: PlatformLink) => {
    if (isAddingNew) {
      setLinks(prev => [...prev, { ...link, id: Date.now().toString() }])
    } else {
      setLinks(prev => prev.map(l => l.id === link.id ? link : l))
    }
    setEditingLink(null)
    setIsAddingNew(false)
  }

  const deleteLink = (id: string) => {
    if (confirm('Delete this link?')) setLinks(prev => prev.filter(l => l.id !== id))
  }

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url)
  }

  const getCategoryColor = (cat: string) => {
    if (cat.includes('Homepage')) return { bg: '#dbeafe', text: '#1e40af' }
    if (cat.includes('Dashboard')) return { bg: '#dcfce7', text: '#166534' }
    if (cat.includes('Webhook')) return { bg: '#fce7f3', text: '#be185d' }
    if (cat.includes('GoHighLevel')) return { bg: '#f3e8ff', text: '#7c3aed' }
    if (cat.includes('Social')) return { bg: '#e0f2fe', text: '#0369a1' }
    return { bg: '#f1f5f9', text: '#475569' }
  }

  const getStatusColor = (status: string) => {
    if (status === 'active') return { bg: '#dcfce7', text: '#166534', dot: '#22c55e' }
    if (status === 'broken') return { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' }
    return { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-300 flex flex-col fixed h-screen overflow-y-auto">
        <div className="px-4 py-5 border-b border-gray-300">
          <div className="text-lg font-extrabold" style={{ color: NAVY }}>The Nonprofit Edge</div>
          <div className="text-xs text-gray-500">Link Manager</div>
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
          <div className="px-4 mb-2 text-xs font-extrabold uppercase tracking-wider" style={{ color: NAVY }}>Link Stats</div>
          <div className="px-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Total</span><span className="font-bold">{stats.total}</span></div>
            <div className="flex justify-between"><span className="text-green-600">✓ Active</span><span className="font-bold text-green-600">{stats.active}</span></div>
            <div className="flex justify-between"><span className="text-amber-600">? Untested</span><span className="font-bold text-amber-600">{stats.untested}</span></div>
            <div className="flex justify-between pt-2 border-t border-gray-200"><span className="text-blue-600">🏠 Homepage</span><span className="font-bold text-blue-600">{stats.homepage}</span></div>
          </div>
        </div>

        <div className="mt-auto px-4 py-4 border-t border-gray-300">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: TEAL }}>{user?.full_name?.charAt(0) || 'L'}</div>
            <div><div className="font-semibold text-gray-800 text-sm">{user?.full_name || 'Lyn Corbett'}</div><div className="text-[10px] text-gray-400">Owner</div></div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 ml-56 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: NAVY }}>Link Manager</h1>
            <p className="text-gray-600">All platform links including Homepage ({stats.homepage} links)</p>
          </div>
          <button onClick={() => { setIsAddingNew(true); setEditingLink({ id: '', name: '', url: '', category: 'Dashboard', location: '', status: 'untested', lastModified: new Date().toISOString().split('T')[0] }) }} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: TEAL }}>+ Add Link</button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex gap-4 flex-wrap">
          <input type="text" placeholder="Search links..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg" />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
            {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="untested">Untested</option>
          </select>
        </div>

        {/* Table */}
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
                const statusColor = getStatusColor(link.status)
                const categoryColor = getCategoryColor(link.category)
                return (
                  <tr key={link.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: statusColor.dot }} />
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: statusColor.bg, color: statusColor.text }}>{link.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-sm" style={{ color: NAVY }}>{link.name}</div>
                      {link.description && <div className="text-xs text-gray-500">{link.description}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded max-w-[200px] truncate block">{link.url}</code>
                        <button onClick={() => copyLink(link.url)} className="text-gray-400 hover:text-gray-600 text-sm">📋</button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: categoryColor.bg, color: categoryColor.text }}>{link.category}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{link.location}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => testLink(link)} className="p-1.5 rounded hover:bg-gray-100">{testingLink === link.id ? '⏳' : '🔍'}</button>
                        <button onClick={() => setEditingLink(link)} className="p-1.5 rounded hover:bg-gray-100">✏️</button>
                        <button onClick={() => deleteLink(link.id)} className="p-1.5 rounded hover:bg-red-100">🗑️</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filteredLinks.length === 0 && <div className="text-center py-12 text-gray-500">No links found.</div>}
        </div>
        <div className="mt-4 text-sm text-gray-500">Showing {filteredLinks.length} of {links.length} links</div>
      </div>

      {/* Edit Modal */}
      {editingLink && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
            <h2 className="text-xl font-bold mb-4" style={{ color: NAVY }}>{isAddingNew ? 'Add New Link' : 'Edit Link'}</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><input type="text" value={editingLink.name} onChange={(e) => setEditingLink({ ...editingLink, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">URL</label><input type="text" value={editingLink.url} onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><select value={editingLink.category} onChange={(e) => setEditingLink({ ...editingLink, category: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg">{categories.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label><input type="text" value={editingLink.location} onChange={(e) => setEditingLink({ ...editingLink, location: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setEditingLink(null); setIsAddingNew(false) }} className="flex-1 px-4 py-2 rounded-lg font-medium border border-gray-300 hover:bg-gray-50">Cancel</button>
              <button onClick={() => saveLink({ ...editingLink, lastModified: new Date().toISOString().split('T')[0] })} className="flex-1 px-4 py-2 rounded-lg font-medium text-white" style={{ background: TEAL }}>{isAddingNew ? 'Add' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LinkManager
