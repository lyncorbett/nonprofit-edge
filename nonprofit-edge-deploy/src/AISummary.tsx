import React, { useState, useRef } from 'react';

const AISummary: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF, Word document, or text file.');
      return;
    }
    
    setUploadedFile(file);
    setError(null);
    setSummary(null);
  };

  const handleSubmit = async () => {
    if (!uploadedFile) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      
      const response = await fetch(
        'https://thenonprofitedge.app.n8n.cloud/webhook/ai-summary',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to process document');
      }

      const result = await response.json();
      
      // The AI returns HTML-formatted summary
      const summaryText = result.message?.content || result.text || result.summary || JSON.stringify(result);
      setSummary(summaryText);
      
    } catch (err) {
      console.error('Error processing document:', err);
      setError('Failed to process document. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setUploadedFile(null);
    setSummary(null);
    setError(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Source Sans Pro, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#0D2C54', color: 'white', padding: '24px 32px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '1.75rem', fontFamily: 'Merriweather, serif' }}>
            AI Document Summary
          </h1>
          <p style={{ margin: 0, opacity: 0.8 }}>
            Upload any document and get an AI-powered summary in seconds
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px' }}>
        
        {/* Upload Section */}
        {!summary && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontFamily: 'Merriweather, serif', color: '#0D2C54', marginBottom: '8px' }}>
              Upload Your Document
            </h2>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>
              Supported formats: PDF, Word (.doc, .docx), Text (.txt)
            </p>

            {/* Drop Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragActive ? '#0097A9' : uploadedFile ? '#10b981' : '#cbd5e1'}`,
                borderRadius: '12px',
                padding: '48px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                background: dragActive ? '#f0fdfa' : uploadedFile ? '#f0fdf4' : '#f8fafc',
                transition: 'all 0.2s',
                marginBottom: '24px'
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                style={{ display: 'none' }}
              />
              
              {uploadedFile ? (
                <>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>✓</div>
                  <p style={{ fontWeight: 600, color: '#059669', marginBottom: '4px' }}>
                    {uploadedFile.name}
                  </p>
                  <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                    {(uploadedFile.size / 1024).toFixed(1)} KB • Click or drag to replace
                  </p>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>📄</div>
                  <p style={{ fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Drag & drop your document here
                  </p>
                  <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                    or click to browse
                  </p>
                </>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '24px',
                color: '#dc2626'
              }}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!uploadedFile || isProcessing}
              style={{
                width: '100%',
                padding: '14px 24px',
                background: !uploadedFile || isProcessing ? '#94a3b8' : '#0097A9',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: !uploadedFile || isProcessing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isProcessing ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Processing...
                </>
              ) : (
                <>
                  Generate Summary ✨
                </>
              )}
            </button>

            {/* What You Get */}
            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
              <h3 style={{ fontFamily: 'Merriweather, serif', color: '#0D2C54', marginBottom: '16px', fontSize: '1rem' }}>
                What you'll get:
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {[
                  { icon: '📝', text: 'Executive Introduction' },
                  { icon: '🎯', text: 'Key Points & Findings' },
                  { icon: '💡', text: 'Conclusions' },
                  { icon: '✅', text: 'Actionable Insights' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '0.9375rem' }}>
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Summary Result */}
        {summary && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontFamily: 'Merriweather, serif', color: '#0D2C54', margin: 0 }}>
                  Document Summary
                </h2>
                <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '0.875rem' }}>
                  {uploadedFile?.name}
                </p>
              </div>
              <button
                onClick={handleReset}
                style={{
                  padding: '8px 16px',
                  background: 'white',
                  color: '#475569',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                New Summary
              </button>
            </div>

            {/* Summary Content */}
            <div 
              style={{
                color: '#334155',
                lineHeight: 1.7,
                fontSize: '1rem'
              }}
              dangerouslySetInnerHTML={{ __html: summary }}
            />

            {/* Actions */}
            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  const blob = new Blob([summary], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `summary-${uploadedFile?.name || 'document'}.html`;
                  a.click();
                }}
                style={{
                  padding: '10px 20px',
                  background: '#0D2C54',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Download Summary
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(summary.replace(/<[^>]*>/g, ''));
                  alert('Summary copied to clipboard!');
                }}
                style={{
                  padding: '10px 20px',
                  background: 'white',
                  color: '#475569',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Copy Text
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CSS for spinner */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AISummary;
