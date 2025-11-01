
import React, { useState, useCallback, useEffect } from 'react';
import { HalloweenStyle, HALLOWEEN_STYLES } from './types';
import { generateHalloweenImages } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import StyleSelector from './components/StyleSelector';
import ResultGallery from './components/ResultGallery';
import Loader from './components/Loader';
import { GenerateButtonIcon } from './components/icons';

const App: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<HalloweenStyle>(HALLOWEEN_STYLES[0]);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [lockFace, setLockFace] = useState<boolean>(true);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState<string>('');

  useEffect(() => {
    const storedApiKey = localStorage.getItem('gemini-api-key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKeyInput.trim()) {
      setApiKey(apiKeyInput.trim());
      localStorage.setItem('gemini-api-key', apiKeyInput.trim());
      setApiKeyInput('');
      setError(null);
    } else {
      setError("Vui lòng nhập một khóa API hợp lệ.");
    }
  };

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    setGeneratedImages([]);
    setError(null);
  };

  const handleGenerateClick = useCallback(async () => {
    if (!uploadedImage) {
      setError("Vui lòng tải lên một hình ảnh trước.");
      return;
    }
    if (!apiKey) {
      setError("Vui lòng cung cấp khóa API trước khi tạo ảnh.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const images = await generateHalloweenImages(uploadedImage, selectedStyle, lockFace, customPrompt, apiKey);
      setGeneratedImages(images);
    } catch (err) {
      console.error(err);
      if (err instanceof Error && (err.message.includes("API key not valid") || err.message.includes("Requested entity was not found."))) {
        setError("Khóa API không hợp lệ. Vui lòng nhập một khóa khác.");
        setApiKey(null);
        localStorage.removeItem('gemini-api-key');
      } else {
        setError("Đã xảy ra lỗi khi tạo ảnh. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImage, selectedStyle, lockFace, customPrompt, apiKey]);

  const handleReset = () => {
    setUploadedImage(null);
    setGeneratedImages([]);
    setError(null);
    setIsLoading(false);
    setCustomPrompt('');
  }

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800/50 p-8 rounded-2xl shadow-2xl border border-gray-700 flex flex-col items-center text-center max-w-lg w-full">
          <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-300">
            Cung cấp Khóa API Google
          </h2>
          <p className="text-gray-400 mb-6">
            Để sử dụng ứng dụng, bạn cần cung cấp khóa API từ Google AI Studio. 
            Nhận khóa của bạn <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">tại đây</a>.
          </p>
          <form onSubmit={handleApiKeySubmit} className="w-full flex flex-col items-center">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Dán khóa API của bạn vào đây"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
              aria-label="API Key Input"
            />
            <button
              type="submit"
              className="w-full px-8 py-3 bg-orange-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50"
            >
              Lưu & Bắt đầu sử dụng
            </button>
          </form>
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative mt-6 text-center w-full" role="alert">
              <strong className="font-bold">Lỗi!</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative my-4 text-center" role="alert">
            <strong className="font-bold">Lỗi!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {!uploadedImage && <ImageUploader onImageUpload={handleImageUpload} />}
        
        {uploadedImage && (
          <div className="bg-gray-800/50 p-6 rounded-2xl shadow-2xl border border-gray-700 flex flex-col items-center w-full">
            <div className="relative mb-6 w-full max-w-xs">
                <img src={URL.createObjectURL(uploadedImage)} alt="Ảnh chân dung đã tải lên" className="rounded-xl w-full h-auto object-cover shadow-lg" />
                <button 
                  onClick={handleReset} 
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  aria-label="Xoá ảnh"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
            </div>
          
            <StyleSelector
              selectedStyle={selectedStyle}
              onStyleChange={setSelectedStyle}
              lockFace={lockFace}
              onLockFaceChange={setLockFace}
              customPrompt={customPrompt}
              onCustomPromptChange={setCustomPrompt}
            />

            <button
              onClick={handleGenerateClick}
              disabled={isLoading}
              className="mt-6 w-full max-w-md flex items-center justify-center gap-3 px-8 py-4 bg-orange-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50"
            >
              <GenerateButtonIcon />
              {isLoading ? 'Đang hoá thân...' : 'Hoá thân ma mị'}
            </button>
          </div>
        )}

        {isLoading && <Loader />}

        {generatedImages.length > 0 && !isLoading && (
          <ResultGallery images={generatedImages} />
        )}

        <footer className="text-center text-gray-500 mt-12 text-sm leading-relaxed">
          <p>Ứng dụng được tạo bởi Đạt Đơn Giản qua Gemini AI 🎃</p>
          <p>Khám phá phong cách Halloween độc nhất của riêng bạn!</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
