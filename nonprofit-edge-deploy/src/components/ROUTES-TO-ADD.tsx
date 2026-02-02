// ============================================
// ROUTES TO ADD TO YOUR App.tsx
// ============================================
// 
// Add these imports at the top of App.tsx:

import CEOEvaluation from './components/CEOEvaluation';
import BoardAssessment from './components/BoardAssessment';
import StrategicPlanCheckup from './components/StrategicPlanCheckup';
import GrantReview from './components/GrantReview';
import ScenarioPlanner from './components/ScenarioPlanner';
import AskTheProfessor from './components/AskTheProfessor';
import LeadershipAssessment from './components/LeadershipAssessment';
import LeadershipReport from './components/LeadershipReport';
import LeadershipProfile from './components/LeadershipProfile';

// ============================================
// Add these cases to your route switch statement:
// ============================================

// CEO Evaluation - Connected to Make.com
case '/ceo-evaluation':
case '/tools/ceo-evaluation':
  return requireAuth(
    <CEOEvaluation onNavigate={(route: string) => navigate(route)} />
  );

// Board Assessment - Connected to Make.com
case '/board-assessment':
case '/tools/board-assessment':
  return requireAuth(
    <BoardAssessment onNavigate={(route: string) => navigate(route)} />
  );

// Strategic Plan Check-Up - Connected to n8n
case '/strategic-plan':
case '/strategic-plan-checkup':
case '/tools/strategic-plan':
  return requireAuth(
    <StrategicPlanCheckup onNavigate={(route: string) => navigate(route)} />
  );

// Grant/RFP Review - Connected to n8n
case '/grant-review':
case '/tools/grant-review':
  return requireAuth(
    <GrantReview onNavigate={(route: string) => navigate(route)} />
  );

// Scenario Planner - Connected to n8n
case '/scenario-planner':
case '/tools/scenario-planner':
  return requireAuth(
    <ScenarioPlanner onNavigate={(route: string) => navigate(route)} />
  );

// Ask the Professor - Connected to Vercel API / n8n
case '/ask-professor':
case '/ask-the-professor':
case '/tools/ask-professor':
  return requireAuth(
    <AskTheProfessor onNavigate={(route: string) => navigate(route)} />
  );

// Leadership Assessment - New tool
case '/leadership-assessment':
case '/tools/leadership-assessment':
  return requireAuth(
    <LeadershipAssessment onNavigate={(route: string) => navigate(route)} />
  );

// Leadership Report - View assessment results
case '/leadership-assessment/report':
  return requireAuth(
    <LeadershipReport onNavigate={(route: string) => navigate(route)} />
  );

// ============================================
// WEBHOOK CONNECTIONS SUMMARY
// ============================================
//
// Make.com Webhooks:
// - CEO Evaluation: https://hook.us1.make.com/446eyqchvkowne5vusqyk1nq895hmk6b
// - Board Assessment: https://hook.us1.make.com/cstwxmspr9uctfewmr6dcp4tk9mgrjdp
//
// n8n Webhooks:
// - Strategic Plan: https://thenonprofitedge.app.n8n.cloud/webhook/strategic_plan
// - Grant Review: https://thenonprofitedge.app.n8n.cloud/webhook/rfp
// - Scenario Planner: https://thenonprofitedge.app.n8n.cloud/webhook/scenario-planner
// - Ask the Professor: https://thenonprofitedge.app.n8n.cloud/webhook/professor
//   (Also has Vercel API fallback at /api/ask-professor)
//
// Supabase Direct:
// - Leadership Assessment: Stores directly to Supabase tables
//
// ============================================
