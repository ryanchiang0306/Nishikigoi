
import React from 'react';
import { Category, UserRole, PostTag, Post, User } from './types';

export const CATEGORIES: Category[] = [
  { id: 'basics', name: '新手入門', description: '養鯉基礎、名詞解釋', icon: '🌱' },
  { id: 'management', name: '飼養與池子管理', description: '水質、濾材、疾病', icon: '💧' },
  { id: 'varieties', name: '品種討論', description: '紅白、昭和、三色', icon: '🐟' },
  { id: 'competition', name: '錦鯉比賽專區', description: '品評會資訊、觀賽討論', icon: '🏆' },
  { id: 'ai-tech', name: 'AI 品評與科技', description: '智慧輔助、影像分析', icon: '🤖' },
  { id: 'gallery', name: '圖片分享區', description: '美魚賞析', icon: '🖼️' },
  { id: 'community', name: '閒聊交流', description: '社群互動', icon: '💬' }
];

export const MOCK_USERS: Record<string, User> = {
  admin: { id: 'u1', name: '中島大輔', role: UserRole.MODERATOR, avatar: 'https://picsum.photos/seed/daisuke/100/100' },
  senior: { id: 'u2', name: '林長青', role: UserRole.SENIOR, avatar: 'https://picsum.photos/seed/lin/100/100' },
  beginner: { id: 'u3', name: '小王', role: UserRole.BEGINNER, avatar: 'https://picsum.photos/seed/wang/100/100' },
  producer: { id: 'u4', name: '新潟錦鯉場', role: UserRole.PRODUCER, avatar: 'https://picsum.photos/seed/farm/100/100' }
};

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    title: '【分享】紅白錦鯉的質地判斷標準與經驗談',
    author: MOCK_USERS.senior,
    category: 'management',
    tag: PostTag.EXPERIENCE_SHARE,
    content: '春季氣溫回暖，是細菌最容易滋生的季節。建議各位魚友注意以下幾點：1. 逐步增加餵食量 2. 定期檢測氨氮數值 3. 過濾槽的大清洗...',
    timestamp: '2024/03/10',
    views: 452,
    comments: [],
    likes: 24
  },
  {
    id: '3',
    title: '第55屆全日本錦鯉品評會參賽心得',
    author: MOCK_USERS.admin, // Assuming 'expert' is 'admin' for now based on MOCK_USERS
    category: 'competition', // Changed from 'news' to 'competition' to match existing categories
    tag: PostTag.COMPETITION_DISCUSS,
    content: '這次有幸參加全日本品評會，見識到了許多頂級的紅白。特別是冠軍魚的體型，真的是教科書級別的...',
    images: ['https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&q=80&w=1000'],
    timestamp: '2024/02/28',
    views: 890,
    comments: [],
    likes: 156
  }
];

export const ROLE_COLORS: Record<UserRole, string> = {
  [UserRole.BEGINNER]: 'bg-slate-200 text-slate-700',
  [UserRole.MEMBER]: 'bg-blue-100 text-blue-700',
  [UserRole.SENIOR]: 'bg-amber-100 text-amber-700',
  [UserRole.PRODUCER]: 'bg-red-100 text-red-700',
  [UserRole.MODERATOR]: 'bg-indigo-600 text-white'
};
