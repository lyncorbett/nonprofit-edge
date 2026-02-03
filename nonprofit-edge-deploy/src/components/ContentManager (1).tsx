import React from 'react';

const ContentManager: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0D2C54', marginBottom: '8px' }}>Content Manager</h1>
        <p style={{ color: '#64748b', marginBottom: '32px' }}>Manage platform content, resources, and templates.</p>
        <div style={{ background: 'white', borderRadius: '12px', padding: '40px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#94a3b8', fontSize: '16px' }}>Content management interface coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default ContentManager;