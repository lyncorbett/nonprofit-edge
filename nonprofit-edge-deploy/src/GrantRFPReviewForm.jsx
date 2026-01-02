// GrantRFPReviewForm.jsx
// Grant/RFP Review Tool - Intake Form Component
// The Nonprofit Edge Platform

import React, { useState } from 'react';

const GrantRFPReviewForm = ({ onSubmit, webhookUrl }) => {
  const [formData, setFormData] = useState({
    organization_name: '',
    email: '',
    funder_name: '',
    grant_amount: '',
    org_annual_budget: '',
    funder_relationship: 'First-time applicant',
    submission_deadline: '',
    page_limit: '',
    proposal_pages: '',
    font_margin_requirements: 'None specified',
    required_attachments: [],
    included_attachments: [],
    proposal_text: '',
    rfp_text: '',
    why_exist: '',
    why_you: '',
    sustainability_plan: '',
    differentiator: '',
    focus_areas: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proposalFile, setProposalFile] = useState(null);
  const [rfpFile, setRfpFile] = useState(null);

  const attachmentOptions = [
    { id: '501c3', label: 'IRS Determination Letter (501c3)' },
    { id: '990', label: 'Most Recent 990' },
    { id: 'budget', label: 'Current Year Budget' },
    { id: 'audit', label: 'Audited Financials' },
    { id: 'board', label: 'Board List' },
    { id: 'letters', label: 'Letters of Support' },
    { id: 'logic_model', label: 'Logic Model / Theory of Change' },
    { id: 'resumes', label: 'Resumes / Staff Bios' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => {
      const current = prev[field];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (field === 'proposal') {
      setProposalFile(file);
    } else {
      setRfpFile(file);
    }

    // Extract text from PDF (you'll need pdf.js or similar)
    // For now, placeholder - implement PDF extraction
    const text = await extractTextFromFile(file);
    setFormData(prev => ({
      ...prev,
      [field === 'proposal' ? 'proposal_text' : 'rfp_text']: text
    }));
  };

  const extractTextFromFile = async (file) => {
    // TODO: Implement PDF text extraction using pdf.js
    // For MVP, you can use a paste field instead
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (onSubmit) {
        onSubmit(result);
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grant-review-form">
      <style>{`
        .grant-review-form {
          font-family: 'Source Sans 3', -apple-system, sans-serif;
          max-width: 820px;
          margin: 0 auto;
          color: #2d3748;
        }

        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-header h1 {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 2rem;
          font-weight: 700;
          color: #1a365d;
          margin-bottom: 0.375rem;
        }

        .form-header .tagline {
          color: #718096;
        }

        .info-box {
          background: #1a365d;
          color: white;
          padding: 1.25rem 1.5rem;
          border-radius: 8px;
          margin-bottom: 2rem;
        }

        .info-box strong {
          display: block;
          margin-bottom: 0.25rem;
        }

        .info-box p {
          opacity: 0.9;
          font-size: 0.95rem;
          margin: 0;
        }

        .form-section {
          background: white;
          border-radius: 8px;
          padding: 1.75rem;
          margin-bottom: 1.25rem;
          border: 1px solid #e2e8f0;
        }

        .form-section h2 {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 1.125rem;
          font-weight: 700;
          color: #1a365d;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          margin-bottom: 1.25rem;
        }

        .form-row.three-col {
          grid-template-columns: 1fr 1fr 1fr;
        }

        .form-row:last-child {
          margin-bottom: 0;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.375rem;
          font-size: 0.875rem;
        }

        .form-group label .req {
          color: #c53030;
        }

        .form-group .helper {
          font-weight: 400;
          color: #718096;
          font-size: 0.8rem;
          margin-top: 0.25rem;
        }

        input, select, textarea {
          padding: 0.625rem 0.75rem;
          border: 1px solid #cbd5e0;
          border-radius: 4px;
          font-family: inherit;
          font-size: 0.9375rem;
          color: #2d3748;
          width: 100%;
          transition: border-color 0.15s, box-shadow 0.15s;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #1a365d;
          box-shadow: 0 0 0 2px rgba(26, 54, 93, 0.1);
        }

        textarea {
          min-height: 100px;
          resize: vertical;
        }

        .file-upload {
          border: 1px dashed #cbd5e0;
          border-radius: 6px;
          padding: 1.25rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.15s;
          background: #f7fafc;
        }

        .file-upload:hover {
          border-color: #1a365d;
          background: white;
        }

        .file-upload .label {
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 0.25rem;
        }

        .file-upload .formats {
          font-size: 0.8rem;
          color: #718096;
        }

        .file-upload.has-file {
          border-color: #276749;
          background: #f0fff4;
        }

        .file-upload.has-file .label {
          color: #276749;
        }

        .checkbox-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .checkbox-item input {
          width: auto;
        }

        .attachment-note {
          font-size: 0.8rem;
          color: #718096;
          margin-top: 0.75rem;
          font-style: italic;
        }

        .insight-question {
          background: #f7fafc;
          border-left: 3px solid #c05621;
          padding: 1.25rem;
          margin-bottom: 1.25rem;
          border-radius: 0 6px 6px 0;
        }

        .insight-question:last-child {
          margin-bottom: 0;
        }

        .insight-question label {
          font-weight: 600;
          color: #1a202c;
          display: block;
          margin-bottom: 0.5rem;
        }

        .insight-question .purpose {
          font-size: 0.85rem;
          color: #718096;
          font-style: italic;
          margin-bottom: 0.75rem;
        }

        .submit-section {
          text-align: center;
          padding: 1.5rem;
        }

        .submit-btn {
          background: #c05621;
          color: white;
          border: none;
          padding: 0.875rem 2.5rem;
          font-size: 1rem;
          font-weight: 600;
          font-family: inherit;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.15s;
        }

        .submit-btn:hover:not(:disabled) {
          background: #dd6b20;
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .submit-note {
          margin-top: 0.75rem;
          font-size: 0.85rem;
          color: #718096;
        }

        .privacy-notice {
          background: #edf2f7;
          border-radius: 6px;
          padding: 1rem 1.25rem;
          margin-top: 1.5rem;
          font-size: 0.8rem;
          color: #718096;
        }

        .privacy-notice strong {
          color: #4a5568;
        }

        @media (max-width: 768px) {
          .form-row, .form-row.three-col, .checkbox-group {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="form-header">
        <h1>Grant/RFP Review</h1>
        <p className="tagline">We don't just check compliance. We check conviction.</p>
      </div>

      <div className="info-box">
        <strong>How This Works</strong>
        <p>Upload your proposal and (ideally) the RFP. Answer five questions about what you know. We'll compare what you know versus what you wrote — and show you where the gaps are.</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="form-section">
          <h2>Basic Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Organization Name <span className="req">*</span></label>
              <input
                type="text"
                name="organization_name"
                value={formData.organization_name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Riverside Youth Mentoring Alliance"
              />
            </div>
            <div className="form-group">
              <label>Your Email <span className="req">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="you@organization.org"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Funder/Issuer Name</label>
              <input
                type="text"
                name="funder_name"
                value={formData.funder_name}
                onChange={handleInputChange}
                placeholder="e.g., Baxter Family Foundation"
              />
            </div>
            <div className="form-group">
              <label>Grant/Contract Amount</label>
              <input
                type="text"
                name="grant_amount"
                value={formData.grant_amount}
                onChange={handleInputChange}
                placeholder="e.g., $75,000"
              />
            </div>
          </div>
          <div className="form-row three-col">
            <div className="form-group">
              <label>Organization Annual Budget</label>
              <select
                name="org_annual_budget"
                value={formData.org_annual_budget}
                onChange={handleInputChange}
              >
                <option value="">Select range...</option>
                <option value="Under $250,000">Under $250,000</option>
                <option value="$250,000 – $500,000">$250,000 – $500,000</option>
                <option value="$500,000 – $1 million">$500,000 – $1 million</option>
                <option value="$1 million – $5 million">$1 million – $5 million</option>
                <option value="Over $5 million">Over $5 million</option>
              </select>
            </div>
            <div className="form-group">
              <label>Relationship with Funder</label>
              <select
                name="funder_relationship"
                value={formData.funder_relationship}
                onChange={handleInputChange}
              >
                <option value="First-time applicant">First-time applicant</option>
                <option value="Previous applicant (not funded)">Previous applicant (not funded)</option>
                <option value="Previous grantee">Previous grantee</option>
                <option value="Current grantee">Current grantee</option>
              </select>
            </div>
            <div className="form-group">
              <label>Submission Deadline</label>
              <input
                type="date"
                name="submission_deadline"
                value={formData.submission_deadline}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Compliance Information */}
        <div className="form-section">
          <h2>Compliance Check</h2>
          <div className="form-row three-col">
            <div className="form-group">
              <label>Page Limit (if specified)</label>
              <input
                type="number"
                name="page_limit"
                value={formData.page_limit}
                onChange={handleInputChange}
                placeholder="e.g., 10"
              />
              <span className="helper">Enter 0 if no limit</span>
            </div>
            <div className="form-group">
              <label>Your Proposal Page Count</label>
              <input
                type="number"
                name="proposal_pages"
                value={formData.proposal_pages}
                onChange={handleInputChange}
                placeholder="e.g., 12"
              />
            </div>
            <div className="form-group">
              <label>Font/Margin Requirements?</label>
              <select
                name="font_margin_requirements"
                value={formData.font_margin_requirements}
                onChange={handleInputChange}
              >
                <option value="None specified">None specified</option>
                <option value="Yes, I've followed them">Yes, I've followed them</option>
                <option value="Yes, I'm not sure if I met them">Yes, I'm not sure if I met them</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label style={{ fontSize: '0.875rem' }}>Which attachments does the RFP require?</label>
            <div className="checkbox-group">
              {attachmentOptions.map(opt => (
                <label key={opt.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.required_attachments.includes(opt.id)}
                    onChange={() => handleCheckboxChange('required_attachments', opt.id)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label style={{ fontSize: '0.875rem' }}>Which of the above have you included?</label>
            <div className="checkbox-group">
              {attachmentOptions.map(opt => (
                <label key={opt.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.included_attachments.includes(opt.id)}
                    onChange={() => handleCheckboxChange('included_attachments', opt.id)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            <p className="attachment-note">
              We verify attachments are included based on your selections. We do not review attachment content.
            </p>
          </div>
        </div>

        {/* Document Uploads */}
        <div className="form-section">
          <h2>Document Uploads</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Your Proposal <span className="req">*</span></label>
              <div className={`file-upload ${proposalFile ? 'has-file' : ''}`}>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, 'proposal')}
                  style={{ display: 'none' }}
                  id="proposal-upload"
                />
                <label htmlFor="proposal-upload" style={{ cursor: 'pointer', display: 'block' }}>
                  <div className="label">
                    {proposalFile ? proposalFile.name : 'Drop file here or click to upload'}
                  </div>
                  <div className="formats">
                    {proposalFile ? '✓ Uploaded' : 'PDF, DOC, DOCX — Max 25MB'}
                  </div>
                </label>
              </div>
              {/* Alternative: paste text directly */}
              <div style={{ marginTop: '0.75rem' }}>
                <label style={{ fontSize: '0.8rem', color: '#718096' }}>Or paste proposal text:</label>
                <textarea
                  name="proposal_text"
                  value={formData.proposal_text}
                  onChange={handleInputChange}
                  placeholder="Paste your proposal text here if you prefer not to upload a file..."
                  style={{ marginTop: '0.25rem' }}
                />
              </div>
            </div>
            <div className="form-group">
              <label>RFP / Grant Guidelines</label>
              <div className={`file-upload ${rfpFile ? 'has-file' : ''}`}>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, 'rfp')}
                  style={{ display: 'none' }}
                  id="rfp-upload"
                />
                <label htmlFor="rfp-upload" style={{ cursor: 'pointer', display: 'block' }}>
                  <div className="label">
                    {rfpFile ? rfpFile.name : 'Drop file here or click to upload'}
                  </div>
                  <div className="formats">
                    {rfpFile ? '✓ Uploaded' : 'Recommended for scoring against actual criteria'}
                  </div>
                </label>
              </div>
              {/* Alternative: paste text directly */}
              <div style={{ marginTop: '0.75rem' }}>
                <label style={{ fontSize: '0.8rem', color: '#718096' }}>Or paste RFP text:</label>
                <textarea
                  name="rfp_text"
                  value={formData.rfp_text}
                  onChange={handleInputChange}
                  placeholder="Paste the RFP/guidelines text here..."
                  style={{ marginTop: '0.25rem' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Insight Questions */}
        <div className="form-section">
          <h2>The Questions That Matter</h2>
          <p style={{ color: '#718096', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
            These help us compare what you <em>know</em> versus what you <em>wrote</em>. Be honest — this is where the real insight comes from.
          </p>

          <div className="insight-question">
            <label>1. In one sentence, why does your organization exist?</label>
            <p className="purpose">We'll check if this conviction appears in your proposal.</p>
            <textarea
              name="why_exist"
              value={formData.why_exist}
              onChange={handleInputChange}
              placeholder="Don't tell us what you do. Tell us WHY you do it. (You can copy and paste from existing documents.)"
              required
            />
          </div>

          <div className="insight-question">
            <label>2. Why are YOU the right organization for this work?</label>
            <p className="purpose">We'll check if your competitive advantage is visible.</p>
            <textarea
              name="why_you"
              value={formData.why_you}
              onChange={handleInputChange}
              placeholder="What makes you different from other applicants? (You can copy and paste from existing documents.)"
              required
            />
          </div>

          <div className="insight-question">
            <label>3. What's your sustainability or feasibility plan?</label>
            <p className="purpose">We'll check if this appears clearly in your proposal.</p>
            <textarea
              name="sustainability_plan"
              value={formData.sustainability_plan}
              onChange={handleInputChange}
              placeholder="How will this continue after funding? Or how will you deliver what you're proposing? (You can copy and paste from existing documents.)"
              required
            />
          </div>

          <div className="insight-question">
            <label>4. What's ONE thing you do that no one else does?</label>
            <p className="purpose">We'll check if this differentiator is prominent or buried.</p>
            <textarea
              name="differentiator"
              value={formData.differentiator}
              onChange={handleInputChange}
              placeholder="Your 'secret sauce' — what competitors can't easily copy. (You can copy and paste from existing documents.)"
              required
            />
          </div>

          <div className="insight-question">
            <label>5. Anything specific you want us to focus on? (Optional)</label>
            <textarea
              name="focus_areas"
              value={formData.focus_areas}
              onChange={handleInputChange}
              placeholder="e.g., 'I'm worried my evaluation plan is weak' or 'Check if I addressed their equity priority'"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="submit-section">
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Analyzing...' : 'Analyze My Proposal'}
          </button>
          <p className="submit-note">
            Analysis takes 2-3 minutes. You'll receive a detailed report.
          </p>
        </div>
      </form>

      <div className="privacy-notice">
        <strong>How we handle your data:</strong> Your proposal and responses are processed by AI to generate your report. We retain submissions for 30 days to allow you to access your report, then permanently delete them. We do not share your content with third parties or use it to train AI models.
      </div>
    </div>
  );
};

export default GrantRFPReviewForm;
