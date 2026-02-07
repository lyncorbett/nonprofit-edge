import React, { useState, useEffect } from 'react';
import { promptInstall, isStandalone } from '../registerSW';

const InstallBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already installed or dismissed
    if (isStandalone()) return;
    if (sessionStorage.getItem('pwa-dismissed')) return;

    const handler = () => setShowBanner(true);
    window.addEventListener('pwa-install-available', handler);

    // Also show for iOS (no beforeinstallprompt event)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS && !isStandalone()) {
      setTimeout(() => setShowBanner(true), 3000);
    }

    return () => window.removeEventListener('pwa-install-available', handler);
  }, []);

  const handleInstall = async () => {
    const accepted = await promptInstall();
    if (accepted) setShowBanner(false);
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShowBanner(false);
    sessionStorage.setItem('pwa-dismissed', 'true');
  };

  if (!showBanner || dismissed) return null;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: 'linear-gradient(135deg, #0D2C54, #0a3d6b)',
      borderTop: '1px solid rgba(0,151,169,0.3)',
      padding: '16px 20px',
      display: 'flex', alignItems: 'center', gap: '14px',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
      animation: 'slideUp 0.3s ease'
    }}>
      <div style={{ fontSize: '32px' }}>📱</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: '14px', color: '#fff', marginBottom: '2px' }}>
          Get The Nonprofit Edge App
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
          {isIOS
            ? 'Tap the share button below, then "Add to Home Screen"'
            : 'Install for quick access to your tools and AI advisor'}
        </div>
      </div>
      {!isIOS && (
        <button
          onClick={handleInstall}
          style={{
            padding: '8px 20px', borderRadius: '8px', border: 'none',
            background: '#0097A9', color: '#fff', fontWeight: 600,
            fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap'
          }}
        >
          Install
        </button>
      )}
      <button
        onClick={handleDismiss}
        style={{
          background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)',
          fontSize: '18px', cursor: 'pointer', padding: '4px'
        }}
      >
        ✕
      </button>
      <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
    </div>
  );
};

export default InstallBanner;
