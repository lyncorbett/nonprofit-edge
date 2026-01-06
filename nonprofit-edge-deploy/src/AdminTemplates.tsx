/**
 * THE NONPROFIT EDGE - Admin Templates Manager
 * For owners/admins to upload and manage templates
 * Location: src/components/AdminTemplates.tsx
 */

import React, { useState, useEffect } from 'react';

const COLORS = {
  navy: '#0D2C54', navyLight: '#1a4175', teal: '#0097A9', tealDark: '#007d8c',
  white: '#ffffff', gray50: '#f8fafc', gray100: '#f1f5f9', gray200: '#e2e8f0',
  gray400: '#9ca3af', gray500: '#6b7280', gray600: '#4b5563', gray700: '#374151', gray900: '#111827',
  red500: '#ef4444', green500: '#22c55e',
};

const CATEGORIES = [
  { id: 'governance', name: 'Board & Governance' },
  { id: 'strategic', name: 'Strategic Planning' },
  { id: 'financial', name: 'Financial' },
  { id: 'hr', name: 'HR & Personnel' },
  { id: 'fundraising', name: 'Fundraising' },
  { id: 'programs', name: 'Programs' },
  { id: 'operations', name: 'Operations' },
  { id: 'communications', name: 'Communications' },
];

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  format: string;
  pages: number;
  downloads: number;
  file_url: string;
  is_active: boolean;
  created_at: string;
}

interface AdminTemplatesProps {
  user?: any;
  supabase?: any;
  navigate?: (path: string) => void;
}

const AdminTemplates: React.FC<AdminTemplatesProps> = ({ user, supabase, navigate }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'governance',
    format: 'DOCX',
    pages: 1,
    file: null as File | null,
  });

  // Fetch templates
  useEffect(() => {
    const fetchTemplates = async () => {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from('templates')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setTemplates(data || []);
      } catch (err) {
        console.error('Fetch error:', err);
        setMessage({ type: 'error', text: 'Failed to load templates' });
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, [supabase]);

  const handleBack = () => navigate ? navigate('/admin') : window.location.href = '/admin';

  const openAddModal = () => {
    setEditingTemplate(null);
    setFormData({ title: '', description: '', category: 'governance', format: 'DOCX', pages: 1, file: null });
    setShowModal(true);
  };

  const openEditModal = (template: Template) => {
    setEditingTemplate(template);
    setFormData({
      title: template.title,
      description: template.description,
      category: template.category,
      format: template.format,
      pages: template.pages,
      file: null,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setUploading(true);

    try {
      let fileUrl = editingTemplate?.file_url || '';

      // Upload file if provided
      if (formData.file) {
        const fileName = `${Date.now()}-${formData.file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('templates')
          .upload(fileName, formData.file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('templates').getPublicUrl(fileName);
        fileUrl = urlData.publicUrl;
      }

      if (editingTemplate) {
        // Update existing
        const { error } = await supabase
          .from('templates')
          .update({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            format: formData.format,
            pages: formData.pages,
            file_url: fileUrl,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingTemplate.id);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Template updated successfully' });
      } else {
        // Create new
        const { error } = await supabase.from('templates').insert({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          format: formData.format,
          pages: formData.pages,
          file_url: fileUrl,
          downloads: 0,
          is_active: true,
        });

        if (error) throw error;
        setMessage({ type: 'success', text: 'Template added successfully' });
      }

      // Refresh list
      const { data } = await supabase.from('templates').select('*').order('created_at', { ascending: false });
      setTemplates(data || []);
      setShowModal(false);
    } catch (err: any) {
      console.error('Submit error:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to save template' });
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = async (template: Template) => {
    if (!supabase) return;
    try {
      await supabase.from('templates').update({ is_active: !template.is_active }).eq('id', template.id);
      setTemplates(templates.map(t => t.id === template.id ? { ...t, is_active: !t.is_active } : t));
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update status' });
    }
  };

  const deleteTemplate = async (template: Template) => {
    if (!supabase || !confirm(`Delete "${template.title}"?`)) return;
    try {
      await supabase.from('templates').delete().eq('id', template.id);
      setTemplates(templates.filter(t => t.id !== template.id));
      setMessage({ type: 'success', text: 'Template deleted' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete template' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.gray50, fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: COLORS.white, borderBottom: `1px solid ${COLORS.gray200}`, padding: '24px 48px' }}>
        <button onClick={handleBack} style={{ padding: '8px 16px', fontSize: '14px', fontWeight: 500, color: COLORS.teal, background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: '16px' }}>← Back to Admin</button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: COLORS.navy, marginBottom: '4px' }}>Template Manager</h1>
            <p style={{ fontSize: '15px', color: COLORS.gray500 }}>Upload and manage templates for members</p>
          </div>
          <button onClick={openAddModal} style={{ padding: '12px 24px', fontSize: '15px', fontWeight: 600, color: COLORS.white, background: COLORS.teal, border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            + Add Template
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div style={{ margin: '20px 48px', padding: '12px 20px', borderRadius: '8px', background: message.type === 'success' ? '#dcfce7' : '#fee2e2', color: message.type === 'success' ? '#166534' : '#b91c1c', fontSize: '14px' }}>
          {message.text}
          <button onClick={() => setMessage(null)} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>×</button>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'flex', gap: '20px', padding: '24px 48px' }}>
        <div style={{ background: COLORS.white, borderRadius: '12px', padding: '20px 24px', border: `1px solid ${COLORS.gray200}`, minWidth: '150px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 700, color: COLORS.navy }}>{templates.length}</div>
          <div style={{ fontSize: '13px', color: COLORS.gray500 }}>Total Templates</div>
        </div>
        <div style={{ background: COLORS.white, borderRadius: '12px', padding: '20px 24px', border: `1px solid ${COLORS.gray200}`, minWidth: '150px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 700, color: COLORS.green500 }}>{templates.filter(t => t.is_active).length}</div>
          <div style={{ fontSize: '13px', color: COLORS.gray500 }}>Active</div>
        </div>
        <div style={{ background: COLORS.white, borderRadius: '12px', padding: '20px 24px', border: `1px solid ${COLORS.gray200}`, minWidth: '150px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 700, color: COLORS.teal }}>{templates.reduce((sum, t) => sum + t.downloads, 0).toLocaleString()}</div>
          <div style={{ fontSize: '13px', color: COLORS.gray500 }}>Total Downloads</div>
        </div>
      </div>

      {/* Templates Table */}
      <div style={{ padding: '0 48px 48px' }}>
        <div style={{ background: COLORS.white, borderRadius: '12px', border: `1px solid ${COLORS.gray200}`, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: COLORS.gray50, borderBottom: `1px solid ${COLORS.gray200}` }}>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase' }}>Template</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase' }}>Category</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '12px', fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase' }}>Format</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '12px', fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase' }}>Downloads</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '12px', fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '12px', fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: COLORS.gray500 }}>Loading templates...</td></tr>
              ) : templates.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: COLORS.gray500 }}>No templates yet. Click "Add Template" to get started.</td></tr>
              ) : templates.map((template, i) => (
                <tr key={template.id} style={{ borderBottom: i < templates.length - 1 ? `1px solid ${COLORS.gray100}` : 'none' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: COLORS.navy }}>{template.title}</div>
                    <div style={{ fontSize: '13px', color: COLORS.gray500, marginTop: '2px' }}>{template.description.slice(0, 60)}...</div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: COLORS.gray600 }}>{CATEGORIES.find(c => c.id === template.category)?.name || template.category}</td>
                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: COLORS.gray100, color: COLORS.gray600 }}>{template.format}</span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: COLORS.gray700 }}>{template.downloads.toLocaleString()}</td>
                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                    <button onClick={() => toggleActive(template)} style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 600, borderRadius: '12px', border: 'none', cursor: 'pointer', background: template.is_active ? '#dcfce7' : COLORS.gray100, color: template.is_active ? '#166534' : COLORS.gray500 }}>
                      {template.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                    <button onClick={() => openEditModal(template)} style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 500, color: COLORS.teal, background: 'transparent', border: `1px solid ${COLORS.teal}`, borderRadius: '6px', cursor: 'pointer', marginRight: '8px' }}>Edit</button>
                    <button onClick={() => deleteTemplate(template)} style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 500, color: COLORS.red500, background: 'transparent', border: `1px solid ${COLORS.red500}`, borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 }} onClick={() => setShowModal(false)} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: COLORS.white, borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '500px', zIndex: 1001 }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: COLORS.navy, marginBottom: '24px' }}>{editingTemplate ? 'Edit Template' : 'Add New Template'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: COLORS.gray700, marginBottom: '6px' }}>Title *</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '10px 14px', fontSize: '14px', border: `1px solid ${COLORS.gray200}`, borderRadius: '8px' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: COLORS.gray700, marginBottom: '6px' }}>Description *</label>
                <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} style={{ width: '100%', padding: '10px 14px', fontSize: '14px', border: `1px solid ${COLORS.gray200}`, borderRadius: '8px', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: COLORS.gray700, marginBottom: '6px' }}>Category *</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '10px 14px', fontSize: '14px', border: `1px solid ${COLORS.gray200}`, borderRadius: '8px' }}>
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: COLORS.gray700, marginBottom: '6px' }}>Format *</label>
                  <select value={formData.format} onChange={(e) => setFormData({ ...formData, format: e.target.value })} style={{ width: '100%', padding: '10px 14px', fontSize: '14px', border: `1px solid ${COLORS.gray200}`, borderRadius: '8px' }}>
                    <option value="DOCX">DOCX</option>
                    <option value="XLSX">XLSX</option>
                    <option value="PPTX">PPTX</option>
                    <option value="PDF">PDF</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: COLORS.gray700, marginBottom: '6px' }}>Pages</label>
                <input type="number" min="1" value={formData.pages} onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) || 1 })} style={{ width: '100px', padding: '10px 14px', fontSize: '14px', border: `1px solid ${COLORS.gray200}`, borderRadius: '8px' }} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: COLORS.gray700, marginBottom: '6px' }}>File {!editingTemplate && '*'}</label>
                <input type="file" accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf" onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })} style={{ fontSize: '14px' }} required={!editingTemplate} />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '12px 24px', fontSize: '14px', fontWeight: 500, color: COLORS.gray600, background: COLORS.gray100, border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={uploading} style={{ padding: '12px 24px', fontSize: '14px', fontWeight: 600, color: COLORS.white, background: uploading ? COLORS.gray400 : COLORS.teal, border: 'none', borderRadius: '8px', cursor: uploading ? 'not-allowed' : 'pointer' }}>
                  {uploading ? 'Uploading...' : editingTemplate ? 'Save Changes' : 'Add Template'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminTemplates;
