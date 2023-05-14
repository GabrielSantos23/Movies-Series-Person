import React, { useEffect } from 'react';
import { AiFillCloseSquare } from 'react-icons/ai';

interface ModalProps {
  link: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ link, onClose }) => {
  const handleBackgroundClick = (event: any) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    // Desabilitar o scroll quando o modal estiver aberto
    document.body.style.overflow = 'hidden';

    // Habilitar o scroll quando o modal for fechado
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return '';
  // <div
  //   style={{
  //     position: 'fixed',
  //     top: 0,
  //     left: 0,
  //     width: '100%',
  //     height: '100%',
  //     backgroundColor: 'rgba(0, 0, 0, 0.8)',
  //     display: 'flex',
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     zIndex: '9999',
  //   }}
  //   onClick={handleBackgroundClick}
  // >
  //   <div
  //     style={{
  //       position: 'relative',
  //       display: 'flex',
  //       justifyContent: 'center',
  //       alignItems: 'center',
  //     }}
  //   >
  //     <button
  //       onClick={onClose}
  //       style={{ position: 'absolute', top: '10px', left: '10px' }}
  //     >
  //       <AiFillCloseSquare />
  //     </button>
  //     <iframe
  //       src={link}
  //       style={{ width: '80vw', height: '80vh', border: 'none' }}
  //       allowFullScreen
  //       sandbox='allow-same-origin allow-scripts allow-forms allow-popups'
  //       target='_self'
  //       allow='picture-in-picture'
  //     />
  //   </div>
  // </div>
};

export default Modal;
