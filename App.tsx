
import React, { useState, useEffect } from 'react';
import { CATEGORIES, MOCK_POSTS } from './constants';
import { Post } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PostCard from './components/PostCard';
import PostView from './components/PostView';
import AIGrading from './components/AIGrading';
import CompetitionHub from './components/CompetitionHub';
import PostForm from './components/PostForm';
import Profile from './components/Profile'; // Added Profile import

import { PostService } from './services/dataService';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthModal from './components/AuthModal';


const AppContent: React.FC = () => {
  const { user, openAuthModal, isAuthModalOpen, closeAuthModal } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showAIGrading, setShowAIGrading] = useState(false);
  const [showCompHub, setShowCompHub] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false); // Added showProfile state
  const [isDarkMode, setIsDarkMode] = useState(false);
  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  const [searchQuery, setSearchQuery] = useState('');

  // Real data state
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch posts on load
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadPosts();
  }, [user]); // Reload when user changes

  const loadPosts = async () => {
    setIsLoading(true);
    const data = await PostService.getPosts(user?.id);
    // Use fallback mock data ONLY if DB is empty or fails (optional, good for demo)
    if (data.length === 0 && !user) {
      // Fallback for initial demo experience if user hasn't set up DB yet
      setPosts(MOCK_POSTS.map(p => ({ ...p, likes: 0 }))); // Mock fallback
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

  const handleCreatePostClick = () => {
    if (!user) {
      openAuthModal();
    } else {
      setShowPostForm(true);
    }
  };

  const handleCreatePost = async (newPost: Post) => {
    // Optimistic update
    setPosts([newPost, ...posts]);
    setShowPostForm(false);

    // Persist to DB
    await PostService.createPost(newPost, user?.id).then(saved => {
      if (saved) {
        // Replace optimistic post with real one (with ID)
        setPosts(prev => [saved, ...prev.filter(p => p !== newPost)]);
      }
    });
  };

  const handleLike = async (post: Post, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      openAuthModal();
      return;
    }

    // Optimistic Update
    const isLiked = !post.isLiked;
    const newLikes = isLiked ? (post.likes || 0) + 1 : (post.likes || 0) - 1;

    const updatedPost = { ...post, isLiked, likes: newLikes };

    setPosts(posts.map(p =>
      p.id === post.id ? updatedPost : p
    ));

    // If currently viewing this post, update selectedPost as well
    if (selectedPost && selectedPost.id === post.id) {
      setSelectedPost(updatedPost);
    }

    // API Call
    await PostService.toggleLike(post.id, user.id);
  };

  const handleBookmark = async (post: Post, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      openAuthModal();
      return;
    }

    // Optimistic Update
    const isBookmarked = !post.isBookmarked;
    const updatedPost = { ...post, isBookmarked };

    setPosts(posts.map(p =>
      p.id === post.id ? updatedPost : p
    ));

    if (selectedPost && selectedPost.id === post.id) {
      setSelectedPost(updatedPost);
    }

    // API Call
    await PostService.toggleBookmark(post.id, user.id);
  };

  const handleDeletePost = async (post: Post) => {
    // Optimistic delete
    setPosts(posts.filter(p => p.id !== post.id));
    if (selectedPost?.id === post.id) {
      setSelectedPost(null);
    }

    // API Call
    await PostService.deletePost(post.id);
  };

  const handleProfileClick = () => { // Added handleProfileClick
    setShowProfile(true);
    setSelectedPost(null);
    setShowAIGrading(false);
    setShowCompHub(false);
  };

  const renderContent = () => {
    if (selectedPost) {
      return (
        <PostView
          post={selectedPost}
          onBack={() => setSelectedPost(null)}
          onLike={(e) => handleLike(selectedPost, e)}
          onBookmark={(e) => handleBookmark(selectedPost, e)}
          onDelete={() => handleDeletePost(selectedPost)}
          isOwner={user?.id === selectedPost.author.id}
        />
      );
    }

    if (showProfile && user) { // Render Profile component
      return (
        <Profile
          user={user}
          onBack={() => setShowProfile(false)}
          onPostClick={(post) => setSelectedPost(post)}
          onLike={handleLike}
          onBookmark={handleBookmark}
          onDelete={handleDeletePost}
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
          <h2 className="text-2xl font-bold serif-font text-gray-900 dark:text-white">
            {activeCategory === 'all' ? '熱門討論' : CATEGORIES.find(c => c.id === activeCategory)?.name}
          </h2>
          <button
            onClick={handleCreatePostClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2"
          >
            <span className="text-xl">+</span> 發布新文章
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">載入中...</div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => setSelectedPost(post)}
                onLike={(e) => handleLike(post, e)}
                onBookmark={(e) => handleBookmark(post, e)}
                onDelete={(e) => {
                  if (window.confirm('確定要刪除嗎？')) {
                    handleDeletePost(post);
                  }
                }}
                isLiked={post.isLiked}
                isBookmarked={post.isBookmarked}
                isOwner={user?.id === post.author.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
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
          setShowProfile(false);
        }}
        onCompHubClick={() => {
          setShowCompHub(true);
          setShowAIGrading(false);
          setSelectedPost(null);
          setShowProfile(false);
        }}
        onHomeClick={() => {
          setActiveCategory('all');
          setSelectedPost(null);
          setShowAIGrading(false);
          setShowCompHub(false);
          setShowProfile(false);
        }}
        onProfileClick={handleProfileClick}
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

      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12 py-8 text-center text-sm text-gray-500">
        <p>© 2024 錦鯉傳承 - 專注於品質與品位的學術交流平台</p>
        <p className="mt-2 text-xs">尊重新手，專業交流，理性辯證</p>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
