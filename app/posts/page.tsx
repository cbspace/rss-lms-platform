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

  useEffect(() => {
    setPosts(getStoredPosts());
  }, []);

  // Filter posts using local state rather than static import
  const filteredPosts = selectedChannel === 'all'
    ? posts
    : posts.filter((post) => {
        const channels = post.channelIds || [];
        return channels.includes(selectedChannel);
      });

  return (
    <div className="w-full space-y-6">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--elementBorder)] pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Blog Articles <span aria-hidden="true">✍️</span>
          </h1>
          <p className="text-sm opacity-80 mt-1">
            Manage published articles and RSS output feeds.
          </p>
        </div>

        {/* Action Button Row */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* RSS Feed Badge */}
          <a
            href={selectedChannel === 'all' ? '/api/rss' : `/api/rss?channel=${selectedChannel}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-mono font-medium hover:bg-orange-500/20 transition-colors"
          >
            <span>📡 RSS Feed</span>
            <span aria-hidden="true">↗</span>
          </a>

          {/* ➕ Create New Post Button */}
          <Link
            href="/posts/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <span aria-hidden="true">＋</span>
            <span>Create Post</span>
          </Link>
        </div>
      </div>

      {/* Channel Filter Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedChannel('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors whitespace-nowrap ${
            selectedChannel === 'all'
              ? 'bg-purple-600 text-white font-bold'
              : 'border border-[var(--elementBorder)] bg-[var(--elementBg)] opacity-70 hover:opacity-100'
          }`}
        >
          All Channels
        </button>

        {CHANNELS.map((ch) => (
          <button
            key={ch.id}
            onClick={() => setSelectedChannel(ch.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors whitespace-nowrap ${
              selectedChannel === ch.id
                ? 'bg-purple-600 text-white font-bold'
                : 'border border-[var(--elementBorder)] bg-[var(--elementBg)] opacity-70 hover:opacity-100'
            }`}
          >
            📺 {ch.name}
          </button>
        ))}
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPosts.map((post) => {
          const postChannelIds: string[] = post.channelIds || [];

          return (
            <article 
              key={post.id} 
              className="p-5 rounded-xl border border-[var(--elementBorder)] bg-[var(--elementBg)] flex flex-col justify-between gap-4"
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
                  <span className="text-xs font-mono opacity-60">{post.date}</span>
                  <h2 className="font-bold text-lg mt-1 text-[var(--foreground)]">
                    {post.title}
                  </h2>
                  <p className="text-sm opacity-80 mt-2 line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--elementBorder)] flex items-center justify-between gap-2">
                <Link 
                  href={`/posts/${post.id.replace('post-', '')}`}
                  className="text-xs font-semibold text-purple-400 hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>Read Full Article</span>
                  <span aria-hidden="true">→</span>
                </Link>

                {/* Multiple Channel Badges Container */}
                <div className="flex flex-wrap gap-1 justify-end">
                  {postChannelIds.map((chId) => {
                    const ch = CHANNELS.find((c) => c.id === chId);
                    return (
                      <span 
                        key={chId} 
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium"
                      >
                        📺 {ch ? ch.name : chId}
                      </span>
                    );
                  })}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}