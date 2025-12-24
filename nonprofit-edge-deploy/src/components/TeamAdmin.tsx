import React, { useState, useEffect } from 'react'
import { createInvitation, cancelInvitation, updateMemberRole, deactivateMember, fetchPendingInvitations } from '../lib/supabase'

// ============================================
// TEAM ADMIN PAGE
// ============================================

interface TeamAdminProps {
  organization: {
    id: string
    name: string
    tier: 'starter' | 'professional' | 'enterprise'
    seats_total: number
    monthly_downloads_limit: number
    monthly_professor_limit: number
  }
  currentUser: {
    id: string
    full_name: string
    email: string
    role: 'owner' | 'admin' | 'member'
  }
  teamMembers: Array<{
    id: string
    full_name: string
    email: string
    role: 'owner' | 'admin' | 'member'
    is_active: boolean
    last_login?: string
    created_at: string
  }>
  onBack: () => void
  onRefresh: () => void
}

const TeamAdmin: React.FC<TeamAdminProps> = ({
  organization,
  currentUser,
  teamMembers,
  onBack,
  onRefresh,
}) => {
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [pendingInvites, setPendingInvites] = useState<any[]>([])
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null)

  const activeMembers = teamMembers.filter(m => m.is_active)
  const seatsUsed = activeMembers.length + pendingInvites.length
  const seatsRemaining = organization.seats_total - seatsUsed
  const canChangeRoles = currentUser.role === 'owner'

  useEffect(() => {
    loadInvites()
  }, [])

  const loadInvites = async () => {
    try {
      const invites = await fetchPendingInvitations(organization.id)
      setPendingInvites(invites || [])
    } catch (err) {
      console.error('Error loading invites:', err)
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim()) return

    if (seatsRemaining <= 0) {
      setMessage({ type: 'error', text: `No seats available. Upgrade your plan to add more team members.` })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      await createInvitation(organization.id, currentUser.id, inviteEmail.trim(), inviteRole)
      setMessage({ type: 'success', text: `Invitation sent to ${inviteEmail}` })
      setInviteEmail('')
      setInviteRole('member')
      await loadInvites()
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to send invitation' })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelInvite = async (inviteId: string) => {
    try {
      await cancelInvitation(inviteId)
      await loadInvites()
    } catch (err) {
      console.error('Error canceling invite:', err)
    }
  }

  const handleUpdateRole = async (memberId: string, newRole: 'admin' | 'member') => {
    try {
      await updateMemberRole(memberId, newRole)
      onRefresh()
    } catch (err) {
      console.error('Error updating role:', err)
    }
  }

  const handleRemove = async (memberId: string) => {
    try {
      await deactivateMember(memberId)
      setConfirmRemove(null)
      onRefresh()
    } catch (err) {
      console.error('Error removing member:', err)
    }
  }

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  
  const getTimeAgo = (date?: string) => {
    if (!date) return 'Never'
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
    if (diff === 0) return 'Today'
    if (diff === 1) return 'Yesterday'
    if (diff < 7) return `${diff} days ago`
    return formatDate(date)
  }

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      owner: 'bg-purple-100 text-purple-700',
      admin: 'bg-blue-100 text-blue-700',
      member: 'bg-gray-100 text-gray-700'
    }
    return colors[role] || colors.member
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="text-gray-500 hover:text-gray-800 transition">← Back</button>
              <div>
                <h1 className="text-xl font-bold text-[#1a365d]">Team Management</h1>
                <p className="text-sm text-gray-500">{organization.name}</p>
              </div>
            </div>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full capitalize ${
              organization.tier === 'enterprise' ? 'bg-purple-100 text-purple-700' :
              organization.tier === 'professional' ? 'bg-[#e6f7f9] text-[#00a0b0]' :
              'bg-gray-100 text-gray-700'
            }`}>
              {organization.tier} Plan
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Seats Overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#1a365d]">Team Seats</h2>
            <div className="text-right">
              <span className="text-2xl font-bold text-[#1a365d]">{seatsUsed}</span>
              <span className="text-gray-400"> / {organization.seats_total}</span>
            </div>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full rounded-full transition-all ${
                seatsRemaining === 0 ? 'bg-red-500' : seatsRemaining <= 1 ? 'bg-amber-500' : 'bg-[#00a0b0]'
              }`}
              style={{ width: `${(seatsUsed / organization.seats_total) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{seatsRemaining} seat{seatsRemaining !== 1 ? 's' : ''} remaining</span>
            {seatsRemaining === 0 && (
              <a href="#" className="text-[#00a0b0] font-semibold hover:underline">Upgrade for more seats →</a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Team List */}
          <div className="col-span-2 space-y-6">
            {/* Active Members */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-base font-bold text-[#1a365d]">Team Members ({activeMembers.length})</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {activeMembers.map(member => {
                  const isCurrentUser = member.id === currentUser.id
                  const initials = member.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
                  
                  return (
                    <div key={member.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #00a0b0, #008090)' }}>
                            {initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[#1a365d]">{member.full_name}</span>
                              {isCurrentUser && <span className="text-xs text-gray-400">(you)</span>}
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getRoleBadge(member.role)}`}>{member.role}</span>
                            </div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                            <div className="text-xs text-gray-400 mt-1">Last active: {getTimeAgo(member.last_login)}</div>
                          </div>
                        </div>

                        {!isCurrentUser && member.role !== 'owner' && (
                          <div className="flex items-center gap-2">
                            {canChangeRoles && (
                              <select
                                value={member.role}
                                onChange={(e) => handleUpdateRole(member.id, e.target.value as 'admin' | 'member')}
                                className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#00a0b0]"
                              >
                                <option value="member">Member</option>
                                <option value="admin">Admin</option>
                              </select>
                            )}
                            
                            {confirmRemove === member.id ? (
                              <div className="flex items-center gap-2">
                                <button onClick={() => handleRemove(member.id)} className="text-xs bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">Confirm</button>
                                <button onClick={() => setConfirmRemove(null)} className="text-xs text-gray-500">Cancel</button>
                              </div>
                            ) : (
                              <button onClick={() => setConfirmRemove(member.id)} className="text-sm text-red-500 hover:text-red-700">Remove</button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Pending Invitations */}
            {pendingInvites.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-base font-bold text-[#1a365d]">Pending Invitations ({pendingInvites.length})</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {pendingInvites.map(invite => (
                    <div key={invite.id} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">✉️</div>
                        <div>
                          <div className="font-medium text-[#1a365d]">{invite.email}</div>
                          <div className="text-xs text-gray-400">Invited {formatDate(invite.created_at)}</div>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getRoleBadge(invite.role)}`}>{invite.role}</span>
                      </div>
                      <button onClick={() => handleCancelInvite(invite.id)} className="text-sm text-red-500 hover:text-red-700">Cancel</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Invite Form */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200">
                <h3 className="font-bold text-[#1a365d]">Invite Team Member</h3>
              </div>
              <div className="p-5">
                <form onSubmit={handleInvite}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@nonprofit.org"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00a0b0]"
                      disabled={seatsRemaining === 0}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as 'admin' | 'member')}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00a0b0]"
                      disabled={seatsRemaining === 0}
                    >
                      <option value="member">Member — Can use all tools</option>
                      <option value="admin">Admin — Can manage team</option>
                    </select>
                  </div>
                  
                  {message && (
                    <div className={`mb-4 text-sm p-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {message.text}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={loading || seatsRemaining === 0 || !inviteEmail.trim()}
                    className={`w-full py-2.5 rounded-lg font-semibold text-sm transition ${
                      loading || seatsRemaining === 0 || !inviteEmail.trim()
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-[#00a0b0] hover:bg-[#008090] text-white'
                    }`}
                  >
                    {loading ? 'Sending...' : seatsRemaining === 0 ? 'No seats available' : 'Send Invitation'}
                  </button>
                </form>
              </div>
            </div>

            {/* Plan Info */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-[#1a365d] mb-3">Your Plan</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Plan</span>
                  <span className="font-semibold text-[#1a365d] capitalize">{organization.tier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Team Seats</span>
                  <span className="font-semibold text-[#1a365d]">{organization.seats_total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Downloads/mo</span>
                  <span className="font-semibold text-[#1a365d]">{organization.monthly_downloads_limit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Professor Sessions</span>
                  <span className="font-semibold text-[#1a365d]">{organization.monthly_professor_limit === -1 ? 'Unlimited' : organization.monthly_professor_limit}</span>
                </div>
              </div>
              {organization.tier !== 'enterprise' && (
                <a href="#" className="block mt-4 text-center text-sm text-[#00a0b0] font-semibold hover:underline">Upgrade Plan →</a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamAdmin
