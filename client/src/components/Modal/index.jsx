import React from 'react';
import './style.css';

const Modal = ({ children }) => {
  return (
      <div className='modal-wrapper'>
          <div className='modal-content'>
            {children}
          </div>
      </div>
  )
};

export default Modal;
