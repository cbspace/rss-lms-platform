// app/posts/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TitleSection from '../components/TitleSection';
import BlogSearchBar from '../components/BlogSearchBar';
import { BlogCard, Channel, Post } from '../components/BlogCard';

export default function PostsIndexPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch posts and channels from backend API
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [postsRes, channelsRes] = await Promise.all([
          fetch('/api/posts'),
          fetch('/api/rss'),
        ]);

        if (postsRes.ok) {
          const rawPosts = await postsRes.json();
          // Normalize Prisma channel objects to a simple channelIds array for UI filters
          const formattedPosts = rawPosts.map((post: any) => ({
            ...post,
            date: post.date ? new Date(post.date).toISOString().split('T')[0] : '',
            channelIds: post.channels
              ? post.channels.map((ch: any) => ch.slug || ch.id)
              : [],
          }));
          setPosts(formattedPosts);
        }

        if (channelsRes.ok) {
          const channelsData = await channelsRes.json();
          setChannels(channelsData);
        }
      } catch (err) {
        console.error('Failed to load posts or channels from API:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

// Filter posts using API state and search query
  const filteredPosts = posts.filter((post) => {
    const postChannels = post.channelIds || [];

    // 1. Channel Filter
    const matchesChannel =
      selectedChannel === 'all' || postChannels.includes(selectedChannel);

    // 2. Search Query Filter
    const query = searchQuery.toLowerCase().trim();
    
    // Strip leading "post-" or "#" so searching "post-2", "#2", or "2" matches postNumber 2
    const queryCleanNumber = query.replace(/^(post-|\#)/i, '');

    const matchesPostNumber =
      post.postNumber !== undefined &&
      (post.postNumber.toString() === queryCleanNumber ||
       `post-${post.postNumber}`.includes(query) ||
       `#${post.postNumber}`.includes(query));

    const matchesSearch =
      query === '' ||
      matchesPostNumber ||
      post.title.toLowerCase().includes(query) ||
      (post.summary && post.summary.toLowerCase().includes(query)) ||
      (post.date && post.date.toLowerCase().includes(query)) ||
      postChannels.some((chId) => chId.toLowerCase().includes(query));

    return matchesChannel && matchesSearch;
  });

  // Determine channel display name for empty state messaging
  const activeChannelObj = channels.find(
    (ch) => ch.slug === selectedChannel || ch.id === selectedChannel
  );
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

      {/* Loading Indicator or Blog Cards Grid */}
      {loading ? (
        <div className="p-12 text-center border border-dashed border-[var(--elementBorder)] bg-[var(--elementBg)] rounded-xl opacity-80">
          <p className="text-base font-mono">Loading posts from database...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
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
            <BlogCard key={post.id} post={post as any} />
          ))}
        </div>
      )}
    </div>
  );
}