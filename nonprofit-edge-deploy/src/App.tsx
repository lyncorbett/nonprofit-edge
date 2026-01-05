// ============================================
// ADD THESE TO YOUR App.tsx
// ============================================

// 1. ADD THESE IMPORTS at the top:
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'

// 2. ADD THESE ROUTES in your router/switch:

// If using React Router:
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />

// If using manual routing (like your current setup), add these cases:
case '/forgot-password':
  return <ForgotPassword />
case '/reset-password':
  return <ResetPassword />

// ============================================
// SUPABASE URL CONFIGURATION REMINDER
// ============================================
// 
// Make sure these URLs are set in Supabase Dashboard:
// Authentication → URL Configuration
//
// Site URL: https://nonprofit-edge.vercel.app
// 
// Redirect URLs (add ALL of these):
// - https://nonprofit-edge.vercel.app/**
// - https://nonprofit-edge.vercel.app/dashboard
// - https://nonprofit-edge.vercel.app/reset-password
// - https://nonprofit-edge.vercel.app/login
//
// ============================================
