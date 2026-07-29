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
    <article className="w-full space-y-4 pt-2">
      {/* Header Section */}
      <header className="space-y-4 pb-2">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          {post.title}
        </h1>

        {/* Channels "Published To" Badge Bar */}
        <div className="pt-1 flex flex-wrap items-center gap-2">
          <span className="text-sm font-mono opacity-60">Published To:</span>
          <div className="flex flex-wrap gap-1.5">
            {postChannelIds.map((chId) => {
              const ch = CHANNELS.find((c) => c.id === chId);
              return (
                <Link
                  key={chId}
                  href={`/api/rss/${chId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 text-sm font-mono font-medium hover:bg-purple-500/20 transition-colors flex items-center gap-1"
                  title={`View RSS Feed for ${ch ? ch.name : chId}`}
                >
                  <span>{ch ? ch.name : chId}</span>
                  <span className="text-[10px] opacity-60">↗</span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <section className="pl-6 pr-6 pt-4 pb-10 rounded-xl border border-[var(--elementBorder)] bg-[var(--elementBg)] space-y-4">
        {/* Compact Featured Banner Image */}
        {post.imageUrl && (
          <div className="w-full h-44 md:h-40 overflow-hidden relative">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="flex items-center gap-2 text-sm font-mono opacity-70">
          <span>📅 Published: {post.date}</span>
        </div>
        
        {/* Renders post.content when available, falling back to summary */}
        <div className="text-base leading-relaxed opacity-90 space-y-4 whitespace-pre-line">
          {post.content || post.summary}
        </div>
      </section>

      {/* Navigation Footer */}
      <div className="pt-4 flex justify-between items-center text-base">
        <Link
          href="/posts"
          className="text-purple-400 hover:underline font-medium flex items-center gap-1"
        >
          <span aria-hidden="true">←</span>
          <span>Back to Posts</span>
        </Link>

        <span className="text-base opacity-50 font-mono">
          ID: {id}
        </span>
      </div>
    </article>
  );
}