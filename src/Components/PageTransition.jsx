import { motion } from 'framer-motion';

const PageTransition = ({ children }) => (
    <motion.div
      initial={{ y: 100, opacity: 0 }}  // Starts further down
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}    // Exits further up
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }} // Custom easing
    >
      {children}
    </motion.div>
  );

  
export default PageTransition;