import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import SEO from "../Components/SEO";

// Import your images
import last1Bg from "../assets/lasts/last1.png";
import last2Bg from "../assets/lasts/last2.png";
import last3Bg from "../assets/lasts/last3.png";

// Lasts data
const lastsData = [
  {
    id: "last1",
    name: "The Classic",
    description: "A timeless last shape, perfect for elegant designs.",
    modalContent:
      "The Classic last is designed for premium leather shoes with a rounded toe. Ideal for formal footwear.",
    specs: {
      ToeShape: "Rounded",
      IntendedUse: "Formal / Dress",
      FitProfile: "Standard",
      Construction: "Traditional",
    },
    bg: last1Bg,
  },
  {
    id: "last2",
    name: "The Sporty",
    description: "Dynamic last shape for comfort and movement.",
    modalContent:
      "The Sporty last features a wider forefoot and flexible profile for everyday comfort.",
    specs: {
      ToeShape: "Rounded / Athletic",
      IntendedUse: "Casual / Sport",
      FitProfile: "Wide",
      Construction: "Modern",
    },
    bg: last2Bg,
  },
  {
    id: "last3",
    name: "The Elegant",
    description: "Sleek last for dress shoes and formal wear.",
    modalContent:
      "The Elegant last tapers gently at the toe, creating a sharp, refined silhouette.",
    specs: {
      ToeShape: "Tapered",
      IntendedUse: "Formal",
      FitProfile: "Slim",
      Construction: "Refined",
    },
    bg: last3Bg,
  },
];

const Lasts = () => {
  const containerRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const activeLast = lastsData[activeIndex];

  /* MOBILE DETECTION */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* PARALLAX */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const bgX = useTransform(mouseX, [-0.5, 0.5], ["-3%", "3%"]);
  const bgY = useTransform(mouseY, [-0.5, 0.5], ["-3%", "3%"]);

  const handleMouseMove = (e) => {
    if (isMobile || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left - rect.width / 2) / rect.width);
    mouseY.set((e.clientY - rect.top - rect.height / 2) / rect.height);
  };

  return (
    <>
      <SEO
        title="Lasts | Olu The Maker"
        description="Explore our premium shoe lasts and last shapes"
        url="https://yourdomain.com/lasts"
      />

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative w-full h-screen overflow-hidden bg-white text-white"
      >
        {/* BACKGROUND */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLast.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            style={!isMobile ? { x: bgX, y: bgY } : {}}
          >
            <img
              src={activeLast.bg}
              alt={activeLast.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        </AnimatePresence>

        {/* PROGRESS INDICATOR */}
        <div className="absolute top-10 right-10 z-20 text-sm tracking-widest">
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(lastsData.length).padStart(2, "0")}
        </div>

        {/* LEFT CONTENT */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 max-w-md space-y-6 z-20">
          <h1 className="text-4xl md:text-6xl font-bold">
            {activeLast.name}
          </h1>

          <button
            onClick={() => setModalOpen(true)}
            className="text-lg md:text-xl font-semibold hover:text-[#E6DACD] transition"
          >
            <span className="hidden md:inline">explore this last</span>
            <span className="md:hidden">Tap to view</span>
          </button>

          <p className="text-sm md:text-base">{activeLast.description}</p>
        </div>

        {/* THUMBNAILS */}
        <div className="absolute bottom-10 right-10 flex gap-4 z-20">
          {lastsData.map((last, index) => (
            <motion.img
              key={last.id}
              src={last.bg}
              alt={last.name}
              className={`w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg cursor-pointer border-2 ${
                index === activeIndex
                  ? "border-white"
                  : "border-transparent"
              }`}
              onClick={() => setActiveIndex(index)}
              whileHover={{ scale: 1.1 }}
            />
          ))}
        </div>

        {/* MODAL */}
        <AnimatePresence>
          {modalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-30"
                onClick={() => setModalOpen(false)}
              />

              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="fixed inset-y-0 right-0 w-full md:w-2/3 bg-white text-black z-40 p-8 overflow-y-auto"
              >
                <button
                  onClick={() => setModalOpen(false)}
                  className="mb-6 font-bold text-lg"
                >
                  ← Back
                </button>

                <h2 className="text-3xl font-bold mb-4">
                  {activeLast.name}
                </h2>

                <p className="mb-8">{activeLast.modalContent}</p>

                {/* SPEC GRID */}
                <div className="grid grid-cols-2 gap-6 text-sm border-t pt-6">
                  {Object.entries(activeLast.specs).map(
                    ([label, value]) => (
                      <div key={label}>
                        <p className="uppercase tracking-wider text-gray-500">
                          {label.replace(/([A-Z])/g, " $1")}
                        </p>
                        <p className="font-semibold">{value}</p>
                      </div>
                    )
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Lasts;
