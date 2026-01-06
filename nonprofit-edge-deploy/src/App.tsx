/**
 * THE NONPROFIT EDGE - App.tsx
 * Clean version that imports Homepage component
 */

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react'
import { createClient } from '@supabase/supabase-js'
import Homepage from './Homepage'

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
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
          <h1 style={{ color: '#dc2626', marginBottom: '16px' }}>Something went wrong</h1>
          <p style={{ color: '#666', marginBottom: '24px' }}>{this.state.error?.message || 'Unknown error'}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              background: TEAL, 
              color: 'white', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Reload Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// Login Component
const Login = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) { 
      setError('Database not configured') 
      return 
    }
    setLoading(true)
    setError('')
    
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) throw authError
      onNavigate('dashboard')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '20px' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src="/logo.svg" alt="The Nonprofit Edge" style={{ width: '180px', marginBottom: '16px' }} onError={(e) => { (e.target as HTMLImageElement).src = '/logo.jpg' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: NAVY }}>Welcome Back</h1>
        </div>
        
        {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, color: '#374151' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, color: '#374151' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '14px', background: TEAL, color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button onClick={() => onNavigate('')} style={{ background: 'none', border: 'none', color: TEAL, cursor: 'pointer', fontSize: '14px' }}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

// Signup Component
const Signup = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [orgName, setOrgName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) { 
      setError('Database not configured') 
      return 
    }
    setLoading(true)
    setError('')
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
      if (authError) throw authError
      
      if (authData.user) {
        await supabase.from('users').insert({
          id: authData.user.id,
          email,
          organization_name: orgName,
          role: 'user'
        })
      }
      
      onNavigate('dashboard')
    } catch (err: any) {
      setError(err.message || 'Signup failed')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '20px' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src="/logo.svg" alt="The Nonprofit Edge" style={{ width: '180px', marginBottom: '16px' }} onError={(e) => { (e.target as HTMLImageElement).src = '/logo.jpg' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: NAVY }}>Start Your Free Trial</h1>
        </div>
        
        {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, color: '#374151' }}>Organization Name</label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, color: '#374151' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, color: '#374151' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '14px', background: TEAL, color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <span style={{ color: '#666', fontSize: '14px' }}>Already have an account? </span>
          <button onClick={() => onNavigate('login')} style={{ background: 'none', border: 'none', color: TEAL, cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  )
}

// Dashboard Component
const Dashboard = ({ user, onNavigate, onLogout }: { user: any; onNavigate: (page: string) => void; onLogout: () => void }) => {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <img src="/logo.svg" alt="The Nonprofit Edge" style={{ width: '150px' }} onError={(e) => { (e.target as HTMLImageElement).src = '/logo.jpg' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#666' }}>{user?.email}</span>
          {(user?.role === 'admin' || user?.role === 'owner') && (
            <button onClick={() => onNavigate('admin')} style={{ background: NAVY, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Admin</button>
          )}
          <button onClick={onLogout} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Logout</button>
        </div>
      </header>
      
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: NAVY, marginBottom: '8px' }}>Welcome to The Nonprofit Edge</h1>
        <p style={{ color: '#666', marginBottom: '32px' }}>Access your strategic tools and resources</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {[
            { title: 'Strategic Plan Check-Up', desc: 'Analyze your strategic plan', icon: '📋' },
            { title: 'Board Assessment', desc: 'Evaluate board effectiveness', icon: '👥' },
            { title: 'Grant Review', desc: 'Get feedback on grant proposals', icon: '💰' },
            { title: 'Scenario Planner', desc: 'Plan for different futures', icon: '🔮' },
          ].map((tool, i) => (
            <div key={i} style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{tool.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: NAVY, marginBottom: '8px' }}>{tool.title}</h3>
              <p style={{ color: '#666', fontSize: '14px' }}>{tool.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

// Admin Component
const Admin = ({ onBack, onNavigate }: { onBack: () => void; onNavigate: (page: string) => void }) => {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <header style={{ background: NAVY, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ color: 'white', fontSize: '20px', fontWeight: 600 }}>Admin Dashboard</h1>
        <button onClick={onBack} style={{ background: 'white', color: NAVY, border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Back to Dashboard</button>
      </header>
      
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          {[
            { title: 'Owner Dashboard', route: 'owner-dashboard' },
            { title: 'Marketing Analytics', route: 'marketing' },
            { title: 'Link Manager', route: 'link-manager' },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => onNavigate(item.route)}
              style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer', border: '2px solid transparent', textAlign: 'left' }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: NAVY }}>{item.title}</h3>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}

// Coming Soon Component
const ComingSoon = ({ title, onBack }: { title: string; onBack: () => void }) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
    <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: NAVY, marginBottom: '16px' }}>{title}</h1>
    <p style={{ color: '#666', marginBottom: '24px' }}>Coming Soon</p>
    <button onClick={onBack} style={{ background: TEAL, color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer' }}>Go Back</button>
  </div>
)

// WhyWeExist Component
const WhyWeExist = ({ onNavigate }: { onNavigate: (page: string) => void }) => (
  <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
    <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => onNavigate('')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <img src="/logo.svg" alt="The Nonprofit Edge" style={{ width: '150px' }} onError={(e) => { (e.target as HTMLImageElement).src = '/logo.jpg' }} />
        </button>
        <button onClick={() => onNavigate('login')} style={{ background: TEAL, color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Sign In</button>
      </div>
    </header>
    
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px' }}>
      <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: NAVY, marginBottom: '24px' }}>Why We Exist</h1>
      <p style={{ fontSize: '18px', color: '#4b5563', lineHeight: 1.8, marginBottom: '24px' }}>
        After 15+ years working with nonprofit leaders, we saw the same pattern: brilliant missions held back by outdated tools and reactive strategies.
      </p>
      <p style={{ fontSize: '18px', color: '#4b5563', lineHeight: 1.8, marginBottom: '24px' }}>
        The Nonprofit Edge was built to change that—giving every organization access to the strategic frameworks that have helped secure over $100 million in funding.
      </p>
      <button onClick={() => onNavigate('')} style={{ background: TEAL, color: 'white', border: 'none', padding: '14px 28px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '16px' }}>
        ← Back to Home
      </button>
    </main>
  </div>
)

// App Content with Routes
function AppContent() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      if (!supabase) { 
        setLoading(false) 
        return 
      }
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data } = await supabase.from('users').select('*').eq('id', session.user.id).single()
          setUser(data || { id: session.user.id, email: session.user.email })
        }
      } catch (e) { 
        console.error('Session error:', e) 
      }
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

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #e5e7eb', borderTopColor: TEAL, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#666' }}>Loading...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Homepage onNavigate={nav} />} />
      <Route path="/login" element={<Login onNavigate={nav} />} />
      <Route path="/signup" element={<Signup onNavigate={nav} />} />
      <Route path="/why-we-exist" element={<WhyWeExist onNavigate={nav} />} />
      <Route path="/dashboard" element={user ? <Dashboard user={user} onNavigate={nav} onLogout={handleLogout} /> : <Navigate to="/login" />} />
      <Route path="/admin" element={user?.role === 'admin' || user?.role === 'owner' ? <Admin onBack={() => navigate('/dashboard')} onNavigate={nav} /> : <Navigate to="/dashboard" />} />
      <Route path="/owner-dashboard" element={<ComingSoon title="Owner Dashboard" onBack={() => navigate('/admin')} />} />
      <Route path="/marketing" element={<ComingSoon title="Marketing Analytics" onBack={() => navigate('/admin')} />} />
      <Route path="/link-manager" element={<ComingSoon title="Link Manager" onBack={() => navigate('/admin')} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

// Main App Export
export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  )
}
