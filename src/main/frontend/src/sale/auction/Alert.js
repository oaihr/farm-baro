import React from 'react';
import './Alert.css'; // 알림창 스타일을 위한 CSS 파일

function Alert({ message, isOpen, onClose, onComplete }) {
  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
        onClose();
        if (onComplete) {
            onComplete();
        }
  };

  return (
    <div className="custom-alert-overlay">
      <div className="custom-alert-content">
        <p>{message}</p>
        <button onClick={handleClose}>확인</button>
      </div>
    </div>
  );
}

export default Alert;