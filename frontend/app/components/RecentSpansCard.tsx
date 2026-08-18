// app/components/RecentSpansCard.tsx
"use client";

import { SpanRecord } from "../dashboard/useMetricsDashboard";

interface RecentSpansCardProps {
  recentSpans: SpanRecord[];
}

export default function RecentSpansCard({ recentSpans }: RecentSpansCardProps) {
  return (
    <div className="p-4 rounded-xl border border-element-border space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-mono font-bold opacity-90 uppercase tracking-wide flex items-center gap-2">
          <span>⏱️</span> Live Request Trace Spans
        </h3>
        <span className="text-sm font-mono opacity-60">
          {recentSpans.length} Recent Records
        </span>
      </div>

      <div className="p-3 rounded-lg bg-field-background border border-element-border border-l-4 border-l-purple-500 overflow-x-auto">
        {recentSpans.length > 0 ? (
          <table className="w-full text-left text-sm font-mono">
            <thead>
              <tr className="border-b border-element-border opacity-70 uppercase">
                <th className="pb-2">Method & Route</th>
                <th className="pb-2">Client IP</th>
                <th className="pb-2">Duration</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-element-border">
              {recentSpans.map((span) => {
                const statusColor =
                  span.statusCode >= 500
                    ? "bg-rose-600"
                    : span.statusCode >= 400
                    ? "bg-amber-600"
                    : "bg-emerald-600";

                return (
                  <tr key={span.id} className="hover:bg-background/40 transition-colors">
                    <td className="py-2 text-foreground font-semibold flex items-center gap-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] text-white font-bold ${statusColor}`}
                      >
                        {span.method}
                      </span>
                      <span className="truncate max-w-[240px]">{span.route}</span>
                    </td>
                    <td className="py-2 text-foreground">
                      <code>{span.clientIp}</code>
                    </td>
                    <td className="py-2 text-foreground">{span.durationMs}ms</td>
                    <td className="py-2">
                      <span
                        className={`font-bold ${
                          span.statusCode < 400 ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {span.statusCode}
                      </span>
                    </td>
                    <td className="py-2 text-right opacity-60">
                      {new Date(span.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-sm font-mono opacity-50 py-3 text-center">
            // No request spans captured yet
          </div>
        )}
      </div>
    </div>
  );
}