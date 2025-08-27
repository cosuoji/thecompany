// Homepage.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useBlogStore from '../store/blogStore';
import { useProductStore } from '../store/useProductStore';
import { motion } from 'framer-motion';
import { MagazineCard } from '../Components/MagazineComponents/MagazineCard';
import InstagramSection from '../Components/InstagramSection';
import SEO from '../Components/SEO';
import podcastPlaceholder from "../data/podcastPlaceholder";



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
<section className="h-screen relative flex items-end lg:items-start text-white">
  <img 
    src="https://ik.imagekit.io/ldhzgky9pk/homepage_30GJg_2f9?updatedAt=1756298454824" 
    alt="Hero" 
    className="absolute inset-0 w-full h-full object-cover" 
  />
  <div className="absolute inset-0 bg-black/50" />

  <motion.div 
    className="relative z-10 p-6 md:p-12 max-w-3xl mx-auto text-center lg:text-left lg:mx-0 lg:ml-12 lg:mt-20"
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
  >
    <h3 className="text-lg md:text-xl font-semibold tracking-wide text-gray-200">
      FEATURE
    </h3>
    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mt-2">
      OUR CREATIVE PROCESS: OLÚ THE MAKER BESPOKE BRAND
    </h1>
    <p className="mt-4 text-sm md:text-base text-gray-200 leading-relaxed">
      An insight into our creative process of the best bespoke brand in Africa, <br />
      We go inside the mind of the brand with our creative team.
    </p>
    <Link 
      to="/blog" 
      className="inline-block mt-6 px-6 py-3 bg-white text-black font-semibold rounded-lg shadow hover:bg-gray-100 transition"
    >
      READ MORE
    </Link>
  </motion.div>
</section>

{/* Featured Collection Section */}
<section className="relative h-[70vh] w-full cursor-pointer">
  <Link to="/store">
    <img
      src="https://images.unsplash.com/photo-1616406432452-07bc5938759d"
      alt="Featured Collection"
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black/30" />

    {/* Top Label */}
    <div className="absolute top-6 w-full text-center lg:text-left lg:px-12">
      <h2 className="text-white text-xl md:text-2xl font-semibold tracking-wider">
        FEATURED COLLECTION
      </h2>
    </div>

    {/* Bottom Button */}
    <div className="absolute bottom-6 w-full text-center lg:text-left lg:px-12">
      <button className="px-6 py-3 bg-white text-black font-semibold rounded-lg shadow hover:bg-gray-100 transition">
        DISCOVER MORE
      </button>
    </div>
  </Link>
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
      <h2 className="text-3xl font-bold mb-6">Editorials</h2>
    </Link>
    {blogs.length === 0 ? (
      <p>Loading articles...</p>
    ) : (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.slice(0, 3).map((blog) => (   // 👈 show only 3
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
        {magazines.slice(0, 3).map(magazine => (   // 👈 show only 3
          <Link to={`/magazine/${magazine.magazineData.issueNumber}`} key={magazine._id}>
            <MagazineCard magazine={magazine} />
          </Link>
        ))}
      </div>
    )}
  </motion.div>
</section>

{/* {Podcast Section} */}
<section className="px-4 md:px-8 py-12 bg-white">
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
  >
    <Link to="/podcast">
      <h2 className="text-3xl font-bold mb-6">Podcast Episodes</h2>
    </Link>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {podcastPlaceholder.map((episode) => (
        <div
          key={episode.id}
          className="bg-[#F8F4EF] rounded-lg shadow hover:shadow-md transition overflow-hidden"
        >
          <img
            src={episode.coverImage}
            alt={episode.title}
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold">{episode.title}</h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {episode.description}
            </p>
            <a
              href={episode.audioUrl}
              className="text-blue-600 text-sm mt-2 inline-block hover:underline"
            >
              ▶ Listen Now
            </a>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
</section>

      <InstagramSection />
    </div>
  );
};

export default Homepage;
