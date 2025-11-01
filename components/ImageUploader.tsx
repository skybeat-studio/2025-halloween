
import React, { useRef, useState, useCallback } from 'react';
import { UploadIcon, CameraIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        onImageUpload(file);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div 
        className={`w-full max-w-2xl p-8 border-4 border-dashed rounded-2xl transition-colors duration-300 ${isDragging ? 'border-orange-500 bg-gray-700/50' : 'border-gray-600 hover:border-orange-500/80'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <UploadIcon />
          <h3 className="text-xl font-semibold text-gray-200">Kéo và thả ảnh hoặc</h3>
          <p className="text-gray-400">Ảnh chân dung chính diện sẽ cho kết quả tốt nhất.</p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-full shadow-md hover:bg-orange-700 transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50"
            >
              Chọn tệp từ máy
            </button>
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-full shadow-md hover:bg-purple-700 transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50"
            >
              <CameraIcon />
              Chụp ảnh
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <input
            type="file"
            ref={cameraInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="user"
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
