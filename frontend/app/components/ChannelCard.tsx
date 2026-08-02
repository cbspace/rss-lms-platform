// components/ChannelCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { type Channel } from '@/data/mock_channels';

export interface ChannelCardProps {
  channel: Channel;
}

export default function ChannelCard({ channel }: ChannelCardProps) {
  const rssEndpoint = `/api/rss/${channel.id}`;

  return (
    <div className="p-5 rounded-xl border border-[var(--elementBorder)] bg-[var(--elementBg)] flex flex-col justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded text-sm font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold">
            ID: {channel.id}
          </span>
          <span className="text-sm font-mono opacity-50">Active Stream</span>
        </div>

        <h2 className="text-lg font-bold text-[var(--foreground)]">
          📺 {channel.name}
        </h2>

        <p className="text-base opacity-80 leading-relaxed">
          {channel.description || 'No description provided for this channel.'}
        </p>
      </div>

      {/* Channel RSS Endpoint Preview & Link */}
      <div className="pt-2 flex items-center justify-between gap-2">
        <code className="text-sm font-mono opacity-60 truncate bg-[var(--background)] px-2 py-1 rounded">
          {rssEndpoint}
        </code>

        <Link
          href={rssEndpoint}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-mono font-medium text-orange-400 hover:underline shrink-0"
        >
          <span>RSS XML</span>
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </div>
  );
}