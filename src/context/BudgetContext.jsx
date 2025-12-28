import React, { createContext, useState, useEffect, useContext } from 'react';

const BudgetContext = createContext();

export const useBudget = () => useContext(BudgetContext);

export const BudgetProvider = ({ children }) => {
  // Currency State
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('currency') || 'USD';
  });

  // State for multiple incomes
  const [incomes, setIncomes] = useState(() => {
    try {
      const savedIncomes = localStorage.getItem('incomes');
      if (savedIncomes) {
        const parsed = JSON.parse(savedIncomes);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.error('Error parsing incomes:', e);
    }
    
    // Migration: Check for old salary and convert it
    const oldSalary = localStorage.getItem('salary');
    if (oldSalary) {
      const initialIncome = {
        id: 'initial-salary',
        description: 'Main Income',
        amount: parseFloat(oldSalary),
        date: new Date().toISOString()
      };
      return [initialIncome];
    }
    return [];
  });

  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('transactions');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Migration: Housing -> Rent
        const migrated = parsed.map(t => {
           if (t.category === 'Housing') {
             return { ...t, category: 'Rent' };
           }
           return t;
        });
        return migrated;
      }
      return [];
    } catch (e) { return []; }
  });

  // Savings Pockets State
  const [savingsPockets, setSavingsPockets] = useState(() => {
    try {
      const savedPockets = localStorage.getItem('savingsPockets');
      if (savedPockets) {
        const parsed = JSON.parse(savedPockets);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.error('Error parsing savingsPockets:', e);
    }

    // Migration: Check for old savings float
    const oldSavings = localStorage.getItem('savings');
    if (oldSavings && parseFloat(oldSavings) > 0) {
      return [{
        id: 'general-savings',
        name: 'General Savings',
        amount: parseFloat(oldSavings),
        color: 'var(--accent-green)'
      }];
    }
    return [];
  });

  // Derived total savings
  const savings = Array.isArray(savingsPockets) ? savingsPockets.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0) : 0;

  useEffect(() => {
    localStorage.setItem('savingsPockets', JSON.stringify(savingsPockets));
  }, [savingsPockets]);

  // Sync total to old key for safety/compatibility (optional, but good for backup)
  useEffect(() => {
    localStorage.setItem('savings', savings);
  }, [savings]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('incomes', JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Pocket Management
  const addSavingsPocket = (name, initialAmount = 0) => {
    const newPocket = {
      id: Date.now().toString(),
      name,
      amount: parseFloat(initialAmount),
      color: 'var(--accent-green)' // simplified for now
    };
    setSavingsPockets(prev => [...prev, newPocket]);
  };

  const updatePocket = (id, newData) => {
    setSavingsPockets(prev => prev.map(p => (p.id === id ? { ...p, ...newData } : p)));
  };

  const deletePocket = (id) => {
    setSavingsPockets(prev => prev.filter(p => p.id !== id));
  };

  const transactionPocket = (id, amount) => {
    setSavingsPockets(prev => prev.map(p => {
      if (p.id === id) {
        const newAmount = Math.max(0, p.amount + parseFloat(amount));
        return { ...p, amount: newAmount };
      }
      return p;
    }));
  };

  // Deprecated/Mapped for compatibility
  const addToSavings = (amount) => {
    // Adds to the first pocket or creates one if none exist
    if (savingsPockets.length > 0) {
      transactionPocket(savingsPockets[0].id, amount);
    } else {
      addSavingsPocket('General Savings', amount);
    }
  };

  // New Income Management Functions
  const addIncome = (description, amount) => {
    const newIncome = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      date: new Date().toISOString()
    };
    setIncomes(prev => [...prev, newIncome]);
  };

  const updateIncome = (id, updatedData) => {
    setIncomes(prev => prev.map(i => (i.id === id ? { ...i, ...updatedData } : i)));
  };

  const removeIncome = (id) => {
    setIncomes(prev => prev.filter(i => i.id !== id));
  };

  // Deprecated/Modified
  const updateSalary = (amount) => {
    const newIncome = {
      id: 'main-income-' + Date.now(),
      description: 'Main Income',
      amount: parseFloat(amount),
      date: new Date().toISOString()
    };
    setIncomes([newIncome]);
  };

  // Helper to format currency
  const formatCurrency = (val) => {
    const currencyMap = {
      'USD': { locale: 'en-US', currency: 'USD' },
      'EUR': { locale: 'de-DE', currency: 'EUR' },
      'GBP': { locale: 'en-GB', currency: 'GBP' },
      'CLP': { locale: 'es-CL', currency: 'CLP' }
    };
    const config = currencyMap[currency] || currencyMap['USD'];
    return new Intl.NumberFormat(config.locale, { style: 'currency', currency: config.currency }).format(val);
  };

  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...transaction,
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = (id, updatedData) => {
    setTransactions(prev => prev.map(t => (t.id === id ? { ...t, ...updatedData } : t)));
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const getTotalExpenses = () => {
    return transactions.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  };

  // Derived salary (total income)
  const salary = incomes.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  const getBalance = () => {
    return salary - getTotalExpenses() - savings;
  };

  const getExpensesByCategory = () => {
    return transactions.reduce((acc, curr) => {
      const { category, amount } = curr;
      acc[category] = (acc[category] || 0) + parseFloat(amount);
      return acc;
    }, {});
  };

  return (
    <BudgetContext.Provider value={{
      currency,
      setCurrency,
      formatCurrency,
      salary,
      incomes,
      transactions,
      savings, // total derived
      savingsPockets, // new list
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addSavingsPocket,
      updatePocket,
      deletePocket,
      transactionPocket,
      addToSavings, // deprecated/mapped
      updateSalary,
      addIncome,
      updateIncome,
      removeIncome,
      getTotalExpenses,
      getBalance,
      getExpensesByCategory
    }}>
      {children}
    </BudgetContext.Provider>
  );
};
