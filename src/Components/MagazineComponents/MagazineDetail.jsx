// pages/MagazineDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../lib/axios';
 // Update path as needed
import { FaArrowLeft, FaTrash} from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useUserStore } from '../../store/useUserStore';
import { useCartStore } from '../../store/useCartStore';

const MagazineDetail = () => {
    const { issueNumber } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const { addToCart } = useCartStore();
    const { isAdmin } = useUserStore(); // Using your existing isAdmin method

    const fetchData = async (search = '') => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get(`/magazines/${issueNumber}?search=${encodeURIComponent(search)}`);
            setData(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load magazine');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [issueNumber]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchData(searchTerm);
        navigate(`?search=${encodeURIComponent(searchTerm)}`, { replace: true });
    };

    const handleAddToCart = () => {
        addToCart(data.magazine._id, 'magazine');
    };

    const handleDelete = () => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this magazine issue?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await axiosInstance.delete(`/magazines/${issueNumber}`);
                            toast.success('Magazine deleted successfully');
                            navigate('/magazine');
                        } catch (err) {
                            toast.error(err.response?.data?.message || 'Failed to delete magazine');
                        }
                    }
                },
                { label: 'No' }
            ]
        });
    };

  

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
    if (!data) return <div className="text-center py-8">Magazine not found</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center py-4 gap-4">
                <button 
                    onClick={() => navigate('/magazine')}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    <FaArrowLeft /> Back to All Issues
                </button>
                
                {isAdmin() && ( // Using your isAdmin method
                    <div className="flex gap-2">
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                            <FaTrash /> Delete Issue
                        </button>
                    </div>
                )}
            </div>

            {/* Rest of your magazine detail UI remains the same */}
            <div className="flex flex-col md:flex-row gap-8 mb-12">
                <div className="md:w-1/3">
                    <img 
                        src={data.magazine.magazineData.coverImage.url} 
                        alt={`Issue ${issueNumber} Cover`}
                        className="w-full rounded-lg shadow-lg"
                    />
                </div>
                
                <div className="md:w-2/3 space-y-6">
                    <h1 className="text-3xl font-bold">{data.magazine.name}</h1>
                    <p className="text-xl">Issue #{issueNumber}</p>
                    <p className="text-gray-600">{data.magazine.description}</p>
                    <p className="text-2xl font-semibold">₦ {data.magazine.price}</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            onClick={handleAddToCart}
                            className="bg-[#4B371C] hover:bg-[#3a2b15] text-white py-3 px-6 rounded-lg font-medium transition-colors"
                        >
                            Add to Cart
                        </button>
                        <button className="bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                            Subscribe to Magazine
                        </button>
                        <button className="bg-[#E6DACD] hover:bg-[#d4c8bb] text-black py-3 px-6 rounded-lg font-medium transition-colors">
                            Read Online
                        </button>
                    </div>
                </div>
            </div>

            {/* Articles Section */}
            <div className="mt-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold pb-2">Articles from this issue</h2>
                    <form onSubmit={handleSearch} className="w-full md:w-1/3">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search articles..."
                                className="w-full pl-4 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <button 
                                type="submit"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            >
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>

                {data?.articles?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.articles.map(article => (
                            <ArticleCard key={article._id} article={article} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">
                        {data?.searchQuery ? 'No matching articles found' : 'No articles found for this issue'}
                    </p>
                )}
            </div>
        </div>
    );
};

// ArticleCard component remains the same
const ArticleCard = ({ article }) => (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
        <Link to={`/blog/${article.slug}`}>
            {article.headerImage && (
                <img 
                    src={article.headerImage} 
                    alt={article.title}
                    className="w-full h-48 object-cover"
                />
            )}
            <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{article.title}</h3>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>By {article.author}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-700">{article.description}</p>
            </div>
        </Link>
    </div>
);

export default MagazineDetail;