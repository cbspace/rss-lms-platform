// app/channels/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CHANNELS, type Channel } from '@/data/channels';
import TitleSection from '../components/TitleSection';

export default function ChannelsPage() {
  const [channelsList, setChannelsList] = useState<Channel[]>(CHANNELS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newChannel, setNewChannel] = useState({
    id: '',
    name: '',
    description: '',
    badgeColor: 'purple',
  });

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannel.id || !newChannel.name) return;

    // Sanitize ID (slug format)
    const formattedId = newChannel.id.toLowerCase().replace(/\s+/g, '-');

    const createdChannel: Channel = {
      ...newChannel,
      id: formattedId,
    };

    setChannelsList([...channelsList, createdChannel]);
    setNewChannel({ id: '', name: '', description: '', badgeColor: 'purple' });
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
      {showAddForm && (
        <form
          onSubmit={handleCreateChannel}
          className="p-5 rounded-xl border border-[var(--elementBorder)] space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <h2 className="text-base font-bold text-purple-400 font-mono flex items-center gap-2">
            <span>➕ Register New Output Feed</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="channel-id" className="block text-sm font-mono opacity-80 mb-1">
                Channel ID / Slug *
              </label>
              <input
                id="channel-id"
                type="text"
                required
                value={newChannel.id}
                onChange={(e) => setNewChannel({ ...newChannel, id: e.target.value })}
                placeholder="e.g., cs103"
                className="w-full p-2.5 rounded-lg border border-[var(--elementBorder)] bg-[var(--background)] text-base focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
              />
            </div>

            <div>
              <label htmlFor="channel-name" className="block text-sm font-mono opacity-80 mb-1">
                Channel Display Name *
              </label>
              <input
                id="channel-name"
                type="text"
                required
                value={newChannel.name}
                onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
                placeholder="e.g., CS103: Algorithms Feed"
                className="w-full p-2.5 rounded-lg border border-[var(--elementBorder)] bg-[var(--background)] text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="channel-desc" className="block text-sm font-mono opacity-80 mb-1">
              Description / Target Audience
            </label>
            <input
              id="channel-desc"
              type="text"
              value={newChannel.description}
              onChange={(e) => setNewChannel({ ...newChannel, description: e.target.value })}
              placeholder="e.g., Weekly lecture materials and lab updates"
              className="w-full p-2.5 rounded-lg border border-[var(--elementBorder)] bg-[var(--background)] text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-colors"
            >
              Create Channel
            </button>
          </div>
        </form>
      )}

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