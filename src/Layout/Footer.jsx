import { FacebookIcon, InstagramIcon, Twitter, YoutubeIcon } from 'lucide-react';
import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useForm, ValidationError } from '@formspree/react';
import AnalogClock from '../Components/AnalogClock';

const Footer = ({ navLinks = [] }) => {


  const [state, handleSubmit] = useForm("xeokgazj");

    // Default navigation configuration
    const defaultNavigation = [
        { name: 'About', path: '/about' },
        { name: "Contact", path: '/contact'},
        { name: 'FAQ', path: '/faq' },
        { name: 'Shipping', path: '/shipping' },
        { name: 'Terms', path: '/terms' },
        { name: 'Privacy', path: '/privacy' },
        { name: 'Cookies', path: '/cookies' },
        { name: 'Our Lasts', path: '/lasts' },
        { name: 'Glossary', path: '/glossary' }
      ];
    
    const footerLinks = navLinks.length > 0 ? navLinks : defaultNavigation;  
  

  return (
    <footer className="bg-beige pt-12 px-5 md:px-10 lg:px-20 border-t border-gray-200">
        {/* Div 1: Locations - Side-by-side layout */}
        <div className="flex flex-col md:flex-row justify-center gap-16 mb-12">
        {/* England */}
        <div className="flex items-center gap-6">
          <h3 className="font-medium text-3xl text-[#4B371C] whitespace-nowrap">44</h3>
          <AnalogClock timezoneOffset={0} />
          <div className="text-sm leading-relaxed text-[#4B371C] ml-4">
            <p>123 Madison Avenue</p>
            <p>New York, NY 10016</p>
            <p>contact@luxuryfashion.com</p>
            <p className="mt-2">Open by appointment</p>
          </div>
        </div>

        {/* Lagos */}
        <div className="flex items-center gap-6">
          <h3 className="font-medium text-3xl text-[#4B371C] whitespace-nowrap">234</h3>
          <AnalogClock timezoneOffset={0} />
          <div className="text-sm leading-relaxed text-[#4B371C] ml-4">
            <p>123 Madison Avenue</p>
            <p>New York, NY 10016</p>
            <p>contact@luxuryfashion.com</p>
            <p className="mt-2">Open by appointment</p>
          </div>
        </div>
      </div>
      
      {/* Div 2: Newsletter + Social */}
      <div className="flex flex-col border-t border-gray-200 pt-6 md:flex-row justify-center items-center gap-12 mb-12">
        {/* Newsletter - Centered and aligned */}
        <div className="w-full max-w-md text-center">
          <h3 className="font-medium text-lg mb-4 text-center text-chocolate">JOIN OUR NEWSLETTER</h3>

          {state.succeeded ? (
            <p className="text-[#4B371C]">Thanks for Subscribing to Our Newsletter</p>
          ) : (
            <form className="flex w-full" onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}>
              <input
                type="email"
                placeholder="Your email address"
                id='email'
                name='email'
                className="flex-1 px-4 py-2.5 border-1 text-chocolate text-sm focus:outline-none"
                required
              />
              <button
                disabled={state.submitting}
                type="submit"
                className="px-5 py-2.5 bg-[#4B371C] text-white text-sm hover:bg-[#4B371C] transition-colors rounded-shadow"
              >
                {state.submitting ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
              </button>
            </form>
          )}
        </div>

        {/* Follow Us */}
        <div className="text-center">
  <h3 className="font-medium text-lg mb-4 text-[#4B371C]">FOLLOW US</h3>
  <div className="flex justify-center gap-4">
    {/* Twitter/X */}
    <a href="#" className="opacity-80 hover:opacity-100 transition-opacity text-[#4B371C]">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    </a>

    {/* Instagram */}
    <a href="#" className="opacity-80 hover:opacity-100 transition-opacity text-[#4B371C]">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    </a>

    {/* YouTube */}
    <a href="#" className="opacity-80 hover:opacity-100 transition-opacity text-[#4B371C]">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
      </svg>
    </a>

    {/* Facebook */}
    <a href="#" className="opacity-80 hover:opacity-100 transition-opacity text-[#4B371C]">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
      </svg>
    </a>
  </div>
</div>
</div>

      {/* Div 3: Navigation Links */}
      <div className="mb-8">
  <ul className="flex flex-wrap justify-center gap-6 text-sm text-chocolate">
    {footerLinks.map((item) => (
      <li key={item.name}>
        {/* Ensure this isn't wrapped in another <a> or <Link> */}
        <Link 
          to={item.path} 
          className="hover:opacity-70 transition-opacity"
        >
          {item.name}
        </Link>
      </li>
    ))}
  </ul>
</div>

      {/* Div 4: Logo + Copyright */}
      <div className="pt-8 border-t border-gray-200 text-center pb-6">
        <Link to="/"><div className="text-2xl font-semibold tracking-wide mb-2 text-chocolate">OLÚ THE MAKER</div></Link>
        <div className="text-xs text-chocolate opacity-70">
          © {new Date().getFullYear()} OLÚ THE MAKER . All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer