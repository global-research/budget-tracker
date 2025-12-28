import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { ArrowRight } from 'lucide-react';

const SalaryInput = () => {
  const { updateSalary } = useBudget();
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;
    updateSalary(amount);
  };

  return (
    <div className="salary-input-container" style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      padding: 'var(--spacing-lg)',
      textAlign: 'center'
    }}>
      <h1 style={{ marginBottom: 'var(--spacing-md)', fontSize: '28px', fontWeight: '700' }}>
        Welcome
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xl)' }}>
        To get started, please enter your monthly salary/budget.
      </p>

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="$0.00"
          autoFocus
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: '2px solid var(--text-tertiary)',
            color: 'var(--text-primary)',
            fontSize: '32px',
            textAlign: 'center',
            width: '100%',
            padding: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-xl)',
            outline: 'none'
          }}
        />

        <button 
          type="submit"
          disabled={!amount}
          style={{
            background: 'var(--accent-blue)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            padding: '16px 32px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            opacity: amount ? 1 : 0.5,
            transition: 'opacity 0.2s'
          }}
        >
          Start Tracking <ArrowRight size={20} />
        </button>
      </form>
    </div>
  );
};

export default SalaryInput;
