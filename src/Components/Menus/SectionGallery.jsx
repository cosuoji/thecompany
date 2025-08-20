import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import blogsBg from '../../assets/slidermenu/blogs.jpg'
import magazineBg from '../../assets/slidermenu/magazine.jpg'
import podcastBg from '../../assets/slidermenu/podcasts.jpg'
import collectionBg from '../../assets/slidermenu/collections.jpg'
import storeBg from '../../assets/slidermenu/store.jpg'
const sections = [
  {
    id: 's1',
    label: 'EDITORIALS',
    link: '/blog',
    background: blogsBg,
  },
  {
    id: 's2',
    label: 'COLLECTIONS',
    link: '/collections',
    background: collectionBg,
  },
  {
    id: 's3',
    label: 'PODCAST',
    link: '/podcast',
    background: podcastBg,
  },
  {
    id: 's4',
    label: 'STORE',
    link: '/store',
    background: storeBg,
  },
  {
    id: 's5',
    label: 'MAGAZINE',
    link: '/magazine',
    background: magazineBg,
  },
];

const SectionGallery = ({ onClose }) => {
  const [active, setActive] = useState('s1');
  const navigate = useNavigate();

  const activeSection = sections.find((s) => s.id === active);

  const handleExploreClick = () => {
    if (onClose) onClose(); // close menu
    navigate(activeSection.link); // navigate
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white">
      {/* Hidden Inputs */}
      {sections.map((section) => (
        <input
          key={section.id}
          type="radio"
          name="slide"
          id={section.id}
          className="hidden"
          checked={active === section.id}
          onChange={() => setActive(section.id)}
        />
      ))}

      {/* Main content */}
      <div className="flex w-full h-full relative z-10">
        {/* LEFT: Explore circle with persistent background */}
        <div className="w-1/2 flex items-center justify-center">
        <button
            onClick={handleExploreClick}
            className={`
              relative 
              rounded-full 
              flex items-center justify-center 
              text-xl sm:text-3xl md:text-5xl font-bold
              border-2 
              transition-all duration-500
              overflow-hidden
              w-[50vw] h-[50vw] max-w-[400px] max-h-[400px]
              border-[#4B371C] text-[#4B371C]
              hover:border-[#E6DACD] hover:text-[#E6DACD]
            `}
          >
            {/* Background image as an absolutely positioned layer */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${activeSection.background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.4, // <-- adjust this to control the image opacity
              }}
            />

            {/* Hover color overlay */}
            <div className="absolute inset-0  bg-opacity-80 hover:bg-[#4B371C] transition-all duration-500"></div>

            {/* Button text */}
            <span className="relative z-10">+ EXPLORE</span>
          </button>
        </div>

        {/* RIGHT: Labels */}
        <div className="w-1/2 flex items-center justify-center">
          <div className="flex flex-col text-3xl sm:text-4xl md:text-6xl gap-4">
            {sections.map((section) => (
              <label
                key={section.id}
                htmlFor={section.id}
                className={`relative uppercase cursor-pointer ${
                  active === section.id ? 'after:scale-x-100' : ''
                } after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:bg-[#4B371C] after:origin-left after:transition-transform after:duration-700 after:scale-x-0 hover:after:scale-x-50`}
              >
                {section.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom text */}
      <div className="absolute bottom-4 w-full px-4 text-center text-xl sm:text-3xl md:text-5xl font-bold text-[#4B371C] leading-tight z-10">
        <span className="break-words block">
          EXPLORE THE WORLD OF OLU THE MAKER
        </span>
      </div>
    </div>
  );
};

export default SectionGallery;
