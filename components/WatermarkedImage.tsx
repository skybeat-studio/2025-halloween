
import React, { useCallback } from 'react';
import { DownloadIcon } from './icons';

interface WatermarkedImageProps {
  imageUrl: string;
  watermarkText: string;
}

const WatermarkedImage: React.FC<WatermarkedImageProps> = ({ imageUrl, watermarkText }) => {
  
  const handleDownload = useCallback(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);

      const fontSize = Math.max(30, Math.min(canvas.width / 15, 60));
      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      
      // Add a subtle shadow to make the emoji pop
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      ctx.fillText(watermarkText, canvas.width - 20, canvas.height - 20);

      const link = document.createElement('a');
      link.download = `halloween_portrait_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = imageUrl;
  }, [imageUrl, watermarkText]);

  return (
    <div className="relative group overflow-hidden rounded-2xl shadow-lg bg-gray-800 animate-fade-in">
      <img src={imageUrl} alt="Ảnh Halloween được tạo" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-3 bg-orange-600/90 text-white font-semibold rounded-full shadow-md hover:bg-orange-600 transition-all duration-300 transform scale-90 group-hover:scale-100"
        >
          <DownloadIcon />
          Tải xuống
        </button>
      </div>
    </div>
  );
};

// Simple fade-in animation using keyframes
const style = document.createElement('style');
style.innerHTML = `
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
`;
document.head.appendChild(style);


export default WatermarkedImage;