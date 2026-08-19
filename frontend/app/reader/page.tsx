"use client";

import TitleSection from "../components/TitleSection";
import ReaderCard from "../components/ReaderCard";
import { useRssReader } from "./useRssReader";

export default function RssReaderPage() {
  const {
    channels,
    selectedSlug,
    feedUrlInput,
    parsedFeed,
    loading,
    feedLoading,
    error,
    handleSelectChannel,
    handleUrlInputChange,
  } = useRssReader();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24">
      {/* HEADER SECTION - Always visible, never shifts */}
      <TitleSection
        title="RSS XML Reader"
        icon="📡"
        content={
          <p className="text-sm opacity-70">
            Parses raw XML feed documents directly in-browser using standard DOM parsing.
          </p>
        }
        right_section={
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <label
              htmlFor="feed-url-input"
              className="text-sm font-mono font-semibold uppercase opacity-80 shrink-0"
            >
              Feed URL:
            </label>
            <input
              id="feed-url-input"
              type="text"
              value={feedUrlInput}
              onChange={(e) => handleUrlInputChange(e.target.value)}
              placeholder="https://rss-lms.com/api/rss/general"
              className="w-full sm:w-80 md:w-96 px-3 py-2 rounded-lg border border-element-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        }
      />

      {/* CHANNEL BUTTON PILLS / SKELETON */}
      {loading ? (
        <div className="flex gap-2 animate-pulse" aria-busy="true">
          <div className="h-8 w-20 rounded-full bg-element-border/40" />
          <div className="h-8 w-24 rounded-full bg-element-border/40" />
          <div className="h-8 w-20 rounded-full bg-element-border/40" />
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {channels.map((chan) => (
            <button
              key={chan.id || chan.slug}
              onClick={() => handleSelectChannel(chan.slug)}
              className={`px-3 py-1.5 rounded-full text-sm font-mono transition-colors border ${
                selectedSlug === chan.slug
                  ? "bg-purple-600 border-purple-500 text-white font-bold"
                  : "bg-field-background border-element-border hover:border-purple-500 opacity-80"
              }`}
            >
              #{chan.slug}
            </button>
          ))}
        </div>
      )}

      {/* ERROR DISPLAY */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-mono">
          ⚠️ <strong>XML Parsing Error:</strong> {error}
        </div>
      )}

      {/* FEED CONTENT CONTAINER */}
      {loading || feedLoading ? (
        <div className="space-y-6 animate-pulse" aria-busy="true">
          {/* Skeleton: Feed Header Banner */}
          <div className="h-24 p-5 rounded-xl border border-element-border bg-[var(--elementBg)]/50 flex flex-col justify-center gap-2">
            <div className="flex items-center gap-2">
              <div className="h-6 w-28 rounded bg-purple-500/10" />
              <div className="h-6 w-48 rounded bg-element-border/50" />
            </div>
            <div className="h-4 w-72 rounded bg-element-border/30" />
          </div>

          {/* Skeleton: Post Cards */}
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-44 rounded-xl border border-element-border bg-[var(--elementBg)]/40 p-6 space-y-4"
              >
                <div className="h-6 w-3/4 rounded bg-element-border/60" />
                <div className="h-4 w-full rounded bg-element-border/30" />
                <div className="h-4 w-2/3 rounded bg-element-border/30" />
              </div>
            ))}
          </div>
        </div>
      ) : parsedFeed ? (
        <div className="space-y-6">
          {/* FEED HEADER BANNER */}
          <div className="p-5 rounded-xl border border-element-border bg-[var(--elementBg)] flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold border border-purple-500/20 uppercase">
                  Channel #{selectedSlug}
                </span>
                <h2 className="text-xl font-bold">{parsedFeed.title}</h2>
              </div>
              <p className="text-sm opacity-70 mt-1">
                {parsedFeed.description || "No feed channel description."}
              </p>
            </div>

            <a
              href={`/api/rss/${selectedSlug}`}
              target="_blank"
              rel="noreferrer"
              className="text-orange-400 hover:text-orange-300 hover:underline text-sm font-mono font-semibold transition-colors flex items-center gap-1.5 shrink-0 self-start md:self-auto"
            >
              <span>🟧</span> RSS XML
            </a>
          </div>

          {/* SINGLE-COLUMN POST LIST */}
          {parsedFeed.items.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-element-border rounded-xl font-mono text-sm opacity-60">
              📭 XML feed contains zero broadcast items.
            </div>
          ) : (
            <div className="space-y-6">
              {parsedFeed.items.map((item) => (
                <ReaderCard key={item.guid} item={item} />
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}