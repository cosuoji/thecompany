import { FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ElegantButton = ({ label, state }) => {
  const isSubmitting = state === true;

  return (
    <button
      type="submit"
      className={`
        group relative overflow-hidden
        flex items-center justify-start
        bg-[#E6DACD]
        text-[#E6DACD]
        rounded-full
        transition-all duration-300 ease-in-out
        hover:bg-black hover:text-[#E6DACD]
        px-2 py-2 pl-2 pr-2 md:pl-4 md:pr-6
        ${isSubmitting ? 'pointer-events-none' : ''}
      `}
    >
      {/* Background Pulse While Submitting */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            className="absolute inset-0 z-0 bg-[#E6DACD]"
            initial={{ opacity: 0.3, scaleX: 0 }}
            animate={{ opacity: 0.5, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            transition={{
              repeat: Infinity,
              repeatType: "mirror",
              duration: 1.5,
              ease: "easeInOut"
            }}
            style={{ transformOrigin: 'left' }}
          />
        )}
      </AnimatePresence>

      {/* Icon Circle */}
      <span
        className="
          relative z-10 flex items-center justify-center
          w-10 h-10
          bg-black
          text-[#E6DACD]
          rounded-full
          transition-all duration-300
          group-hover:bg-[#f4e6cd]
          group-hover:text-[#333]
        "
      >
        <FaArrowRight
          className={`
            transition-transform duration-300
            ${isSubmitting ? 'animate-spin' : 'rotate-[-45deg] group-hover:rotate-0'}
          `}
        />
      </span>

      {/* Label */}
      <span
        className="
          relative z-10 ml-0 overflow-hidden
          max-w-0 group-hover:max-w-[200px]
          whitespace-nowrap
          text-base font-medium
          transition-all duration-300 ease-in-out
          group-hover:ml-4
          px-3
        "
      >
        {label}
      </span>
    </button>
  );
};

export default ElegantButton;
