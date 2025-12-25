import React, { useState } from 'react'

// ============================================
// THE NONPROFIT EDGE - MEMBER DASHBOARD
// Brand Colors: Navy #1a365d | Teal #00a0b0
// ============================================

interface DashboardProps {
  user: {
    id: string
    full_name: string
    email: string
    role: 'owner' | 'admin' | 'member'
  }
  organization: {
    id: string
    name: string
    tier: 'starter' | 'professional' | 'enterprise'
    seats_total: number
    monthly_downloads_limit: number
    monthly_professor_limit: number
  }
  usage: {
    professor_sessions: number
    report_downloads: number
    templates_downloaded: number
    tools_started: number
    tools_completed: number
  }
  teamCount: number
  onNavigate: (page: string) => void
  onDownload: (name: string, type: 'report' | 'template') => Promise<{ success: boolean; message?: string }>
  onStartProfessor: () => Promise<{ success: boolean; message?: string }>
  onLogout: () => void
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  organization,
  usage,
  teamCount,
  onNavigate,
  onDownload,
  onStartProfessor,
  onLogout,
}) => {
  const [activeNav, setActiveNav] = useState('dashboard')
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null)
  const [professorLoading, setProfessorLoading] = useState(false)

  const canManageTeam = user.role === 'owner' || user.role === 'admin'
  const initials = user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()

  const professorRemaining = organization.monthly_professor_limit === -1
    ? '∞'
    : organization.monthly_professor_limit - usage.professor_sessions
  const downloadsRemaining = organization.monthly_downloads_limit - usage.report_downloads

  const tools = [
    { id: 'board', name: 'Board Assessment', icon: '📋', status: '★ Recommended', recommended: true, color: '#8b5cf6' },
    { id: 'strategic', name: 'Strategic Plan', icon: '✓', status: 'Score: 92', color: '#00a0b0' },
    { id: 'ceo', name: 'CEO Evaluation', icon: '👤', status: 'Completed', color: '#3b82f6' },
    { id: 'scenario', name: 'Scenario Planner', icon: '📊', status: '4 scenarios', color: '#f43f5e' },
    { id: 'templates', name: 'Template Vault', icon: '📁', status: '147 templates', color: '#f59e0b' },
    { id: 'grant', name: 'Grant Review', icon: '📝', status: 'Ready', color: '#22c55e' }
  ]

  const sidebarTools = [
    { name: 'Strategic Plan Check-Up', icon: '✓', status: '92', color: '#00a0b0' },
    { name: 'Board Assessment', icon: '📋', status: '★ Start', recommended: true, color: '#8b5cf6' },
    { name: 'Scenario Planner', icon: '📊', status: '4', color: '#f43f5e' },
    { name: 'Grant Review', icon: '📝', status: '', color: '#22c55e' },
    { name: 'CEO Evaluation', icon: '👤', status: 'Done', color: '#3b82f6' }
  ]

  const recommendations = [
    { type: 'template', title: 'Board Member Expectations Agreement', desc: 'Clarify roles and commitments upfront' },
    { type: 'book', title: 'Governance as Leadership', desc: 'Reframing board work · 8 min read' },
    { type: 'template', title: 'Leadership Transition Checklist', desc: 'Distribute responsibilities systematically' },
    { type: 'book', title: 'The Outstanding Organization', desc: 'Stop firefighting, start leading · 6 min read' }
  ]

  const events = [
    { day: '12', month: 'DEC', title: 'Board Engagement That Actually Works', meta: 'Live webinar with Dr. Lyn Corbett · 12:00 PM PT', tag: 'WEBINAR', tagColor: 'bg-[#e6f7f9] text-[#00a0b0]' },
    { day: '15', month: 'DEC', title: 'Founding Members Q&A Session', meta: 'Open discussion · 10:00 AM PT', tag: 'MEMBERS ONLY', tagColor: 'bg-blue-100 text-blue-700' },
    { day: '8', month: 'JAN', title: '90-Day Planning Intensive', meta: 'Start 2025 with clarity · Cohort kickoff', tag: 'COHORT', tagColor: 'bg-rose-100 text-rose-700' }
  ]

  const recentActivity = [
    { text: 'Strategic Plan Check-Up completed', time: '3 days ago', color: '#00a0b0' },
    { text: 'Downloaded: Board Self-Assessment', time: '5 days ago', color: '#8b5cf6' },
    { text: 'Coaching: Board engagement', time: '2 weeks ago', color: '#f59e0b' }
  ]

  const handleDownload = async (name: string, type: 'report' | 'template') => {
    const result = await onDownload(name, type)
    if (!result.success) {
      setDownloadMessage(result.message || 'Download failed')
      setTimeout(() => setDownloadMessage(null), 4000)
    }
  }

  const handleStartProfessor = async () => {
    setProfessorLoading(true)
    const result = await onStartProfessor()
    setProfessorLoading(false)
    
    if (result.success) {
      onNavigate('professor')
    } else {
      alert(result.message || 'Unable to start session')
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Left Sidebar */}
      <aside className="w-52 bg-white border-r border-gray-200 flex flex-col fixed h-screen overflow-y-auto">
        {/* Logo */}
        {/* Logo */}
        <div className="px-4 py-4 border-b border-gray-100">
          <img src="/logo.svg" alt="The Nonprofit Edge" className="h-14 w-auto" />
        </div>

        {/* Main Nav */}
        <div className="py-3">
          <div className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Main</div>
          <nav>
            {[
              { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
              { id: 'library', icon: '📚', label: 'Resource Library' },
              { id: 'events', icon: '📅', label: 'Events' }
            ].map(item => (
              <a
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all ${
                  activeNav === item.id ? 'text-[#00a0b0] font-semibold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Tools */}
        <div className="py-3">
          <div className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Tools</div>
          <nav>
            {sidebarTools.map((tool, idx) => (
              <a key={idx} className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-gray-600 hover:bg-gray-50 transition-all">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm text-white" style={{ background: tool.color }}>{tool.icon}</span>
                <span className="flex-1 text-sm">{tool.name}</span>
                {tool.status && (
                  <span className={`text-xs ${tool.recommended ? 'text-[#00a0b0] font-semibold' : 'text-gray-400'}`}>{tool.status}</span>
                )}
              </a>
            ))}
          </nav>
        </div>

        {/* Resources */}
        <div className="py-3">
          <div className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Resources</div>
          <nav>
            {[
              { icon: '📁', label: 'Templates', count: '147' },
              { icon: '📖', label: 'Book Summaries', count: '52' },
              { icon: '🎓', label: 'Certifications', count: '' }
            ].map((item, idx) => (
              <a key={idx} className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-gray-600 hover:bg-gray-50 transition-all">
                <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm">{item.icon}</span>
                <span className="flex-1 text-sm">{item.label}</span>
                {item.count && <span className="text-xs text-gray-400">{item.count}</span>}
              </a>
            ))}
          </nav>
        </div>

        {/* Professor Nav */}
        <div className="py-3 mt-auto">
          <a onClick={handleStartProfessor} className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-gray-600 hover:bg-gray-50 transition-all">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm text-white" style={{ background: '#1a365d' }}>🎓</span>
            <span className="flex-1 text-sm">Ask the Professor</span>
            <span className="text-xs text-gray-400">{usage.professor_sessions}/{organization.monthly_professor_limit === -1 ? '∞' : organization.monthly_professor_limit}</span>
          </a>
        </div>

        {/* Team Link (Admin only) */}
        {canManageTeam && (
          <div className="py-3 border-t border-gray-100">
            <a onClick={() => onNavigate('team')} className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-gray-600 hover:bg-gray-50 transition-all">
              <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm">⚙️</span>
              <span className="flex-1 text-sm">Manage Team</span>
              <span className="text-xs text-gray-400">{teamCount}</span>
            </a>
          </div>
        )}
        {/* Platform Admin (Owner only) */}
        {user.email === 'lyn@thepivotalgroup.com' && (
          <div className="py-3 border-t border-gray-100">
            <a onClick={() => onNavigate('admin')} className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-gray-600 hover:bg-gray-50 transition-all">
              <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-sm">🔐</span>
              <span className="flex-1 text-sm font-medium text-red-600">Platform Admin</span>
            </a>
          </div>
        )}
        {/* User */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: 'linear-gradient(135deg, #00a0b0, #008090)' }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-800 text-sm truncate">{user.full_name}</div>
              <div className="text-xs text-gray-400 capitalize">{organization.tier} Plan</div>
            </div>
            <button onClick={onLogout} className="text-gray-400 hover:text-gray-600 text-sm" title="Sign out">↗</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-52">
        <div className="p-6 flex gap-6">
          {/* Center Content */}
          <div className="flex-1 space-y-6">
            {/* Today's Insight */}
            <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #1a365d, #122443)' }}>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">💡 TODAY'S INSIGHT</div>
              <p className="text-lg font-semibold leading-relaxed mb-3">
                "The board's job isn't to run the organization. It's to make sure the organization is well-run. That distinction changes everything."
              </p>
              <p className="text-sm text-gray-400">— From "Governance as Leadership" by Chait, Ryan & Taylor</p>
            </div>

            {/* Your Tools */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-base font-bold text-[#1a365d]">Your Tools</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4">
                  {tools.map(tool => (
                    <div
                      key={tool.id}
                      className={`rounded-xl p-5 text-center cursor-pointer transition-all border-2 ${
                        tool.recommended ? 'border-[#00a0b0] bg-[#e6f7f9]' : 'border-transparent bg-gray-50 hover:border-[#00a0b0] hover:bg-[#e6f7f9]'
                      }`}
                    >
                      <div className="w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center text-xl text-white" style={{ background: tool.color }}>{tool.icon}</div>
                      <div className="font-bold text-sm mb-1 text-[#1a365d]">{tool.name}</div>
                      <div className={`text-xs ${tool.recommended ? 'text-[#00a0b0] font-semibold' : 'text-gray-400'}`}>{tool.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended For You */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-base font-bold text-[#1a365d]">Recommended For You</h2>
                <a href="#" className="text-sm font-semibold text-[#00a0b0] hover:underline">See all →</a>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 rounded-xl p-5 cursor-pointer hover:bg-gray-100 transition"
                      onClick={() => rec.type === 'template' && handleDownload(rec.title, 'template')}
                    >
                      <span className={`inline-block text-xs font-bold uppercase px-2.5 py-1 rounded mb-3 ${
                        rec.type === 'template' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {rec.type === 'template' ? '📄 TEMPLATE' : '📚 BOOK SUMMARY'}
                      </span>
                      <div className="font-bold text-sm mb-1 text-[#1a365d]">{rec.title}</div>
                      <div className="text-sm text-gray-500">{rec.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-base font-bold text-[#1a365d]">Upcoming Events</h2>
                <a href="#" className="text-sm font-semibold text-[#00a0b0] hover:underline">View calendar →</a>
              </div>
              <div className="p-6 space-y-4">
                {events.map((event, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-14 text-center flex-shrink-0">
                      <div className="text-2xl font-extrabold text-[#1a365d] leading-none">{event.day}</div>
                      <div className="text-xs font-semibold text-gray-400">{event.month}</div>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm mb-1 text-[#1a365d]">{event.title}</div>
                      <div className="text-sm text-gray-500 mb-2">{event.meta}</div>
                      <span className={`inline-block text-xs font-bold uppercase px-2.5 py-1 rounded ${event.tagColor}`}>{event.tag}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-72 space-y-5 flex-shrink-0">
            {/* Download Message */}
            {downloadMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{downloadMessage}</div>
            )}

            {/* Ask the Professor */}
            <div className="rounded-2xl overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #1a365d, #122443)' }}>
              <div className="px-5 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#00a0b0' }}>🎓</div>
                <div className="font-bold">Ask the Professor</div>
              </div>
              <div className="px-5 pb-5">
                <p className="text-sm text-gray-300 mb-4">Bring your challenges. Think deeply.</p>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Sessions this month</span>
                  <span className="font-bold">{usage.professor_sessions} of {organization.monthly_professor_limit === -1 ? '∞' : organization.monthly_professor_limit}</span>
                </div>
                <div className="h-2 rounded-full mb-4 overflow-hidden" style={{ background: '#2d4a7c' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: organization.monthly_professor_limit === -1 ? '10%' : `${(usage.professor_sessions / organization.monthly_professor_limit) * 100}%`,
                      background: '#00a0b0'
                    }}
                  />
                </div>
                <button
                  onClick={handleStartProfessor}
                  disabled={professorLoading}
                  className="w-full py-3 rounded-xl font-bold text-sm transition hover:opacity-90 disabled:opacity-50"
                  style={{ background: '#00a0b0' }}
                >
                  {professorLoading ? 'Starting...' : 'Start a Session'}
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-5">
                <h3 className="font-bold mb-4 text-[#1a365d]">Quick Actions</h3>
                {[
                  { icon: '📄', text: 'Download ONE Thing report', action: () => handleDownload('ONE Thing Report', 'report') },
                  { icon: '🎯', text: 'Update 90-day goals', action: () => {} },
                  { icon: '👥', text: 'Invite team members', action: () => onNavigate('team'), admin: true }
                ].filter(a => !a.admin || canManageTeam).map((action, idx) => (
                  <div key={idx} onClick={action.action} className="flex items-center gap-3 py-2.5 cursor-pointer group">
                    <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-base">{action.icon}</div>
                    <span className="text-sm text-gray-700 font-medium group-hover:text-[#00a0b0] transition">{action.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200">
                <h3 className="font-bold text-[#1a365d]">Recent Activity</h3>
              </div>
              <div className="p-5">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 py-2">
                    <div className="w-2 h-2 rounded-full mt-2" style={{ background: activity.color }} />
                    <div>
                      <div className="text-sm text-gray-700 font-medium">{activity.text}</div>
                      <div className="text-xs text-gray-400">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Report Downloads */}
            <div className="rounded-2xl border-2 overflow-hidden" style={{ background: '#e6f7f9', borderColor: '#00a0b0' }}>
              <div className="px-5 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg" style={{ background: '#00a0b0' }}>📥</div>
                <div className="font-bold text-[#1a365d]">Report Downloads</div>
              </div>
              <div className="px-5 pb-5">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Remaining this month</span>
                  <span className="font-bold text-[#1a365d]">{downloadsRemaining} of {organization.monthly_downloads_limit}</span>
                </div>
                <div className="h-2 rounded-full mb-3 overflow-hidden" style={{ background: 'rgba(0,160,176,0.2)' }}>
                  <div className="h-full rounded-full" style={{ width: `${(downloadsRemaining / organization.monthly_downloads_limit) * 100}%`, background: '#00a0b0' }} />
                </div>
                <p className="text-sm text-gray-500">
                  Resets January 1 · <a href="#" className="font-semibold text-[#00a0b0] hover:underline">Need more? Upgrade</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
