import React from 'react';

export const Modal = ({ isOpen, onClose, title, children, onSave, saveButtonText = "💾 Guardar" }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close" onClick={onClose}>✖️</button>
                </div>
                
                <div className="modal-body">
                    {children}
                </div>
                
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>
                        ❌ Cancelar
                    </button>
                    <button className="btn-primary" onClick={onSave}>
                        {saveButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};