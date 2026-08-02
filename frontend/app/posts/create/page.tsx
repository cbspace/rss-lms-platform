// app/posts/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ChannelSelect from '../../components/ChannelSelect';
import { savePost } from '@/data/PostsStorage';
import { type MockPost } from '@/data/mock_posts';
import TitleSection from '@/app/components/TitleSection';

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

  function get_date_id(date: Date = new Date()): string {
    const yy = String(date.getFullYear()).slice(-2);
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const dd = String(date.getDate()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');

    return `${yy}${mm}${dd}${min}`;
  }

    // Build complete MockPost object matching your interface
    const newPost: MockPost = {
      id: get_date_id(),
      title: formData.title,
      author: 'Course Instructor',
      date: new Date().toISOString().split('T')[0],
      summary: formData.summary,
      content: formData.summary,
      imageUrl:
        formData.imageUrl ||
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      channelIds: formData.channelIds,
    };

    // Save to local session storage
    savePost(newPost);

    // Redirect to main catalog
    router.push('/posts');
  };

  return (
    <div id="create_post" className="w-full max-w-3xl mx-auto space-y-6 pb-10">
      <TitleSection
        title="Create New Post"
        icon="🖋️"
        content={
          <>
            <p>
              Create and new post and publish it across single or multiple RSS channels.
            </p>
          </>}
      />

      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-xl border border-[var(--elementBorder)] bg-[var(--elementBg)] space-y-5"
      >
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-mono font-medium opacity-80 mb-1.5">
            Post Title *
          </label>
          <input
            id="title"
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Short Post Title"
            className="w-full p-2.5 rounded-lg border border-[var(--elementBorder)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Banner Image */}
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-mono font-medium opacity-80 mb-1.5">
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
          <label htmlFor="summary" className="block text-sm font-mono font-medium opacity-80 mb-1.5">
            Post Content / Summary *
          </label>
          <textarea
            id="summary"
            required
            rows={5}
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            placeholder="Write your announcement or Post content..."
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
        <div className="pt-2 flex justify-between items-center">
          <Link href="/posts" className="text-sm text-purple-400 hover:underline font-medium">
            ← Cancel
          </Link>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold shadow-sm transition-colors"
          >
            Publish Post & Update RSS Feeds
          </button>
        </div>
      </form>
    </div>
  );
}