import React, { useState, useRef } from 'react';

const GrantReview: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    orgName: '',
    yourName: '',
    yourEmail: '',
    grantName: '',
    funderName: '',
    requestAmount: '',
    focusAreas: [] as string[],
    specificFeedback: '',
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleFocusArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area]
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setUploadedFile(e.dataTransfer.files[0]);
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
    });
  };

  const handleSubmit = async () => {
    if (!uploadedFile) return;
    setIsSubmitting(true);
    
    try {
      const fileBase64 = await toBase64(uploadedFile);
      
      // Create FormData to match n8n multipart expectation
      const formDataToSend = new FormData();
      formDataToSend.append('organization', formData.orgName);
      formDataToSend.append('email', formData.yourEmail);
      formDataToSend.append('feedback', formData.specificFeedback || formData.focusAreas.join(', '));
      formDataToSend.append('stage', 'Final Submission');
      formDataToSend.append('urgency', 'Within a week');
      formDataToSend.append('proposal', uploadedFile);
      
      await fetch('https://thenonprofitedge.app.n8n.cloud/webhook/rfp', {
        method: 'POST',
        body: formDataToSend, // Send as FormData, not JSON
        }),
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const focusAreas = [
    'Narrative Strength', 'Budget Alignment', 'Logic Model',
    'Evaluation Plan', 'Organizational Capacity', 'Funder Alignment', 'Competitiveness'
  ];

  if (isSubmitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '48px', textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ width: '80px', height: '80px', background: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '40px' }}>✓</div>
          <h2 style={{ fontFamily: 'Merriweather, serif', color: '#0D2C54' }}>Proposal Submitted!</h2>
          <p style={{ color: '#64748b', margin: '16px 0 24px' }}>Your grant review will be sent to <strong>{formData.yourEmail}</strong> within 24 hours.</p>
          <button onClick={() => window.location.href = '/tools'} style={{ padding: '12px 32px', background: '#0097A9', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>Back to Tools</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Source Sans Pro, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#0D2C54', color: 'white', padding: '24px 32px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '1.75rem', fontFamily: 'Merriweather, serif' }}>Grant Proposal Review</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>Get AI-powered feedback on your grant proposal before you submit</p>
        </div>
      </div>

      {/* Progress */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 32px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 3].map((step) => (
              <div key={step} style={{ flex: 1, height: '4px', borderRadius: '2px', background: currentStep >= step ? '#0097A9' : '#e2e8f0' }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.75rem', color: '#64748b' }}>
            <span>Grant Info</span>
            <span>Upload Proposal</span>
            <span>Submit</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          
          {currentStep === 1 && (
            <div>
              <h2 style={{ fontFamily: 'Merriweather, serif', color: '#0D2C54', marginBottom: '24px' }}>About This Grant</h2>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Organization Name *</label>
                  <input type="text" value={formData.orgName} onChange={(e) => updateField('orgName', e.target.value)} style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Your Name *</label>
                    <input type="text" value={formData.yourName} onChange={(e) => updateField('yourName', e.target.value)} style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Your Email *</label>
                    <input type="email" value={formData.yourEmail} onChange={(e) => updateField('yourEmail', e.target.value)} style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Grant/RFP Name</label>
                  <input type="text" value={formData.grantName} onChange={(e) => updateField('grantName', e.target.value)} placeholder="e.g., Community Impact Grant 2025" style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Funder Name</label>
                    <input type="text" value={formData.funderName} onChange={(e) => updateField('funderName', e.target.value)} style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Request Amount</label>
                    <input type="text" value={formData.requestAmount} onChange={(e) => updateField('requestAmount', e.target.value)} placeholder="$50,000" style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 style={{ fontFamily: 'Merriweather, serif', color: '#0D2C54', marginBottom: '8px' }}>Upload Your Proposal</h2>
              <p style={{ color: '#64748b', marginBottom: '24px' }}>Upload your draft or final grant proposal</p>
              
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                style={{ border: `2px dashed ${dragActive ? '#0097A9' : uploadedFile ? '#10b981' : '#cbd5e1'}`, borderRadius: '12px', padding: '48px', textAlign: 'center', cursor: 'pointer', background: uploadedFile ? '#f0fdf4' : '#f8fafc', marginBottom: '24px' }}
              >
                <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={(e) => e.target.files?.[0] && setUploadedFile(e.target.files[0])} style={{ display: 'none' }} />
                {uploadedFile ? (
                  <>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>✓</div>
                    <p style={{ fontWeight: 600, color: '#059669' }}>{uploadedFile.name}</p>
                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Click to replace</p>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>📄</div>
                    <p style={{ fontWeight: 600 }}>Drag & drop your proposal here</p>
                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>PDF or Word document</p>
                  </>
                )}
              </div>

              <label style={{ display: 'block', fontWeight: 600, marginBottom: '12px' }}>Focus areas for feedback:</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {focusAreas.map((area) => (
                  <button key={area} type="button" onClick={() => toggleFocusArea(area)} style={{ padding: '8px 16px', background: formData.focusAreas.includes(area) ? '#0097A9' : 'white', color: formData.focusAreas.includes(area) ? 'white' : '#475569', border: `2px solid ${formData.focusAreas.includes(area) ? '#0097A9' : '#e2e8f0'}`, borderRadius: '20px', fontSize: '0.875rem', cursor: 'pointer' }}>
                    {area}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 style={{ fontFamily: 'Merriweather, serif', color: '#0D2C54', marginBottom: '24px' }}>Review & Submit</h2>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Any specific concerns? (Optional)</label>
                <textarea value={formData.specificFeedback} onChange={(e) => updateField('specificFeedback', e.target.value)} rows={4} placeholder="Is there anything specific you'd like us to pay attention to?" style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', resize: 'vertical' }} />
              </div>

              <div style={{ background: '#f0fdfa', border: '2px solid #0097A9', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#0D2C54' }}>Summary</h3>
                <div style={{ display: 'grid', gap: '8px', color: '#475569', fontSize: '0.9375rem' }}>
                  <p><strong>Organization:</strong> {formData.orgName}</p>
                  <p><strong>Grant:</strong> {formData.grantName || 'Not specified'}</p>
                  <p><strong>Funder:</strong> {formData.funderName || 'Not specified'}</p>
                  <p><strong>Amount:</strong> {formData.requestAmount || 'Not specified'}</p>
                  <p><strong>Document:</strong> {uploadedFile?.name}</p>
                  <p><strong>Report will be sent to:</strong> {formData.yourEmail}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
            <button onClick={() => setCurrentStep(prev => prev - 1)} disabled={currentStep === 1} style={{ padding: '12px 24px', background: currentStep === 1 ? '#f1f5f9' : 'white', color: currentStep === 1 ? '#94a3b8' : '#475569', border: '2px solid #e2e8f0', borderRadius: '8px', fontWeight: 600, cursor: currentStep === 1 ? 'not-allowed' : 'pointer' }}>
              ← Back
            </button>
            {currentStep < 3 ? (
              <button onClick={() => setCurrentStep(prev => prev + 1)} disabled={currentStep === 2 && !uploadedFile} style={{ padding: '12px 32px', background: (currentStep === 2 && !uploadedFile) ? '#94a3b8' : '#0097A9', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: (currentStep === 2 && !uploadedFile) ? 'not-allowed' : 'pointer' }}>
                Continue →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={isSubmitting} style={{ padding: '12px 32px', background: isSubmitting ? '#94a3b8' : '#0D2C54', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                {isSubmitting ? 'Submitting...' : 'Submit for Review'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrantReview;
