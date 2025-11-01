
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 my-12">
      <div className="relative flex items-center justify-center">
        <div className="w-24 h-24 border-4 border-dashed rounded-full animate-spin border-orange-500"></div>
        <div className="absolute text-4xl">🎃</div>
      </div>
      <p className="text-orange-400 text-lg font-semibold">AI đang vẽ chân dung ma mị cho bạn...</p>
    </div>
  );
};

export default Loader;
