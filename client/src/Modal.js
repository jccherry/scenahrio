import React, { useState } from 'react';

function Modal({ isOpen, onClose, displayCloseButton = true, children }) {
  const modalStyle = {
    display: isOpen ? 'block' : 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
  };

  const modalContentStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'white',
    padding: '20px',
    borderRadius: '5px',
    width: '1000px',
    zIndex: 1,
  };

  return (
    <div style={modalStyle}>
      <div style={modalContentStyle}>
        {displayCloseButton && 
            <button onClick={onClose}>X</button>
        }
        {children}
      </div>
    </div>
  );
}

export default Modal;
