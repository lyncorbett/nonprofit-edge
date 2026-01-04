import React, { useState } from 'react';

interface HeaderProps {
  onNavigate?: (route: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.location.href = route;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <a href="/" onClick={(e) => { e.preventDefault(); handleNavigate('/'); }} className="flex items-center gap-2 cursor-pointer">
            <img src="/logo.svg" alt="The Nonprofit Edge" className="h-8 w-auto" />
            <span className="text-xl font-bold" style={{ color: '#0D2C54' }}>
              The Nonprofit Edge
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-700 hover:text-[#0D2C54] font-medium transition-colors">
                Tools
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {/* Dropdown */}
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-2">
                  <a href="/strategic-plan-checkup" onClick={(e) => { e.preventDefault(); handleNavigate('/strategic-plan-checkup'); }} className="block px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="font-medium text-[#0D2C54]">Strategic Plan Check-Up</div>
                    <div className="text-sm text-gray-500">Diagnose your plan's health</div>
                  </a>
                  <a href="/board-assessment" onClick={(e) => { e.preventDefault(); handleNavigate('/board-assessment'); }} className="block px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="font-medium text-[#0D2C54]">Board Assessment</div>
                    <div className="text-sm text-gray-500">Evaluate board effectiveness</div>
                  </a>
                  <a href="/ceo-evaluation" onClick={(e) => { e.preventDefault(); handleNavigate('/ceo-evaluation'); }} className="block px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="font-medium text-[#0D2C54]">CEO Evaluation</div>
                    <div className="text-sm text-gray-500">Structured leadership reviews</div>
                  </a>
                  <a href="/scenario-planner" onClick={(e) => { e.preventDefault(); handleNavigate('/scenario-planner'); }} className="block px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="font-medium text-[#0D2C54]">PIVOT Scenario Planner</div>
                    <div className="text-sm text-gray-500">Plan for uncertainty</div>
                  </a>
                  <a href="/grant-review" onClick={(e) => { e.preventDefault(); handleNavigate('/grant-review'); }} className="block px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="font-medium text-[#0D2C54]">Grant/RFP Review</div>
                    <div className="text-sm text-gray-500">Strengthen your proposals</div>
                  </a>
                </div>
              </div>
            </div>

            <a href="/resources" onClick={(e) => { e.preventDefault(); handleNavigate('/resources'); }} className="text-gray-700 hover:text-[#0D2C54] font-medium transition-colors cursor-pointer">
              Resources
            </a>
            <a href="/pricing" onClick={(e) => { e.preventDefault(); handleNavigate('/pricing'); }} className="text-gray-700 hover:text-[#0D2C54] font-medium transition-colors cursor-pointer">
              Pricing
            </a>
            <a href="/about" onClick={(e) => { e.preventDefault(); handleNavigate('/about'); }} className="text-gray-700 hover:text-[#0D2C54] font-medium transition-colors cursor-pointer">
              About
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <a href="/login" onClick={(e) => { e.preventDefault(); handleNavigate('/login'); }} className="text-gray-700 hover:text-[#0D2C54] font-medium transition-colors cursor-pointer">
              Sign In
            </a>
            <a 
              href="/signup" 
              onClick={(e) => { e.preventDefault(); handleNavigate('/signup'); }}
              className="px-5 py-2 bg-[#0D2C54] text-white font-semibold rounded-lg hover:bg-[#0a2040] transition-colors cursor-pointer"
            >
              Start Free Trial
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col gap-2">
              <div className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase">Tools</div>
              <a href="/strategic-plan-checkup" onClick={(e) => { e.preventDefault(); handleNavigate('/strategic-plan-checkup'); setMobileMenuOpen(false); }} className="px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">Strategic Plan Check-Up</a>
              <a href="/board-assessment" onClick={(e) => { e.preventDefault(); handleNavigate('/board-assessment'); setMobileMenuOpen(false); }} className="px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">Board Assessment</a>
              <a href="/ceo-evaluation" onClick={(e) => { e.preventDefault(); handleNavigate('/ceo-evaluation'); setMobileMenuOpen(false); }} className="px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">CEO Evaluation</a>
              <a href="/scenario-planner" onClick={(e) => { e.preventDefault(); handleNavigate('/scenario-planner'); setMobileMenuOpen(false); }} className="px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">PIVOT Scenario Planner</a>
              <a href="/grant-review" onClick={(e) => { e.preventDefault(); handleNavigate('/grant-review'); setMobileMenuOpen(false); }} className="px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">Grant/RFP Review</a>
              <div className="border-t border-gray-100 my-2"></div>
              <a href="/resources" onClick={(e) => { e.preventDefault(); handleNavigate('/resources'); setMobileMenuOpen(false); }} className="px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">Resources</a>
              <a href="/pricing" onClick={(e) => { e.preventDefault(); handleNavigate('/pricing'); setMobileMenuOpen(false); }} className="px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">Pricing</a>
              <a href="/about" onClick={(e) => { e.preventDefault(); handleNavigate('/about'); setMobileMenuOpen(false); }} className="px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">About</a>
              <div className="border-t border-gray-100 my-2"></div>
              <a href="/login" onClick={(e) => { e.preventDefault(); handleNavigate('/login'); setMobileMenuOpen(false); }} className="px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">Sign In</a>
              <a href="/signup" onClick={(e) => { e.preventDefault(); handleNavigate('/signup'); setMobileMenuOpen(false); }} className="mx-4 mt-2 px-4 py-2 bg-[#0D2C54] text-white font-semibold rounded-lg text-center cursor-pointer">
                Start Free Trial
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
