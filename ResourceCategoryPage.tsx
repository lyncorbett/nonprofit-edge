import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Bookmark, Target, Presentation, FileText,
  Search, Clock, ArrowLeft, Download, Star, Filter,
  ChevronRight, Home
} from 'lucide-react';

// Category configurations
const CATEGORY_CONFIG: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  color: string;
  filters: string[];
}> = {
  'guides': {
    title: 'Leadership Guides',
    subtitle: 'In-depth guides on nonprofit leadership',
    description: 'In-depth guides on nonprofit leadership, from board governance to strategic decision-making. Each guide includes actionable frameworks, real-world examples, and implementation checklists.',
    icon: BookOpen,
    color: '#0097A9',
    filters: ['All', 'Board Governance', 'Strategic Planning', 'Leadership', 'Financial']
  },
  'book-summaries': {
    title: 'Book Summaries',
    subtitle: 'Key insights from essential books',
    description: 'Key insights from essential leadership and nonprofit books, distilled into actionable 10-minute summaries. Save hours of reading while getting the core ideas you can apply immediately.',
    icon: Bookmark,
    color: '#f59e0b',
    filters: ['All Books', 'Leadership', 'Strategy', 'Governance', 'Fundraising', 'Team']
  },
  'playbooks': {
    title: 'Playbooks',
    subtitle: 'Step-by-step guides for common challenges',
    description: 'Step-by-step playbooks for common nonprofit challenges. Each playbook includes a clear process, templates, timelines, and real-world examples to guide you from start to finish.',
    icon: Target,
    color: '#6366f1',
    filters: ['All Playbooks', 'Strategic Planning', 'Board', 'Fundraising', 'Leadership', 'Operations']
  },
  'facilitation-kits': {
    title: 'Facilitation Kits',
    subtitle: 'Complete kits for meetings and retreats',
    description: 'Complete kits for running board retreats, strategic planning sessions, and team workshops. Each kit includes facilitator guides, participant materials, slides, and timing guides.',
    icon: Presentation,
    color: '#ec4899',
    filters: ['All Kits', 'Board Retreats', 'Strategic Planning', 'Team Workshops', 'Leadership']
  }
};

// Sample content for each category
const SAMPLE_CONTENT: Record<string, any[]> = {
  'guides': [
    { id: 1, title: 'The Complete Guide to Board Governance', description: 'Everything you need to know about building and maintaining an effective nonprofit board, from recruitment to evaluation.', time: '45 min read', badge: 'Essential', category: 'Board Governance', color: '#0D2C54' },
    { id: 2, title: 'Strategic Planning That Actually Works', description: 'A practical guide to creating strategic plans that don\'t collect dust. Includes the PIVOT framework for adaptive planning.', time: '60 min read', badge: 'Popular', category: 'Strategic Planning', color: '#0097A9' },
    { id: 3, title: 'CEO-Board Partnership Excellence', description: 'How to build a productive, trusting relationship between the CEO and board that drives organizational success.', time: '35 min read', badge: 'New', category: 'Leadership', color: '#D4A84B' },
    { id: 4, title: 'Leading Through Uncertainty', description: 'Practical strategies for nonprofit leaders navigating change, crisis, and ambiguity with confidence.', time: '40 min read', badge: null, category: 'Leadership', color: '#6366f1' },
    { id: 5, title: 'Financial Oversight for Board Members', description: 'What every board member needs to know about nonprofit finances, even if you\'re not a finance expert.', time: '30 min read', badge: null, category: 'Financial', color: '#0D2C54' },
    { id: 6, title: 'CEO Succession Planning', description: 'A comprehensive guide to planning for leadership transitions, whether expected or unexpected.', time: '50 min read', badge: null, category: 'Leadership', color: '#0097A9' },
  ],
  'book-summaries': [
    { id: 1, title: 'Governance as Leadership', author: 'Chait, Ryan & Taylor', description: 'Reframes governance from oversight to leadership, introducing three modes of governing that transform board effectiveness.', time: '10 min', badge: 'Must Read', category: 'Governance', color: '#0D2C54' },
    { id: 2, title: 'Good to Great and the Social Sectors', author: 'Jim Collins', description: 'Adapts the Good to Great framework specifically for nonprofits, redefining what "great" means without profit metrics.', time: '8 min', badge: 'Classic', category: 'Strategy', color: '#059669' },
    { id: 3, title: 'The Five Dysfunctions of a Team', author: 'Patrick Lencioni', description: 'A leadership fable revealing the five behaviors that undermine teams and how to build a cohesive, high-performing group.', time: '12 min', badge: null, category: 'Team', color: '#7c3aed' },
    { id: 4, title: 'The Advantage', author: 'Patrick Lencioni', description: 'Why organizational health trumps everything else in business, and the four disciplines required to achieve it.', time: '15 min', badge: 'New', category: 'Leadership', color: '#dc2626' },
    { id: 5, title: 'Forces for Good', author: 'Crutchfield & Grant', description: 'Six practices of high-impact nonprofits that create lasting change, based on research of the most effective organizations.', time: '10 min', badge: null, category: 'Strategy', color: '#0097A9' },
    { id: 6, title: 'Engine of Impact', author: 'McConnell & Roche', description: 'Essentials of strategic leadership in the nonprofit sector, with frameworks for mission-driven excellence.', time: '11 min', badge: null, category: 'Leadership', color: '#ea580c' },
  ],
  'playbooks': [
    { id: 1, title: '90-Day Strategic Reset', description: 'A structured approach to evaluating and refreshing your strategic plan when circumstances have changed or progress has stalled.', duration: '90 days', templates: 12, badge: 'Popular', color: '#6366f1', steps: ['Assessment & diagnosis', 'Stakeholder input & alignment', 'Strategy refresh & priorities', 'Implementation planning'] },
    { id: 2, title: 'Board Recruitment Excellence', description: 'A comprehensive approach to identifying, recruiting, and onboarding board members who will actively contribute to your mission.', duration: '8-12 weeks', templates: 8, badge: null, color: '#0097A9', steps: ['Board matrix & gap analysis', 'Prospect identification & cultivation', 'Interview & selection process', 'Onboarding & engagement'] },
    { id: 3, title: 'CEO Succession Planning', description: 'A proactive approach to preparing for leadership transitions, whether planned retirement or unexpected departure.', duration: '6 months', templates: 10, badge: 'New', color: '#0D2C54', steps: ['Emergency succession plan', 'Leadership competency framework', 'Internal talent development', 'Transition timeline & process'] },
    { id: 4, title: 'Major Gift Campaign', description: 'A systematic approach to identifying, cultivating, and soliciting major donors for significant contributions.', duration: '12-18 months', templates: 15, badge: null, color: '#D4A84B', steps: ['Prospect research & qualification', 'Cultivation strategy & moves', 'Ask preparation & delivery', 'Stewardship & recognition'] },
    { id: 5, title: 'Annual Planning Cycle', description: 'A complete guide to running an effective annual planning process that aligns budget, goals, and team capacity.', duration: 'Q4 annually', templates: 9, badge: null, color: '#059669', steps: ['Year-end review & lessons learned', 'Environmental scan & priorities', 'Budget development & alignment', 'Board approval & launch'] },
  ],
  'facilitation-kits': [
    { id: 1, title: 'Annual Board Retreat', description: 'A complete facilitation kit for running an engaging, productive annual board retreat that builds relationships and aligns on priorities.', duration: '4 hours', files: 8, badge: 'Popular', color: '#ec4899', includes: ['Facilitator Guide', 'PowerPoint Slides', 'Participant Workbook', 'Timing Guide', 'Icebreaker Activities', 'Evaluation Form'] },
    { id: 2, title: 'Strategic Planning Session', description: 'A comprehensive facilitation kit for leading a full strategic planning session with your board and leadership team.', duration: '6-8 hours', files: 12, badge: null, color: '#0097A9', includes: ['Facilitator Guide', 'SWOT Templates', 'Vision Exercise', 'Priority Matrix', 'Action Planning', 'Pre-Work Survey'] },
    { id: 3, title: 'New Board Orientation', description: 'Everything you need to run an effective orientation session that engages new board members and prepares them to contribute.', duration: '2 hours', files: 7, badge: null, color: '#0D2C54', includes: ['Facilitator Guide', 'Welcome Presentation', 'Board Handbook', 'Role Expectations', 'Q&A Guide', 'Commitment Form'] },
    { id: 4, title: 'Team Problem-Solving', description: 'A facilitation kit for leading productive problem-solving sessions that generate solutions and build team ownership.', duration: '3 hours', files: 6, badge: null, color: '#7c3aed', includes: ['Facilitator Guide', 'Problem Framework', 'Brainstorm Templates', 'Decision Matrix', 'Action Items', 'Follow-up Template'] },
  ]
};

interface ResourceCategoryPageProps {
  category: string;
  onNavigate: (path: string) => void;
}

const ResourceCategoryPage: React.FC<ResourceCategoryPageProps> = ({ category, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(0);
  const [savedItems, setSavedItems] = useState<number[]>([]);

  const config = CATEGORY_CONFIG[category];
  const content = SAMPLE_CONTENT[category] || [];

  if (!config) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <h1>Category not found</h1>
        <button onClick={() => onNavigate('member-resources')}>Back to Resources</button>
      </div>
    );
  }

  const IconComponent = config.icon;

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 0 || 
                          item.category?.toLowerCase().includes(config.filters[activeFilter].toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const toggleSave = (id: number) => {
    setSavedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif"
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '24px 40px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Breadcrumb */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: '20px',
            fontSize: '14px',
            color: '#64748b'
          }}>
            <span 
              onClick={() => onNavigate('dashboard')}
              style={{ color: '#0097A9', cursor: 'pointer' }}
            >
              Dashboard
            </span>
            <span>→</span>
            <span 
              onClick={() => onNavigate('member-resources')}
              style={{ color: '#0097A9', cursor: 'pointer' }}
            >
              Member Resources
            </span>
            <span>→</span>
            <span>{config.title}</span>
          </div>

          {/* Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: config.color,
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <IconComponent size={28} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0D2C54', margin: 0 }}>
                {config.title}
              </h1>
              <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
                {config.subtitle}
              </p>
            </div>
          </div>
          <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.6, maxWidth: '800px' }}>
            {config.description}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 40px' }}>
        {/* Stats Bar */}
        <div style={{
          display: 'flex',
          gap: '24px',
          marginBottom: '24px',
          padding: '16px 24px',
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#0D2C54' }}>{content.length}</span>
            <span style={{ fontSize: '14px', color: '#64748b' }}>Total</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>
              {content.filter(c => c.badge === 'New').length}
            </span>
            <span style={{ fontSize: '14px', color: '#64748b' }}>New This Month</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#f59e0b' }}>{savedItems.length}</span>
            <span style={{ fontSize: '14px', color: '#64748b' }}>Saved</span>
          </div>
        </div>

        {/* Search & Filters */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
            <Search size={18} style={{ 
              position: 'absolute', 
              left: '14px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#94a3b8'
            }} />
            <input
              type="text"
              placeholder={`Search ${config.title.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 44px',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '15px',
                outline: 'none'
              }}
            />
          </div>
          {config.filters.map((filter, index) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(index)}
              style={{
                padding: '14px 20px',
                background: activeFilter === index ? config.color : 'white',
                color: activeFilter === index ? 'white' : '#475569',
                border: activeFilter === index ? 'none' : '1px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: category === 'playbooks' || category === 'facilitation-kits' 
            ? 'repeat(auto-fill, minmax(380px, 1fr))' 
            : 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '20px'
        }}>
          {filteredContent.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'white',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Card Header/Image */}
              <div style={{
                height: category === 'playbooks' || category === 'facilitation-kits' ? '140px' : '160px',
                background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`,
                padding: '20px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end'
              }}>
                {item.badge && (
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(4px)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'white',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {item.badge}
                  </span>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSave(item.id); }}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: savedItems.includes(item.id) ? '#f59e0b' : 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px',
                    cursor: 'pointer',
                    color: 'white'
                  }}
                >
                  <Star size={16} fill={savedItems.includes(item.id) ? 'white' : 'none'} />
                </button>
                
                {/* Book summaries show author */}
                {category === 'book-summaries' && (
                  <div style={{ color: 'white' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px', lineHeight: 1.3 }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '13px', opacity: 0.9 }}>{item.author}</p>
                  </div>
                )}

                {/* Playbooks show duration */}
                {category === 'playbooks' && (
                  <div style={{ color: 'white' }}>
                    <span style={{ fontSize: '32px', marginBottom: '8px', display: 'block' }}>🎯</span>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{item.title}</h3>
                  </div>
                )}

                {/* Facilitation kits show emoji */}
                {category === 'facilitation-kits' && (
                  <div style={{ color: 'white' }}>
                    <span style={{ fontSize: '32px', marginBottom: '8px', display: 'block' }}>📋</span>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{item.title}</h3>
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div style={{ padding: '20px' }}>
                {/* Guides show title here */}
                {category === 'guides' && (
                  <h3 style={{ 
                    fontSize: '17px', 
                    fontWeight: 600, 
                    color: '#0D2C54', 
                    marginBottom: '8px',
                    lineHeight: 1.4
                  }}>
                    {item.title}
                  </h3>
                )}

                <p style={{ 
                  fontSize: '14px', 
                  color: '#64748b', 
                  lineHeight: 1.6, 
                  marginBottom: '16px' 
                }}>
                  {item.description}
                </p>

                {/* Playbooks show steps */}
                {category === 'playbooks' && item.steps && (
                  <div style={{ marginBottom: '16px' }}>
                    {item.steps.slice(0, 3).map((step: string, idx: number) => (
                      <div key={idx} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px',
                        marginBottom: '8px'
                      }}>
                        <span style={{
                          width: '20px',
                          height: '20px',
                          background: item.color,
                          color: 'white',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 700
                        }}>
                          {idx + 1}
                        </span>
                        <span style={{ fontSize: '13px', color: '#475569' }}>{step}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Facilitation kits show includes */}
                {category === 'facilitation-kits' && item.includes && (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '6px',
                    marginBottom: '16px'
                  }}>
                    {item.includes.slice(0, 4).map((inc: string, idx: number) => (
                      <div key={idx} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        fontSize: '12px',
                        color: '#475569'
                      }}>
                        <span style={{ color: '#10b981' }}>✓</span>
                        {inc}
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  paddingTop: '12px',
                  borderTop: '1px solid #f1f5f9'
                }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {item.time && (
                      <span style={{ 
                        fontSize: '13px', 
                        color: '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Clock size={14} />
                        {item.time}
                      </span>
                    )}
                    {item.duration && (
                      <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                        📅 {item.duration}
                      </span>
                    )}
                    {item.templates && (
                      <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                        📄 {item.templates} templates
                      </span>
                    )}
                    {item.files && (
                      <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                        📁 {item.files} files
                      </span>
                    )}
                  </div>
                  <span style={{ 
                    fontSize: '13px', 
                    color: config.color, 
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {category === 'facilitation-kits' ? 'Download' : 'Read'}
                    <ChevronRight size={16} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredContent.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            color: '#94a3b8'
          }}>
            <Search size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p>No {config.title.toLowerCase()} found matching your search.</p>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => onNavigate('member-resources')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#64748b',
            cursor: 'pointer',
            marginTop: '32px'
          }}
        >
          <ArrowLeft size={16} />
          Back to Resources
        </button>
      </div>
    </div>
  );
};

export default ResourceCategoryPage;
