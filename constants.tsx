
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
    category: 'varieties',
    tag: PostTag.EXPERIENCE_SHARE,
    content: '紅白最重要的是白地的清澈度與緋盤的邊界。今天要來聊聊如何觀察兩歲魚的潛力...',
    timestamp: '2024-05-20 10:30',
    views: 1240,
    images: ['https://picsum.photos/seed/koi1/800/600'],
    comments: [
      {
        id: 'c1',
        author: MOCK_USERS.producer,
        content: '非常專業的見解，補充一點：水溫對紅白的紅質影響也很大。',
        timestamp: '2024-05-20 11:00',
        likes: 12,
        replies: [
          {
            id: 'c2',
            author: MOCK_USERS.beginner,
            content: '請問水溫應該控制在多少比較理想？',
            timestamp: '2024-05-20 11:15',
            likes: 2
          }
        ]
      }
    ]
  },
  {
    id: 'p2',
    title: '2024 全日本錦鯉品評會：賽況預測與熱門魚隻',
    author: MOCK_USERS.admin,
    category: 'competition',
    tag: PostTag.COMPETITION_DISCUSS,
    content: '今年大型紅白組競爭非常激烈，目前看來...',
    timestamp: '2024-05-19 15:45',
    views: 850,
    comments: []
  }
];

export const ROLE_COLORS: Record<UserRole, string> = {
  [UserRole.BEGINNER]: 'bg-slate-200 text-slate-700',
  [UserRole.MEMBER]: 'bg-blue-100 text-blue-700',
  [UserRole.SENIOR]: 'bg-amber-100 text-amber-700',
  [UserRole.PRODUCER]: 'bg-red-100 text-red-700',
  [UserRole.MODERATOR]: 'bg-indigo-600 text-white'
};
