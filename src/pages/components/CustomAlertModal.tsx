import React from 'react';

// 커스텀 알림 모달의 props로는 모달을 보여줄지 말지 결정하는 `isOpen`, 모달을 닫는 함수 `onClose`, 그리고 알림 내용 `message`를 받습니다.
const CustomAlertModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null; // isOpen이 false면 아무것도 렌더링하지 않음

  return (
    <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '100' }}>
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '5px', width: '80%', maxWidth: '400px' }}>
        <p>Share URL</p>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CustomAlertModal;
