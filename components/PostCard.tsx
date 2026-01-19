
import React from 'react';
import { Post } from '../types';
// Corrected import source for ROLE_COLORS
import { ROLE_COLORS } from '../constants';

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-4">
        {post.images && post.images.length > 0 && (
          <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 hidden sm:block">
            <img src={post.images[0]} alt="Post" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide bg-indigo-50 text-indigo-600 border border-indigo-100`}>
              {post.tag}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">{post.timestamp}</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors serif-font">
            {post.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
            {post.content}
          </p>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <img src={post.author.avatar} alt={post.author.name} className="w-5 h-5 rounded-full border border-gray-200" />
              <span className="text-xs font-medium text-gray-700">{post.author.name}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${ROLE_COLORS[post.author.role]}`}>
                {post.author.role}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">👀 {post.views}</span>
              <span className="flex items-center gap-1">💬 {post.comments.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
