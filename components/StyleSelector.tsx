
import React from 'react';
import { HalloweenStyle, HALLOWEEN_STYLES } from '../types';

interface StyleSelectorProps {
  selectedStyle: HalloweenStyle;
  onStyleChange: (style: HalloweenStyle) => void;
  lockFace: boolean;
  onLockFaceChange: (value: boolean) => void;
  customPrompt: string;
  onCustomPromptChange: (value: string) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onStyleChange,
  lockFace,
  onLockFaceChange,
  customPrompt,
  onCustomPromptChange,
}) => {
  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex flex-col">
        <label htmlFor="style-select" className="mb-2 font-semibold text-gray-300">
          Chọn phong cách
        </label>
        <div className="relative">
          <select
            id="style-select"
            value={selectedStyle}
            onChange={(e) => onStyleChange(e.target.value as HalloweenStyle)}
            className="w-full appearance-none bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {HALLOWEEN_STYLES.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <label htmlFor="custom-prompt" className="mb-2 font-semibold text-gray-300">
          Thêm miêu tả (tùy chọn)
        </label>
        <textarea
          id="custom-prompt"
          value={customPrompt}
          onChange={(e) => onCustomPromptChange(e.target.value)}
          placeholder="Ví dụ: có thêm một con mèo đen, tóc màu đỏ..."
          rows={2}
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
        />
      </div>

      <div className="flex items-center justify-between bg-gray-700/60 p-3 rounded-lg">
        <div className="flex flex-col">
          <span className="font-semibold text-gray-200">Khóa khuôn mặt</span>
          <span className="text-sm text-gray-400">Giữ lại các đường nét trên khuôn mặt gốc.</span>
        </div>
        <label htmlFor="lock-face-toggle" className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            id="lock-face-toggle"
            className="sr-only peer"
            checked={lockFace}
            onChange={(e) => onLockFaceChange(e.target.checked)}
          />
          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-orange-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
        </label>
      </div>
    </div>
  );
};

export default StyleSelector;
