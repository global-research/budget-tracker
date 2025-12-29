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
        acc[source] = (acc[source] || 0) + parseFloat(curr.amount);
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
            <h3 style={{ marginBottom: 'var(--spacing-md)', fontSize: '18px', fontWeight: '600' }}>Payment Sources</h3>
            <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-md)' }}>
                {Object.keys(expensesByBank).length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>No payment sources recorded.</div>
                ) : (
                    Object.entries(expensesByBank)
                        .sort(([, a], [, b]) => b - a)
                        .map(([bank, amount]) => {
                            const percentage = totalExpenses > 0 ? Math.min((amount / totalExpenses) * 100, 100) : 0;
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
                                            background: 'var(--accent-violet)',
                                            borderRadius: '3px'
                                        }}></div>
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
