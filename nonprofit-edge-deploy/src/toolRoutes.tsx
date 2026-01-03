// Add these imports to your main router file (e.g., App.tsx or routes.tsx)

import ScenarioPlannerLanding from './pages/ScenarioPlannerLanding';
import BoardAssessmentLanding from './pages/BoardAssessmentLanding';
import CEOEvaluationLanding from './pages/CEOEvaluationLanding';
// import StrategicPlanLanding from './pages/StrategicPlanLanding'; // Add when ready

// Routes to add to your <Routes> or router configuration:

export const toolLandingRoutes = [
  {
    path: '/tools/scenario-planner',
    element: <ScenarioPlannerLanding />,
    title: 'PIVOT Scenario Planner'
  },
  {
    path: '/tools/board-assessment',
    element: <BoardAssessmentLanding />,
    title: 'Board Assessment'
  },
  {
    path: '/tools/ceo-evaluation',
    element: <CEOEvaluationLanding />,
    title: 'CEO Evaluation'
  },
  // {
  //   path: '/tools/strategic-plan-checkup',
  //   element: <StrategicPlanLanding />,
  //   title: 'Strategic Plan Check-Up'
  // },
];

/* 
===========================================
OPTION 1: If using React Router v6
===========================================

In your App.tsx or main router file:

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScenarioPlannerLanding from './pages/ScenarioPlannerLanding';
import BoardAssessmentLanding from './pages/BoardAssessmentLanding';
import CEOEvaluationLanding from './pages/CEOEvaluationLanding';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Existing routes */}
        
        {/* Tool Landing Pages */}
        <Route path="/tools/scenario-planner" element={<ScenarioPlannerLanding />} />
        <Route path="/tools/board-assessment" element={<BoardAssessmentLanding />} />
        <Route path="/tools/ceo-evaluation" element={<CEOEvaluationLanding />} />
        
      </Routes>
    </BrowserRouter>
  );
}

===========================================
OPTION 2: If using Next.js (App Router)
===========================================

Create these files:
- app/tools/scenario-planner/page.tsx
- app/tools/board-assessment/page.tsx
- app/tools/ceo-evaluation/page.tsx

Each file exports the component as default:

// app/tools/scenario-planner/page.tsx
import ScenarioPlannerLanding from '@/components/ScenarioPlannerLanding';
export default function Page() {
  return <ScenarioPlannerLanding />;
}

===========================================
OPTION 3: If using Next.js (Pages Router)
===========================================

Create these files:
- pages/tools/scenario-planner.tsx
- pages/tools/board-assessment.tsx
- pages/tools/ceo-evaluation.tsx

Each file exports the component as default.

*/
