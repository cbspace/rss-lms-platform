// components/BlogCard.tsx
'use client';

import Link from 'next/link';

export type Channel = {
  id: string;
  slug: string;
  name: string;
};

export type Post = {
  id: string;
  postNumber: number;
  title: string;
  author: string;
  date: string;
  summary: string;
  content: string;
  imageUrl?: string;
  channels?: { id?: string; slug: string; name: string }[]; // Added id?: string
  channelIds?: string[];
};

type BlogCardProps = {
  post: Post;
  channels?: Channel[];
};

export function BlogCard({ post, channels = [] }: BlogCardProps) {
  const postChannelIds: string[] = post.channelIds || [];

  // Use postNumber for user-facing clean URL slug (e.g., /posts/42)
  const slugIdentifier = post.postNumber ?? post.id.replace(/^post-/, '');

  return (
    <article className="p-5 rounded-xl border border-element-border flex flex-col justify-between gap-4">
      <div className="space-y-3">
        {post.imageUrl && (
          <div className="w-full h-40 rounded-lg overflow-hidden border border-element-border bg-background">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div>
          <span className="text-sm font-mono opacity-60">{post.date}</span>
          <h2 className="font-bold text-lg mt-1 text-[var(--foreground)]">
            {post.title}
          </h2>
          <p className="text-base opacity-80 mt-2 line-clamp-3 leading-relaxed">
            {post.summary}
          </p>
        </div>
      </div>

      <div className="pt-3 flex items-center justify-between gap-2">
        <Link
          href={`/posts/post-${slugIdentifier}`}
          className="text-sm font-semibold text-purple-400 hover:underline flex items-center gap-1 shrink-0"
        >
          <span>View / Edit</span>
          <span aria-hidden="true">→</span>
        </Link>

        {/* Multiple Channel Badges Container */}
        <div className="flex flex-wrap gap-1 justify-end">
          {postChannelIds.map((chId) => {
            const ch = channels.find((c) => c.id === chId);
            const channelName = ch ? ch.name : chId;

            return (
              <span
                key={chId}
                title={channelName}
                className="text-sm font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium truncate max-w-[160px] inline-block"
              >
                📺 {channelName}
              </span>
            );
          })}
        </div>
      </div>
    </article>
  );
}