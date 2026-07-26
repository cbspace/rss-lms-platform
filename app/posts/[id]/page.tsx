// app/posts/[id]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MOCK_POSTS } from '@/data/mock_posts';
import { CHANNELS } from '@/data/channels';

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;

  // Find post matching either "1" or "post-1"
  const post = MOCK_POSTS.find(
    (p) => p.id === id || p.id === `post-${id}`
  );

  // Trigger Next.js 404 page if post doesn't exist
  if (!post) {
    notFound();
  }
  
  const postChannelIds: string[] = post.channelIds ? post.channelIds : [];

  return (
    <article className="w-full space-y-6">
      {/* Header Section */}
      <header className="space-y-4 border-b border-[var(--elementBorder)] pb-6">
        <div className="flex items-center gap-2 text-xs font-mono opacity-70">
          <span>📅 Published: {post.date}</span>
          <span>•</span>
          <span className="text-purple-400 font-semibold">Blog Article</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          {post.title}
        </h1>

        {/* Channels "Published To" Badge Bar */}
        <div className="pt-1 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono opacity-60">Published To:</span>
          <div className="flex flex-wrap gap-1.5">
            {postChannelIds.map((chId) => {
              const ch = CHANNELS.find((c) => c.id === chId);
              return (
                <Link
                  key={chId}
                  href={`/api/rss?channel=${chId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono font-medium hover:bg-purple-500/20 transition-colors flex items-center gap-1"
                  title={`View RSS Feed for ${ch ? ch.name : chId}`}
                >
                  <span>📺 {ch ? ch.name : chId}</span>
                  <span className="text-[10px] opacity-60">↗</span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Compact Featured Banner Image */}
      {post.imageUrl && (
        <div className="w-full h-44 md:h-52 rounded-xl overflow-hidden border border-[var(--elementBorder)] bg-[var(--elementBg)] relative">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Full Article Content Section */}
      <section className="p-6 rounded-xl border border-[var(--elementBorder)] bg-[var(--elementBg)] space-y-4">
        <h2 className="text-xs font-semibold text-purple-400 font-mono uppercase tracking-wider">
          📄 Article Content
        </h2>
        
        {/* Renders post.content when available, falling back to summary */}
        <div className="text-base leading-relaxed opacity-90 space-y-4 whitespace-pre-line">
          {post.content || post.summary}
        </div>
      </section>

      {/* Navigation Footer */}
      <div className="pt-4 flex justify-between items-center text-sm border-t border-[var(--elementBorder)]">
        <Link
          href="/posts"
          className="text-purple-400 hover:underline font-medium flex items-center gap-1"
        >
          <span aria-hidden="true">←</span>
          <span>Back to Posts</span>
        </Link>

        <span className="text-xs opacity-50 font-mono">
          ID: {id}
        </span>
      </div>
    </article>
  );
}