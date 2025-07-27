import { useState, useEffect } from 'react';

import { FaTwitter, FaFacebook, FaLinkedin, FaLink, FaArrowLeft } from 'react-icons/fa';
import useBlogStore from '../../store/blogStore';
import {useUserStore} from '../../store/useUserStore';
import BlogContentRenderer from "./BlogContentRenderer"
import BlogAdminActions from './BlogAdminActions';
import { useNavigate, useParams } from 'react-router-dom';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const SingleBlogPost = () => {
  const navigate = useNavigate()
  const { currentBlog, loading, error, fetchBlogBySlug } = useBlogStore();
  const { user, checkingAuth } = useUserStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const { slug } = useParams();
   
  useDocumentTitle(`Blog - ${currentBlog?.title}`)

  useEffect(() => {
    if (slug) {
      fetchBlogBySlug(slug);
    }
  }, [slug, fetchBlogBySlug]);

  useEffect(() => {
    setIsAdmin(user?.user?.role === 'admin');
  }, [user]);


  console.log(currentBlog)

  const handleShare = (platform) => {
    const shareUrl = window.location.href;
    const title = currentBlog?.title || '';
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
        break;
      default:
        break;
    }
  };

  const handleDeleteSuccess = () => {
    navigate('/blog');
  };

  if (checkingAuth) return <div className="text-center py-8">Checking authentication...</div>;
  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!currentBlog) return <div className="text-center py-8">Blog not found</div>;

  return (
    <div className="single-blog-post max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <header className="post-header mb-12 text-center">
        <div className="header-content">
          <h1 className="post-title text-4xl md:text-5xl font-bold mb-4">{currentBlog.title}</h1>
          <p className="post-description text-xl text-gray-600 mb-6">{currentBlog.description}</p>
          
          <div className="post-meta flex justify-center items-center gap-6 mb-6">
            <span className="post-date text-gray-500">
              {new Date(currentBlog.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="post-author text-gray-700 font-medium">
              By {currentBlog?.author || 'Unknown'}
            </span>
          </div>
          
          <div className="share-links flex justify-center gap-4 mb-6">
            <button 
              onClick={() => handleShare('twitter')} 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Share on Twitter"
            >
              <FaTwitter className="text-blue-400 w-5 h-5" />
            </button>
            <button 
              onClick={() => handleShare('facebook')} 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Share on Facebook"
            >
              <FaFacebook className="text-blue-600 w-5 h-5" />
            </button>
            <button 
              onClick={() => handleShare('linkedin')} 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Share on LinkedIn"
            >
              <FaLinkedin className="text-blue-700 w-5 h-5" />
            </button>
            <button 
              onClick={() => handleShare('copy')} 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Copy link"
            >
              <FaLink className="text-gray-600 w-5 h-5" />
            </button>
          </div>
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => navigate('/blog')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <FaArrowLeft /> Back to Blogs
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen Header Image */}
      <div className="header-image-container w-full mb-12">
        <img 
          src={currentBlog.headerImage} 
          alt={currentBlog.title} 
          className="header-image w-full h-auto  object-cover"
        />
      </div>

      {/* Blog Content */}
      <article className="post-content prose max-w-none">
        <BlogContentRenderer contentBlocks={currentBlog.contentBlocks} />
      </article>
        {/* Admin actions - only visible to admins */}
                  {isAdmin && (
              <BlogAdminActions 
                slug={currentBlog.slug} 
                onDeleteSuccess={handleDeleteSuccess} 
              />
            )}
    </div>
  );
};

export default SingleBlogPost;