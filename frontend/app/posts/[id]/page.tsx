'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, notFound } from 'next/navigation';
import { Channel, Post } from '../../components/BlogCard';

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        setIsLoading(true);
        // Supports lookup by 'post-#', raw number, or GUID
        const res = await fetch(`/api/posts/${id}?json=true`);

        if (res.status === 404) {
          setIsNotFound(true);
          return;
        }

        if (!res.ok) {
          throw new Error('Failed to fetch post details');
        }

        const data = await res.json();
        
        const formattedPost: Post = {
          ...data,
          date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
        };

        setPost(formattedPost);
      } catch (err) {
        console.error('Error loading post:', err);
        setIsNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!post) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      // Use exact post.id (GUID) for the DELETE request
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete post');
      }

      // Redirect to posts catalog upon successful deletion
      router.push('/posts');
    } catch (err: any) {
      console.error('Error deleting post:', err);
      setDeleteError(err.message || 'An error occurred while deleting the post.');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-4 pt-4 animate-pulse">
        <div className="h-8 bg-element-border rounded w-1/2" />
        <div className="h-64 bg-element-bg rounded-xl border border-element-border" />
      </div>
    );
  }

  if (isNotFound || !post) {
    notFound();
  }

  const postChannels = post.channels ?? [];

  // Generate target edit slug supporting both formats
  const editSlug = post.postNumber 
    ? `post-${post.postNumber}` 
    : post.id;

  return (
    <article className="w-full space-y-4 pt-2">
      {/* Header Section */}
      <header className="space-y-4 pb-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {post.title}
        </h1>

        {/* Article Meta Bar: Author & Date */}
        <div className="flex flex-wrap items-center gap-4 text-sm font-mono opacity-80">
          {post.author && (
            <div className="flex items-center gap-1.5 font-medium text-purple-400">
              <span>✍️ By {post.author}</span>
            </div>
          )}
          <span className="opacity-40">•</span>
          <div className="flex items-center gap-1 opacity-70">
            <span>📅 {post.date}</span>
          </div>
        </div>

        {/* Channels "Published To" Badge Bar */}
        {postChannels.length > 0 && (
          <div className="pt-1 flex flex-wrap items-center gap-2">
            <span className="text-sm font-mono opacity-60">Published To:</span>
            <div className="flex flex-wrap gap-1.5">
              {postChannels.map((ch) => {
                const slug = ch.slug;
                const name = ch.name || slug;
                return (
                  <Link
                    key={slug}
                    href={`/api/rss/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 text-sm font-mono font-medium hover:bg-purple-500/20 transition-colors flex items-center gap-1"
                    title={`View RSS Feed for ${name}`}
                  >
                    <span>{name}</span>
                    <span className="text-[10px] opacity-60">↗</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Body */}
      <section className="space-y-6">
        {/* Featured Banner Image */}
        {post.imageUrl && (
          <div className="w-full h-44 md:h-52 overflow-hidden relative rounded-xl border border-element-border">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="text-base leading-relaxed opacity-90 space-y-4 whitespace-pre-line">
          {post.content || post.summary}
        </div>

        {/* Author Bio Footer Box */}
        {post.author && (
          <div className="pt-6 border-t border-element-border flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center font-bold text-purple-400">
              {post.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Written by {post.author}</h4>
              <p className="text-sm opacity-60 font-mono">Course Author & Content Publisher</p>
            </div>
          </div>
        )}
      </section>

      {/* Navigation & Action Footer */}
      <div className="pt-6 flex flex-wrap justify-between items-center gap-4 text-base border-t border-element-border">
        <Link
          href="/posts"
          className="text-purple-400 hover:underline font-medium flex items-center gap-1"
        >
          <span aria-hidden="true">←</span>
          <span>Back to Posts</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href={`/posts/${editSlug}/edit`}
            className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 text-sm font-mono font-medium transition-colors"
          >
            ✏️ Edit Post
          </Link>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-sm font-mono font-medium transition-colors"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* CONFIRM DELETE MODAL OVERLAY */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-xl border border-element-border bg-element-background/60 shadow-2xl space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 font-mono">
                <span>⚠️</span> Confirm Deletion
              </h3>
              <p className="text-base text-element-foreground opacity-80 leading-relaxed">
                Are you sure you want to delete <strong>"{post.title}"</strong>? This will remove the article from all assigned RSS feeds.
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
                {isDeleting ? 'Deleting...' : 'Yes, Delete Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}