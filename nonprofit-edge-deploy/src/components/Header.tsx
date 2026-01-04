/**
 * Shared Header Component
 * Uses regular anchor tags for navigation
 */

import React, { useState } from 'react'

const NAVY = '#1a365d'
const TEAL = '#00a0b0'

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo - Links to Home */}
        <a href="/" className="flex items-center">
          <img 
            src="/logo.svg" 
            alt="The Nonprofit Edge" 
            className="h-10"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo.jpg'
            }}
          />
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {/* Our Tools Dropdown */}
          <div className="relative group">
            <button className="text-gray-600 font-medium text-sm hover:text-gray-900 flex items-center gap-1">
              Our Tools
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {/* Dropdown */}
            <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="p-2">
                <a href="/tools/strategic-plan-analysis" className="block px-4 py-3 rounded-lg hover:bg-gray-50">
                  <div className="font-semibold text-sm" style={{ color: NAVY }}>Strategic Plan Analysis</div>
                  <div className="text-xs text-gray-500">Diagnose your plan in minutes</div>
                </a>
                <a href="/tools/grant-review" className="block px-4 py-3 rounded-lg hover:bg-gray-50">
                  <div className="font-semibold text-sm" style={{ color: NAVY }}>Grant Review</div>
                  <div className="text-xs text-gray-500">Win more grants with expert scoring</div>
                </a>
                <a href="/tools/scenario-planning" className="block px-4 py-3 rounded-lg hover:bg-gray-50">
                  <div className="font-semibold text-sm" style={{ color: NAVY }}>Strategy & Scenario Planning</div>
                  <div className="text-xs text-gray-500">Stress-test your strategy</div>
                </a>
                <a href="/tools/ceo-evaluation" className="block px-4 py-3 rounded-lg hover:bg-gray-50">
                  <div className="font-semibold text-sm" style={{ color: NAVY }}>CEO Evaluation</div>
                  <div className="text-xs text-gray-500">Build stronger leadership</div>
                </a>
                <a href="/tools/board-assessment" className="block px-4 py-3 rounded-lg hover:bg-gray-50">
                  <div className="font-semibold text-sm" style={{ color: NAVY }}>Board Assessment</div>
                  <div className="text-xs text-gray-500">Strengthen governance</div>
                </a>
              </div>
            </div>
          </div>
          
          <a href="#pricing" className="text-gray-600 font-medium text-sm hover:text-gray-900">
            Pricing
          </a>
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <a 
            href="/signin"
            className="px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition hover:opacity-90"
            style={{ backgroundColor: NAVY }}
          >
            Member Sign In
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4">
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 py-2">Our Tools</div>
            <a href="/tools/strategic-plan-analysis" className="block py-2 text-gray-600">Strategic Plan Analysis</a>
            <a href="/tools/grant-review" className="block py-2 text-gray-600">Grant Review</a>
            <a href="/tools/scenario-planning" className="block py-2 text-gray-600">Strategy & Scenario Planning</a>
            <a href="/tools/ceo-evaluation" className="block py-2 text-gray-600">CEO Evaluation</a>
            <a href="/tools/board-assessment" className="block py-2 text-gray-600">Board Assessment</a>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <a href="#pricing" className="block py-2 text-gray-600">Pricing</a>
            <a 
              href="/signin"
              className="block w-full text-center py-3 text-white rounded-lg font-semibold mt-4"
              style={{ backgroundColor: NAVY }}
            >
              Member Sign In
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
