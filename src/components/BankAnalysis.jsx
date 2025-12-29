import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { CreditCard, Wallet } from 'lucide-react';
import BankDetailsModal from './BankDetailsModal';

const BankAnalysis = () => {
    const { transactions, formatCurrency, getTotalExpenses } = useBudget();
    const [selectedBank, setSelectedBank] = useState(null);

    // Group transactions by bank
    const expensesByBank = transactions.reduce((acc, curr) => {
        const source = curr.paymentSource || 'Cash'; // Default to Cash if undefined
        if (!acc[source]) acc[source] = { total: 0, ready: 0, pending: 0 };
        
        const amount = parseFloat(curr.amount);
        acc[source].total += amount;
        
        if (curr.status === 'pending') {
            acc[source].pending += amount;
        } else {
            acc[source].ready += amount;
        }
        
        return acc;
    }, {});

    const totalExpenses = getTotalExpenses();

    // Get Icon based on source name (simple heuristic)
    const getBankIcon = (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('cash') || lowerName.includes('wallet')) return <Wallet size={18} />;
        return <CreditCard size={18} />;
    };

    return (
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Payment Sources</h3>
              <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-violet)' }}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>Paid</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-orange)' }}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>Pending</span>
                </div>
              </div>
            </div>

            <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-md)' }}>
                {Object.keys(expensesByBank).length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>No payment sources recorded.</div>
                ) : (
                    Object.entries(expensesByBank)
                        .sort(([, a], [, b]) => b.total - a.total)
                        .map(([bank, data]) => {
                            const { total, ready, pending } = data;
                            const percentage = totalExpenses > 0 ? Math.min((total / totalExpenses) * 100, 100) : 0;
                            
                            // Inner percentages relative to the BAR itself
                            const readyPct = total > 0 ? (ready / total) * 100 : 0;
                            const pendingPct = total > 0 ? (pending / total) * 100 : 0;

                            return (
                                <div
                                    key={bank}
                                    style={{ marginBottom: '16px', cursor: 'pointer' }}
                                    onClick={() => setSelectedBank(bank)}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ color: 'var(--accent-violet)' }}>{getBankIcon(bank)}</span>
                                            <span style={{ fontWeight: '500' }}>{bank}</span>
                                        </div>
                                        <div style={{ fontWeight: '600' }}>{formatCurrency(total)}</div>
                                    </div>
                                    <div style={{
                                        height: '6px',
                                        background: 'var(--bg-secondary)',
                                        borderRadius: '3px',
                                        width: '100%', // Container for the bar logic
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        {/* The visual bar wrapper */}
                                        <div style={{
                                            height: '100%',
                                            width: `${percentage}%`,
                                            borderRadius: '3px',
                                            overflow: 'hidden',
                                            display: 'flex'
                                        }}>
                                            {/* Ready Portion */}
                                            <div style={{ 
                                                width: `${readyPct}%`, 
                                                height: '100%', 
                                                background: 'var(--accent-violet)' 
                                            }}></div>
                                            {/* Pending Portion */}
                                            <div style={{ 
                                                width: `${pendingPct}%`, 
                                                height: '100%', 
                                                background: 'var(--accent-orange)' 
                                            }}></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                )}
            </div>

            {selectedBank && (
                <BankDetailsModal
                    bankName={selectedBank}
                    onClose={() => setSelectedBank(null)}
                />
            )}
        </div>
    );
};

export default BankAnalysis;
