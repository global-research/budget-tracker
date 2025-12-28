import React, { useState } from 'react';
import { useBudget } from './context/BudgetContext';
import SalaryInput from './components/SalaryInput';
import Dashboard from './components/Dashboard';
import AddTransactionModal from './components/AddTransactionModal';
import SavingsPocketsModal from './components/SavingsPocketsModal';
import { Plus } from 'lucide-react';
import './App.css';

function App() {
  const { salary, incomes } = useBudget();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);

  // Animation for modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openSavingsModal = () => setIsSavingsModalOpen(true);
  const closeSavingsModal = () => setIsSavingsModalOpen(false);

  if (!incomes || incomes.length === 0) {
    return <SalaryInput />;
  }

  return (
    <div className="app-container">
      <Dashboard onOpenSavings={openSavingsModal} />
      
      {/* Floating Action Button */}
      <button 
        onClick={openModal}
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '50%',
          transform: 'translateX(50%)', // Center it
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--accent-blue)',
          border: 'none',
          boxShadow: '0 4px 20px rgba(10, 132, 255, 0.4)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 100
        }}
      >
        <Plus size={32} />
      </button>

      {isModalOpen && <AddTransactionModal onClose={closeModal} />}
      {isSavingsModalOpen && <SavingsPocketsModal onClose={closeSavingsModal} />}
    </div>
  );
}

export default App;
