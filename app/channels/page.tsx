// app/channels/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { CHANNELS, type Channel } from '@/data/mock_channels';
import TitleSection from '../components/TitleSection';
import AddChannelPanel from '../components/AddChannelPanel';
import ChannelCard from '../components/ChannelCard';

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
          <p>
            Manage course streams and public RSS output channels for subscribers.
          </p>
        }
        right_section={
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold shadow-sm transition-colors self-start sm:self-auto"
          >
            <span>{showAddForm ? '✕ Cancel' : '＋ Add Channel'}</span>
          </button>
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
        {channelsList.map((channel) => (
          <ChannelCard key={channel.id} channel={channel} />
        ))}
      </div>
    </div>
  );
}