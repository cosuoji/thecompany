// pages/MagazineListPage.jsx
import { useEffect } from 'react';
import { MagazineCard } from '../Components/MagazineComponents/MagazineCard';
import { useProductStore } from '../store/useProductStore';
import { Link } from 'react-router-dom';
import SEO from '../Components/SEO';

const MagazineListPage = () => {
  const { magazines,fetchProducts, loading } = useProductStore();

  useEffect(() => {
    fetchProducts({ productType: 'magazine' });
  }, []);
  
  
  if (loading) return <div>Loading magazines...</div>;

  
  return (
    <>
      <SEO 
        title="Magazine"
        description="Olu The Maker features printed thoughts and images from industry leaders all in one place, check out our magazines and get to know us and our guests better"
        url="https://yourdomain.com/blog"
      />

    <h1 className='text-center text-6xl pt-6'>MAGAZINE ISSUES</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {magazines.map(magazine => (
        <Link to={`${magazine.magazineData.issueNumber }`}>
        <MagazineCard 
          key={magazine._id} 
          magazine={magazine} 
        />
        </Link>
      ))}
    </div>
    </>
  );
};

export default MagazineListPage

