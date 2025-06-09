import React from 'react';
import InstagramCarousel from './Carousel';

const InstagramSection = () => {
  const items = [
    {
      image: "",
      link: '',
    },
    {
      image: "",
      link: '',
    },
    {
      image: "",
      link: '',
    },
  ];

  return <InstagramCarousel items={items} />;
};

export default InstagramSection