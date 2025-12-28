import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { X, Trash2, Plus, DollarSign, Pencil } from 'lucide-react';

const IncomeModal = ({ onClose }) => {
  const { incomes, addIncome, updateIncome, removeIncome, salary, formatCurrency } = useBudget();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    if (!description || !amount) return;
    
    if (editingId) {
      updateIncome(editingId, { description, amount: parseFloat(amount) });
    } else {
      addIncome(description, amount);
    }
    
    resetForm();
  };

  const startEdit = (income) => {
    setDescription(income.description);
    setAmount(income.amount);
    setEditingId(income.id);
    setIsAdding(true);
  };

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setIsAdding(false);
    setEditingId(null);
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Income Sources</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Total Income Display */}
        <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Total Monthly Income</div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {formatCurrency(salary)}
            </div>
        </div>

        {/* Add/Edit Form */}
        {isAdding ? (
            <form onSubmit={handleSave} style={{ marginBottom: '24px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: '16px' }}>
                <h4 style={{ marginBottom: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {editingId ? 'Edit Income' : 'Add New Income'}
                </h4>
                <div style={{ marginBottom: '12px' }}>
                    <input 
                        type="text" 
                        placeholder="Description (e.g., Freelance)"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        autoFocus
                        style={{
                            width: '100%',
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.1)',
                            padding: '12px',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '16px'
                        }}
                    />
                </div>
                <div style={{ marginBottom: '16px', position: 'relative' }}>
                    <DollarSign size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-secondary)' }} />
                    <input 
                        type="number" 
                        placeholder="0.00"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        style={{
                            width: '100%',
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.1)',
                            padding: '12px 12px 12px 36px',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '16px'
                        }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                        type="button" 
                        onClick={resetForm}
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            color: 'var(--text-primary)',
                            fontWeight: '600'
                        }}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={!description || !amount}
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '8px',
                            background: 'var(--accent-blue)',
                            border: 'none',
                            color: 'white',
                            fontWeight: '600',
                            opacity: (!description || !amount) ? 0.5 : 1
                        }}
                    >
                        {editingId ? 'Update' : 'Save'}
                    </button>
                </div>
            </form>
        ) : (
            <button 
                onClick={() => setIsAdding(true)}
                style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '16px',
                    background: 'rgba(10, 132, 255, 0.1)',
                    border: '1px dashed var(--accent-blue)',
                    color: 'var(--accent-blue)',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '24px',
                    cursor: 'pointer'
                }}
            >
                <Plus size={20} /> Add Income Source
            </button>
        )}

        {/* Income List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {incomes.map(income => (
                <div key={income.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '16px'
                }}>
                    <div>
                        <div style={{ fontWeight: '600' }}>{income.description}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {new Date(income.date).toLocaleDateString()}
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ fontWeight: '600', color: 'var(--accent-green)' }}>
                            +{formatCurrency(income.amount)}
                        </div>
                        <button 
                            onClick={() => startEdit(income)}
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
                            onClick={() => removeIncome(income.id)}
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
            
            {incomes.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>
                    No income sources added yet.
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default IncomeModal;
