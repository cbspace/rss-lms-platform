// lib/rss.ts
import { ChannelWithPosts } from "@/lib/channels";

/**
 * Escapes special characters to ensure valid XML parsing.
 */
export function escapeXml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Generates a valid RSS 2.0 XML string from channel data and attached posts.
 */
export function generateRssXml(channel: ChannelWithPosts): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rss-lms.com";

  // Channel self-link for Atom namespace
  const feedUrl = `${baseUrl}/api/rss/${channel.slug}`;

  const itemsXml = (channel.posts || [])
    .map((post, index) => {
      // Points to user-facing page or API
      const postLink = `${baseUrl}/api/posts/${post.id}`;

      // Resolve post number: explicit field on post or 1-based index fallback
      const postNumber =
        (post as any).postNumber ?? (post as any).number ?? index + 1;

      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <app:postNumber>${postNumber}</app:postNumber>
      <link>${postLink}</link>
      <guid isPermaLink="false">${post.id}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <dc:creator><![CDATA[${post.author}]]></dc:creator>
      <description><![CDATA[${post.summary || ""}]]></description>
      <content:encoded><![CDATA[${post.content || ""}]]></content:encoded>
      ${
        post.imageUrl
          ? `<enclosure url="${escapeXml(post.imageUrl)}" length="0" type="image/jpeg" />`
          : ""
      }
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/" 
  xmlns:dc="http://purl.org/dc/elements/1.1/" 
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:app="${baseUrl}/schema/rss">
  <channel>
    <title><![CDATA[${channel.name || channel.slug}]]></title>
    <link>${feedUrl}</link>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
    <description><![CDATA[${channel.description || "RSS Feed for " + channel.slug}]]></description>
    <language>en</language>
    <pubDate>${new Date().toUTCString()}</pubDate>
    ${itemsXml}
  </channel>
</rss>`;
}