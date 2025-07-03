import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const CheckoutSuccess = () => {
  return (
    <div className="max-w-2xl mx-auto text-center py-20 px-4">
      <FaCheckCircle className="text-green-500 text-6xl mb-4 mx-auto" />
      <h1 className="text-3xl font-bold mb-4">Payment Successful</h1>
      <p className="text-gray-700 mb-6">Thank you for your order. We’ve received your payment and will process your order shortly.</p>
      <Link to="/store" className="bg-[#4B371C] text-white px-6 py-3 rounded hover:bg-[#3a2b15]">
        Continue Shopping
      </Link>
    </div>
  );
};

export default CheckoutSuccess;
