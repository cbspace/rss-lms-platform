// app/channels/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CHANNELS, type Channel } from '@/data/mock_channels';
import TitleSection from '../components/TitleSection';
import AddChannelPanel from '../components/AddChannelPanel';

export default function ChannelsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [channelsList, setChannelsList] = useState<Channel[]>([]);

  // Hydrate channels from localStorage/Proxy on client mount and storage events
  useEffect(() => {
    const syncChannels = () => {
      setChannelsList([...CHANNELS]);
    };

    syncChannels();

    window.addEventListener('storage', syncChannels);
    return () => window.removeEventListener('storage', syncChannels);
  }, []);

  const handleAddChannelSuccess = () => {
    // Refresh local state and hide panel
    setChannelsList([...CHANNELS]);
    setShowAddForm(false);
  };

  return (
    <div className="w-full space-y-6">
      <TitleSection
        title="RSS Channels"
        icon="📺"
        content={
          <>
            <p>
              Manage course streams and public RSS output channels for subscribers.
            </p>
          </>}

        right_section={
          <>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold shadow-sm transition-colors self-start sm:self-auto"
            >
              <span>{showAddForm ? '✕ Cancel' : '＋ Add Channel'}</span>
            </button>
          </>
        }
      />
      {/* Add New Channel Panel (Collapsible) */}
      <AddChannelPanel
        showAddForm={showAddForm}
        onSuccess={handleAddChannelSuccess}
        onCancel={() => setShowAddForm(false)}
      />

      {/* Channels List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {channelsList.map((channel) => {
          const rssEndpoint = `/api/rss/${channel.id}`;

          return (
            <div
              key={channel.id}
              className="p-5 rounded-xl border border-[var(--elementBorder)] flex flex-col justify-between gap-4"
            >
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
        })}
      </div>
    </div>
  );
}