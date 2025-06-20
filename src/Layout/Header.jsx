import React, { useState, useEffect } from "react";
import SectionGallery from '../Components/Menus/SectionGallery';
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { FiShoppingCart, FiUser, FiMenu } from 'react-icons/fi';
import { useUserStore } from "../store/useUserStore";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, cart } = useUserStore(); // Get user and cart state
  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-[#4B371C]">
        {/* LOGO */}
        <Link to="/" onClick={() => setIsOpen(false)}>
          <h1 className="text-xl sm:text-3xl font-bold text-[#E6DACD]">
            THE COMPANY
          </h1>
        </Link>

        {/* ICONS GROUP - Added this container */}
        <div className="flex items-center gap-4">
          {/* CART ICON */}
          <Link 
            to="/cart" 
            className="relative p-1 text-[#E6DACD] hover:text-[#f0e5d8] transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <FiShoppingCart className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E6DACD] text-[#4B371C] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* USER ICON */}
          <Link 
            to={user ? "/account" : "/login"} 
            className="p-1 text-[#E6DACD] hover:text-[#f0e5d8] transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <FiUser className="w-6 h-6" />
          </Link>

          {/* BURGER BUTTON */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-8 h-6 focus:outline-none"
          >
            <motion.span
              className={`absolute left-0 w-full h-[2px] bg-[#E6DACD] transition-transform duration-300 ${
                isOpen ? 'rotate-45 top-1/2' : 'top-0'
              }`}
            ></motion.span>
            <motion.span
              className={`absolute left-0 w-full h-[2px] bg-[#E6DACD] transition-all duration-300 ${
                isOpen ? 'opacity-0' : 'top-1/2 -translate-y-1/2'
              }`}
            ></motion.span>
            <motion.span
              className={`absolute left-0 w-full h-[2px] bg-[#E6DACD] transition-transform duration-300 ${
                isOpen ? '-rotate-45 top-1/2' : 'bottom-0'
              }`}
            ></motion.span>
          </motion.button>
        </div>
      </header>

      {/* Smooth menu animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-40"
          >
            <SectionGallery onClose={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;