
import React from 'react';
import { CATEGORIES } from '../constants';

interface SidebarProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeCategory, onSelectCategory }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">論壇分類</h3>
        <nav className="space-y-1">
          <button
            onClick={() => onSelectCategory('all')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-3 ${
              activeCategory === 'all' 
                ? 'bg-indigo-50 text-indigo-700 font-bold' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🏠 全部討論
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-3 ${
                activeCategory === cat.id 
                  ? 'bg-indigo-50 text-indigo-700 font-bold' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              <div className="flex flex-col">
                <span>{cat.name}</span>
                <span className="text-[10px] text-gray-400 font-normal">{cat.description}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 bg-gray-900 rounded-xl text-white shadow-lg overflow-hidden relative">
        <div className="relative z-10">
          <h4 className="text-sm font-bold mb-1">社群規範</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            我們致力於打造最高品質的錦鯉論壇。請保持禮貌、客觀，並尊重新手的每一次發問。
          </p>
        </div>
        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
      </div>
    </div>
  );
};

export default Sidebar;
