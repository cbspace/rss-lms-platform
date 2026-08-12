'use client';

import { useState, useEffect, useCallback } from 'react';
import TitleSection from '../components/TitleSection';
import AddChannelPanel from '../components/AddChannelPanel';
import ChannelCard from '../components/ChannelCard';

export type Channel = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  createdAt?: string;
  _count?: {
    posts: number;
  };
};

export default function ChannelsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [channelsList, setChannelsList] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch channels from backend database
  const fetchChannels = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/rss');
      if (res.ok) {
        const data = await res.json();
        setChannelsList(data);
      }
    } catch (err) {
      console.error('Failed to fetch channels:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  const handleAddChannelSuccess = () => {
    // Refresh live list from API and hide panel
    fetchChannels();
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
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading channels...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {channelsList.map((channel) => (
          <ChannelCard
            key={channel.id || channel.slug}
            channel={channel}
            onUpdated={fetchChannels} // Re-fetches channels after update
            onDeleted={fetchChannels} // Re-fetches channels after delete
          />
        ))}
        </div>
      )}
    </div>
  );
}