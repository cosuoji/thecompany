import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';



// Background images
import blogsBg from '../../assets/slidermenu/blogs.jpg';
import magazineBg from '../../assets/slidermenu/magazine.jpg';
import podcastBg from '../../assets/slidermenu/podcasts.jpg';
import storeBg from '../../assets/slidermenu/store.jpg';

import storeImage from "../../assets/shoestore.jpg"
import magazineImage from "../../assets/magazineimage.jpg"
import podcastImage from "../../assets/podcastimage.webp"
import editorialImage from "../../assets/editorialimage.jpg"


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

  const pillars = [
    { label: 'Store', link: '/store', bg: storeImage },
    { label: 'Magazine', link: '/magazine', bg: magazineImage },
    { label: 'Editorials', link: '/blog', bg: editorialImage },
    { label: 'Podcast', link: '/podcast', bg: podcastImage },
  ];


  const handleClick = (link) => {
    if (onClose) onClose();
    navigate(link);
  };

  return (
    <div className="fixed inset-0 bg-[#F8F4EF] pt-20 md:pt-28 lg:pt-32 overflow-y-auto">
      <div className="min-h-[calc(100vh-5rem)] p-4 md:p-8">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:px-12 py-12 max-w-6xl mx-auto">
            {pillars.map((pillar, i) => (
              <Link to={pillar.link} key={pillar.label}>
                <motion.div
                  className="relative rounded-2xl overflow-hidden h-80 md:h-96 cursor-pointer group shadow-lg"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  viewport={{ once: true }}
                >
                  <img
                    src={pillar.bg}
                    alt={pillar.label}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition" />
                  <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
                    <h3 className="text-3xl font-bold tracking-wide">{pillar.label}</h3>
                    <p className="text-sm md:text-base opacity-90 mt-2">
                      {/* Optional: short description */}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </section>

      </div>
    </div>
  );
};

export default BentoMenu;