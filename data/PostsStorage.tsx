// lib/PostsStorage.ts
import { MOCK_POSTS, type MockPost } from '@/data/mock_posts';

const STORAGE_KEY = 'rss_mock_posts';

export function getStoredPosts(): MockPost[] {
  if (typeof window === 'undefined') return MOCK_POSTS;
  
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return MOCK_POSTS;
    }
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_POSTS));
  return MOCK_POSTS;
}

export function savePost(newPost: MockPost): void {
  if (typeof window === 'undefined') return;
  
  const current = getStoredPosts();
  const updated = [newPost, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}