import React, { useState } from "react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ElegantButton from "../Buttons/ElegantButton";
import { Link } from "react-router-dom";

const slideVariants = {
  initial: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  exit: (direction) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
    transition: { duration: 0.6, ease: "easeIn" },
  }),
};

const ProductShowCase = ({ slides }) => {
  const [[index, direction], setIndex] = useState([0, 0]);

  const nextSlide = () => {
    setIndex(([prev]) => [
      (prev + 1) % slides.length,
      1, // direction right
    ]);
  };

  const prevSlide = () => {
    setIndex(([prev]) => [
      (prev - 1 + slides.length) % slides.length,
      -1, // direction left
    ]);
  };

  const slide = slides[index];

  return (
    <div
      className="relative max-h-[680px] h-[90vh] overflow-hidden rounded-md px-4 flex flex-col"
      style={{ backgroundColor: slide.bgColor }}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex flex-col lg:flex-row flex-grow w-full justify-center items-center py-8 lg:py-0"
        >
          {/* Small/Medium Layout: Buttons + Images in center */}
          <div className="flex items-center justify-center w-full lg:hidden mb-8">
            <button
              onClick={prevSlide}
              className="w-11 h-11 flex items-center justify-center rounded-full border border-black transition transform hover:bg-black hover:text-white hover:scale-110 hover:-translate-y-1 mr-4"
            >
              <FaArrowLeft />
            </button>

            <div className="relative w-72 h-72 sm:w-80 sm:h-80">
              <img
                src={slide.bottleBg}
                alt="Bottle Background"
                className="absolute inset-0 w-full h-full object-cover rounded-full scale-90"
              />
              <img
                src={slide.bottleImg}
                alt="Bottle"
                className="relative w-full h-full object-contain"
              />
            </div>

            <button
              onClick={nextSlide}
              className="w-11 h-11 flex items-center justify-center rounded-full border border-black transition transform hover:bg-black hover:text-white hover:scale-110 hover:-translate-y-1 ml-4"
            >
              <FaArrowRight />
            </button>
          </div>

          {/* Text Content */}
          <div className="w-full max-w-md text-center lg:text-left lg:mr-12">
            <div className="uppercase text-sm tracking-widest font-semibold mb-2">
              {slide.header}
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-light leading-none mb-4">
              {slide.title}
            </h1>
            <h2 className="font-serif text-2xl md:text-3xl font-light mb-6">
              {slide.subtitle}
            </h2>
            <h3 className="font-serif italic text-xl mb-3">
              {slide.contentTitle}
            </h3>
            <p className="text-sm leading-relaxed mb-6">
              {slide.content}
            </p>
            
            <div className="flex justify-center sm:-m-4 lg:justify-start">
             <ElegantButton label={"Shop Now"} />
          </div>

           
          </div>

          {/* Large Layout: Images only, buttons bottom-right */}
          <div className="relative hidden lg:flex justify-center items-center flex-shrink-0 w-[400px] h-[500px]">
            <img
              src={slide.bottleBg}
              alt="Bottle Background"
              className="
                absolute inset-0 w-full h-full object-cover rounded-full 
                scale-110 
                transition-transform duration-300
              "
            />
            <img
              src={slide.bottleImg}
              alt="Bottle"
              className="relative w-full h-full object-contain"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Large Layout: Nav buttons bottom-right */}
      <div className="hidden lg:flex absolute right-6 bottom-6 space-x-4">
        <button
          onClick={prevSlide}
          className="w-11 h-11 flex items-center justify-center rounded-full border border-black transition transform hover:bg-black hover:text-white hover:scale-110 hover:-translate-y-1"
        >
          <FaArrowLeft />
        </button>
        <button
          onClick={nextSlide}
          className="w-11 h-11 flex items-center justify-center rounded-full border border-black transition transform hover:bg-black hover:text-white hover:scale-110 hover:-translate-y-1"
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default ProductShowCase;
