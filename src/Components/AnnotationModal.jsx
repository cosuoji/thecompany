import React from 'react';

const AnnotationModal = ({ annotation, onClose, isMobile }) => {
  if (!annotation) return null;

  return (
    <div
      className={`fixed inset-0 z-50 ${
        isMobile ? 'flex items-end' : 'flex items-center justify-center'
      } bg-black bg-opacity-40`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white w-full ${
          isMobile
            ? 'rounded-t-2xl p-6 max-h-[75vh]'
            : 'max-w-md rounded-xl p-6'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">{annotation.title}</h3>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        <p className="text-gray-700 mb-6">{annotation.description}</p>

        <div className="border-t pt-4">
          <p className="text-sm text-gray-500">
            This explains the <strong>{annotation.relatedOption}</strong> option.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnnotationModal;
