
import React, { useState, useEffect } from 'react';
import { CATEGORIES, MOCK_POSTS, ROLE_COLORS } from './constants';
import { Post, Category, UserRole, PostTag } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PostCard from './components/PostCard';
import PostView from './components/PostView';
import AIGrading from './components/AIGrading';
import CompetitionHub from './components/CompetitionHub';
import PostForm from './components/PostForm';

import { PostService } from './services/dataService';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showAIGrading, setShowAIGrading] = useState(false);
  const [showCompHub, setShowCompHub] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Real data state
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch posts on load
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    const data = await PostService.getPosts();
    // Use fallback mock data ONLY if DB is empty or fails (optional, good for demo)
    if (data.length === 0) {
      // Fallback for initial demo experience if user hasn't set up DB yet
      setPosts(MOCK_POSTS);
    } else {
      setPosts(data);
    }
    setIsLoading(false);
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreatePost = async (newPost: Post) => {
    // Optimistic update
    setPosts([newPost, ...posts]);
    setShowPostForm(false);

    // Persist to DB
    await PostService.createPost(newPost).then(saved => {
      if (saved) {
        // Replace optimistic post with real one (with ID)
        setPosts(prev => [saved, ...prev.filter(p => p !== newPost)]);
      }
    });
  };

  const renderContent = () => {
    if (selectedPost) {
      return (
        <PostView
          post={selectedPost}
          onBack={() => setSelectedPost(null)}
        />
      );
    }

    if (showAIGrading) {
      return <AIGrading onBack={() => setShowAIGrading(false)} />;
    }

    if (showCompHub) {
      return <CompetitionHub onBack={() => setShowCompHub(false)} />;
    }

    return (
      <div className="space-y-6">
        {/* Intro for beginners */}
        {activeCategory === 'basics' && (
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-4 rounded shadow-sm">
            <h3 className="text-lg font-bold text-indigo-800">🌱 新手快速導覽</h3>
            <p className="text-sm text-indigo-700 mt-1">
              歡迎來到錦鯉的世界！本專區提供最基礎的水質管理與名詞解釋。
              若有任何疑問，歡迎使用標籤「新手提問」發文。
            </p>
          </div>
        )}

        {/* Post List */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold serif-font text-gray-800">
            {activeCategory === 'all' ? '熱門討論' : CATEGORIES.find(c => c.id === activeCategory)?.name}
          </h2>
          <button
            onClick={() => setShowPostForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2"
          >
            <span className="text-xl">+</span> 發布新文章
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-gray-500">載入中...</div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => setSelectedPost(post)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            目前沒有相關文章
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-[#F8F9FA] text-gray-900'}`}>
      <Header
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onSearch={setSearchQuery}
        onAIGradingClick={() => {
          setShowAIGrading(true);
          setShowCompHub(false);
          setSelectedPost(null);
        }}
        onCompHubClick={() => {
          setShowCompHub(true);
          setShowAIGrading(false);
          setSelectedPost(null);
        }}
        onHomeClick={() => {
          setActiveCategory('all');
          setSelectedPost(null);
          setShowAIGrading(false);
          setShowCompHub(false);
        }}
      />

      <div className="flex flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        <aside className="hidden md:block w-64 flex-shrink-0">
          <Sidebar
            activeCategory={activeCategory}
            onSelectCategory={(id) => {
              setActiveCategory(id);
              setSelectedPost(null);
              setShowAIGrading(false);
              setShowCompHub(false);
            }}
          />
        </aside>

        <main className="flex-1 min-w-0">
          {renderContent()}
        </main>
      </div>

      {showPostForm && (
        <PostForm
          onClose={() => setShowPostForm(false)}
          onSubmit={handleCreatePost}
          categories={CATEGORIES}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12 py-8 text-center text-sm text-gray-500">
        <p>© 2024 錦鯉傳承 - 專注於品質與品位的學術交流平台</p>
        <p className="mt-2 text-xs">尊重新手，專業交流，理性辯證</p>
      </footer>
    </div>
  );
};

export default App;
