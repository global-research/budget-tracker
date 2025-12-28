import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { X, Plus, Trash2, PiggyBank, ArrowUpRight, ArrowDownLeft, Pencil } from 'lucide-react';

const SavingsPocketsModal = ({ onClose }) => {
  const { savingsPockets, addSavingsPocket, deletePocket, transactionPocket, updatePocket, formatCurrency } = useBudget();
  const [view, setView] = useState('list'); // 'list', 'add', 'detail'
  const [selectedPocket, setSelectedPocket] = useState(null);
  
  // Form States
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  
  // Deposit/Withdraw State
  const [transAmount, setTransAmount] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name) return;
    addSavingsPocket(name, amount || 0);
    setName('');
    setAmount('');
    setView('list');
  };

  const handleTransaction = (type) => { // 'deposit' or 'withdraw'
    if (!transAmount || !selectedPocket) return;
    const val = parseFloat(transAmount);
    const finalAmount = type === 'deposit' ? val : -val;
    
    transactionPocket(selectedPocket.id, finalAmount);
    setTransAmount('');
    // Update local selected pocket to reflect change immediately in UI if we were sticking to detail view
    // But since context updates, rerender happens. check if selectedPocket needs manual refresh?
    // Actually selectedPocket is state copy? No, we just need ID.
    // Let's rely on finding it from the fresh list.
    // Simpler: Just close detail view or update local ref?
    // We'll revert to list for simplicity for now or stay in detail.
  };

  // Helper to get fresh pocket data
  const activePocket = selectedPocket ? savingsPockets.find(p => p.id === selectedPocket.id) : null;

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
        height: '85vh',
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
          {view !== 'list' ? (
             <button onClick={() => setView('list')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px' }}>
               ← Back
             </button>
          ) : (
             <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Savings Pockets</h3>
          )}
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* VIEW: ADD POCKET */}
        {view === 'add' && (
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '18px', fontWeight: '600' }}>Create New Pocket</h4>
            <input 
              type="text" 
              placeholder="Pocket Name (e.g. Travel)" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              autoFocus
              style={{
                width: '100%',
                background: 'var(--bg-secondary)',
                border: 'none',
                padding: '16px',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px'
              }}
            />
            <input 
              type="number" 
              placeholder="Initial Amount (Optional)" 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              style={{
                width: '100%',
                background: 'var(--bg-secondary)',
                border: 'none',
                padding: '16px',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px'
              }}
            />
            <button type="submit" style={{
              background: 'var(--accent-blue)',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: '16px',
              fontWeight: '600',
              marginTop: '16px'
            }}>Create Pocket</button>
          </form>
        )}

        {/* VIEW: DETAIL (Deposit/Withdraw) */}
        {view === 'detail' && activePocket && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700' }}>{activePocket.name}</h2>
              <div style={{ fontSize: '36px', fontWeight: '800', color: 'var(--accent-green)' }}>
                {formatCurrency(activePocket.amount)}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
               <input 
                  type="number" 
                  placeholder="0.00" 
                  value={transAmount} 
                  onChange={e => setTransAmount(e.target.value)} 
                  style={{
                    gridColumn: '1 / -1',
                    background: 'var(--bg-secondary)',
                    border: 'none',
                    padding: '16px',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '24px',
                    textAlign: 'center',
                    fontWeight: '600'
                  }}
               />
               <button 
                 onClick={() => handleTransaction('deposit')}
                 disabled={!transAmount}
                 style={{
                   background: 'rgba(48, 209, 88, 0.2)',
                   color: 'var(--accent-green)',
                   border: 'none',
                   padding: '16px',
                   borderRadius: '12px',
                   fontWeight: '600',
                   display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                   opacity: !transAmount ? 0.5 : 1
                 }}
               >
                 <ArrowDownLeft size={18} /> Deposit
               </button>
               <button 
                 onClick={() => handleTransaction('withdraw')}
                 disabled={!transAmount}
                 style={{
                   background: 'rgba(255, 69, 58, 0.2)',
                   color: 'var(--accent-red)',
                   border: 'none',
                   padding: '16px',
                   borderRadius: '12px',
                   fontWeight: '600',
                   display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                   opacity: (!transAmount || parseFloat(transAmount) > activePocket.amount) ? 0.5 : 1
                 }}
               >
                  Withdraw <ArrowUpRight size={18} />
               </button>
            </div>

            <button 
              onClick={() => { deletePocket(activePocket.id); setView('list'); }}
              style={{
                background: 'rgba(255, 69, 58, 0.1)',
                color: 'var(--accent-red)',
                border: 'none',
                padding: '16px',
                borderRadius: '12px',
                fontWeight: '600',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                marginTop: 'auto'
              }}
            >
              <Trash2 size={18} /> Delete Pocket
            </button>
          </div>
        )}

        {/* VIEW: LIST */}
        {view === 'list' && (
          <>
            <button 
                onClick={() => setView('add')}
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
                <Plus size={20} /> New Pocket
            </button>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {savingsPockets.length === 0 ? (
                 <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>
                    No saving pockets yet.
                 </div>
              ) : (
                savingsPockets.map(pocket => (
                  <div 
                    key={pocket.id} 
                    onClick={() => { setSelectedPocket(pocket); setView('detail'); }}
                    style={{
                      background: 'var(--bg-secondary)',
                      padding: '20px',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'transform 0.1s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <div style={{ 
                         background: 'rgba(255,255,255,0.05)', 
                         padding: '10px', 
                         borderRadius: '10px' 
                       }}>
                         <PiggyBank size={20} color="var(--accent-green)" />
                       </div>
                       <div>
                         <div style={{ fontWeight: '600', fontSize: '16px' }}>{pocket.name}</div>
                         <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Savings</div>
                       </div>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {formatCurrency(pocket.amount)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default SavingsPocketsModal;
