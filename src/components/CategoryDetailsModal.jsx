import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { X, Trash2, Pencil, Calendar, ArrowDownAZ, Tag, CreditCard } from 'lucide-react';
import AddTransactionModal from './AddTransactionModal';
import ConfirmModal from './ConfirmModal';

const CategoryDetailsModal = ({ category, onClose }) => {
  const { transactions, deleteTransaction, updateTransaction, formatCurrency } = useBudget();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  
  // Filter transactions for this category
  let categoryTransactions = transactions.filter(t => t.category === category);

  // Sort transactions
  categoryTransactions.sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'alphabet') return a.description.localeCompare(b.description);
      if (sortBy === 'amount') return parseFloat(b.amount) - parseFloat(a.amount);
      if (sortBy === 'status') return (a.status || 'ready').localeCompare(b.status || 'ready');
      if (sortBy === 'bank') return (a.paymentSource || 'Cash').localeCompare(b.paymentSource || 'Cash');
      return 0;
  });
  
  // Calculate total for this category (for display)
  const totalAmount = categoryTransactions.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  const toggleStatus = (transaction) => {
    const newStatus = transaction.status === 'ready' ? 'pending' : 'ready';
    updateTransaction(transaction.id, { ...transaction, status: newStatus });
  };

  const confirmDelete = () => {
    if (transactionToDelete) {
        deleteTransaction(transactionToDelete);
        setTransactionToDelete(null);
    }
  };

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
        height: '80vh', // Taller modal for list
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
          <h3 style={{ fontSize: '24px', fontWeight: '700' }}>{category}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>
        
        <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '24px', color: 'var(--accent-blue)' }}>
            {formatCurrency(totalAmount)}
        </div>

         {/* Sorting Controls */}
         <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
            <button 
                onClick={() => setSortBy('date')}
                style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: sortBy === 'date' ? 'rgba(255,255,255,0.1)' : 'transparent',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: sortBy === 'date' ? 'white' : 'var(--text-secondary)',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                }}
            >
                <Calendar size={14} /> Date
            </button>
            <button 
                onClick={() => setSortBy('alphabet')}
                style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: sortBy === 'alphabet' ? 'rgba(255,255,255,0.1)' : 'transparent',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: sortBy === 'alphabet' ? 'white' : 'var(--text-secondary)',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                }}
            >
                <ArrowDownAZ size={14} /> A-Z
            </button>
            <button 
                onClick={() => setSortBy('status')}
                style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: sortBy === 'status' ? 'rgba(255,255,255,0.1)' : 'transparent',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: sortBy === 'status' ? 'white' : 'var(--text-secondary)',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                }}
            >
                <Tag size={14} /> Status
            </button>
            <button 
                onClick={() => setSortBy('bank')}
                style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: sortBy === 'bank' ? 'rgba(255,255,255,0.1)' : 'transparent',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: sortBy === 'bank' ? 'white' : 'var(--text-secondary)',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                }}
            >
                <CreditCard size={14} /> Bank
            </button>
        </div>

        {/* Transaction List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
            {categoryTransactions.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '40px' }}>
                    No transactions found.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {categoryTransactions.map(t => (
                        <div key={t.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '16px',
                            background: 'var(--bg-secondary)',
                            borderRadius: '16px',
                            opacity: t.status === 'pending' ? 0.7 : 1
                        }}>
                            <div>
                                <div style={{ fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {t.description}
                                    {t.status === 'pending' ? (
                                        <span style={{ 
                                            background: 'var(--accent-orange)', 
                                            color: 'black',
                                            padding: '2px 6px', 
                                            borderRadius: '4px',
                                            fontSize: '10px',
                                            fontWeight: '800'
                                        }}>
                                            PENDING
                                        </span>
                                    ) : (
                                        <span style={{ 
                                            background: 'rgba(48, 209, 88, 0.2)', 
                                            color: 'var(--accent-green)', 
                                            padding: '2px 6px', 
                                            borderRadius: '4px',
                                            fontSize: '10px',
                                            fontWeight: '800'
                                        }}>
                                            READY
                                        </span>
                                    )}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span>{new Date(t.date).toLocaleDateString()}</span>
                                    {t.paymentSource && (
                                      <span style={{ 
                                        background: 'rgba(255,255,255,0.1)', 
                                        padding: '2px 6px', 
                                        borderRadius: '4px',
                                        fontSize: '10px'
                                      }}>
                                        {t.paymentSource}
                                      </span>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div 
                                    onClick={() => toggleStatus(t)}
                                    style={{ 
                                        fontWeight: '600', 
                                        cursor: 'pointer',
                                        color: t.status === 'pending' ? 'var(--accent-orange)' : 'var(--text-primary)'
                                    }}
                                    title="Click to toggle status"
                                >
                                    {formatCurrency(t.amount)}
                                </div>
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
                                    onClick={() => setTransactionToDelete(t.id)}
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

        {/* Confirmation Modal */}
        <ConfirmModal 
            isOpen={!!transactionToDelete}
            onClose={() => setTransactionToDelete(null)}
            onConfirm={confirmDelete}
            title="Delete Transaction"
            message="Are you sure you want to delete this transaction? This action cannot be undone."
            confirmText="Delete"
        />

      </div>
    </div>
  );
};

export default CategoryDetailsModal;
