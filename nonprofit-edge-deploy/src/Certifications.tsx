/**
 * THE NONPROFIT EDGE - Certifications Page
 * Training courses and certifications for nonprofit professionals
 */

import React, { useState } from 'react';

const COLORS = {
  navy: '#0D2C54', navyLight: '#1a4175', teal: '#0097A9', tealDark: '#007d8c',
  purple: '#7c3aed', white: '#ffffff', gray50: '#f8fafc', gray100: '#f1f5f9',
  gray200: '#e2e8f0', gray400: '#9ca3af', gray500: '#6b7280', gray600: '#4b5563',
  gray700: '#374151', gray900: '#111827', green500: '#22c55e',
};

const CERTIFICATIONS = [
  { id: '1', title: 'Board Governance Fundamentals', description: 'Master nonprofit board service essentials.', modules: 6, duration: '4 hours', level: 'Foundation', status: 'available', badge: '🏅' },
  { id: '2', title: 'Strategic Planning Certification', description: 'Learn strategic planning processes.', modules: 8, duration: '6 hours', level: 'Intermediate', status: 'available', badge: '🎯' },
  { id: '3', title: 'Theory of Constraints Practitioner', description: 'Apply TOC to eliminate bottlenecks.', modules: 5, duration: '3 hours', level: 'Intermediate', status: 'available', badge: '⛓️' },
  { id: '4', title: 'Nonprofit Financial Leadership', description: 'Financial management expertise.', modules: 7, duration: '5 hours', level: 'Intermediate', status: 'coming_soon', badge: '💰' },
  { id: '5', title: 'Executive Director Excellence', description: 'Advanced leadership training.', modules: 10, duration: '8 hours', level: 'Advanced', status: 'coming_soon', badge: '👔' },
  { id: '6', title: 'Grant Writing Mastery', description: 'Write winning grant proposals.', modules: 6, duration: '4 hours', level: 'Foundation', status: 'coming_soon', badge: '✍️' },
];

interface CertificationsProps { user?: any; organization?: any; supabase?: any; navigate?: (path: string) => void; }

const Certifications: React.FC<CertificationsProps> = ({ navigate }) => {
  const [selectedLevel, setSelectedLevel] = useState('all');
  const filteredCerts = CERTIFICATIONS.filter(c => selectedLevel === 'all' || c.level.toLowerCase() === selectedLevel);
  const availableCerts = filteredCerts.filter(c => c.status === 'available');
  const comingSoonCerts = filteredCerts.filter(c => c.status === 'coming_soon');

  const handleBack = () => { if (navigate) navigate('/dashboard'); else window.location.href = '/dashboard'; };
  const getLevelColor = (level: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      Foundation: { bg: '#dcfce7', text: '#166534' }, Intermediate: { bg: '#dbeafe', text: '#1e40af' }, Advanced: { bg: '#ede9fe', text: '#6b21a8' },
    };
    return colors[level] || { bg: COLORS.gray100, text: COLORS.gray600 };
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.gray50, fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: COLORS.white, borderBottom: `1px solid ${COLORS.gray200}`, padding: '24px 48px' }}>
        <button onClick={handleBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '14px', fontWeight: 500, color: COLORS.teal, background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: '16px' }}>
          ← Back to Dashboard
        </button>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: COLORS.navy, marginBottom: '8px' }}>Certifications</h1>
        <p style={{ fontSize: '16px', color: COLORS.gray500 }}>Professional development courses to advance your nonprofit career</p>
      </div>

      {/* Stats */}
      <div style={{ padding: '32px 48px', background: `linear-gradient(135deg, ${COLORS.purple}10, ${COLORS.teal}10)` }}>
        <div style={{ display: 'flex', gap: '32px' }}>
          <div style={{ background: COLORS.white, borderRadius: '12px', padding: '24px 32px', textAlign: 'center', border: `1px solid ${COLORS.gray200}` }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎓</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: COLORS.navy }}>0</div>
            <div style={{ fontSize: '13px', color: COLORS.gray500 }}>Completed</div>
          </div>
          <div style={{ background: COLORS.white, borderRadius: '12px', padding: '24px 32px', textAlign: 'center', border: `1px solid ${COLORS.gray200}` }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>📚</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: COLORS.navy }}>{availableCerts.length}</div>
            <div style={{ fontSize: '13px', color: COLORS.gray500 }}>Available</div>
          </div>
          <div style={{ background: COLORS.white, borderRadius: '12px', padding: '24px 32px', textAlign: 'center', border: `1px solid ${COLORS.gray200}` }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🏆</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: COLORS.navy }}>2</div>
            <div style={{ fontSize: '13px', color: COLORS.gray500 }}>Badges Earned</div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div style={{ padding: '20px 48px', background: COLORS.white, borderBottom: `1px solid ${COLORS.gray200}` }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'foundation', 'intermediate', 'advanced'].map(level => (
            <button key={level} onClick={() => setSelectedLevel(level)} style={{
              padding: '8px 16px', fontSize: '13px', fontWeight: 500, borderRadius: '20px', cursor: 'pointer', border: `1px solid ${COLORS.gray200}`,
              background: selectedLevel === level ? COLORS.purple : COLORS.gray50, color: selectedLevel === level ? COLORS.white : COLORS.gray600,
            }}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Available Certifications */}
      <div style={{ padding: '40px 48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: COLORS.navy, marginBottom: '24px' }}>🎓 Available Certifications</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {availableCerts.map(cert => {
            const levelColors = getLevelColor(cert.level);
            return (
              <div key={cert.id} style={{ background: COLORS.white, borderRadius: '16px', padding: '28px', border: `1px solid ${COLORS.gray200}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <span style={{ fontSize: '40px' }}>{cert.badge}</span>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '12px', background: levelColors.bg, color: levelColors.text }}>{cert.level}</span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: COLORS.navy, marginBottom: '8px' }}>{cert.title}</h3>
                <p style={{ fontSize: '14px', color: COLORS.gray600, lineHeight: 1.5, marginBottom: '20px' }}>{cert.description}</p>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', fontSize: '13px', color: COLORS.gray500 }}>
                  <span>📚 {cert.modules} modules</span>
                  <span>⏱ {cert.duration}</span>
                </div>
                <button style={{ width: '100%', padding: '14px', fontSize: '15px', fontWeight: 600, color: COLORS.white, background: COLORS.purple, border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
                  Start Course →
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coming Soon */}
      {comingSoonCerts.length > 0 && (
        <div style={{ padding: '0 48px 60px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: COLORS.navy, marginBottom: '24px' }}>🔜 Coming Soon</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
            {comingSoonCerts.map(cert => (
              <div key={cert.id} style={{ background: COLORS.gray50, borderRadius: '16px', padding: '28px', border: `1px dashed ${COLORS.gray200}`, opacity: 0.8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <span style={{ fontSize: '40px', filter: 'grayscale(50%)' }}>{cert.badge}</span>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '12px', background: COLORS.gray200, color: COLORS.gray600 }}>Coming Soon</span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: COLORS.navy, marginBottom: '8px' }}>{cert.title}</h3>
                <p style={{ fontSize: '14px', color: COLORS.gray600, lineHeight: 1.5, marginBottom: '20px' }}>{cert.description}</p>
                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: COLORS.gray500 }}>
                  <span>📚 {cert.modules} modules</span>
                  <span>⏱ {cert.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Certifications;
