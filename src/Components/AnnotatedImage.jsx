import { useState } from 'react';
import AnnotationModal from './AnnotationModal';
import { productAnnotations } from '../data/productAnnotations';
const AnnotatedImage = ({ imageUrl }) => {
  const [activeAnnotation, setActiveAnnotation] = useState(null);

  const isMobile = window.innerWidth < 768;

  return (
    <>
      <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={imageUrl}
          alt="Product"
          className="w-full h-full object-cover"
        />

        {/* Desktop hotspots */}
        {!isMobile &&
          productAnnotations.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveAnnotation(item)}
              className="absolute w-4 h-4 bg-black rounded-full animate-pulse"
              style={{
                top: item.hotspot.y,
                left: item.hotspot.x,
                transform: 'translate(-50%, -50%)'
              }}
              title={item.title}
            />
          ))}
      </div>

      {/* Mobile Explore List */}
      {isMobile && (
        <div className="mt-4 border rounded-lg divide-y">
          {productAnnotations.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveAnnotation(item)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50"
            >
              {item.title}
            </button>
          ))}
        </div>
      )}

      <AnnotationModal
        annotation={activeAnnotation}
        onClose={() => setActiveAnnotation(null)}
        isMobile={isMobile}
      />
    </>
  );
};

export default AnnotatedImage;
