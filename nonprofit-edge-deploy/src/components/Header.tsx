import React, { useState } from 'react'

interface HeaderProps {
  onNavigate: (page: string) => void
}

export default function Header({ onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0d9488] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="font-bold text-xl text-gray-900">The Nonprofit Edge</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#tools" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Tools
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              About
            </a>
            <button 
              onClick={() => onNavigate('login')}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => onNavigate('signup')}
              className="px-5 py-2.5 bg-[#0d9488] text-white rounded-lg font-semibold hover:bg-[#0f766e] transition-colors"
            >
              Start Free Trial
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-gray-100 mt-4">
            <div className="flex flex-col space-y-3">
              <a href="#tools" className="py-2 text-gray-600 hover:text-gray-900 font-medium">
                Tools
              </a>
              <a href="#pricing" className="py-2 text-gray-600 hover:text-gray-900 font-medium">
                Pricing
              </a>
              <a href="#about" className="py-2 text-gray-600 hover:text-gray-900 font-medium">
                About
              </a>
              <button 
                onClick={() => onNavigate('login')}
                className="py-2 text-gray-600 hover:text-gray-900 font-medium text-left"
              >
                Sign In
              </button>
              <button 
                onClick={() => onNavigate('signup')}
                className="py-2.5 px-4 bg-[#0d9488] text-white rounded-lg font-semibold text-center"
              >
                Start Free Trial
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
