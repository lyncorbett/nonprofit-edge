import { useState } from 'react'

// ============================================
// RESOURCE LIBRARY PAGE
// Brand Colors: Navy #1a365d | Teal #00a0b0
// ============================================

// Brand colors
const NAVY = '#1a365d';
const TEAL = '#00a0b0';
const TEAL_LIGHT = '#e6f7f9';

interface ResourceLibraryProps {
  user: {
    id: string
    full_name: string
    email: string
    role?: 'owner' | 'admin' | 'member'
  }
  organization?: {
    id?: string
    name?: string
    tier?: 'starter' | 'professional' | 'enterprise'
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
    { id: 'templates', title: 'Templates', description: 'Ready-to-use templates for strategic plans, board packets, evaluations, and more.', count: '147+ templates', icon: '📄', color: 'from-[#00a0b0] to-[#006d78]' },
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

  const getTierName = () => {
    const tier = organization?.tier || 'professional'
    const tiers: Record<string, string> = {
      starter: 'Essential',
      professional: 'Professional',
      enterprise: 'Premium'
    }
    return tiers[tier] || 'Professional'
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Left Sidebar - Matching Dashboard */}
      <aside className="w-52 bg-white border-r border-gray-300 flex flex-col fixed h-screen overflow-y-auto">
        {/* Logo */}
        <div className="px-4 py-5 border-b border-gray-300">
          <div className="text-lg font-extrabold" style={{ color: NAVY }}>
            The Nonprofit Edge
          </div>
        </div>

        {/* Main Nav */}
        <div className="py-4">
          <div className="px-4 mb-2 text-xs font-extrabold uppercase tracking-wider" style={{ color: NAVY }}>
            Main
          </div>
          <nav>
            <a 
              onClick={() => onNavigate('dashboard')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Dashboard
            </a>
            <a 
              onClick={() => onNavigate('library')}
              className="block px-4 py-2 text-sm font-semibold cursor-pointer"
              style={{ color: TEAL, backgroundColor: TEAL_LIGHT }}
            >
              Resource Library
            </a>
            <a 
              onClick={() => onNavigate('events')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Events
            </a>
          </nav>
        </div>

        {/* Tools */}
        <div className="py-4 border-t border-gray-300">
          <div className="px-4 mb-2 text-xs font-extrabold uppercase tracking-wider" style={{ color: NAVY }}>
            Tools
          </div>
          <nav>
            <a 
              onClick={() => onNavigate('strategic-checkup')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer leading-tight"
            >
              Strategic Plan<br/>Check-Up
            </a>
            <a 
              onClick={() => onNavigate('board-assessment')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Board Assessment
            </a>
            <a 
              onClick={() => onNavigate('scenario-planner')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Scenario Planner
            </a>
            <a 
              onClick={() => onNavigate('grant-review')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Grant Review
            </a>
            <a 
              onClick={() => onNavigate('ceo-evaluation')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              CEO Evaluation
            </a>
          </nav>
        </div>

        {/* Resources */}
        <div className="py-4 border-t border-gray-300">
          <div className="px-4 mb-2 text-xs font-extrabold uppercase tracking-wider" style={{ color: NAVY }}>
            Resources
          </div>
          <nav>
            <a 
              onClick={() => onNavigate('templates')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Templates
            </a>
            <a 
              onClick={() => onNavigate('book-summaries')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Book Summaries
            </a>
            <a 
              onClick={() => onNavigate('certifications')}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Certifications
            </a>
          </nav>
          
          {/* Ask the Professor Button */}
          <div className="px-3 pt-3">
            <a 
              onClick={() => onNavigate('professor')}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-white cursor-pointer hover:opacity-90 transition"
              style={{ background: `linear-gradient(135deg, ${NAVY}, #122443)` }}
            >
              <div 
                className="w-7 h-7 rounded-md flex items-center justify-center text-sm"
                style={{ background: TEAL }}
              >
                🎓
              </div>
              <span className="font-semibold text-sm">Ask the Professor</span>
            </a>
          </div>
        </div>

        {/* Manage Team */}
        <div className="py-3 border-t border-gray-300">
          <a 
            onClick={() => onNavigate('team')}
            className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
          >
            Manage Team
          </a>
        </div>

        {/* User Profile */}
        <div className="mt-auto px-4 py-4 border-t border-gray-300">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
              style={{ background: `linear-gradient(135deg, ${TEAL}, #008090)` }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-800 text-sm truncate">
                {user.full_name}
              </div>
              <div className="text-[10px] text-gray-400">{getTierName()}</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="mt-3 w-full text-xs text-gray-500 hover:text-gray-700 py-1"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-52">
        <div className="p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold mb-2" style={{ color: NAVY }}>Resource Library</h1>
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
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00a0b0] focus:ring-2 focus:ring-[#00a0b0]/10 transition-all"
              />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-3 gap-6 mb-10">
            {categories.map(category => (
              <a
                key={category.id}
                href="#"
                className="bg-white rounded-2xl border border-gray-200 p-6 cursor-pointer transition-all hover:border-[#00a0b0] hover:shadow-lg hover:-translate-y-0.5 group"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4 bg-gradient-to-br ${category.color}`}>
                  {category.icon}
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: NAVY }}>{category.title}</h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold" style={{ color: TEAL }}>{category.count}</span>
                  <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-[#00a0b0] group-hover:text-white transition-all">→</span>
                </div>
              </a>
            ))}
          </div>

          {/* Recently Accessed */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: NAVY }}>Recently Accessed</h2>
            <a href="#" className="text-sm font-semibold hover:underline" style={{ color: TEAL }}>View history →</a>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {recentlyAccessed.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer transition-all hover:border-[#00a0b0] hover:bg-[#e6f7f9]"
              >
                <span className={`inline-block text-xs font-bold uppercase tracking-wide px-2 py-1 rounded mb-3 ${item.typeColor}`}>
                  {item.type}
                </span>
                <div className="font-bold text-sm mb-1" style={{ color: NAVY }}>{item.title}</div>
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
