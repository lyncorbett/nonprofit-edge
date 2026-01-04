import React from 'react';

interface FooterProps {
  onNavigate?: (route: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNavigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.location.href = route;
    }
  };

  return (
    <footer className="bg-[#0D2C54] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.svg" alt="The Nonprofit Edge" className="h-8 w-auto brightness-0 invert" />
              <span className="text-xl font-bold text-white">
                The Nonprofit Edge
              </span>
            </a>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              AI-powered strategic planning tools for nonprofit leaders. Move from hope-based to evidence-based strategies.
            </p>
            <div className="flex gap-4">
              <a href="https://linkedin.com/company/the-nonprofit-edge" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://twitter.com/nonprofitedge" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://youtube.com/@nonprofitedge" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Tools Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Tools</h3>
            <ul className="space-y-3">
              <li><a href="/strategic-plan-checkup" onClick={(e) => { e.preventDefault(); handleNavigate('/strategic-plan-checkup'); }} className="text-gray-300 hover:text-white text-sm transition-colors cursor-pointer">Strategic Plan Check-Up</a></li>
              <li><a href="/board-assessment" onClick={(e) => { e.preventDefault(); handleNavigate('/board-assessment'); }} className="text-gray-300 hover:text-white text-sm transition-colors cursor-pointer">Board Assessment</a></li>
              <li><a href="/ceo-evaluation" onClick={(e) => { e.preventDefault(); handleNavigate('/ceo-evaluation'); }} className="text-gray-300 hover:text-white text-sm transition-colors cursor-pointer">CEO Evaluation</a></li>
              <li><a href="/scenario-planner" onClick={(e) => { e.preventDefault(); handleNavigate('/scenario-planner'); }} className="text-gray-300 hover:text-white text-sm transition-colors cursor-pointer">PIVOT Scenario Planner</a></li>
              <li><a href="/grant-review" onClick={(e) => { e.preventDefault(); handleNavigate('/grant-review'); }} className="text-gray-300 hover:text-white text-sm transition-colors cursor-pointer">Grant/RFP Review</a></li>
              <li><a href="/ask-the-professor" onClick={(e) => { e.preventDefault(); handleNavigate('/ask-the-professor'); }} className="text-gray-300 hover:text-white text-sm transition-colors cursor-pointer">Ask the Professor</a></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="/resources/templates" className="text-gray-300 hover:text-white text-sm transition-colors">Templates</a></li>
              <li><a href="/resources/guides" className="text-gray-300 hover:text-white text-sm transition-colors">Guides</a></li>
              <li><a href="/resources/webinars" className="text-gray-300 hover:text-white text-sm transition-colors">Webinars</a></li>
              <li><a href="/blog" className="text-gray-300 hover:text-white text-sm transition-colors">Blog</a></li>
              <li><a href="/book" className="text-gray-300 hover:text-white text-sm transition-colors">The Book</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="/about" className="text-gray-300 hover:text-white text-sm transition-colors">About Us</a></li>
              <li><a href="/pricing" className="text-gray-300 hover:text-white text-sm transition-colors">Pricing</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">Contact</a></li>
              <li><a href="/privacy" className="text-gray-300 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-300 hover:text-white text-sm transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} The Nonprofit Edge. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm">
              A service of <a href="https://thepivotalgroup.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">The Pivotal Group Consultants, Inc.</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
