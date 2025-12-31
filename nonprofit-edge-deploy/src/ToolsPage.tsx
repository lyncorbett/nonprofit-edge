import React, { useState } from 'react';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'available' | 'coming_soon' | 'locked';
  category: 'assessment' | 'planning' | 'coaching';
  route: string;
  estimatedTime?: string;
  isPremium?: boolean;
}

interface ToolsPageProps {
  userTier?: 'essential' | 'professional' | 'premium';
  onNavigate?: (route: string) => void;
}

const ToolsPage: React.FC<ToolsPageProps> = ({ 
  userTier = 'professional',
  onNavigate 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tools: Tool[] = [
    {
      id: 'strategic-plan',
      name: 'Strategic Plan Check-Up',
      description: 'Evaluate your strategic plan against the PIVOT framework and receive actionable recommendations to strengthen your strategy.',
      icon: '📊',
      status: 'available',
      category: 'assessment',
      route: '/tools/strategic-plan',
      estimatedTime: '10-15 min',
    },
    {
      id: 'ask-professor',
      name: 'Ask The Professor',
      description: 'Get instant AI-powered advice on any nonprofit challenge. Upload documents for analysis or just ask questions.',
      icon: '🎓',
      status: 'available',
      category: 'coaching',
      route: '/tools/ask-professor',
      estimatedTime: 'Instant',
    },
    {
      id: 'ceo-evaluation',
      name: 'CEO Evaluation',
      description: 'Comprehensive CEO performance evaluation. CEOs complete self-assessment while board members provide feedback.',
      icon: '👤',
      status: 'available',
      category: 'assessment',
      route: '/tools/ceo-evaluation',
      estimatedTime: '15-20 min',
    },
    {
      id: 'board-assessment',
      name: 'Board Assessment',
      description: 'Evaluate your board\'s effectiveness across governance, engagement, and strategic contribution dimensions.',
      icon: '👥',
      status: 'coming_soon',
      category: 'assessment',
      route: '/tools/board-assessment',
      estimatedTime: '15-20 min',
    },
    {
      id: 'grant-review',
      name: 'Grant Proposal Review',
      description: 'Upload your grant proposal and receive detailed feedback on narrative strength, budget alignment, and funder fit.',
      icon: '📝',
      status: 'available',
      category: 'assessment',
      route: '/tools/grant-review',
      estimatedTime: '5-10 min',
    },
    {
      id: 'scenario-planner',
      name: 'Scenario Planner',
      description: 'Explore best-case, worst-case, and most-likely scenarios for your organization\'s strategic decisions.',
      icon: '🔮',
      status: 'available',
      category: 'planning',
      route: '/tools/scenario-planner',
      estimatedTime: '15-20 min',
    },
    {
      id: 'ai-summary',
      name: 'AI Document Summary',
      description: 'Upload any document and get an AI-powered summary with key points, conclusions, and actionable insights.',
      icon: '✨',
      status: 'available',
      category: 'coaching',
      route: '/tools/ai-summary',
      estimatedTime: 'Instant',
    },
    {
      id: 'financial-health',
      name: 'Financial Health Check',
      description: 'Analyze your nonprofit\'s financial sustainability using key ratios and industry benchmarks.',
      icon: '💰',
      status: 'coming_soon',
      category: 'assessment',
      route: '/tools/financial-health',
      estimatedTime: '10 min',
    },
  ];

  const categories = [
    { id: 'all', name: 'All Tools', count: tools.length },
    { id: 'assessment', name: 'Assessments', count: tools.filter(t => t.category === 'assessment').length },
    { id: 'planning', name: 'Planning', count: tools.filter(t => t.category === 'planning').length },
    { id: 'coaching', name: 'Coaching', count: tools.filter(t => t.category === 'coaching').length },
  ];

  const filteredTools = tools.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const canAccessTool = (tool: Tool): boolean => {
    if (tool.status !== 'available') return false;
    if (tool.isPremium && userTier === 'essential') return false;
    return true;
  };

  const handleToolClick = (tool: Tool) => {
    if (!canAccessTool(tool)) return;
    if (onNavigate) {
      onNavigate(tool.route);
    } else {
      window.location.href = tool.route;
    }
  };

  const getStatusBadge = (tool: Tool) => {
    if (tool.status === 'coming_soon') {
      return (
        <span style={{
          padding: '4px 10px',
          background: '#fef3c7',
          color: '#92400e',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: 600,
        }}>
          Coming Soon
        </span>
      );
    }
    if (tool.isPremium && userTier === 'essential') {
      return (
        <span style={{
          padding: '4px 10px',
          background: '#f3e8ff',
          color: '#7c3aed',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: 600,
        }}>
          Premium
        </span>
      );
    }
    if (tool.status === 'available') {
      return (
        <span style={{
          padding: '4px 10px',
          background: '#d1fae5',
          color: '#065f46',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: 600,
        }}>
          Available
        </span>
      );
    }
    return null;
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc',
      fontFamily: 'Source Sans Pro, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: '#0D2C54',
        color: 'white',
        padding: '32px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '2rem',
            fontFamily: 'Merriweather, serif',
            fontWeight: 700
          }}>
            Tools & Assessments
          </h1>
          <p style={{ margin: 0, opacity: 0.8, fontSize: '1.125rem' }}>
            AI-powered tools to strengthen your nonprofit strategy
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
        {/* Search and Filters */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '32px',
          alignItems: 'center'
        }}>
          {/* Search */}
          <div style={{
            flex: '1 1 300px',
            position: 'relative'
          }}>
            <span style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8'
            }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 44px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#0097A9'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Category Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  padding: '8px 16px',
                  background: selectedCategory === category.id ? '#0D2C54' : 'white',
                  color: selectedCategory === category.id ? 'white' : '#475569',
                  border: selectedCategory === category.id ? 'none' : '2px solid #e2e8f0',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {category.name}
                <span style={{
                  background: selectedCategory === category.id ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '0.75rem'
                }}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '24px'
        }}>
          {filteredTools.map((tool) => {
            const accessible = canAccessTool(tool);
            return (
              <div
                key={tool.id}
                onClick={() => handleToolClick(tool)}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  border: '2px solid transparent',
                  cursor: accessible ? 'pointer' : 'default',
                  opacity: tool.status === 'coming_soon' ? 0.7 : 1,
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  if (accessible) {
                    e.currentTarget.style.borderColor = '#0097A9';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                }}
              >
                {/* Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    background: '#f0fdfa',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px'
                  }}>
                    {tool.icon}
                  </div>
                  {getStatusBadge(tool)}
                </div>

                {/* Content */}
                <h3 style={{
                  margin: '0 0 8px 0',
                  fontSize: '1.25rem',
                  fontFamily: 'Merriweather, serif',
                  fontWeight: 700,
                  color: '#0D2C54'
                }}>
                  {tool.name}
                </h3>
                <p style={{
                  margin: '0 0 16px 0',
                  color: '#64748b',
                  fontSize: '0.9375rem',
                  lineHeight: 1.6
                }}>
                  {tool.description}
                </p>

                {/* Footer */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '16px',
                  borderTop: '1px solid #f1f5f9'
                }}>
                  {tool.estimatedTime && (
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#94a3b8',
                      fontSize: '0.875rem'
                    }}>
                      ⏱️ {tool.estimatedTime}
                    </span>
                  )}
                  {accessible && (
                    <span style={{
                      color: '#0097A9',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      Start →
                    </span>
                  )}
                  {!accessible && tool.isPremium && (
                    <span style={{
                      color: '#7c3aed',
                      fontWeight: 600,
                      fontSize: '0.875rem'
                    }}>
                      Upgrade to access
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#64748b'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>No tools found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Help Section */}
        <div style={{
          marginTop: '48px',
          padding: '32px',
          background: 'linear-gradient(135deg, #0D2C54 0%, #1a4175 100%)',
          borderRadius: '16px',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: '1 1 300px' }}>
            <h3 style={{
              margin: '0 0 8px 0',
              fontFamily: 'Merriweather, serif',
              fontSize: '1.375rem'
            }}>
              Not sure where to start?
            </h3>
            <p style={{ margin: 0, opacity: 0.9 }}>
              Ask The Professor can help you identify which tools will have the biggest impact on your organization right now.
            </p>
          </div>
          <button
            onClick={() => handleToolClick(tools.find(t => t.id === 'ask-professor')!)}
            style={{
              padding: '12px 24px',
              background: '#0097A9',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#00b4c9'}
            onMouseOut={(e) => e.currentTarget.style.background = '#0097A9'}
          >
            Talk to The Professor →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
