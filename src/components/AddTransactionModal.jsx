import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { X } from 'lucide-react';

const CATEGORIES = ['Rent', 'Billing', 'Food', 'Subscription', 'Transport', 'Shopping', 'Other'];
const PAYMENT_SOURCES = ['N26', 'Revolut', 'Commerzbank', 'PayPal', 'Global66', 'Cash'];

const AddTransactionModal = ({ onClose, editingTransaction }) => {
  const { addTransaction, updateTransaction } = useBudget();
  // Initialize state with editingTransaction data if available, or default
  const [amount, setAmount] = useState(editingTransaction ? editingTransaction.amount : '');
  const [description, setDescription] = useState(editingTransaction ? editingTransaction.description : '');
  const [category, setCategory] = useState(editingTransaction ? editingTransaction.category : CATEGORIES[2]);
  const [paymentSource, setPaymentSource] = useState(editingTransaction?.paymentSource || PAYMENT_SOURCES[0]);
  const [status, setStatus] = useState(editingTransaction?.status || 'pending');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !description) return;
    
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, {
        amount: parseFloat(amount),
        description,
        category,
        paymentSource,
        status,
      });
    } else {
      addTransaction({
        amount: parseFloat(amount),
        description,
        category,
        paymentSource,
        status,
      });
    }
    onClose();
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
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        padding: '24px',
        paddingBottom: '40px', // Extra for safe area
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        border: '1px solid rgba(255,255,255,0.1)'
      }} onClick={e => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700' }}>{editingTransaction ? 'Edit Expense' : 'New Expense'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '8px' }}>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              autoFocus
              style={{
                background: 'var(--bg-secondary)',
                border: 'none',
                borderRadius: '12px',
                padding: '16px',
                width: '100%',
                color: 'white',
                fontSize: '24px',
                fontWeight: '600'
              }}
            />
          </div>

          <div>
             <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '8px' }}>Description</label>
             <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Groceries"
              style={{
                background: 'var(--bg-secondary)',
                border: 'none',
                borderRadius: '12px',
                padding: '16px',
                width: '100%',
                color: 'white',
                fontSize: '16px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '8px' }}>Payment Source</label>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
              {PAYMENT_SOURCES.map(source => (
                <button
                  key={source}
                  type="button"
                  onClick={() => setPaymentSource(source)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: paymentSource === source ? 'var(--accent-violet)' : 'rgba(255,255,255,0.1)',
                    background: paymentSource === source ? 'rgba(191, 90, 242, 0.15)' : 'transparent',
                    color: paymentSource === source ? 'var(--accent-violet)' : 'var(--text-secondary)',
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {source}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '8px' }}>Category</label>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: category === cat ? 'var(--accent-blue)' : 'rgba(255,255,255,0.1)',
                    background: category === cat ? 'rgba(10, 132, 255, 0.15)' : 'transparent',
                    color: category === cat ? 'var(--accent-blue)' : 'var(--text-secondary)',
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '8px' }}>Status</label>
            <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setStatus('ready')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: status === 'ready' ? 'var(--accent-green)' : 'rgba(255,255,255,0.1)',
                    background: status === 'ready' ? 'rgba(48, 209, 88, 0.15)' : 'transparent',
                    color: status === 'ready' ? 'var(--accent-green)' : 'var(--text-secondary)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Ready
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('pending')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: status === 'pending' ? 'var(--accent-orange)' : 'rgba(255,255,255,0.1)',
                    background: status === 'pending' ? 'rgba(255, 159, 10, 0.15)' : 'transparent',
                    color: status === 'pending' ? 'var(--accent-orange)' : 'var(--text-secondary)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                   Pending
                </button>
            </div>
          </div>

          <button 
            type="submit"
            style={{
              background: 'var(--accent-blue)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              padding: '18px',
              marginTop: '16px',
              fontSize: '16px',
              fontWeight: '600',
              width: '100%',
              cursor: 'pointer'
            }}
          >
            {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
