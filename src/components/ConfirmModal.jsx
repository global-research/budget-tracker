import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', cancelText = 'Cancel' }) => {
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
      zIndex: 1100, // Higher than other modals
      backdropFilter: 'blur(4px)'
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg-card)',
        width: '90%',
        maxWidth: '320px',
        borderRadius: '24px',
        padding: '24px',
        animation: 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }} onClick={e => e.stopPropagation()}>
        
        <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(255, 69, 58, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            color: 'var(--accent-red)'
        }}>
            <AlertTriangle size={24} />
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: 'white' }}>
            {title}
        </h3>
        
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.4' }}>
            {message}
        </p>

        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
            <button 
                onClick={onClose}
                style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                }}
            >
                {cancelText}
            </button>
            <button 
                onClick={() => {
                    onConfirm();
                    onClose();
                }}
                style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'var(--accent-red)',
                    border: 'none',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                }}
            >
                {confirmText}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
