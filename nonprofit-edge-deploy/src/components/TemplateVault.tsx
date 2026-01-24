import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Search, Filter, Download, FileText, File, Table, Presentation,
  Lock, ChevronDown, X, Star, FolderOpen, Grid, List,
  Users, Target, Heart, Briefcase, DollarSign, Megaphone, BarChart, Shield
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  file_path: string;
  file_name: string;
  file_type: string;
  file_size: number;
  tier_required: string;
  download_count: number;
  tags: string[];
  is_featured: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const FILE_ICONS: Record<string, React.ReactNode> = {
  'docx': <FileText size={24} color="#2563eb" />,
  'doc': <FileText size={24} color="#2563eb" />,
  'pdf': <File size={24} color="#dc2626" />,
  'xlsx': <Table size={24} color="#16a34a" />,
  'xls': <Table size={24} color="#16a34a" />,
  'pptx': <Presentation size={24} color="#ea580c" />,
  'ppt': <Presentation size={24} color="#ea580c" />,
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Board Governance': <Users size={20} />,
  'Strategic Planning': <Target size={20} />,
  'Fundraising': <Heart size={20} />,
  'HR & Operations': <Briefcase size={20} />,
  'Financial Management': <DollarSign size={20} />,
  'Marketing & Communications': <Megaphone size={20} />,
  'Programs & Impact': <BarChart size={20} />,
  'Compliance & Legal': <Shield size={20} />,
};

const TIERS = {
  essential: { label: 'Essential', color: '#64748b', order: 1 },
  professional: { label: 'Professional', color: '#0097A9', order: 2 },
  premium: { label: 'Premium', color: '#D4A84B', order: 3 },
};

interface TemplateVaultProps {
  userTier?: 'essential' | 'professional' | 'premium';
  onNavigate?: (page: string) => void;
}

const TemplateVault: React.FC<TemplateVaultProps> = ({ 
  userTier = 'professional',
  onNavigate 
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFileType, setSelectedFileType] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchTemplates();
    fetchCategories();
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('download_count', { ascending: false });
    
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
      .eq('is_active', true)
      .order('sort_order');
    
    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data || []);
    }
  };

  const canDownload = (template: Template): boolean => {
    const userTierOrder = TIERS[userTier]?.order || 1;
    const requiredTierOrder = TIERS[template.tier_required as keyof typeof TIERS]?.order || 1;
    return userTierOrder >= requiredTierOrder;
  };

  const handleDownload = async (template: Template) => {
    if (!canDownload(template)) {
      alert(`This template requires a ${TIERS[template.tier_required as keyof typeof TIERS]?.label} subscription or higher.`);
      return;
    }

    try {
      // Track download
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('template_downloads').insert({
          template_id: template.id,
          user_id: user.id,
        });
        
        // Increment download count
        await supabase.rpc('increment_download_count', { template_uuid: template.id });
      }

      // Get download URL and open
      const { data } = supabase.storage.from('templates').getPublicUrl(template.file_path);
      window.open(data.publicUrl, '_blank');
      
      // Refresh to show updated count
      fetchTemplates();
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download template. Please try again.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Filter templates
  const filteredTemplates = templates.filter(t => {
    const matchesSearch = !searchQuery || 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || t.category === selectedCategory;
    const matchesFileType = !selectedFileType || t.file_type === selectedFileType;
    return matchesSearch && matchesCategory && matchesFileType;
  });

  // Get featured templates
  const featuredTemplates = filteredTemplates.filter(t => t.is_featured);
  const regularTemplates = filteredTemplates.filter(t => !t.is_featured);

  // Get unique file types
  const fileTypes = [...new Set(templates.map(t => t.file_type))];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc', 
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0D2C54 0%, #1a4175 100%)',
        padding: '48px 32px',
        color: 'white',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <FolderOpen size={32} />
            <h1 style={{ fontSize: '32px', fontWeight: 700, margin: 0 }}>Template Vault</h1>
          </div>
          <p style={{ fontSize: '16px', opacity: 0.8, marginBottom: '24px' }}>
            Professional templates to power your nonprofit's success
          </p>

          {/* Search Bar */}
          <div style={{ 
            display: 'flex', 
            gap: '12px',
            maxWidth: '700px'
          }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={20} style={{ 
                position: 'absolute', 
                left: '16px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#94a3b8' 
              }} />
              <input
                type="text"
                placeholder="Search templates by name, description, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 48px',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '15px',
                  background: 'white',
                }}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 20px',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '12px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              <Filter size={18} />
              Filters
              {(selectedCategory || selectedFileType) && (
                <span style={{
                  background: '#0097A9',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                }}>
                  {(selectedCategory ? 1 : 0) + (selectedFileType ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div style={{
          background: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '20px 32px',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>
                Category
              </label>
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                style={{
                  padding: '10px 16px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  minWidth: '200px',
                }}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>
                File Type
              </label>
              <select
                value={selectedFileType || ''}
                onChange={(e) => setSelectedFileType(e.target.value || null)}
                style={{
                  padding: '10px 16px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  minWidth: '150px',
                }}
              >
                <option value="">All Types</option>
                {fileTypes.map(type => (
                  <option key={type} value={type}>{type.toUpperCase()}</option>
                ))}
              </select>
            </div>
            {(selectedCategory || selectedFileType) && (
              <button
                onClick={() => { setSelectedCategory(null); setSelectedFileType(null); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#64748b',
                  cursor: 'pointer',
                  alignSelf: 'flex-end',
                }}
              >
                <X size={16} />
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
        {/* Category Pills */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '32px',
          overflowX: 'auto',
          paddingBottom: '8px',
        }}>
          <button
            onClick={() => setSelectedCategory(null)}
            style={{
              padding: '10px 20px',
              borderRadius: '24px',
              border: 'none',
              background: !selectedCategory ? '#0D2C54' : '#f1f5f9',
              color: !selectedCategory ? 'white' : '#64748b',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            All Templates
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '24px',
                border: 'none',
                background: selectedCategory === cat.name ? '#0D2C54' : '#f1f5f9',
                color: selectedCategory === cat.name ? 'white' : '#64748b',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {CATEGORY_ICONS[cat.name]}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px' 
        }}>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'grid' ? '#0D2C54' : '#f1f5f9',
                color: viewMode === 'grid' ? 'white' : '#64748b',
                cursor: 'pointer',
              }}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'list' ? '#0D2C54' : '#f1f5f9',
                color: viewMode === 'list' ? 'white' : '#64748b',
                cursor: 'pointer',
              }}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Featured Section */}
        {featuredTemplates.length > 0 && !searchQuery && !selectedCategory && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: 700, 
              color: '#0D2C54', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Star size={20} color="#D4A84B" fill="#D4A84B" />
              Featured Templates
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : '1fr',
              gap: '20px' 
            }}>
              {featuredTemplates.map(template => (
                <TemplateCard 
                  key={template.id} 
                  template={template} 
                  canDownload={canDownload(template)}
                  onDownload={() => handleDownload(template)}
                  viewMode={viewMode}
                  isFeatured
                />
              ))}
            </div>
          </div>
        )}

        {/* All Templates */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
            Loading templates...
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
            <FolderOpen size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p>No templates found matching your criteria.</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : '1fr',
            gap: '20px' 
          }}>
            {(searchQuery || selectedCategory ? filteredTemplates : regularTemplates).map(template => (
              <TemplateCard 
                key={template.id} 
                template={template} 
                canDownload={canDownload(template)}
                onDownload={() => handleDownload(template)}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Template Card Component
interface TemplateCardProps {
  template: Template;
  canDownload: boolean;
  onDownload: () => void;
  viewMode: 'grid' | 'list';
  isFeatured?: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ 
  template, 
  canDownload, 
  onDownload, 
  viewMode,
  isFeatured 
}) => {
  const tierInfo = TIERS[template.tier_required as keyof typeof TIERS];

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (viewMode === 'list') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px 20px',
        background: 'white',
        borderRadius: '12px',
        border: isFeatured ? '2px solid #D4A84B' : '1px solid #e2e8f0',
        transition: 'all 0.2s',
      }}>
        {FILE_ICONS[template.file_type] || <File size={24} />}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: '#0D2C54', marginBottom: '2px' }}>
            {template.name}
          </div>
          <div style={{ fontSize: '13px', color: '#64748b' }}>
            {template.category} • {template.file_type.toUpperCase()} • {formatFileSize(template.file_size)}
          </div>
        </div>
        <span style={{
          padding: '4px 10px',
          borderRadius: '6px',
          fontSize: '11px',
          fontWeight: 600,
          background: tierInfo.color + '15',
          color: tierInfo.color,
        }}>
          {tierInfo.label}
        </span>
        <div style={{ fontSize: '13px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Download size={14} />
          {template.download_count}
        </div>
        <button
          onClick={onDownload}
          disabled={!canDownload}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: canDownload ? 'linear-gradient(135deg, #0097A9 0%, #00b4cc 100%)' : '#f1f5f9',
            color: canDownload ? 'white' : '#94a3b8',
            fontSize: '13px',
            fontWeight: 500,
            cursor: canDownload ? 'pointer' : 'not-allowed',
          }}
        >
          {canDownload ? <Download size={16} /> : <Lock size={16} />}
          {canDownload ? 'Download' : 'Locked'}
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      border: isFeatured ? '2px solid #D4A84B' : '1px solid #e2e8f0',
      overflow: 'hidden',
      transition: 'all 0.2s',
    }}>
      {/* Card Header */}
      <div style={{ 
        padding: '20px',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {FILE_ICONS[template.file_type] || <File size={24} />}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: 600, 
            color: '#0D2C54', 
            margin: '0 0 4px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {template.name}
            {isFeatured && <Star size={14} color="#D4A84B" fill="#D4A84B" />}
          </h3>
          <p style={{ 
            fontSize: '13px', 
            color: '#64748b', 
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {template.description || 'No description available'}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          <span style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 600,
            background: '#f1f5f9',
            color: '#64748b',
          }}>
            {template.category}
          </span>
          <span style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 600,
            background: tierInfo.color + '15',
            color: tierInfo.color,
          }}>
            {tierInfo.label}
          </span>
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          fontSize: '12px',
          color: '#94a3b8',
          marginBottom: '16px'
        }}>
          <span>{template.file_type.toUpperCase()} • {formatFileSize(template.file_size)}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Download size={14} />
            {template.download_count} downloads
          </span>
        </div>

        <button
          onClick={onDownload}
          disabled={!canDownload}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            borderRadius: '10px',
            border: 'none',
            background: canDownload ? 'linear-gradient(135deg, #0097A9 0%, #00b4cc 100%)' : '#f1f5f9',
            color: canDownload ? 'white' : '#94a3b8',
            fontSize: '14px',
            fontWeight: 600,
            cursor: canDownload ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
          }}
        >
          {canDownload ? (
            <>
              <Download size={18} />
              Download Template
            </>
          ) : (
            <>
              <Lock size={18} />
              Upgrade to {tierInfo.label}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TemplateVault;
