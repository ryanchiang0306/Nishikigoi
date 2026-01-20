import { useAuth } from '../contexts/AuthContextDefinition';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onSearch: (q: string) => void;
  onAIGradingClick: () => void;
  onCompHubClick: () => void;
  onHomeClick: () => void;
  onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isDarkMode, toggleDarkMode, onSearch, onAIGradingClick, onCompHubClick, onHomeClick, onProfileClick
}) => {
  const { user, openAuthModal, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onHomeClick}>
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl">鯉</div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold serif-font text-white">錦鯉傳承</h1>
              <p className="text-[10px] tracking-widest text-white uppercase">Nishikigoi Heritage</p>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-8 hidden lg:block">
            <div className="relative">
              <input
                type="text"
                placeholder="搜尋文章、品種、管理法..."
                className="w-full bg-gray-100 dark:bg-gray-700 border-none rounded-full py-2 px-5 text-sm focus:ring-2 focus:ring-indigo-500 transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                onChange={(e) => onSearch(e.target.value)}
              />
              <span className="absolute right-4 top-2 text-gray-400 dark:text-gray-500">🔍</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onAIGradingClick}
              className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              🤖 AI 品評
            </button>
            <button
              onClick={onCompHubClick}
              className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              🏆 比賽專區
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="切換深色/淺色模式"
            >
              {isDarkMode ? '🌙' : '☀️'}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={onProfileClick}
                  className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 p-1.5 rounded-lg transition-colors group"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 group-hover:border-indigo-300 dark:group-hover:border-indigo-500 transition-colors"
                  />
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{user.name}</div>
                    <div className="text-[10px] text-gray-400 dark:text-gray-500">{user.email?.split('@')[0]}</div>
                  </div>
                </button>
                <button
                  onClick={signOut}
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 font-medium px-2 py-1"
                >
                  登出
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-medium shadow-sm transition-all hover:shadow-indigo-200 dark:hover:shadow-indigo-900"
              >
                登入 / 註冊
              </button>
            )}
          </div>
        </div>
      </div>
    </nav >
  );
};

export default Header;
