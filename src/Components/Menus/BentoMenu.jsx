import React from 'react';
import { useNavigate } from 'react-router-dom';

// Background images
import blogsBg from '../../assets/slidermenu/blogs.jpg';
import magazineBg from '../../assets/slidermenu/magazine.jpg';
import podcastBg from '../../assets/slidermenu/podcasts.jpg';
import storeBg from '../../assets/slidermenu/store.jpg';

const BentoMenu = ({ onClose }) => {
  const navigate = useNavigate();
  const sections = [
    {
      id: 's1',
      label: 'EDITORIALS',
      link: '/blog',
      background: blogsBg,
      description: 'Thoughtful articles on craftsmanship',
   
    },
    {
      id: 's2',
      label: 'PODCAST',
      link: '/podcast',
      background: podcastBg,
      description: 'Conversations with artisans',
      
    },
    {
      id: 's3',
      label: 'STORE',
      link: '/store',
      background: storeBg,
      description: 'Handcrafted leather goods',
   
    },
    {
      id: 's4',
      label: 'MAGAZINE',
      link: '/magazine',
      background: magazineBg,
      description: 'Quarterly print edition',
      
    },
  ];

  const handleClick = (link) => {
    if (onClose) onClose();
    navigate(link);
  };

  return (
    <div className="fixed inset-0 bg-[#F8F4EF] pt-20 md:pt-28 lg:pt-32 overflow-y-auto">
      <div className="min-h-[calc(100vh-5rem)] p-4 md:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-12">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => handleClick(section.link)}
            className={`relative rounded-3xl overflow-hidden shadow-lg
              flex flex-col items-start justify-end p-6
              transition-all duration-300 hover:scale-[1.02]
              h-60 md:h-[20rem] min-h-[15rem]
              group
            `}
          >
              {/* Background Image */}
              <img
                src={section.background}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 group-hover:from-black/60 group-hover:to-black/20 transition-all duration-300" />
              
              {/* Content */}
              <div className="relative z-10 text-left w-full">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {section.label}
                </h3>
                <p className="text-white/90 text-sm md:text-base mb-3">
                  {section.description}
                </p>
                <span className="inline-block px-4 py-2 bg-white text-[#4B371C] rounded-full text-sm font-medium hover:bg-opacity-90 transition">
                  {section.id === 's3' ? 'Shop Now' : 'Explore'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BentoMenu;