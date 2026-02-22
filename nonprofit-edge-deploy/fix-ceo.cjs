const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');
c = c.replace(
  `import CEOEvaluation from './components/CEOEvaluation';`,
  `import CEOEvaluation from './components/CEOEvaluation';\nimport CEOSelfAssessment from './components/CEOSelfAssessment';`
);
c = c.replace(
  `case '/ceo-evaluation/use':\n        return requireAuth(<CEOEvaluation onNavigate={navigate} />);`,
  `case '/ceo-evaluation/use':\n        return requireAuth(<CEOSelfAssessment onNavigate={navigate} />);`
);
fs.writeFileSync('src/App.tsx', c);
console.log('✅ Done');
