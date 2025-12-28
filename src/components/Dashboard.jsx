import React, { useState, useMemo } from 'react';
import { useBudget } from '../context/BudgetContext';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, Settings } from 'lucide-react';
import CategoryDetailsModal from './CategoryDetailsModal';
import IncomeModal from './IncomeModal';

const Dashboard = ({ onOpenSavings }) => {
  const { salary, getBalance, getTotalExpenses, transactions, savings, getExpensesByCategory, formatCurrency, currency, setCurrency } = useBudget();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  
  const balance = getBalance();
  const totalExpenses = getTotalExpenses();
  const spentPercentage = Math.min((totalExpenses / salary) * 100, 100);
  
  const expensesByCategory = getExpensesByCategory();

  return (
    <div className="dashboard fade-in">
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 'var(--spacing-lg)' 
      }}>
        <div>
          <h2 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', fontWeight: '500' }}>
            Available Balance
          </h2>
          <h1 className="text-gradient" style={{ fontSize: '36px', fontWeight: '800', lineHeight: '1.2' }}>
            {formatCurrency(balance)}
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                style={{
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    outline: 'none',
                    cursor: 'pointer'
                }}
            >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CLP">CLP ($)</option>
            </select>
            <div style={{
            background: 'var(--bg-card)',
            padding: '8px',
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ width: '24px', height: '24px', background: 'var(--accent-violet)', borderRadius: '50%' }}></div>
            </div>
        </div>
      </header>

      {/* Summary Card */}
      <div className="glass" style={{ 
        borderRadius: 'var(--radius-lg)', 
        padding: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-xl)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div onClick={() => setIsIncomeModalOpen(true)} style={{ cursor: 'pointer' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Income ✎</span>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{formatCurrency(salary)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Expenses</span>
            <div style={{ fontWeight: '600', color: 'var(--accent-red)' }}>{formatCurrency(totalExpenses)}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ 
          height: '8px', 
          background: 'var(--bg-secondary)', 
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${spentPercentage}%`,
            background: spentPercentage > 90 ? 'var(--accent-red)' : 'linear-gradient(90deg, var(--accent-blue), var(--accent-violet))',
            borderRadius: '4px',
            transition: 'width 0.5s ease-out'
          }}></div>
        </div>
      </div>

       {/* Savings Card */}
       <div className="glass" style={{ 
        borderRadius: 'var(--radius-lg)', 
        padding: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-xl)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer'
      }} onClick={onOpenSavings}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
                background: 'rgba(48, 209, 88, 0.15)', 
                padding: '10px', 
                borderRadius: '12px',
                color: 'var(--accent-green)' 
            }}>
                <PiggyBank size={24} />
            </div>
            <div>
                <h3 style={{ fontSize: '14px', fontWeight: '600' }}>Savings</h3>
                <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent-green)' }}>
                    {formatCurrency(savings)}
                </div>
            </div>
        </div>
        <div style={{ 
            background: 'var(--bg-secondary)', 
            padding: '8px 16px', 
            borderRadius: '20px', 
            fontSize: '12px', 
            fontWeight: '600',
            color: 'var(--text-secondary)'
        }}>
            Add +
        </div>
      </div>

      {/* Spending Breakdown */}
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-md)', fontSize: '18px', fontWeight: '600' }}>Spending Breakdown</h3>
        <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-md)' }}>
           {Object.keys(expensesByCategory).length === 0 ? (
             <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>No expenses yet.</div>
           ) : (
             Object.entries(expensesByCategory)
               .sort(([, a], [, b]) => b - a)
               .map(([category, amount]) => {
                 const percentage = Math.min((amount / totalExpenses) * 100, 100);
                 return (
                   <div 
                      key={category} 
                      style={{ marginBottom: '16px', cursor: 'pointer' }}
                      onClick={() => setSelectedCategory(category)}
                   >
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{getCategoryIcon(category)}</span>
                          <span style={{ fontWeight: '500' }}>{category}</span>
                        </div>
                        <div style={{ fontWeight: '600' }}>{formatCurrency(amount)}</div>
                     </div>
                     <div style={{ 
                        height: '6px', 
                        background: 'var(--bg-secondary)', 
                        borderRadius: '3px',
                        overflow: 'hidden' 
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${percentage}%`,
                          background: 'var(--accent-blue)', // You could vary colors by category here
                          borderRadius: '3px'
                        }}></div>
                      </div>
                   </div>
                 );
             })
           )}
        </div>
      </div>

      {selectedCategory && (
        <CategoryDetailsModal 
          category={selectedCategory} 
          onClose={() => setSelectedCategory(null)} 
        />
      )}

      {isIncomeModalOpen && (
        <IncomeModal onClose={() => setIsIncomeModalOpen(false)} />
      )}

    </div>
  );
};

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Rent': return '🏠';
    case 'Billing': return '🧾';
    case 'Housing': return '🏠'; // Fallback for any missed migration render
    case 'Food': return '🍔';
    case 'Subscription': return '📺';
    case 'Transport': return '🚗';
    case 'Shopping': return '🛍️';
    default: return '💸';
  }
};

export default Dashboard;
