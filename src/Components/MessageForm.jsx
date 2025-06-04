import { motion } from 'framer-motion';

const MessageForm = () => {
  return (
    <motion.form 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* New Select Dropdown */}
      <div>
        <label htmlFor="inquiry" className="block text-sm font-medium text-[#4B371C] mb-1">
          Reason for Inquiry
        </label>
        <div className='relative'>

        
        <motion.select
          id="inquiry"
          whileFocus={{ borderColor: "#4B371C", boxShadow: "0 0 0 1px #4B371C" }}
          className="w-full px-4 py-2 border border-[#E0E0E0] bg-white text-[#4B371C] focus:outline-none focus:ring-1 pr-10 focus:ring-[#4B371C] appearance-none"
          required
        >
          <option value="" disabled selected>Select an option</option>
          <option value="customer-service">Online Customer Services</option>
          <option value="marketing">Marketing</option>
          <option value="general">General Inquiries</option>
        </motion.select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-[#4B371C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
        </div>
      </div>

      {/* Existing Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#4B371C] mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-4 py-2 border border-[#E0E0E0] bg-white text-[#4B371C] focus:outline-none focus:ring-1 focus:ring-[#4B371C]"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#4B371C] mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border border-[#E0E0E0] bg-white text-[#4B371C] focus:outline-none focus:ring-1 focus:ring-[#4B371C]"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-[#4B371C] mb-1">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          className="w-full px-4 py-2 border border-[#E0E0E0] bg-white text-[#4B371C] focus:outline-none focus:ring-1 focus:ring-[#4B371C]"
          required
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-[#4B371C] mb-1">
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          className="w-full px-4 py-2 border border-[#E0E0E0] bg-white text-[#4B371C] focus:outline-none focus:ring-1 focus:ring-[#4B371C]"
          required
        ></textarea>
      </div>

      <motion.button
        type="submit"
        className="px-6 py-3 bg-[#4B371C] text-white hover:bg-[#3A2E26] transition-colors duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Send Message
      </motion.button>
    </motion.form>
  );
};

export default MessageForm;