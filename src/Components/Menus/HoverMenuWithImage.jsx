import React, { useState, useEffect } from 'react';

const menuItems = [
  { id: '1', title: 'EDITORIALS', subtitle: 'TESTING MORE LINES', image: 'https://placehold.co/600x600' },
  { id: '2', title: 'MENSWEAR', subtitle: 'TESTING MORE LINE', image: 'https://placehold.co/600x600' },
  { id: '3', title: 'FASHION', subtitle: 'TESTING MORE LINES', image: 'https://placehold.co/600x600' },
  { id: '4', title: 'NEWSPAPER', subtitle: 'TESTING MORE LINES', image: 'https://placehold.co/600x600' },
  { id: '5', title: 'CLIPS', subtitle: 'TESTING MORE THIS', image: 'https://placehold.co/600x600' },
];

const HoverMenuWithImage = () => {
  const [hoveredId, setHoveredId] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 768); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-20">
      {menuItems.map((item) => (
        <div
          key={item.id}
          className="w-full max-w-4xl border-b border-[#4B371C] py-4 relative group"
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
      <h1 className="text-8xl sm:text-2xl md:text-8xl font-bold text-[#4B371C] relative overflow-hidden min-h-[5rem] sm:min-h-[6rem] md:min-h-[8rem] leading-tight">
            {/* Title (Always visible) */}
            <span className="absolute top-0 left-0">{item.title}</span>

            {/* Subtitle only transitions on large screens */}
            {isLargeScreen && (
              <span
                className={`absolute top-0 left-0 text-[#E0E0E0] bg-[#4B371C] w-full px-4 py-1 whitespace-normal break-words leading-snug transition-all duration-300 ${
                  hoveredId === item.id ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                }`}
              >
                {item.subtitle}
              </span>
            )}
          </h1>

          {/* Image only shown on medium and larger screens */}
          {isLargeScreen && (
            <img
              src={item.image}
              alt=""
              className={`absolute top-1/2 left-[80%] w-64 h-64 object-cover border border-[#4B371C] rounded-xl shadow-lg transform -translate-y-1/2 transition-all duration-300 pointer-events-none ${
                hoveredId === item.id ? 'opacity-100 scale-150' : 'opacity-0 scale-95'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default HoverMenuWithImage;
