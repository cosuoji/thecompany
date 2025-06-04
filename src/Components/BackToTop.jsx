import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
      className={`fixed bottom-8 right-8 flex items-center gap-2 transition-opacity ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      whileHover={{
        scale: 1.2,
      }}
    >
      {/* Button with new colors */}
      <motion.button
        className="p-3 rounded-full bg-[#4B371C] text-[#E0E0E0] shadow-md"
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <FaArrowUp className="text-lg" />
      </motion.button>

      {/* Vertical text with same background */}
      <motion.span
        className="hidden sm:block bg-[#E0E0E0] text-[#4B371C] text-xs uppercase tracking-wider px-2 py-1 rounded"
        style={{ writingMode: 'vertical-rl' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ delay: 0.2 }}
      >
        Back to top
      </motion.span>
    </motion.div>
  );
};

export default BackToTop;
