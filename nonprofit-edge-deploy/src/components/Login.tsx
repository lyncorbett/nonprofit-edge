/**
 * THE NONPROFIT EDGE - Login Page
 * Real Supabase Authentication
 * Updated: February 3, 2026
 * 
 * This calls supabase.auth.signInWithPassword() and on success
 * calls onLoginSuccess() which App.tsx uses to load the real user session.
 */

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const NAVY = '#0D2C54';
const TEAL = '#0097A9';

interface LoginProps {
  onLoginSuccess: (userData: { id: string; email: string; name: string; role: string }) => void;
  onNavigate: (route: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'magic'>('login');
  const [magicSent, setMagicSent] = useState(false);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) throw authError;

      if (data.user && data.session) {
        // Pass real user data up to App.tsx
        onLoginSuccess({
          id: data.user.id,
          email: data.user.email || email,
          name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
          role: data.user.user_metadata?.role || 'member',
        });
      }
    } catch (err: any) {
      console.error('[Login] Error:', err);
      if (err.message?.includes('Invalid login')) {
        setError('Invalid email or password. Please try again.');
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Please check your email to confirm your account first.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (otpError) throw otpError;
      setMagicSent(true);
    } catch (err: any) {
      console.error('[Login] Magic link error:', err);
      setError(err.message || 'Failed to send magic link.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Enter your email first, then click Forgot Password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;
      setError('');
      alert('Password reset email sent! Check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  // Magic link sent confirmation
  if (magicSent) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '20px' }}>
        <div style={{ background: 'white', padding: '48px', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: '100%', maxWidth: '420px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', background: '#e0f7fa', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '28px' }}>✉️</div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: NAVY, marginBottom: '12px' }}>Check Your Email</h2>
          <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
            We sent a login link to <strong>{email}</strong>. Click the link in the email to sign in.
          </p>
          <button
            onClick={() => { setMagicSent(false); setMode('login'); }}
            style={{ color: TEAL, background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
          >
            ← Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '20px' }}>
      <div style={{ background: 'white', padding: '48px', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <button
            onClick={() => onNavigate('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <img
              src="/logo.svg"
              alt="The Nonprofit Edge"
              style={{ width: '200px', height: 'auto' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </button>
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 700, color: NAVY, textAlign: 'center', marginBottom: '4px' }}>Welcome Back</h1>
        <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '28px', fontSize: '15px' }}>Sign in to your account</p>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px',
            padding: '12px 16px', marginBottom: '20px', color: '#dc2626', fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* Toggle Login Mode */}
        <div style={{ display: 'flex', marginBottom: '24px', background: '#f1f5f9', borderRadius: '8px', padding: '4px' }}>
          <button
            onClick={() => { setMode('login'); setError(''); }}
            style={{
              flex: 1, padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: 600,
              background: mode === 'login' ? 'white' : 'transparent',
              color: mode === 'login' ? NAVY : '#94a3b8',
              boxShadow: mode === 'login' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            Password
          </button>
          <button
            onClick={() => { setMode('magic'); setError(''); }}
            style={{
              flex: 1, padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: 600,
              background: mode === 'magic' ? 'white' : 'transparent',
              color: mode === 'magic' ? NAVY : '#94a3b8',
              boxShadow: mode === 'magic' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            Magic Link
          </button>
        </div>

        <form onSubmit={mode === 'login' ? handlePasswordLogin : handleMagicLink}>
          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@organization.org"
              required
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '8px',
                border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = TEAL}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Password (only in password mode) */}
          {mode === 'login' && (
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '8px',
                  border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = TEAL}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          )}

          {/* Forgot Password */}
          {mode === 'login' && (
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={handleForgotPassword}
                style={{ background: 'none', border: 'none', color: TEAL, fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px', borderRadius: '8px', border: 'none',
              background: loading ? '#94a3b8' : TEAL, color: 'white',
              fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: mode === 'magic' ? '8px' : '0',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Send Magic Link'}
          </button>
        </form>

        {/* Sign Up Link */}
        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748b' }}>
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate('/signup')}
            style={{ background: 'none', border: 'none', color: TEAL, cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
          >
            Start Free Trial
          </button>
        </p>

        {/* Back to Home */}
        <p style={{ textAlign: 'center', marginTop: '12px' }}>
          <button
            onClick={() => onNavigate('/')}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px' }}
          >
            ← Back to Homepage
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
