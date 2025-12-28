import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { X, PiggyBank } from 'lucide-react';

const AddSavingsModal = ({ onClose }) => {
  const { addToSavings } = useBudget();
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;

    addToSavings(amount);
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
        paddingBottom: '40px',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        border: '1px solid rgba(255,255,255,0.1)'
      }} onClick={e => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
                background: 'rgba(48, 209, 88, 0.15)', 
                padding: '8px', 
                borderRadius: '50%',
                color: 'var(--accent-green)' 
            }}>
                <PiggyBank size={20} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Add Savings</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '8px' }}>Amount to Save</label>
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
                color: 'var(--accent-green)',
                fontSize: '24px',
                fontWeight: '600'
              }}
            />
          </div>

          <button 
            type="submit"
            style={{
              background: 'var(--accent-green)',
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
            Deposit to Savings
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSavingsModal;
