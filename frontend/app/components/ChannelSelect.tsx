// components/ChannelSelect.tsx
'use client';

import { CHANNELS } from '@/data/mock_channels';

interface ChannelSelectProps {
  selectedIds: string[];
  onChange: (updatedIds: string[]) => void;
  error?: string | null;
}

export default function ChannelSelect({ selectedIds, onChange, error }: ChannelSelectProps) {
  const allIds = CHANNELS.map((ch) => ch.id);
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
          className="text-sm font-mono text-purple-400 hover:text-purple-300 hover:underline transition-colors flex items-center gap-1"
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
        {CHANNELS.map((ch) => {
          const isChecked = selectedIds.includes(ch.id);

          return (
            <label
              key={ch.id}
              className={`flex items-start gap-3 p-2 rounded-md border transition-colors cursor-pointer select-none ${
                isChecked
                  ? 'border-purple-500/40 bg-purple-500/10'
                  : 'border-transparent hover:bg-[var(--elementBg)]'
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleToggle(ch.id)}
                className="mt-0.5 rounded border-[var(--elementBorder)] text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
              
              <div className="flex-1 text-sm">
                <div className="font-semibold text-[var(--foreground)]">
                  📺 {ch.name}
                </div>
                <p className="opacity-60 text-sm mt-0.5">{ch.description}</p>
              </div>
            </label>
          );
        })}
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