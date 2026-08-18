// app/components/IncidentsCard.tsx
"use client";

import { SpanRecord } from "../dashboard/useMetricsDashboard";

interface IncidentsCardProps {
  recentErrors: SpanRecord[];
  errorRate: string;
}

export default function IncidentsCard({ recentErrors, errorRate }: IncidentsCardProps) {
  if (!recentErrors || recentErrors.length === 0) {
    return null;
  }

  return (
    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2 font-mono">
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2 text-foreground font-bold text-base">
          <span>⚠️</span> System Warnings & Incidents ({recentErrors.length})
        </div>
        <span className="text-base opacity-80 text-foreground font-medium">
          Error Rate: {errorRate}
        </span>
      </div>

      <div className="space-y-1.5 text-[15px]">
        {recentErrors.map((err) => {
          const type =
            err.errorType ||
            err.error?.type ||
            (err.statusCode >= 400 ? `HTTP_${err.statusCode}` : "WARNING");

          const message =
            err.errorMessage ||
            err.error?.message ||
            `Status Code ${err.statusCode}`;

          const formattedType = type.replace(/_/g, " ").toUpperCase();
          const isWarning =
            type === "EMPTY_FEED" || (err.statusCode >= 200 && err.statusCode < 400);

          return (
            <div
              key={err.id}
              className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 opacity-90 border-b border-amber-500/10 pb-1.5 last:border-none"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <div className="w-42 shrink-0 flex items-center">
                  <span
                    className={`px-1.5 rounded text-[14px] font-medium tracking-wider ${
                      isWarning
                        ? "text-amber-600 border border-amber-600"
                        : "text-rose-600 border border-rose-600"
                    }`}
                  >
                    {formattedType}
                  </span>
                </div>

                <code className="text-foreground font-semibold">{err.route}</code>
                <span className="opacity-80">— {message}</span>
              </div>

              <span className="opacity-70 text-[15px] shrink-0 font-mono">
                {new Date(err.timestamp).toLocaleTimeString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}