import React, { useEffect, useRef } from 'react';

const GrantRFPReview: React.FC = () => {
  const screen1Ref = useRef<HTMLDivElement>(null);
  const screen2Ref = useRef<HTMLDivElement>(null);
  const screen3Ref = useRef<HTMLDivElement>(null);
  const uploadZoneRef = useRef<HTMLDivElement>(null);
  const filePill1Ref = useRef<HTMLDivElement>(null);
  const fileCheck1Ref = useRef<HTMLSpanElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const rewriteSectionRef = useRef<HTMLDivElement>(null);
  
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let progress = 0;
    let currentStep = 0;
    let animationTimeout: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    const resetAnimation = () => {
      screen1Ref.current?.classList.add('active');
      screen2Ref.current?.classList.remove('active');
      screen3Ref.current?.classList.remove('active');
      
      uploadZoneRef.current?.classList.remove('highlight');
      filePill1Ref.current?.classList.remove('show');
      fileCheck1Ref.current?.classList.remove('show');
      
      if (progressFillRef.current) progressFillRef.current.style.width = '0%';
      
      stepRefs.current.forEach(step => {
        step?.classList.remove('active', 'done');
      });
      
      cardRefs.current.forEach(card => card?.classList.remove('show'));
      rewriteSectionRef.current?.classList.remove('show');
      
      progress = 0;
      currentStep = 0;
    };

    const activateStep = (index: number) => {
      const step = stepRefs.current[index];
      step?.classList.add('active');
      
      if (index > 0) {
        completeStep(index - 1);
      }
      currentStep = index + 1;
    };

    const completeStep = (index: number) => {
      const step = stepRefs.current[index];
      step?.classList.remove('active');
      step?.classList.add('done');
    };

    const animateReport = () => {
      cardRefs.current.forEach((card, i) => {
        setTimeout(() => {
          card?.classList.add('show');
        }, i * 150);
      });

      setTimeout(() => {
        rewriteSectionRef.current?.classList.add('show');
      }, 600);

      animationTimeout = setTimeout(() => {
        runAnimation();
      }, 5000);
    };

    const animateProgress = () => {
      progressInterval = setInterval(() => {
        progress += 2;
        if (progressFillRef.current) progressFillRef.current.style.width = progress + '%';

        if (progress >= 15 && currentStep === 0) {
          activateStep(0);
        } else if (progress >= 40 && currentStep === 1) {
          activateStep(1);
        } else if (progress >= 65 && currentStep === 2) {
          activateStep(2);
        } else if (progress >= 90 && currentStep === 3) {
          activateStep(3);
        }

        if (progress >= 100) {
          clearInterval(progressInterval);
          completeStep(3);
          
          setTimeout(() => {
            screen2Ref.current?.classList.remove('active');
            screen3Ref.current?.classList.add('active');
            animateReport();
          }, 500);
        }
      }, 50);
    };

    const runAnimation = () => {
      resetAnimation();

      setTimeout(() => {
        uploadZoneRef.current?.classList.add('highlight');
      }, 500);

      setTimeout(() => {
        filePill1Ref.current?.classList.add('show');
      }, 1000);

      setTimeout(() => {
        fileCheck1Ref.current?.classList.add('show');
      }, 1500);

      setTimeout(() => {
        screen1Ref.current?.classList.remove('active');
        screen2Ref.current?.classList.add('active');
        animateProgress();
      }, 2500);
    };

    runAnimation();

    return () => {
      clearTimeout(animationTimeout);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="grant-rfp-review">
      <style>{`
        .grant-rfp-review {
          --navy: #0D2C54;
          --teal: #0097A9;
          --gold: #D4A853;
          --gray-50: #f9fafb;
          --gray-100: #f3f4f6;
          --gray-200: #e5e7eb;
          --gray-300: #d1d5db;
          --gray-400: #9ca3af;
          --gray-500: #6b7280;
          --gray-600: #4b5563;
          --gray-700: #374151;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--gray-700);
          line-height: 1.6;
        }

        .grant-rfp-review .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .grant-rfp-review .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s;
          border: 2px solid transparent;
        }

        .grant-rfp-review .btn-primary {
          background: var(--teal);
          color: white;
        }

        .grant-rfp-review .btn-primary:hover {
          background: #008494;
        }

        .grant-rfp-review .btn-outline {
          background: white;
          color: var(--navy);
          border: 2px solid var(--navy);
        }

        .grant-rfp-review .btn-outline:hover {
          background: var(--navy);
          color: white;
        }

        /* Hero */
        .grant-rfp-review .hero {
          padding: 80px 0 100px;
        }

        .grant-rfp-review .hero .container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .grant-rfp-review .hero-content {
          max-width: 540px;
        }

        .grant-rfp-review .hero h1 {
          font-size: 46px;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 20px;
        }

        .grant-rfp-review .hero h1 .navy {
          color: var(--navy);
        }

        .grant-rfp-review .hero h1 .teal {
          color: var(--teal);
        }

        .grant-rfp-review .hero .subtitle {
          font-size: 19px;
          color: var(--gray-600);
          margin-bottom: 12px;
          line-height: 1.6;
        }

        .grant-rfp-review .hero .audience-line {
          font-size: 15px;
          color: var(--teal);
          font-weight: 500;
          margin-bottom: 32px;
          font-style: italic;
        }

        .grant-rfp-review .hero-buttons {
          display: flex;
          gap: 16px;
        }

        /* Browser Mockup */
        .grant-rfp-review .browser-frame {
          background: white;
          border-radius: 12px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          overflow: hidden;
        }

        .grant-rfp-review .browser-header {
          background: var(--gray-100);
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid var(--gray-200);
        }

        .grant-rfp-review .browser-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .grant-rfp-review .browser-dot.red { background: #ef4444; }
        .grant-rfp-review .browser-dot.yellow { background: #eab308; }
        .grant-rfp-review .browser-dot.green { background: #22c55e; }

        .grant-rfp-review .browser-url {
          flex: 1;
          margin-left: 12px;
          background: white;
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 12px;
          color: var(--gray-500);
        }

        .grant-rfp-review .browser-content {
          height: 300px;
          position: relative;
          overflow: hidden;
        }

        /* Screens */
        .grant-rfp-review .screen {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          padding: 24px;
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .grant-rfp-review .screen.active {
          opacity: 1;
        }

        /* Upload Screen */
        .grant-rfp-review .upload-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--gray-50);
        }

        .grant-rfp-review .upload-zone {
          border: 2px dashed var(--gray-300);
          border-radius: 12px;
          padding: 28px 48px;
          text-align: center;
          transition: all 0.3s;
        }

        .grant-rfp-review .upload-zone.highlight {
          border-color: var(--teal);
          background: rgba(0, 151, 169, 0.05);
        }

        .grant-rfp-review .upload-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto 12px;
          border: 2px solid var(--gray-300);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .grant-rfp-review .upload-icon svg {
          width: 24px;
          height: 24px;
          stroke: var(--gray-400);
        }

        .grant-rfp-review .upload-text {
          font-size: 15px;
          color: var(--gray-600);
          margin-bottom: 4px;
        }

        .grant-rfp-review .upload-subtext {
          font-size: 12px;
          color: var(--gray-400);
        }

        .grant-rfp-review .file-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1px solid var(--gray-200);
          border-radius: 8px;
          padding: 10px 16px;
          margin-top: 20px;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.4s ease;
        }

        .grant-rfp-review .file-pill.show {
          opacity: 1;
          transform: translateY(0);
        }

        .grant-rfp-review .file-pill-icon svg {
          width: 20px;
          height: 20px;
          stroke: var(--gray-500);
        }

        .grant-rfp-review .file-pill-name {
          font-size: 13px;
          color: var(--gray-700);
        }

        .grant-rfp-review .file-pill-check {
          width: 16px;
          height: 16px;
          background: var(--teal);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .grant-rfp-review .file-pill-check.show {
          opacity: 1;
        }

        .grant-rfp-review .file-pill-check svg {
          width: 10px;
          height: 10px;
          stroke: white;
          stroke-width: 3;
        }

        /* Analyzing Screen */
        .grant-rfp-review .analyzing-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: white;
        }

        .grant-rfp-review .analyzing-spinner {
          width: 48px;
          height: 48px;
          border: 3px solid var(--gray-200);
          border-top-color: var(--teal);
          border-radius: 50%;
          margin-bottom: 16px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .grant-rfp-review .analyzing-text {
          font-size: 16px;
          font-weight: 600;
          color: var(--navy);
          margin-bottom: 20px;
        }

        .grant-rfp-review .progress-bar {
          width: 240px;
          height: 4px;
          background: var(--gray-200);
          border-radius: 2px;
          overflow: hidden;
        }

        .grant-rfp-review .progress-fill {
          height: 100%;
          background: var(--teal);
          border-radius: 2px;
          width: 0%;
          transition: width 0.1s linear;
        }

        .grant-rfp-review .analyzing-steps {
          margin-top: 20px;
          text-align: left;
        }

        .grant-rfp-review .analyzing-step {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--gray-400);
          margin-bottom: 6px;
          transition: color 0.3s;
        }

        .grant-rfp-review .analyzing-step.active {
          color: var(--gray-700);
        }

        .grant-rfp-review .analyzing-step.done {
          color: var(--teal);
        }

        .grant-rfp-review .step-indicator {
          width: 14px;
          height: 14px;
          border: 1.5px solid currentColor;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .grant-rfp-review .step-indicator svg {
          width: 8px;
          height: 8px;
          stroke: currentColor;
          stroke-width: 3;
          opacity: 0;
        }

        .grant-rfp-review .analyzing-step.done .step-indicator {
          background: var(--teal);
          border-color: var(--teal);
        }

        .grant-rfp-review .analyzing-step.done .step-indicator svg {
          opacity: 1;
          stroke: white;
        }

        /* Report Screen */
        .grant-rfp-review .report-screen {
          background: white;
          overflow-y: auto;
          padding: 20px;
        }

        .grant-rfp-review .report-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--gray-200);
          margin-bottom: 16px;
        }

        .grant-rfp-review .report-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--navy);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .grant-rfp-review .report-status {
          font-size: 18px;
          font-weight: 800;
          color: var(--navy);
        }

        .grant-rfp-review .score-overview {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }

        .grant-rfp-review .score-card {
          flex: 1;
          border: 1px solid var(--gray-200);
          border-radius: 6px;
          padding: 12px;
          text-align: center;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.4s ease;
        }

        .grant-rfp-review .score-card.show {
          opacity: 1;
          transform: translateY(0);
        }

        .grant-rfp-review .score-card-value {
          font-size: 22px;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 2px;
        }

        .grant-rfp-review .score-card-bar {
          height: 3px;
          background: var(--gray-200);
          border-radius: 2px;
          margin: 8px 0;
          overflow: hidden;
        }

        .grant-rfp-review .score-card-bar-fill {
          height: 100%;
          background: var(--navy);
          border-radius: 2px;
        }

        .grant-rfp-review .score-card-label {
          font-size: 10px;
          color: var(--gray-500);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .grant-rfp-review .rewrite-section {
          border: 1px solid var(--gray-200);
          border-radius: 8px;
          overflow: hidden;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.5s ease;
        }

        .grant-rfp-review .rewrite-section.show {
          opacity: 1;
          transform: translateY(0);
        }

        .grant-rfp-review .rewrite-header {
          background: var(--gray-50);
          padding: 10px 14px;
          font-size: 11px;
          font-weight: 600;
          color: var(--navy);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid var(--gray-200);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .grant-rfp-review .rewrite-header .indicator {
          width: 8px;
          height: 8px;
          background: var(--gold);
          border-radius: 50%;
        }

        .grant-rfp-review .rewrite-body {
          padding: 14px;
        }

        .grant-rfp-review .rewrite-original {
          font-size: 11px;
          color: var(--gray-600);
          margin-bottom: 10px;
          padding: 8px 10px;
          background: var(--gray-50);
          border-radius: 4px;
          border-left: 3px solid var(--gray-300);
        }

        .grant-rfp-review .rewrite-original-label {
          font-size: 9px;
          font-weight: 600;
          color: var(--gray-500);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-bottom: 3px;
        }

        .grant-rfp-review .rewrite-suggested {
          font-size: 11px;
          color: var(--navy);
          padding: 8px 10px;
          background: rgba(0, 151, 169, 0.05);
          border-radius: 4px;
          border-left: 3px solid var(--teal);
        }

        .grant-rfp-review .rewrite-suggested-label {
          font-size: 9px;
          font-weight: 600;
          color: var(--teal);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-bottom: 3px;
        }

        /* Stats Section */
        .grant-rfp-review .stats {
          padding: 60px 0;
          background: var(--teal);
        }

        .grant-rfp-review .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
          text-align: center;
        }

        .grant-rfp-review .stat-item {
          color: white;
        }

        .grant-rfp-review .stat-number {
          font-size: 56px;
          font-weight: 800;
          color: white;
          margin-bottom: 8px;
        }

        .grant-rfp-review .stat-label {
          font-size: 16px;
          opacity: 0.9;
        }

        /* Features Section */
        .grant-rfp-review .features {
          padding: 80px 0;
        }

        .grant-rfp-review .section-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .grant-rfp-review .section-header h2 {
          font-size: 36px;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 12px;
        }

        .grant-rfp-review .section-header p {
          font-size: 18px;
          color: var(--gray-500);
        }

        .grant-rfp-review .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .grant-rfp-review .feature-card {
          position: relative;
          height: 320px;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .grant-rfp-review .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .grant-rfp-review .feature-card-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          transition: transform 0.5s ease;
        }

        .grant-rfp-review .feature-card:hover .feature-card-bg {
          transform: scale(1.05);
        }

        .grant-rfp-review .feature-card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, rgba(13, 44, 84, 0) 0%, rgba(13, 44, 84, 0.85) 60%, rgba(13, 44, 84, 0.95) 100%);
        }

        .grant-rfp-review .feature-card-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 28px;
          color: white;
        }

        .grant-rfp-review .feature-card h3 {
          font-size: 22px;
          font-weight: 700;
          color: white;
          margin-bottom: 8px;
        }

        .grant-rfp-review .feature-card p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.5;
        }

        /* Before/After Section */
        .grant-rfp-review .before-after {
          padding: 80px 0;
          background: var(--gray-50);
        }

        .grant-rfp-review .comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .grant-rfp-review .comparison-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .grant-rfp-review .comparison-label {
          padding: 12px 24px;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .grant-rfp-review .comparison-card.before .comparison-label {
          background: #fef2f2;
          color: #dc2626;
        }

        .grant-rfp-review .comparison-card.after .comparison-label {
          background: rgba(0, 151, 169, 0.1);
          color: var(--teal);
        }

        .grant-rfp-review .comparison-content {
          padding: 24px;
        }

        .grant-rfp-review .comparison-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--gray-500);
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .grant-rfp-review .comparison-text {
          font-size: 16px;
          line-height: 1.7;
          color: var(--gray-700);
          font-style: italic;
          margin-bottom: 20px;
          padding: 16px;
          background: var(--gray-50);
          border-radius: 8px;
          border-left: 3px solid var(--gray-300);
        }

        .grant-rfp-review .comparison-card.after .comparison-text {
          border-left-color: var(--teal);
        }

        .grant-rfp-review .comparison-verdict {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 500;
        }

        .grant-rfp-review .comparison-card.before .comparison-verdict {
          color: #dc2626;
        }

        .grant-rfp-review .comparison-card.after .comparison-verdict {
          color: var(--teal);
        }

        .grant-rfp-review .verdict-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
        }

        .grant-rfp-review .comparison-card.before .verdict-icon {
          background: #fef2f2;
        }

        .grant-rfp-review .comparison-card.after .verdict-icon {
          background: rgba(0, 151, 169, 0.1);
        }

        /* Quote Section */
        .grant-rfp-review .quote-section {
          padding: 80px 0;
          background: white;
        }

        .grant-rfp-review .featured-quote {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .grant-rfp-review .featured-quote p {
          font-size: 24px;
          line-height: 1.6;
          color: var(--navy);
          font-style: italic;
          margin-bottom: 24px;
        }

        .grant-rfp-review .featured-quote cite {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .grant-rfp-review .cite-name {
          font-size: 16px;
          font-weight: 600;
          color: var(--navy);
          font-style: normal;
        }

        .grant-rfp-review .cite-title {
          font-size: 14px;
          color: var(--gray-500);
          font-style: normal;
        }

        /* How It Works */
        .grant-rfp-review .how-it-works {
          padding: 100px 0;
          background: linear-gradient(180deg, var(--gray-50) 0%, white 100%);
        }

        .grant-rfp-review .steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          max-width: 1000px;
          margin: 0 auto;
          position: relative;
        }

        .grant-rfp-review .steps::before {
          content: '';
          position: absolute;
          top: 40px;
          left: 15%;
          right: 15%;
          height: 2px;
          background: linear-gradient(90deg, var(--gray-200) 0%, var(--teal) 50%, var(--gray-200) 100%);
          z-index: 0;
        }

        .grant-rfp-review .step {
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .grant-rfp-review .step-number {
          width: 80px;
          height: 80px;
          background: white;
          border: 3px solid var(--navy);
          color: var(--navy);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 800;
          margin: 0 auto 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .grant-rfp-review .step:hover .step-number {
          background: var(--navy);
          color: white;
          transform: scale(1.1);
        }

        .grant-rfp-review .step h3 {
          font-size: 20px;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 10px;
        }

        .grant-rfp-review .step p {
          font-size: 15px;
          color: var(--gray-500);
          max-width: 240px;
          margin: 0 auto;
        }

        /* CTA */
        .grant-rfp-review .cta {
          padding: 120px 0;
          position: relative;
          text-align: center;
          overflow: hidden;
        }

        .grant-rfp-review .cta-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1400&h=600&fit=crop');
          background-size: cover;
          background-position: center;
        }

        .grant-rfp-review .cta-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(13, 44, 84, 0.92) 0%, rgba(0, 109, 120, 0.88) 100%);
        }

        .grant-rfp-review .cta .container {
          position: relative;
          z-index: 1;
        }

        .grant-rfp-review .cta h2 {
          font-size: 44px;
          font-weight: 800;
          color: white;
          margin-bottom: 16px;
        }

        .grant-rfp-review .cta p {
          font-size: 20px;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 40px;
        }

        .grant-rfp-review .cta .btn-primary {
          background: white;
          color: var(--navy);
          padding: 18px 42px;
          font-size: 17px;
          font-weight: 700;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }

        .grant-rfp-review .cta .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
        }

        /* Responsive */
        @media (max-width: 900px) {
          .grant-rfp-review .hero .container {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .grant-rfp-review .hero-content {
            max-width: 100%;
          }

          .grant-rfp-review .hero-buttons {
            justify-content: center;
          }

          .grant-rfp-review .hero h1 {
            font-size: 36px;
          }

          .grant-rfp-review .stats-grid,
          .grant-rfp-review .features-grid,
          .grant-rfp-review .steps,
          .grant-rfp-review .comparison-grid {
            grid-template-columns: 1fr;
          }

          .grant-rfp-review .steps::before {
            display: none;
          }

          .grant-rfp-review .browser-content {
            height: 260px;
          }

          .grant-rfp-review .cta h2 {
            font-size: 32px;
          }
        }
      `}</style>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>
              <span className="navy">Stop Submitting</span><br />
              <span className="teal">Losing Proposals</span>
            </h1>
            <p className="subtitle">Get AI feedback on your grant proposal. See what reviewers will see—and fix weak spots before it's too late.</p>
            <p className="audience-line">For nonprofit leaders, grant writers and development teams who are tired of rejection letters.</p>
            <div className="hero-buttons">
              <a href="/tools/grant-review" className="btn btn-primary">Start Your Free 3-Day Trial →</a>
              <a href="#features" className="btn btn-outline">See What You Get</a>
            </div>
          </div>
          
          {/* Animated Product Mockup */}
          <div className="hero-mockup">
            <div className="browser-frame">
              <div className="browser-header">
                <div className="browser-dot red"></div>
                <div className="browser-dot yellow"></div>
                <div className="browser-dot green"></div>
                <div className="browser-url">thenonprofitedge.org</div>
              </div>
              <div className="browser-content">
                
                {/* Screen 1: Upload */}
                <div ref={screen1Ref} className="screen upload-screen active">
                  <div ref={uploadZoneRef} className="upload-zone">
                    <div className="upload-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    </div>
                    <div className="upload-text">Upload your proposal & RFP</div>
                    <div className="upload-subtext">PDF, Word, or any format</div>
                  </div>
                  <div ref={filePill1Ref} className="file-pill">
                    <span className="file-pill-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </span>
                    <span className="file-pill-name">Grant_Proposal_Draft.pdf</span>
                    <span ref={fileCheck1Ref} className="file-pill-check">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Screen 2: Analyzing */}
                <div ref={screen2Ref} className="screen analyzing-screen">
                  <div className="analyzing-spinner"></div>
                  <div className="analyzing-text">Reviewing your proposal...</div>
                  <div className="progress-bar">
                    <div ref={progressFillRef} className="progress-fill"></div>
                  </div>
                  <div className="analyzing-steps">
                    {['Matching RFP requirements', 'Scoring each section', 'Checking funder alignment', 'Generating rewrites'].map((text, i) => (
                      <div key={i} ref={el => stepRefs.current[i] = el} className="analyzing-step">
                        <span className="step-indicator">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </span>
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Screen 3: Report */}
                <div ref={screen3Ref} className="screen report-screen">
                  <div className="report-header">
                    <div className="report-title">Proposal Review</div>
                    <div className="report-status">72/100</div>
                  </div>
                  <div className="score-overview">
                    {[
                      { value: 85, label: 'Organization', width: '85%' },
                      { value: 52, label: 'Outcomes', width: '52%' },
                      { value: 78, label: 'Budget', width: '78%' }
                    ].map((card, i) => (
                      <div key={i} ref={el => cardRefs.current[i] = el} className="score-card">
                        <div className="score-card-value">{card.value}</div>
                        <div className="score-card-bar">
                          <div className="score-card-bar-fill" style={{ width: card.width }}></div>
                        </div>
                        <div className="score-card-label">{card.label}</div>
                      </div>
                    ))}
                  </div>
                  <div ref={rewriteSectionRef} className="rewrite-section">
                    <div className="rewrite-header">
                      <span className="indicator"></span>
                      Priority Fix: Outcomes
                    </div>
                    <div className="rewrite-body">
                      <div className="rewrite-original">
                        <div className="rewrite-original-label">Your Text</div>
                        "We will improve outcomes for participants."
                      </div>
                      <div className="rewrite-suggested">
                        <div className="rewrite-suggested-label">Try This</div>
                        "We will achieve a 25% improvement in employment rates within 6 months, measured through quarterly surveys."
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">80%</div>
              <div className="stat-label">of grant applications get rejected</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">40hrs</div>
              <div className="stat-label">spent writing a single proposal</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">$0</div>
              <div className="stat-label">feedback when you lose</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <h2>What You Get</h2>
            <p>The feedback you'd get from a grant reviewer—before you submit.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-card-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop')" }}></div>
              <div className="feature-card-overlay"></div>
              <div className="feature-card-content">
                <h3>Requirements Check</h3>
                <p>Every RFP requirement mapped to your response</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-card-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop')" }}></div>
              <div className="feature-card-overlay"></div>
              <div className="feature-card-content">
                <h3>Predicted Score</h3>
                <p>Section-by-section scoring based on funder criteria</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-card-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop')" }}></div>
              <div className="feature-card-overlay"></div>
              <div className="feature-card-content">
                <h3>Real Insight</h3>
                <p>We compare what you know versus what you wrote</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After Panel */}
      <section className="before-after">
        <div className="container">
          <div className="section-header">
            <h2>See the Difference</h2>
            <p>The same organization. The same program. Two very different proposals.</p>
          </div>
          <div className="comparison-grid">
            <div className="comparison-card before">
              <div className="comparison-label">Before</div>
              <div className="comparison-content">
                <div className="comparison-title">Outcomes Section</div>
                <p className="comparison-text">"We will improve outcomes for participants in our workforce development program. Our goal is to help people find jobs and become self-sufficient members of the community."</p>
                <div className="comparison-verdict">
                  <span className="verdict-icon">✗</span>
                  <span>Vague, unmeasurable, no timeline</span>
                </div>
              </div>
            </div>
            <div className="comparison-card after">
              <div className="comparison-label">After</div>
              <div className="comparison-content">
                <div className="comparison-title">Outcomes Section</div>
                <p className="comparison-text">"Within 12 months, 75% of program participants will secure employment paying at least $18/hour, verified through employer confirmation and 90-day retention tracking."</p>
                <div className="comparison-verdict">
                  <span className="verdict-icon">✓</span>
                  <span>Specific, measurable, time-bound</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="quote-section">
        <div className="container">
          <blockquote className="featured-quote">
            <p>"Hope is not a strategy. Funders want to see exactly what you'll do, when you'll do it, and how you'll know it worked."</p>
            <cite>
              <span className="cite-name">Dr. Lyn Corbett</span>
              <span className="cite-title">Founder, The Nonprofit Edge</span>
            </cite>
          </blockquote>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Upload Both Files</h3>
              <p>Your proposal draft and the RFP requirements</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>AI Review</h3>
              <p>We score against funder criteria and flag gaps</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Fix & Submit</h3>
              <p>Apply rewrites and submit with confidence</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="cta-bg"></div>
        <div className="cta-overlay"></div>
        <div className="container">
          <h2>Win More Grants</h2>
          <p>Get feedback before you submit, not after you lose.</p>
          <a href="/tools/grant-review" className="btn btn-primary">Start Your Free 3-Day Trial →</a>
        </div>
      </section>
    </div>
  );
};

export default GrantRFPReview;
