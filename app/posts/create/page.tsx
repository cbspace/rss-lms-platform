// app/posts/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreatePostPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    imageUrl: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Assessment 1: Simulate saving post to local state / mock array
    console.log('New Post Submitted:', formData);

    // Redirect user back to the main blog feed index
    router.push('/posts');
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Page Heading */}
      <div className="border-b border-[var(--elementBorder)] pb-4 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Create New Article</h1>
        <p className="text-sm opacity-80">
          Publish a new article to your blog and automatically sync it to the RSS XML feed.
        </p>
      </div>

      {/* Creation Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-xl border border-[var(--elementBorder)] bg-[var(--elementBg)] space-y-4">
        <div>
          <label htmlFor="title" className="block text-xs font-mono font-medium opacity-80 mb-1">
            Article Title *
          </label>
          <input
            id="title"
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Introduction to REST & RSS Architecture"
            className="w-full p-2.5 rounded-lg border border-[var(--elementBorder)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-xs font-mono font-medium opacity-80 mb-1">
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

        <div>
          <label htmlFor="summary" className="block text-xs font-mono font-medium opacity-80 mb-1">
            Article Content / Summary *
          </label>
          <textarea
            id="summary"
            required
            rows={5}
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            placeholder="Write the summary or full content of your course update..."
            className="w-full p-2.5 rounded-lg border border-[var(--elementBorder)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Form Footer Actions */}
        <div className="pt-4 flex justify-between items-center border-t border-[var(--elementBorder)]">
          <Link
            href="/posts"
            className="text-xs text-purple-400 hover:underline font-medium"
          >
            ← Cancel
          </Link>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            Publish Article & Update RSS
          </button>
        </div>
      </form>
    </div>
  );
}