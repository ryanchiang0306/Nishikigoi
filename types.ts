
export enum UserRole {
  BEGINNER = '新手',
  MEMBER = '一般會員',
  SENIOR = '資深玩家',
  PRODUCER = '認證生產者',
  MODERATOR = '管理員'
}

export enum PostTag {
  BEGINNER_QA = '新手提問',
  EXPERIENCE_SHARE = '經驗分享',
  COMPETITION_DISCUSS = '比賽討論',
  GENERAL = '一般交流'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  email?: string;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: string;
  replies?: Comment[];
  likes: number;
}

export interface Post {
  id: string;
  title: string;
  author: User;
  category: string;
  tag: PostTag;
  content: string;
  images?: string[];
  timestamp: string;
  views: number;
  comments: Comment[];
  likes: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface GradingResult {
  bodyShape: number;
  pattern: number;
  quality: number;
  summary: string;
}
