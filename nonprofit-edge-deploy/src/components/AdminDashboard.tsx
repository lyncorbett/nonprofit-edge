import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface AdminDashboardProps {
  onBack: () => void
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [organizations, setOrganizations] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalOrgs: 0, totalUsers: 0, totalSessions: 0, totalDownloads: 0 })

  useEffect(() => { loadData() }, [])

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
      setStats({ totalOrgs: orgsData?.length || 0, totalUsers: usersData?.length || 0, totalSessions, totalDownloads })
    } catch (error) { console.error('Error:', error) }
    finally { setLoading(false) }
  }

  const formatDate = (date: string) => date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never'

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#0097A9] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="bg-[#0D2C54] text-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-white/70 hover:text-white">← Back</button>
            <h1 className="text-xl font-bold">Platform Admin</h1>
          </div>
          <button onClick={loadData} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm">↻ Refresh</button>
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 flex gap-6">
          {['overview', 'organizations', 'users'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`py-4 border-b-2 text-sm font-medium capitalize ${activeTab === tab ? 'border-[#0097A9] text-[#0097A9]' : 'border-transparent text-gray-500'}`}>{tab}</button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-4 gap-6">
            {[
              { label: 'Organizations', value: stats.totalOrgs, icon: '🏢' },
              { label: 'Users', value: stats.totalUsers, icon: '👥' },
              { label: 'Professor Sessions', value: stats.totalSessions, icon: '🎓' },
              { label: 'Downloads', value: stats.totalDownloads, icon: '📥' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl border p-6">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-[#0D2C54]">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'organizations' && (
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="px-6 py-4 border-b"><h2 className="font-bold text-[#0D2C54]">Organizations ({organizations.length})</h2></div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Tier</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Seats</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {organizations.map(org => (
                  <tr key={org.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-[#0D2C54]">{org.name}</td>
                    <td className="px-6 py-4"><span className="text-xs font-semibold px-2 py-1 rounded-full bg-[#e6f7f9] text-[#0097A9] capitalize">{org.tier}</span></td>
                    <td className="px-6 py-4 text-gray-600">{org.seats_total}</td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(org.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="px-6 py-4 border-b"><h2 className="font-bold text-[#0D2C54]">Users ({users.length})</h2></div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Organization</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#0D2C54]">{user.full_name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.organization?.name || 'N/A'}</td>
                    <td className="px-6 py-4"><span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 capitalize">{user.role}</span></td>
                    <td className="px-6 py-4"><span className={`text-xs font-semibold px-2 py-1 rounded-full ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{user.is_active ? 'Active' : 'Inactive'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
