export type UserType = 'creator' | 'freelancer' | 'admin';

export interface PortfolioItem {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
}

export interface Client {
  id: string;
  name: string;
  website?: string;
}

export interface Review {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  lastname: string;
  email: string;
  type: UserType;
  channel?: string;
  specialty?: string;
  skills?: string[];
  status?: 'active' | 'blocked';
  description?: string;
  avatar?: string;
  socialLinks?: {
    youtube?: string;
    tiktok?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  portfolio?: PortfolioItem[];
  clients?: Client[];
  reviews?: Review[];
  categories?: string[];
  reputation?: {
    score: number; // 0 to 100
    level: 'New' | 'Rising Talent' | 'Top Rated' | 'Expert';
    completedJobs: number;
  };
}

export interface Project {
  id: string;
  title: string;
  category: string;
  budget: string;
  description: string;
  skills: string;
  duration: string;
  experience: string;
  creatorId: string;
  creatorName: string;
  createdAt: string;
  status: 'active' | 'in-progress' | 'completed' | 'closed';
}

export interface Proposal {
  id: string;
  projectId: string;
  freelancerId: string;
  freelancerName: string;
  coverLetter: string;
  price: string;
  time: string;
  portfolio: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  participants: string[]; // User IDs
  participantNames: Record<string, string>; // Map ID to Name
  messages: Message[];
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  active: boolean;
}

export type BlogBlockType = 'paragraph' | 'h1' | 'h2' | 'h3' | 'image' | 'quote' | 'list';

export interface BlogBlock {
  id: string;
  type: BlogBlockType;
  content: string; // For text or image URL
  caption?: string; // For images
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  author: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  blocks: BlogBlock[];
  slug: string;
}
