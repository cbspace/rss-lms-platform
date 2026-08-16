// app/components/JsonPayloadCard.tsx
"use client";

import { ReactNode } from "react";

export interface OutgoingRequestMeta {
  method: string;
  url: string;
  timestamp?: string;
  headers?: Record<string, string> | any;
  body?: any;
}

interface JsonPayloadCardProps {
  title: string;
  icon?: string;
  data?: any;
  requestMeta?: OutgoingRequestMeta | null;
  status?: number | string | null;
  loading?: boolean;
  emptyMessage?: string;
  maxHeight?: string;
  minHeight?: string;
  rightSection?: ReactNode;
}

export default function JsonPayloadCard({
  title,
  icon = "📦",
  data,
  requestMeta,
  status = null,
  loading = false,
  emptyMessage = "// No payload data available",
  maxHeight = "max-h-[500px]",
  minHeight = "min-h-[140px]",
  rightSection,
}: JsonPayloadCardProps) {
  // Method badge color resolver
  const getMethodBadge = (method: string) => {
    const m = method.toUpperCase();
    if (m === "POST") return "bg-purple-600";
    if (m === "PUT" || m === "PATCH") return "bg-amber-600";
    if (m === "DELETE") return "bg-rose-600";
    return "bg-emerald-600";
  };

  const formattedPayload =
    data !== undefined && data !== null
      ? typeof data === "object"
        ? JSON.stringify(data, null, 2)
        : String(data)
      : null;

  return (
    <div className="p-5 rounded-xl border border-element-border bg-[var(--elementBg)] space-y-3 font-mono">
      {/* CARD HEADER */}
      <div className="flex justify-between items-center gap-2">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          {icon && <span>{icon}</span>}
          <span>{title}</span>
        </h3>

        {/* Optional Right Section or Status Indicator */}
        {rightSection ? (
          rightSection
        ) : status !== null || loading ? (
          <div className="text-base font-mono">
            Status:{" "}
            {status !== null ? (
              <strong
                className={
                  Number(status) < 300 ? "text-emerald-500" : "text-rose-400"
                }
              >
                {status}
              </strong>
            ) : (
              <span className="text-foreground">Idle</span>
            )}
            {loading && (
              <span className="text-amber-400 ml-2 animate-pulse">
                Executing...
              </span>
            )}
          </div>
        ) : null}
      </div>

      {/* CARD CONTENT */}
      <div className="p-3 rounded-lg bg-field-background border border-element-border border-l-4 border-l-purple-500 text-foreground text-sm font-mono space-y-2">
        {/* Render Request Metadata If Provided */}
        {requestMeta ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center pb-2 border-b border-element-border">
              <div className="flex items-center gap-2 truncate pr-2">
                <span
                  className={`px-2 py-0.5 rounded text-[12px] font-bold text-white ${getMethodBadge(
                    requestMeta.method
                  )}`}
                >
                  {requestMeta.method}
                </span>
                <code className="text-foreground truncate">{requestMeta.url}</code>
              </div>
              {requestMeta.timestamp && (
                <span className="text-[12px] text-foreground shrink-0">
                  {requestMeta.timestamp}
                </span>
              )}
            </div>

            {requestMeta.headers && (
              <div className="pt-2 text-foreground">
                <strong>Headers:</strong>{" "}
                <code className="text-foreground">
                  {JSON.stringify(requestMeta.headers)}
                </code>
              </div>
            )}

            {requestMeta.body && (
              <div className="pt-2 space-y-1">
                <strong className="text-foreground">Payload Body:</strong>
                <pre className="p-2 rounded bg-field-background text-foreground text-sm max-h-42 overflow-auto whitespace-pre-wrap word-break-all">
                  {typeof requestMeta.body === "object"
                    ? JSON.stringify(requestMeta.body, null, 2)
                    : requestMeta.body}
                </pre>
              </div>
            )}
          </div>
        ) : (
          /* Render Main Data / Response Payload */
          <pre
            className={`text-sm overflow-auto whitespace-pre-wrap word-break-all ${minHeight} ${maxHeight}`}
          >
            {formattedPayload || emptyMessage}
          </pre>
        )}
      </div>
    </div>
  );
}