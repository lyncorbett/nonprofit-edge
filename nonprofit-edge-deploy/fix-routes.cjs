const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

const fixed = content
  .replace(
    `case '/ceo-evaluation/use':\n        return requireAuth(<CEOEvaluationSetup />);`,
    `case '/ceo-evaluation/use':\n        return requireAuth(<CEOEvaluation onNavigate={navigate} />);\n\n      case '/board-ceo-evaluation/use':\n        return requireAuth(<CEOEvaluationSetup />);`
  );

fs.writeFileSync('src/App.tsx', fixed);
console.log('✅ Routes fixed');
