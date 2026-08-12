'use client';

import { useState } from 'react';

type AddChannelPanelProps = {
  showAddForm: boolean;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function AddChannelPanel({
  showAddForm,
  onSuccess,
  onCancel,
}: AddChannelPanelProps) {
  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!showAddForm) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/rss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: slug.trim().toLowerCase(),
          name: name.trim(),
          description: description.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create channel');
      }

      // Reset state and signal success
      setSlug('');
      setName('');
      setDescription('');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 rounded-xl border border-[var(--elementBorder)] bg-[var(--elementBg)] space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
      <h3 className="text-lg font-semibold text-foreground">Create New Channel</h3>

      {error && (
        <div className="p-3 text-sm text-red-400 bg-red-950/40 border border-red-800 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-mono opacity-80 mb-1">
            Channel Slug (Identifier)
          </label>
          <input
            type="text"
            placeholder="e.g. cs101 or internships"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full p-2.5 rounded-lg border border-[var(--elementBorder)] bg-[var(--background)] text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-mono opacity-80 mb-1">
            Channel Name
          </label>
          <input
            type="text"
            placeholder="e.g. Computer Science 101"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2.5 rounded-lg border border-[var(--elementBorder)] bg-[var(--background)] text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-mono opacity-80 mb-1">
            Description
          </label>
          <textarea
            placeholder="Brief description of this feed..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full p-2.5 rounded-lg border border-[var(--elementBorder)] bg-[var(--background)] text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-[var(--elementBorder)] hover:bg-[var(--background)] text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold shadow-sm transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Channel'}
          </button>
        </div>
      </form>
    </div>
  );
}