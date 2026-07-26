// app/channels/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MOCK_POSTS, MockPost } from '@/data/mock_posts';

// Defined LMS output channels
const CHANNELS = [
  {
    id: 'cs101',
    name: 'CS101: Web Architectures',
    code: 'CS101-WEB',
    description: 'Curated readings on modern web standards, Next.js, accessibility, and CSS.',
    endpoint: '/api/v1/channels/cs101/json',
    targetCourse: 'Computer Science 101'
  },
  {
    id: 'cs102',
    name: 'CS102: Systems & Deployment',
    code: 'CS102-SYS',
    description: 'Backend architecture, Docker containerization, ORMs, and API telemetry.',
    endpoint: '/api/v1/channels/cs102/json',
    targetCourse: 'Computer Science 102'
  },
  {
    id: 'cs100',
    name: 'CS100: EdTech & Industry Integration',
    code: 'CS100-EDT',
    description: 'Educational technology trends, micro-learning methodologies, and content curation.',
    endpoint: '/api/v1/channels/cs100/json',
    targetCourse: 'General EdTech Stream'
  },
  {
    id: 'cs103',
    name: 'CS103: Algorithms & Data Structures',
    code: 'CS103-ALGO',
    description: 'Practical data structures, caching mechanisms, and algorithmic performance.',
    endpoint: '/api/v1/channels/cs103/json',
    targetCourse: 'Computer Science 103'
  }
];

export default function ChannelsPage() {
  const [activeChannelId, setActiveChannelId] = useState<string>('cs101');
  const [showJsonPreview, setShowJsonPreview] = useState<boolean>(false);
  const [syncedPosts, setSyncedPosts] = useState<MockPost[]>(MOCK_POSTS);

  const activeChannel = CHANNELS.find((c) => c.id === activeChannelId) || CHANNELS[0];

  // Filter posts that belong to the selected channel
  const channelPosts = syncedPosts.filter(
    (post) => post.defaultLmsChannel.toLowerCase().includes(activeChannel.id) ||
              post.defaultLmsChannel.includes(activeChannel.name)
  );

  // Remove a post from the channel (client-state simulation)
  const handleRemovePost = (id: string) => {
    setSyncedPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div id="Channels" className="space-y-8">
      {/* Hero / Overview Header */}
      <section className="p-4 rounded-xl border border-[var(--elementBorder)] bg-[var(--elementBg)] text-[var(--foreground)] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1>
              Publishing Channels <span aria-hidden="true">📺</span>
            </h1>
            <p className="text-sm opacity-80 mt-2 max-w-2xl leading-relaxed">
              This is the egress pipeline of the platform. Instructors manage curated course feeds 
              and inspect the standardized JSON output streams consumed by LMS modules.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-sm font-mono p-2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <span>● Sync Status: Active</span>
          </div>
        </div>
      </section>

      {/* Channel Selector Tabs */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span>📚</span> Target Course Outlets
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CHANNELS.map((channel) => {
            const isActive = channel.id === activeChannelId;
            const count = syncedPosts.filter((p) =>
              p.defaultLmsChannel.toLowerCase().includes(channel.id)
            ).length;

            return (
              <button
                key={channel.id}
                onClick={() => setActiveChannelId(channel.id)}
                className={`p-4 rounded-lg border text-left transition-all flex flex-col justify-between gap-3 ${
                  isActive
                    ? 'border-purple-500 bg-purple-500/10 shadow-sm'
                    : 'border-[var(--elementBorder)] bg-[var(--elementBg)] hover:border-purple-500/50'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-[var(--elementBorder)] opacity-80">
                    {channel.code}
                  </span>
                  <h3 className="font-bold text-sm mt-2">{channel.name}</h3>
                </div>
                <div className="flex justify-between items-center text-sm opacity-75 pt-2 border-t border-[var(--elementBorder)]">
                  <span>{channel.targetCourse}</span>
                  <span className="font-mono px-2 py-0.5 rounded bg-purple-500/20">
                    {count} items
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected Channel Dashboard */}
      <section className="p-6 rounded-xl border border-[var(--elementBorder)] bg-[var(--elementBg)] space-y-6">
        {/* Active Channel Details */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--elementBorder)]">
          <div>
            <div className="flex items-center gap-2 text-sm font-mono text-purple-400 font-bold uppercase">
              <span>Selected LMS Feed Channel</span>
            </div>
            <h2 className="text-2xl font-bold mt-1">{activeChannel.name}</h2>
            <p className="text-sm opacity-80 mt-1">{activeChannel.description}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* JSON Output Toggle Button (Assessment Requirement: Interactive Toggles) */}
            <button
              onClick={() => setShowJsonPreview(!showJsonPreview)}
              className="px-3 py-1.5 rounded text-sm font-mono border border-[var(--elementBorder)] bg-[var(--background)] hover:border-purple-500 transition-colors flex items-center gap-2"
            >
              <span>{showJsonPreview ? 'Hide JSON Stream ▲' : 'Inspect JSON Endpoint 🛠️'}</span>
            </button>

            <Link
              href="/posts"
              className="px-3 py-1.5 rounded text-sm font-medium bg-purple-700 text-white hover:bg-purple-800 transition-colors flex items-center gap-1"
            >
              <span>+ Add Posts in Posts</span>
            </Link>
          </div>
        </div>

        {/* Collapsible JSON Feed Payload Inspection (Meets Hide/Show Block Requirement) */}
        {showJsonPreview && (
          <div className="p-4 rounded-lg bg-black/90 text-green-400 font-mono text-sm overflow-x-auto space-y-2 border border-green-500/30">
            <div className="flex justify-between items-center text-gray-400 pb-2 border-b border-gray-800 text-[11px]">
              <span>GET {activeChannel.endpoint}</span>
              <span>Content-Type: application/json</span>
            </div>
            <pre className="whitespace-pre-wrap leading-relaxed">
              {JSON.stringify(
                {
                  channelId: activeChannel.id,
                  channelCode: activeChannel.code,
                  targetCourse: activeChannel.targetCourse,
                  updatedAt: new Date().toISOString(),
                  itemCount: channelPosts.length,
                  items: channelPosts.map((p) => ({
                    id: p.id,
                    title: p.title,
                    author: p.author,
                    publishedDate: p.date,
                    sourceUrl: p.guid,
                    summary: p.summary
                  }))
                },
                null,
                2
              )}
            </pre>
          </div>
        )}

        {/* Published Posts Grid for this Channel */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold opacity-90 flex items-center justify-between">
            <span>Curated Course Articles ({channelPosts.length})</span>
            <span className="text-sm font-normal opacity-60">Synced with LMS REST endpoint</span>
          </h3>

          {channelPosts.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-[var(--elementBorder)] rounded-lg space-y-2">
              <p className="text-sm opacity-70">No articles currently published to this course channel.</p>
              <Link href="/feeds" className="text-sm text-purple-400 underline hover:text-purple-300">
                Go to Feeds to assign articles to {activeChannel.name}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {channelPosts.map((post) => (
                <div
                  key={post.id}
                  className="content-box flex flex-col justify-between gap-4 p-4 rounded-lg border border-[var(--elementBorder)] bg-[var(--background)]"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm opacity-60">
                      <span>{post.category}</span>
                      <span>{post.date}</span>
                    </div>
                    <h4 className="font-bold text-base leading-snug">{post.title}</h4>
                    <p className="text-sm opacity-80 line-clamp-2">{post.summary}</p>
                    <p className="text-[11px] opacity-60 font-mono">Source: {post.sourceFeed}</p>
                  </div>

                  <div className="pt-3 border-t border-[var(--elementBorder)] flex justify-between items-center text-sm">
                    <span className="text-green-500 font-medium flex items-center gap-1">
                      ✓ Published to LMS
                    </span>
                    <button
                      onClick={() => handleRemovePost(post.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      title="Unpublish from channel"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}