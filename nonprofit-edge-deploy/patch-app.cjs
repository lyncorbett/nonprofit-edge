#!/usr/bin/env node
// patch-app.js — run with: node patch-app.js
// Adds CEO evaluation imports and routes to App.tsx

const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

// ── 1. Add imports after the LeadershipProfile import ────────────────
const importAnchor = `import LeadershipProfile from './components/LeadershipProfile';`;
const newImports = `import LeadershipProfile from './components/LeadershipProfile';

// CEO Evaluation (Admin setup + Public evaluator form)
import CEOEvaluationSetup from './components/CEOEvaluationSetup';
import EvaluatorForm from './pages/EvaluatorForm';`;

if (content.includes("import CEOEvaluationSetup")) {
  console.log('✅ Imports already added — skipping');
} else {
  content = content.replace(importAnchor, newImports);
  console.log('✅ Imports added');
}

// ── 2. Add /eval/:token public route (token-based, needs prefix match) 
// Insert before the default: case
const defaultAnchor = `      // ============================================
      // DEFAULT
      // ============================================
      default:`;

const evalRoutes = `      // ============================================
      // CEO EVALUATION — PUBLIC EVALUATOR FORM
      // ============================================
      // Token-based route: /eval/[uuid]
      // Board members land here from invitation email

      // ============================================
      // DEFAULT
      // ============================================
      default:`;

if (content.includes('// CEO EVALUATION — PUBLIC EVALUATOR FORM')) {
  console.log('✅ Eval route already added — skipping');
} else {
  content = content.replace(defaultAnchor, evalRoutes);
  console.log('✅ Eval route anchor added');
}

// ── 3. Add eval token handling inside default: block ─────────────────
const defaultHandlerAnchor = `        if (currentRoute.startsWith('/tools/')) {
          navigate('/dashboard');
          return null;
        }
        return <Homepage onNavigate={navigate} />;`;

const defaultHandlerNew = `        if (currentRoute.startsWith('/eval/')) {
          const token = currentRoute.replace('/eval/', '');
          if (token === 'unsubscribed') {
            return (
              <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', color: '#64748b' }}>
                <p>You've been unsubscribed from evaluation reminders.</p>
              </div>
            );
          }
          return <EvaluatorForm token={token} />;
        }
        if (currentRoute.startsWith('/tools/')) {
          navigate('/dashboard');
          return null;
        }
        return <Homepage onNavigate={navigate} />;`;

if (content.includes("currentRoute.startsWith('/eval/')")) {
  console.log('✅ Token handler already added — skipping');
} else {
  content = content.replace(defaultHandlerAnchor, defaultHandlerNew);
  console.log('✅ Token handler added');
}

// ── 4. Update /ceo-evaluation/use to use CEOEvaluationSetup ──────────
const oldCeoRoute = `      case '/ceo-evaluation/use':
        return requireAuth(<CEOEvaluation onNavigate={navigate} />);`;

const newCeoRoute = `      case '/ceo-evaluation/use':
        return requireAuth(<CEOEvaluationSetup />);`;

if (content.includes('<CEOEvaluationSetup />')) {
  console.log('✅ CEO route already updated — skipping');
} else {
  content = content.replace(oldCeoRoute, newCeoRoute);
  console.log('✅ CEO evaluation route updated to use CEOEvaluationSetup');
}

// ── Write the file ────────────────────────────────────────────────────
fs.writeFileSync(appPath, content, 'utf8');
console.log('\n✅ App.tsx patched successfully. Run: git add src/App.tsx && git commit -m "Add CEO evaluation routes" && git push origin main');
