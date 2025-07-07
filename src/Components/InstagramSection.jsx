import React from 'react';
import InstagramCarousel from './Carousel';
import one from "../assets/one.jpg"
import two from "../assets/two.jpg"
import three from "../assets/three.jpg"
const InstagramSection = () => {
  const items = [
    {
      image: one,
      link: '',
    },
    {
      image: two,
      link: '',
    },
    {
      image: three,
      link: '',
    },
  ];

  return <InstagramCarousel items={items} />;
};

export default InstagramSection