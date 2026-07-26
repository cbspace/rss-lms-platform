// app/blog/page.tsx
import Link from 'next/link';
import { MOCK_POSTS } from '@/data/mock_posts';

export default function BlogIndexPage() {
  return (
<div className="w-full space-y-6">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--elementBorder)] pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Blog Articles <span aria-hidden="true">✍️</span>
          </h1>
          <p className="text-sm opacity-80 mt-1">
            Manage published articles and RSS output feed.
          </p>
        </div>

        {/* Action Button Row */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* RSS Feed Badge */}
          <a
            href="/api/rss"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-mono font-medium hover:bg-orange-500/20 transition-colors"
          >
            <span>📡 RSS Feed</span>
            <span aria-hidden="true">↗</span>
          </a>

          {/* ➕ Create New Post Button */}
          <Link
            href="/posts/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <span aria-hidden="true">＋</span>
            <span>Create Post</span>
          </Link>
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_POSTS.map((post) => (
          <article 
            key={post.id} 
            className="p-5 rounded-xl border border-[var(--elementBorder)] bg-[var(--elementBg)] flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              {post.imageUrl && (
                <div className="w-full h-40 rounded-lg overflow-hidden border border-[var(--elementBorder)] bg-[var(--background)]">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <span className="text-xs font-mono opacity-60">{post.date}</span>
                <h2 className="font-bold text-lg mt-1 text-[var(--foreground)]">
                  {post.title}
                </h2>
                <p className="text-sm opacity-80 mt-2 line-clamp-3 leading-relaxed">
                  {post.summary}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--elementBorder)] flex items-center justify-between">
              <Link 
                href={`/posts/${post.id}`}
                className="text-xs font-semibold text-purple-400 hover:underline flex items-center gap-1"
              >
                <span>Read Full Article</span>
                <span aria-hidden="true">→</span>
              </Link>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--background)] opacity-60">
                Published
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}