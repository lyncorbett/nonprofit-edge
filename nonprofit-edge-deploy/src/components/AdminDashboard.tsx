import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface AdminDashboardProps {
  onBack: () => void
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'organizations' | 'users'>('overview')
  const [organizations, setOrganizations] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrgs: 0,
    totalUsers: 0,
    totalSessions: 0,
    totalDownloads: 0,
  })
  const [editModal, setEditModal] = useState<{ type: 'org' | 'user' | null; data: any }>({ type: null, data: null })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const { data: orgsData } = await supabase.from('organizations').select('*').order('created_at', { ascending: false })
      setOrganizations(orgsData || [])

      const { data: usersData } = await supabase.from('users').select('*, organization:organizations(name)').order('created_at', { ascending: false })
      setUsers(usersData || [])

      const { data: usageData } = await supabase.from('monthly_usage').select('professor_sessions, report_downloads')
      const totalSessions = usageData?.reduce((sum, u) => sum + (u.professor_sessions || 0), 0) || 0
      const totalDownloads = usageData?.reduce((sum, u) => sum + (u.report_downloads || 0), 0) || 0

      setStats({
        totalOrgs: orgsData?.length || 0,
        totalUsers: usersData?.length || 0,
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
      const { error } = await supabase.from('organizations').update({
        name: org.name,
        tier: org.tier,
        seats_total: org.seats_total,
        monthly_downloads_limit: org.monthly_downloads_limit,
        monthly_professor_limit: org.monthly_professor_limit,
        subscription_status: org.subscription_status,
      }).eq('id', org.id)
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
      const { error } = await supabase.from('users').update({
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
      }).eq('id', user.id)
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

  const formatDate = (date: string) => {
    if (!date) return 'Never'
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getTierBadge = (tier: string) => {
    const colors: Record<string, string> = {
      starter: 'bg-gray-100 text-gray-700',
      professional: 'bg-[#e6f7f9] text-[#0097A9]',
      enterprise: 'bg-purple-100 text-purple-700',
    }
    return colors[tier] || colors.starter
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

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'organizations', label: 'Organizations', icon: '🏢' },
              { id: 'users', label: 'Users', icon: '👥' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition ${activeTab === tab.id ? 'border-[#0097A9] text-[#0097A9]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-4 gap-6">
            {[
              { label: 'Organizations', value: stats.totalOrgs, icon: '🏢', color: 'bg-blue-50 text-blue-700' },
              { label: 'Users', value: stats.totalUsers, icon: '👥', color: 'bg-purple-50 text-purple-700' },
              { label: 'Professor Sessions', value: stats.totalSessions, icon: '🎓', color: 'bg-[#e6f7f9] text-[#0097A9]' },
              { label: 'Downloads', value: stats.totalDownloads, icon: '📥', color: 'bg-amber-50 text-amber-700' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-xl mb-4`}>{stat.icon}</div>
                <div className="text-3xl font-bold text-[#0D2C54] mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'organizations' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold text-[#0D2C54]">All Organizations ({organizations.length})</h2>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Organization</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Tier</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Seats</th>
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
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(org.created_at)}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setEditModal({ type: 'org', data: { ...org } })} className="text-[#0097A9] hover:underline text-sm">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold text-[#0D2C54]">All Users ({users.length})</h2>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Organization</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#0D2C54]">{user.full_name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.organization?.name || 'N/A'}</td>
                    <td className="px-6 py-4"><span className="text-xs font-semibold px-2 py-1 rounded-full capitalize bg-gray-100 text-gray-700">{user.role}</span></td>
                    <td className="px-6 py-4"><span className={`text-xs font-semibold px-2 py-1 rounded-full ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{user.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setEditModal({ type: 'user', data: { ...user } })} className="text-[#0097A9] hover:underline text-sm">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editModal.type && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-[#0D2C54]">Edit {editModal.type === 'org' ? 'Organization' : 'User'}</h3>
              <button onClick={() => setEditModal({ type: null, data: null })} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {editModal.type === 'org' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" value={editModal.data.name} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, name: e.target.value } })} className="w-full border border-gray-200 rounded-lg px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tier</label>
                    <select value={editModal.data.tier} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, tier: e.target.value } })} className="w-full border border-gray-200 rounded-lg px-4 py-2">
                      <option value="starter">Starter</option>
                      <option value="professional">Professional</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                      <input type="number" value={editModal.data.seats_total} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, seats_total: parseInt(e.target.value) } })} className="w-full border border-gray-200 rounded-lg px-4 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Downloads</label>
                      <input type="number" value={editModal.data.monthly_downloads_limit} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, monthly_downloads_limit: parseInt(e.target.value) } })} className="w-full border border-gray-200 rounded-lg px-4 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sessions</label>
                      <input type="number" value={editModal.data.monthly_professor_limit} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, monthly_professor_limit: parseInt(e.target.value) } })} className="w-full border border-gray-200 rounded-lg px-4 py-2" />
                    </div>
                  </div>
                </>
              )}
              {editModal.type === 'user' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" value={editModal.data.full_name} onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, full_name: e.target.value } })} className="w-full border border-gray-200 rounded-lg px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={editModal.data.email} onChange={(e)
