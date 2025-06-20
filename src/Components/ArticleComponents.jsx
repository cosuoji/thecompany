// FeatureArticle Component


export const FeatureArticle = ({ date, title, description, imgSrc, slug }) => (
  <div className="flex gap-4 border-b border-black pb-4 py-2">
    <img
      src={imgSrc}
      alt=""
      className="w-24 h-24 object-cover grayscale"
    />
    <div className="flex flex-col">
      <span className="text-sm italic">{date}</span>
      <h4 className="text-lg font-semibold mb-1">{title}</h4>
    </div>
  </div>
);

  


// Article Component
export const Article = ({ 
  headerImage: imgSrc, 
  title: headline, 
  author, 
  category,
  publishedAt 
}) => (
  <div className="flex flex-col  border-black pb-6 h-full hover:bg-gray-50 transition-colors p-2 rounded-lg">
    {/* 1. Category - Centered at top */}
    {category && (
      <div className="flex justify-center mb-2">
        <span className="inline-block px-3 py-1 text-xs font-bold uppercase bg-[#4B371C] text-white rounded-full">
          {category
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')}
        </span>
      </div>
    )}

    {/* 2. Header Image - Responsive with aspect ratio */}
    <div className="w-full overflow-hidden rounded-lg mb-3">
      <img
        src={imgSrc}
        alt=""
        className="w-full h-48 md:h-56 object-cover grayscale hover:grayscale-0 transition-all duration-300"
      />
    </div>

    {/* 3. Title and Meta Information */}
    <div className="flex flex-col flex-grow">
      <h3 className="text-xl md:text-2xl font-space-grotesk font-semibold mb-2">
        {headline}
      </h3>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mt-auto">
        <span className="text-sm italic text-gray-600">{author}</span>
        <span className="text-xs md:text-sm text-gray-500">
          {new Date(publishedAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
        </span>
      </div>
    </div>
  </div>
);