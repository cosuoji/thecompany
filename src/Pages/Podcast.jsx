import React from "react";
import { Link } from "react-router-dom";
import { FaApple, FaSpotify, FaYoutube } from "react-icons/fa";
import PodcastSubsriptionForm from "../Components/Forms/PodcastSubscription";
import SEO from "../Components/SEO";

const PodcastPage = () => {
  return (
    <div className="w-full">
      {/* Header with Background Image ONLY */}
            <SEO 
              title="Podcasts"
              description="Podcasts Page for Olu The Maker, sometimes we like to record our conversations. You can get them wherever you get your podcasts"
              url="https://yourdomain.com/blog"
            />
      
      <header 
          className="w-full aspect-[16/9] bg-cover bg-center"
          style={{ backgroundImage: "url('https://placehold.co/1800x910')" }}
        ></header>

      {/* Info + Subscription Section */}
      <section className="w-full bg-[#f5f5dc] py-12 px-4 flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
          Listen to podcast episodes
        </h2>
        <p className="text-lg md:text-xl mb-6 max-w-2xl">
          Get new episodes delivered to your inbox when they drop.
        </p>

        {/* Subscription Form with visible borders */}
        <div className="w-full max-w-xl">
          <PodcastSubsriptionForm />
        </div>

        {/* Logos & Links */}
        <div className="flex flex-wrap justify-center gap-8 mt-10 text-4xl text-[#4B371C]">
          <Link to="#" className="hover:text-[#3a2b16] transition">
            <FaApple />
          </Link>
          <Link to="#" className="hover:text-[#3a2b16] transition">
            <FaSpotify />
          </Link>
          <Link to="#" className="hover:text-[#3a2b16] transition">
            <FaYoutube />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PodcastPage;
