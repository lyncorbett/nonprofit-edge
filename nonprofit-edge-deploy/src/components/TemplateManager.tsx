import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Upload, X, FileText, File, Table, Presentation,
  Plus, Trash2, Edit, Eye, Download, Search, Filter,
  ChevronDown, Check, AlertCircle
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  file_path: string;
  file_name: string;
  file_type: string;
  file_size: number;
  tier_required: string;
  download_count: number;
  tags: string[];
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const TIERS = [
  { value: 'essential', label: 'Essential', color: '#64748b' },
  { value: 'professional', label: 'Professional', color: '#0097A9' },
  { value: 'premium', label: 'Premium', color: '#D4A84B' },
];

const FILE_ICONS: Record<string, React.ReactNode> = {
  'docx': <FileText size={20} color="#2563eb" />,
  'doc': <FileText size={20} color="#2563eb" />,
  'pdf': <File size={20} color="#dc2626" />,
  'xlsx': <Table size={20} color="#16a34a" />,
  'xls': <Table size={20} color="#16a34a" />,
  'pptx': <Presentation size={20} color="#ea580c" />,
  'ppt': <Presentation size={20} color="#ea580c" />,
};

const TemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterTier, setFilterTier] = useState('all');

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    tier_required: 'essential',
    tags: '',
    is_featured: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Fetch templates and categories
  useEffect(() => {
    fetchTemplates();
    fetchCategories();
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching templates:', error);
    } else {
      setTemplates(data || []);
    }
    setIsLoading(false);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('template_categories')
      .select('*')
      .order('sort_order');
    
    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data || []);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-fill name from filename if empty
      if (!uploadForm.name) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setUploadForm(prev => ({ ...prev, name: nameWithoutExt }));
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadForm.name || !uploadForm.category) {
      setUploadError('Please fill in all required fields and select a file.');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      // 1. Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase() || '';
      const fileName = `${Date.now()}-${selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `${uploadForm.category.toLowerCase().replace(/\s+/g, '-')}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('templates')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // 2. Create template record in database
      const { error: dbError } = await supabase
        .from('templates')
        .insert({
          name: uploadForm.name,
          description: uploadForm.description,
          category: uploadForm.category,
          subcategory: uploadForm.subcategory,
          file_path: filePath,
          file_name: selectedFile.name,
          file_type: fileExt,
          file_size: selectedFile.size,
          tier_required: uploadForm.tier_required,
          tags: uploadForm.tags.split(',').map(t => t.trim()).filter(t => t),
          is_featured: uploadForm.is_featured,
        });

      if (dbError) throw dbError;

      // 3. Reset form and refresh list
      setShowUploadModal(false);
      setSelectedFile(null);
      setUploadForm({
        name: '',
        description: '',
        category: '',
        subcategory: '',
        tier_required: 'essential',
        tags: '',
        is_featured: false,
      });
      fetchTemplates();
      alert('Template uploaded successfully!');

    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Failed to upload template');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (template: Template) => {
    if (!confirm(`Are you sure you want to delete "${template.name}"?`)) return;

    try {
      // Delete from storage
      await supabase.storage.from('templates').remove([template.file_path]);
      
      // Delete from database
      await supabase.from('templates').delete().eq('id', template.id);
      
      fetchTemplates();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete template');
    }
  };

  const handleToggleActive = async (template: Template) => {
    await supabase
      .from('templates')
      .update({ is_active: !template.is_active })
      .eq('id', template.id);
    fetchTemplates();
  };

  const handleToggleFeatured = async (template: Template) => {
    await supabase
      .from('templates')
      .update({ is_featured: !template.is_featured })
      .eq('id', template.id);
    fetchTemplates();
  };

  const getDownloadUrl = (filePath: string) => {
    const { data } = supabase.storage.from('templates').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Filter templates
  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
    const matchesTier = filterTier === 'all' || t.tier_required === filterTier;
    return matchesSearch && matchesCategory && matchesTier;
  });

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc', 
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
      padding: '32px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0D2C54', margin: 0 }}>
              Template Manager
            </h1>
            <p style={{ color: '#64748b', marginTop: '4px' }}>
              Upload and manage templates for the Template Vault
            </p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #0097A9 0%, #00b4cc 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Plus size={20} />
            Upload Template
          </button>
        </div>

        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '20px',
          marginBottom: '32px'
        }}>
          <StatCard label="Total Templates" value={templates.length} color="#0D2C54" />
          <StatCard label="Active" value={templates.filter(t => t.is_active).length} color="#10b981" />
          <StatCard label="Featured" value={templates.filter(t => t.is_featured).length} color="#D4A84B" />
          <StatCard label="Total Downloads" value={templates.reduce((acc, t) => acc + t.download_count, 0)} color="#0097A9" />
        </div>

        {/* Filters */}
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          marginBottom: '24px',
          background: 'white',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 10px 10px 40px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              minWidth: '180px',
            }}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              minWidth: '150px',
            }}
          >
            <option value="all">All Tiers</option>
            {TIERS.map(tier => (
              <option key={tier.value} value={tier.value}>{tier.label}</option>
            ))}
          </select>
        </div>

        {/* Templates Table */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Template</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Category</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Tier</th>
                <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Downloads</th>
                <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTemplates.map((template) => (
                <tr key={template.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {FILE_ICONS[template.file_type] || <File size={20} />}
                      <div>
                        <div style={{ fontWeight: 600, color: '#0D2C54', marginBottom: '2px' }}>
                          {template.name}
                          {template.is_featured && (
                            <span style={{ 
                              marginLeft: '8px', 
                              background: '#FEF3C7', 
                              color: '#D97706',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: 600,
                            }}>
                              FEATURED
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                          {template.file_name} • {formatFileSize(template.file_size)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: '#475569', fontSize: '14px' }}>
                    {template.category}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: TIERS.find(t => t.value === template.tier_required)?.color + '15',
                      color: TIERS.find(t => t.value === template.tier_required)?.color,
                    }}>
                      {TIERS.find(t => t.value === template.tier_required)?.label}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center', color: '#475569' }}>
                    {template.download_count}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: template.is_active ? '#D1FAE5' : '#FEE2E2',
                      color: template.is_active ? '#059669' : '#DC2626',
                    }}>
                      {template.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => window.open(getDownloadUrl(template.file_path), '_blank')}
                        style={{ padding: '6px', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        title="Download"
                      >
                        <Download size={16} color="#64748b" />
                      </button>
                      <button
                        onClick={() => handleToggleFeatured(template)}
                        style={{ 
                          padding: '6px', 
                          background: template.is_featured ? '#FEF3C7' : '#f1f5f9', 
                          border: 'none', 
                          borderRadius: '6px', 
                          cursor: 'pointer' 
                        }}
                        title={template.is_featured ? 'Remove from featured' : 'Add to featured'}
                      >
                        <span style={{ fontSize: '14px' }}>⭐</span>
                      </button>
                      <button
                        onClick={() => handleToggleActive(template)}
                        style={{ 
                          padding: '6px', 
                          background: template.is_active ? '#D1FAE5' : '#FEE2E2', 
                          border: 'none', 
                          borderRadius: '6px', 
                          cursor: 'pointer' 
                        }}
                        title={template.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {template.is_active ? <Eye size={16} color="#059669" /> : <Eye size={16} color="#DC2626" />}
                      </button>
                      <button
                        onClick={() => handleDelete(template)}
                        style={{ padding: '6px', background: '#FEE2E2', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        title="Delete"
                      >
                        <Trash2 size={16} color="#DC2626" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTemplates.length === 0 && (
            <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
              {isLoading ? 'Loading templates...' : 'No templates found'}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '20px 24px',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0D2C54', margin: 0 }}>
                Upload New Template
              </h2>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={24} color="#64748b" />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              {uploadError && (
                <div style={{
                  background: '#FEE2E2',
                  color: '#DC2626',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <AlertCircle size={18} />
                  {uploadError}
                </div>
              )}

              {/* File Upload */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#0D2C54', marginBottom: '8px' }}>
                  File *
                </label>
                <div
                  style={{
                    border: '2px dashed #e2e8f0',
                    borderRadius: '12px',
                    padding: '32px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: selectedFile ? '#f0fdfa' : 'white',
                  }}
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    accept=".doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  {selectedFile ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                      {FILE_ICONS[selectedFile.name.split('.').pop()?.toLowerCase() || ''] || <File size={24} />}
                      <div>
                        <div style={{ fontWeight: 600, color: '#0D2C54' }}>{selectedFile.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{formatFileSize(selectedFile.size)}</div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                        style={{ marginLeft: '8px', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <X size={18} color="#DC2626" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={32} color="#94a3b8" style={{ marginBottom: '12px' }} />
                      <div style={{ color: '#64748b', marginBottom: '4px' }}>
                        Click to upload or drag and drop
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                        DOC, DOCX, PDF, XLS, XLSX, PPT, PPTX
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Name */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#0D2C54', marginBottom: '8px' }}>
                  Template Name *
                </label>
                <input
                  type="text"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Board Member Agreement"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                  }}
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#0D2C54', marginBottom: '8px' }}>
                  Description
                </label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of what this template is for..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Category & Tier */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#0D2C54', marginBottom: '8px' }}>
                    Category *
                  </label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                    }}
                  >
                    <option value="">Select category...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#0D2C54', marginBottom: '8px' }}>
                    Required Tier *
                  </label>
                  <select
                    value={uploadForm.tier_required}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, tier_required: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                    }}
                  >
                    {TIERS.map(tier => (
                      <option key={tier.value} value={tier.value}>{tier.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#0D2C54', marginBottom: '8px' }}>
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="e.g., board, agreement, onboarding"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                  }}
                />
              </div>

              {/* Featured */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  cursor: 'pointer' 
                }}>
                  <input
                    type="checkbox"
                    checked={uploadForm.is_featured}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{ fontSize: '14px', color: '#0D2C54' }}>
                    ⭐ Feature this template (shows at top of list)
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowUploadModal(false)}
                  style={{
                    padding: '12px 24px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    background: 'white',
                    color: '#64748b',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    background: isUploading ? '#94a3b8' : 'linear-gradient(135deg, #0097A9 0%, #00b4cc 100%)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: isUploading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  {isUploading ? 'Uploading...' : (
                    <>
                      <Upload size={18} />
                      Upload Template
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Stat Card Component
const StatCard: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div style={{
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #e2e8f0',
  }}>
    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}>
      {label}
    </div>
    <div style={{ fontSize: '28px', fontWeight: 700, color }}>
      {value.toLocaleString()}
    </div>
  </div>
);

export default TemplateManager;
