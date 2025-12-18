import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiInstagram, FiTwitter, FiMail } from "react-icons/fi";

// Background images
import blogsBg from "../../assets/slidermenu/blogs.jpg";
import magazineBg from "../../assets/slidermenu/magazine.jpg";
import storeBg from "../../assets/slidermenu/store.jpg";

const menuItems = [
  { label: "EDITORIALS", link: "/blog", bg: blogsBg },
  { label: "STORE", link: "/store", bg: storeBg },
  { label: "MAGAZINE", link: "/magazine", bg: magazineBg },
];

const letterVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: (i) => ({
    y: "0%",
    opacity: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const HoverBackgroundMenu = ({ onClose }) => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [activeItem, setActiveItem] = useState(menuItems[0]);
  const [isMobile, setIsMobile] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const pendingRoute = useRef(null);

  /* --------------------------------------------
     PARALLAX
  -------------------------------------------- */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const bgX = useTransform(mouseX, [-0.5, 0.5], ["-3%", "3%"]);
  const bgY = useTransform(mouseY, [-0.5, 0.5], ["-3%", "3%"]);

  const handleMouseMove = (e) => {
    if (isMobile || isExiting) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.width / 2) / rect.width);
    mouseY.set((e.clientY - rect.height / 2) / rect.height);
  };

  /* --------------------------------------------
     MOBILE DETECTION
  -------------------------------------------- */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* --------------------------------------------
     CLOSE ON ESC
  -------------------------------------------- */
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape" && !isExiting) onClose?.();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose, isExiting]);

  /* --------------------------------------------
     PAGE TRANSITION HANDLER
  -------------------------------------------- */
  const handleNavigate = (link) => {
    if (isExiting) return;
    pendingRoute.current = link;
    setIsExiting(true);

    setTimeout(() => {
      onClose?.();
      navigate(pendingRoute.current);
    }, 600);
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={() => !isExiting && onClose?.()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black overflow-hidden"
    >
      {/* BACKGROUND */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeItem.bg}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{
            opacity: 1,
            scale: isExiting ? 1.15 : 1,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={!isMobile ? { x: bgX, y: bgY } : {}}
          className="absolute inset-0"
        >
          <img
            src={activeItem.bg}
            alt={activeItem.label}
            className="w-full h-full object-cover"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/55" />

          {/* Grain overlay */}
          <div
            className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "url('https://grainy-gradients.vercel.app/noise.svg')",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* CONTENT */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 h-full flex flex-col items-center justify-center gap-16 px-6 md:px-16 text-center"
      >
        {/* MENU */}
        <nav className="flex flex-col gap-10 md:gap-8 items-center">
          {menuItems.map((item) => (
            <motion.div
              key={item.label}
              onMouseEnter={() => setActiveItem(item)}
              className="overflow-hidden"
            >
              <button
                onClick={() => handleNavigate(item.link)}
                disabled={isExiting}
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-wide text-[#E6DACD] hover:text-white transition-colors"
              >
                {item.label.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={letterVariants}
                    initial="hidden"
                    animate="visible"
                    className="inline-block"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </button>
            </motion.div>
          ))}
        </nav>

        {/* SOCIALS */}
        <div className="flex gap-6 text-[#E6DACD] justify-center">
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <FiInstagram size={22} className="hover:text-white transition" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <FiTwitter size={22} className="hover:text-white transition" />
          </a>
          <a href="mailto:hello@oluthemaker.com">
            <FiMail size={22} className="hover:text-white transition" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default HoverBackgroundMenu;
