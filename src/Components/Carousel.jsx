import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';


const InstagramCarousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleSlides = 2.2; // Show two full images and a peek of the third

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  return (
<div className="relative pt-28 pb-12 px-4 md:px-8">
{/* Instagram Heading */}
<h2 
  className="absolute z-40 top-1/6 left-4 md:left-8 text-[14vw] sm:text-[10vw] md:text-[6vw] font-bold tracking-wider text-[#4B371C] pointer-events-none leading-none"
  style={{ whiteSpace: 'nowrap' }}
>
  INSTAGRAM
</h2>

{/* Carousel goes here */}
<div className="relative max-w-6xl mx-auto overflow-hidden">
<div className="relative max-w-6xl  overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(-${(currentIndex * 100) / visibleSlides}%)`,
            width: `${(items.length * 100) / visibleSlides}%`,
          }}
        >
          {items.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[45%] md:w-[calc(100%/2.2)] mr-4 flex-shrink-0 overflow-hidden rounded-xl shadow-md"
            >
              <img
                src={item.image}
                alt={`Instagram ${idx}`}
                className="w-full h-64 object-cover"
              />
            </a>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
            onClick={prevSlide}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-[#4B371C] text-[#E0E0E0] w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-md z-20"
          >
            <FaArrowLeft />
          </button>

          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-[#4B371C] text-[#E0E0E0] w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-md z-20"
          >
            <FaArrowRight />
          </button>
      </div>
</div>
</div>
  );
};

export default InstagramCarousel;
