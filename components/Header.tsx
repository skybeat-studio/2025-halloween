
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center py-8">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-300">
          APP TẠO ẢNH HALLOWEEN
        </span>
      </h1>
      <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
        Tải ảnh chân dung của bạn, chọn một phong cách ma mị và để AI biến bạn thành một nhân vật Halloween ấn tượng!
      </p>
    </header>
  );
};

export default Header;