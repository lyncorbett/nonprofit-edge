/**
 * THE NONPROFIT EDGE - Admin Dashboard
 * 
 * UPDATED: Navigation links to Marketing Analytics & Link Manager
 * ADDED: Asha Gipson as admin user
 * 
 * Brand Colors: Navy #0D2C54 | Teal #0097A9
 */

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const NAVY = '#0D2C54'
const TEAL = '#0097A9'

interface AdminDashboardProps {
  onBack: () => void
  onNavigate?: (page: string) => void
  user?: any
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack, onNavigate, user }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'organizations' | 'users' | 'content' | 'events' | 'quotes'>('overview')
  const [organizations, setOrganizations] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrgs: 0,
    totalUsers: 0,
    activeThisWeek: 0,
  })
  const [editModal, setEditModal] = useState<{ type: string | null; data: any }>({ type: null, data: null })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const { data: orgsData } = await supabase.from('organizations').select('*').order('created_at', { ascending: false })
      setOrganizations(orgsData || [])

      const { data: usersData } = await supabase.from('users').select('*, organization:organizations(name, tier)').order('created_at', { ascending: false })
      setUsers(usersData || [])

      const { data: eventsData } = await supabase.from('events').select('*').order('event_date', { ascending: true })
      setEvents(eventsData || [])

      const { data: quotesData } = await supabase.from('daily_quotes').select('*').order('created_at', { ascending: false })
      setQuotes(quotesData || [])

      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const activeThisWeek = usersData?.filter(u => u.last_login && new Date(u.last_login) > weekAgo).length || 0

      setStats({
        totalOrgs: orgsData?.length || 0,
        totalUsers: usersData?.length || 0,
        activeThisWeek,
      })
    } catch (error) {
      console.error('Error loading admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Navigation handler
  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page)
    } else {
      window.location.href = `/${page}`
    }
  }

  // Save handlers
  const handleSaveUser = async (userData: any) => {
    setSaving(true)
    try {
      if (userData.id) {
        await supabase.from('users').update({
          full_name: userData.full_name,
          email: userData.email,
          role: userData.role,
          is_active: userData.is_active,
        }).eq('id', userData.id)
      } else {
        await supabase.from('users').insert([{
          full_name: userData.full_name,
          email: userData.email,
          role: userData.role || 'member',
          is_active: true,
        }])
      }
      await loadData()
      setEditModal({ type: null, data: null })
    } catch (error: any) {
      alert('Failed to save: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveOrg = async (org: any) => {
    setSaving(true)
    try {
      if (org.id) {
        await supabase.from('organizations').update({
          name: org.name,
          tier: org.tier,
          seats_total: org.seats_total,
          subscription_status: org.subscription_status,
        }).eq('id', org.id)
      } else {
        await supabase.from('organizations').insert([{
          name: org.name,
          tier: org.tier || 'essential',
          seats_total: org.seats_total || 1,
          subscription_status: 'active',
        }])
      }
      await loadData()
      setEditModal({ type: null, data: null })
    } catch (error: any) {
      alert('Failed to save: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveEvent = async (event: any) => {
    setSaving(true)
    try {
      if (event.id) {
        await supabase.from('events').update({
          title: event.title,
          description: event.description,
          event_date: event.event_date,
          event_time: event.event_time,
          tag: event.tag,
          registration_url: event.registration_url,
          is_members_only: event.is_members_only,
          is_active: event.is_active,
        }).eq('id', event.id)
      } else {
        await supabase.from('events').insert([event])
      }
      await loadData()
      setEditModal({ type: null, data: null })
    } catch (error: any) {
      alert('Failed to save: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveQuote = async (quote: any) => {
    setSaving(true)
    try {
      if (quote.id) {
        await supabase.from('daily_quotes').update({
          quote: quote.quote,
          author: quote.author,
          is_active: quote.is_active,
        }).eq('id', quote.id)
      } else {
        await supabase.from('daily_quotes').insert([quote])
      }
      await loadData()
      setEditModal({ type: null, data: null })
    } catch (error: any) {
      alert('Failed to save: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col fixed h-screen">
        <div className="p-5 border-b border-gray-200">
          <div className="text-lg font-bold" style={{ color: NAVY }}>The Nonprofit Edge</div>
          <div className="text-xs text-gray-500">Admin Panel</div>
        </div>

        {/* Navigation */}
        <div className="p-4">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Navigation</div>
          <nav className="space-y-1">
            <button onClick={onBack} className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
              ← Back to Dashboard
            </button>
            <button onClick={() => handleNavigate('owner-dashboard')} className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg flex items-center gap-2">
              📊 Owner Dashboard
            </button>
          </nav>
        </div>

        {/* Admin Tools */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Admin Tools</div>
          <nav className="space-y-1">
            <button onClick={() => setActiveTab('users')} className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2 ${activeTab === 'users' ? 'bg-[#e6f7f9] text-[#0097A9] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
              👥 User Management
            </button>
            <button onClick={() => setActiveTab('organizations')} className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2 ${activeTab === 'organizations' ? 'bg-[#e6f7f9] text-[#0097A9] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
              🏢 Organizations
            </button>
            <button onClick={() => handleNavigate('marketing')} className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-2">
              📈 Marketing Analytics
            </button>
            <button onClick={() => handleNavigate('link-manager')} className="w-full text-left px-3 py-2 text-sm text-violet-600 hover:bg-violet-50 rounded-lg flex items-center gap-2">
              🔗 Link Manager
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Content</div>
          <nav className="space-y-1">
            <button onClick={() => setActiveTab('events')} className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2 ${activeTab === 'events' ? 'bg-[#e6f7f9] text-[#0097A9] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
              📅 Events
            </button>
            <button onClick={() => setActiveTab('quotes')} className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2 ${activeTab === 'quotes' ? 'bg-[#e6f7f9] text-[#0097A9] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
              💡 Daily Quotes
            </button>
          </nav>
        </div>

        {/* Quick Stats */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Quick Stats</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Organizations</span><span className="font-bold">{stats.totalOrgs}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Users</span><span className="font-bold">{stats.totalUsers}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Active (7d)</span><span className="font-bold text-green-600">{stats.activeThisWeek}</span></div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-56 p-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
          <>
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold" style={{ color: NAVY }}>User Management</h1>
                  <button onClick={() => setEditModal({ type: 'user', data: { full_name: '', email: '', role: 'member', is_active: true } })} className="px-4 py-2 text-white rounded-lg text-sm font-medium" style={{ backgroundColor: TEAL }}>+ Add User</button>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Organization</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium" style={{ color: NAVY }}>{u.full_name}</td>
                          <td className="px-6 py-4 text-gray-600 text-sm">{u.email}</td>
                          <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'owner' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>{u.role}</span></td>
                          <td className="px-6 py-4 text-gray-600 text-sm">{u.organization?.name || '—'}</td>
                          <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-medium ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.is_active ? 'Active' : 'Inactive'}</span></td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => setEditModal({ type: 'user', data: u })} className="text-gray-400 hover:text-gray-600">✏️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Organizations Tab */}
            {activeTab === 'organizations' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold" style={{ color: NAVY }}>Organizations</h1>
                  <button onClick={() => setEditModal({ type: 'org', data: { name: '', tier: 'essential', seats_total: 1, subscription_status: 'active' } })} className="px-4 py-2 text-white rounded-lg text-sm font-medium" style={{ backgroundColor: TEAL }}>+ Add Organization</button>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tier</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Seats</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {organizations.map((org) => (
                        <tr key={org.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium" style={{ color: NAVY }}>{org.name}</td>
                          <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-medium ${org.tier === 'premium' ? 'bg-amber-100 text-amber-700' : org.tier === 'professional' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{org.tier}</span></td>
                          <td className="px-6 py-4 text-gray-600">{org.seats_used || 0}/{org.seats_total}</td>
                          <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-medium ${org.subscription_status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{org.subscription_status}</span></td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => setEditModal({ type: 'org', data: org })} className="text-gray-400 hover:text-gray-600">✏️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold" style={{ color: NAVY }}>Events</h1>
                  <button onClick={() => setEditModal({ type: 'event', data: { title: '', event_date: '', event_time: '', tag: 'WEBINAR', is_active: true } })} className="px-4 py-2 text-white rounded-lg text-sm font-medium" style={{ backgroundColor: TEAL }}>+ Add Event</button>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {events.map((event) => (
                        <tr key={event.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium" style={{ color: NAVY }}>{event.title}</td>
                          <td className="px-6 py-4 text-gray-600">{event.event_date}</td>
                          <td className="px-6 py-4 text-gray-600">{event.event_time}</td>
                          <td className="px-6 py-4"><span className="px-2 py-1 rounded text-xs font-medium bg-teal-100 text-teal-700">{event.tag}</span></td>
                          <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-medium ${event.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{event.is_active ? 'Active' : 'Inactive'}</span></td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => setEditModal({ type: 'event', data: event })} className="text-gray-400 hover:text-gray-600">✏️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Quotes Tab */}
            {activeTab === 'quotes' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold" style={{ color: NAVY }}>Daily Quotes</h1>
                  <button onClick={() => setEditModal({ type: 'quote', data: { quote: '', author: '', is_active: true } })} className="px-4 py-2 text-white rounded-lg text-sm font-medium" style={{ backgroundColor: TEAL }}>+ Add Quote</button>
                </div>
                <div className="grid gap-4">
                  {quotes.map((quote) => (
                    <div key={quote.id} className="bg-white rounded-xl border border-gray-200 p-5">
                      <p className="text-gray-700 italic mb-2">"{quote.quote}"</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">— {quote.author}</span>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${quote.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{quote.is_active ? 'Active' : 'Inactive'}</span>
                          <button onClick={() => setEditModal({ type: 'quote', data: quote })} className="text-gray-400 hover:text-gray-600">✏️</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Edit Modal */}
      {editModal.type && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
            <h2 className="text-xl font-bold mb-4" style={{ color: NAVY }}>
              {editModal.data.id ? 'Edit' : 'Add'} {editModal.type === 'user' ? 'User' : editModal.type === 'org' ? 'Organization' : editModal.type === 'event' ? 'Event' : 'Quote'}
            </h2>
            
            {editModal.type === 'user' && (
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input type="text" value={editModal.data.full_name || ''} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, full_name: e.target.value } })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={editModal.data.email || ''} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, email: e.target.value } })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Role</label><select value={editModal.data.role || 'member'} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, role: e.target.value } })} className="w-full px-4 py-2 border border-gray-300 rounded-lg"><option value="member">Member</option><option value="admin">Admin</option><option value="owner">Owner</option></select></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={editModal.data.is_active} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, is_active: e.target.checked } })} /><label className="text-sm text-gray-700">Active</label></div>
              </div>
            )}

            {editModal.type === 'org' && (
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><input type="text" value={editModal.data.name || ''} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, name: e.target.value } })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Tier</label><select value={editModal.data.tier || 'essential'} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, tier: e.target.value } })} className="w-full px-4 py-2 border border-gray-300 rounded-lg"><option value="essential">Essential</option><option value="professional">Professional</option><option value="premium">Premium</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Seats</label><input type="number" value={editModal.data.seats_total || 1} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, seats_total: parseInt(e.target.value) } })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
              </div>
            )}

            {editModal.type === 'event' && (
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input type="text" value={editModal.data.title || ''} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, title: e.target.value } })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Date</label><input type="date" value={editModal.data.event_date || ''} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, event_date: e.target.value } })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Time</label><input type="text" placeholder="2:00 PM EST" value={editModal.data.event_time || ''} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, event_time: e.target.value } })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><select value={editModal.data.tag || 'WEBINAR'} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, tag: e.target.value } })} className="w-full px-4 py-2 border border-gray-300 rounded-lg"><option value="WEBINAR">Webinar</option><option value="WORKSHOP">Workshop</option><option value="LIVE Q&A">Live Q&A</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Registration URL</label><input type="text" value={editModal.data.registration_url || ''} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, registration_url: e.target.value } })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={editModal.data.is_active} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, is_active: e.target.checked } })} /><label className="text-sm text-gray-700">Active</label></div>
              </div>
            )}

            {editModal.type === 'quote' && (
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Quote</label><textarea value={editModal.data.quote || ''} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, quote: e.target.value } })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" rows={3} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Author</label><input type="text" value={editModal.data.author || ''} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, author: e.target.value } })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={editModal.data.is_active} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, is_active: e.target.checked } })} /><label className="text-sm text-gray-700">Active</label></div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditModal({ type: null, data: null })} className="flex-1 px-4 py-2 rounded-lg font-medium border border-gray-300 hover:bg-gray-50">Cancel</button>
              <button 
                onClick={() => {
                  if (editModal.type === 'user') handleSaveUser(editModal.data)
                  else if (editModal.type === 'org') handleSaveOrg(editModal.data)
                  else if (editModal.type === 'event') handleSaveEvent(editModal.data)
                  else if (editModal.type === 'quote') handleSaveQuote(editModal.data)
                }}
                disabled={saving}
                className="flex-1 px-4 py-2 rounded-lg font-medium text-white disabled:opacity-50"
                style={{ backgroundColor: TEAL }}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
