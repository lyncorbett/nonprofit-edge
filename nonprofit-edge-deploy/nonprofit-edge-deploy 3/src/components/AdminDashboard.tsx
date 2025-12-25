import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// ============================================
// ADMIN DASHBOARD
// For platform owner to manage organizations,
// users, and view platform stats
// ============================================

interface AdminDashboardProps {
  onBack: () => void
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'organizations' | 'users' | 'activity'>('overview')
  const [organizations, setOrganizations] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [activity, setActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrgs: 0,
    totalUsers: 0,
    activeThisMonth: 0,
    totalSessions: 0,
    totalDownloads: 0,
  })

  // Edit modal state
  const [editModal, setEditModal] = useState<{ type: 'org' | 'user' | null; data: any }>({ type: null, data: null })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load organizations
      const { data: orgsData } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false })
      setOrganizations(orgsData || [])

      // Load users with org info
      const { data: usersData } = await supabase
        .from('users')
        .select('*, organization:organizations(name)')
        .order('created_at', { ascending: false })
      setUsers(usersData || [])

      // Load recent activity
      const { data: activityData } = await supabase
        .from('activity_log')
        .select('*, user:users(full_name, email)')
        .order('created_at', { ascending: false })
        .limit(50)
      setActivity(activityData || [])

      // Load usage stats
      const { data: usageData } = await supabase
        .from('monthly_usage')
        .select('professor_sessions, report_downloads')
      
      const totalSessions = usageData?.reduce((sum, u) => sum + (u.professor_sessions || 0), 0) || 0
      const totalDownloads = usageData?.reduce((sum, u) => sum + (u.report_downloads || 0), 0) || 0

      setStats({
        totalOrgs: orgsData?.length || 0,
        totalUsers: usersData?.length || 0,
        activeThisMonth: usersData?.filter(u => u.last_login && new Date(u.last_login) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length || 0,
        totalSessions,
        totalDownloads,
      })
    } catch (error) {
      console.error('Error loading admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveOrg = async (org: any) => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          name: org.name,
          tier: org.tier,
          seats_total: org.seats_total,
          monthly_downloads_limit: org.monthly_downloads_limit,
          monthly_professor_limit: org.monthly_professor_limit,
          subscription_status: org.subscription_status,
        })
        .eq('id', org.id)

      if (error) throw error
      await loadData()
      setEditModal({ type: null, data: null })
    } catch (error) {
      console.error('Error saving org:', error)
      alert('Failed to save organization')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveUser = async (user: any) => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: user.full_name,
          email: user.email,
          role: user.role,
          is_active: user.is_active,
        })
        .eq('id', user.id)

      if (error) throw error
      await loadData()
      setEditModal({ type: null, data: null })
    } catch (error) {
      console.error('Error saving user:', error)
      alert('Failed to save user')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteOrg = async (orgId: string) => {
    if (!confirm('Are you sure? This will delete the organization and all its users.')) return
    
    try {
      const { error } = await supabase
        .from('organizations')
        .delete()
        .eq('id', orgId)

      if (error) throw error
      await loadData()
    } catch (error) {
      console.error('Error deleting org:', error)
      alert('Failed to delete organization')
    }
  }

  const formatDate = (date: string) => {
    if (!date) return 'Never'
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTierBadge = (tier: string) => {
    const colors: Record<string, string> = {
      starter: 'bg-gray-100 text-gray-700',
      professional: 'bg-[#e6f7f9] text-[#00a0b0]',
      enterprise: 'bg-purple-100 text-purple-700',
    }
    return colors[tier] || colors.starter
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      past_due: 'bg-amber-100 text-amber-700',
      trialing: 'bg-blue-100 text-blue-700',
    }
    return colors[status] || colors.active
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#00a0b0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-[#1a365d] text-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="text-white/70 hover:text-white transition">← Back to Dashboard</button>
              <div className="h-6 w-px bg-white/20"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00a0b0] rounded-lg flex items-center justify-center text-xl">⚙️</div>
                <div>
                  <h1 className="text-xl font-bold">Admin Dashboard</h1>
                  <p className="text-sm text-white/60">Manage your platform</p>
                </div>
              </div>
            </div>
            <button 
              onClick={loadData}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition"
            >
              ↻ Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'organizations', label: 'Organizations', icon: '🏢' },
              { id: 'users', label: 'Users', icon: '👥' },
              { id: 'activity', label: 'Activity Log', icon: '📋' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition ${
                  activeTab === tab.id
                    ? 'border-[#00a0b0] text-[#00a0b0]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
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
            <div className="grid grid-cols-5 gap-6">
              {[
                { label: 'Total Organizations', value: stats.totalOrgs, icon: '🏢', color: 'bg-blue-50 text-blue-700' },
                { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'bg-purple-50 text-purple-700' },
                { label: 'Active This Month', value: stats.activeThisMonth, icon: '✓', color: 'bg-green-50 text-green-700' },
                { label: 'Professor Sessions', value: stats.totalSessions, icon: '🎓', color: 'bg-[#e6f7f9] text-[#00a0b0]' },
                { label: 'Downloads', value: stats.totalDownloads, icon: '📥', color: 'bg-amber-50 text-amber-700' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-xl mb-4`}>
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-[#1a365d] mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Lists */}
            <div className="grid grid-cols-2 gap-8">
              {/* Recent Organizations */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="font-bold text-[#1a365d]">Recent Organizations</h2>
                  <button 
                    onClick={() => setActiveTab('organizations')}
                    className="text-sm text-[#00a0b0] hover:underline"
                  >
                    View all →
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {organizations.slice(0, 5).map(org => (
                    <div key={org.id} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-[#1a365d]">{org.name}</div>
                        <div className="text-sm text-gray-500">{formatDate(org.created_at)}</div>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${getTierBadge(org.tier)}`}>
                        {org.tier}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="font-bold text-[#1a365d]">Recent Activity</h2>
                  <button 
                    onClick={() => setActiveTab('activity')}
                    className="text-sm text-[#00a0b0] hover:underline"
                  >
                    View all →
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {activity.slice(0, 5).map(act => (
                    <div key={act.id} className="px-6 py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-[#1a365d]">{act.user?.full_name || 'Unknown'}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{act.action_type}</span>
                      </div>
                      <div className="text-xs text-gray-400">{formatDate(act.created_at)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Organizations Tab */}
        {activeTab === 'organizations' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold text-[#1a365d]">All Organizations ({organizations.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Organization</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tier</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Seats</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Limits</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {organizations.map(org => (
                    <tr key={org.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-[#1a365d]">{org.name}</div>
                        <div className="text-xs text-gray-400 font-mono">{org.id.slice(0, 8)}...</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${getTierBadge(org.tier)}`}>
                          {org.tier}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${getStatusBadge(org.subscription_status)}`}>
                          {org.subscription_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{org.seats_total}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div>{org.monthly_downloads_limit} downloads</div>
                        <div>{org.monthly_professor_limit === -1 ? '∞' : org.monthly_professor_limit} sessions</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(org.created_at)}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setEditModal({ type: 'org', data: { ...org } })}
                          className="text-[#00a0b0] hover:underline text-sm mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteOrg(org.id)}
                          className="text-red-500 hover:underline text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold text-[#1a365d]">All Users ({users.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Organization</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Login</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#00a0b0] to-[#008090] rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {user.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '?'}
                          </div>
                          <div>
                            <div className="font-medium text-[#1a365d]">{user.full_name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.organization?.name || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                          user.role === 'owner' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(user.last_login)}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setEditModal({ type: 'user', data: { ...user } })}
                          className="text-[#00a0b0] hover:underline text-sm"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold text-[#1a365d]">Activity Log (Last 50)</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {activity.map(act => (
                <div key={act.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                      {act.action_type === 'download' ? '📥' :
                       act.action_type === 'professor_session_start' ? '🎓' :
                       act.action_type === 'tool_start' ? '🛠️' :
                       act.action_type === 'login' ? '🔑' : '📋'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#1a365d]">{act.user?.full_name || 'Unknown User'}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{act.action_type.replace(/_/g, ' ')}</span>
                      </div>
                      {act.resource_name && (
                        <div className="text-sm text-gray-500">{act.resource_name}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">{formatDate(act.created_at)}</div>
                </div>
              ))}
              {activity.length === 0 && (
                <div className="px-6 py-12 text-center text-gray-500">
                  No activity recorded yet
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editModal.type && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-[#1a365d]">
                Edit {editModal.type === 'org' ? 'Organization' : 'User'}
              </h3>
              <button 
                onClick={() => setEditModal({ type: null, data: null })}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {editModal.type === 'org' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                    <input
                      type="text"
                      value={editModal.data.name}
                      onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, name: e.target.value } })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00a0b0]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tier</label>
                    <select
                      value={editModal.data.tier}
                      onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, tier: e.target.value } })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00a0b0]"
                    >
                      <option value="starter">Starter ($97/mo)</option>
                      <option value="professional">Professional ($297/mo)</option>
                      <option value="enterprise">Enterprise ($797/mo)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                      <input
                        type="number"
                        value={editModal.data.seats_total}
                        onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, seats_total: parseInt(e.target.value) } })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00a0b0]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Downloads/mo</label>
                      <input
                        type="number"
                        value={editModal.data.monthly_downloads_limit}
                        onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, monthly_downloads_limit: parseInt(e.target.value) } })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00a0b0]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sessions/mo</label>
                      <input
                        type="number"
                        value={editModal.data.monthly_professor_limit}
                        onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, monthly_professor_limit: parseInt(e.target.value) } })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00a0b0]"
                        placeholder="-1 for unlimited"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Status</label>
                    <select
                      value={editModal.data.subscription_status}
                      onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, subscription_status: e.target.value } })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00a0b0]"
                    >
                      <option value="active">Active</option>
                      <option value="trialing">Trialing</option>
                      <option value="past_due">Past Due</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </>
              )}

              {editModal.type === 'user' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editModal.data.full_name}
                      onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, full_name: e.target.value } })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00a0b0]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editModal.data.email}
                      onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, email: e.target.value } })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00a0b0]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={editModal.data.role}
                      onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, role: e.target.value } })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00a0b0]"
                    >
                      <option value="owner">Owner</option>
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={editModal.data.is_active}
                      onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, is_active: e.target.checked } })}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="is_active" className="text-sm text-gray-700">Active User</label>
                  </div>
                </>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setEditModal({ type: null, data: null })}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => editModal.type === 'org' ? handleSaveOrg(editModal.data) : handleSaveUser(editModal.data)}
                disabled={saving}
                className="px-4 py-2 bg-[#00a0b0] hover:bg-[#008090] text-white rounded-lg font-medium disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
