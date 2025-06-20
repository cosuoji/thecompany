import { motion } from 'framer-motion';
import MessageForm from './Forms/ContactMessageForm';

const SendMessage = () => {
  return (
    <div className="py-12 px-6 md:px-12 lg:px-24">
      <motion.div 
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* First Column */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-medium text-[#4B371C] mb-4">
              Speak with our online team
            </h2>
            <p className="text-[#4B371C] opacity-90 leading-relaxed">
              Our dedicated website team works from the Lagos and monitors requests and messages on a daily basis. 
              We aim to respond to all enquiries within 24 hours.
            </p>
          </motion.div>

          {/* Second Column */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <MessageForm />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SendMessage;