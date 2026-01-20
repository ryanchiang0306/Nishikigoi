
import React from 'react';
import { Post } from '../types';
// Corrected import source for ROLE_COLORS
import { ROLE_COLORS } from '../constants';


interface PostCardProps {
  post: Post;
  onClick: () => void;
  onLike?: (e: React.MouseEvent) => void;
  onBookmark?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  isLiked?: boolean;
  isBookmarked?: boolean;
  isOwner?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onClick,
  onLike,
  onBookmark,
  onDelete,
  isLiked = false,
  isBookmarked = false,
  isOwner = false
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all cursor-pointer group relative"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <img src={post.author.avatar} alt={post.author.name} className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-600" loading="lazy" />
          <span className="text-sm font-medium text-gray-700 dark:text-white">{post.author.name}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${ROLE_COLORS[post.author.role]}`}>
            {post.author.role}
          </span>
        </div>
      </div>

      <div className="flex items-start gap-4">
        {post.images && post.images.length > 0 && (
          <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 hidden sm:block">
            <img src={post.images[0]} alt="Post thumbnail" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
          </div>
        )}
        <div className="flex-1">

          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800`}>
              {post.tag}
            </span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500 dark:text-white">{post.timestamp}</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors serif-font">
            {post.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-white line-clamp-2 mb-4 leading-7">
            {post.content}
          </p>

          <div className="flex items-center justify-between mt-auto">

            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-white">
              <div className="flex items-center gap-4">
                <button
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${isLiked ? 'text-pink-600 dark:text-pink-400' : 'text-gray-500 hover:text-pink-600 dark:text-gray-500 dark:hover:text-pink-400'}`}
                  onClick={onLike}
                >
                  <span className="text-base">{isLiked ? '♥' : '♡'}</span> {post.likes || 0}
                </button>
                <button className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-indigo-600 dark:text-gray-500 dark:hover:text-indigo-400 transition-colors">
                  <span className="text-base">💬</span> {post.comments?.length || 0}
                </button>
                <button
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${isBookmarked ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500 dark:text-gray-500'}`}
                  onClick={onBookmark}
                >
                  <span className="text-base">{isBookmarked ? '★' : '☆'}</span> 收藏
                </button>
              </div>

              {isOwner && (
                <button
                  className="text-gray-500 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 transition-colors p-1"
                  onClick={(e) => { e.stopPropagation(); onDelete?.(e); }}
                  title="刪除文章"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
