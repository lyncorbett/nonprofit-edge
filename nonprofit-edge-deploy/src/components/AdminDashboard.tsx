import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// ============================================
// PLATFORM ADMIN DASHBOARD
// Brand Colors: Navy #0D2C54 | Teal #0097A9
// UPDATED: Added "Add User" functionality
// ============================================

interface AdminDashboardProps {
  onBack: () => void
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'organizations' | 'users' | 'content' | 'events' | 'quotes'>('overview')
  const [organizations, setOrganizations] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [content, setContent] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalOrgs: 0,
    totalUsers: 0,
    activeThisWeek: 0,
    totalSessions: 0,
    totalDownloads: 0,
    atRiskUsers: 0,
    usersAtLimit: 0,
  })
  const [editModal, setEditModal] = useState<{ type: string | null; data: any }>({ type: null, data: null })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Load organizations
      const { data: orgsData, error: orgsError } = await supabase.from('organizations').select('*').order('created_at', { ascending: false })
      if (orgsError) console.error('Orgs error:', orgsError)
      setOrganizations(orgsData || [])

      // Load users with org info
      const { data: usersData, error: usersError } = await supabase.from('users').select('*, organization:organizations(name, tier)').order('created_at', { ascending: false })
      if (usersError) console.error('Users error:', usersError)
      setUsers(usersData || [])

      // Load site content
      const { data: contentData, error: contentError } = await supabase.from('site_content').select('*').order('category')
      if (contentError) console.error('Content error:', contentError)
      setContent(contentData || [])

      // Load events
      const { data: eventsData, error: eventsError } = await supabase.from('events').select('*').order('event_date', { ascending: true })
      if (eventsError) console.error('Events error:', eventsError)
      setEvents(eventsData || [])

      // Load quotes
      const { data: quotesData, error: quotesError } = await supabase.from('daily_quotes').select('*').order('created_at', { ascending: false })
      if (quotesError) console.error('Quotes error:', quotesError)
      setQuotes(quotesData || [])

      // Load usage stats
      const { data: usageData } = await supabase.from('monthly_usage').select('*')
      const totalSessions = usageData?.reduce((sum, u) => sum + (u.professor_sessions || 0), 0) || 0
      const totalDownloads = usageData?.reduce((sum, u) => sum + (u.report_downloads || 0), 0) || 0

      // Calculate at-risk (no login in 14+ days) and at-limit users
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
      
      const activeThisWeek = usersData?.filter(u => u.last_login && new Date(u.last_login) > weekAgo).length || 0
      const atRiskUsers = usersData?.filter(u => !u.last_login || new Date(u.last_login) < twoWeeksAgo).length || 0

      setStats({
        totalOrgs: orgsData?.length || 0,
        totalUsers: usersData?.length || 0,
        activeThisWeek,
        totalSessions,
        totalDownloads,
        atRiskUsers,
        usersAtLimit: 0,
      })
    } catch (error: any) {
      console.error('Error loading admin data:', error)
      setError(error.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  // Save functions
  const handleSaveOrg = async (org: any) => {
    setSaving(true)
    try {
      if (org.id) {
        // Update existing
        const { error } = await supabase.from('organizations').update({
          name: org.name,
          tier: org.tier,
          seats_total: org.seats_total,
          monthly_downloads_limit: org.monthly_downloads_limit,
          monthly_professor_limit: org.monthly_professor_limit,
          subscription_status: org.subscription_status,
        }).eq('id', org.id)
        if (error) throw error
      } else {
        // Create new organization
        const { error } = await supabase.from('organizations').insert([{
          name: org.name,
          tier: org.tier || 'starter',
          seats_total: org.seats_total || 1,
          monthly_downloads_limit: org.monthly_downloads_limit || 10,
          monthly_professor_limit: org.monthly_professor_limit || 100,
          subscription_status: org.subscription_status || 'active',
        }])
        if (error) throw error
      }
      await loadData()
      setEditModal({ type: null, data: null })
    } catch (error: any) {
      console.error('Error saving org:', error)
      alert('Failed to save organization: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveUser = async (user: any) => {
    setSaving(true)
    try {
      if (user.id) {
        // Update existing user
        const { error } = await supabase.from('users').update({
          full_name: user.full_name,
          email: user.email,
          role: user.role,
          is_active: user.is_active,
          organization_id: user.organization_id,
        }).eq('id', user.id)
        if (error) throw error
      } else {
        // Create new user - First create auth user, then profile
        // For now, just insert into users table (they'll need to sign up separately)
        const { error } = await supabase.from('users').insert([{
          full_name: user.full_name,
          email: user.email,
          role: user.role || 'member',
          is_active: user.is_active !== false,
          organization_id: user.organization_id,
        }])
        if (error) throw error
      }
      await loadData()
      setEditModal({ type: null, data: null })
    } catch (error: any) {
      console.error('Error saving user:', error)
      alert('Failed to save user: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveContent = async (item: any) => {
    setSaving(true)
    try {
      const { error } = await supabase.from('site_content').update({
        value: item.value,
        updated_at: new Date().toISOString(),
      }).eq('id', item.id)
      if (error) throw error
      await loadData()
      setEditModal({ type: null, data: null })
    } catch (error: any) {
      console.error('Error saving content:', error)
      alert('Failed to save content: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveEvent = async (event: any) => {
    setSaving(true)
    try {
      if (event.id) {
        const { error } = await supabase.from('events').update({
          title: event.title,
          description: event.description,
          event_date: event.event_date,
          event_time: event.event_time,
          event_type: event.event_type,
          tag: event.tag,
          tag_color: event.tag_color,
          registration_url: event.registration_url,
          is_members_only: event.is_members_only,
          is_active: event.is_active,
          updated_at: new Date().toISOString(),
        }).eq('id', event.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('events').insert([{
          title: event.title,
          description: event.description,
          event_date: event.event_date,
          event_time: event.event_time,
          event_type: event.event_type,
          tag: event.tag,
          tag_color: event.tag_color,
          registration_url: event.registration_url,
          is_members_only: event.is_members_only,
          is_active: true,
        }])
        if (error) throw error
      }
      await loadData()
      setEditModal({ type: null, data: null })
    } catch (error: any) {
      console.error('Error saving event:', error)
      alert('Failed to save event: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveQuote = async (quote: any) => {
    setSaving(true)
    try {
      if (quote.id) {
        const { error } = await supabase.from('daily_quotes').update({
          quote: quote.quote,
          author: quote.author,
          source: quote.source,
          display_date: quote.display_date,
          is_active: quote.is_active,
        }).eq('id', quote.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('daily_quotes').insert([{
          quote: quote.quote,
          author: quote.author,
          source: quote.source,
          display_date: quote.display_date,
          is_active: true,
        }])
        if (error) throw error
      }
      await loadData()
      setEditModal({ type: null, data: null })
    } catch (error: any) {
      console.error('Error saving quote:', error)
      alert('Failed to save quote: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (type: string, id: string) => {
    if (!confirm('Are you sure you want to delete this?')) return
    try {
      const { error } = await supabase.from(type).delete().eq('id', id)
      if (error) throw error
      await loadData()
    } catch (error: any) {
      console.error('Error deleting:', error)
      alert('Failed to delete: ' + error.message)
    }
  }

  const formatDate = (date: string) => {
    if (!date) return 'Never'
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getTierBadge = (tier: string) => {
    const colors: Record<string, string> = {
      starter: 'bg-gray-100 text-gray-700',
      essential: 'bg-gray-100 text-gray-700',
      professional: 'bg-[#e6f9fa] text-[#0097A9]',
      premium: 'bg-purple-100 text-purple-700',
      enterprise: 'bg-purple-100 text-purple-700',
    }
    return colors[tier] || colors.starter
  }

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      owner: 'bg-purple-100 text-purple-700',
      admin: 'bg-blue-100 text-blue-700',
      member: 'bg-gray-100 text-gray-700',
    }
    return colors[role] || colors.member
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0097A9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-[#0D2C54] text-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="text-white/70 hover:text-white transition">← Back to Dashboard</button>
              <div className="h-6 w-px bg-white/20"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0097A9] rounded-lg flex items-center justify-center text-xl">⚙️</div>
                <div>
                  <h1 className="text-xl font-bold">Platform Admin</h1>
                  <p className="text-sm text-white/60">Manage your platform</p>
                </div>
              </div>
            </div>
            <button onClick={loadData} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition">↻ Refresh</button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3">
          <div className="max-w-7xl mx-auto text-red-700 text-sm">
            ⚠️ {error}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'organizations', label: 'Organizations', icon: '🏢' },
              { id: 'users', label: 'Users', icon: '👥' },
              { id: 'content', label: 'Site Content', icon: '✏️' },
              { id: 'events', label: 'Events', icon: '📅' },
              { id: 'quotes', label: 'Daily Quotes', icon: '💡' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition whitespace-nowrap ${activeTab === tab.id ? 'border-[#0097A9] text-[#0097A9]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {[
                { label: 'Organizations', value: stats.totalOrgs, icon: '🏢', color: 'bg-blue-50 text-blue-700' },
                { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'bg-purple-50 text-purple-700' },
                { label: 'Active This Week', value: stats.activeThisWeek, icon: '✓', color: 'bg-green-50 text-green-700' },
                { label: 'Professor Sessions', value: stats.totalSessions, icon: '🎓', color: 'bg-[#e6f9fa] text-[#0097A9]' },
                { label: 'Downloads', value: stats.totalDownloads, icon: '📥', color: 'bg-amber-50 text-amber-700' },
                { label: 'At Risk', value: stats.atRiskUsers, icon: '⚠️', color: 'bg-red-50 text-red-700' },
                { label: 'At Limit', value: stats.usersAtLimit, icon: '🔒', color: 'bg-orange-50 text-orange-700' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-lg mb-3`}>{stat.icon}</div>
                  <div className="text-2xl font-bold text-[#0D2C54] mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-[#0D2C54] mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button onClick={() => { setActiveTab('users'); setEditModal({ type: 'user', data: { full_name: '', email: '', role: 'member', is_active: true, organization_id: null } }) }} className="w-full text-left px-4 py-3 bg-[#e6f9fa] hover:bg-[#d0f0f4] rounded-lg transition flex items-center gap-3">
                    <span>👤</span>
                    <span className="text-sm font-medium text-[#0097A9]">Add New User</span>
                  </button>
                  <button onClick={() => { setActiveTab('organizations'); setEditModal({ type: 'org', data: { name: '', tier: 'starter', seats_total: 1, monthly_downloads_limit: 10, monthly_professor_limit: 100, subscription_status: 'active' } }) }} className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition flex items-center gap-3">
                    <span>🏢</span>
                    <span className="text-sm font-medium">Add Organization</span>
                  </button>
                  <button onClick={() => setActiveTab('events')} className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition flex items-center gap-3">
                    <span>📅</span>
                    <span className="text-sm font-medium">Manage Events</span>
                  </button>
                </div>
              </div>

              {/* Recent Organizations */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="font-bold text-[#0D2C54]">Recent Organizations</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {organizations.slice(0, 4).map(org => (
                    <div key={org.id} className="px-6 py-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-[#0D2C54] text-sm">{org.name}</div>
                        <div className="text-xs text-gray-400">{formatDate(org.created_at)}</div>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${getTierBadge(org.tier)}`}>{org.tier}</span>
                    </div>
                  ))}
                  {organizations.length === 0 && <div className="px-6 py-4 text-sm text-gray-400">No organizations yet</div>}
                </div>
              </div>

              {/* Recent Users */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="font-bold text-[#0D2C54]">Recent Users</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {users.slice(0, 4).map(user => (
                    <div key={user.id} className="px-6 py-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-[#0D2C54] text-sm">{user.full_name || user.email}</div>
                        <div className="text-xs text-gray-400">{user.email}</div>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${getRoleBadge(user.role)}`}>{user.role}</span>
                    </div>
                  ))}
                  {users.length === 0 && <div className="px-6 py-4 text-sm text-gray-400">No users yet</div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Organizations Tab */}
        {activeTab === 'organizations' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-bold text-[#0D2C54]">All Organizations ({organizations.length})</h2>
              <button onClick={() => setEditModal({ type: 'org', data: { name: '', tier: 'starter', seats_total: 1, monthly_downloads_limit: 10, monthly_professor_limit: 100, subscription_status: 'active' } })} className="px-4 py-2 bg-[#0097A9] text-white rounded-lg text-sm font-medium hover:bg-[#007d8a] transition">+ Add Organization</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Organization</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Tier</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Seats</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Created</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {organizations.map(org => (
                    <tr key={org.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-[#0D2C54]">{org.name}</td>
                      <td className="px-6 py-4"><span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${getTierBadge(org.tier)}`}>{org.tier}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-600">{org.seats_total}</td>
                      <td className="px-6 py-4"><span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${org.subscription_status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{org.subscription_status}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(org.created_at)}</td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button onClick={() => setEditModal({ type: 'org', data: { ...org } })} className="text-[#0097A9] hover:underline text-sm">Edit</button>
                        <button onClick={() => handleDelete('organizations', org.id)} className="text-red-500 hover:underline text-sm">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {organizations.length === 0 && (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No organizations yet. Add your first one!</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab - UPDATED WITH ADD USER BUTTON */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-[#0D2C54]">All Users ({users.length})</h2>
                <p className="text-sm text-gray-500 mt-1">Manage team members and their access levels.</p>
              </div>
              <button onClick={() => setEditModal({ type: 'user', data: { full_name: '', email: '', role: 'member', is_active: true, organization_id: organizations[0]?.id || null } })} className="px-4 py-2 bg-[#0097A9] text-white rounded-lg text-sm font-medium hover:bg-[#007d8a] transition">+ Add User</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Organization</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Last Login</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-[#0D2C54]">{user.full_name || 'No name'}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.organization?.name || 'N/A'}</td>
                      <td className="px-6 py-4"><span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${getRoleBadge(user.role)}`}>{user.role}</span></td>
                      <td className="px-6 py-4"><span className={`text-xs font-semibold px-2 py-1 rounded-full ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{user.is_active ? 'Active' : 'Inactive'}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(user.last_login)}</td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button onClick={() => setEditModal({ type: 'user', data: { ...user } })} className="text-[#0097A9] hover:underline text-sm">Edit</button>
                        <button onClick={() => handleDelete('users', user.id)} className="text-red-500 hover:underline text-sm">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No users found. Click "+ Add User" to add your first team member.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Site Content Tab */}
        {activeTab === 'content' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold text-[#0D2C54]">Site Content</h2>
              <p className="text-sm text-gray-500 mt-1">Edit text and copy throughout the platform without touching code.</p>
            </div>
            <div className="divide-y divide-gray-100">
              {content.map(item => (
                <div key={item.id} className="px-6 py-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-medium text-[#0D2C54]">{item.label}</div>
                    <div className="text-sm text-gray-500 mt-1 line-clamp-2">{item.value}</div>
                    <div className="text-xs text-gray-400 mt-2">Key: {item.key} • Updated: {formatDate(item.updated_at)}</div>
                  </div>
                  <button onClick={() => setEditModal({ type: 'content', data: { ...item } })} className="text-[#0097A9] hover:underline text-sm whitespace-nowrap">Edit</button>
                </div>
              ))}
              {content.length === 0 && (
                <div className="px-6 py-12 text-center text-gray-500">No content items found. Run the database setup SQL first.</div>
              )}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-[#0D2C54]">Events & Calendar</h2>
                <p className="text-sm text-gray-500 mt-1">Manage webinars, trainings, and member events.</p>
              </div>
              <button onClick={() => setEditModal({ type: 'event', data: { title: '', description: '', event_date: '', event_time: '', event_type: 'webinar', tag: 'WEBINAR', tag_color: 'bg-teal-100 text-teal-700', is_members_only: false, is_active: true } })} className="px-4 py-2 bg-[#0097A9] text-white rounded-lg text-sm font-medium hover:bg-[#007d8a] transition">+ Add Event</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Event</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {events.map(event => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-[#0D2C54]">{event.title}</div>
                        <div className="text-sm text-gray-500">{event.description}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(event.event_date)} {event.event_time && `at ${event.event_time}`}</td>
                      <td className="px-6 py-4"><span className={`text-xs font-semibold px-2 py-1 rounded ${event.tag_color}`}>{event.tag}</span></td>
                      <td className="px-6 py-4"><span className={`text-xs font-semibold px-2 py-1 rounded-full ${event.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{event.is_active ? 'Active' : 'Inactive'}</span></td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button onClick={() => setEditModal({ type: 'event', data: { ...event } })} className="text-[#0097A9] hover:underline text-sm">Edit</button>
                        <button onClick={() => handleDelete('events', event.id)} className="text-red-500 hover:underline text-sm">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {events.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No events yet. Add your first one!</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Daily Quotes Tab */}
        {activeTab === 'quotes' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-[#0D2C54]">Daily Quotes</h2>
                <p className="text-sm text-gray-500 mt-1">Manage inspirational quotes shown at the top of the dashboard.</p>
              </div>
              <button onClick={() => setEditModal({ type: 'quote', data: { quote: '', author: '', source: '', display_date: '', is_active: true } })} className="px-4 py-2 bg-[#0097A9] text-white rounded-lg text-sm font-medium hover:bg-[#007d8a] transition">+ Add Quote</button>
            </div>
            <div className="divide-y divide-gray-100">
              {quotes.map(quote => (
                <div key={quote.id} className="px-6 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-[#0D2C54] italic">"{quote.quote}"</div>
                      <div className="text-sm text-gray-500 mt-2">— {quote.author}{quote.source && `, ${quote.source}`}</div>
                      <div className="flex items-center gap-3 mt-2">
                        {quote.display_date && <span className="text-xs text-gray-400">Display date: {formatDate(quote.display_date)}</span>}
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${quote.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{quote.is_active ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                    <div className="space-x-3">
                      <button onClick={() => setEditModal({ type: 'quote', data: { ...quote } })} className="text-[#0097A9] hover:underline text-sm">Edit</button>
                      <button onClick={() => handleDelete('daily_quotes', quote.id)} className="text-red-500 hover:underline text-sm">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {quotes.length === 0 && (
                <div className="px-6 py-12 text-center text-gray-500">No quotes yet. Add your first one!</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editModal.type && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="font-bold text-[#0D2C54]">
                {editModal.type === 'org' && (editModal.data.id ? 'Edit Organization' : 'Add Organization')}
                {editModal.type === 'user' && (editModal.data.id ? 'Edit User' : 'Add User')}
                {editModal.type === 'content' && 'Edit Content'}
                {editModal.type === 'event' && (editModal.data.id ? 'Edit Event' : 'Add Event')}
                {editModal.type === 'quote' && (editModal.data.id ? 'Edit Quote' : 'Add Quote')}
              </h3>
              <button onClick={() => setEditModal({ type: null, data: null })} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              {/* Organization Form */}
              {editModal.type === 'org' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name *</label>
                    <input type="text" value={editModal.data.name} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, name: e.target.value } })} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097A9]" placeholder="Acme Nonprofit" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tier</label>
                    <select value={editModal.data.tier} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, tier: e.target.value } })} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097A9]">
                      <option value="starter">Starter</option>
                      <option value="essential">Essential ($79/mo)</option>
                      <option value="professional">Professional ($159/mo)</option>
                      <option value="premium">Premium ($329/mo)</option>
                      <option value="enterprise">Enterprise (Custom)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                      <input type="number" value={editModal.data.seats_total} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, seats_total: parseInt(e.target.value) } })} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097A9]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Downloads/mo</label>
                      <input type="number" value={editModal.data.monthly_downloads_limit} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, monthly_downloads_limit: parseInt(e.target.value) } })} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097A9]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sessions/mo</label>
                      <input type="number" value={editModal.data.monthly_professor_limit} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, monthly_professor_limit: parseInt(e.target.value) } })} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097A9]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select value={editModal.data.subscription_status} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, subscription_status: e.target.value } })} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097A9]">
                      <option value="active">Active</option>
                      <option value="trialing">Trialing</option>
                      <option value="past_due">Past Due</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </>
              )}

              {/* User Form - UPDATED */}
              {editModal.type === 'user' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input type="text" value={editModal.data.full_name} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, full_name: e.target.value } })} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097A9]" placeholder="Jane Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input type="email" value={editModal.data.email} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, email: e.target.value } })} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097A9]" placeholder="jane@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                    <select value={editModal.data.organization_id || ''} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, organization_id: e.target.value || null } })} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097A9]">
                      <option value="">-- Select Organization --</option>
                      {organizations.map(org => (
                        <option key={org.id} value={org.id}>{org.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select value={editModal.data.role} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, role: e.target.value } })} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097A9]">
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                      <option value="owner">Owner</option>
                    </select>
                    <p className="text-xs text-gray-400 mt-1">Owner: Full access | Admin: Manage team | Member: Standard access</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="is_active" checked={editModal.data.is_active} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, is_active: e.target.checked } })} className="rounded border-gray-300" />
                    <label htmlFor="is_active" className="text-sm text-gray-700">Active User</label>
                  </div>
                  {!editModal.data.id && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                      💡 The user will need to sign up with this email to set their password and access the platform.
                    </div>
                  )}
                </>
              )}

              {/* Content Form */}
              {editModal.type === 'content' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{editModal.data.label}</label>
                    <textarea value={editModal.data.value} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, value: e.target.value } })} rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097A9]" />
                    <p className="text-xs text-gray-400 mt-1">Key: {editModal.data.key}</p>
                  </div>
                </>
              )}

              {/* Event Form */}
              {editModal.type === 'event' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input type="text" value={editModal.data.title} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, title: e.target.value } })} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097A9]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea value={editModal.data.description || ''} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, description: e.target.value } })} rows={2} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097A9]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input type="date" value={editModal.data.event_date} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, event_date: e.target.value } })} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097A9]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <input type="time" value={editModal.data.event_time || ''} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, event_time: e.target.value } })} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097A9]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tag Label</label>
                      <input type="text" value={editModal.data.tag} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, tag: e.target.value } })} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097A9]" placeholder="WEBINAR" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tag Color</label>
                      <select value={editModal.data.tag_color} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, tag_color: e.target.value } })} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097A9]">
                        <option value="bg-teal-100 text-teal-700">Teal</option>
                        <option value="bg-blue-100 text-blue-700">Blue</option>
                        <option value="bg-rose-100 text-rose-700">Rose</option>
                        <option value="bg-amber-100 text-amber-700">Amber</option>
                        <option value="bg-purple-100 text-purple-700">Purple</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration URL (optional)</label>
                    <input type="url" value={editModal.data.registration_url || ''} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, registration_url: e.target.value } })} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097A9]" placeholder="https://" />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={editModal.data.is_members_only} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, is_members_only: e.target.checked } })} className="rounded border-gray-300" />
                      <span className="text-sm text-gray-700">Members Only</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={editModal.data.is_active} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, is_active: e.target.checked } })} className="rounded border-gray-300" />
                      <span className="text-sm text-gray-700">Active</span>
                    </label>
                  </div>
                </>
              )}

              {/* Quote Form */}
              {editModal.type === 'quote' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quote</label>
                    <textarea value={editModal.data.quote} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, quote: e.target.value } })} rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097A9]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                    <input type="text" value={editModal.data.author} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, author: e.target.value } })} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097A9]" placeholder="Name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Source (optional)</label>
                    <input type="text" value={editModal.data.source || ''} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, source: e.target.value } })} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097A9]" placeholder="Book or article title" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Date (optional)</label>
                    <input type="date" value={editModal.data.display_date || ''} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, display_date: e.target.value } })} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097A9]" />
                    <p className="text-xs text-gray-400 mt-1">Leave blank to show randomly or set a specific date.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="quote_active" checked={editModal.data.is_active} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, is_active: e.target.checked } })} className="rounded border-gray-300" />
                    <label htmlFor="quote_active" className="text-sm text-gray-700">Active</label>
                  </div>
                </>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button onClick={() => setEditModal({ type: null, data: null })} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
              <button
                onClick={() => {
                  if (editModal.type === 'org') handleSaveOrg(editModal.data)
                  else if (editModal.type === 'user') handleSaveUser(editModal.data)
                  else if (editModal.type === 'content') handleSaveContent(editModal.data)
                  else if (editModal.type === 'event') handleSaveEvent(editModal.data)
                  else if (editModal.type === 'quote') handleSaveQuote(editModal.data)
                }}
                disabled={saving}
                className="px-4 py-2 bg-[#0097A9] text-white rounded-lg font-medium disabled:opacity-50 hover:bg-[#007d8a] transition"
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
