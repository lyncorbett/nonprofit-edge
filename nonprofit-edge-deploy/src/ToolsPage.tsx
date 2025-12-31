import React from 'react';
import { 
  ClipboardCheck, 
  MessageCircle, 
  UserCheck, 
  Users, 
  FileSearch, 
  GitBranch, 
  FileText,
  ArrowLeft,
  Lock
} from 'lucide-react';

interface ToolsPageProps {
  userTier: 'free' | 'professional' | 'enterprise';
  onNavigate: (route: string) => void;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  tier: 'free' | 'professional' | 'enterprise';
  comingSoon?: boolean;
}

const ToolsPage: React.FC<ToolsPageProps> = ({ userTier, onNavigate }) => {
  const tools: Tool[] = [
    {
      id: 'strategic-plan',
      name: 'Strategic Plan Check-Up',
      description: 'Evaluate the health and effectiveness of your strategic plan with AI-powered analysis.',
      icon: <ClipboardCheck className="w-8 h-8" />,
      route: '/tools/strategic-plan',
      tier: 'free',
    },
    {
      id: 'ask-professor',
      name: 'Ask The Professor',
      description: 'Get expert guidance on nonprofit leadership, governance, and strategy questions.',
      icon: <MessageCircle className="w-8 h-8" />,
      route: '/tools/ask-professor',
      tier: 'free',
    },
    {
      id: 'ceo-evaluation',
      name: 'CEO Performance Evaluation',
      description: 'Comprehensive evaluation framework for nonprofit executive performance.',
      icon: <UserCheck className="w-8 h-8" />,
      route: '/tools/ceo-evaluation',
      tier: 'professional',
    },
    {
      id: 'board-assessment',
      name: 'Board Assessment',
      description: 'Evaluate board effectiveness, engagement, and governance practices.',
      icon: <Users className="w-8 h-8" />,
      route: '/tools/board-assessment',
      tier: 'professional',
      comingSoon: true,
    },
    {
      id: 'grant-review',
      name: 'Grant Proposal Review',
      description: 'Get AI feedback on your grant proposals before submission.',
      icon: <FileSearch className="w-8 h-8" />,
      route: '/tools/grant-review',
      tier: 'professional',
    },
    {
      id: 'scenario-planner',
      name: 'Scenario Planner',
      description: 'Model different strategic scenarios and their potential outcomes.',
      icon: <GitBranch className="w-8 h-8" />,
      route: '/tools/scenario-planner',
      tier: 'enterprise',
    },
    {
      id: 'ai-summary',
      name: 'AI Document Summary',
      description: 'Upload any document and get an instant AI-generated summary.',
      icon: <FileText className="w-8 h-8" />,
      route: '/tools/ai-summary',
      tier: 'free',
    },
  ];

  const getTierLevel = (tier: string): number => {
    switch (tier) {
      case 'free': return 0;
      case 'professional': return 1;
      case 'enterprise': return 2;
      default: return 0;
    }
  };

  const canAccess = (toolTier: string): boolean => {
    return getTierLevel(userTier) >= getTierLevel(toolTier);
  };

  const getTierBadgeColor = (tier: string): string => {
    switch (tier) {
      case 'free': return 'bg-green-100 text-green-700';
      case 'professional': return 'bg-blue-100 text-blue-700';
      case 'enterprise': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Your Plan:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getTierBadgeColor(userTier)}`}>
              {userTier}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI-Powered Tools</h1>
          <p className="text-gray-600">
            Leverage cutting-edge AI to strengthen your nonprofit's strategy, governance, and operations.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const hasAccess = canAccess(tool.tier);
            const isDisabled = !hasAccess || tool.comingSoon;

            return (
              <div
                key={tool.id}
                className={`bg-white rounded-xl border ${
                  isDisabled ? 'border-gray-200 opacity-75' : 'border-gray-200 hover:border-teal-300 hover:shadow-lg'
                } transition-all duration-200 overflow-hidden`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${
                      isDisabled ? 'bg-gray-100 text-gray-400' : 'bg-teal-50 text-teal-600'
                    }`}>
                      {tool.icon}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${getTierBadgeColor(tool.tier)}`}>
                        {tool.tier}
                      </span>
                      {tool.comingSoon && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className={`text-lg font-semibold mb-2 ${isDisabled ? 'text-gray-400' : 'text-gray-900'}`}>
                    {tool.name}
                  </h3>
                  <p className={`text-sm mb-4 ${isDisabled ? 'text-gray-400' : 'text-gray-600'}`}>
                    {tool.description}
                  </p>

                  <button
                    onClick={() => !isDisabled && onNavigate(tool.route)}
                    disabled={isDisabled}
                    className={`w-full py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      isDisabled
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-teal-600 hover:bg-teal-700 text-white'
                    }`}
                  >
                    {!hasAccess && <Lock className="w-4 h-4" />}
                    {tool.comingSoon ? 'Coming Soon' : !hasAccess ? 'Upgrade to Access' : 'Launch Tool'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Upgrade CTA */}
        {userTier === 'free' && (
          <div className="mt-12 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 text-white">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-2">Unlock All Tools</h2>
              <p className="text-teal-100 mb-6">
                Upgrade to Professional or Enterprise to access CEO evaluations, grant reviews, 
                scenario planning, and more advanced features.
              </p>
              <button
                onClick={() => onNavigate('/pricing')}
                className="px-6 py-3 bg-white text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
              >
                View Pricing Plans
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ToolsPage;
