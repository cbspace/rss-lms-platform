// app/posts/[id]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MOCK_POSTS } from '@/data/mock_posts';

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;

  // Search mock data matching either "1" or "post-1"
  const post = MOCK_POSTS.find(
    (p) => p.id === id || p.id === `post-${id}`
  );

  // Trigger Next.js 404 page if post doesn't exist
  if (!post) {
    notFound();
  }

  return (
    <article className="w-full space-y-6">
      {/* Header Section */}
      <header className="space-y-3 border-b border-[var(--elementBorder)] pb-6">
        <div className="flex items-center gap-3 text-xs font-mono opacity-70">
          <span>📅 Published: {post.date}</span>
          <span>•</span>
          <span className="text-purple-400 font-semibold">LMS Ingestion Item</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          {post.title}
        </h1>

        {/* External Link (if present in mock post) */}
        {post.guid && (
          <div className="pt-1">
            <a
              href={post.guid}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-400 hover:underline"
            >
              <span>View Original Source Stream</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        )}
      </header>

      {/* Featured Banner Image */}
      {post.imageUrl && (
        <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden border border-[var(--elementBorder)] bg-[var(--elementBg)] relative">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Content / Summary Container */}
      <section className="p-6 rounded-xl border border-[var(--elementBorder)] bg-[var(--elementBg)] space-y-4">
        <h2 className="text-lg font-semibold text-purple-400 font-mono text-sm uppercase tracking-wider">
          📄 Article Overview
        </h2>
        <div className="text-base leading-relaxed opacity-90 space-y-4">
          <p>{post.summary}</p>
        </div>
      </section>

      {/* Navigation Footer */}
      <div className="pt-4 flex justify-between items-center text-sm border-t border-[var(--elementBorder)]">
        <Link
          href="/feeds"
          className="text-purple-400 hover:underline font-medium flex items-center gap-1"
        >
          <span aria-hidden="true">←</span>
          <span>Back to Feed Inbox</span>
        </Link>

        <span className="text-xs opacity-50 font-mono">
          ID: {id}
        </span>
      </div>
    </article>
  );
}