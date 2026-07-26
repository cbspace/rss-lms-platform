// app/feeds/page.tsx
'use client';

import { useState } from 'react';
import { MOCK_POSTS } from '@/data/mock_posts';

export default function FeedInbox() {
  const [selectedLmsChannel, setSelectedLmsChannel] = useState<Record<string, string>>({});
  const [openFeedId, setOpenFeedId] = useState<string | null>('feed-1');

  const handleAssign = (postId: string, channelName: string) => {
    setSelectedLmsChannel((prev) => ({ ...prev, [postId]: channelName }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[var(--elementBorder)] pb-4">
        <div>
          <h1>Incoming RSS Feeds <span aria-hidden="true">📡</span></h1>
          <p className="">Review raw incoming posts and route them to LMS course channels.</p>
        </div>
      </div>

      {/* Feed Group 1 */}
      <div className="border border-[var(--elementBorder)] rounded-lg bg-[var(--elementBg)] overflow-hidden">
        {/* Accordion Header (Hide/Show Toggle Requirement) */}
        <button
          onClick={() => setOpenFeedId(openFeedId === 'feed-1' ? null : 'feed-1')}
          className="w-full p-4 flex justify-between items-center bg-[var(--elementBg)] font-semibold text-left border-b border-[var(--elementBorder)]"
        >
          <div className="flex items-center gap-2">
            <span>📡 Source: Web Dev & Frameworks Feed</span>
            <span className="text-sm px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-mono">
              3 Items
            </span>
          </div>
          <span>{openFeedId === 'feed-1' ? '▲ Hide Items' : '▼ Expand Items'}</span>
        </button>

        {/* Collapsible Content */}
        {openFeedId === 'feed-1' && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_POSTS.map((post) => {
              const assigned = selectedLmsChannel[post.id];
              return (
                <div 
                  key={post.id} 
                  className="p-4 rounded border border-[var(--elementBorder)] bg-[var(--background)] flex flex-col justify-between gap-3"
                >
                  <div>
                    <span className="text-sm opacity-60">{post.date}</span>
                    <h3 className="font-semibold text-base mt-1">{post.title}</h3>
                    <p className="text-sm opacity-80 mt-2 line-clamp-2">{post.summary}</p>
                  </div>

                  {/* LMS Channel Routing Selector */}
                  <div className="pt-3 border-t border-[var(--elementBorder)] flex items-center justify-between gap-2">
                    <select
                      value={assigned || ''}
                      onChange={(e) => handleAssign(post.id, e.target.value)}
                      className="text-sm p-1.5 rounded border border-[var(--elementBorder)] bg-[var(--elementBg)] text-[var(--foreground)]"
                    >
                      <option value="" disabled>Route to LMS Channel...</option>
                      <option value="CS101: Module 4">CS101: Module 4 Readings</option>
                      <option value="CS102: Lab Resources">CS102: Lab Resources</option>
                      <option value="General News">General Announcement Feed</option>
                    </select>

                    {assigned && (
                      <span className="text-sm font-medium text-green-500 flex items-center gap-1">
                        ✓ Synced
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
