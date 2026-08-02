// components/AddChannelPanel.tsx
'use client';

import { useState } from 'react';
import { addChannel, type Channel } from '@/data/mock_channels';

export interface AddChannelPanelProps {
  showAddForm: boolean;
  onSuccess?: (createdChannel: Channel) => void;
  onCancel?: () => void;
}

export default function AddChannelPanel({
  showAddForm,
  onSuccess,
  onCancel,
}: AddChannelPanelProps) {
  const [newChannel, setNewChannel] = useState<Partial<Channel>>({
    id: '',
    name: '',
    description: '',
  });

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannel.id || !newChannel.name) return;

    // Sanitize ID into slug format
    const formattedId = newChannel.id.toLowerCase().trim().replace(/\s+/g, '-');

    const createdChannel: Channel = {
      id: formattedId,
      name: newChannel.name.trim(),
      description: newChannel.description?.trim() || '',
    };

    // Save channel to localStorage & dispatch storage event
    addChannel(createdChannel);

    // Reset form state
    setNewChannel({ id: '', name: '', description: '' });

    // Trigger parent success callback if provided
    if (onSuccess) {
      onSuccess(createdChannel);
    }
  };

  if (!showAddForm) return null;

  return (
    <form
      onSubmit={handleCreateChannel}
      className="p-5 rounded-xl border border-[var(--elementBorder)] bg-[var(--elementBg)] space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-purple-400 font-mono flex items-center gap-2">
          <span>➕ Created New RSS Channel</span>
        </h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm font-mono opacity-60 hover:opacity-100 transition-opacity"
          >
            ✕ Close
          </button>
        )}
      </div>

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

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-[var(--elementBorder)] hover:bg-[var(--background)] text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-colors"
        >
          Create Channel
        </button>
      </div>
    </form>
  );
}