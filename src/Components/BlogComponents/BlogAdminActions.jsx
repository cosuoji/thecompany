// components/BlogAdminActions.jsx
import { useState } from 'react';
import { FiTrash2} from 'react-icons/fi';
import useBlogStore from '../../store/blogStore';
import { Link } from 'react-router-dom';

const BlogAdminActions = ({ slug, onDeleteSuccess }) => {
  const { deleteBlog } = useBlogStore();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        const success = await deleteBlog(slug);
        if (success && onDeleteSuccess) {
          onDeleteSuccess();
        }
      } catch (error) {
        console.error('Delete failed:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  return (
    <div className="flex flex-wrap gap-3 mt-6 mb-8"> 
      {/* Delete Button */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
          isDeleting
            ? 'bg-red-100 text-red-700 cursor-not-allowed'
            : 'bg-red-50 text-red-600 hover:bg-red-100'
        }`}
      >
        <FiTrash2 className="w-4 h-4" />
        {isDeleting ? 'Deleting...' : 'Delete Post'}
      </button>
    </div>
  );
};

export default BlogAdminActions;