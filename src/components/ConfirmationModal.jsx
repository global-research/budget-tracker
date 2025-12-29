import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg-card)',
        width: '90%',
        maxWidth: '320px',
        borderRadius: '24px',
        padding: '24px',
        border: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center',
        animation: 'scaleUp 0.2s ease-out'
      }} onClick={e => e.stopPropagation()}>
        
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
          {title}
        </h3>
        
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.4' }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '16px',
              border: 'none',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '16px',
              border: 'none',
              background: 'var(--accent-blue)',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
