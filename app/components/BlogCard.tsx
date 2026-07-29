// components/BlogCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { type MockPost } from '@/data/mock_posts';
import { CHANNELS, type Channel } from '@/data/mock_channels';

export interface BlogCardProps {
  post: MockPost;
  channels?: Channel[];
}

export default function BlogCard({ post, channels = CHANNELS }: BlogCardProps) {
  const postChannelIds: string[] = post.channelIds || [];
  const cleanId = post.id.replace(/^post-/, '');

  return (
    <article className="p-5 rounded-xl border border-[var(--elementBorder)] bg-[var(--elementBg)] flex flex-col justify-between gap-4">
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
          href={`/posts/${cleanId}`}
          className="text-sm font-semibold text-purple-400 hover:underline flex items-center gap-1 shrink-0"
        >
          <span>Read Full Article</span>
          <span aria-hidden="true">→</span>
        </Link>

        {/* Multiple Channel Badges Container */}
        <div className="flex flex-wrap gap-1 justify-end">
          {postChannelIds.map((chId) => {
            const ch = channels.find((c) => c.id === chId);
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
}