
import React from 'react';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onSearch: (q: string) => void;
  onAIGradingClick: () => void;
  onCompHubClick: () => void;
  onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  isDarkMode, toggleDarkMode, onSearch, onAIGradingClick, onCompHubClick, onHomeClick 
}) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onHomeClick}>
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl">鯉</div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold serif-font text-gray-900 leading-tight">錦鯉傳承</h1>
              <p className="text-[10px] tracking-widest text-gray-500 uppercase">Nishikigoi Heritage</p>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-8 hidden lg:block">
            <div className="relative">
              <input 
                type="text" 
                placeholder="搜尋文章、品種、管理法..." 
                className="w-full bg-gray-100 border-none rounded-full py-2 px-5 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                onChange={(e) => onSearch(e.target.value)}
              />
              <span className="absolute right-4 top-2 text-gray-400">🔍</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onAIGradingClick}
              className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
            >
              🤖 AI 品評
            </button>
            <button 
              onClick={onCompHubClick}
              className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
            >
              🏆 比賽專區
            </button>
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="切換深色/淺色模式"
            >
              {isDarkMode ? '🌙' : '☀️'}
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden cursor-pointer border border-gray-200">
              <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
