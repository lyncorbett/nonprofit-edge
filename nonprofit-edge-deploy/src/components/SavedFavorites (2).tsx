import React from 'react';

interface SavedFavoritesProps {
  onNavigate?: (route: string) => void;
}

const SavedFavorites: React.FC<SavedFavoritesProps> = ({ onNavigate }) => {
  const navigate = (path: string) => {
    if (onNavigate) onNavigate(path);
    else window.location.href = path;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ background: 'white', padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#0D2C54', fontWeight: 600 }}>← Dashboard</button>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0D2C54', margin: 0 }}>Saved & Favorites</h1>
      </header>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '60px 40px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0D2C54', marginBottom: '8px' }}>No Saved Items Yet</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>Save reports, templates, and resources here for quick access.</p>
          <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 24px', background: '#0097A9', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedFavorites;