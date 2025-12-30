0.875rem', color: '#475569', padding: '0.375rem 0', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{ color: '#16a34a', fontWeight: 'bold', flexShrink: 0 }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleNavClick(plan.isEnterprise ? 'contact' : 'signup')} style={{ display: 'block', width: '100%', padding: '0.875rem 1rem', borderRadius: 8, fontSize: '0.9375rem', fontWeight: 700, border: 'none', cursor: 'pointer', background: plan.featured ? NAVY : '#f1f5f9', color: plan.featured ? 'white' : NAVY }}>
                {plan.isEnterprise ? 'Contact Sales' : 'Start 3-Day Trial'}
              </button>
            </div>
          ))}
        </div>

        <p style={{ maxWidth: 700, margin: '2rem auto 0', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
          <EditableText value={content.pricing.note} onChange={(v) => updateContent('pricing', 'note', v)} isEditing={isEditing('pricing')} multiline />
        </p>
      </EditableSection>

      {/* FAQ Section */}
      <EditableSection
        id="faq"
        title="FAQ"
        isEditing={isEditing('faq')}
        isEditMode={editMode}
        onEdit={() => setEditingSection('faq')}
        onSave={() => saveSection('faq')}
        onCancel={() => cancelEdit('faq')}
        style={{ padding: '5rem 2rem', background: '#f8fafc' }}
      >
        <h2 style={{ textAlign: 'center', fontSize: '2.25rem', fontWeight: 800, color: NAVY, marginBottom: '2.5rem' }}>
          <EditableText value={content.faq.headline} onChange={(v) => updateContent('faq', 'headline', v)} isEditing={isEditing('faq')} />
        </h2>

        <div style={{ maxWidth: 750, margin: '0 auto' }}>
          {content.faq.items.map((item: any, i: number) => (
            <div key={i} style={{ borderBottom: '1px solid #e2e8f0', padding: '1.25rem 0' }}>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: NAVY, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                Q{i + 1}:{' '}
                {isEditing('faq') ? (
                  <input
                    type="text"
                    value={item.q}
                    onChange={(e) => {
                      const items = [...content.faq.items];
                      items[i] = { ...items[i], q: e.target.value };
                      updateContent('faq', 'items', items);
                    }}
                    style={{ flex: 1, marginLeft: '0.5rem', border: '1px dashed #0097a7', borderRadius: 4, padding: '0.25rem', background: 'rgba(0, 151, 167, 0.1)' }}
                  />
                ) : (
                  <span style={{ flex: 1, marginLeft: '0.25rem' }}>{item.q}</span>
                )}
                <span style={{ fontSize: '1.25rem', color: '#94a3b8', marginLeft: '1rem' }}>+</span>
              </div>
            </div>
          ))}
        </div>
      </EditableSection>

      {/* Footer */}
      <EditableSection
        id="footer"
        title="Footer"
        isEditing={isEditing('footer')}
        isEditMode={editMode}
        onEdit={() => setEditingSection('footer')}
        onSave={() => saveSection('footer')}
        onCancel={() => cancelEdit('footer')}
        style={{ background: NAVY, color: 'white', padding: '4rem 2rem 2rem' }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr repeat(4, 1fr)', gap: '3rem' }}>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>
              The Nonprofit <span style={{ color: TEAL_LIGHT }}>Edge</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', maxWidth: 250, lineHeight: 1.6 }}>
              <EditableText value={content.footer.tagline} onChange={(v) => updateContent('footer', 'tagline', v)} isEditing={isEditing('footer')} multiline style={{ color: '#94a3b8' }} />
            </p>
          </div>

          {[
            { title: 'Product', links: ['Features', 'Pricing', 'FAQ'] },
            { title: 'Company', links: ['About', 'Resources', 'Contact'] },
            { title: 'Legal', links: ['Privacy', 'Terms'] },
            { title: 'Support', links: ['Help Center', 'Contact'] }
          ].map((col, i) => (
            <div key={i}>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', color: '#94a3b8' }}>{col.title}</h4>
              {col.links.map((link, j) => (
                <a key={j} href="#" style={{ display: 'block', fontSize: '0.9375rem', color: 'white', textDecoration: 'none', padding: '0.375rem 0' }}>{link}</a>
              ))}
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 1100, margin: '3rem auto 0', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8125rem', color: '#94a3b8' }}>
          <EditableText value={content.footer.copyright} onChange={(v) => updateContent('footer', 'copyright', v)} isEditing={isEditing('footer')} style={{ color: '#94a3b8' }} />
        </div>
      </EditableSection>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 1000px) {
          .nav-links-desktop { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (max-width: 768px) {
          section > div[style*="grid-template-columns: 1fr 1fr"],
          section > div[style*="grid-template-columns: 350px 1fr"],
          section > div[style*="grid-template-columns: repeat(3, 1fr)"],
          section > div[style*="grid-template-columns: repeat(4, 1fr)"],
          footer > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Homepage;
