// app/posts/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStoredPosts } from '../lib/PostsStorage';
import { type MockPost } from '@/data/mock_posts';
import { CHANNELS } from '@/data/channels';

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
    const matchesChannel = selectedChannel === 'all' || postChannels.includes(selectedChannel);

    // 2. Search Query Filter (Searches Title, Summary, Date, and Channel IDs)
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      post.title.toLowerCase().includes(query) ||
      post.summary.toLowerCase().includes(query) ||
      post.date.toLowerCase().includes(query) ||
      postChannels.some((chId) => chId.toLowerCase().includes(query));

    return matchesChannel && matchesSearch;
  });

  return (
    <div className="w-full space-y-6">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div className="space-y-4">
          <h1>
            Blog Articles <span aria-hidden="true">✍️</span>
          </h1>
          <p className="text-base opacity-80">
            Manage published articles and RSS output feeds.
          </p>
        </div>

        {/* Action Button Row */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* ➕ Create New Post Button */}
          <Link
            href="/posts/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold shadow-sm transition-colors"
          >
            <span aria-hidden="true">＋</span>
            <span>Create Post</span>
          </Link>
        </div>
      </div>

      {/* Channel Filter Selector & Article Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-1 w-full">
        {/* Article Search Input Box */}
        <div className="relative w-full sm:w-72 shrink-0 h-8 flex items-center">
          <span className="absolute left-3 flex items-center pointer-events-none text-sm opacity-50">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-8 pr-8 h-8 rounded-full border border-[var(--elementBorder)] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all leading-none flex items-center"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 flex items-center text-sm opacity-50 hover:opacity-100"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Scrollable Channel Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto h-8 w-full shrink-0">
          <button
            onClick={() => setSelectedChannel('all')}
            className={`h-8 px-3 inline-flex items-center justify-center rounded-full text-sm font-mono transition-colors whitespace-nowrap shrink-0 ${
              selectedChannel === 'all'
                ? 'bg-purple-600 text-white font-bold'
                : 'border border-[var(--elementBorder)] opacity-70 hover:opacity-100'
            }`}
          >
            All Channels
          </button>

          {CHANNELS.map((ch) => {
            const displayName = ch.name.length > 20 ? `${ch.name.slice(0, 20)}...` : ch.name;

            return (
              <button
                key={ch.id}
                title={ch.name}
                onClick={() => setSelectedChannel(ch.id)}
                className={`h-8 px-3 inline-flex items-center justify-center rounded-full text-sm font-mono transition-colors whitespace-nowrap shrink-0 ${
                  selectedChannel === ch.id
                    ? 'bg-purple-600 text-white font-bold'
                    : 'border border-[var(--elementBorder)] opacity-70 hover:opacity-100'
                }`}
              >
                {displayName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Blog Cards Grid */}
      {filteredPosts.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-[var(--elementBorder)] rounded-xl opacity-70">
          <p className="text-base font-mono">No articles found matching "{searchQuery}"</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedChannel('all'); }}
            className="mt-3 text-sm font-semibold text-purple-400 hover:underline"
          >
            Clear search & filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => {
            const postChannelIds: string[] = post.channelIds || [];

            return (
              <article 
                key={post.id} 
                className="p-5 rounded-xl border border-[var(--elementBorder)] flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  {post.imageUrl && (
                    <div className="w-full h-40 rounded-lg overflow-hidden border border-[var(--elementBorder)] bg-[var(--background)]">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div>
                    <span className="text-sm font-mono opacity-60">{post.date}</span>
                    <h2 className="font-bold text-lg mt-1 text-[var(--foreground)]">
                      {post.title}
                    </h2>
                    <p className="text-base opacity-80 mt-2 line-clamp-3 leading-relaxed">
                      {post.summary}
                    </p>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between gap-2">
                  <Link 
                    href={`/posts/${post.id.replace('post-', '')}`}
                    className="text-sm font-semibold text-purple-400 hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>Read Full Article</span>
                    <span aria-hidden="true">→</span>
                  </Link>

                  {/* Multiple Channel Badges Container */}
                  <div className="flex flex-wrap gap-1 justify-end">
                    {postChannelIds.map((chId) => {
                      const ch = CHANNELS.find((c) => c.id === chId);
                      const channelName = ch ? ch.name : chId;

                      return (
                        <span 
                          key={chId} 
                          title={channelName}
                          className="text-sm font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium truncate max-w-[160px] inline-block"
                        >
                          📺 {channelName}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}