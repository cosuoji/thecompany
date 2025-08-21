import { useEffect } from "react";
import { MagazineCard } from "./MagazineCard";


// components/MagazineList.jsx
export const MagazineList = () => {
    const { magazines, fetchMagazines } = useStore();
    
    useEffect(() => {
      fetchMagazines();
    }, []);
  
    return (
      <div className="magazine-grid">
        {magazines.map(magazine => (
          <MagazineCard 
            key={magazine._id}
            magazine={magazine}
          />
        ))}
      </div>
    );
  };