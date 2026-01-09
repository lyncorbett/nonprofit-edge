          backgroundImage: "url('https://images.unsplash.com/photo-1552581234-26160f608093?w=1400&h=600&fit=crop')",
          backgroundSize: 'cover', backgroundPosition: 'center'
        }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(135deg, rgba(13,44,84,0.92) 0%, rgba(0,109,120,0.88) 100%)'
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ fontSize: '44px', fontWeight: 800, color: 'white', marginBottom: '16px' }}>Transform Your Strategic Plan</h2>
          <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.85)', marginBottom: '40px' }}>From shelf decoration to organizational driving force.</p>
          <a href="/trial" style={{
            display: 'inline-flex', alignItems: 'center', padding: '18px 42px',
            background: 'white', color: NAVY, borderRadius: '8px', fontWeight: 700,
            fontSize: '17px', textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            Start Your Free 3-Day Trial →
          </a>
        </div>
      </section>

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
