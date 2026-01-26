import React, { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Upload, FileText, FolderOpen, Check, X, Edit3, 
  Loader, Sparkles, Download, Trash2, ChevronDown,
  ChevronRight, Eye, Save, AlertCircle, CheckCircle,
  Package, Zap
} from 'lucide-react';

// Categories for templates
const CATEGORIES = [
  'Board Governance',
  'Strategic Planning', 
  'Financial Management',
  'Human Resources',
  'Fundraising',
  'Marketing & Communications',
  'Program Management',
  'Legal & Compliance',
  'Operations',
  'Leadership Development'
];

const TEMPLATE_TYPES = [
  'Checklist',
  'Agreement/Contract',
  'Policy',
  'Worksheet',
  'Guide',
  'Form',
  'Report Template',
  'Presentation',
  'Spreadsheet',
  'Letter/Email Template'
];

const TIERS = [
  { value: 'essential', label: 'Essential', color: '#10b981' },
  { value: 'professional', label: 'Professional', color: '#0097A9' },
  { value: 'premium', label: 'Premium', color: '#D4A84B' }
];

interface AnalyzedTemplate {
  id: string;
  file: File;
  fileName: string;
  fileSize: number;
  fileType: string;
  status: 'pending' | 'analyzing' | 'analyzed' | 'approved' | 'rejected' | 'error';
  analysis?: {
    title: string;
    description: string;
    category: string;
    type: string;
    tier: string;
    tags: string[];
    confidence: number;
  };
  error?: string;
  isEditing?: boolean;
}

const BulkTemplateUploader: React.FC = () => {
  const [templates, setTemplates] = useState<AnalyzedTemplate[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info'; message: string} | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Show notification
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  }, []);

  // Handle file input
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      processFiles(files);
    }
  };

  // Process uploaded files
  const processFiles = (files: File[]) => {
    const validExtensions = ['.docx', '.doc', '.pdf', '.xlsx', '.xls', '.pptx', '.ppt', '.txt'];
    
    const newTemplates: AnalyzedTemplate[] = files
      .filter(file => {
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        return validExtensions.includes(ext);
      })
      .map(file => ({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.name.split('.').pop()?.toUpperCase() || 'Unknown',
        status: 'pending' as const
      }));

    if (newTemplates.length < files.length) {
      showNotification('info', `${files.length - newTemplates.length} files skipped (unsupported format)`);
    }

    setTemplates(prev => [...prev, ...newTemplates]);
  };

  // Analyze all pending templates with AI
  const analyzeAllTemplates = async () => {
    const pendingTemplates = templates.filter(t => t.status === 'pending');
    if (pendingTemplates.length === 0) {
      showNotification('info', 'No pending templates to analyze');
      return;
    }

    setIsAnalyzing(true);
    setUploadProgress(0);

    for (let i = 0; i < pendingTemplates.length; i++) {
      const template = pendingTemplates[i];
      
      // Update status to analyzing
      setTemplates(prev => prev.map(t => 
        t.id === template.id ? { ...t, status: 'analyzing' as const } : t
      ));

      try {
        // Extract text content from file (simplified - in production use proper parsers)
        const textContent = await extractFileContent(template.file);
        
        // Call Claude API to analyze
        const analysis = await analyzeWithClaude(template.fileName, textContent);
        
        // Update with analysis
        setTemplates(prev => prev.map(t => 
          t.id === template.id ? { ...t, status: 'analyzed' as const, analysis } : t
        ));
      } catch (error) {
        console.error('Analysis error:', error);
        setTemplates(prev => prev.map(t => 
          t.id === template.id ? { ...t, status: 'error' as const, error: 'Failed to analyze' } : t
        ));
      }

      setUploadProgress(((i + 1) / pendingTemplates.length) * 100);
    }

    setIsAnalyzing(false);
    showNotification('success', `Analyzed ${pendingTemplates.length} templates`);
  };

  // Extract content from file (basic implementation)
  const extractFileContent = async (file: File): Promise<string> => {
    // For text files, read directly
    if (file.name.endsWith('.txt')) {
      return await file.text();
    }
    
    // For other files, we'll use the filename and basic metadata
    // In production, you'd use libraries like mammoth.js for docx, pdf.js for PDF, etc.
    return `Filename: ${file.name}\nSize: ${file.size} bytes\nType: ${file.type}`;
  };

  // Call Claude API to analyze template
  const analyzeWithClaude = async (fileName: string, content: string): Promise<AnalyzedTemplate['analysis']> => {
    const response = await fetch('/api/analyze-template', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName, content })
    });

    if (!response.ok) {
      // Fallback to local analysis if API fails
      return localAnalysis(fileName);
    }

    return await response.json();
  };

  // Local fallback analysis based on filename
  const localAnalysis = (fileName: string): AnalyzedTemplate['analysis'] => {
    const nameLower = fileName.toLowerCase();
    
    // Determine category
    let category = 'Operations';
    if (nameLower.includes('board') || nameLower.includes('governance') || nameLower.includes('trustee')) {
      category = 'Board Governance';
    } else if (nameLower.includes('strategic') || nameLower.includes('planning') || nameLower.includes('vision')) {
      category = 'Strategic Planning';
    } else if (nameLower.includes('budget') || nameLower.includes('financial') || nameLower.includes('finance')) {
      category = 'Financial Management';
    } else if (nameLower.includes('hr') || nameLower.includes('employee') || nameLower.includes('staff') || nameLower.includes('hiring')) {
      category = 'Human Resources';
    } else if (nameLower.includes('fundrais') || nameLower.includes('donor') || nameLower.includes('grant') || nameLower.includes('campaign')) {
      category = 'Fundraising';
    } else if (nameLower.includes('marketing') || nameLower.includes('communication') || nameLower.includes('social media')) {
      category = 'Marketing & Communications';
    } else if (nameLower.includes('program') || nameLower.includes('service') || nameLower.includes('impact')) {
      category = 'Program Management';
    } else if (nameLower.includes('legal') || nameLower.includes('compliance') || nameLower.includes('policy') || nameLower.includes('bylaw')) {
      category = 'Legal & Compliance';
    } else if (nameLower.includes('leader') || nameLower.includes('ceo') || nameLower.includes('executive') || nameLower.includes('succession')) {
      category = 'Leadership Development';
    }

    // Determine type
    let type = 'Guide';
    if (nameLower.includes('checklist') || nameLower.includes('check list')) {
      type = 'Checklist';
    } else if (nameLower.includes('agreement') || nameLower.includes('contract') || nameLower.includes('mou')) {
      type = 'Agreement/Contract';
    } else if (nameLower.includes('policy') || nameLower.includes('policies')) {
      type = 'Policy';
    } else if (nameLower.includes('worksheet') || nameLower.includes('workbook')) {
      type = 'Worksheet';
    } else if (nameLower.includes('form') || nameLower.includes('application')) {
      type = 'Form';
    } else if (nameLower.includes('report') || nameLower.includes('template')) {
      type = 'Report Template';
    } else if (nameLower.includes('presentation') || nameLower.includes('slide')) {
      type = 'Presentation';
    } else if (nameLower.includes('spreadsheet') || nameLower.includes('budget') || nameLower.includes('tracker')) {
      type = 'Spreadsheet';
    } else if (nameLower.includes('letter') || nameLower.includes('email')) {
      type = 'Letter/Email Template';
    }

    // Determine tier
    let tier = 'essential';
    if (nameLower.includes('advanced') || nameLower.includes('comprehensive') || nameLower.includes('complete')) {
      tier = 'premium';
    } else if (nameLower.includes('professional') || nameLower.includes('detailed')) {
      tier = 'professional';
    }

    // Generate tags
    const tags: string[] = [];
    const tagKeywords = ['board', 'staff', 'volunteer', 'donor', 'grant', 'budget', 'strategic', 'annual', 'quarterly', 'meeting', 'retreat', 'evaluation', 'assessment', 'onboarding', 'training'];
    tagKeywords.forEach(keyword => {
      if (nameLower.includes(keyword)) tags.push(keyword);
    });

    // Clean up title
    const title = fileName
      .replace(/\.[^/.]+$/, '') // Remove extension
      .replace(/[-_]/g, ' ') // Replace dashes/underscores with spaces
      .replace(/\b\w/g, l => l.toUpperCase()); // Title case

    return {
      title,
      description: `Template for ${title.toLowerCase()}. Use this ${type.toLowerCase()} to help with your ${category.toLowerCase()} needs.`,
      category,
      type,
      tier,
      tags: tags.slice(0, 5),
      confidence: 0.7
    };
  };

  // Update template analysis
  const updateAnalysis = (id: string, field: string, value: any) => {
    setTemplates(prev => prev.map(t => {
      if (t.id === id && t.analysis) {
        return {
          ...t,
          analysis: { ...t.analysis, [field]: value }
        };
      }
      return t;
    }));
  };

  // Approve template
  const approveTemplate = (id: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'approved' as const } : t
    ));
  };

  // Reject template
  const rejectTemplate = (id: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'rejected' as const } : t
    ));
  };

  // Remove template
  const removeTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  // Approve all analyzed templates
  const approveAll = () => {
    setTemplates(prev => prev.map(t => 
      t.status === 'analyzed' ? { ...t, status: 'approved' as const } : t
    ));
  };

  // Save approved templates to Supabase
  const saveApprovedTemplates = async () => {
    const approved = templates.filter(t => t.status === 'approved' && t.analysis);
    
    if (approved.length === 0) {
      showNotification('info', 'No approved templates to save');
      return;
    }

    setIsAnalyzing(true);
    let savedCount = 0;

    for (const template of approved) {
      try {
        // Upload file to Supabase Storage
        const filePath = `templates/${template.analysis!.category}/${template.fileName}`;
        const { error: uploadError } = await supabase.storage
          .from('templates')
          .upload(filePath, template.file);

        if (uploadError && !uploadError.message.includes('already exists')) {
          throw uploadError;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('templates')
          .getPublicUrl(filePath);

        // Save metadata to database
        const { error: dbError } = await supabase
          .from('templates')
          .insert({
            title: template.analysis!.title,
            description: template.analysis!.description,
            category: template.analysis!.category,
            type: template.analysis!.type,
            tier: template.analysis!.tier,
            tags: template.analysis!.tags,
            file_url: urlData.publicUrl,
            file_name: template.fileName,
            file_size: template.fileSize,
            file_type: template.fileType
          });

        if (dbError) throw dbError;
        savedCount++;
      } catch (error) {
        console.error('Error saving template:', error);
      }
    }

    setIsAnalyzing(false);
    showNotification('success', `Saved ${savedCount} templates to the library`);
    
    // Remove saved templates from list
    setTemplates(prev => prev.filter(t => t.status !== 'approved'));
  };

  // Stats
  const stats = {
    total: templates.length,
    pending: templates.filter(t => t.status === 'pending').length,
    analyzed: templates.filter(t => t.status === 'analyzed').length,
    approved: templates.filter(t => t.status === 'approved').length,
    rejected: templates.filter(t => t.status === 'rejected').length
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif"
    }}>
      {/* Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '16px 24px',
          borderRadius: '12px',
          background: notification.type === 'success' ? '#10b981' : notification.type === 'error' ? '#ef4444' : '#0097A9',
          color: 'white',
          fontWeight: 500,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : 
           notification.type === 'error' ? <AlertCircle size={20} /> : <Sparkles size={20} />}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '24px 40px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0D2C54', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Package size={28} style={{ color: '#0097A9' }} />
                Bulk Template Uploader
              </h1>
              <p style={{ color: '#64748b', fontSize: '15px' }}>
                Upload multiple templates and let AI categorize them automatically
              </p>
            </div>
            <a href="/dashboard" style={{
              padding: '10px 20px',
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#64748b',
              textDecoration: 'none'
            }}>
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 40px' }}>
        {/* Stats Bar */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {[
            { label: 'Total', value: stats.total, color: '#64748b' },
            { label: 'Pending', value: stats.pending, color: '#f59e0b' },
            { label: 'Analyzed', value: stats.analyzed, color: '#6366f1' },
            { label: 'Approved', value: stats.approved, color: '#10b981' },
            { label: 'Rejected', value: stats.rejected, color: '#ef4444' }
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '16px 24px',
              border: '1px solid #e2e8f0',
              flex: 1
            }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Upload Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          style={{
            background: isDragging ? '#e0f2fe' : 'white',
            border: `2px dashed ${isDragging ? '#0097A9' : '#e2e8f0'}`,
            borderRadius: '16px',
            padding: '48px',
            textAlign: 'center',
            marginBottom: '24px',
            transition: 'all 0.2s'
          }}
        >
          <Upload size={48} style={{ color: isDragging ? '#0097A9' : '#94a3b8', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0D2C54', marginBottom: '8px' }}>
            Drop files here or click to upload
          </h3>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
            Supports DOCX, DOC, PDF, XLSX, XLS, PPTX, PPT, TXT
          </p>
          <label style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: '#0097A9',
            color: 'white',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            <FolderOpen size={18} />
            Browse Files
            <input
              type="file"
              multiple
              accept=".docx,.doc,.pdf,.xlsx,.xls,.pptx,.ppt,.txt"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        {/* Action Buttons */}
        {templates.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <button
              onClick={analyzeAllTemplates}
              disabled={isAnalyzing || stats.pending === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: isAnalyzing ? '#94a3b8' : '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: isAnalyzing ? 'not-allowed' : 'pointer'
              }}
            >
              {isAnalyzing ? <Loader size={18} className="animate-spin" /> : <Sparkles size={18} />}
              {isAnalyzing ? `Analyzing... ${Math.round(uploadProgress)}%` : `Analyze ${stats.pending} Templates with AI`}
            </button>

            {stats.analyzed > 0 && (
              <button
                onClick={approveAll}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Check size={18} />
                Approve All Analyzed
              </button>
            )}

            {stats.approved > 0 && (
              <button
                onClick={saveApprovedTemplates}
                disabled={isAnalyzing}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: '#0D2C54',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Save size={18} />
                Save {stats.approved} to Library
              </button>
            )}
          </div>
        )}

        {/* Template List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {templates.map(template => (
            <div
              key={template.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden'
              }}
            >
              {/* Template Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  cursor: 'pointer'
                }}
                onClick={() => setExpandedId(expandedId === template.id ? null : template.id)}
              >
                {/* File Icon */}
                <div style={{
                  width: '44px',
                  height: '44px',
                  background: '#f1f5f9',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FileText size={22} style={{ color: '#64748b' }} />
                </div>

                {/* File Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#0D2C54' }}>
                    {template.analysis?.title || template.fileName}
                  </div>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                    {template.fileType} • {formatFileSize(template.fileSize)}
                    {template.analysis && ` • ${template.analysis.category}`}
                  </div>
                </div>

                {/* Status Badge */}
                <div style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  background: 
                    template.status === 'pending' ? '#fef3c7' :
                    template.status === 'analyzing' ? '#e0e7ff' :
                    template.status === 'analyzed' ? '#ddd6fe' :
                    template.status === 'approved' ? '#d1fae5' :
                    template.status === 'rejected' ? '#fee2e2' : '#fee2e2',
                  color:
                    template.status === 'pending' ? '#92400e' :
                    template.status === 'analyzing' ? '#4338ca' :
                    template.status === 'analyzed' ? '#6d28d9' :
                    template.status === 'approved' ? '#065f46' :
                    template.status === 'rejected' ? '#991b1b' : '#991b1b'
                }}>
                  {template.status === 'analyzing' && <Loader size={12} style={{ marginRight: '6px', display: 'inline' }} />}
                  {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
                </div>

                {/* Actions */}
                {template.status === 'analyzed' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); approveTemplate(template.id); }}
                      style={{
                        padding: '8px',
                        background: '#d1fae5',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        color: '#065f46'
                      }}
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); rejectTemplate(template.id); }}
                      style={{
                        padding: '8px',
                        background: '#fee2e2',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        color: '#991b1b'
                      }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}

                <button
                  onClick={(e) => { e.stopPropagation(); removeTemplate(template.id); }}
                  style={{
                    padding: '8px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94a3b8'
                  }}
                >
                  <Trash2 size={18} />
                </button>

                {expandedId === template.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </div>

              {/* Expanded Details */}
              {expandedId === template.id && template.analysis && (
                <div style={{
                  padding: '20px',
                  borderTop: '1px solid #e2e8f0',
                  background: '#f8fafc'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {/* Title */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>
                        Title
                      </label>
                      <input
                        type="text"
                        value={template.analysis.title}
                        onChange={(e) => updateAnalysis(template.id, 'title', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>
                        Category
                      </label>
                      <select
                        value={template.analysis.category}
                        onChange={(e) => updateAnalysis(template.id, 'category', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          background: 'white'
                        }}
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Type */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>
                        Type
                      </label>
                      <select
                        value={template.analysis.type}
                        onChange={(e) => updateAnalysis(template.id, 'type', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          background: 'white'
                        }}
                      >
                        {TEMPLATE_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    {/* Tier */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>
                        Tier
                      </label>
                      <select
                        value={template.analysis.tier}
                        onChange={(e) => updateAnalysis(template.id, 'tier', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          background: 'white'
                        }}
                      >
                        {TIERS.map(tier => (
                          <option key={tier.value} value={tier.value}>{tier.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Description */}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>
                        Description
                      </label>
                      <textarea
                        value={template.analysis.description}
                        onChange={(e) => updateAnalysis(template.id, 'description', e.target.value)}
                        rows={2}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    {/* Tags */}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>
                        Tags
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {template.analysis.tags.map((tag, index) => (
                          <span
                            key={index}
                            style={{
                              padding: '6px 12px',
                              background: '#e0f2fe',
                              color: '#0369a1',
                              borderRadius: '6px',
                              fontSize: '13px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            {tag}
                            <X
                              size={14}
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                const newTags = template.analysis!.tags.filter((_, i) => i !== index);
                                updateAnalysis(template.id, 'tags', newTags);
                              }}
                            />
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Confidence */}
                    <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Zap size={16} style={{ color: '#f59e0b' }} />
                      <span style={{ fontSize: '13px', color: '#64748b' }}>
                        AI Confidence: {Math.round(template.analysis.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {templates.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            color: '#94a3b8'
          }}>
            <Package size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p>No templates uploaded yet. Drop files above to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkTemplateUploader;
