import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { Clock } from 'lucide-react';
import PendingDetailsModal from './PendingDetailsModal';

const PendingAnalysis = () => {
    const { transactions, formatCurrency } = useBudget();
    const [showDetails, setShowDetails] = useState(false);

    const pendingTransactions = transactions.filter(t => t.status === 'pending');
    const totalPending = pendingTransactions.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    const count = pendingTransactions.length;



    return (
        <>
            <div 
                className="glass"
                onClick={() => setShowDetails(true)}
                style={{
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--spacing-md)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid rgba(255, 159, 10, 0.3)' // Keep orange border accent
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                        background: 'rgba(255, 159, 10, 0.15)', 
                        padding: '10px', 
                        borderRadius: '12px',
                        color: 'var(--accent-orange)' 
                    }}>
                        <Clock size={24} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '14px', fontWeight: '600' }}>Pending</h3>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {count} transaction{count !== 1 ? 's' : ''}
                        </div>
                    </div>
                </div>
                
                <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent-orange)' }}>
                    {formatCurrency(totalPending)}
                </div>
            </div>

            {showDetails && (
                <PendingDetailsModal onClose={() => setShowDetails(false)} />
            )}
        </>
    );
};

export default PendingAnalysis;
