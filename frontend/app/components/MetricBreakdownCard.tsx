// app/components/MetricBreakdownCard.tsx
"use client";

import { MetricRow } from "../dashboard/useMetricsDashboard";

interface MetricBreakdownCardProps {
  title: string;
  icon: string;
  countLabel: string;
  data: MetricRow[];
  totalRequests: number;
  itemColumnHeader: string;
  valueColumnHeader: string;
  emptyMessage: string;
  formatAsCode?: boolean;
}

export default function MetricBreakdownCard({
  title,
  icon,
  countLabel,
  data,
  totalRequests,
  itemColumnHeader,
  valueColumnHeader,
  emptyMessage,
  formatAsCode = false,
}: MetricBreakdownCardProps) {
  return (
    <div className="p-5 rounded-xl border border-element-border bg-[var(--elementBg)] space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-mono font-bold opacity-90 uppercase tracking-wide flex items-center gap-2">
          <span>{icon}</span> {title}
        </h3>
        <span className="text-xs font-mono opacity-60">
          {data.length} {countLabel}
        </span>
      </div>

      <div className="p-3 rounded-lg bg-field-background border border-element-border border-l-4 border-l-purple-500">
        {data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-mono">
              <thead>
                <tr className="border-b border-element-border opacity-70 text-xs uppercase">
                  <th className="pb-2">{itemColumnHeader}</th>
                  <th className="pb-2 text-right">{valueColumnHeader}</th>
                  <th className="pb-2 text-right">Traffic Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-element-border">
                {data.map((row) => {
                  const share =
                    totalRequests > 0
                      ? ((row.count / Number(totalRequests)) * 100).toFixed(1)
                      : "0.0";

                  return (
                    <tr
                      key={row.label}
                      className="hover:bg-background/40 transition-colors"
                    >
                      <td className="py-2.5 text-foreground truncate max-w-[180px]">
                        {formatAsCode ? (
                          <code className="text-xs">{row.label}</code>
                        ) : (
                          <span className="font-bold">{row.label}</span>
                        )}
                      </td>
                      <td className="py-2.5 text-right font-bold text-foreground">
                        {row.count.toLocaleString()}
                      </td>
                      <td className="py-2.5 text-right opacity-80">{share}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-sm font-mono opacity-50 py-4 text-center">
            // {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
}