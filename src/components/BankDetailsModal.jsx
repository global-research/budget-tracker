import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { X, Trash2, Pencil } from 'lucide-react';
import AddTransactionModal from './AddTransactionModal';

const BankDetailsModal = ({ bankName, onClose }) => {
  const { transactions, deleteTransaction, formatCurrency } = useBudget();
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  // Filter transactions for this bank
  // If bankName is 'Other' or similar fallback, we might need specific logic, 
  // but for now assume exact match or "Unknown" for missing source.
  const bankTransactions = transactions.filter(t => {
      const source = t.paymentSource || 'Cash'; // Default fallback matching BankAnalysis
      return source === bankName;
  });
  
  // Calculate total for this bank (for display)
  const totalAmount = bankTransactions.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'flex-end',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg-card)',
        width: '100%',
        height: '80vh', 
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        padding: '24px',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: '700' }}>{bankName}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>
        
        <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '24px', color: 'var(--accent-blue)' }}>
            {formatCurrency(totalAmount)}
        </div>

        {/* Transaction List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
            {bankTransactions.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '40px' }}>
                    No transactions found for this source.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {bankTransactions.map(t => (
                        <div key={t.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '16px',
                            background: 'var(--bg-secondary)',
                            borderRadius: '16px'
                        }}>
                            <div>
                                <div style={{ fontWeight: '600', marginBottom: '4px' }}>{t.description}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span>{new Date(t.date).toLocaleDateString()}</span>
                                    <span style={{ 
                                        background: 'rgba(255,255,255,0.1)', 
                                        padding: '2px 6px', 
                                        borderRadius: '4px',
                                        fontSize: '10px'
                                      }}>
                                        {t.category}
                                      </span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ fontWeight: '600' }}>{formatCurrency(t.amount)}</div>
                                <button 
                                    onClick={() => setEditingTransaction(t)}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: 'none',
                                        color: 'var(--text-primary)',
                                        padding: '8px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Pencil size={16} />
                                </button>
                                <button 
                                    onClick={() => deleteTransaction(t.id)}
                                    style={{
                                        background: 'rgba(255, 69, 58, 0.15)',
                                        border: 'none',
                                        color: 'var(--accent-red)',
                                        padding: '8px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {editingTransaction && (
            <AddTransactionModal 
                editingTransaction={editingTransaction} 
                onClose={() => setEditingTransaction(null)} 
            />
        )}

      </div>
    </div>
  );
};

export default BankDetailsModal;
