"use client";

import React, { useState } from "react";

export type RssItem = {
  guid: string;
  postNumber?: string;
  title: string;
  link: string;
  pubDate: string;
  author: string;
  description: string;
  content: string;
  imageUrl?: string;
};

interface ReaderCardProps {
  item: RssItem;
}

export default function ReaderCard({ item }: ReaderCardProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const contentText = item.content || item.description;
  const isLongContent = contentText.length > 350;

  return (
    <article className="p-6 rounded-xl border border-element-border bg-background space-y-6 shadow-sm">
      {/* ROW 1: METADATA (LEFT) + IMAGE THUMBNAIL (RIGHT) */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-element-border/50 pb-4">
        {/* LEFT METADATA BLOCK */}
        <div className="space-y-2 text-sm font-mono opacity-90">
          {item.pubDate && (
            <div className="flex items-center gap-2">
              <span className="font-semibold opacity-60">Date:</span>
              <span>{new Date(item.pubDate).toLocaleDateString()}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="font-semibold opacity-60">Author:</span>
            <span>✍️ {item.author}</span>
          </div>
          {item.postNumber && (
            <div className="flex items-center gap-2">
              <span className="font-semibold opacity-60">Post Number:</span>
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold border border-purple-500/20">
                #{item.postNumber}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="font-semibold opacity-60">GUID:</span>
            <span className="opacity-80 break-all">{item.guid}</span>
          </div>
        </div>

        {/* RIGHT THUMBNAIL BLOCK */}
        {item.imageUrl && (
          <div className="w-full sm:w-36 h-28 shrink-0 rounded-lg overflow-hidden border border-element-border bg-field-background">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      {/* ROW 2: TITLE + FEED CONTENT */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold tracking-tight text-foreground">
          {item.title}
        </h3>

        <div className="text-sm opacity-90 leading-relaxed whitespace-pre-line">
          {isLongContent && !isExpanded ? (
            <p>{contentText.slice(0, 350)}...</p>
          ) : (
            <p>{contentText}</p>
          )}
        </div>

        {/* EXPAND BUTTON FOR LARGE FEEDS */}
        {isLongContent && (
          <div className="pt-2">
            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              className="px-3 py-1.5 rounded bg-field-background border border-element-border hover:border-purple-500 text-sm font-mono font-semibold transition-colors flex items-center gap-1.5"
            >
              {isExpanded ? "▲ Show Less" : "▼ Read Full Content"}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}