'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export interface Channel {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  createdAt?: string;
  _count?: {
    posts: number;
  };
}

export interface ChannelCardProps {
  channel: Channel;
  onUpdated?: () => void;
  onDeleted?: () => void;
}

export default function ChannelCard({ channel, onUpdated, onDeleted }: ChannelCardProps) {
  const channelSlug = channel.slug || channel.id;
  const rssEndpoint = `/api/rss/${channelSlug}`;

  // Modal States
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Edit Form States
  const [name, setName] = useState(channel.name);
  const [description, setDescription] = useState(channel.description || '');
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete Form States
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setEditError(null);

    try {
      const res = await fetch(rssEndpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update channel');
      }

      setShowEditModal(false);
      if (onUpdated) onUpdated();
    } catch (err: any) {
      console.error('Error updating channel:', err);
      setEditError(err.message || 'An error occurred while updating the channel.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete Submit
  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch(rssEndpoint, { method: 'DELETE' });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete channel');
      }

      setShowDeleteModal(false);
      if (onDeleted) onDeleted();
    } catch (err: any) {
      console.error('Error deleting channel:', err);
      setDeleteError(err.message || 'An error occurred while deleting the channel.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-5 rounded-xl border border-element-border flex flex-col justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded text-sm font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold">
            SLUG: {channelSlug}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setName(channel.name);
                setDescription(channel.description || '');
                setShowEditModal(true);
              }}
              className="text-sm font-mono text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
               <span aria-hidden="true">✏️ </span>Edit
            </button>
            <span className="text-sm opacity-30">•</span>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="text-sm font-mono text-rose-400 hover:text-rose-300 transition-colors font-medium"
            >
              <span aria-hidden="true">🗑️ </span>Delete
            </button>
          </div>
        </div>

        <h2 className="text-lg font-bold text-foreground">
          📺 {channel.name}
        </h2>

        <p className="text-base opacity-80 leading-relaxed">
          {channel.description || 'No description provided for this channel.'}
        </p>
      </div>

      {/* RSS Endpoint Preview */}
      <div className="pt-2 flex items-center justify-between gap-2 border-t border-element-border">
        <code className="text-sm font-mono opacity-60 truncate bg-background px-2 py-1 rounded">
          {rssEndpoint}
        </code>

        <Link
          href={rssEndpoint}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-mono font-medium text-orange-400 hover:text-orange-300 transition-colors shrink-0"
        >          RSS XML
          <span aria-hidden="true">↗</span>
        </Link>
      </div>

      {/* EDIT CHANNEL MODAL OVERLAY */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-xl border border-element-border bg-element-background shadow-2xl space-y-4 text-left">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-purple-400 flex items-center gap-2 font-mono">
                <span>✏️</span> Edit Channel
              </h3>
              <p className="text-sm opacity-70">
                Update the metadata for stream <code className="text-purple-300 font-mono">{channelSlug}</code>.
              </p>
            </div>

            {editError && (
              <div className="p-3 rounded-lg bg-red-900/40 border border-red-700 text-red-300 text-sm font-mono">
                {editError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-mono opacity-80 mb-1">Channel Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-element-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-mono opacity-80 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 rounded-lg border border-element-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex justify-end items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditError(null);
                  }}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg border border-element-border bg-background text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CHANNEL MODAL OVERLAY */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-xl border border-element-border bg-element-background/60 shadow-2xl space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 font-mono">
                <span>⚠️</span> Confirm Channel Deletion
              </h3>
              <p className="text-base opacity-80 leading-relaxed">
                Are you sure you want to delete <strong>"{channel.name}"</strong>? This will unassign all posts connected to this RSS feed.
              </p>
            </div>

            {deleteError && (
              <div className="p-3 rounded-lg bg-red-900/40 border border-red-700 text-red-300 text-sm font-mono">
                {deleteError}
              </div>
            )}

            <div className="flex justify-end items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteError(null);
                }}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg border border-element-border bg-background text-base font-medium hover:bg-gray-900 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-base font-semibold transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Channel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}