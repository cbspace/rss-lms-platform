'use client';

import React, { useState, useEffect } from 'react';

export type Channel = {
  id: string;
  slug: string;
  name: string;
};

export interface BlogSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedChannel: string;
  onChannelSelect: (channelId: string) => void;
  channels?: Channel[];
}

export default function BlogSearchBar({
  searchQuery,
  onSearchChange,
  selectedChannel,
  onChannelSelect,
  channels: passedChannels,
}: BlogSearchBarProps) {
  const [internalChannels, setInternalChannels] = useState<Channel[]>([]);

  // Fetch live channels from API if no channels prop is explicitly provided
  useEffect(() => {
    if (passedChannels && passedChannels.length > 0) return;

    async function fetchChannels() {
      try {
        const res = await fetch('/api/rss');
        if (res.ok) {
          const data = await res.json();
          setInternalChannels(data);
        }
      } catch (err) {
        console.error('Failed to fetch channels in BlogSearchBar:', err);
      }
    }

    fetchChannels();
  }, [passedChannels]);

  const activeChannels = passedChannels && passedChannels.length > 0 
    ? passedChannels 
    : internalChannels;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
      {/* Search Input Box */}
      <div className="relative w-full sm:w-72 shrink-0 h-9 flex items-center">
        <span className="absolute left-3 flex items-center pointer-events-none text-sm opacity-50">
          🔍
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search Posts..."
          className="w-full pl-8 pr-8 h-9 rounded-lg border border-[var(--elementBorder)] bg-[var(--background)] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all leading-none flex items-center"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 flex items-center text-sm opacity-50 hover:opacity-100"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Channel Filter Dropdown */}
      <div className="relative w-full sm:w-60 shrink-0">
        <select
          value={selectedChannel}
          onChange={(e) => onChannelSelect(e.target.value)}
          className="w-full h-9 px-3 pr-8 rounded-lg border border-[var(--elementBorder)] bg-[var(--background)] text-sm font-mono font-medium text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer appearance-none transition-all"
        >
          <option value="all">📺 All Channels</option>
          {activeChannels.map((ch) => {
            const channelValue = ch.slug || ch.id;
            return (
              <option key={ch.id || ch.slug} value={channelValue}>
                {ch.name}
              </option>
            );
          })}
        </select>
        {/* Custom Chevron Icon */}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs opacity-60">
          ▼
        </span>
      </div>
    </div>
  );
}