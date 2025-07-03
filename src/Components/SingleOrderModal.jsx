import { useEffect } from "react";
import SingleOrderPage from "../Pages/SingleOrderPage";


const SingleOrderModal = ({ orderId, onClose }) => {

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-red-600 font-bold text-xl"
        >
          ×
        </button>
        {/* Reuse the existing SingleOrderPage component by passing orderId as prop */}
        <SingleOrderPage orderId={orderId} isAdminView />
      </div>
    </div>
  );
};

export default SingleOrderModal;
