
import React, { useState } from 'react';
import { Post, Comment } from '../types';
// Corrected import source for ROLE_COLORS
import { ROLE_COLORS } from '../constants';

interface PostViewProps {
  post: Post;
  onBack: () => void;
  onLike?: (e: React.MouseEvent) => void;
  onBookmark?: (e: React.MouseEvent) => void;
  onDelete?: () => void;
  isOwner?: boolean;
}

const CommentItem: React.FC<{ comment: Comment; depth?: number }> = ({ comment, depth = 0 }) => {
  return (
    <div className={`py-4 ${depth > 0 ? 'ml-8 border-l-2 border-gray-100 dark:border-gray-700 pl-4 mt-2' : 'border-b border-gray-100 dark:border-gray-700 last:border-0'}`}>
      <div className="flex items-start gap-3">
        <img src={comment.author.avatar} alt={comment.author.name} className="w-8 h-8 rounded-full flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{comment.author.name}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${ROLE_COLORS[comment.author.role]}`}>
              {comment.author.role}
            </span>
            <span className="text-xs text-gray-400">{comment.timestamp}</span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{comment.content}</p>
          <div className="mt-2 flex items-center gap-4 text-xs font-medium text-gray-400">
            <button className="hover:text-indigo-600 transition-colors">讚 ({comment.likes})</button>
            <button className="hover:text-indigo-600 transition-colors">回覆</button>
            <button className="hover:text-indigo-600 transition-colors">引用</button>
          </div>
          {comment.replies?.map(reply => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      </div>
    </div>
  );
};

const PostView: React.FC<PostViewProps> = ({ post, onBack, onLike, onBookmark, onDelete, isOwner }) => {
  const [commentText, setCommentText] = useState('');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
        <button
          onClick={onBack}
          className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1 font-medium"
        >
          ← 返回列表
        </button>

        <div className="flex items-center gap-2">
          {isOwner && (
            <button
              onClick={() => {
                if (window.confirm('確定要刪除這篇文章嗎？此動作無法復原。')) {
                  onDelete?.();
                }
              }}
              className="text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 px-3 py-1 rounded-full text-sm font-medium transition-colors"
            >
              🗑️ 刪除
            </button>
          )}
          <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">文章詳情</span>
          {/* Share / More actions could go here */}
        </div>
      </div>

      <article className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 dark:text-gray-100">{post.author.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${ROLE_COLORS[post.author.role]}`}>
                  {post.author.role}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5">發布於 {post.timestamp}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${post.isLiked ? 'bg-pink-50 border-pink-200 text-pink-600 dark:bg-pink-900/30 dark:border-pink-800 dark:text-pink-400' : 'border-gray-200 text-gray-500 hover:border-pink-200 hover:text-pink-500 dark:border-gray-600 dark:text-gray-400'}`}
            >
              <span className="text-lg">{post.isLiked ? '❤️' : '🤍'}</span>
              <span className="font-bold text-sm">{post.likes}</span>
            </button>
            <button
              onClick={onBookmark}
              className={`p-2 rounded-full border transition-all ${post.isBookmarked ? 'bg-yellow-50 border-yellow-200 text-yellow-600 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-400' : 'border-gray-200 text-gray-400 hover:border-yellow-200 hover:text-yellow-500 dark:border-gray-600 dark:text-gray-400'}`}
            >
              <span className="text-lg">{post.isBookmarked ? '★' : '☆'}</span>
            </button>
          </div>
        </div>

        <h1 className="text-3xl font-bold serif-font text-gray-900 dark:text-gray-50 mb-6 leading-tight">{post.title}</h1>

        <div className="prose prose-indigo max-w-none text-gray-700 dark:text-gray-300 leading-loose dark:prose-invert">
          {post.content.split('\n').map((para, i) => (
            <p key={i} className="mb-4">{para}</p>
          ))}
        </div>

        {post.images?.map((url, i) => (
          <div key={i} className="my-8 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
            <img src={url} alt="Koi" className="w-full h-auto object-cover" />
          </div>
        ))}

        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold serif-font text-gray-900 dark:text-gray-50 mb-6">討論回覆 ({post.comments.length})</h3>

          <div className="mb-8">
            <textarea
              className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 transition-all text-sm min-h-[120px]"
              placeholder="參與這場高品質的討論..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div className="flex justify-end mt-3">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-sm">
                送出回覆
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {post.comments.length > 0 ? (
              post.comments.map(comment => (
                <CommentItem key={comment.id} comment={comment} />
              ))
            ) : (
              <div className="text-center py-10 text-gray-400 italic">尚無任何討論，成為第一個回覆的人。</div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default PostView;
