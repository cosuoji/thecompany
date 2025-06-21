// pages/MagazineListPage.jsx
import { useEffect } from 'react';
import { MagazineCard } from '../Components/MagazineComponents/MagazineCard';
import { useProductStore } from '../store/useProductStore';
import { Link } from 'react-router-dom';


const MagazineListPage = () => {
  const { magazines,fetchProducts, loading } = useProductStore();

  useEffect(() => {
    fetchProducts({ productType: 'magazine' });
  }, []);
  
  
  if (loading) return <div>Loading magazines...</div>;

  
  return (
    <>
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

