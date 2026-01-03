/**
 * THE NONPROFIT EDGE - Strategic Plan Check-Up
 * McKinsey-Level Assessment Tool v2.0
 * 
 * REVISED per user feedback:
 * - Email validation added
 * - ONE Thing philosophy moved to REPORT ONLY (not intro page)
 * - Document uploads: checkbox for "not available" instead of warnings
 * - 6 Dimensions grounded in "Hope is Not a Strategy" (Chapter 9)
 */

import React, { useState } from 'react';

const NAVY = '#0D2C54';
const TEAL = '#0097A9';
const GOLD = '#D4A853';

interface StrategicPlanCheckUpProps {
  user?: {
    id: string;
    email: string;
    full_name?: string;
    organization?: { name: string; };
  };
  onComplete?: () => void;
  onCancel?: () => void;
}

interface OrgData {
  ein: string;
  name: string;
  city: string;
  state: string;
  nteeCode: string;
  subsection: string;
  totalRevenue: number;
  totalExpenses: number;
  totalAssets: number;
  fiscalYear: number;
  found: boolean;
}

interface FormData {
  organizationName: string;
  ein: string;
  website: string;
  city: string;
  state: string;
  annualBudget: string;
  staffSize: string;
  sector: string;
  yearsInOperation: string;
  lifecycleStage: string;
  role: string;
  roleOther: string;
  yourName: string;
  yourEmail: string;
  d1_q1: string; d1_q2: string; d1_q3: string;
  d2_q1: string; d2_q2: string; d2_q3: string;
  d3_q1: string; d3_q2: string; d3_q3: string;
  d4_q1: string; d4_q2: string; d4_q3: string;
  d5_q1: string; d5_q2: string; d5_q3: string;
  d6_q1: string; d6_q2: string; d6_q3: string;
  risk_funding: string;
  risk_leadership: string;
  risk_governance: string;
  risk_capacity: string;
  risk_external: string;
  risk_reputation: string;
  biggestChallenge: string;
  whatSuccess: string;
  additionalInfo: string;
}

interface DocumentAvailability {
  strategicPlan: boolean;
  measurementDoc: boolean;
  boardMinutes: boolean;
}

const INITIAL_FORM_DATA: FormData = {
  organizationName: '', ein: '', website: '', city: '', state: '',
  annualBudget: '', staffSize: '', sector: '', yearsInOperation: '', lifecycleStage: '',
  role: '', roleOther: '', yourName: '', yourEmail: '',
  d1_q1: '', d1_q2: '', d1_q3: '',
  d2_q1: '', d2_q2: '', d2_q3: '',
  d3_q1: '', d3_q2: '', d3_q3: '',
  d4_q1: '', d4_q2: '', d4_q3: '',
  d5_q1: '', d5_q2: '', d5_q3: '',
  d6_q1: '', d6_q2: '', d6_q3: '',
  risk_funding: '', risk_leadership: '', risk_governance: '',
  risk_capacity: '', risk_external: '', risk_reputation: '',
  biggestChallenge: '', whatSuccess: '', additionalInfo: '',
};

const STEPS = [
  { id: 'intro', title: 'Welcome' },
  { id: 'organization', title: 'Your Organization' },
  { id: 'contact', title: 'Your Information' },
  { id: 'dimension1', title: 'Mission & Vision' },
  { id: 'dimension2', title: 'Positioning' },
  { id: 'dimension3', title: 'Goals & Priorities' },
  { id: 'dimension4', title: 'Implementation' },
  { id: 'dimension5', title: 'Leadership' },
  { id: 'dimension6', title: 'Measurement' },
  { id: 'risk', title: 'Risk Snapshot' },
  { id: 'challenges', title: 'Your Challenges' },
  { id: 'documents', title: 'Documents' },
  { id: 'review', title: 'Review & Submit' },
];

const SECTORS = [
  'Arts, Culture & Humanities', 'Education', 'Environment & Animals', 'Health',
  'Human Services', 'International & Foreign Affairs', 'Public & Societal Benefit',
  'Religion Related', 'Mutual/Membership Benefit', 'Other',
];

const STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
];

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const LIKERT_OPTIONS = [
  { value: '1', label: 'Strongly Disagree' },
  { value: '2', label: 'Disagree' },
  { value: '3', label: 'Neutral' },
  { value: '4', label: 'Agree' },
  { value: '5', label: 'Strongly Agree' },
];

const RISK_OPTIONS = [
  { value: 'low', label: 'Low Risk' },
  { value: 'medium', label: 'Medium Risk' },
  { value: 'high', label: 'High Risk' },
  { value: 'critical', label: 'Critical Risk' },
];

export default function StrategicPlanCheckUp({ user, onComplete, onCancel }: StrategicPlanCheckUpProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    ...INITIAL_FORM_DATA,
    organizationName: user?.organization?.name || '',
    yourName: user?.full_name || '',
    yourEmail: user?.email || '',
  });
  const [orgData, setOrgData] = useState<OrgData | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [files, setFiles] = useState<{
    strategicPlan: File | null;
    measurementDoc: File | null;
    boardMinutes: File | null;
  }>({ strategicPlan: null, measurementDoc: null, boardMinutes: null });
  const [docsNotAvailable, setDocsNotAvailable] = useState<DocumentAvailability>({
    strategicPlan: false, measurementDoc: false, boardMinutes: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'yourEmail') setEmailError('');
  };

  const handleFileChange = (field: 'strategicPlan' | 'measurementDoc' | 'boardMinutes', file: File | null) => {
    setFiles(prev => ({ ...prev, [field]: file }));
    if (file) setDocsNotAvailable(prev => ({ ...prev, [field]: false }));
  };

  const handleDocNotAvailable = (field: keyof DocumentAvailability, checked: boolean) => {
    setDocsNotAvailable(prev => ({ ...prev, [field]: checked }));
    if (checked) setFiles(prev => ({ ...prev, [field]: null }));
  };

  const validateEmail = (email: string): boolean => email ? EMAIL_REGEX.test(email) : false;

  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000) return \`\$\${(amount / 1000000).toFixed(1)}M\`;
    if (amount >= 1000) return \`\$\${(amount / 1000).toFixed(0)}K\`;
    return \`\$\${amount.toLocaleString()}\`;
  };

  const lookupEIN = async (ein: string) => {
    const cleanEIN = ein.replace(/-/g, '');
    if (cleanEIN.length !== 9) {
      setLookupError('Please enter a valid 9-digit EIN');
      return;
    }
    setIsLookingUp(true);
    setLookupError('');
    try {
      const response = await fetch(\`https://projects.propublica.org/nonprofits/api/v2/organizations/\${cleanEIN}.json\`);
      if (!response.ok) {
        if (response.status === 404) {
          setLookupError('Organization not found. Please verify your EIN or enter information manually.');
          setOrgData({ found: false } as OrgData);
        } else throw new Error('API request failed');
        return;
      }
      const data = await response.json();
      const org = data.organization;
      const filings = data.filings_with_data;
      const latestFiling = filings && filings.length > 0 ? filings[0] : null;
      const enrichedData: OrgData = {
        ein: cleanEIN, name: org.name || '', city: org.city || '', state: org.state || '',
        nteeCode: org.ntee_code || '', subsection: org.subsection_code || '',
        totalRevenue: latestFiling?.totrevenue || 0, totalExpenses: latestFiling?.totfuncexpns || 0,
        totalAssets: latestFiling?.totassetsend || 0, fiscalYear: latestFiling?.tax_prd_yr || 0,
        found: true,
      };
      setOrgData(enrichedData);
      setFormData(prev => ({
        ...prev,
        organizationName: enrichedData.name || prev.organizationName,
        city: enrichedData.city || prev.city,
        state: enrichedData.state || prev.state,
        annualBudget: getBudgetRange(enrichedData.totalRevenue),
      }));
    } catch (error) {
      console.error('EIN lookup error:', error);
      setLookupError('Unable to look up organization. Please enter information manually.');
    } finally {
      setIsLookingUp(false);
    }
  };

  const getBudgetRange = (revenue: number): string => {
    if (revenue < 250000) return 'Under \$250K';
    if (revenue < 500000) return '\$250K - \$500K';
    if (revenue < 1000000) return '\$500K - \$1M';
    if (revenue < 5000000) return '\$1M - \$5M';
    if (revenue < 10000000) return '\$5M - \$10M';
    return 'Over \$10M';
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = error => reject(error);
    });
  };

  const calculateDimensionAverage = (scores: string[]): number => {
    const validScores = scores.filter(s => s !== '').map(s => parseInt(s, 10));
    if (validScores.length === 0) return 0;
    return Math.round((validScores.reduce((a, b) => a + b, 0) / validScores.length) * 10) / 10;
  };

  const handleSubmit = async () => {
    if (!validateEmail(formData.yourEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const payload: any = {
        orgName: formData.organizationName,
        ein: formData.ein,
        website: formData.website,
        city: formData.city,
        state: formData.state,
        annualBudget: formData.annualBudget,
        staffSize: formData.staffSize,
        sector: formData.sector,
        yearsInOperation: formData.yearsInOperation,
        lifecycleStage: formData.lifecycleStage,
        has990Data: orgData?.found || false,
        totalRevenue: orgData?.totalRevenue || null,
        totalExpenses: orgData?.totalExpenses || null,
        totalAssets: orgData?.totalAssets || null,
        fiscalYear: orgData?.fiscalYear || null,
        nteeCode: orgData?.nteeCode || null,
        role: formData.role === 'Other' ? formData.roleOther : formData.role,
        yourName: formData.yourName,
        yourEmail: formData.yourEmail,
        dimension1: {
          name: 'Mission, Vision & Values Alignment',
          questions: {
            mission_reviewed: { question: 'Our mission has been reviewed and affirmed within the last 3 years', score: formData.d1_q1 },
            vision_inspires: { question: 'Our vision statement inspires stakeholders and guides strategic decisions', score: formData.d1_q2 },
            values_inform: { question: 'Our organizational values actively inform day-to-day decisions', score: formData.d1_q3 },
          },
          averageScore: calculateDimensionAverage([formData.d1_q1, formData.d1_q2, formData.d1_q3]),
        },
        dimension2: {
          name: 'Strategic Positioning & Competitive Advantage',
          questions: {
            unique_value: { question: 'We have a clear unique value proposition that differentiates us', score: formData.d2_q1 },
            competitive_landscape: { question: 'We understand our competitive landscape and peer organizations', score: formData.d2_q2 },
            differentiation: { question: 'Stakeholders can articulate how we differ from similar organizations', score: formData.d2_q3 },
          },
          averageScore: calculateDimensionAverage([formData.d2_q1, formData.d2_q2, formData.d2_q3]),
        },
        dimension3: {
          name: 'Goal Clarity & Prioritization',
          questions: {
            smart_goals: { question: 'Our strategic goals are specific, measurable, and time-bound', score: formData.d3_q1 },
            prioritization: { question: 'We have clear prioritization among our goals', score: formData.d3_q2 },
            staff_awareness: { question: 'Staff at all levels can identify our top 3 strategic priorities', score: formData.d3_q3 },
          },
          averageScore: calculateDimensionAverage([formData.d3_q1, formData.d3_q2, formData.d3_q3]),
        },
        dimension4: {
          name: 'Implementation & Execution Capacity',
          questions: {
            action_plans: { question: 'Each strategic goal has clear action steps, owners, and timelines', score: formData.d4_q1 },
            resources_allocated: { question: 'Resources are explicitly allocated to strategic priorities', score: formData.d4_q2 },
            progress_checkins: { question: 'We have regular check-ins on strategic progress', score: formData.d4_q3 },
          },
          averageScore: calculateDimensionAverage([formData.d4_q1, formData.d4_q2, formData.d4_q3]),
        },
        dimension5: {
          name: 'Leadership & Governance Alignment',
          questions: {
            board_engaged: { question: 'Our board is actively engaged in strategic oversight', score: formData.d5_q1 },
            leadership_aligned: { question: 'Executive leadership and board are aligned on strategic direction', score: formData.d5_q2 },
            accountability: { question: 'Leadership is held accountable for strategic results', score: formData.d5_q3 },
          },
          averageScore: calculateDimensionAverage([formData.d5_q1, formData.d5_q2, formData.d5_q3]),
        },
        dimension6: {
          name: 'Measurement & Adaptive Capacity',
          questions: {
            clear_metrics: { question: 'We have clear metrics/KPIs for each strategic goal', score: formData.d6_q1 },
            data_review: { question: 'Leadership regularly reviews performance data', score: formData.d6_q2 },
            willing_pivot: { question: 'We are willing to pivot strategy based on data', score: formData.d6_q3 },
          },
          averageScore: calculateDimensionAverage([formData.d6_q1, formData.d6_q2, formData.d6_q3]),
        },
        riskAssessment: {
          funding: { risk: 'Funding concentration or sustainability', level: formData.risk_funding },
          leadership: { risk: 'Leadership transition or succession', level: formData.risk_leadership },
          governance: { risk: 'Board effectiveness or engagement', level: formData.risk_governance },
          capacity: { risk: 'Staff capacity or burnout', level: formData.risk_capacity },
          external: { risk: 'External/environmental factors', level: formData.risk_external },
          reputation: { risk: 'Reputation or stakeholder relations', level: formData.risk_reputation },
        },
        biggestChallenge: formData.biggestChallenge,
        whatSuccess: formData.whatSuccess,
        additionalInfo: formData.additionalInfo,
        documents: {
          strategicPlan: { uploaded: !!files.strategicPlan, notAvailable: docsNotAvailable.strategicPlan, filename: files.strategicPlan?.name || null },
          measurementDoc: { uploaded: !!files.measurementDoc, notAvailable: docsNotAvailable.measurementDoc, filename: files.measurementDoc?.name || null },
          boardMinutes: { uploaded: !!files.boardMinutes, notAvailable: docsNotAvailable.boardMinutes, filename: files.boardMinutes?.name || null },
        },
        overallScores: {
          dimension1: calculateDimensionAverage([formData.d1_q1, formData.d1_q2, formData.d1_q3]),
          dimension2: calculateDimensionAverage([formData.d2_q1, formData.d2_q2, formData.d2_q3]),
          dimension3: calculateDimensionAverage([formData.d3_q1, formData.d3_q2, formData.d3_q3]),
          dimension4: calculateDimensionAverage([formData.d4_q1, formData.d4_q2, formData.d4_q3]),
          dimension5: calculateDimensionAverage([formData.d5_q1, formData.d5_q2, formData.d5_q3]),
          dimension6: calculateDimensionAverage([formData.d6_q1, formData.d6_q2, formData.d6_q3]),
        },
        submittedAt: new Date().toISOString(),
        toolVersion: '2.0',
        toolName: 'Strategic Plan Check-Up',
      };

      if (files.strategicPlan) {
        payload.strategicPlanFile = { filename: files.strategicPlan.name, contentType: files.strategicPlan.type, base64: await toBase64(files.strategicPlan) };
      }
      if (files.measurementDoc) {
        payload.measurementDocFile = { filename: files.measurementDoc.name, contentType: files.measurementDoc.type, base64: await toBase64(files.measurementDoc) };
      }
      if (files.boardMinutes) {
        payload.boardMinutesFile = { filename: files.boardMinutes.name, contentType: files.boardMinutes.type, base64: await toBase64(files.boardMinutes) };
      }

      const webhookUrl = 'https://n8n.thepivotalgroup.com/webhook/strategic-plan-checkup';
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(\`Submission failed: \${response.status}\`);
      setSubmitStatus('success');
      onComplete?.();
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0: return true;
      case 1: return !!formData.organizationName && !!formData.annualBudget && !!formData.sector && !!formData.lifecycleStage;
      case 2:
        if (!formData.yourName || !formData.yourEmail || !formData.role) return false;
        if (formData.role === 'Other' && !formData.roleOther) return false;
        return validateEmail(formData.yourEmail);
      case 3: return !!formData.d1_q1 && !!formData.d1_q2 && !!formData.d1_q3;
      case 4: return !!formData.d2_q1 && !!formData.d2_q2 && !!formData.d2_q3;
      case 5: return !!formData.d3_q1 && !!formData.d3_q2 && !!formData.d3_q3;
      case 6: return !!formData.d4_q1 && !!formData.d4_q2 && !!formData.d4_q3;
      case 7: return !!formData.d5_q1 && !!formData.d5_q2 && !!formData.d5_q3;
      case 8: return !!formData.d6_q1 && !!formData.d6_q2 && !!formData.d6_q3;
      case 9: return !!formData.risk_funding && !!formData.risk_leadership && !!formData.risk_governance && !!formData.risk_capacity && !!formData.risk_external && !!formData.risk_reputation;
      case 10: return !!formData.biggestChallenge;
      case 11: return true;
      case 12: return true;
      default: return true;
    }
  };

  const nextStep = () => {
    if (currentStep === 2 && !validateEmail(formData.yourEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const ProgressBar = () => (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '14px', color: '#6b7280' }}>Step {currentStep + 1} of {STEPS.length}</span>
        <span style={{ fontSize: '14px', color: '#6b7280' }}>{STEPS[currentStep].title}</span>
      </div>
      <div style={{ height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: \`\${((currentStep + 1) / STEPS.length) * 100}%\`, backgroundColor: TEAL, transition: 'width 0.3s ease' }} />
      </div>
    </div>
  );

  const LikertScale = ({ question, value, onChange, required = true }: { question: string; value: string; onChange: (value: string) => void; required?: boolean; }) => (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ fontWeight: '500', color: NAVY, marginBottom: '16px', lineHeight: '1.5' }}>
        {question} {required && <span style={{ color: '#dc2626' }}>*</span>}
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {LIKERT_OPTIONS.map(opt => (
          <button key={opt.value} type="button" onClick={() => onChange(opt.value)} style={{
            flex: '1 1 auto', minWidth: '100px', padding: '12px 16px', borderRadius: '8px',
            border: \`2px solid \${value === opt.value ? TEAL : '#e5e7eb'}\`,
            backgroundColor: value === opt.value ? \`\${TEAL}15\` : 'white',
            color: value === opt.value ? NAVY : '#6b7280',
            fontWeight: value === opt.value ? '600' : '400', cursor: 'pointer', transition: 'all 0.2s', fontSize: '14px',
          }}>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  const RiskSelect = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void; }) => (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', fontWeight: '500', color: NAVY, marginBottom: '8px' }}>
        {label} <span style={{ color: '#dc2626' }}>*</span>
      </label>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {RISK_OPTIONS.map(opt => (
          <button key={opt.value} type="button" onClick={() => onChange(opt.value)} style={{
            flex: '1 1 auto', minWidth: '80px', padding: '10px 14px', borderRadius: '8px',
            border: \`2px solid \${value === opt.value ? (opt.value === 'critical' ? '#dc2626' : opt.value === 'high' ? '#f97316' : opt.value === 'medium' ? '#eab308' : '#22c55e') : '#e5e7eb'}\`,
            backgroundColor: value === opt.value ? (opt.value === 'critical' ? '#fef2f2' : opt.value === 'high' ? '#fff7ed' : opt.value === 'medium' ? '#fefce8' : '#f0fdf4') : 'white',
            color: value === opt.value ? NAVY : '#6b7280',
            fontWeight: value === opt.value ? '600' : '400', cursor: 'pointer', transition: 'all 0.2s', fontSize: '13px',
          }}>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  const FileUpload = ({ label, description, file, onChange, notAvailable, onNotAvailableChange }: {
    label: string; description: string; file: File | null;
    onChange: (file: File | null) => void; notAvailable: boolean; onNotAvailableChange: (checked: boolean) => void;
  }) => (
    <div style={{ marginBottom: '24px' }}>
      <label style={{ display: 'block', fontWeight: '500', color: NAVY, marginBottom: '4px' }}>{label}</label>
      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>{description}</p>
      {!notAvailable && (
        <div style={{ border: '2px dashed #d1d5db', borderRadius: '8px', padding: '20px', textAlign: 'center', backgroundColor: file ? '#f0fdf4' : '#fafafa', marginBottom: '12px' }}>
          {file ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <span style={{ color: '#059669' }}>✓ {file.name}</span>
              <button type="button" onClick={() => onChange(null)} style={{ padding: '4px 12px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>Remove</button>
            </div>
          ) : (
            <label style={{ cursor: 'pointer' }}>
              <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" onChange={(e) => onChange(e.target.files?.[0] || null)} style={{ display: 'none' }} />
              <span style={{ color: TEAL, textDecoration: 'underline' }}>Choose file</span>
              <span style={{ color: '#6b7280' }}> or drag and drop</span>
            </label>
          )}
        </div>
      )}
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px', backgroundColor: notAvailable ? '#f3f4f6' : 'transparent', borderRadius: '8px', border: notAvailable ? '1px solid #d1d5db' : '1px solid transparent' }}>
        <input type="checkbox" checked={notAvailable} onChange={(e) => onNotAvailableChange(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
        <span style={{ fontSize: '14px', color: '#4b5563' }}>This document is not available / does not exist for our organization</span>
      </label>
    </div>
  );

  const InputField = ({ label, value, onChange, placeholder, type = 'text', required = false, error = '' }: {
    label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; required?: boolean; error?: string;
  }) => (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', fontWeight: '500', color: NAVY, marginBottom: '8px' }}>
        {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
      </label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={{
        width: '100%', padding: '12px 16px', borderRadius: '8px',
        border: error ? '2px solid #dc2626' : '2px solid #e5e7eb',
        fontSize: '15px', outline: 'none', boxSizing: 'border-box',
      }} placeholder={placeholder} />
      {error && <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '6px' }}>{error}</p>}
    </div>
  );

  const SelectField = ({ label, value, onChange, options, placeholder, required = false }: {
    label: string; value: string; onChange: (value: string) => void; options: string[]; placeholder?: string; required?: boolean;
  }) => (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', fontWeight: '500', color: NAVY, marginBottom: '8px' }}>
        {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
      </label>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{
        width: '100%', padding: '12px 16px', borderRadius: '8px', border: '2px solid #e5e7eb',
        fontSize: '15px', outline: 'none', backgroundColor: 'white', boxSizing: 'border-box',
      }}>
        <option value="">{placeholder || 'Select...'}</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Welcome/Intro - Strategy fundamentals, NOT the ONE Thing philosophy
        return (
          <div style={{ padding: '20px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: TEAL, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                The Nonprofit Edge
              </div>
              <h2 style={{ fontSize: '32px', fontWeight: '700', color: NAVY, marginBottom: '16px', lineHeight: '1.2' }}>
                Strategic Plan Check-Up
              </h2>
              <p style={{ fontSize: '18px', color: '#4b5563', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
                A comprehensive diagnostic to assess the health and effectiveness of your strategic plan.
              </p>
            </div>
            <div style={{ backgroundColor: `${NAVY}08`, borderLeft: `4px solid ${NAVY}`, borderRadius: '0 12px 12px 0', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: NAVY, marginBottom: '12px' }}>
                Why Strategic Planning Matters
              </h3>
              <p style={{ color: '#374151', margin: 0, lineHeight: '1.7' }}>
                Strategy is a <strong>pattern of purpose, policies, programs, actions, and decisions</strong> that define 
                what your organization is, what it does, and why it does it. Without clear strategy, even the most 
                dedicated teams work hard on the wrong things.
              </p>
            </div>
            <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: NAVY, marginBottom: '16px' }}>
                We'll Assess 6 Key Dimensions
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  { num: '1', title: 'Mission, Vision & Values', desc: 'Foundation of strategic clarity' },
                  { num: '2', title: 'Strategic Positioning', desc: 'Your unique value and competitive advantage' },
                  { num: '3', title: 'Goal Clarity & Prioritization', desc: 'From many priorities to focused action' },
                  { num: '4', title: 'Implementation Capacity', desc: 'Turning plans into results' },
                  { num: '5', title: 'Leadership & Governance', desc: 'Board and executive alignment' },
                  { num: '6', title: 'Measurement & Adaptability', desc: 'Learning and course-correcting' },
                ].map((item) => (
                  <div key={item.num} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: TEAL, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '14px', flexShrink: 0 }}>{item.num}</div>
                    <div>
                      <div style={{ fontWeight: '600', color: NAVY }}>{item.title}</div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ backgroundColor: `${TEAL}10`, borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: NAVY, marginBottom: '16px' }}>What You'll Receive</h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                {[
                  { icon: '📊', title: 'Strategic Health Scorecard', desc: 'Scores across all 6 dimensions' },
                  { icon: '🎯', title: 'Your Primary Focus Area', desc: 'The dimension that needs attention first' },
                  { icon: '⚠️', title: 'Risk Assessment Matrix', desc: 'Organizational risks ranked by severity' },
                  { icon: '📋', title: 'Prioritized Recommendations', desc: 'Quick wins, 90-day priorities, and long-term roadmap' },
                  { icon: '📈', title: '990 Financial Context', desc: 'Your financials compared to peers (if EIN provided)' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '24px' }}>{item.icon}</span>
                    <div>
                      <div style={{ fontWeight: '600', color: NAVY, marginBottom: '4px' }}>{item.title}</div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {[
                { icon: '⏱️', value: '15-20 min', label: 'To complete' },
                { icon: '📄', value: 'Optional', label: 'Document uploads' },
                { icon: '📧', value: '< 24 hours', label: 'Report delivery' },
              ].map((item, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '20px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{item.icon}</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: NAVY }}>{item.value}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>{item.label}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', padding: '20px', borderTop: '1px solid #e5e7eb' }}>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                Developed by <strong>Dr. Lyn Corbett</strong> • 25+ years nonprofit leadership • 847+ organizations served • $100M+ in funding secured
              </p>
            </div>
          </div>
        );

      case 1: // Organization Info
        return (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: NAVY, marginBottom: '8px' }}>Tell Us About Your Organization</h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>Enter your EIN to automatically pull your 990 data, or fill in the details manually.</p>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: '500', color: NAVY, marginBottom: '8px' }}>EIN (Employer Identification Number)</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input type="text" value={formData.ein} onChange={(e) => handleInputChange('ein', e.target.value)} style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '2px solid #e5e7eb', fontSize: '15px', outline: 'none' }} placeholder="XX-XXXXXXX" maxLength={10} />
                <button type="button" onClick={() => lookupEIN(formData.ein)} disabled={isLookingUp || !formData.ein} style={{ padding: '12px 24px', backgroundColor: TEAL, color: 'white', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: isLookingUp || !formData.ein ? 'not-allowed' : 'pointer', opacity: isLookingUp || !formData.ein ? 0.6 : 1 }}>
                  {isLookingUp ? 'Looking up...' : 'Lookup'}
                </button>
              </div>
              {lookupError && <p style={{ color: '#dc2626', fontSize: '14px', marginTop: '8px' }}>{lookupError}</p>}
            </div>
            {orgData?.found && (
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #22c55e', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
                <div style={{ fontWeight: '600', color: '#166534', marginBottom: '8px' }}>✓ 990 Data Found</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '14px' }}>
                  <div><strong>Revenue:</strong> {formatCurrency(orgData.totalRevenue)}</div>
                  <div><strong>Expenses:</strong> {formatCurrency(orgData.totalExpenses)}</div>
                  <div><strong>Assets:</strong> {formatCurrency(orgData.totalAssets)}</div>
                  <div><strong>Fiscal Year:</strong> {orgData.fiscalYear}</div>
                </div>
              </div>
            )}
            <InputField label="Organization Name" value={formData.organizationName} onChange={(v) => handleInputChange('organizationName', v)} required />
            <InputField label="Website" value={formData.website} onChange={(v) => handleInputChange('website', v)} placeholder="https://www.yourorg.org" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <InputField label="City" value={formData.city} onChange={(v) => handleInputChange('city', v)} />
              <SelectField label="State" value={formData.state} onChange={(v) => handleInputChange('state', v)} options={STATES} />
            </div>
            <SelectField label="Annual Budget" value={formData.annualBudget} onChange={(v) => handleInputChange('annualBudget', v)} options={['Under $250K', '$250K - $500K', '$500K - $1M', '$1M - $5M', '$5M - $10M', 'Over $10M']} required />
            <SelectField label="Staff Size" value={formData.staffSize} onChange={(v) => handleInputChange('staffSize', v)} options={['1-5', '6-15', '16-50', '51-100', '100+']} />
            <SelectField label="Primary Sector" value={formData.sector} onChange={(v) => handleInputChange('sector', v)} options={SECTORS} required />
            <SelectField label="Years in Operation" value={formData.yearsInOperation} onChange={(v) => handleInputChange('yearsInOperation', v)} options={['Less than 2 years', '2-5 years', '5-10 years', '10-25 years', 'Over 25 years']} />
            
            {/* Lifecycle Stage - Critical for contextualizing findings */}
            <div style={{ marginTop: '8px' }}>
              <label style={{ display: 'block', fontWeight: '500', color: NAVY, marginBottom: '8px' }}>
                Which best describes where your organization is right now? <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                This helps us contextualize our findings — a startup's gaps are different from a mature organization's.
              </p>
              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  { value: 'startup', label: 'Getting Started', desc: 'Building foundational systems, establishing identity, seeking initial funding' },
                  { value: 'growing', label: 'Growing', desc: 'Expanding programs, adding staff, professionalizing operations' },
                  { value: 'established', label: 'Established', desc: 'Stable operations, consistent funding, recognized in community' },
                  { value: 'renewal', label: 'Ready for Renewal', desc: 'Facing stagnation, considering pivot, leadership transition, or major change' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleInputChange('lifecycleStage', opt.value)}
                    style={{
                      padding: '16px',
                      borderRadius: '8px',
                      border: `2px solid ${formData.lifecycleStage === opt.value ? TEAL : '#e5e7eb'}`,
                      backgroundColor: formData.lifecycleStage === opt.value ? `${TEAL}10` : 'white',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontWeight: '600', color: formData.lifecycleStage === opt.value ? NAVY : '#374151', marginBottom: '4px' }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2: // Contact Info
        return (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: NAVY, marginBottom: '8px' }}>Your Information</h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>Your report will be sent to the email address you provide.</p>
            <InputField label="Your Name" value={formData.yourName} onChange={(v) => handleInputChange('yourName', v)} required />
            <InputField label="Your Email" value={formData.yourEmail} onChange={(v) => handleInputChange('yourEmail', v)} type="email" placeholder="you@organization.org" required error={emailError} />
            <SelectField label="Your Role" value={formData.role} onChange={(v) => handleInputChange('role', v)} options={['Executive Director/CEO', 'Deputy Director/COO', 'Board Chair', 'Board Member', 'Development Director', 'Program Director', 'Other']} required />
            {formData.role === 'Other' && <InputField label="Please specify your role" value={formData.roleOther} onChange={(v) => handleInputChange('roleOther', v)} required />}
          </div>
        );

      case 3: // Dimension 1
        return (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: NAVY, marginBottom: '8px' }}>Dimension 1: Mission, Vision & Values Alignment</h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>Your mission is your "reason for being." A clear mission, inspiring vision, and lived values form the foundation of strategic clarity.</p>
            <LikertScale question="Our mission statement has been reviewed and affirmed by the board within the last 3 years." value={formData.d1_q1} onChange={(v) => handleInputChange('d1_q1', v)} />
            <LikertScale question="Our vision statement inspires stakeholders and actively guides strategic decision-making." value={formData.d1_q2} onChange={(v) => handleInputChange('d1_q2', v)} />
            <LikertScale question="Our organizational values are more than words on a wall — they actively inform day-to-day decisions and behaviors." value={formData.d1_q3} onChange={(v) => handleInputChange('d1_q3', v)} />
          </div>
        );

      case 4: // Dimension 2
        return (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: NAVY, marginBottom: '8px' }}>Dimension 2: Strategic Positioning & Competitive Advantage</h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>Positioning is about supplying critical capital — intellect, reputation, resources, and access — that powers your success. It's your unique place in the ecosystem.</p>
            <LikertScale question="We have a clear unique value proposition that differentiates us from other organizations serving similar populations." value={formData.d2_q1} onChange={(v) => handleInputChange('d2_q1', v)} />
            <LikertScale question="We regularly assess our competitive landscape and understand where peer organizations are succeeding or struggling." value={formData.d2_q2} onChange={(v) => handleInputChange('d2_q2', v)} />
            <LikertScale question="Key stakeholders (funders, partners, clients) can articulate how we differ from similar organizations." value={formData.d2_q3} onChange={(v) => handleInputChange('d2_q3', v)} />
          </div>
        );

      case 5: // Dimension 3
        return (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: NAVY, marginBottom: '8px' }}>Dimension 3: Goal Clarity & Prioritization</h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>Fifteen priorities means zero priorities. Effective strategy requires ruthless focus on what matters most.</p>
            <LikertScale question="Our strategic goals are specific, measurable, achievable, relevant, and time-bound (SMART)." value={formData.d3_q1} onChange={(v) => handleInputChange('d3_q1', v)} />
            <LikertScale question="We have clear prioritization among our goals — not everything is treated as 'Priority #1.'" value={formData.d3_q2} onChange={(v) => handleInputChange('d3_q2', v)} />
            <LikertScale question="Staff at all levels can identify our organization's top 3 strategic priorities without hesitation." value={formData.d3_q3} onChange={(v) => handleInputChange('d3_q3', v)} />
          </div>
        );

      case 6: // Dimension 4
        return (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: NAVY, marginBottom: '8px' }}>Dimension 4: Implementation & Execution Capacity</h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>Strategy without execution is hallucination. This dimension assesses your ability to turn plans into action and action into results.</p>
            <LikertScale question="Each strategic goal has clear action steps, assigned owners, and specific timelines." value={formData.d4_q1} onChange={(v) => handleInputChange('d4_q1', v)} />
            <LikertScale question="Resources (staff time, budget) are explicitly allocated to strategic priorities, not just day-to-day operations." value={formData.d4_q2} onChange={(v) => handleInputChange('d4_q2', v)} />
            <LikertScale question="We have regular (monthly or quarterly) check-ins specifically focused on strategic plan progress." value={formData.d4_q3} onChange={(v) => handleInputChange('d4_q3', v)} />
          </div>
        );

      case 7: // Dimension 5
        return (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: NAVY, marginBottom: '8px' }}>Dimension 5: Leadership & Governance Alignment</h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>The board and executive team must be aligned and mutually accountable. Governance gaps derail even the best strategies.</p>
            <LikertScale question="Our board is actively engaged in strategic oversight — not just rubber-stamping plans." value={formData.d5_q1} onChange={(v) => handleInputChange('d5_q1', v)} />
            <LikertScale question="There is strong alignment between executive leadership and the board on strategic direction and priorities." value={formData.d5_q2} onChange={(v) => handleInputChange('d5_q2', v)} />
            <LikertScale question="Leadership (board and staff) is held accountable for strategic results, not just activities completed." value={formData.d5_q3} onChange={(v) => handleInputChange('d5_q3', v)} />
          </div>
        );

      case 8: // Dimension 6
        return (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: NAVY, marginBottom: '8px' }}>Dimension 6: Measurement & Adaptive Capacity</h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>What gets measured gets managed. But measurement alone isn't enough — you need the willingness to adapt based on what you learn.</p>
            <LikertScale question="We have clear metrics or KPIs defined for each strategic goal." value={formData.d6_q1} onChange={(v) => handleInputChange('d6_q1', v)} />
            <LikertScale question="Leadership regularly reviews performance data and discusses implications for strategy." value={formData.d6_q2} onChange={(v) => handleInputChange('d6_q2', v)} />
            <LikertScale question="We are willing and able to pivot our strategy based on data and changing external conditions." value={formData.d6_q3} onChange={(v) => handleInputChange('d6_q3', v)} />
          </div>
        );

      case 9: // Risk Snapshot
        return (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: NAVY, marginBottom: '8px' }}>Organizational Risk Snapshot</h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>Rate the current risk level for each of these common nonprofit vulnerabilities.</p>
            <RiskSelect label="Funding concentration or sustainability" value={formData.risk_funding} onChange={(v) => handleInputChange('risk_funding', v)} />
            <RiskSelect label="Leadership transition or succession planning" value={formData.risk_leadership} onChange={(v) => handleInputChange('risk_leadership', v)} />
            <RiskSelect label="Board effectiveness or engagement" value={formData.risk_governance} onChange={(v) => handleInputChange('risk_governance', v)} />
            <RiskSelect label="Staff capacity or burnout" value={formData.risk_capacity} onChange={(v) => handleInputChange('risk_capacity', v)} />
            <RiskSelect label="External/environmental factors (policy changes, economic conditions)" value={formData.risk_external} onChange={(v) => handleInputChange('risk_external', v)} />
            <RiskSelect label="Reputation or stakeholder relations" value={formData.risk_reputation} onChange={(v) => handleInputChange('risk_reputation', v)} />
          </div>
        );

      case 10: // Strategic Challenges
        return (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: NAVY, marginBottom: '8px' }}>Your Strategic Challenges</h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>Help us understand your unique situation so we can provide tailored recommendations.</p>
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontWeight: '500', color: NAVY, marginBottom: '8px' }}>What is your biggest strategic challenge right now? <span style={{ color: '#dc2626' }}>*</span></label>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>Be specific — this helps us pinpoint where to focus.</p>
              <textarea value={formData.biggestChallenge} onChange={(e) => handleInputChange('biggestChallenge', e.target.value)} rows={4} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '2px solid #e5e7eb', fontSize: '15px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} placeholder="Example: We have a strategic plan but no one seems to own implementation..." />
            </div>
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontWeight: '500', color: NAVY, marginBottom: '8px' }}>What would success look like 12 months from now?</label>
              <textarea value={formData.whatSuccess} onChange={(e) => handleInputChange('whatSuccess', e.target.value)} rows={3} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '2px solid #e5e7eb', fontSize: '15px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} placeholder="Example: Board and staff aligned around 3 clear priorities..." />
            </div>
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontWeight: '500', color: NAVY, marginBottom: '8px' }}>Anything else you'd like us to know?</label>
              <textarea value={formData.additionalInfo} onChange={(e) => handleInputChange('additionalInfo', e.target.value)} rows={3} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '2px solid #e5e7eb', fontSize: '15px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} placeholder="Recent changes, upcoming opportunities, context..." />
            </div>
          </div>
        );

      case 11: // Documents
        return (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: NAVY, marginBottom: '8px' }}>Upload Documents (Optional)</h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              Uploading documents allows us to analyze your actual plans — not just your self-assessment. 
              If a document doesn't exist for your organization, simply check the box to let us know.
            </p>
            <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #0ea5e9', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
              <div style={{ fontWeight: '600', color: '#0369a1', marginBottom: '4px' }}>📋 Why Documents Help</div>
              <p style={{ fontSize: '14px', color: '#0369a1', margin: 0 }}>
                Organizations that upload their strategic plan receive significantly more specific and actionable 
                recommendations. Our AI analyzes the actual content, not just your responses.
              </p>
            </div>
            <FileUpload label="Current Strategic Plan" description="Your organization's current or most recent strategic plan document" file={files.strategicPlan} onChange={(file) => handleFileChange('strategicPlan', file)} notAvailable={docsNotAvailable.strategicPlan} onNotAvailableChange={(checked) => handleDocNotAvailable('strategicPlan', checked)} />
            <FileUpload label="Measurement Mechanism / Dashboard" description="Any progress tracking documents, dashboards, scorecards, or KPI reports" file={files.measurementDoc} onChange={(file) => handleFileChange('measurementDoc', file)} notAvailable={docsNotAvailable.measurementDoc} onNotAvailableChange={(checked) => handleDocNotAvailable('measurementDoc', checked)} />
            <FileUpload label="Board Minutes Related to Strategic Plan" description="Recent board minutes that reference strategic plan discussions or reviews" file={files.boardMinutes} onChange={(file) => handleFileChange('boardMinutes', file)} notAvailable={docsNotAvailable.boardMinutes} onNotAvailableChange={(checked) => handleDocNotAvailable('boardMinutes', checked)} />
          </div>
        );

      case 12: // Review
        return (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: NAVY, marginBottom: '8px' }}>Review & Submit</h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>Please review your submission. Your comprehensive report will be sent to <strong>{formData.yourEmail}</strong>.</p>
            {submitStatus === 'success' ? (
              <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #10b981', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <h4 style={{ fontSize: '20px', fontWeight: '600', color: '#065f46', marginBottom: '8px' }}>Assessment Submitted Successfully!</h4>
                <p style={{ color: '#047857', marginBottom: '16px' }}>Your Strategic Plan Check-Up report will be sent to <strong>{formData.yourEmail}</strong>.</p>
                <p style={{ color: '#047857', fontSize: '14px' }}>Most reports are delivered within 24 hours. Check your spam folder if you don't see it.</p>
              </div>
            ) : (
              <>
                {submitStatus === 'error' && <div style={{ backgroundColor: '#fef2f2', border: '1px solid #f87171', borderRadius: '8px', padding: '16px', marginBottom: '24px', color: '#b91c1c' }}>{errorMessage || 'Failed to submit. Please try again.'}</div>}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: NAVY, marginBottom: '12px' }}>Organization</h4>
                  <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '16px', fontSize: '14px' }}>
                    <div><strong>{formData.organizationName}</strong></div>
                    <div style={{ color: '#6b7280' }}>{formData.city && formData.state ? `${formData.city}, ${formData.state}` : ''} • {formData.sector} • {formData.annualBudget}</div>
                    {orgData?.found && <div style={{ color: '#059669', marginTop: '8px' }}>✓ 990 data included ({formatCurrency(orgData.totalRevenue)} revenue)</div>}
                  </div>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: NAVY, marginBottom: '12px' }}>Dimension Scores</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    {[
                      { name: 'Mission & Vision', scores: [formData.d1_q1, formData.d1_q2, formData.d1_q3] },
                      { name: 'Positioning', scores: [formData.d2_q1, formData.d2_q2, formData.d2_q3] },
                      { name: 'Goals & Priorities', scores: [formData.d3_q1, formData.d3_q2, formData.d3_q3] },
                      { name: 'Implementation', scores: [formData.d4_q1, formData.d4_q2, formData.d4_q3] },
                      { name: 'Leadership', scores: [formData.d5_q1, formData.d5_q2, formData.d5_q3] },
                      { name: 'Measurement', scores: [formData.d6_q1, formData.d6_q2, formData.d6_q3] },
                    ].map((dim, i) => (
                      <div key={i} style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', color: '#374151' }}>{dim.name}</span>
                        <span style={{ fontWeight: '600', color: calculateDimensionAverage(dim.scores) >= 4 ? '#059669' : calculateDimensionAverage(dim.scores) >= 3 ? '#eab308' : '#dc2626' }}>
                          {calculateDimensionAverage(dim.scores).toFixed(1)} / 5.0
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: NAVY, marginBottom: '12px' }}>Documents</h4>
                  <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '16px', fontSize: '14px' }}>
                    <div style={{ marginBottom: '8px' }}><strong>Strategic Plan:</strong> {files.strategicPlan ? `✓ ${files.strategicPlan.name}` : docsNotAvailable.strategicPlan ? '○ Not available' : '○ Not uploaded'}</div>
                    <div style={{ marginBottom: '8px' }}><strong>Dashboard/Metrics:</strong> {files.measurementDoc ? `✓ ${files.measurementDoc.name}` : docsNotAvailable.measurementDoc ? '○ Not available' : '○ Not uploaded'}</div>
                    <div><strong>Board Minutes:</strong> {files.boardMinutes ? `✓ ${files.boardMinutes.name}` : docsNotAvailable.boardMinutes ? '○ Not available' : '○ Not uploaded'}</div>
                  </div>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: NAVY, marginBottom: '12px' }}>Contact</h4>
                  <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '16px', fontSize: '14px' }}>
                    <div><strong>{formData.yourName}</strong> ({formData.role === 'Other' ? formData.roleOther : formData.role})</div>
                    <div style={{ color: '#6b7280' }}>{formData.yourEmail}</div>
                  </div>
                </div>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
        <div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: NAVY }}>Strategic Plan Check-Up</div>
          <div style={{ fontSize: '14px', color: TEAL }}>The Nonprofit Edge</div>
        </div>
        {onCancel && <button onClick={onCancel} style={{ padding: '8px 16px', backgroundColor: 'transparent', color: '#6b7280', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>}
      </div>
      <ProgressBar />
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
        {renderStepContent()}
      </div>
      {submitStatus !== 'success' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
          <button onClick={prevStep} disabled={currentStep === 0} style={{ padding: '14px 28px', backgroundColor: currentStep === 0 ? '#f3f4f6' : 'white', color: currentStep === 0 ? '#9ca3af' : NAVY, border: `2px solid ${currentStep === 0 ? '#e5e7eb' : NAVY}`, borderRadius: '8px', cursor: currentStep === 0 ? 'not-allowed' : 'pointer', fontWeight: '500', fontSize: '15px' }}>Back</button>
          {currentStep === STEPS.length - 1 ? (
            <button onClick={handleSubmit} disabled={isSubmitting || !canProceed()} style={{ padding: '14px 32px', backgroundColor: isSubmitting || !canProceed() ? '#9ca3af' : TEAL, color: 'white', border: 'none', borderRadius: '8px', cursor: isSubmitting || !canProceed() ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '15px' }}>
              {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
            </button>
          ) : (
            <button onClick={nextStep} disabled={!canProceed()} style={{ padding: '14px 32px', backgroundColor: !canProceed() ? '#9ca3af' : TEAL, color: 'white', border: 'none', borderRadius: '8px', cursor: !canProceed() ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '15px' }}>Continue</button>
          )}
        </div>
      )}
    </div>
  );
}
