import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';

const CheckoutFailed = () => {
  return (
    <div className="max-w-2xl mx-auto text-center py-20 px-4">
      <FaTimesCircle className="text-red-500 text-6xl mb-4 mx-auto" />
      <h1 className="text-3xl font-bold mb-4">Payment Failed</h1>
      <p className="text-gray-700 mb-6">Unfortunately, your payment didn’t go through. You can try again or choose another payment method.</p>
      <Link to="/checkout" className="bg-[#4B371C] text-white px-6 py-3 rounded hover:bg-[#3a2b15]">
        Try Again
      </Link>
    </div>
  );
};

export default CheckoutFailed;
