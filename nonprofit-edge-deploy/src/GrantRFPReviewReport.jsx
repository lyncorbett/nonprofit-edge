// GrantRFPReviewReport.jsx
// Grant/RFP Review Tool - Sample Report Component
// The Nonprofit Edge Platform

import React from 'react';

// Sample data for demonstration - replace with actual API response
const sampleReportData = {
  organization: "Riverside Youth Mentoring Alliance",
  funder: "Baxter Family Foundation",
  grantAmount: "$75,000",
  analysisDate: "January 1, 2026",
  score: 68,
  compliance: {
    pageLimit: { status: 'fail', text: 'Page limit: 12 of 10' },
    sections: { status: 'pass', text: 'Required sections present' },
    budgetJustification: { status: 'fail', text: 'Budget justification missing' },
    attachments: { status: 'warn', text: '1 required attachment missing' },
    eligibility: { status: 'pass', text: 'Eligibility confirmed' }
  },
  executiveSummary: [
    "This proposal demonstrates genuine passion for youth mentoring and includes solid program design elements. However, two compliance issues need immediate attention: the proposal exceeds the 10-page limit by 2 pages (some funders won't review over-length submissions), and the budget lacks the justification narrative the RFP requires. You're also missing audited financials, which are typically required for requests of this size.",
    "Beyond compliance, the proposal's biggest strategic gap is differentiation. Your mentor training curriculum and school-embedded model are genuine competitive advantages — but they're buried on page 8 instead of featured prominently. In a competitive field, reviewers may not see what makes RYMA different.",
    "As a first-time applicant to this funder, your proposal carries extra burden to establish credibility — reviewers will look more closely at organizational capacity and track record when they don't have a relationship with you yet."
  ],
  scoreBreakdown: [
    { criterion: 'Need Statement', points: '16 / 20', assessment: 'Strong local data; could add regional comparison' },
    { criterion: 'Program Design', points: '20 / 25', assessment: 'Solid activities; timeline milestones vague' },
    { criterion: 'Organizational Capacity', points: '14 / 20', assessment: 'Experience shown; staffing plan unclear' },
    { criterion: 'Evaluation Plan', points: '8 / 15', assessment: 'Outcomes listed; measurement methods missing' },
    { criterion: 'Budget', points: '4 / 10', assessment: 'Line items present; no justification narrative' },
    { criterion: 'Sustainability', points: '6 / 10', assessment: 'Generic "seek funding" language' }
  ],
  strengths: [
    'Compelling need statement with local data (pg. 2-3)',
    'Strong letters of support from school partners',
    'Clear program activities and mentor requirements',
    '10-year track record in community',
    'Board includes educators and youth advocates'
  ],
  gaps: [
    { text: 'Over page limit — must cut 2 pages', critical: true },
    { text: 'Budget justification narrative missing', critical: true },
    { text: 'Audited financials not included', critical: true },
    { text: 'Evaluation plan lacks measurement specifics', critical: false },
    { text: 'Differentiation buried (pg. 8) instead of featured', critical: false },
    { text: 'Sustainability plan is generic', critical: false }
  ],
  threeLenses: {
    why: {
      rating: 'Moderate',
      inProposal: 'Opens with statistics about youth disconnection. Organizational purpose appears on page 4: "RYMA provides mentoring services to at-risk youth."',
      youToldUs: '"Because every young person deserves an adult who believes in them unconditionally — and too many kids in our community have never had that."',
      gap: 'Your intake answer has conviction. Your proposal has facts. Reviewers read dozens of proposals with facts — they remember the ones with heart. The "unconditional belief" language doesn\'t appear anywhere.',
      suggestion: 'Page 1, opening: Instead of leading with statistics, consider: "Every young person deserves an adult who believes in them unconditionally. For too many youth in Riverside County, that person has never existed — until now." Then bring in your data.'
    },
    sustainability: {
      rating: 'Needs Work',
      inProposal: 'Page 10: "RYMA will seek additional foundation funding and explore government contracts to sustain the program beyond the grant period."',
      youToldUs: '"We\'ve built a fee-for-service model with 3 school districts paying $15K each for our mentor training curriculum. That\'s $45K/year in earned revenue starting Year 2."',
      gap: 'This is a significant miss. You have a concrete sustainability plan with actual contracts, but your proposal uses generic "seek more grants" language that reviewers see in 90% of proposals. Your earned revenue model is a real strength that\'s invisible.',
      suggestion: 'Replace page 10 paragraph: "By Year 2, RYMA will generate $45,000 in earned revenue through mentor training contracts with three school districts (letters of intent attached). This reduces foundation dependence by 60% and creates a replicable model."'
    },
    differentiation: {
      rating: 'Needs Work',
      inProposal: 'Describes standard mentoring activities (matching, meetings, events). Trauma-informed training and school-embedded model appear briefly on page 8 as background.',
      youToldUs: '"We\'re the only program in the county with trauma-informed certified mentors embedded directly in schools — not pulling kids out for off-site meetings."',
      gap: 'This is a genuine competitive advantage that distinguishes you from every other mentoring program. But a reviewer skimming your proposal would never see it — the proposal reads like every other mentoring application until page 8.',
      suggestion: 'Add to page 1-2: "Unlike traditional mentoring programs that meet off-site, RYMA embeds trauma-informed certified mentors directly in partner schools. This means no transportation barriers, immediate teacher coordination, and mentors who understand each student\'s daily context. We\'re the only program in Riverside County with this model."'
    }
  },
  budgetAssessment: [
    { element: 'Line item detail', rating: 'Strong', notes: 'All standard categories present with amounts' },
    { element: 'Budget justification', rating: 'Missing', notes: 'RFP requires narrative — this is a stated requirement' },
    { element: 'Narrative alignment', rating: 'Partial', notes: 'Some activities in narrative not reflected in budget' },
    { element: 'Reasonableness', rating: 'Appropriate', notes: 'Costs are reasonable for scope and region' }
  ],
  writingQuality: {
    rating: 'Minor Issues',
    text: 'We noticed grammatical errors and inconsistent formatting (header styles vary, some bullet points incomplete). While not disqualifying, these affect how reviewers perceive attention to detail. We recommend running the document through Grammarly or Microsoft Editor before submission.'
  },
  recommendation: {
    type: 'revise',
    title: 'Revise Before Submitting',
    text: 'This proposal has potential but needs focused revision. Address the compliance issues first (page limit, budget justification, missing audit). With 4-5 hours of targeted work on the items below, you can move from "Mixed" to "Solid."'
  },
  actionPlan: {
    mustFix: [
      'Cut 2 pages to meet limit (page 6 activities section is wordy)',
      'Add budget justification narrative (~½ page)',
      'Include audited financials (required for $50K+ requests)'
    ],
    ifTimeAllows: [
      'Move differentiation to pages 1-2',
      'Replace generic sustainability with your $45K contract plan',
      'Add measurement specifics to evaluation',
      'Run grammar check'
    ],
    forFuture: [
      'Create "differentiator" highlight template',
      'Build standard budget justification text',
      'Draft sustainability language around fee model',
      'Always verify page limits before finalizing'
    ]
  }
};

const GrantRFPReviewReport = ({ reportData = sampleReportData }) => {
  const data = reportData;

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Strong';
    if (score >= 75) return 'Solid';
    if (score >= 60) return 'Mixed';
    if (score >= 40) return 'Needs Revisions';
    return 'Not Ready';
  };

  const getComplianceIcon = (status) => {
    switch (status) {
      case 'pass': return { icon: '✓', className: 'pass' };
      case 'fail': return { icon: '✗', className: 'fail' };
      case 'warn': return { icon: '!', className: 'warn' };
      default: return { icon: '?', className: '' };
    }
  };

  const getRatingBadgeClass = (rating) => {
    if (rating === 'Strong' || rating === 'Appropriate') return 'strong';
    if (rating === 'Moderate' || rating === 'Partial') return 'moderate';
    return 'weak';
  };

  return (
    <div className="grant-review-report">
      <style>{`
        .grant-review-report {
          font-family: 'Source Sans 3', -apple-system, sans-serif;
          max-width: 900px;
          margin: 0 auto;
          color: #2d3748;
          line-height: 1.6;
        }

        /* Report Header */
        .report-header {
          background: #1a365d;
          color: white;
          padding: 2rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }

        .report-header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.25rem;
        }

        .report-org h2 {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 0.25rem 0;
        }

        .report-org p {
          opacity: 0.85;
          font-size: 0.95rem;
          margin: 0;
        }

        .report-score {
          background: white;
          color: #1a365d;
          padding: 1rem 1.25rem;
          border-radius: 6px;
          text-align: center;
          min-width: 100px;
        }

        .report-score .number {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 2.25rem;
          font-weight: 700;
          line-height: 1;
        }

        .report-score .label {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 0.25rem;
          color: #975a16;
        }

        /* Compliance Strip */
        .compliance-strip {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem 1.25rem;
          padding: 0.75rem 1rem;
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
          font-size: 0.85rem;
        }

        .compliance-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .compliance-icon {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
        }

        .compliance-icon.pass {
          background: #48bb78;
          color: white;
        }

        .compliance-icon.fail {
          background: #fc8181;
          color: #742a2a;
        }

        .compliance-icon.warn {
          background: #ecc94b;
          color: #744210;
        }

        /* Score Scale */
        .score-scale {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.15);
          font-size: 0.75rem;
          opacity: 0.8;
        }

        .score-scale-row {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        /* Report Section */
        .report-section {
          background: white;
          border-radius: 8px;
          padding: 1.75rem;
          margin-bottom: 1.25rem;
          border: 1px solid #e2e8f0;
        }

        .report-section h3 {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #1a365d;
          margin: 0 0 1rem 0;
        }

        /* Tables */
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }

        th {
          text-align: left;
          padding: 0.625rem 0.75rem;
          background: #edf2f7;
          font-weight: 600;
          color: #4a5568;
          border-bottom: 1px solid #cbd5e0;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        td {
          padding: 0.625rem 0.75rem;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: top;
        }

        tr:last-child td {
          border-bottom: none;
        }

        .table-total td {
          font-weight: 700;
          background: #f7fafc;
          border-top: 2px solid #cbd5e0;
        }

        .status-met { color: #276749; font-weight: 600; }
        .status-partial { color: #975a16; font-weight: 600; }
        .status-missing { color: #c53030; font-weight: 600; }

        /* Strengths/Gaps Grid */
        .sg-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .sg-column h4 {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin: 0 0 0.75rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid;
        }

        .sg-column.strengths h4 {
          color: #276749;
          border-color: #276749;
        }

        .sg-column.gaps h4 {
          color: #975a16;
          border-color: #975a16;
        }

        .sg-column ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .sg-column li {
          padding: 0.5rem 0.75rem;
          margin-bottom: 0.375rem;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .sg-column.strengths li {
          background: #f0fff4;
          border-left: 3px solid #276749;
        }

        .sg-column.gaps li {
          background: #fffff0;
          border-left: 3px solid #975a16;
        }

        .sg-column.gaps li.critical {
          background: #fff5f5;
          border-left-color: #c53030;
        }

        /* Analysis Card */
        .analysis-card {
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          margin-bottom: 1rem;
          overflow: hidden;
        }

        .analysis-card:last-child {
          margin-bottom: 0;
        }

        .analysis-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          background: #f7fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .analysis-card-header h4 {
          font-weight: 700;
          color: #1a365d;
          font-size: 0.95rem;
          margin: 0;
        }

        .rating-badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.25rem 0.625rem;
          border-radius: 3px;
          text-transform: uppercase;
        }

        .rating-badge.strong { background: #f0fff4; color: #276749; }
        .rating-badge.moderate { background: #fffff0; color: #975a16; }
        .rating-badge.weak { background: #fff5f5; color: #c53030; }

        .analysis-card-body {
          padding: 1rem;
        }

        .analysis-row {
          display: grid;
          grid-template-columns: 100px 1fr;
          gap: 0.75rem;
          margin-bottom: 0.875rem;
          padding-bottom: 0.875rem;
          border-bottom: 1px solid #edf2f7;
        }

        .analysis-row:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .analysis-row .label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #718096;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .analysis-row .value {
          color: #2d3748;
          font-size: 0.9rem;
        }

        .analysis-row .value.quoted {
          background: linear-gradient(90deg, rgba(192, 86, 33, 0.08) 0%, transparent 100%);
          border-left: 2px solid #c05621;
          padding: 0.5rem 0.75rem;
          font-style: italic;
        }

        /* Recommendation */
        .recommendation {
          padding: 1.25rem 1.5rem;
          border-radius: 6px;
          text-align: center;
          background: #edf2f7;
          color: #2d3748;
        }

        .recommendation h4 {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0 0 0.375rem 0;
          color: #1a202c;
        }

        .recommendation p {
          margin: 0;
          max-width: 650px;
          margin: 0 auto;
          font-size: 0.95rem;
        }

        /* Action Plan */
        .action-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .action-col {
          background: #f7fafc;
          border-radius: 6px;
          padding: 1rem;
        }

        .action-col.critical {
          background: #fff5f5;
        }

        .action-col h5 {
          font-size: 0.85rem;
          font-weight: 700;
          color: #1a365d;
          margin: 0 0 0.625rem 0;
        }

        .action-col.critical h5 {
          color: #c53030;
        }

        .action-col ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .action-col li {
          padding: 0.375rem 0;
          font-size: 0.85rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .action-col.critical li {
          border-color: rgba(197, 48, 48, 0.2);
        }

        .action-col li:last-child {
          border-bottom: none;
        }

        /* Disclaimer */
        .disclaimer-box {
          background: #f7fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 1rem 1.25rem;
          font-size: 0.85rem;
          color: #4a5568;
        }

        .disclaimer-box p {
          margin: 0;
        }

        .disclaimer-box p + p {
          margin-top: 0.75rem;
        }

        .disclaimer-box strong {
          color: #2d3748;
        }

        @media (max-width: 768px) {
          .report-header-top {
            flex-direction: column;
            gap: 1rem;
          }
          .sg-grid, .action-grid {
            grid-template-columns: 1fr;
          }
          .analysis-row {
            grid-template-columns: 1fr;
          }
          .analysis-row .label {
            margin-bottom: 0.25rem;
          }
        }
      `}</style>

      {/* Report Header */}
      <div className="report-header">
        <div className="report-header-top">
          <div className="report-org">
            <h2>{data.organization}</h2>
            <p>Grant Application to: {data.funder}</p>
            <p style={{ opacity: 0.7, fontSize: '0.85rem', marginTop: '0.25rem' }}>
              {data.grantAmount} request • Analyzed {data.analysisDate}
            </p>
          </div>
          <div className="report-score">
            <div className="number">{data.score}</div>
            <div className="label">{getScoreLabel(data.score)}</div>
          </div>
        </div>
        <div className="compliance-strip">
          {Object.entries(data.compliance).map(([key, item]) => {
            const iconData = getComplianceIcon(item.status);
            return (
              <span key={key} className="compliance-item">
                <span className={`compliance-icon ${iconData.className}`}>{iconData.icon}</span>
                {item.text}
              </span>
            );
          })}
        </div>
        <div className="score-scale">
          <div className="score-scale-row">
            <span><strong>90-100</strong> Strong</span>
            <span><strong>75-89</strong> Solid</span>
            <span><strong>60-74</strong> Mixed</span>
            <span><strong>40-59</strong> Needs Revisions</span>
            <span><strong>&lt;40</strong> Not Ready</span>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="report-section">
        <h3>Executive Summary</h3>
        {data.executiveSummary.map((para, i) => (
          <p key={i} style={{ marginBottom: i < data.executiveSummary.length - 1 ? '1rem' : 0 }}>{para}</p>
        ))}

        <div style={{ background: '#f7fafc', borderRadius: '6px', padding: '1rem', marginTop: '1.25rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.3px', margin: '0 0 0.75rem 0' }}>
            Score Breakdown (per RFP criteria)
          </h4>
          <table>
            <thead>
              <tr>
                <th>Criterion</th>
                <th style={{ width: '80px' }}>Points</th>
                <th>Assessment</th>
              </tr>
            </thead>
            <tbody>
              {data.scoreBreakdown.map((row, i) => (
                <tr key={i}>
                  <td>{row.criterion}</td>
                  <td>{row.points}</td>
                  <td>{row.assessment}</td>
                </tr>
              ))}
              <tr className="table-total">
                <td>Total Score</td>
                <td>{data.score} / 100</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Strengths & Gaps */}
      <div className="report-section">
        <h3>Key Strengths & Critical Gaps</h3>
        <div className="sg-grid">
          <div className="sg-column strengths">
            <h4>Strengths</h4>
            <ul>
              {data.strengths.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="sg-column gaps">
            <h4>Gaps</h4>
            <ul>
              {data.gaps.map((item, i) => (
                <li key={i} className={item.critical ? 'critical' : ''}>{item.text}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Three Lenses Analysis */}
      <div className="report-section">
        <h3>Three Lenses Analysis</h3>

        {/* WHY Analysis */}
        <div className="analysis-card">
          <div className="analysis-card-header">
            <h4>WHY Analysis</h4>
            <span className={`rating-badge ${getRatingBadgeClass(data.threeLenses.why.rating)}`}>
              {data.threeLenses.why.rating}
            </span>
          </div>
          <div className="analysis-card-body">
            <div className="analysis-row">
              <div className="label">In Proposal</div>
              <div className="value">{data.threeLenses.why.inProposal}</div>
            </div>
            <div className="analysis-row">
              <div className="label">You Told Us</div>
              <div className="value quoted">{data.threeLenses.why.youToldUs}</div>
            </div>
            <div className="analysis-row">
              <div className="label">The Gap</div>
              <div className="value">{data.threeLenses.why.gap}</div>
            </div>
            <div className="analysis-row">
              <div className="label">Suggestion</div>
              <div className="value"><strong>{data.threeLenses.why.suggestion}</strong></div>
            </div>
          </div>
        </div>

        {/* Sustainability Analysis */}
        <div className="analysis-card">
          <div className="analysis-card-header">
            <h4>Sustainability Analysis</h4>
            <span className={`rating-badge ${getRatingBadgeClass(data.threeLenses.sustainability.rating)}`}>
              {data.threeLenses.sustainability.rating}
            </span>
          </div>
          <div className="analysis-card-body">
            <div className="analysis-row">
              <div className="label">In Proposal</div>
              <div className="value">{data.threeLenses.sustainability.inProposal}</div>
            </div>
            <div className="analysis-row">
              <div className="label">You Told Us</div>
              <div className="value quoted">{data.threeLenses.sustainability.youToldUs}</div>
            </div>
            <div className="analysis-row">
              <div className="label">The Gap</div>
              <div className="value">{data.threeLenses.sustainability.gap}</div>
            </div>
            <div className="analysis-row">
              <div className="label">Suggestion</div>
              <div className="value"><strong>{data.threeLenses.sustainability.suggestion}</strong></div>
            </div>
          </div>
        </div>

        {/* Differentiation Analysis */}
        <div className="analysis-card">
          <div className="analysis-card-header">
            <h4>Differentiation Analysis</h4>
            <span className={`rating-badge ${getRatingBadgeClass(data.threeLenses.differentiation.rating)}`}>
              {data.threeLenses.differentiation.rating}
            </span>
          </div>
          <div className="analysis-card-body">
            <div className="analysis-row">
              <div className="label">In Proposal</div>
              <div className="value">{data.threeLenses.differentiation.inProposal}</div>
            </div>
            <div className="analysis-row">
              <div className="label">You Told Us</div>
              <div className="value quoted">{data.threeLenses.differentiation.youToldUs}</div>
            </div>
            <div className="analysis-row">
              <div className="label">The Gap</div>
              <div className="value">{data.threeLenses.differentiation.gap}</div>
            </div>
            <div className="analysis-row">
              <div className="label">Suggestion</div>
              <div className="value"><strong>{data.threeLenses.differentiation.suggestion}</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Assessment */}
      <div className="report-section">
        <h3>Budget Assessment</h3>
        <table>
          <thead>
            <tr>
              <th>Element</th>
              <th style={{ width: '100px' }}>Rating</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {data.budgetAssessment.map((row, i) => (
              <tr key={i}>
                <td>{row.element}</td>
                <td className={
                  row.rating === 'Strong' || row.rating === 'Appropriate' ? 'status-met' :
                  row.rating === 'Partial' ? 'status-partial' : 'status-missing'
                }>{row.rating}</td>
                <td>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#4a5568' }}>
          <strong>Critical:</strong> Your budget shows $35,000 for "Personnel" without breakdown. Add a justification paragraph: "Personnel ($35,000): Program Coordinator at 0.5 FTE ($28,000 salary + $7,000 benefits) responsible for mentor recruitment, training, and school liaison." Do this for each line item.
        </p>
      </div>

      {/* Writing Quality */}
      <div className="report-section">
        <h3>Writing Quality</h3>
        <p style={{ color: '#975a16', fontWeight: 600, marginBottom: '0.5rem' }}>{data.writingQuality.rating}</p>
        <p style={{ fontSize: '0.9rem', color: '#4a5568', margin: 0 }}>{data.writingQuality.text}</p>
      </div>

      {/* Recommendation */}
      <div className="report-section">
        <h3>Recommendation</h3>
        <div className="recommendation">
          <h4>{data.recommendation.title}</h4>
          <p>{data.recommendation.text}</p>
        </div>
      </div>

      {/* Action Plan */}
      <div className="report-section">
        <h3>Action Plan</h3>
        <div className="action-grid">
          <div className="action-col critical">
            <h5>Must Fix Before Submitting</h5>
            <ul>
              {data.actionPlan.mustFix.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="action-col">
            <h5>If Time Allows</h5>
            <ul>
              {data.actionPlan.ifTimeAllows.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="action-col">
            <h5>For Future Proposals</h5>
            <ul>
              {data.actionPlan.forFuture.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="report-section">
        <h3>About This Analysis</h3>
        <div className="disclaimer-box">
          <p><strong>This analysis evaluates your proposal — not your organization.</strong> A score of {data.score} means the proposal has gaps in communicating your fit for this opportunity, not that {data.organization} isn't qualified. Your organization may be excellent; the proposal just isn't showing it as clearly as it could.</p>
          <p>Final funding decisions depend on factors we cannot predict, including the strength of competing applications, individual reviewer perspectives, and funder priorities that may not be explicit in the RFP. This analysis is designed to improve your probability of success, not guarantee it.</p>
        </div>
      </div>
    </div>
  );
};

export default GrantRFPReviewReport;
