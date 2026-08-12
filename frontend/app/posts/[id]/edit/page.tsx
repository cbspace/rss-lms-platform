// app/posts/[id]/edit/page.tsx
'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ChannelSelect from '@/app/components/ChannelSelect';
import TitleSection from '@/app/components/TitleSection';

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    channelIds: [] as string[],
    summary: '',
    imageUrl: '',
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [channelError, setChannelError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch initial post details
  useEffect(() => {
    async function loadPost() {
      try {
        setLoading(true);
        const res = await fetch(`/api/posts/${id}?json=true`);
        if (!res.ok) throw new Error('Failed to load post');

        const post = await res.json();
        setFormData({
          title: post.title || '',
          author: post.author || '',
          summary: post.summary || post.content || '',
          imageUrl: post.imageUrl || '',
          channelIds: (post.channels || []).map((c: any) => c.slug || c.id),
        });
      } catch (err: any) {
        setSubmitError('Unable to load post details for editing.');
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.channelIds.length === 0) {
      setChannelError('Please select at least one RSS channel before updating.');
      return;
    }

    setChannelError(null);
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          author: formData.author.trim() || 'Course Instructor',
          summary: formData.summary.trim(),
          content: formData.summary.trim(),
          imageUrl: formData.imageUrl.trim(),
          channelSlugs: formData.channelIds,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update post');
      }

      // Return to post detail page
      router.push(`/posts/${id}`);
    } catch (err: any) {
      console.error('Error updating post:', err);
      setSubmitError(err.message || 'An error occurred while updating the post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto p-12 text-center font-mono opacity-60">
        Loading post data for editing...
      </div>
    );
  }

  return (
    <div id="edit_post" className="w-full max-w-3xl mx-auto space-y-6 pb-6">
      <TitleSection
        title="Edit Post"
        icon="✏️"
        content={<p>Modify your published post details and RSS channel allocations.</p>}
      />

      {submitError && (
        <div className="p-4 rounded-lg bg-red-900/30 border border-red-700 text-red-300 text-sm">
          {submitError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-xl border border-element-border bg-[var(--elementBg)] space-y-5"
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
            className="w-full p-2.5 rounded-lg border border-element-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Author */}
        <div>
          <label htmlFor="author" className="block text-sm font-mono font-medium opacity-80 mb-1.5">
            Author (Optional)
          </label>
          <input
            id="author"
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            placeholder="Course Instructor"
            className="w-full p-2.5 rounded-lg border border-element-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            className="w-full p-2.5 rounded-lg border border-element-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            className="w-full p-2.5 rounded-lg border border-element-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed"
          />
        </div>

        {/* Channel Selection */}
        <ChannelSelect
          selectedIds={formData.channelIds}
          error={channelError}
          onChange={(newIds) => {
            setFormData({ ...formData, channelIds: newIds });
            if (newIds.length > 0) setChannelError(null);
          }}
        />

        {/* Actions */}
        <div className="pt-2 flex justify-between items-center">
          <Link href={`/posts/${id}`} className="text-sm text-purple-400 hover:underline font-medium">
            ← Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold shadow-sm transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving Changes...' : 'Save & Update Post'}
          </button>
        </div>
      </form>
    </div>
  );
}