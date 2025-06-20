import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const DestinationPage = () => {
  const headerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    // Check if we have transition data
    const transitionData = sessionStorage.getItem('transitionImage');
    
    if (transitionData) {
      const { src, alt } = JSON.parse(transitionData);
      
      // Create temporary image for transition
      const tempImg = document.createElement('img');
      tempImg.src = src;
      tempImg.alt = alt;
      tempImg.style.position = 'fixed';
      tempImg.style.top = '0';
      tempImg.style.left = '0';
      tempImg.style.width = '100vw';
      tempImg.style.height = '100vh';
      tempImg.style.objectFit = 'cover';
      tempImg.style.zIndex = '1000';
      document.body.appendChild(tempImg);
      
      // Set the header image
      headerRef.current.style.backgroundImage = `url(${src})`;
      
      // Animate content in
      gsap.set(contentRef.current, { opacity: 0 });
      
      // Animation sequence
      gsap.to(tempImg, {
        opacity: 0,
        duration: 0.5,
        delay: 0.3,
        onComplete: () => {
          tempImg.remove();
          gsap.to(contentRef.current, { opacity: 1, duration: 0.5 });
        }
      });
      
      // Clear the transition data
      sessionStorage.removeItem('transitionImage');
    } else {
      // No transition - just show content
      gsap.set(contentRef.current, { opacity: 1 });
    }
  }, []);

  return (
    <div className="destination-page">
      <div 
        ref={headerRef} 
        className="fullscreen-header"
      />
      <div ref={contentRef} className="page-content">
        {/* Your page content here */}
        <h1>Welcome to the Destination Page</h1>
        <p>This content fades in after the transition completes.</p>
      </div>
    </div>
  );
};

export default DestinationPage;