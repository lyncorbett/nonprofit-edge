/**
 * THE NONPROFIT EDGE - Sign Up Page
 * Real Supabase Authentication
 * Updated: February 3, 2026
 * 
 * Creates a real Supabase auth user with plan metadata.
 */

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const NAVY = '#0D2C54';
const TEAL = '#0097A9';

interface SignUpProps {
  onSignUpSuccess: (userData: { id: string; email: string; name: string; role: string }) => void;
  onNavigate: (route: string) => void;
}

const plans = [
  { id: 'essential', name: 'Essential', price: '$79', desc: '3 AI tools, 5 downloads/mo' },
  { id: 'professional', name: 'Professional', price: '$159', desc: 'All tools, 25 downloads/mo', popular: true },
  { id: 'premium', name: 'Premium', price: '$329', desc: 'Unlimited everything + priority' },
];

const SignUp: React.FC<SignUpProps> = ({ onSignUpSuccess, onNavigate }) => {
  const [step, setStep] = useState<'plan' | 'details'>('plan');
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName,
            organization: organization,
            plan: selectedPlan,
            role: 'owner',
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // If email confirmation is required, show message
        if (!data.session) {
          onNavigate('/signup/success');
          return;
        }

        // If auto-confirmed, log them in
        onSignUpSuccess({
          id: data.user.id,
          email: data.user.email || email,
          name: fullName,
          role: 'owner',
        });
      }
    } catch (err: any) {
      console.error('[SignUp] Error:', err);
      if (err.message?.includes('already registered')) {
        setError('An account with this email already exists. Try signing in instead.');
      } else {
        setError(err.message || 'Sign up failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '20px' }}>
      <div style={{ background: 'white', padding: '48px', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: '100%', maxWidth: step === 'plan' ? '700px' : '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <button onClick={() => onNavigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <img src="/logo.svg" alt="The Nonprofit Edge" style={{ width: '200px', height: 'auto' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </button>
        </div>

        {step === 'plan' ? (
          <>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: NAVY, textAlign: 'center', marginBottom: '4px' }}>Choose Your Plan</h1>
            <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '28px', fontSize: '15px' }}>Start with a 3-day free trial. Cancel anytime.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  style={{
                    padding: '20px 16px', borderRadius: '12px', cursor: 'pointer', textAlign: 'center',
                    border: selectedPlan === plan.id ? `2px solid ${TEAL}` : '2px solid #e2e8f0',
                    background: selectedPlan === plan.id ? '#f0fdfa' : 'white',
                    position: 'relative',
                    transition: 'all 0.2s',
                  }}
                >
                  {plan.popular && (
                    <div style={{
                      position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
                      background: TEAL, color: 'white', fontSize: '10px', fontWeight: 700,
                      padding: '2px 10px', borderRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.5px',
                    }}>
                      Most Popular
                    </div>
                  )}
                  <div style={{ fontSize: '16px', fontWeight: 700, color: NAVY, marginBottom: '4px' }}>{plan.name}</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: TEAL, marginBottom: '8px' }}>{plan.price}<span style={{ fontSize: '13px', fontWeight: 400, color: '#94a3b8' }}>/mo</span></div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{plan.desc}</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep('details')}
              style={{
                width: '100%', padding: '14px', borderRadius: '8px', border: 'none',
                background: TEAL, color: 'white', fontSize: '15px', fontWeight: 600, cursor: 'pointer',
              }}
            >
              Continue →
            </button>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: NAVY, textAlign: 'center', marginBottom: '4px' }}>Create Your Account</h1>
            <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '28px', fontSize: '15px' }}>
              {plans.find(p => p.id === selectedPlan)?.name} Plan — 3-day free trial
            </p>

            {error && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px',
                padding: '12px 16px', marginBottom: '20px', color: '#dc2626', fontSize: '14px',
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSignUp}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Full Name *</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" required
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={(e) => e.target.style.borderColor = TEAL} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Organization</label>
                <input type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="Your organization name"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={(e) => e.target.style.borderColor = TEAL} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Email *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@organization.org" required
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={(e) => e.target.style.borderColor = TEAL} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Password *</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" required minLength={6}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={(e) => e.target.style.borderColor = TEAL} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <button type="submit" disabled={loading}
                style={{
                  width: '100%', padding: '14px', borderRadius: '8px', border: 'none',
                  background: loading ? '#94a3b8' : TEAL, color: 'white',
                  fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Creating account...' : 'Start Free Trial'}
              </button>

              <button type="button" onClick={() => setStep('plan')}
                style={{ width: '100%', padding: '10px', marginTop: '8px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px' }}
              >
                ← Change Plan
              </button>
            </form>
          </>
        )}

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b' }}>
          Already have an account?{' '}
          <button onClick={() => onNavigate('/login')} style={{ background: 'none', border: 'none', color: TEAL, cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
