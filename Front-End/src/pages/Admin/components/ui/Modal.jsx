import React from 'react';

const Modal = ({ children, onClose, title }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {title && (
                    <div className="modal-header">
                        <h3>{title}</h3>
                        <button className="modal-close" onClick={onClose}>✖</button>
                    </div>
                )}
                {!title && (
                    <button className="modal-close" onClick={onClose} style={{position: 'absolute', top: '15px', right: '15px', zIndex: 10}}>✖</button>
                )}
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export { Modal };
export default Modal;
