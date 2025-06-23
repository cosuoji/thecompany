import React from 'react';
import { useNavigate } from 'react-router-dom';

// Background images
import blogsBg from '../../assets/slidermenu/blogs.jpg';
import magazineBg from '../../assets/slidermenu/magazine.jpg';
import podcastBg from '../../assets/slidermenu/podcasts.jpg';
import collectionBg from '../../assets/slidermenu/collections.jpg';
import storeBg from '../../assets/slidermenu/store.jpg';

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

const BentoMenu = ({ onClose }) => {
  const navigate = useNavigate();

  const handleClick = (link) => {
    if (onClose) onClose();
    navigate(link);
  };

  return (
<div className="min-h-screen w-full bg-[#F8F4EF] pt-20 md:pt-28 lg:pt-32 p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
{sections.map((section, index) => (
    <button
        key={section.id}
        onClick={() => handleClick(section.link)}
        className={`relative rounded-3xl overflow-hidden shadow-lg 
        flex items-center justify-center text-white font-bold 
        text-3xl md:text-4xl h-40 md:h-60 
        transition-transform duration-500 hover:scale-105
        ${index === 0 ? 'md:col-span-2' : ''}
        ${index === 2 ? 'md:row-span-2' : ''}
        `}
        >
        {/* ✅ Image layer */}
        <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${section.background})` }}
        />

        {/* ✅ Overlay */}
        <div className="absolute inset-0 hover:bg-opacity-70 transition duration-500"></div>

        {/* ✅ Text */}
        <span className="relative z-10">{section.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BentoMenu;
