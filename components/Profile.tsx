import React, { useState, useEffect } from 'react';
import { User, Post } from '../types';
import PostCard from './PostCard';
import { PostService } from '../services/dataService';

interface ProfileProps {
    user: User;
    onBack: () => void;
    onPostClick: (post: Post) => void;
    onLike: (post: Post, e: React.MouseEvent) => void;
    onBookmark: (post: Post, e: React.MouseEvent) => void;
    onDelete: (post: Post) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onBack, onPostClick, onLike, onBookmark, onDelete }) => {
    const [activeTab, setActiveTab] = useState<'posts' | 'liked' | 'bookmarked'>('posts');
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        loadTabContent();
    }, [activeTab, user]);

    const handleDelete = (post: Post) => {
        if (window.confirm('確定要刪除這篇文章嗎？')) {
            setPosts(posts.filter(p => p.id !== post.id));
            onDelete(post);
        }
    };

    const loadTabContent = async () => {
        setIsLoading(true);
        let data: Post[] = [];

        try {
            if (activeTab === 'posts') {
                data = await PostService.getUserPosts(user.id);
            } else if (activeTab === 'liked') {
                data = await PostService.getLikedPosts(user.id);
            } else if (activeTab === 'bookmarked') {
                data = await PostService.getBookmarkedPosts(user.id);
            }
        } catch (error) {
            console.error('Error loading tab data', error);
        }

        setPosts(data);
        setIsLoading(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header / Back Button */}
            <div className="flex items-center gap-2 mb-2">
                <button
                    onClick={onBack}
                    className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1 font-medium"
                >
                    ← 返回討論區
                </button>
            </div>

            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-pink-500 mb-4">
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full rounded-full border-4 border-white dark:border-gray-800 object-cover bg-white"
                    />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{user.name}</h2>
                <span className="bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs px-3 py-1 rounded-full font-bold mb-6">
                    {user.role}
                </span>

                {/* Stats - Fake numbers for now since we don't have aggregation queries yet */}
                <div className="grid grid-cols-3 gap-8 w-full max-w-sm border-t border-gray-100 dark:border-gray-700 pt-6">
                    <div>
                        <div className="text-xl font-bold text-gray-900 dark:text-gray-100">--</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">文章</div>
                    </div>
                    <div>
                        <div className="text-xl font-bold text-gray-900 dark:text-gray-100">--</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">獲讚</div>
                    </div>
                    <div>
                        <div className="text-xl font-bold text-gray-900 dark:text-gray-100">--</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">粉絲</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('posts')}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'posts'
                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        }`}
                >
                    我的文章
                </button>
                <button
                    onClick={() => setActiveTab('liked')}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'liked'
                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        }`}
                >
                    按讚的文章
                </button>
                <button
                    onClick={() => setActiveTab('bookmarked')}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'bookmarked'
                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        }`}
                >
                    收藏的文章
                </button>
            </div>

            {/* Content */}
            <div className="min-h-[200px]">
                {isLoading ? (
                    <div className="text-center py-20 text-gray-500 dark:text-gray-400">載入中...</div>
                ) : posts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {posts.map(post => (
                            <PostCard
                                key={post.id}
                                post={post}
                                onClick={() => onPostClick(post)}
                                onLike={(e) => onLike(post, e)}
                                onBookmark={(e) => onBookmark(post, e)}
                                onDelete={(e) => {
                                    if (window.confirm('確定要刪除嗎？')) {
                                        setPosts(posts.filter(p => p.id !== post.id));
                                        onDelete(post);
                                    }
                                }}
                                isLiked={post.isLiked}
                                isBookmarked={post.isBookmarked}
                                isOwner={activeTab === 'posts' || user.id === post.author.id}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                        {activeTab === 'posts' && '您還沒有發布過文章'}
                        {activeTab === 'liked' && '您還沒有按讚任何文章'}
                        {activeTab === 'bookmarked' && '您還沒有收藏任何文章'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
