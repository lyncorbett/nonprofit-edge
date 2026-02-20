import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  X, Users, User, Target, FileText, BarChart, MessageCircle,
  Clock, File, Settings, Upload, ChevronRight, CheckCircle,
  AlertCircle
} from 'lucide-react';

// Check if mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

// Tool configurations
const TOOL_CONFIGS = {
  'board-assessment': {
    id: 'board-assessment',
    title: 'Board Assessment',
    subtitle: "Powered by BoardSource's 12 Principles",
    icon: Users,
    color: '#0097A9',
    description: "Evaluate your board's effectiveness across 12 key governance areas. Each board member completes the assessment individually, and results are compiled into a comprehensive report with actionable recommendations.",
    benefits: [
      'Scores across 12 governance dimensions with benchmarks',
      'Gap analysis showing strengths and areas for improvement',
      'Prioritized recommendations tailored to your results',
      'PDF report ready for board discussion'
    ],
    time: '15-20 min per person',
    output: 'Detailed PDF Report',
    audience: 'Full Board',
    requiresSetup: true,
    setupSteps: [
      'Add board member names and email addresses',
      'Set the assessment deadline',
      'Choose anonymous or identified responses'
    ],
    route: '/board-assessment/use',
    setupRoute: '/board-assessment/setup'
  },
  'ceo-evaluation': {
    id: 'ceo-evaluation',
    title: 'CEO Evaluation',
    subtitle: '360° Leadership Assessment',
    icon: User,
    color: '#0D2C54',
    description: "A comprehensive evaluation tool for assessing executive leadership. Gather confidential feedback from board members, direct reports, and key stakeholders to create a complete picture of CEO performance.",
    benefits: [
      'Multi-rater feedback from board, staff, and stakeholders',
      'Leadership competency scores with detailed analysis',
      'Anonymous comments and qualitative feedback',
      'Development recommendations and action plan'
    ],
    time: '20-30 min per evaluator',
    output: 'Executive Summary Report',
    audience: 'Confidential',
    requiresSetup: true,
    setupSteps: [
      'Select evaluator groups (board, staff, external)',
      'Add evaluator names and email addresses',
      'Set evaluation period and deadline'
    ],
    route: '/ceo-evaluation/use',
    setupRoute: '/ceo-evaluation/setup'
  },
  'strategic-plan': {
    id: 'strategic-plan',
    title: 'Strategic Plan Check-Up',
    subtitle: "Assess Your Plan's Health",
    icon: Target,
    color: '#059669',
    description: "Is your strategic plan still serving your organization? This diagnostic tool evaluates your plan's relevance, clarity, and implementation progress, then provides specific recommendations for getting back on track.",
    benefits: [
      'Overall health score for your strategic plan',
      'Specific recommendations to strengthen weak areas',
      '90-day action plan to get back on track'
    ],
    assessAreas: ['Mission Alignment', 'Goal Clarity', 'Progress Tracking', 'Resource Allocation', 'Team Engagement', 'Market Relevance'],
    time: '10-15 minutes',
    output: 'Health Report + Action Plan',
    requiresSetup: false,
    route: '/strategic-plan-checkup/use'
  },
  'grant-review': {
    id: 'grant-review',
    title: 'Grant/RFP Review',
    subtitle: 'AI-Powered Proposal Analysis',
    icon: FileText,
    color: '#B45309',
    description: "Get expert feedback on your grant proposal or RFP response before you submit. Our AI analyzes your document against funder priorities, identifies weaknesses, and suggests specific improvements to strengthen your ask.",
    benefits: [
      'Strength score with section-by-section breakdown',
      'Specific language suggestions to improve clarity',
      'Gap analysis against common funder expectations'
    ],
    processSteps: [
      { step: 1, title: 'Upload', desc: 'Your draft proposal' },
      { step: 2, title: 'Analyze', desc: 'AI reviews for gaps' },
      { step: 3, title: 'Improve', desc: 'Get specific edits' }
    ],
    time: '5-10 minutes',
    output: 'Upload PDF or Word',
    requiresSetup: false,
    route: '/grant-review/use'
  },
  'scenario-planner': {
    id: 'scenario-planner',
    title: 'PIVOT Scenario Planner',
    subtitle: 'Strategic Decision Framework',
    icon: BarChart,
    color: '#4338CA',
    description: "Navigate uncertainty with confidence. The PIVOT framework helps you map out multiple future scenarios, stress-test your assumptions, and develop contingency plans for whatever comes next.",
    benefits: [
      { letter: 'P', title: 'Problem', desc: 'Define the challenge or decision you\'re facing' },
      { letter: 'I', title: 'Impact', desc: 'Assess potential impacts of different paths' },
      { letter: 'V', title: 'Variables', desc: 'Identify the key uncertainties at play' },
      { letter: 'O', title: 'Options', desc: 'Map out your strategic options' },
      { letter: 'T', title: 'Triggers', desc: 'Define decision triggers and contingencies' }
    ],
    isPivotFramework: true,
    time: '30-45 minutes',
    output: 'Scenario Map + Action Plan',
    requiresSetup: false,
    route: '/scenario-planner/use'
  },
  'ask-professor': {
    id: 'ask-professor',
    title: 'Ask the Professor',
    subtitle: 'Your 24/7 Leadership Advisor',
    icon: MessageCircle,
    color: '#0D2C54',
    isEmoji: true,
    emoji: '🎓',
    description: "Get personalized guidance from Dr. Lyn Corbett — a nonprofit leadership expert with 15+ years of experience helping organizations thrive. Ask anything about strategy, board governance, fundraising, or leadership challenges.",
    topics: ['Board Governance', 'Strategic Planning', 'Fundraising Strategy', 'Staff Leadership', 'Change Management', 'Work-Life Balance'],
    benefits: [
      'Ask questions in plain language — like texting a mentor',
      'Get actionable advice grounded in real-world experience',
      'Conversations are saved — pick up where you left off'
    ],
    time: 'Available 24/7',
    output: 'Conversations Saved',
    requiresSetup: false,
    route: '/ask-professor'
  }
};

interface ToolIntroModalProps {
  toolId: keyof typeof TOOL_CONFIGS;
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
  onSetup?: () => void;
}

const ToolIntroModal: React.FC<ToolIntroModalProps> = ({ 
  toolId, 
  isOpen, 
  onClose, 
  onStart,
  onSetup 
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const tool = TOOL_CONFIGS[toolId];
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if user has dismissed this modal before
    const checkPreference = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('user_preferences')
          .select('dont_show_tool_intros')
          .eq('user_id', user.id)
          .single();
        
        if (data?.dont_show_tool_intros?.[toolId]) {
          onStart(); // Skip modal, go straight to tool
        }
      }
    };
    
    if (isOpen) {
      checkPreference();
    }
  }, [isOpen, toolId]);

  const handleStart = async () => {
    if (dontShowAgain) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Upsert preference
        await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            dont_show_tool_intros: { [toolId]: true }
          }, {
            onConflict: 'user_id'
          });
      }
    }
    onStart();
  };

  if (!isOpen || !tool) return null;

  const Icon = tool.icon;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(13, 44, 84, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: isMobile ? 'flex-end' : 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: isMobile ? '0' : '20px',
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif"
    }}>
      <div style={{
        background: 'white',
        borderRadius: isMobile ? '20px 20px 0 0' : '20px',
        width: '100%',
        maxWidth: isMobile ? '100%' : '680px',
        maxHeight: isMobile ? '90vh' : '90vh',
        overflow: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        animation: isMobile ? 'modalSlideUp 0.3s ease-out' : 'modalSlideIn 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{
          padding: isMobile ? '20px 20px 16px' : '28px 32px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'flex-start',
          gap: isMobile ? '14px' : '20px'
        }}>
          <div style={{
            width: isMobile ? '48px' : '64px',
            height: isMobile ? '48px' : '64px',
            borderRadius: isMobile ? '12px' : '16px',
            background: `${tool.color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {tool.isEmoji ? (
              <span style={{ fontSize: isMobile ? '24px' : '32px' }}>{tool.emoji}</span>
            ) : (
              <Icon size={isMobile ? 24 : 32} style={{ color: tool.color }} />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ 
              fontSize: isMobile ? '20px' : '26px', 
              fontWeight: 700, 
              color: '#0D2C54', 
              margin: 0,
              lineHeight: 1.2
            }}>
              {tool.title}
            </h2>
            <p style={{ 
              fontSize: isMobile ? '13px' : '15px', 
              color: '#64748b', 
              margin: '4px 0 0 0' 
            }}>
              {tool.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '10px',
              padding: isMobile ? '8px' : '10px',
              cursor: 'pointer',
              color: '#64748b',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e2e8f0';
              e.currentTarget.style.color = '#334155';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f1f5f9';
              e.currentTarget.style.color = '#64748b';
            }}
          >
            <X size={isMobile ? 20 : 22} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: isMobile ? '20px' : '28px 32px' }}>
          {/* Description */}
          <p style={{ 
            fontSize: isMobile ? '14px' : '16px', 
            lineHeight: 1.7, 
            color: '#475569',
            margin: '0 0 24px 0'
          }}>
            {tool.description}
          </p>

          {/* Benefits */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ 
              fontSize: '13px', 
              fontWeight: 700, 
              color: '#94a3b8', 
              textTransform: 'uppercase',
              letterSpacing: '1px',
              margin: '0 0 16px 0'
            }}>
              What You'll Get
            </h3>
            
            {tool.isPivotFramework ? (
              // PIVOT Framework display
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(tool.benefits as any[]).map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px'
                  }}>
                    <span style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: tool.color,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '16px',
                      flexShrink: 0
                    }}>
                      {item.letter}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, color: '#0D2C54', fontSize: '15px' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '14px', color: '#64748b', marginTop: '2px' }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Standard benefits list
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {(tool.benefits as string[]).map((benefit, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px'
                  }}>
                    <CheckCircle size={22} style={{ color: tool.color, flexShrink: 0, marginTop: '1px' }} />
                    <span style={{ fontSize: '15px', color: '#334155', lineHeight: 1.5 }}>
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Topics for Ask the Professor */}
          {tool.topics && (
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ 
                fontSize: '13px', 
                fontWeight: 700, 
                color: '#94a3b8', 
                textTransform: 'uppercase',
                letterSpacing: '1px',
                margin: '0 0 14px 0'
              }}>
                Popular Topics
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {tool.topics.map((topic, index) => (
                  <span key={index} style={{
                    padding: '8px 16px',
                    background: '#f1f5f9',
                    borderRadius: '20px',
                    fontSize: '14px',
                    color: '#475569',
                    fontWeight: 500
                  }}>
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Setup Steps for Board Assessment / CEO Evaluation */}
          {tool.requiresSetup && tool.setupSteps && (
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fcd34d',
              borderRadius: '14px',
              padding: '20px',
              marginBottom: '28px'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                marginBottom: '14px'
              }}>
                <Settings size={20} style={{ color: '#b45309' }} />
                <span style={{ fontWeight: 700, color: '#92400e', fontSize: '15px' }}>
                  Admin Setup Required
                </span>
              </div>
              <p style={{ fontSize: '14px', color: '#78350f', margin: '0 0 14px 0', lineHeight: 1.6 }}>
                Before your team can take this assessment, you'll need to:
              </p>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {tool.setupSteps.map((step, index) => (
                  <li key={index} style={{ 
                    fontSize: '14px', 
                    color: '#78350f',
                    marginBottom: '8px',
                    lineHeight: 1.5
                  }}>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Meta Info */}
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            padding: '20px',
            background: '#f8fafc',
            borderRadius: '14px',
            marginBottom: '8px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 18px',
              background: 'white',
              borderRadius: '10px',
              border: '1px solid #e2e8f0'
            }}>
              <Clock size={18} style={{ color: '#64748b' }} />
              <span style={{ fontSize: '14px', color: '#334155', fontWeight: 500 }}>
                {tool.time}
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 18px',
              background: 'white',
              borderRadius: '10px',
              border: '1px solid #e2e8f0'
            }}>
              <File size={18} style={{ color: '#64748b' }} />
              <span style={{ fontSize: '14px', color: '#334155', fontWeight: 500 }}>
                {tool.output}
              </span>
            </div>
            {tool.audience && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 18px',
                background: 'white',
                borderRadius: '10px',
                border: '1px solid #e2e8f0'
              }}>
                <Users size={18} style={{ color: '#64748b' }} />
                <span style={{ fontSize: '14px', color: '#334155', fontWeight: 500 }}>
                  {tool.audience}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: isMobile ? '16px 20px 24px' : '20px 32px 28px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'stretch' : 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div />

          <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: '12px',
            width: isMobile ? '100%' : 'auto'
          }}>
            {!isMobile && (
              <button
                onClick={onClose}
                style={{
                  padding: '14px 28px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e2e8f0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                }}
              >
                Cancel
              </button>
            )}
            
            {tool.requiresSetup && onSetup ? (
              <div style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                gap: '12px',
                width: isMobile ? '100%' : 'auto'
              }}>
                <button
                  onClick={handleStart}
                  style={{
                    padding: isMobile ? '16px 24px' : '14px 28px',
                    background: tool.color,
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                    boxShadow: `0 4px 14px ${tool.color}40`,
                    width: isMobile ? '100%' : 'auto'
                  }}
                >
                  Take Assessment
                  <ChevronRight size={18} />
                </button>
                <button
                  onClick={onSetup}
                  style={{
                    padding: isMobile ? '16px 24px' : '14px 28px',
                    background: '#fef3c7',
                    border: '2px solid #f59e0b',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#92400e',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                    width: isMobile ? '100%' : 'auto'
                  }}
                >
                  <Settings size={18} />
                  Setup as Admin
                </button>
              </div>
            ) : (
              <button
                onClick={handleStart}
                style={{
                  padding: isMobile ? '16px 32px' : '14px 32px',
                  background: tool.color,
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  boxShadow: `0 4px 14px ${tool.color}40`,
                  width: isMobile ? '100%' : 'auto'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = `0 6px 20px ${tool.color}50`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 4px 14px ${tool.color}40`;
                }}
              >
                {toolId === 'ask-professor' ? 'Start Chatting' : 'Get Started'}
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ToolIntroModal;
