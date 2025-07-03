import React, { useState } from 'react';
import axiosInstance from '../lib/axios';
import { useUserStore } from '../store/useUserStore';
import { useCartStore } from '../store/useCartStore';

const PaystackComponent = ({ products, totalAmount, formData, disabled }) => {
  const { user } = useUserStore();
  const email = user?.user?.email;
  const [loading, setLoading] = useState(false);
  const {clearCart} = useCartStore()

  const initializePayment = async () => {
    if (disabled || loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.post('/orders/payment', {
        products,
        amount: totalAmount,
        email,
        formData,
      });

      const { authorizationUrl, reference } = response.data;
      const paymentWindow = window.open(authorizationUrl);

      let pollCount = 0;
      const maxPolls = 20;

      const poll = setInterval(async () => {
        pollCount++;

        try {
          const statusRes = await axiosInstance.get(`/orders/payment/${reference}`);
          const status = statusRes.data.status;

          if (status === 'Successful') {
            clearInterval(poll);
            if (!paymentWindow.closed) paymentWindow.close();
            await clearCart()
            window.location.href = '/checkout-success';
          }
        } catch (err) {
          // ignore 404 errors during polling
        }

        if (paymentWindow.closed || pollCount >= maxPolls) {
          clearInterval(poll);
          try {
            const finalStatus = await axiosInstance.get(`/orders/payment/${reference}`);
            if (finalStatus.data.status === 'Successful') {
              return window.location.href = '/checkout-success';
            }
          } catch (err) {
            // Still fail
          }
          return window.location.href = '/checkout-failure';
        }
        
      }, 3000);
    } catch (error) {
      console.error('Error initializing payment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`w-full mt-6 py-3 px-4 rounded-md flex items-center justify-center transition-colors ${
        disabled || loading
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-[#4B371C] text-white hover:bg-[#3a2b15]'
      }`}
      onClick={initializePayment}
      disabled={disabled || loading}
    >
      {loading ? 'Processing...' : 'Pay with Paystack'}
    </button>
  );
};

export default PaystackComponent;
