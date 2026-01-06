/**
 * THE NONPROFIT EDGE - Templates Library
 * Updated: Logo header, pagination for 100+ items, list/grid toggle
 * Location: src/components/Templates.tsx
 */

import React, { useState, useEffect, useMemo } from 'react';

const COLORS = {
  navy: '#0D2C54', navyLight: '#1a4175', teal: '#0097A9', tealDark: '#007d8c',
  white: '#ffffff', gray50: '#f8fafc', gray100: '#f1f5f9', gray200: '#e2e8f0',
  gray400: '#9ca3af', gray500: '#6b7280', gray600: '#4b5563', gray700: '#374151', gray900: '#111827',
};

const Logo = () => (
  <svg viewBox="0 0 1024 768" style={{ height: '50px', width: 'auto' }}>
    <style>{`.st0{fill:#0D2C54;}.st1{fill:#0097A9;}`}</style>
    <g><g>
      <path className="st0" d="M438.46,469.14c-18.16,14.03-40.93,22.38-65.64,22.38c-30.79,0-58.55-12.94-78.16-33.69c2.85,0.46,5.7,0.81,8.57,1.06c9.13,0.79,17.9,0.49,26.26-0.63c12.72,7.44,27.53,11.71,43.33,11.71c17.17,0,33.17-5.03,46.59-13.71C422.94,460.11,428.93,465.14,438.46,469.14z"/>
      <path className="st0" d="M294.86,420.29c-8.64,2.53-16.05,3.61-21.74,4.02c-5.05-12.44-7.82-26.05-7.82-40.31c0-59.37,48.14-107.52,107.52-107.52c25.62,0,49.15,8.96,67.62,23.94c-9.33,2.92-16.19,7.85-20.47,11.69c-13.54-8.9-29.74-14.08-47.15-14.08c-47.48,0-85.97,38.49-85.97,85.97C286.85,396.97,289.72,409.27,294.86,420.29z"/>
      <path className="st1" d="M258.67,434.74c0,0,61.28,14.58,121.38-60.61l-18.3-13.11l72.86-22.42l0.39,71.06l-18.78-13.01C416.22,396.64,340.29,479.82,258.67,434.74z"/>
    </g></g>
  </svg>
);

const CATEGORIES = [
  { id: 'all', name: 'All', icon: '📁' },
  { id: 'governance', name: 'Board & Governance', icon: '👥' },
  { id: 'strategic', name: 'Strategic Planning', icon: '📋' },
  { id: 'financial', name: 'Financial', icon: '💰' },
  { id: 'hr', name: 'HR & Personnel', icon: '👔' },
  { id: 'fundraising', name: 'Fundraising', icon: '🎯' },
  { id: 'programs', name: 'Programs', icon: '📊' },
];

const SAMPLE_TEMPLATES = [
  { id: '1', title: 'Board Self-Assessment Survey', description: 'Comprehensive annual evaluation for board members.', category: 'governance', format: 'DOCX', pages: 8, downloads: 1247 },
  { id: '2', title: 'Strategic Plan Template', description: '3-year strategic planning framework.', category: 'strategic', format: 'DOCX', pages: 15, downloads: 2341 },
  { id: '3', title: 'Board Meeting Agenda', description: 'Structured agenda for productive meetings.', category: 'governance', format: 'DOCX', pages: 2, downloads: 892 },
  { id: '4', title: 'Annual Budget Template', description: 'Comprehensive nonprofit budget.', category: 'financial', format: 'XLSX', pages: 5, downloads: 1834 },
  { id: '5', title: 'CEO Evaluation Form', description: 'Structured executive evaluation.', category: 'hr', format: 'DOCX', pages: 6, downloads: 743 },
  { id: '6', title: 'Grant Proposal Template', description: 'Standard format for foundations.', category: 'fundraising', format: 'DOCX', pages: 12, downloads: 1567 },
  { id: '7', title: 'Board Member Job Description', description: 'Clear expectations for board.', category: 'governance', format: 'DOCX', pages: 3, downloads: 654 },
  { id: '8', title: 'Program Logic Model', description: 'Framework for program outcomes.', category: 'programs', format: 'PPTX', pages: 4, downloads: 923 },
  { id: '9', title: 'Donor Acknowledgment Letter', description: 'IRS-compliant thank-you letter.', category: 'fundraising', format: 'DOCX', pages: 1, downloads: 1123 },
  { id: '10', title: 'Cash Flow Projection', description: '12-month projection spreadsheet.', category: 'financial', format: 'XLSX', pages: 3, downloads: 876 },
  { id: '11', title: 'Conflict of Interest Policy', description: 'Sample policy and disclosure form.', category: 'governance', format: 'DOCX', pages: 4, downloads: 567 },
  { id: '12', title: 'SWOT Analysis Worksheet', description: 'Strategic analysis template.', category: 'strategic', format: 'DOCX', pages: 2, downloads: 1456 },
];

const ITEMS_PER_PAGE = 24;

interface Template { id: string; title: string; description: string; category: string; format: string; pages: number; downloads: number; file_url?: string; }
interface TemplatesProps { user?: any; organization?: any; supabase?: any; navigate?: (path: string) => void; }

const Templates: React.FC<TemplatesProps> = ({ user, organization, supabase, navigate }) => {
  const [templates, setTemplates] = useState<Template[]>(SAMPLE_TEMPLATES);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'title' | 'downloads'>('downloads');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!supabase) return;
      try {
        const { data } = await supabase.from('templates').select('*').eq('is_active', true).order('downloads', { ascending: false });
        if (data?.length) setTemplates(data);
      } catch (err) { console.log('Using sample templates'); }
    };
    fetchTemplates();
  }, [supabase]);

  const filteredTemplates = useMemo(() => {
    let result = templates.filter(t => {
      const matchCat = selectedCategory === 'all' || t.category === selectedCategory;
      const matchSearch = !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
    return sortBy === 'title' ? result.sort((a, b) => a.title.localeCompare(b.title)) : result.sort((a, b) => b.downloads - a.downloads);
  }, [templates, selectedCategory, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredTemplates.length / ITEMS_PER_PAGE);
  const paginatedTemplates = filteredTemplates.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [selectedCategory, searchQuery, sortBy]);

  const handleBack = () => navigate ? navigate('/dashboard') : window.location.href = '/dashboard';
  
  const handleDownload = async (template: Template) => {
    if (supabase && organization?.id) {
      try {
        await supabase.rpc('increment_downloads', { org_id: organization.id });
        await supabase.from('activity_log').insert({ organization_id: organization.id, user_id: user?.id, type: 'download', description: `Downloaded ${template.title}` });
      } catch (err) { console.error(err); }
    }
    if (template.file_url) window.open(template.file_url, '_blank');
    else alert(`Downloading: ${template.title}`);
  };

  const getFormatColor = (f: string) => ({ DOCX: { bg: '#dbeafe', text: '#1e40af' }, XLSX: { bg: '#dcfce7', text: '#166534' }, PPTX: { bg: '#fef3c7', text: '#b45309' }, PDF: { bg: '#fee2e2', text: '#b91c1c' } }[f] || { bg: COLORS.gray100, text: COLORS.gray600 });

  return (
    <div style={{ minHeight: '100vh', background: COLORS.gray50, fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: COLORS.white, borderBottom: `1px solid ${COLORS.gray200}`, padding: '20px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <button onClick={handleBack} style={{ padding: '8px 16px', fontSize: '14px', fontWeight: 500, color: COLORS.teal, background: 'transparent', border: 'none', cursor: 'pointer' }}>← Back to Dashboard</button>
          <Logo />
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: COLORS.navy, marginBottom: '4px' }}>Template Library</h1>
        <p style={{ fontSize: '15px', color: COLORS.gray500 }}>{filteredTemplates.length} professional templates for nonprofit operations</p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 48px', background: COLORS.white, borderBottom: `1px solid ${COLORS.gray200}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: COLORS.gray50, borderRadius: '8px', padding: '10px 14px', width: '300px' }}>
          <span style={{ opacity: 0.5 }}>🔍</span>
          <input type="text" placeholder="Search templates..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '14px', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} style={{ padding: '10px 14px', fontSize: '14px', border: `1px solid ${COLORS.gray200}`, borderRadius: '8px', cursor: 'pointer' }}>
            <option value="downloads">Most Popular</option>
            <option value="title">Alphabetical</option>
          </select>
          <div style={{ display: 'flex', border: `1px solid ${COLORS.gray200}`, borderRadius: '8px', overflow: 'hidden' }}>
            <button onClick={() => setViewMode('grid')} style={{ padding: '10px 14px', fontSize: '16px', background: viewMode === 'grid' ? COLORS.navy : COLORS.white, color: viewMode === 'grid' ? COLORS.white : COLORS.gray500, border: 'none', cursor: 'pointer' }}>▦</button>
            <button onClick={() => setViewMode('list')} style={{ padding: '10px 14px', fontSize: '16px', background: viewMode === 'list' ? COLORS.navy : COLORS.white, color: viewMode === 'list' ? COLORS.white : COLORS.gray500, border: 'none', cursor: 'pointer' }}>☰</button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', gap: '8px', padding: '16px 48px', background: COLORS.gray50, borderBottom: `1px solid ${COLORS.gray200}`, flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '13px', fontWeight: 500, borderRadius: '20px', cursor: 'pointer',
            background: selectedCategory === cat.id ? COLORS.teal : COLORS.white, color: selectedCategory === cat.id ? COLORS.white : COLORS.gray600,
            border: `1px solid ${selectedCategory === cat.id ? COLORS.teal : COLORS.gray200}`
          }}>
            <span>{cat.icon}</span> {cat.name}
          </button>
        ))}
      </div>

      {/* Templates Grid/List */}
      {viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', padding: '24px 48px' }}>
          {paginatedTemplates.map(t => {
            const fc = getFormatColor(t.format);
            return (
              <div key={t.id} style={{ background: COLORS.white, borderRadius: '12px', padding: '20px', border: `1px solid ${COLORS.gray200}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: fc.bg, color: fc.text }}>{t.format}</span>
                  <span style={{ fontSize: '12px', color: COLORS.gray400 }}>{t.downloads.toLocaleString()} downloads</span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: COLORS.navy, marginBottom: '8px' }}>{t.title}</h3>
                <p style={{ fontSize: '13px', color: COLORS.gray600, marginBottom: '16px' }}>{t.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: `1px solid ${COLORS.gray100}` }}>
                  <span style={{ fontSize: '12px', color: COLORS.gray500 }}>{t.pages} pages</span>
                  <button onClick={() => handleDownload(t)} style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 600, color: COLORS.white, background: COLORS.teal, border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Download</button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: '24px 48px' }}>
          {paginatedTemplates.map(t => {
            const fc = getFormatColor(t.format);
            return (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: COLORS.white, borderRadius: '10px', marginBottom: '8px', border: `1px solid ${COLORS.gray200}` }}>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: fc.bg, color: fc.text }}>{t.format}</span>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: COLORS.navy }}>{t.title}</h3>
                  <p style={{ fontSize: '13px', color: COLORS.gray500 }}>{t.description}</p>
                </div>
                <span style={{ fontSize: '13px', color: COLORS.gray500, minWidth: '80px' }}>{t.pages} pages</span>
                <span style={{ fontSize: '13px', color: COLORS.gray500, minWidth: '100px' }}>{t.downloads.toLocaleString()} downloads</span>
                <button onClick={() => handleDownload(t)} style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 600, color: COLORS.white, background: COLORS.teal, border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Download</button>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', padding: '24px 48px 40px' }}>
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: '10px 20px', fontSize: '14px', fontWeight: 500, color: COLORS.gray600, background: COLORS.white, border: `1px solid ${COLORS.gray200}`, borderRadius: '8px', cursor: 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}>← Previous</button>
          <div style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setCurrentPage(p)} style={{ width: '40px', height: '40px', fontSize: '14px', fontWeight: 500, borderRadius: '8px', cursor: 'pointer', background: currentPage === p ? COLORS.navy : COLORS.white, color: currentPage === p ? COLORS.white : COLORS.gray600, border: `1px solid ${currentPage === p ? COLORS.navy : COLORS.gray200}` }}>{p}</button>
            ))}
          </div>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: '10px 20px', fontSize: '14px', fontWeight: 500, color: COLORS.gray600, background: COLORS.white, border: `1px solid ${COLORS.gray200}`, borderRadius: '8px', cursor: 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}>Next →</button>
        </div>
      )}

      {paginatedTemplates.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 40px' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>📭</span>
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: COLORS.navy, marginBottom: '8px' }}>No templates found</h3>
          <p style={{ fontSize: '15px', color: COLORS.gray500 }}>Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Templates;
