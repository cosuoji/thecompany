// components/MagazineCard.jsx

export const MagazineCard = ({ magazine }) => { 
    return (
      <div className="magazine-card pt-14">
        <img 
          src={magazine.magazineData.coverImage.url} 
          alt={`Issue ${magazine.magazineData.issueNumber}`}
          className="h-64 w-full object-cover"
        />
        <div className="p-4">
          <h3 className="font-bold text-lg">{magazine.name}</h3>
          <p className="text-gray-600">Issue #{magazine.magazineData.issueNumber}</p>
        </div>
      </div>
    );
  };