/**
 * THE NONPROFIT EDGE - SignUp Success
 * Shows after Stripe checkout completes
 * Confetti celebration + "Check your email" instruction
 */

import React, { useEffect, useState, useRef } from 'react';

const NAVY = '#0D2C54';
const TEAL = '#0097A9';

interface SignUpSuccessProps {
  onNavigate?: (route: string) => void;
}

// Simple confetti particle
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

const CONFETTI_COLORS = ['#0097A9', '#0D2C54', '#FFD700', '#FF6B6B', '#48BB78', '#9F7AEA', '#F6AD55'];

const SignUpSuccess: React.FC<SignUpSuccessProps> = ({ onNavigate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showContent, setShowContent] = useState(false);
  const planName = new URLSearchParams(window.location.search).get('plan') || 'professional';
  const planDisplay = planName.charAt(0).toUpperCase() + planName.slice(1);

  // Confetti animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];

    // Create particles in bursts
    const createBurst = (count: number) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: canvas.width * (0.3 + Math.random() * 0.4),
          y: canvas.height * 0.3,
          vx: (Math.random() - 0.5) * 12,
          vy: -Math.random() * 12 - 4,
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          size: Math.random() * 8 + 4,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
          opacity: 1,
        });
      }
    };

    createBurst(80);
    setTimeout(() => createBurst(60), 300);
    setTimeout(() => createBurst(40), 600);

    let animFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // gravity
        p.vx *= 0.99;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.003;

        if (p.opacity <= 0 || p.y > canvas.height + 20) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }

      if (particles.length > 0) {
        animFrame = requestAnimationFrame(animate);
      }
    };

    animate();
    setTimeout(() => setShowContent(true), 200);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navigate = (path: string) => {
    if (onNavigate) onNavigate(path);
    else window.location.href = path;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'DM Sans', system-ui, sans-serif", position: 'relative', overflow: 'hidden' }}>
      {/* Confetti Canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}
      />

      {/* Header */}
      <div style={{ background: NAVY, padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'white', fontSize: '18px', fontWeight: 700 }}>The Nonprofit</span>
          <span style={{ color: TEAL, fontSize: '18px', fontWeight: 700 }}>Edge</span>
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '520px',
        margin: '0 auto',
        padding: '80px 24px',
        textAlign: 'center',
        opacity: showContent ? 1 : 0,
        transform: showContent ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease',
      }}>
        {/* Celebration Icon */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: `linear-gradient(135deg, ${TEAL}, #00c4d6)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', fontSize: '36px',
          boxShadow: '0 8px 24px rgba(0, 151, 169, 0.3)',
        }}>
          🎉
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: 800, color: NAVY, marginBottom: '12px', lineHeight: 1.2 }}>
          Welcome to The Nonprofit Edge!
        </h1>

        <p style={{ fontSize: '18px', color: '#475569', marginBottom: '8px', lineHeight: 1.6 }}>
          Your <strong>{planDisplay}</strong> trial is active.
        </p>

        <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '40px', lineHeight: 1.6 }}>
          We just sent a welcome email to your inbox with everything you need to get started. Open it to set up your account and access your dashboard.
        </p>

        {/* Email illustration */}
        <div style={{
          background: 'white', borderRadius: '16px', padding: '32px',
          border: '1px solid #e2e8f0', marginBottom: '32px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📬</div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: NAVY, marginBottom: '8px' }}>
            Check Your Email
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>
            Look for an email from <strong style={{ color: TEAL }}>The Nonprofit Edge</strong>. 
            Click the link inside to set your password and complete your account setup.
          </p>
        </div>

        {/* What happens next */}
        <div style={{ textAlign: 'left', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: NAVY, marginBottom: '12px' }}>What happens next:</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { step: '1', text: 'Open the welcome email and click the setup link' },
              { step: '2', text: 'Tell us about your organization (takes 2 minutes)' },
              { step: '3', text: 'Start using your strategic tools right away' },
            ].map(item => (
              <div key={item.step} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', background: TEAL,
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: 700, flexShrink: 0,
                }}>
                  {item.step}
                </div>
                <span style={{ fontSize: '14px', color: '#475569' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>
          Didn't get the email? Check your spam folder or{' '}
          <button
            onClick={() => navigate('/login')}
            style={{ color: TEAL, background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, textDecoration: 'underline' }}
          >
            try signing in
          </button>
          .
        </p>
      </div>
    </div>
  );
};

export default SignUpSuccess;
