import { motion } from 'framer-motion';
import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import ElegantButton from '../Buttons/ElegantButton';
const MessageForm = () => {

  const [state, handleSubmit] = useForm("mjkryong");
  

  if (state.succeeded) {
    return <p className='px-20 text-center py-10'>Thanks for reaching out!</p>;
}

  return (
    <motion.form 
      className="space-y-4"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }} 
      method='POST'
    >
      {/* New Select Dropdown */}
      <div>
        <label htmlFor="inquiry" className="block text-sm font-medium text-[#4B371C] mb-1">
          Reason for Inquiry
        </label>
        <div className='relative'>

        
        <motion.select
          id="inquiry"
          name='inquiry'
          whileFocus={{ borderColor: "#4B371C", boxShadow: "0 0 0 1px #4B371C" }}
          className="w-full px-4 py-2 border border-[#E0E0E0] bg-white text-[#4B371C] focus:outline-none focus:ring-1 pr-10 focus:ring-[#4B371C] appearance-none"
          required
        >
          <option defaultValue="" disabled>Select an option</option>
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
            name='name'
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
            name='name'
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
          name='name'
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
          name='name'
          rows={4}
          className="w-full px-4 py-2 border border-[#E0E0E0] bg-white text-[#4B371C] focus:outline-none focus:ring-1 focus:ring-[#4B371C]"
          required
        ></textarea>
      </div>

    
      <ElegantButton label={state.submitting ? 'Sending...' : 'Send Message'} state={state.submitting}/>
    

    </motion.form>
  );
};

export default MessageForm;
