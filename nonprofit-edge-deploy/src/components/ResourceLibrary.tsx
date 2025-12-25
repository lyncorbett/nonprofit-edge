import { useState } from 'react'

// ============================================
// RESOURCE LIBRARY PAGE
// Brand Colors: Navy #0D2C54 | Teal #0097A9
// ============================================

interface ResourceLibraryProps {
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
  }
  onNavigate: (page: string) => void
  onLogout: () => void
}

const ResourceLibrary: React.FC<ResourceLibraryProps> = ({
  user,
  organization,
  onNavigate,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const initials = user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()

  const categories = [
    { id: 'guides', title: 'Leadership Guides', description: 'In-depth guides on nonprofit leadership, from board governance to strategic decision-making.', count: '15+ guides', icon: '📘', color: 'from-blue-500 to-blue-700' },
    { id: 'books', title: 'Book Summaries', description: 'Key insights from essential leadership and nonprofit books, distilled into actionable summaries.', count: '52+ summaries', icon: '📚', color: 'from-amber-500 to-amber-700' },
    { id: 'templates', title: 'Templates', description: 'Ready-to-use templates for strategic plans, board packets, evaluations, and more.', count: '147+ templates', icon: '📄', color: 'from-[#0097A9] to-[#006d78]' },
    { id: 'playbooks', title: 'Playbooks', description: 'Step-by-step playbooks for common nonprofit challenges, from fundraising to succession planning.', count: '27+ playbooks', icon: '📋', color: 'from-purple-500 to-purple-700' },
    { id: 'certifications', title: 'Certifications', description: 'Earn credentials in DiSC, Five Behaviors, governance, consulting, and strategic leadership.', count: '5 programs', icon: '🎓', color: 'from-rose-500 to-rose-700' },
    { id: 'kits', title: 'Facilitation Kits', description: 'Complete kits for running board retreats, strategic planning sessions, and team workshops.', count: '20+ kits', icon: '🛠️', color: 'from-green-500 to-green-700' },
  ]

  const recentlyAccessed = [
    { type: 'template', title: 'Board Member Expectations Agreement', meta: 'Accessed 2 days ago', typeColor: 'bg-blue-100 text-blue-800' },
    { type: 'book', title: 'Governance as Leadership', meta: 'Accessed 3 days ago', typeColor: 'bg-amber-100 text-amber-800' },
    { type: 'guide', title: 'CEO Succession Planning', meta: 'Accessed 1 week ago', typeColor: 'bg-indigo-100 text-indigo-800' },
    { type: 'playbook', title: '90-Day Strategic Reset', meta: 'Accessed 1 week ago', typeColor: 'bg-pink-100 text-pink-800' },
  ]

  const sidebarTools = [
    { name: 'Strategic Plan Check-Up', icon: '✓', status: '92', color: 'from-[#0097A9] to-[#006d78]' },
    { name: 'Board Assessment', icon: '📋', status: '★ Start', recommended: true, color: 'from-purple-500 to-purple-700' },
    { name: 'Scenario Planner', icon: '📊', status: '4', color: 'from-rose-500 to-rose-700' },
    { name: 'Grant Review', icon: '📝', status: '', color: 'from-green-500 to-green-700' },
    { name: 'CEO Evaluation', icon: '👤', status: 'Done', color: 'from-blue-500 to-blue-700' },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-screen overflow-y-auto">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-gray-100">
          <img src="/logo.svg" alt="The Nonprofit Edge" className="h-10" />
        </div>

        {/* Main Nav */}
        <div className="py-4">
          <div className="px-5 mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">Main</div>
          <nav>
            {[
              { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
              { id: 'library', icon: '📚', label: 'Resource Library', active: true },
              { id: 'events', icon: '📅', label: 'Events' }
            ].map(item => (
              <a
                key={item.id}
               onClick={() => {
  setActiveNav(item.id)
  onNavigate(item.id)
}}
                className={`flex items-center gap-3 px-5 py-2.5 cursor-pointer transition-all border-l-3 ${
                  item.active 
                    ? 'bg-[#e6f9fa] text-[#0097A9] border-l-[3px] border-[#0097A9] font-semibold' 
                    : 'text-gray-600 hover:bg-gray-50 border-l-[3px] border-transparent'
                }`}
              >
                <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Tools */}
        <div className="py-4 border-t border-gray-100">
          <div className="px-5 mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">Tools</div>
          <nav>
            {sidebarTools.map((tool, idx) => (
              <a key={idx} className="flex items-center gap-3 px-5 py-2.5 cursor-pointer text-gray-600 hover:bg-gray-50 transition-all">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm text-white bg-gradient-to-br ${tool.color}`}>{tool.icon}</span>
                <span className="flex-1 text-sm">{tool.name}</span>
                {tool.status && (
                  <span className={`text-xs ${tool.recommended ? 'text-[#0097A9] font-semibold' : 'text-gray-400'}`}>{tool.status}</span>
                )}
              </a>
            ))}
          </nav>
        </div>

        {/* Resources */}
        <div className="py-4 border-t border-gray-100">
          <div className="px-5 mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">Resources</div>
          <nav>
            {[
              { icon: '📁', label: 'Templates', count: '147' },
              { icon: '📖', label: 'Book Summaries', count: '52' },
              { icon: '🎓', label: 'Certifications', count: '' }
            ].map((item, idx) => (
              <a key={idx} className="flex items-center gap-3 px-5 py-2.5 cursor-pointer text-gray-600 hover:bg-gray-50 transition-all">
                <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm">{item.icon}</span>
                <span className="flex-1 text-sm">{item.label}</span>
                {item.count && <span className="text-xs text-gray-400">{item.count}</span>}
              </a>
            ))}
          </nav>
        </div>

        {/* Ask the Professor */}
        <div className="py-4 border-t border-gray-100">
          <nav>
            <a className="flex items-center gap-3 px-5 py-2.5 cursor-pointer text-gray-600 hover:bg-gray-50 transition-all">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm text-white bg-gradient-to-br from-[#0D2C54] to-[#122443]">🎓</span>
              <span className="flex-1 text-sm">Ask the Professor</span>
              <span className="text-xs text-gray-400">7/10</span>
            </a>
          </nav>
        </div>

        {/* User */}
        <div className="mt-auto px-5 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br from-[#0097A9] to-[#006d78]">
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
      <div className="flex-1 ml-64">
        <div className="p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-[#0D2C54] mb-2">Resource Library</h1>
            <p className="text-gray-500 max-w-xl">265+ resources to help you lead with clarity, build stronger teams, and drive lasting impact.</p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-lg">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates, guides, playbooks..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0097A9] focus:ring-2 focus:ring-[#0097A9]/10 transition-all"
              />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-3 gap-6 mb-10">
            {categories.map(category => (
              <a
                key={category.id}
                href="#"
                className="bg-white rounded-2xl border border-gray-200 p-6 cursor-pointer transition-all hover:border-[#0097A9] hover:shadow-lg hover:-translate-y-0.5 group"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4 bg-gradient-to-br ${category.color}`}>
                  {category.icon}
                </div>
                <h3 className="text-lg font-bold text-[#0D2C54] mb-2">{category.title}</h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#0097A9]">{category.count}</span>
                  <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-[#0097A9] group-hover:text-white transition-all">→</span>
                </div>
              </a>
            ))}
          </div>

          {/* Recently Accessed */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#0D2C54]">Recently Accessed</h2>
            <a href="#" className="text-sm font-semibold text-[#0097A9] hover:text-[#0D2C54]">View history →</a>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {recentlyAccessed.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer transition-all hover:border-[#0097A9] hover:bg-[#e6f9fa]"
              >
                <span className={`inline-block text-xs font-bold uppercase tracking-wide px-2 py-1 rounded mb-3 ${item.typeColor}`}>
                  {item.type}
                </span>
                <div className="font-bold text-[#0D2C54] text-sm mb-1">{item.title}</div>
                <div className="text-xs text-gray-400">{item.meta}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResourceLibrary
