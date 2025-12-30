/**
 * THE NONPROFIT EDGE - SignUp Success Page
 * Shown after successful registration
 */

import React, { useEffect, useState } from 'react';

const NAVY = '#1a365d';
const TEAL = '#0097a7';

interface SignUpSuccessProps {
  onNavigate: (page: string) => void;
}

const SignUpSuccess: React.FC<SignUpSuccessProps> = ({ onNavigate }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onNavigate('dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onNavigate]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Outfit', sans-serif",
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: 24,
        boxShadow: '0 4px 40px rgba(0,0,0,0.1)',
        padding: '3rem',
        maxWidth: 500,
        width: '100%',
        textAlign: 'center'
      }}>
        {/* Success Icon */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: '#dcfce7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          fontSize: '2.5rem'
        }}>
          🎉
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: NAVY, marginBottom: '0.75rem' }}>
          Welcome to The Nonprofit Edge!
        </h1>
        
        <p style={{ fontSize: '1.125rem', color: '#64748b', marginBottom: '2rem', lineHeight: 1.6 }}>
          Your account has been created successfully. Your 3-day free trial starts now!
        </p>

        {/* Trial Info */}
        <div style={{
          background: '#f0fdfa',
          border: '1px solid #99f6e4',
          borderRadius: 12,
          padding: '1.25rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>⏱️</span>
            <span style={{ fontWeight: 600, color: NAVY }}>Your trial ends in 3 days</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Explore all features free. We'll remind you before charging.
          </p>
        </div>

        {/* What's Next */}
        <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            Here's what to do first:
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { icon: '👤', text: 'Complete your profile' },
              { icon: '📋', text: 'Run your first Strategic Plan Check-Up' },
              { icon: '🎓', text: 'Ask the Professor a question' }
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                background: '#f8fafc',
                borderRadius: 8
              }}>
                <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                <span style={{ color: NAVY, fontWeight: 500 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onNavigate('dashboard')}
          style={{
            width: '100%',
            padding: '1rem',
            background: TEAL,
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Go to Dashboard →
        </button>

        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#94a3b8' }}>
          Redirecting automatically in {countdown} seconds...
        </p>
      </div>
    </div>
  );
};

export default SignUpSuccess;
