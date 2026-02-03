import React from 'react';

interface SignUpSuccessProps {
  onNavigate?: (route: string) => void;
}

const SignUpSuccess: React.FC<SignUpSuccessProps> = ({ onNavigate }) => {
  const navigate = (path: string) => {
    if (onNavigate) onNavigate(path);
    else window.location.href = path;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '480px', textAlign: 'center', padding: '24px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#0097A9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '28px', color: 'white' }}>✓</div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0D2C54', marginBottom: '12px' }}>Welcome to The Nonprofit Edge!</h1>
        <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '32px', lineHeight: 1.6 }}>
          Your account has been created successfully. Check your email for a confirmation link, then dive into your dashboard to get started.
        </p>
        <button onClick={() => navigate('/login')} style={{ padding: '14px 32px', background: '#0097A9', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', marginBottom: '12px', width: '100%' }}>
          Sign In to Your Dashboard →
        </button>
        <button onClick={() => navigate('/')} style={{ padding: '10px 24px', background: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
          Return to Homepage
        </button>
      </div>
    </div>
  );
};

export default SignUpSuccess;