import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import ElegantButton from "../Components/Buttons/ElegantButton";
import { Article } from "../Components/ArticleComponents";
import useBlogStore from "../store/blogStore";
import { Link } from "react-router-dom";
import SEO from "../Components/SEO";



export default function Blog() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");  // <-- search state
  const categories = ["all", "news", "masters-of-the-craft", "moving-hands", "our-advice"];
  const { blogs, loading, error, fetchBlogs, currentPage, totalPages, searchBlogs } = useBlogStore();


  useEffect(() => {
    fetchBlogs(currentPage);
  }, [fetchBlogs]);

  const handlePrev = () => {
    if (currentPage > 1) {
      fetchBlogs(currentPage - 1);
    }
  };
  
    const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      searchBlogs(search);
    } else {
      fetchBlogs(1); // reset to all blogs
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      fetchBlogs(currentPage + 1);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const featuredArticles = blogs.filter(blog => blog.featured);
  const mainFeatured = featuredArticles[0] || null;
  
  // Filtering logic fixed
  const filteredArticles = selectedCategory === "all" 
    ? blogs.filter(blog => !blog.featured) // Show all non-featured articles
    : blogs.filter(blog => 
        blog.category === selectedCategory && !blog.featured
      ); // Show only non-featured articles in selected category


  return (
    <div className="flex flex-col min-h-screen">
      <SEO 
        title="Blog"
        description="Our thoughts, stories, experiences, all in one page"
        url="https://yourdomain.com/blog"
      />




      {/* Header Section with Main Featured Article */}
      {mainFeatured && (
        <div className="relative w-full h-screen max-h-[800px]">
          <img
            src={mainFeatured.headerImage}
            alt={mainFeatured.title}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute md:right-0 md:top-1/2 md:transform md:-translate-y-1/2
            bottom-0 left-0 w-full md:w-[45%] lg:w-[40%] xl:w-[35%] 
            h-[40vh] md:h-[60%] min-h-[250px] md:min-h-[400px] max-h-[400px] md:max-h-[600px]
            bg-[#E6DACD] bg-opacity-90 p-6 md:p-8 
            flex flex-col justify-center shadow-xl rounded">
            
            {mainFeatured.category && (
              <span className="text-xs font-bold uppercase bg-black text-white px-3 py-1.5 rounded-full inline-block mb-4 self-start">
                {mainFeatured.category.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </span>
            )}
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 border-b border-black pb-2">
              {mainFeatured.title}
            </h2>

            <p className="font-bold">by {mainFeatured.author}</p>
            
            <div className="overflow-y-auto py-4 mb-4 flex-grow">
              <p className="text-base md:text-lg pr-2">
                {mainFeatured.description}
              </p>
            </div>
            
            <div className="mt-auto pt-4">
              <Link to={`/blog/${mainFeatured.slug}`} className="inline-block">
                <ElegantButton label="Read More" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* FEATURED ARTICLES SECTION */}
      <div className="bg-[#4B371C] text-[#E6DACD] py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
            {featuredArticles.slice(1).map((article) => (
              <Link 
                to={`/blog/${article.slug}`} 
                key={article.slug}
                className="group w-full max-w-md"
              >
                <div className="h-full flex flex-col">
                  <img
                    src={article.headerImage}
                    alt={article.title}
                    className="w-full h-48 object-cover grayscale group-hover:grayscale-0 transition-all duration-300 mb-3"
                  />
                  <h3 className="text-lg font-semibold group-hover:underline text-center">
                    {article.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* NAVIGATION BAR */}
      <nav className="border-b border-black pt-1 flex flex-col md:flex-row md:justify-center relative">
        <div className={`flex ${menuOpen ? 'items-start' : 'items-center'} justify-between w-full md:w-auto`}>
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
          >
            {menuOpen ? (
              <FaTimes 
                size={24} 
                className="transition-transform duration-300 rotate-90"
              />
            ) : (
              <FaBars 
                size={24} 
                className="transition-transform duration-300 rotate-0"
              />
            )}
          </button>

          <ul
            className={`transition-all duration-300 ${
              menuOpen ? "opacity-100 flex" : "opacity-0 hidden"
            } md:opacity-100 md:flex flex-row space-x-6 text-xl ml-4 md:ml-0`}
          >
            {categories.map((category) => (
              <li
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`cursor-pointer whitespace-nowrap ${
                  selectedCategory === category ? "font-bold underline" : ""
                }`}
              >
                {category
                  .split('-')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </li>
            ))}
          </ul>

          {menuOpen && (
            <button 
              onClick={() => setMenuOpen(false)}
              className="md:hidden ml-2"
            >
              <FaTimes size={24} />
            </button>
          )}
        </div>
      </nav>

{/* SEARCH BAR */}
<form onSubmit={handleSearch} className="max-w-3xl mx-auto px-6 py-6 flex gap-2">
  <input
    type="text"
    placeholder="Search articles..."
    className="flex-grow border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#4B371C]"
    value={search}
    onChange={(e) => {
      setSearch(e.target.value);
      if (e.target.value.trim() === "") {
        fetchBlogs(1); // auto-reset if input cleared
      }
    }}
  />
  
  <button 
    type="submit" 
    className="px-6 py-3 bg-[#4B371C] text-white rounded-lg hover:bg-[#3A2C18] transition"
  >
    Search
  </button>

  {search && (
    <button 
      type="button"
      onClick={() => {
        setSearch("");
        fetchBlogs(1); // reload all blogs
      }}
      className="px-6 py-3 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition"
    >
      Clear
    </button>
  )}
</form>


      {/* FILTERED ARTICLES GRID */}
      <div className="px-8 py-12 max-w-7xl mx-auto w-full">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {selectedCategory === "all" 
            ? "All Articles" 
            : `${categories.find(c => c === selectedCategory)
                ?.split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')} Articles`}
        </h2>
        
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredArticles.map((article) => (
              <Link 
                to={`/blog/${article.slug}`} 
                key={article.slug}
                className="group"
              >
                <Article 
                  headerImage={article.headerImage}
                  title={article.title}
                  author={article.author}
                  category={article.category}
                  publishedAt={article.publishedAt}
                />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-lg text-center">No articles found in this category.</p>
        )}
      </div>
      { totalPages > 0 && <div className="flex justify-center pb-5 items-center gap-4 mt-12">
        <button 
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`px-4 py-2 border border-black ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Previous
        </button>

        <span>Page {currentPage} of {totalPages}</span>

        <button 
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 border border-black ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Next
        </button>
      </div>}
    </div>
  );
}