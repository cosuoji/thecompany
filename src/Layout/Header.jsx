import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { FiShoppingCart, FiUser } from 'react-icons/fi';
import { useUserStore } from "../store/useUserStore";
import { useCartStore } from "../store/useCartStore";
import CurrencySwitcher from "../Components/CurrencyComponents/CurrencySwitcher";
import { useRedirect } from "../hooks/useRedirect";
import HoverBackgroundMenu from "../Components/Menus/BentoMenu";



const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  useEffect(() => {
  document.body.style.overflow = isMenuOpen ? "hidden" : "";
  return () => (document.body.style.overflow = "");
}, [isMenuOpen]);


  // Close modals when route changes
  useEffect(() => {
    setIsMenuOpen(false);

  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  
  };



  return (
    <>
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-black">
        {/* LOGO */}
        <Link to="/" onClick={() => {
          setIsMenuOpen(false);
        }}>
          <h1 className="text-xl sm:text-3xl font-bold text-[#E6DACD]">
            OLÚ THE MAKER
          </h1>
        </Link>

        {/* ICONS GROUP */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="">
            <CurrencySwitcher />
          </div>
          {/* CART ICON */}
         <Link
  to="/cart"
  className="relative p-1 text-[#E6DACD] hover:text-[#f0e5d8] transition-colors"
>
  <FiShoppingCart />
</Link>

          {/* USER ICON */}

          <Link 
            to={user ? "/account" : "/login"} 
            className="p-1 text-[#E6DACD] hover:text-[#f0e5d8] transition-colors"
            onClick={() => {
              if (!user) {
                setRedirect(); // Store current path before redirecting to login
              }
              setIsMenuOpen(false);
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
            <HoverBackgroundMenu onClose={() => setIsMenuOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Modal */}
{/* Cart Modal */}

    </>
  );
};

export default Header;