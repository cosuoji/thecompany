import { useEffect, useState } from 'react';
import AnimatedCursor from 'react-animated-cursor';

const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      // Only show on screens wider than 768px
      if (window.innerWidth >= 768) {
        setIsVisible(true);
      }
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => window.removeEventListener('load', handleLoad);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatedCursor
      innerSize={8}
      outerSize={8}
      color="75, 55, 28"
      outerAlpha={0.2}
      innerScale={0.7}
      outerScale={5}
      clickables={[
        'a',
        'input',
        'select',
        'textarea',
        'button',
        '.link',
        {
          target: '.custom',
          options: {
            innerSize: 12,
            outerSize: 12,
            color: '75, 55, 28',
            outerAlpha: 0.3,
            innerScale: 0.7,
            outerScale: 5
          }
        }
      ]}
      outerStyle={{
        mixBlendMode: 'exclusion',
        zIndex: 9999
      }}
    />
  );
};

export default CustomCursor;
