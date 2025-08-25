// Homepage.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import heroImage from "../assets/hero.webp"
import storeImage from "../assets/shoestore.jpg"
import magazineImage from "../assets/magazineimage.jpg"
import podcastImage from "../assets/podcastimage.webp"
import editorialImage from "../assets/editorialimage.jpg"
import useBlogStore from '../store/blogStore';
import { useProductStore } from '../store/useProductStore';
import { motion } from 'framer-motion';
import { MagazineCard } from '../Components/MagazineComponents/MagazineCard';
import InstagramSection from '../Components/InstagramSection';
import SEO from '../Components/SEO';


const pillars = [
  { label: 'Store', link: '/store', bg: storeImage },
  { label: 'Magazine', link: '/magazine', bg: magazineImage },
  { label: 'Editorials', link: '/blog', bg: editorialImage },
  { label: 'Podcast', link: '/podcast', bg: podcastImage },
];

const Homepage = () => {

  const {blogs, fetchBlogs} = useBlogStore()
  const { magazines, fetchProducts } = useProductStore();

  useEffect(() => { 
    fetchBlogs()
    fetchProducts({ productType: 'magazine' });
  }, []);

  return (
    <div className="bg-[#F8F4EF] text-[#1a1a1a]">
            <SEO 
              title="Home"
              description="The Home of the premier shoe brand in Nigeria, Olu The Maker represent the culture"
              url="https://yourdomain.com/blog"
            />
      

      {/* Hero Section with Background */}
      <section className="h-screen relative flex flex-col justify-center items-center text-white">
        <img src={heroImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <motion.h1 
          className="text-5xl md:text-7xl font-bold tracking-tight z-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          OLÚ THE MAKER
        </motion.h1>
        <motion.button
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="z-10 mt-6 text-sm text-white hover:underline"
          whileHover={{ scale: 1.05 }}
        >
          ↓ Scroll Down
        </motion.button>
      </section>

      {/* Pillars Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 md:px-8 py-10">
        {pillars.map((pillar, i) => (
          <Link to={pillar.link} key={pillar.label}>
            <motion.div
              className="relative rounded-xl overflow-hidden h-64 cursor-pointer group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <img src={pillar.bg} alt={pillar.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition" />
              <div className="relative z-10 h-full flex flex-col justify-end p-4 text-white">
                <h3 className="text-2xl font-semibold">{pillar.label}</h3>
              </div>
            </motion.div>
          </Link>
        ))}
      </section>

{/* Blog Articles Section */}
<section className="px-4 md:px-8 py-12">
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
  >
    <Link to="/blog">
    <h2 className="text-3xl font-bold mb-6">Latest Articles</h2>
      </Link>
    {blogs.length === 0 ? (
      <p>Loading articles...</p>
    ) : (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.slice(0, 5).map((blog) => (
          <Link
            to={`/blog/${blog.slug}`}
            key={blog._id}
            className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition"
          >
            <img
              src={blog.headerImage}
              alt={blog.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{blog.title}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {blog.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    )}
  </motion.div>
</section>


      {/* Featured Magazine Section */}
      <section className="px-4 md:px-8 py-12 bg-[#f0ebe4]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Link to="/magazine">
          <h2 className="text-3xl font-bold mb-6">Magazines</h2>
          </Link>
          {magazines.length === 0 ? (
            <p>Loading magazines...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {magazines.map(magazine => (
                <Link to={`/magazine/${magazine.magazineData.issueNumber}`} key={magazine._id}>
                  <MagazineCard magazine={magazine} />
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </section>
      <InstagramSection />
    </div>
  );
};

export default Homepage;
