import React, { useEffect, useRef } from 'react';


const DeleteButton = ({ children }) => {
  const buttonRef = useRef(null);
  const spanRef = useRef(null);

  useEffect(() => {
    // Vanilla JS hover effects will be converted here
    const button = buttonRef.current;
    
    const handleMouseEnter = () => {
      button.style.setProperty('--button-bg', '#000');
      button.style.setProperty('--button-scale', '0.7');
      button.style.setProperty('--button-clip-path', 
        'polygon(30% 10%, 10% 30%, 30% 50%, 10% 70%, 30% 90%, 50% 70%, 70% 90%, 90% 70%, 70% 50%, 90% 30%, 70% 10%, 50% 30%)');
      
      if (spanRef.current) {
        spanRef.current.style.transform = 'scale3d(0.1, 0.1, 1)';
        spanRef.current.style.opacity = '0';
      }
    };

    const handleMouseLeave = () => {
      button.style.setProperty('--button-bg', '#e7e7e7');
      button.style.setProperty('--button-scale', '1');
      button.style.setProperty('--button-clip-path', 
        'polygon(20% 30%, 0 30%, 0 50%, 0 70%, 20% 70%, 50% 70%, 80% 70%, 100% 70%, 100% 50%, 100% 30%, 80% 30%, 50% 30%)');
      
      if (spanRef.current) {
        spanRef.current.style.transform = 'scale3d(1, 1, 1)';
        spanRef.current.style.opacity = '1';
      }
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <button ref={buttonRef} className="button--rhea">
      <span ref={spanRef}>{children}</span>
    </button>
  );
};

export default DeleteButton;