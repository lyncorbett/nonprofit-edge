import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  X, Users, User, Target, FileText, BarChart, MessageCircle,
  Clock, File, Settings, Upload, ChevronRight, CheckCircle,
  AlertCircle
} from 'lucide-react';

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
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(13, 44, 84, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'white',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '580px',
          maxHeight: '90vh',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          animation: 'modalIn 0.3s ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px',
          borderBottom: '1px solid #f1f5f9'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: tool.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: 'white',
            fontSize: tool.isEmoji ? '28px' : undefined
          }}>
            {tool.isEmoji ? tool.emoji : <Icon size={28} />}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0D2C54', marginBottom: '4px' }}>
              {tool.title}
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b' }}>{tool.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: 'none',
              background: '#f1f5f9',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px', overflowY: 'auto', maxHeight: 'calc(90vh - 200px)' }}>
          <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#475569', marginBottom: '24px' }}>
            {tool.description}
          </p>

          {/* Assess Areas (for Strategic Plan) */}
          {tool.assessAreas && (
            <>
              <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8', marginBottom: '12px' }}>
                What You'll Assess
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '24px' }}>
                {tool.assessAreas.map((area, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#334155'
                  }}>
                    <CheckCircle size={16} color="#0097A9" />
                    {area}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Topics (for Ask Professor) */}
          {tool.topics && (
            <>
              <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8', marginBottom: '12px' }}>
                What You Can Ask About
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '24px' }}>
                {tool.topics.map((topic, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#334155'
                  }}>
                    <CheckCircle size={16} color="#0097A9" />
                    {topic}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Process Steps (for Grant Review) */}
          {tool.processSteps && (
            <>
              <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8', marginBottom: '12px' }}>
                How It Works
              </div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                {tool.processSteps.map((step) => (
                  <div key={step.step} style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '16px 12px',
                    background: '#f8fafc',
                    borderRadius: '12px'
                  }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#0097A9',
                      color: 'white',
                      fontSize: '13px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px'
                    }}>
                      {step.step}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0D2C54', marginBottom: '4px' }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{step.desc}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* PIVOT Framework */}
          {tool.isPivotFramework && (
            <>
              <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8', marginBottom: '12px' }}>
                The PIVOT Framework
              </div>
              <ul style={{ listStyle: 'none', marginBottom: '24px' }}>
                {(tool.benefits as any[]).map((item, i) => (
                  <li key={i} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '10px 0',
                    borderBottom: i < (tool.benefits as any[]).length - 1 ? '1px solid #f1f5f9' : 'none'
                  }}>
                    <span style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: tool.color,
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '11px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {item.letter}
                    </span>
                    <div>
                      <strong style={{ color: '#0D2C54' }}>{item.title}</strong>
                      <span style={{ color: '#475569' }}> — {item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Standard Benefits */}
          {!tool.isPivotFramework && tool.benefits && typeof tool.benefits[0] === 'string' && (
            <>
              <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8', marginBottom: '12px' }}>
                What You'll Get
              </div>
              <ul style={{ listStyle: 'none', marginBottom: '24px' }}>
                {(tool.benefits as string[]).map((benefit, i) => (
                  <li key={i} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '10px 0',
                    fontSize: '14px',
                    color: '#334155',
                    borderBottom: i < (tool.benefits as string[]).length - 1 ? '1px solid #f1f5f9' : 'none'
                  }}>
                    <span style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: '#f0fdfa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: '#0097A9'
                    }}>
                      <CheckCircle size={14} />
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Meta Row */}
          <div style={{
            display: 'flex',
            gap: '24px',
            padding: '16px 20px',
            background: '#f8fafc',
            borderRadius: '12px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#475569' }}>
              <Clock size={18} color="#0097A9" />
              {tool.time}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#475569' }}>
              <File size={18} color="#0097A9" />
              {tool.output}
            </div>
            {tool.audience && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#475569' }}>
                <Users size={18} color="#0097A9" />
                {tool.audience}
              </div>
            )}
          </div>

          {/* Admin Setup Box */}
          {tool.requiresSetup && (
            <div style={{
              background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
              border: '1px solid #F59E0B',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#92400E',
                marginBottom: '8px'
              }}>
                <Settings size={18} />
                Admin Setup Required
              </div>
              <p style={{ fontSize: '13px', color: '#92400E', lineHeight: 1.6, marginBottom: '16px' }}>
                Before participants can take this assessment, an administrator needs to:
              </p>
              <ul style={{ listStyle: 'none', marginBottom: '16px' }}>
                {tool.setupSteps?.map((step, i) => (
                  <li key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    color: '#92400E',
                    padding: '4px 0'
                  }}>
                    <AlertCircle size={16} />
                    {step}
                  </li>
                ))}
              </ul>
              <button
                onClick={onSetup}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: '#92400E',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Settings size={16} />
                Setup as Admin
              </button>
            </div>
          )}

          {/* Don't Show Again */}
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            color: '#64748b',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              style={{ width: '18px', height: '18px' }}
            />
            Don't show this again
          </label>
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 28px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '14px 24px',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              background: 'white',
              color: '#64748b',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            style={{
              padding: '14px 28px',
              border: 'none',
              borderRadius: '10px',
              background: `linear-gradient(135deg, ${tool.color} 0%, ${tool.color}dd 100%)`,
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {tool.id === 'grant-review' ? 'Upload Proposal' : 
             tool.id === 'ask-professor' ? 'Start Conversation' :
             tool.id === 'scenario-planner' ? 'Start Planning' :
             tool.requiresSetup ? 'Take Assessment' : 'Start Check-Up'}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ToolIntroModal;
export { TOOL_CONFIGS };
