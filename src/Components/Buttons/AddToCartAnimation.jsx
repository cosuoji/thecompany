import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { useCartStore } from '../../store/useCartStore';


gsap.registerPlugin(MorphSVGPlugin);

const AddToCartAnimation = ({ label, productId, productType }) => {
  const buttonRef = useRef(null);
  const morphRef = useRef(null);
  const shirtRefs = useRef([]);
  const addToCart = useCartStore(state => state.addToCart);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const morph = morphRef.current;
    const shirts = Array.from(button.querySelectorAll('.shirt svg > path'));
    shirtRefs.current = shirts;

    const handlePointerDown = () => {
      if (button.classList.contains('active')) return;
      
      gsap.to(button, {
        '--background-scale': 0.97,
        duration: 0.1 // Faster press effect
      });
    };

    const handleClick = (e) => {
      e.preventDefault();
      if (button.classList.contains('active')) return;
      
      button.classList.add('active');
      
      // Main timeline with faster durations
      const tl = gsap.timeline({
        defaults: { 
          ease: "power2.out",
          duration: 0.15 // Default faster duration
        }
      });
      
      // Background scale animation (faster)
      tl.to(button, {
        '--background-scale': 0.97,
        duration: 0.1
      }).to(button, {
        '--background-scale': 1,
        delay: 0.08, // Reduced delay
        duration: 0.8, // Faster bounce
        ease: 'elastic.out(1, 0.8)' // Slightly tighter elastic
      });

      // Shirt animation (faster)
      tl.to(button, {
        '--shirt-scale': 1,
        '--shirt-y': '-42px',
        '--cart-x': '0px',
        '--cart-scale': 1,
        duration: 0.25, // Faster
        ease: 'power2.in'
      }, 0)
      .to(button, {
        '--shirt-y': '-40px',
        duration: 0.2 // Faster
      }, 0.25)
      .to(button, {
        '--shirt-y': '16px',
        '--shirt-scale': 0.9,
        duration: 0.15, // Faster
        ease: 'none'
      }, 0.45)
      .to(button, {
        '--shirt-scale': 0,
        duration: 0.2, // Faster
        ease: 'none'
      }, 0.6);

      // Shirt second part animation (faster)
      tl.to(button, {
        '--shirt-second-y': '0px',
        delay: 0.5, // Sooner
        duration: 0.08 // Faster
      });

      // Cart animation (faster)
      tl.to(button, {
        '--cart-clip': '12px',
        '--cart-clip-x': '3px',
        delay: 0.55, // Sooner
        duration: 0.04 // Faster
      })
      .to(button, {
        '--cart-y': '2px',
        duration: 0.07 // Faster
      }, 0.59)
      .to(button, {
        '--cart-tick-offset': '0px',
        '--cart-y': '0px',
        duration: 0.15, // Faster
        onComplete() {
          button.style.overflow = 'hidden';
        }
      }, 0.66)
      .to(button, {
        '--cart-x': '52px',
        '--cart-rotate': '-15deg',
        duration: 0.15 // Faster
      }, 0.81)
      .to(button, {
        '--cart-x': '104px',
        '--cart-rotate': '0deg',
        duration: 0.15, // Faster
        clearProps: true,
        onComplete() {
          button.style.overflow = 'hidden';
          button.style.setProperty('--text-o', 0);
          button.style.setProperty('--text-x', '0px');
          button.style.setProperty('--cart-x', '-104px');
        }
      }, 0.96)
      .to(button, {
        '--text-o': 1,
        '--text-x': '12px',
        '--cart-x': '-48px',
        '--cart-scale': 0.75,
        duration: 0.2, // Slightly longer for final smoothness
        clearProps: true,
        onComplete() {
          button.classList.remove('active');
        }
      }, 1.11);

      // Text opacity animation (faster)
      tl.to(button, {
        '--text-o': 0,
        duration: 0.2 // Faster
      }, 0);

      // Morph SVG animation (faster)
      tl.to(morph, {
        morphSVG: 'M0 12C6 12 20 10 32 0C43.9024 9.99999 58 12 64 12V13H0V12Z',
        duration: 0.15, // Faster
        ease: 'power2.out'
      }, 0)
      .to(morph, {
        morphSVG: 'M0 12C6 12 17 12 32 12C47.9024 12 58 12 64 12V13H0V12Z',
        duration: 0.1, // Faster
        ease: 'none'
      }, 0.15);

      // Shirt morph animation (faster)
      shirts.forEach(shirt => {
        tl.to(shirt, {
          morphSVG: 'M4.99997 3L8.99997 1.5C8.99997 1.5 10.6901 3 12 3C13.3098 3 15 1.5 15 1.5L19 3L23.5 8L20.5 11L19 9.5L18 22.5C18 22.5 14 21.5 12 21.5C10 21.5 5.99997 22.5 5.99997 22.5L4.99997 9.5L3.5 11L0.5 8L4.99997 3Z',
          duration: 0.15, // Faster
          delay: 0.15 // Sooner
        })
        .to(shirt, {
          morphSVG: 'M4.99997 3L8.99997 1.5C8.99997 1.5 10.6901 3 12 3C13.3098 3 15 1.5 15 1.5L19 3L23.5 8L20.5 11L19 9.5L18.5 22.5C18.5 22.5 13.5 22.5 12 22.5C10.5 22.5 5.5 22.5 5.5 22.5L4.99997 9.5L3.5 11L0.5 8L4.99997 3Z',
          duration: 0.6, // Faster
          ease: 'elastic.out(1, 0.7)' // Tighter elastic
        }, 0.3)
        .to(shirt, {
          morphSVG: 'M4.99997 3L8.99997 1.5C8.99997 1.5 10.6901 3 12 3C13.3098 3 15 1.5 15 1.5L19 3L22.5 8L19.5 10.5L19 9.5L17.1781 18.6093C17.062 19.1901 16.778 19.7249 16.3351 20.1181C15.4265 20.925 13.7133 22.3147 12 23C10.2868 22.3147 8.57355 20.925 7.66487 20.1181C7.22198 19.7249 6.93798 19.1901 6.82183 18.6093L4.99997 9.5L4.5 10.5L1.5 8L4.99997 3Z',
          duration: 0,
          delay: 0.9 // Sooner
        }, 0.9);
      });
    };

    button.addEventListener('pointerdown', handlePointerDown);
    button.addEventListener('click', handleClick);

    return () => {
      button.removeEventListener('pointerdown', handlePointerDown);
      button.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="white">
      <button 
        ref={buttonRef}
        className="add-to-cart"
        onClick={() => addToCart(productId, productType)}

      >
        <span>{label}</span>
        <svg className="morph" viewBox="0 0 64 13">
          <path 
            ref={morphRef}
            d="M0 12C6 12 17 12 32 12C47.9024 12 58 12 64 12V13H0V12Z" 
          />
        </svg>
        <div class="shirt">
            <svg class="first" fill="#4B371C" width="64px" height="64px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#4B371C"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M20.276,2.553,22,6H2L3.724,2.553A1,1,0,0,1,4.618,2H19.382A1,1,0,0,1,20.276,2.553ZM2,8H22V21a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1ZM5,18a1,1,0,0,0,1,1h4a1,1,0,0,0,0-2H6A1,1,0,0,0,5,18Z"></path></g></svg>
           <svg class="second" fill="#4B371C" width="64px" height="64px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#4B371C"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M20.276,2.553,22,6H2L3.724,2.553A1,1,0,0,1,4.618,2H19.382A1,1,0,0,1,20.276,2.553ZM2,8H22V21a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1ZM5,18a1,1,0,0,0,1,1h4a1,1,0,0,0,0-2H6A1,1,0,0,0,5,18Z"></path></g></svg>
        </div>
        <div className="cart">
          <svg viewBox="0 0 36 26">
            <path d="M1 2.5H6L10 18.5H25.5L28.5 7.5L7.5 7.5" className="shape" />
            <path d="M11.5 25C12.6046 25 13.5 24.1046 13.5 23C13.5 21.8954 12.6046 21 11.5 21C10.3954 21 9.5 21.8954 9.5 23C9.5 24.1046 10.3954 25 11.5 25Z" className="wheel" />
            <path d="M24 25C25.1046 25 26 24.1046 26 23C26 21.8954 25.1046 21 24 21C22.8954 21 22 21.8954 22 23C22 24.1046 22.8954 25 24 25Z" className="wheel" />
            <path d="M14.5 13.5L16.5 15.5L21.5 10.5" className="tick" />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default AddToCartAnimation;