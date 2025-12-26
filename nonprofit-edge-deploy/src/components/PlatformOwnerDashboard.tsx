/**
 * THE NONPROFIT EDGE - Platform Owner Dashboard
 * 
 * Financial command center for Lyn to track:
 * - Revenue & MRR
 * - Member metrics & churn
 * - Expenses & profitability
 * - Projections & forecasts
 */

import React, { useState, useEffect } from 'react';

// Brand colors
const NAVY = '#0D2C54';
const TEAL = '#0097A9';

interface PlatformOwnerDashboardProps {
  supabase: any;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

interface MemberStats {
  total: number;
  essential: number;
  professional: number;
  premium: number;
  newThisMonth: number;
  churnedThisMonth: number;
  foundingMembers: number;
}

interface Expense {
  id: string;
  name: string;
  amount: number;
  category: 'platform' | 'marketing' | 'operations' | 'tools' | 'other';
  frequency: 'monthly' | 'annual' | 'one-time';
  notes?: string;
}

interface RevenueByTier {
  tier: string;
  members: number;
  monthlyRate: number;
  mrr: number;
  percentage: number;
}

const PlatformOwnerDashboard: React.FC<PlatformOwnerDashboardProps> = ({ 
  supabase, 
  onNavigate, 
  onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'expenses' | 'projections'>('overview');
  const [loading, setLoading] = useState(true);
  const [memberStats, setMemberStats] = useState<MemberStats>({
    total: 0, essential: 0, professional: 0, premium: 0,
    newThisMonth: 0, churnedThisMonth: 0, foundingMembers: 0
  });
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Pricing tiers (configurable)
  const [pricing, setPricing] = useState({
    essential: { monthly: 79, founding: 67 },
    professional: { monthly: 159, founding: 147 },
    premium: { monthly: 329, founding: 297 }
  });

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Get member counts by tier
      const { data: orgs } = await supabase
        .from('organizations')
        .select('tier, is_founding, created_at');

      if (orgs) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        setMemberStats({
          total: orgs.length,
          essential: orgs.filter((o: any) => o.tier === 'essential').length,
          professional: orgs.filter((o: any) => o.tier === 'professional').length,
          premium: orgs.filter((o: any) => o.tier === 'premium').length,
          newThisMonth: orgs.filter((o: any) => new Date(o.created_at) >= startOfMonth).length,
          churnedThisMonth: 0, // Would come from a separate churned_organizations table
          foundingMembers: orgs.filter((o: any) => o.is_founding).length
        });
      }

      // Get expenses
      const { data: expenseData } = await supabase
        .from('platform_expenses')
        .select('*')
        .order('created_at', { ascending: false });

      if (expenseData) {
        setExpenses(expenseData);
      }

    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  // Calculate financials
  const calculateFinancials = () => {
    // Revenue calculations (assuming mix of founding and regular pricing)
    const foundingRatio = memberStats.foundingMembers / Math.max(memberStats.total, 1);
    
    const essentialMRR = memberStats.essential * (
      foundingRatio * pricing.essential.founding + 
      (1 - foundingRatio) * pricing.essential.monthly
    );
    const professionalMRR = memberStats.professional * (
      foundingRatio * pricing.professional.founding + 
      (1 - foundingRatio) * pricing.professional.monthly
    );
    const premiumMRR = memberStats.premium * (
      foundingRatio * pricing.premium.founding + 
      (1 - foundingRatio) * pricing.premium.monthly
    );

    const totalMRR = essentialMRR + professionalMRR + premiumMRR;
    const totalARR = totalMRR * 12;

    // Expense calculations
    const monthlyExpenses = expenses
      .filter(e => e.frequency === 'monthly')
      .reduce((sum, e) => sum + e.amount, 0);
    const annualExpensesMonthly = expenses
      .filter(e => e.frequency === 'annual')
      .reduce((sum, e) => sum + (e.amount / 12), 0);
    const totalMonthlyExpenses = monthlyExpenses + annualExpensesMonthly;

    const profit = totalMRR - totalMonthlyExpenses;
    const profitMargin = totalMRR > 0 ? (profit / totalMRR) * 100 : 0;
    const costPerMember = memberStats.total > 0 ? totalMonthlyExpenses / memberStats.total : 0;
    const revenuePerMember = memberStats.total > 0 ? totalMRR / memberStats.total : 0;
    const ltv = revenuePerMember * 12; // Assuming 12 month average retention

    return {
      essentialMRR,
      professionalMRR,
      premiumMRR,
      totalMRR,
      totalARR,
      totalMonthlyExpenses,
      profit,
      profitMargin,
      costPerMember,
      revenuePerMember,
      ltv
    };
  };

  const financials = calculateFinancials();

  // Revenue by tier breakdown
  const revenueByTier: RevenueByTier[] = [
    {
      tier: 'Essential',
      members: memberStats.essential,
      monthlyRate: pricing.essential.monthly,
      mrr: financials.essentialMRR,
      percentage: financials.totalMRR > 0 ? (financials.essentialMRR / financials.totalMRR) * 100 : 0
    },
    {
      tier: 'Professional',
      members: memberStats.professional,
      monthlyRate: pricing.professional.monthly,
      mrr: financials.professionalMRR,
      percentage: financials.totalMRR > 0 ? (financials.professionalMRR / financials.totalMRR) * 100 : 0
    },
    {
      tier: 'Premium',
      members: memberStats.premium,
      monthlyRate: pricing.premium.monthly,
      mrr: financials.premiumMRR,
      percentage: financials.totalMRR > 0 ? (financials.premiumMRR / financials.totalMRR) * 100 : 0
    }
  ];

  // Expense categories
  const expensesByCategory = {
    platform: expenses.filter(e => e.category === 'platform').reduce((sum, e) => sum + (e.frequency === 'annual' ? e.amount / 12 : e.amount), 0),
    marketing: expenses.filter(e => e.category === 'marketing').reduce((sum, e) => sum + (e.frequency === 'annual' ? e.amount / 12 : e.amount), 0),
    operations: expenses.filter(e => e.category === 'operations').reduce((sum, e) => sum + (e.frequency === 'annual' ? e.amount / 12 : e.amount), 0),
    tools: expenses.filter(e => e.category === 'tools').reduce((sum, e) => sum + (e.frequency === 'annual' ? e.amount / 12 : e.amount), 0),
    other: expenses.filter(e => e.category === 'other').reduce((sum, e) => sum + (e.frequency === 'annual' ? e.amount / 12 : e.amount), 0)
  };

  // Save expense
  const saveExpense = async (expense: Partial<Expense>) => {
    try {
      if (editingExpense?.id) {
        await supabase
          .from('platform_expenses')
          .update(expense)
          .eq('id', editingExpense.id);
      } else {
        await supabase
          .from('platform_expenses')
          .insert([expense]);
      }
      setShowExpenseModal(false);
      setEditingExpense(null);
      loadData();
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  // Delete expense
  const deleteExpense = async (id: string) => {
    if (!confirm('Delete this expense?')) return;
    await supabase.from('platform_expenses').delete().eq('id', id);
    loadData();
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Projections calculator
  const [projectionMonths, setProjectionMonths] = useState(12);
  const [projectionGrowth, setProjectionGrowth] = useState(10); // 10% monthly growth

  const calculateProjections = () => {
    const projections = [];
    let currentMembers = memberStats.total;
    let currentMRR = financials.totalMRR;
    
    for (let i = 1; i <= projectionMonths; i++) {
      currentMembers = Math.round(currentMembers * (1 + projectionGrowth / 100));
      currentMRR = currentMRR * (1 + projectionGrowth / 100);
      const expenses = financials.totalMonthlyExpenses * (1 + (i * 0.02)); // 2% expense growth
      const profit = currentMRR - expenses;
      
      projections.push({
        month: i,
        members: currentMembers,
        mrr: currentMRR,
        expenses: expenses,
        profit: profit
      });
    }
    return projections;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: `linear-gradient(180deg, ${NAVY} 0%, #1a3a5c 100%)`,
        color: 'white',
        padding: '24px',
        position: 'fixed',
        height: '100vh'
      }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>💰 Owner Dashboard</h1>
          <p style={{ fontSize: '13px', opacity: 0.7 }}>The Nonprofit Edge</p>
        </div>

        <nav>
          {[
            { id: 'overview', label: 'Financial Overview', icon: '📊' },
            { id: 'members', label: 'Member Revenue', icon: '👥' },
            { id: 'expenses', label: 'Expenses', icon: '💸' },
            { id: 'projections', label: 'Projections', icon: '📈' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '12px 16px',
                marginBottom: '8px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab.id ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                textAlign: 'left',
                gap: '10px'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ fontSize: '11px', opacity: 0.5, marginBottom: '12px', textTransform: 'uppercase' }}>
            Quick Links
          </p>
          <button
            onClick={() => onNavigate('content-manager')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              padding: '10px 12px',
              marginBottom: '8px',
              borderRadius: '6px',
              border: 'none',
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.8)',
              cursor: 'pointer',
              fontSize: '13px',
              textAlign: 'left'
            }}
          >
            📁 Content Manager
          </button>
          <button
            onClick={() => onNavigate('admin')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              padding: '10px 12px',
              marginBottom: '8px',
              borderRadius: '6px',
              border: 'none',
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.8)',
              cursor: 'pointer',
              fontSize: '13px',
              textAlign: 'left'
            }}
          >
            ⚙️ Platform Admin
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: 'none',
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.8)',
              cursor: 'pointer',
              fontSize: '13px',
              textAlign: 'left'
            }}
          >
            🏠 Member View
          </button>
        </div>

        <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
          <button
            onClick={onLogout}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '260px', flex: 1, padding: '32px' }}>
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: NAVY, marginBottom: '8px' }}>
              Financial Overview
            </h2>
            <p style={{ color: '#64748b', marginBottom: '32px' }}>
              Real-time platform financials • Last updated: {new Date().toLocaleDateString()}
            </p>

            {/* Key Metrics */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '20px',
              marginBottom: '32px'
            }}>
              {/* MRR */}
              <div style={{
                background: `linear-gradient(135deg, ${NAVY} 0%, #1a3a5c 100%)`,
                borderRadius: '16px',
                padding: '24px',
                color: 'white'
              }}>
                <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}>
                  Monthly Recurring Revenue
                </div>
                <div style={{ fontSize: '36px', fontWeight: 700, marginBottom: '8px' }}>
                  {formatCurrency(financials.totalMRR)}
                </div>
                <div style={{ fontSize: '13px', opacity: 0.7 }}>
                  ARR: {formatCurrency(financials.totalARR)}
                </div>
              </div>

              {/* Profit */}
              <div style={{
                background: financials.profit >= 0 
                  ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                  : 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
                borderRadius: '16px',
                padding: '24px',
                color: 'white'
              }}>
                <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}>
                  Monthly Profit
                </div>
                <div style={{ fontSize: '36px', fontWeight: 700, marginBottom: '8px' }}>
                  {formatCurrency(financials.profit)}
                </div>
                <div style={{ fontSize: '13px', opacity: 0.7 }}>
                  Margin: {financials.profitMargin.toFixed(1)}%
                </div>
              </div>

              {/* Members */}
              <div style={{
                background: `linear-gradient(135deg, ${TEAL} 0%, #0284c7 100%)`,
                borderRadius: '16px',
                padding: '24px',
                color: 'white'
              }}>
                <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}>
                  Total Members
                </div>
                <div style={{ fontSize: '36px', fontWeight: 700, marginBottom: '8px' }}>
                  {memberStats.total}
                </div>
                <div style={{ fontSize: '13px', opacity: 0.7 }}>
                  +{memberStats.newThisMonth} this month
                </div>
              </div>

              {/* Expenses */}
              <div style={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                borderRadius: '16px',
                padding: '24px',
                color: 'white'
              }}>
                <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}>
                  Monthly Expenses
                </div>
                <div style={{ fontSize: '36px', fontWeight: 700, marginBottom: '8px' }}>
                  {formatCurrency(financials.totalMonthlyExpenses)}
                </div>
                <div style={{ fontSize: '13px', opacity: 0.7 }}>
                  Cost/member: {formatCurrency(financials.costPerMember)}
                </div>
              </div>
            </div>

            {/* Secondary Metrics */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '20px',
              marginBottom: '32px'
            }}>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                padding: '24px'
              }}>
                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
                  Revenue per Member
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: NAVY }}>
                  {formatCurrency(financials.revenuePerMember)}
                </div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>per month</div>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                padding: '24px'
              }}>
                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
                  Customer Lifetime Value
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: NAVY }}>
                  {formatCurrency(financials.ltv)}
                </div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>12-month estimate</div>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                padding: '24px'
              }}>
                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
                  Founding Members
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: NAVY }}>
                  {memberStats.foundingMembers}
                </div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  {memberStats.total > 0 ? ((memberStats.foundingMembers / memberStats.total) * 100).toFixed(0) : 0}% of total
                </div>
              </div>
            </div>

            {/* Revenue by Tier */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              padding: '24px',
              marginBottom: '32px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: NAVY, marginBottom: '20px' }}>
                Revenue by Tier
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                {revenueByTier.map(tier => (
                  <div key={tier.tier}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 600, color: NAVY }}>{tier.tier}</span>
                      <span style={{ color: TEAL, fontWeight: 600 }}>{formatCurrency(tier.mrr)}</span>
                    </div>
                    <div style={{ 
                      height: '8px', 
                      background: '#f1f5f9', 
                      borderRadius: '4px',
                      overflow: 'hidden',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${tier.percentage}%`,
                        background: tier.tier === 'Essential' ? '#60A5FA' : 
                                   tier.tier === 'Professional' ? TEAL : '#8B5CF6',
                        borderRadius: '4px'
                      }} />
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                      {tier.members} members × ${tier.monthlyRate}/mo
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expense Breakdown */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              padding: '24px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: NAVY, marginBottom: '20px' }}>
                Expense Breakdown
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
                {[
                  { label: 'Platform', amount: expensesByCategory.platform, icon: '🖥️' },
                  { label: 'Marketing', amount: expensesByCategory.marketing, icon: '📣' },
                  { label: 'Operations', amount: expensesByCategory.operations, icon: '⚙️' },
                  { label: 'Tools', amount: expensesByCategory.tools, icon: '🔧' },
                  { label: 'Other', amount: expensesByCategory.other, icon: '📦' }
                ].map(cat => (
                  <div key={cat.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>{cat.icon}</div>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: NAVY }}>
                      {formatCurrency(cat.amount)}
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>{cat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* MEMBERS TAB */}
        {activeTab === 'members' && (
          <>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: NAVY, marginBottom: '8px' }}>
              Member Revenue Details
            </h2>
            <p style={{ color: '#64748b', marginBottom: '32px' }}>
              Breakdown by tier and pricing
            </p>

            {/* Tier Cards */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '24px',
              marginBottom: '32px'
            }}>
              {[
                { 
                  tier: 'Essential', 
                  count: memberStats.essential, 
                  price: pricing.essential,
                  mrr: financials.essentialMRR,
                  color: '#60A5FA'
                },
                { 
                  tier: 'Professional', 
                  count: memberStats.professional, 
                  price: pricing.professional,
                  mrr: financials.professionalMRR,
                  color: TEAL
                },
                { 
                  tier: 'Premium', 
                  count: memberStats.premium, 
                  price: pricing.premium,
                  mrr: financials.premiumMRR,
                  color: '#8B5CF6'
                }
              ].map(tier => (
                <div
                  key={tier.tier}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    border: '1px solid #e5e7eb',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{
                    background: tier.color,
                    padding: '20px 24px',
                    color: 'white'
                  }}>
                    <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>
                      {tier.tier} Tier
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 700 }}>
                      {tier.count}
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>members</div>
                  </div>
                  <div style={{ padding: '24px' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>
                        Monthly Revenue
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: NAVY }}>
                        {formatCurrency(tier.mrr)}
                      </div>
                    </div>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: '12px',
                      paddingTop: '16px',
                      borderTop: '1px solid #f1f5f9'
                    }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Regular</div>
                        <div style={{ fontWeight: 600 }}>${tier.price.monthly}/mo</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Founding</div>
                        <div style={{ fontWeight: 600 }}>${tier.price.founding}/mo</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Configuration */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              padding: '24px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: NAVY, marginBottom: '20px' }}>
                Pricing Configuration
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                {(['essential', 'professional', 'premium'] as const).map(tier => (
                  <div key={tier}>
                    <div style={{ fontWeight: 600, marginBottom: '12px', textTransform: 'capitalize' }}>
                      {tier}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                          Regular Price
                        </label>
                        <input
                          type="number"
                          value={pricing[tier].monthly}
                          onChange={e => setPricing({
                            ...pricing,
                            [tier]: { ...pricing[tier], monthly: Number(e.target.value) }
                          })}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                          Founding Price
                        </label>
                        <input
                          type="number"
                          value={pricing[tier].founding}
                          onChange={e => setPricing({
                            ...pricing,
                            [tier]: { ...pricing[tier], founding: Number(e.target.value) }
                          })}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* EXPENSES TAB */}
        {activeTab === 'expenses' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: NAVY, marginBottom: '8px' }}>
                  Expenses
                </h2>
                <p style={{ color: '#64748b' }}>
                  Track your monthly and annual costs
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingExpense({ 
                    id: '', 
                    name: '', 
                    amount: 0, 
                    category: 'platform', 
                    frequency: 'monthly' 
                  });
                  setShowExpenseModal(true);
                }}
                style={{
                  padding: '12px 24px',
                  background: TEAL,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                + Add Expense
              </button>
            </div>

            {/* Expense Summary */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '20px',
              marginBottom: '32px'
            }}>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                padding: '24px'
              }}>
                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
                  Total Monthly
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: NAVY }}>
                  {formatCurrency(financials.totalMonthlyExpenses)}
                </div>
              </div>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                padding: '24px'
              }}>
                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
                  Total Annual
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: NAVY }}>
                  {formatCurrency(financials.totalMonthlyExpenses * 12)}
                </div>
              </div>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                padding: '24px'
              }}>
                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
                  Cost per Member
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: NAVY }}>
                  {formatCurrency(financials.costPerMember)}
                </div>
              </div>
            </div>

            {/* Expense List */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '16px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
                      Expense
                    </th>
                    <th style={{ textAlign: 'left', padding: '16px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
                      Category
                    </th>
                    <th style={{ textAlign: 'left', padding: '16px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
                      Frequency
                    </th>
                    <th style={{ textAlign: 'right', padding: '16px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
                      Amount
                    </th>
                    <th style={{ textAlign: 'right', padding: '16px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
                      Monthly
                    </th>
                    <th style={{ textAlign: 'right', padding: '16px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                        No expenses tracked yet. Add your first expense to start tracking.
                      </td>
                    </tr>
                  ) : (
                    expenses.map(expense => (
                      <tr key={expense.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '16px' }}>
                          <div style={{ fontWeight: 500 }}>{expense.name}</div>
                          {expense.notes && (
                            <div style={{ fontSize: '12px', color: '#64748b' }}>{expense.notes}</div>
                          )}
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span style={{
                            background: '#f1f5f9',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            textTransform: 'capitalize'
                          }}>
                            {expense.category}
                          </span>
                        </td>
                        <td style={{ padding: '16px', fontSize: '14px', textTransform: 'capitalize' }}>
                          {expense.frequency}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right', fontWeight: 500 }}>
                          {formatCurrency(expense.amount)}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right', color: TEAL, fontWeight: 500 }}>
                          {formatCurrency(expense.frequency === 'annual' ? expense.amount / 12 : expense.amount)}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <button
                            onClick={() => {
                              setEditingExpense(expense);
                              setShowExpenseModal(true);
                            }}
                            style={{
                              padding: '6px 12px',
                              background: '#f1f5f9',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              marginRight: '8px'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteExpense(expense.id)}
                            style={{
                              padding: '6px 12px',
                              background: '#FEE2E2',
                              color: '#DC2626',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Common Expenses Quick Add */}
            <div style={{
              background: '#FEF3C7',
              border: '1px solid #F59E0B',
              borderRadius: '12px',
              padding: '20px',
              marginTop: '24px'
            }}>
              <h4 style={{ color: '#92400E', marginBottom: '12px' }}>💡 Common Expenses to Track</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { name: 'Supabase Pro', amount: 25, category: 'platform' },
                  { name: 'Vercel Pro', amount: 20, category: 'platform' },
                  { name: 'Claude API', amount: 200, category: 'platform' },
                  { name: 'GoHighLevel', amount: 297, category: 'marketing' },
                  { name: 'Zoom Pro', amount: 15, category: 'tools' },
                  { name: 'Loom', amount: 15, category: 'tools' }
                ].map(exp => (
                  <button
                    key={exp.name}
                    onClick={() => {
                      setEditingExpense({
                        id: '',
                        name: exp.name,
                        amount: exp.amount,
                        category: exp.category as any,
                        frequency: 'monthly'
                      });
                      setShowExpenseModal(true);
                    }}
                    style={{
                      padding: '8px 16px',
                      background: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    + {exp.name} (${exp.amount}/mo)
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* PROJECTIONS TAB */}
        {activeTab === 'projections' && (
          <>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: NAVY, marginBottom: '8px' }}>
              Financial Projections
            </h2>
            <p style={{ color: '#64748b', marginBottom: '32px' }}>
              Forecast your growth and revenue
            </p>

            {/* Projection Controls */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              padding: '24px',
              marginBottom: '32px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    Projection Period
                  </label>
                  <select
                    value={projectionMonths}
                    onChange={e => setProjectionMonths(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <option value={6}>6 months</option>
                    <option value={12}>12 months</option>
                    <option value={24}>24 months</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    Monthly Growth Rate
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={projectionGrowth}
                      onChange={e => setProjectionGrowth(Number(e.target.value))}
                      style={{ flex: 1 }}
                    />
                    <span style={{ 
                      fontWeight: 600, 
                      color: TEAL,
                      minWidth: '50px',
                      textAlign: 'right'
                    }}>
                      {projectionGrowth}%
                    </span>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    Starting Point
                  </label>
                  <div style={{ 
                    padding: '10px 12px', 
                    background: '#f8fafc', 
                    borderRadius: '8px',
                    color: NAVY,
                    fontWeight: 500
                  }}>
                    {memberStats.total} members • {formatCurrency(financials.totalMRR)} MRR
                  </div>
                </div>
              </div>
            </div>

            {/* Projection Results */}
            {(() => {
              const projections = calculateProjections();
              const finalProjection = projections[projections.length - 1];
              
              return (
                <>
                  {/* End State Cards */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(4, 1fr)', 
                    gap: '20px',
                    marginBottom: '32px'
                  }}>
                    <div style={{
                      background: `linear-gradient(135deg, ${NAVY} 0%, #1a3a5c 100%)`,
                      borderRadius: '12px',
                      padding: '24px',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '13px', opacity: 0.8, marginBottom: '8px' }}>
                        Projected Members ({projectionMonths}mo)
                      </div>
                      <div style={{ fontSize: '32px', fontWeight: 700 }}>
                        {finalProjection.members}
                      </div>
                    </div>
                    <div style={{
                      background: `linear-gradient(135deg, ${TEAL} 0%, #0284c7 100%)`,
                      borderRadius: '12px',
                      padding: '24px',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '13px', opacity: 0.8, marginBottom: '8px' }}>
                        Projected MRR
                      </div>
                      <div style={{ fontSize: '32px', fontWeight: 700 }}>
                        {formatCurrency(finalProjection.mrr)}
                      </div>
                    </div>
                    <div style={{
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      borderRadius: '12px',
                      padding: '24px',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '13px', opacity: 0.8, marginBottom: '8px' }}>
                        Projected Monthly Profit
                      </div>
                      <div style={{ fontSize: '32px', fontWeight: 700 }}>
                        {formatCurrency(finalProjection.profit)}
                      </div>
                    </div>
                    <div style={{
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                      borderRadius: '12px',
                      padding: '24px',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '13px', opacity: 0.8, marginBottom: '8px' }}>
                        Projected ARR
                      </div>
                      <div style={{ fontSize: '32px', fontWeight: 700 }}>
                        {formatCurrency(finalProjection.mrr * 12)}
                      </div>
                    </div>
                  </div>

                  {/* Projection Table */}
                  <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    overflow: 'hidden'
                  }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                          <th style={{ textAlign: 'left', padding: '16px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
                            Month
                          </th>
                          <th style={{ textAlign: 'right', padding: '16px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
                            Members
                          </th>
                          <th style={{ textAlign: 'right', padding: '16px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
                            MRR
                          </th>
                          <th style={{ textAlign: 'right', padding: '16px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
                            Expenses
                          </th>
                          <th style={{ textAlign: 'right', padding: '16px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
                            Profit
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {projections.map(p => (
                          <tr key={p.month} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '16px', fontWeight: 500 }}>Month {p.month}</td>
                            <td style={{ padding: '16px', textAlign: 'right' }}>{p.members}</td>
                            <td style={{ padding: '16px', textAlign: 'right', color: TEAL, fontWeight: 500 }}>
                              {formatCurrency(p.mrr)}
                            </td>
                            <td style={{ padding: '16px', textAlign: 'right', color: '#F59E0B' }}>
                              {formatCurrency(p.expenses)}
                            </td>
                            <td style={{ 
                              padding: '16px', 
                              textAlign: 'right', 
                              fontWeight: 600,
                              color: p.profit >= 0 ? '#059669' : '#DC2626'
                            }}>
                              {formatCurrency(p.profit)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })()}
          </>
        )}
      </main>

      {/* Expense Modal */}
      {showExpenseModal && editingExpense && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            width: '450px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: NAVY, marginBottom: '24px' }}>
              {editingExpense.id ? 'Edit Expense' : 'Add Expense'}
            </h2>
            
            <form onSubmit={e => { 
              e.preventDefault(); 
              saveExpense(editingExpense); 
            }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Name</label>
                <input
                  type="text"
                  value={editingExpense.name}
                  onChange={e => setEditingExpense({ ...editingExpense, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Amount ($)</label>
                  <input
                    type="number"
                    value={editingExpense.amount}
                    onChange={e => setEditingExpense({ ...editingExpense, amount: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Frequency</label>
                  <select
                    value={editingExpense.frequency}
                    onChange={e => setEditingExpense({ ...editingExpense, frequency: e.target.value as any })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                    <option value="one-time">One-time</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Category</label>
                <select
                  value={editingExpense.category}
                  onChange={e => setEditingExpense({ ...editingExpense, category: e.target.value as any })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                >
                  <option value="platform">Platform (hosting, APIs)</option>
                  <option value="marketing">Marketing (ads, GHL)</option>
                  <option value="operations">Operations (team, admin)</option>
                  <option value="tools">Tools (software, subscriptions)</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Notes (optional)</label>
                <input
                  type="text"
                  value={editingExpense.notes || ''}
                  onChange={e => setEditingExpense({ ...editingExpense, notes: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  placeholder="e.g., Billed annually in January"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => { setShowExpenseModal(false); setEditingExpense(null); }}
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: TEAL, color: 'white', fontWeight: 600, cursor: 'pointer' }}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformOwnerDashboard;
