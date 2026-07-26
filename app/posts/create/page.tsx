// app/posts/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ChannelSelect from '../../components/ChannelSelect';
import { savePost } from '../../lib/PostsStorage';
import { type MockPost } from '@/data/mock_posts';

export default function CreatePostPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    channelIds: [] as string[],
    summary: '',
    imageUrl: '',
  });

  const [channelError, setChannelError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate channel selection
    if (formData.channelIds.length === 0) {
      setChannelError('Please select at least one RSS channel before publishing.');
      return;
    }

    setChannelError(null);

    // Build complete MockPost object matching your interface
    const newPost: MockPost = {
      id: Date.now().toString(),
      title: formData.title,
      author: 'Course Instructor',
      date: new Date().toISOString().split('T')[0],
      summary: formData.summary,
      content: formData.summary,
      imageUrl:
        formData.imageUrl ||
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      category: 'Frontend',
      readTime: '3 min read',
      channelIds: formData.channelIds,
    };

    // Save to local session storage
    savePost(newPost);

    // Redirect to main catalog
    router.push('/posts');
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="border-b border-[var(--elementBorder)] pb-4 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Create New Article</h1>
        <p className="text-sm opacity-80">
          Publish an article and route it across single or multiple RSS channels.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-xl border border-[var(--elementBorder)] bg-[var(--elementBg)] space-y-5"
      >
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-xs font-mono font-medium opacity-80 mb-1.5">
            Article Title *
          </label>
          <input
            id="title"
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Introduction to Multi-Channel RSS Publishing"
            className="w-full p-2.5 rounded-lg border border-[var(--elementBorder)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Banner Image */}
        <div>
          <label htmlFor="imageUrl" className="block text-xs font-mono font-medium opacity-80 mb-1.5">
            Banner Image URL (Optional)
          </label>
          <input
            id="imageUrl"
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            className="w-full p-2.5 rounded-lg border border-[var(--elementBorder)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Summary */}
        <div>
          <label htmlFor="summary" className="block text-xs font-mono font-medium opacity-80 mb-1.5">
            Article Content / Summary *
          </label>
          <textarea
            id="summary"
            required
            rows={5}
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            placeholder="Write your announcement or article content..."
            className="w-full p-2.5 rounded-lg border border-[var(--elementBorder)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed"
          />
        </div>

        {/* Channel Selection with Validation Prop */}
        <ChannelSelect
          selectedIds={formData.channelIds}
          error={channelError}
          onChange={(newIds) => {
            setFormData({ ...formData, channelIds: newIds });
            if (newIds.length > 0) setChannelError(null);
          }}
        />

        {/* Form Actions */}
        <div className="pt-4 flex justify-between items-center border-t border-[var(--elementBorder)]">
          <Link href="/posts" className="text-xs text-purple-400 hover:underline font-medium">
            ← Cancel
          </Link>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            Publish Article & Update RSS Feeds
          </button>
        </div>
      </form>
    </div>
  );
}