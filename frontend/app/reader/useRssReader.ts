"use client";

import { useState, useEffect } from "react";
import { RssItem } from "../components/ReaderCard";

export interface ChannelOption {
  id: string;
  slug: string;
  name: string;
}

export interface ParsedFeed {
  title: string;
  description: string;
  link: string;
  items: RssItem[];
}

export function useRssReader() {
  const [channels, setChannels] = useState<ChannelOption[]>([]);
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
        const data: ChannelOption[] = await res.json();

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

        const res = await fetch(`/api/rss/${selectedSlug}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch XML feed for channel '${selectedSlug}'`);
        }

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
        const channelTitle =
          xmlDoc.querySelector("channel > title")?.textContent || selectedSlug;
        const channelDesc =
          xmlDoc.querySelector("channel > description")?.textContent || "";
        const channelLink =
          xmlDoc.querySelector("channel > link")?.textContent || "";

        // Extract Item Nodes
        const itemNodes = Array.from(xmlDoc.querySelectorAll("channel > item"));
        const items: RssItem[] = itemNodes.map((item, index) => {
          const guid =
            item.querySelector("guid")?.textContent || `item-${index}`;
          const title =
            item.querySelector("title")?.textContent || "Untitled Post";
          const link = item.querySelector("link")?.textContent || "";
          const pubDate = item.querySelector("pubDate")?.textContent || "";
          const author =
            item.querySelector("creator")?.textContent ||
            item.querySelector("author")?.textContent ||
            "Instructor";
          const description =
            item.querySelector("description")?.textContent || "";
          const content =
            item.querySelector("encoded")?.textContent || description;
          const enclosureUrl =
            item.querySelector("enclosure")?.getAttribute("url") || undefined;

          // Attempt to extract postNumber if contained in link or ID


          const postNumber =
            item.getElementsByTagNameNS("*", "postNumber")[0]?.textContent ||
            item.querySelector("postNumber, app\\:postNumber")?.textContent ||
            undefined;

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

  return {
    channels,
    selectedSlug,
    feedUrlInput,
    parsedFeed,
    loading,
    feedLoading,
    error,
    handleSelectChannel,
    handleUrlInputChange,
  };
}