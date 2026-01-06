/**
 * THE NONPROFIT EDGE - App.tsx
 * Self-contained version with error handling
 */

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react'
import { createClient } from '@supabase/supabase-js'

const TEAL = '#0097A9'
const NAVY = '#0D2C54'

// Initialize Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

// Error Boundary
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h1 style={{ color: 'red' }}>Something went wrong</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      )
    }
    return this.props.children
  }
}

// Homepage
const Homepage = ({ onNavigate }: { onNavigate: (page: string) => void }) => (
  <div style={{ minHeight: '100vh' }}>
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'white', borderBottom: '1px solid #eee', zIndex: 50 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <img src="/logo.svg" alt="The Nonprofit Edge" style={{ width: '180px' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button onClick={() => onNavigate('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>Home</button>
          <button onClick={() => onNavigate('login')} style={{ background: TEAL, color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Sign In</button>
        </nav>
      </div>
    </header>
    
    <div style={{ paddingTop: '80px' }}>
      <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg, #f8fafc 0%, #e6f7f9 100%)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: NAVY, marginBottom: '24px', lineHeight: 1.2 }}>
            Your Mission Deserves More Than Hope—<br/>
            <span style={{ color: TEAL }}>It Needs an Edge.</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '32px' }}>
            The strategic toolkit behind $100M+ in nonprofit funding.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('signup')} style={{ background: TEAL, color: 'white', border: 'none', padding: '16px 32px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '1.1rem' }}>
              Start Your Free Trial →
            </button>
            <button onClick={() => onNavigate('login')} style={{ background: 'white', color: NAVY, border: '2px solid #ddd', padding: '16px 32px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '1.1rem' }}>
              Sign In
            </button>
          </div>
        </div>
      </section>
      
      {/* Status */}
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', background: '#f0f0f0', borderRadius: '8px', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', color: '#666' }}>
          <strong>Status:</strong> Supabase {supabase ? '✅ Connected' : '❌ Not configured'}
        </p>
      </div>
    </div>
  </div>
)

// Login
const Login = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) { setError('Database not configured'); return }
    setLoading(true)
    setError('')
    try {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) throw err
      onNavigate('dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <button onClick={() => onNavigate('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', marginBottom: '24px' }}>← Back</button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: NAVY, textAlign: 'center', marginBottom: '24px' }}>Sign In</h1>
        {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
        {!supabase && <div style={{ background: '#fffbeb', color: '#d97706', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>⚠️ Database not connected</div>}
        <form onSubmit={handleSubmit}>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '12px', boxSizing: 'border-box' }} />
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '16px', boxSizing: 'border-box' }} />
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: TEAL, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.5 : 1 }}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#666' }}>
          No account? <button onClick={() => onNavigate('signup')} style={{ background: 'none', border: 'none', color: TEAL, cursor: 'pointer', fontWeight: 500 }}>Sign up</button>
        </p>
      </div>
    </div>
  )
}

// Signup
const Signup = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) { setError('Database not configured'); return }
    setLoading(true)
    setError('')
    try {
      const { error: err } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { full_name: form.name } } })
      if (err) throw err
      onNavigate('dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <button onClick={() => onNavigate('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', marginBottom: '24px' }}>← Back</button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: NAVY, textAlign: 'center', marginBottom: '24px' }}>Start Free Trial</h1>
        {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
        {!supabase && <div style={{ background: '#fffbeb', color: '#d97706', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>⚠️ Database not connected</div>}
        <form onSubmit={handleSubmit}>
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full Name" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '12px', boxSizing: 'border-box' }} />
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '12px', boxSizing: 'border-box' }} />
          <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password (min 6 chars)" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '16px', boxSizing: 'border-box' }} />
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: TEAL, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.5 : 1 }}>{loading ? 'Creating...' : 'Start Free Trial'}</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#666' }}>
          Have account? <button onClick={() => onNavigate('login')} style={{ background: 'none', border: 'none', color: TEAL, cursor: 'pointer', fontWeight: 500 }}>Sign in</button>
        </p>
      </div>
    </div>
  )
}

// Dashboard
const Dashboard = ({ user, onNavigate, onLogout }: { user: any; onNavigate: (page: string) => void; onLogout: () => void }) => {
  const name = user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'
  const tools = [
    { title: 'Strategic Plan', icon: '📋', url: 'https://thenonprofitedge.app.n8n.cloud/webhook/strategic-plan-checkup' },
    { title: 'Board Assessment', icon: '👥', url: 'https://thenonprofitedge.app.n8n.cloud/webhook/board-assessment' },
    { title: 'Grant Review', icon: '💰', url: 'https://thenonprofitedge.app.n8n.cloud/webhook/grant-review' },
    { title: 'Scenario Planner', icon: '🎯', url: 'https://thenonprofitedge.app.n8n.cloud/webhook/scenario-planner' },
    { title: 'CEO Evaluation', icon: '⭐', url: 'https://thenonprofitedge.app.n8n.cloud/webhook/ceo-evaluation' },
    { title: 'Ask the Professor', icon: '🎓', url: 'https://thenonprofitedge.app.n8n.cloud/webhook/ask-the-professor' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <header style={{ background: 'white', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <img src="/logo.svg" alt="Logo" style={{ height: '40px' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {(user?.role === 'admin' || user?.role === 'owner') && (
              <button onClick={() => onNavigate('admin')} style={{ background: 'none', border: 'none', color: '#7c3aed', cursor: 'pointer' }}>Admin</button>
            )}
            <span style={{ color: '#666', fontSize: '14px' }}>{name}</span>
            <button onClick={onLogout} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '14px' }}>Sign Out</button>
          </div>
        </div>
      </header>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: NAVY, marginBottom: '24px' }}>Welcome back, {name}!</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {tools.map((tool, i) => (
            <button key={i} onClick={() => window.open(tool.url, '_blank')} style={{ background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '24px', textAlign: 'left', cursor: 'pointer' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{tool.icon}</div>
              <h3 style={{ fontWeight: 'bold', color: NAVY, marginBottom: '4px' }}>{tool.title}</h3>
              <span style={{ color: TEAL, fontSize: '14px' }}>Launch →</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Admin
const Admin = ({ onBack, onNavigate }: { onBack: () => void; onNavigate: (page: string) => void }) => (
  <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
    <header style={{ background: 'white', borderBottom: '1px solid #eee', padding: '16px 24px' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>← Back to Dashboard</button>
    </header>
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: NAVY, marginBottom: '24px' }}>Admin Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {[{ title: 'Owner Dashboard', icon: '📊', page: 'owner-dashboard' }, { title: 'Marketing', icon: '📈', page: 'marketing' }, { title: 'Link Manager', icon: '🔗', page: 'link-manager' }].map((item, i) => (
          <button key={i} onClick={() => onNavigate(item.page)} style={{ background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '24px', textAlign: 'left', cursor: 'pointer' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{item.icon}</div>
            <h3 style={{ fontWeight: 'bold', color: NAVY }}>{item.title}</h3>
          </button>
        ))}
      </div>
    </div>
  </div>
)

// Coming Soon
const ComingSoon = ({ title, onBack }: { title: string; onBack: () => void }) => (
  <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: NAVY, marginBottom: '16px' }}>{title}</h1>
      <p style={{ color: '#666', marginBottom: '24px' }}>Coming soon!</p>
      <button onClick={onBack} style={{ background: TEAL, color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer' }}>Go Back</button>
    </div>
  </div>
)

// App Content
function AppContent() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      if (!supabase) { setLoading(false); return }
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data } = await supabase.from('users').select('*').eq('id', session.user.id).single()
          setUser(data || { id: session.user.id, email: session.user.email })
        }
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    init()

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const { data } = await supabase.from('users').select('*').eq('id', session.user.id).single()
          setUser(data || { id: session.user.id, email: session.user.email })
        } else {
          setUser(null)
        }
      })
      return () => subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut()
    setUser(null)
    navigate('/login')
  }

  const nav = (page: string) => navigate(`/${page}`)

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>

  return (
    <Routes>
      <Route path="/" element={<Homepage onNavigate={nav} />} />
      <Route path="/login" element={<Login onNavigate={nav} />} />
      <Route path="/signup" element={<Signup onNavigate={nav} />} />
      <Route path="/dashboard" element={user ? <Dashboard user={user} onNavigate={nav} onLogout={handleLogout} /> : <Navigate to="/login" />} />
      <Route path="/admin" element={user?.role === 'admin' || user?.role === 'owner' ? <Admin onBack={() => navigate('/dashboard')} onNavigate={nav} /> : <Navigate to="/dashboard" />} />
      <Route path="/owner-dashboard" element={<ComingSoon title="Owner Dashboard" onBack={() => navigate('/admin')} />} />
      <Route path="/marketing" element={<ComingSoon title="Marketing Analytics" onBack={() => navigate('/admin')} />} />
      <Route path="/link-manager" element={<ComingSoon title="Link Manager" onBack={() => navigate('/admin')} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  )
}
