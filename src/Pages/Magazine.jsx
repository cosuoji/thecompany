// pages/MagazineListPage.jsx
import { useEffect } from 'react';
import { MagazineCard } from '../Components/MagazineComponents/MagazineCard';
import { useProductStore } from '../store/useProductStore';


const MagazineListPage = () => {
  const { magazines,fetchProducts, loading } = useProductStore();
  console.log(magazines)
  
  useEffect(() => {
    fetchProducts({ productType: 'magazine' });
  }, []);
  
  if (loading) return <div>Loading magazines...</div>;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {magazines.map(magazine => (
        <MagazineCard 
          key={magazine._id} 
          magazine={magazine} 
        />
      ))}
    </div>
  );
};

export default MagazineListPage