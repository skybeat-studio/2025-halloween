
import React from 'react';
import WatermarkedImage from './WatermarkedImage';

interface ResultGalleryProps {
  images: string[];
}

const ResultGallery: React.FC<ResultGalleryProps> = ({ images }) => {
  return (
    <div className="w-full mt-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">
        Kết quả hoá thân
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((imageSrc, index) => (
          <WatermarkedImage
            key={index}
            imageUrl={imageSrc}
            watermarkText="🎃"
          />
        ))}
      </div>
    </div>
  );
};

export default ResultGallery;