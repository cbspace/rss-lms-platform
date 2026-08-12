"use client";

import { useState, useEffect } from "react";
import TitleSection from "../components/TitleSection";
import ReaderCard, { RssItem } from "../components/ReaderCard";

type ParsedFeed = {
  title: string;
  description: string;
  link: string;
  items: RssItem[];
};

export default function RssReaderPage() {
  const [channels, setChannels] = useState<{ id: string; slug: string; name: string }[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [feedUrlInput, setFeedUrlInput] = useState<string>("");
  const [parsedFeed, setParsedFeed] = useState<ParsedFeed | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [feedLoading, setFeedLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to derive full endpoint URL
  const getFullFeedUrl = (slug: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/api/rss/${slug}`;
  };

  // 1. Fetch available channels on mount
  useEffect(() => {
    async function loadChannels() {
      try {
        setLoading(true);
        const res = await fetch("/api/rss");
        if (!res.ok) throw new Error("Failed to load channel list.");
        const data = await res.json();

        setChannels(data);
        if (data.length > 0) {
          const initialSlug = data[0].slug;
          setSelectedSlug(initialSlug);
          setFeedUrlInput(getFullFeedUrl(initialSlug));
        }
      } catch (err: any) {
        setError(err.message || "Failed to initialize feed reader.");
      } finally {
        setLoading(false);
      }
    }
    loadChannels();
  }, []);

  // 2. Fetch and Parse Raw XML Feed
  useEffect(() => {
    if (!selectedSlug) return;

    async function fetchAndParseXml() {
      try {
        setFeedLoading(true);
        setError(null);

        // Fetch raw XML response directly
        const res = await fetch(`/api/rss/${selectedSlug}`);
        if (!res.ok) throw new Error(`Failed to fetch XML feed for channel '${selectedSlug}'`);

        const xmlText = await res.text();

        // Native Browser XML DOM Parsing
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        // Check for XML parsing errors
        const parserError = xmlDoc.querySelector("parsererror");
        if (parserError) {
          throw new Error("Invalid RSS XML document returned by server.");
        }

        // Extract Channel Metadata
        const channelTitle = xmlDoc.querySelector("channel > title")?.textContent || selectedSlug;
        const channelDesc = xmlDoc.querySelector("channel > description")?.textContent || "";
        const channelLink = xmlDoc.querySelector("channel > link")?.textContent || "";

        // Extract Item Nodes
        const itemNodes = Array.from(xmlDoc.querySelectorAll("channel > item"));
        const items: RssItem[] = itemNodes.map((item, index) => {
          const guid = item.querySelector("guid")?.textContent || `item-${index}`;
          const title = item.querySelector("title")?.textContent || "Untitled Post";
          const link = item.querySelector("link")?.textContent || "";
          const pubDate = item.querySelector("pubDate")?.textContent || "";
          const author =
            item.querySelector("creator")?.textContent ||
            item.querySelector("author")?.textContent ||
            "Instructor";
          const description = item.querySelector("description")?.textContent || "";
          const content = item.querySelector("encoded")?.textContent || description;
          const enclosureUrl = item.querySelector("enclosure")?.getAttribute("url") || undefined;

          // Attempt to extract postNumber if contained in link or ID
          const postNumMatch = link.match(/post-(\d+)/) || guid.match(/(\d+)/);
          const postNumber = postNumMatch ? postNumMatch[1] : undefined;

          return {
            guid,
            postNumber,
            title,
            link,
            pubDate,
            author,
            description,
            content,
            imageUrl: enclosureUrl,
          };
        });

        setParsedFeed({
          title: channelTitle,
          description: channelDesc,
          link: channelLink,
          items,
        });
      } catch (err: any) {
        setError(err.message);
        setParsedFeed(null);
      } finally {
        setFeedLoading(false);
      }
    }

    fetchAndParseXml();
  }, [selectedSlug]);

  const handleSelectChannel = (slug: string) => {
    setSelectedSlug(slug);
    setFeedUrlInput(getFullFeedUrl(slug));
  };

  const handleUrlInputChange = (url: string) => {
    setFeedUrlInput(url);
    const match = url.match(/\/api\/rss\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      setSelectedSlug(match[1]);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 font-mono text-center text-sm opacity-70">
        [Initializing XML Feed Reader...]
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-12 p-4">
      {/* HEADER SECTION */}
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
              Feed XML URL:
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

      {/* CHANNEL BUTTON PILLS */}
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

      {/* ERROR DISPLAY */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-mono">
          ⚠️ <strong>XML Parsing Error:</strong> {error}
        </div>
      )}

      {/* FEED CONTENT CONTAINER */}
      {feedLoading ? (
        <div className="p-12 text-center font-mono text-sm opacity-50 animate-pulse">
          Parsing #{selectedSlug} XML payload...
        </div>
      ) : parsedFeed ? (
        <div className="space-y-6">
          {/* FEED HEADER BANNER */}
          <div className="p-5 rounded-xl border border-element-border bg-[var(--elementBg)] flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-sm font-mono font-bold uppercase bg-purple-600 text-white">
                  XML Channel #{selectedSlug}
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

          {/* SINGLE-COLUMN POST LIST USING READER CARD */}
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