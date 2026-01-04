import React from 'react'

interface FooterProps {
  onNavigate: (page: string) => void
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#1e3a5f] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#0d9488] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="font-bold text-xl">The Nonprofit Edge</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              AI-powered strategic tools for nonprofit leaders. From complexity to clarity.
            </p>
            <p className="text-gray-400 text-sm">
              A product of The Pivotal Group Consultants Inc.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-bold text-lg mb-4">Tools</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => onNavigate('ask-professor')}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Ask the Professor
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('grant-review')}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Grant Review
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('board-assessment')}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Board Assessment
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('strategic-checkup')}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Strategic Plan Analysis
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('ceo-evaluation')}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  CEO Evaluation
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('scenario-planner')}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Scenario Planning
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-lg mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <a href="#about" className="text-gray-300 hover:text-white transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Pricing
                </a>
              </li>
              <li>
                <a href="mailto:support@thenonprofitedge.com" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Contact
                </a>
              </li>
              <li>
                <a href="https://thepivotalgroup.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors text-sm">
                  The Pivotal Group
                </a>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-bold text-lg mb-4">Account</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => onNavigate('login')}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Sign In
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('signup')}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Start Free Trial
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Member Dashboard
                </button>
              </li>
            </ul>

            {/* CTA */}
            <div className="mt-6">
              <button 
                onClick={() => onNavigate('signup')}
                className="px-5 py-2.5 bg-[#0d9488] text-white rounded-lg font-semibold hover:bg-[#0f766e] transition-colors text-sm"
              >
                Get Started Free →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 The Nonprofit Edge. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
