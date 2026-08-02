// app/posts/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStoredPosts } from '@/data/PostsStorage';
import { type MockPost } from '@/data/mock_posts';
import { CHANNELS } from '@/data/mock_channels';
import TitleSection from '../components/TitleSection';
import BlogSearchBar from '../components/BlogSearchBar';
import BlogCard from '../components/BlogCard';

export default function PostsIndexPage() {
  const [posts, setPosts] = useState<MockPost[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    setPosts(getStoredPosts());
  }, []);

  // Filter posts using local state and search query
  const filteredPosts = posts.filter((post) => {
    const postChannels = post.channelIds || [];

    // 1. Channel Filter
    const matchesChannel =
      selectedChannel === 'all' || postChannels.includes(selectedChannel);

    // 2. Search Query Filter
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      post.title.toLowerCase().includes(query) ||
      post.summary.toLowerCase().includes(query) ||
      post.date.toLowerCase().includes(query) ||
      postChannels.some((chId) => chId.toLowerCase().includes(query));

    return matchesChannel && matchesSearch;
  });

  // Determine channel display name for empty state messaging
  const activeChannelObj = CHANNELS.find((ch) => ch.id === selectedChannel);
  const activeChannelName = activeChannelObj ? activeChannelObj.name : selectedChannel;

  // Dynamic empty state message
  const emptyStateMessage = () => {
    const hasQuery = searchQuery.trim() !== '';
    const hasChannel = selectedChannel !== 'all';

    if (hasQuery && hasChannel) {
      return `No articles found matching "${searchQuery}" in ${activeChannelName}`;
    }
    if (hasQuery) {
      return `No articles found matching "${searchQuery}"`;
    }
    if (hasChannel) {
      return `No articles found in ${activeChannelName}`;
    }
    return 'No articles found';
  };

  return (
    <div id="posts" className="w-full space-y-6 pb-10">
      <TitleSection
        title="Blog Posts"
        icon="✍️"
        content={<p>Manage published blog posts and search posts across feeds.</p>}
      />

      {/* Control Bar: Search & Filter on Left, Create Button on Right */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-1 w-full">
        {/* Left Container: Search Input & Channel Dropdown */}
        <div className="w-full sm:w-auto">
          <BlogSearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedChannel={selectedChannel}
            onChannelSelect={setSelectedChannel}
          />
        </div>

        {/* Right Container: Create Post Button */}
        <div className="w-full sm:w-auto flex justify-end shrink-0">
          <Link
            href="/posts/create"
            className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold shadow-sm transition-colors w-full sm:w-auto"
          >
            <span aria-hidden="true">＋</span>
            <span>Create Post</span>
          </Link>
        </div>
      </div>

      {/* Blog Cards Grid */}
      {filteredPosts.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-[var(--elementBorder)] bg-[var(--elementBg)] rounded-xl opacity-80 space-y-2">
          <p className="text-base font-mono">{emptyStateMessage()}</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedChannel('all');
            }}
            className="text-sm font-semibold text-purple-400 hover:underline"
          >
            Clear search & filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}