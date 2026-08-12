'use client';

import { useState, useEffect } from 'react';

type Channel = {
  id: string;
  slug: string;
  name: string;
  description?: string;
};

interface ChannelSelectProps {
  selectedIds: string[];
  onChange: (updatedIds: string[]) => void;
  error?: string | null;
}

export default function ChannelSelect({ selectedIds, onChange, error }: ChannelSelectProps) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch channels from the backend API
  useEffect(() => {
    async function fetchChannels() {
      try {
        setLoading(true);
        const res = await fetch('/api/rss');
        if (res.ok) {
          const data = await res.json();
          setChannels(data);
        }
      } catch (err) {
        console.error('Failed to load channels in ChannelSelect:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchChannels();
  }, []);

  // Use channel `slug` (or `id` as fallback) for selection matching
  const getChannelIdentifier = (ch: Channel) => ch.slug || ch.id;

  const allIds = channels.map(getChannelIdentifier);
  const isAllSelected = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));

  // Toggle single item
  const handleToggle = (channelId: string) => {
    const exists = selectedIds.includes(channelId);
    if (exists) {
      onChange(selectedIds.filter((id) => id !== channelId));
    } else {
      onChange([...selectedIds, channelId]);
    }
  };

  // Toggle Select All / Deselect All
  const handleSelectAll = () => {
    if (isAllSelected) {
      onChange([]); // Clear all
    } else {
      onChange(allIds); // Select all
    }
  };

  return (
    <div id="ChannelSelect" className="w-full space-y-2">
      {/* Header Row with Title & Select All Action */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-mono font-medium opacity-80">
          Target Output Channels (Select target feeds)
        </label>

        <button
          type="button"
          onClick={handleSelectAll}
          disabled={loading || channels.length === 0}
          className="text-sm font-mono text-purple-400 hover:text-purple-300 hover:underline transition-colors flex items-center gap-1 disabled:opacity-50"
        >
          <span>{isAllSelected ? '✓ Deselect All' : '＋ Select All'}</span>
        </button>
      </div>

      {/* Checkbox List Container */}
      <div 
        className={`p-3 rounded-lg border bg-[var(--background)] space-y-2 transition-colors ${
          error ? 'border-red-500/80 ring-1 ring-red-500/50' : 'border-[var(--elementBorder)]'
        }`}
      >
        {loading ? (
          <div className="p-3 text-center text-sm font-mono opacity-60">
            Loading target feeds...
          </div>
        ) : channels.length === 0 ? (
          <div className="p-3 text-center text-sm font-mono opacity-60">
            No channels available. Create one first in the Channels tab.
          </div>
        ) : (
          channels.map((ch) => {
            const channelIdentifier = getChannelIdentifier(ch);
            const isChecked = selectedIds.includes(channelIdentifier);

            return (
              <label
                key={ch.id || ch.slug}
                className={`flex items-start gap-3 p-2 rounded-md border transition-colors cursor-pointer select-none ${
                  isChecked
                    ? 'border-purple-500/40 bg-purple-500/10'
                    : 'border-transparent hover:bg-[var(--elementBg)]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggle(channelIdentifier)}
                  className="mt-0.5 rounded border-[var(--elementBorder)] text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                
                <div className="flex-1 text-sm">
                  <div className="font-semibold text-[var(--foreground)]">
                    📺 {ch.name}
                  </div>
                  {ch.description && (
                    <p className="opacity-60 text-sm mt-0.5">{ch.description}</p>
                  )}
                </div>
              </label>
            );
          })
        )}
      </div>

      {/* Validation Error Message */}
      {error ? (
        <p className="text-sm font-mono text-red-400 font-medium flex items-center gap-1.5">
          <span aria-hidden="true">⚠️</span>
          <span>{error}</span>
        </p>
      ) : (
        <p className="pt-1 text-sm opacity-60 font-mono">
          Selected feeds will output this article at <code className="text-purple-400">/api/rss/channel</code>
        </p>
      )}
    </div>
  );
}