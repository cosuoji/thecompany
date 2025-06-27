import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { FiShoppingCart, FiUser, FiX, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { useUserStore } from "../store/useUserStore";
import { useCartStore } from "../store/useCartStore";
import { toast } from "react-hot-toast";
import CartPage from "../Pages/Cart";
import BentoMenu from "../Components/Menus/BentoMenu";
import CurrencySwitcher from "../Components/CurrencyComponents/CurrencySwitcher";
import { useRedirect } from "../hooks/useRedirect";



const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const { user, checkingAuth } = useUserStore();
  const { 
    cart, 
    loading, 
    updateCartItem, 
    removeFromCart, 
    clearCart, 
    getCartTotal,
    fetchCart 
  } = useCartStore();
  
  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  const { setRedirect } = useRedirect();


  // Handle body overflow when either modal is open
  useEffect(() => {
    document.body.style.overflow = (isMenuOpen || isCartOpen) ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isMenuOpen, isCartOpen]);

  // Close modals when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsCartOpen(false);
  }, [location]);

  // Fetch cart when cart modal opens
  useEffect(() => {
    if (isCartOpen && user && !checkingAuth) {
      fetchCart();
    }
  }, [isCartOpen, user, checkingAuth]);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isCartOpen) setIsCartOpen(false);
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartItem(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId) => {
    await removeFromCart(itemId);
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      await clearCart();
      toast.success("Cart cleared");
    }
  };

  return (
    <>
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-[#4B371C]">
        {/* LOGO */}
        <Link to="/" onClick={() => {
          setIsMenuOpen(false);
          setIsCartOpen(false);
        }}>
          <h1 className="text-xl sm:text-3xl font-bold text-[#E6DACD]">
            THE COMPANY
          </h1>
        </Link>

        {/* ICONS GROUP */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="">
            <CurrencySwitcher />
          </div>
          {/* CART ICON */}
          <button 
            className="relative p-1 text-[#E6DACD] hover:text-[#f0e5d8] transition-colors"
            onClick={toggleCart}
          >
            <FiShoppingCart className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E6DACD] text-[#4B371C] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* USER ICON */}

          <Link 
            to={user ? "/account" : "/login"} 
            className="p-1 text-[#E6DACD] hover:text-[#f0e5d8] transition-colors"
            onClick={() => {
              if (!user) {
                setRedirect(); // Store current path before redirecting to login
              }
              setIsMenuOpen(false);
              setIsCartOpen(false);
            }}
          >
            <FiUser className="w-6 h-6" />
          </Link>

          {/* BURGER BUTTON */}
          <motion.button
            onClick={toggleMenu}
            className="relative w-8 h-6 focus:outline-none"
          >
            <motion.span
              className={`absolute left-0 w-full h-[2px] bg-[#E6DACD] transition-transform duration-300 ${
                isMenuOpen ? 'rotate-45 top-1/2' : 'top-0'
              }`}
            ></motion.span>
            <motion.span
              className={`absolute left-0 w-full h-[2px] bg-[#E6DACD] transition-all duration-300 ${
                isMenuOpen ? 'opacity-0' : 'top-1/2 -translate-y-1/2'
              }`}
            ></motion.span>
            <motion.span
              className={`absolute left-0 w-full h-[2px] bg-[#E6DACD] transition-transform duration-300 ${
                isMenuOpen ? '-rotate-45 top-1/2' : 'bottom-0'
              }`}
            ></motion.span>
          </motion.button>
        </div>
      </header>

      {/* Menu Modal */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-40"
          >
            {/* <SectionGallery onClose={() => setIsMenuOpen(false)} /> */}
            <BentoMenu onClose={() => setIsMenuOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Modal */}
{/* Cart Modal */}
<AnimatePresence>
  {isCartOpen && (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-40 bg-black"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Side Cart Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md h-full bg-[#E6DACD] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#4B371C]/20 bg-[#4B371C] text-[#E6DACD]">
          <h2 className="text-xl font-bold">Your Cart ({cartItemCount})</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-1 rounded-full hover:bg-[#E6DACD]/10"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        {!user && (
          <div className="mt-4 text-center">
            <Link to="/login">
              <button
                className="px-6 py-2 text-sm sm:text-base bg-[#4B371C] text-[#E6DACD] rounded-full shadow-md hover:bg-[#3c2d15] transition duration-300"
              >
                Login to add items to cart
              </button>
            </Link>
          </div>
        )}

        {/* Cart Content */}
        <CartPage />
      </motion.div>
    </>
  )}
</AnimatePresence>

    </>
  );
};

export default Header;