// app/dev/page.tsx
"use client";

import { useState, useEffect } from "react";
import TitleSection from "../components/TitleSection";
import JsonPayloadCard from "../components/JsonPayloadCard";

export default function DevTestPage() {
  const [mounted, setMounted] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<number | null>(null);

  // Outgoing Request Inspector State
  const [activeRequest, setActiveRequest] = useState<{
    method: string;
    url: string;
    headers?: Record<string, string>;
    body?: any;
    timestamp?: string;
  } | null>(null);

  // Form State for Channel Creation
  const [newChannelSlug, setNewChannelSlug] = useState("cs101");
  const [newChannelName, setNewChannelName] = useState("Computer Science Fundamentals");
  const [newChannelDesc, setNewChannelDesc] = useState("Introduction to computer Sceince");

  // Form State for Post Creation
  const [title, setTitle] = useState("Introduction to Web Development");
  const [author, setAuthor] = useState("Craig");
  const [summary, setSummary] = useState("A brief introduction to modern web stacks.");
  const [content, setContent] = useState("This is a test.");
  const [channelSlug, setChannelSlug] = useState("cs101");
  const [targetId, setTargetId] = useState("");

  // Guard against SSR Hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Request executor with Request Inspection
  async function executeRequest(url: string, options?: RequestInit) {
    setLoading(true);
    setStatus(null);

    const method = options?.method || "GET";
    let parsedBody = null;
    if (options?.body) {
      try {
        parsedBody = JSON.parse(options.body as string);
      } catch {
        parsedBody = options.body;
      }
    }

    // Capture and display outgoing request metadata
    setActiveRequest({
      method,
      url,
      headers: (options?.headers as Record<string, string>) || {
        "Content-Type": options?.body ? "application/json" : "*/*",
      },
      body: parsedBody,
      timestamp: new Date().toLocaleTimeString(),
    });

    try {
      const res = await fetch(url, options);
      setStatus(res.status);

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        setResponse(data);
      } else {
        const text = await res.text();
        setResponse(text);
      }
    } catch (err: any) {
      setStatus(500);
      setResponse({ error: "Fetch failed", details: err.message });
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-6 pb-10 p-4">
        <div className="p-8 text-center text-foreground font-mono">
          [Mounting Dev Test Dashboard...]
        </div>
      </div>
    );
  }

  return (
    <div id="dev_dashboard" className="w-full max-w-6xl mx-auto space-y-6 pb-10">
      {/* HEADER SECTION */}
      <TitleSection
        title="RSS Server API Test Dashboard"
        icon="🛠️"
        content={
          <p>
            Trigger API actions on the left and observe outgoing requests and server responses in real-time.
          </p>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: ACTION CONTROLS */}
        <div className="space-y-6">
          {/* 1. System Monitoring */}
          <div className="p-5 rounded-xl border border-element-border bg-[var(--elementBg)] space-y-3">
            <h3 className="text-base font-mono font-bold opacity-90 uppercase tracking-wide">
              1. System Monitoring
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => executeRequest("/api/health")}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-mono font-semibold transition-colors"
              >
                GET /api/health
              </button>
              <button
                onClick={() => executeRequest("/api/count")}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-mono font-semibold transition-colors"
              >
                GET /api/count
              </button>
            </div>
          </div>

          {/* 2. Create RSS Channel */}
          <div className="p-5 rounded-xl border border-element-border bg-[var(--elementBg)] space-y-3">
            <h3 className="text-base font-mono font-bold opacity-90 uppercase tracking-wide">
              2. Create RSS Channel (POST /api/rss)
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeRequest("/api/rss", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    slug: newChannelSlug,
                    name: newChannelName,
                    description: newChannelDesc,
                  }),
                });
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-sm font-mono font-medium opacity-80 mb-1">
                  Channel Slug
                </label>
                <input
                  type="text"
                  placeholder="Slug (e.g. cs101)"
                  value={newChannelSlug}
                  onChange={(e) => setNewChannelSlug(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-element-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-mono font-medium opacity-80 mb-1">
                  Channel Name
                </label>
                <input
                  type="text"
                  placeholder="Channel Name"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-element-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-mono font-medium opacity-80 mb-1">
                  Channel Description
                </label>
                <input
                  type="text"
                  placeholder="Description"
                  value={newChannelDesc}
                  onChange={(e) => setNewChannelDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-element-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-mono font-semibold transition-colors disabled:opacity-50"
              >
                Create Channel
              </button>
            </form>
          </div>

          {/* 3. Fetch or Delete RSS Channel */}
          <div className="p-5 rounded-xl border border-element-border bg-[var(--elementBg)] space-y-3">
            <h3 className="text-base font-mono font-bold opacity-90 uppercase tracking-wide">
              3. Fetch or Delete RSS Channel
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => executeRequest(`/api/rss/${channelSlug}?json=true`)}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-mono font-semibold transition-colors"
              >
                GET RSS (JSON)
              </button>
              <button
                onClick={() => executeRequest(`/api/rss/${channelSlug}`)}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-mono font-semibold transition-colors"
              >
                GET RSS (Raw XML)
              </button>
              <button
                onClick={() => executeRequest(`/api/rss/${channelSlug}`, { method: "DELETE" })}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-mono font-semibold transition-colors"
              >
                DELETE Channel
              </button>
            </div>
          </div>

          {/* 4. Create Post */}
          <div className="p-5 rounded-xl border border-element-border bg-[var(--elementBg)] space-y-3">
            <h3 className="text-base font-mono font-bold opacity-90 uppercase tracking-wide">
              4. Create Post (POST /api/posts)
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeRequest("/api/posts", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    title,
                    author,
                    summary,
                    content,
                    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
                    channelSlugs: [channelSlug],
                  }),
                });
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-sm font-mono font-medium opacity-80 mb-1">
                  Target Channel Slug
                </label>
                <input
                  type="text"
                  placeholder="Target Channel Slug"
                  value={channelSlug}
                  onChange={(e) => setChannelSlug(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-element-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-mono font-medium opacity-80 mb-1">
                  Post Title
                </label>
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-element-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-mono font-medium opacity-80 mb-1">
                  Author
                </label>
                <input
                  type="text"
                  placeholder="Author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-element-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-mono font-medium opacity-80 mb-1">
                  Summary
                </label>
                <input
                  type="text"
                  placeholder="Summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-element-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-mono font-medium opacity-80 mb-1">
                  Content
                </label>
                <textarea
                  placeholder="Content (HTML string supported)"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-element-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-mono font-semibold transition-colors disabled:opacity-50"
              >
                Submit POST Request
              </button>
            </form>
          </div>

          {/* 5. Single Post Operations */}
          <div className="p-5 rounded-xl border border-element-border bg-[var(--elementBg)] space-y-3">
            <h3 className="text-base font-mono font-bold opacity-90 uppercase tracking-wide">
              5. Single Post Operations (/api/posts/[id])
            </h3>
            <div className="flex flex-col sm:flex-row gap-2 items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-mono font-medium opacity-80 mb-1">
                  Post ID or Number
                </label>
                <input
                  type="text"
                  placeholder="Post ID or Number"
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-element-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => executeRequest(`/api/posts/${targetId}`)}
                  disabled={targetId.trim().length === 0}
                  className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-mono font-semibold transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  GET Post
                </button>
                <button
                  onClick={() => executeRequest(`/api/posts/${targetId}`, { method: "DELETE" })}
                  disabled={targetId.trim().length === 0}
                  className="px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-mono font-semibold transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  DELETE Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REQUEST & RESPONSE INSPECTOR */}
        <div className="space-y-6">
          <JsonPayloadCard
            title="Outgoing Request"
            icon="📤"
            requestMeta={activeRequest}
            emptyMessage="// Click an action on the left to inspect the outgoing request..."
          />
          <JsonPayloadCard
            title="Server Response"
            icon="📥"
            data={response}
            status={status}
            loading={loading}
            emptyMessage="// Response payload will appear here..."
            minHeight="min-h-[300px]"
            maxHeight="max-h-[500px]"
          />
        </div>
      </div>
    </div>
  );
}