// app/components/IncidentsCard.tsx
"use client";

import { SpanRecord } from "../dashboard/useMetricsDashboard";

interface IncidentsCardProps {
  recentErrors: SpanRecord[];
  errorRate: string;
  hasLoaded: boolean;
}

export default function IncidentsCard({
  recentErrors,
  errorRate,
  hasLoaded,
}: IncidentsCardProps) {
  const hasErrors = recentErrors && recentErrors.length > 0;

  // 1. INITIAL / UNRESOLVED STATE (Neutral gray shell, no green flash)
  if (!hasLoaded) {
    return (
      <div className="p-4 rounded-xl border border-element-border font-mono h-[218px] flex flex-col justify-between bg-[var(--elementBg)]/40">
        <div className="flex items-center justify-between pb-2 shrink-0">
          <div className="flex items-center gap-2 text-foreground font-bold text-base opacity-70">
            <span>⏳</span>
            <span>System Warnings & Incidents</span>
          </div>
          <span className="text-base opacity-50 font-medium">Error Rate: ...</span>
        </div>

        <div className="h-[180px] space-y-2 flex flex-col justify-center animate-pulse">
          <div className="h-6 w-full rounded bg-element-border/30" />
          <div className="h-6 w-5/6 rounded bg-element-border/30" />
          <div className="h-6 w-4/6 rounded bg-element-border/30" />
        </div>
      </div>
    );
  }

  // 2. LOADED STATE (Green only after confirmed load)
  return (
    <div
      className={`p-4 rounded-xl border font-mono h-[218px] flex flex-col justify-between ${
        hasErrors
          ? "bg-amber-500/10 border-amber-500/30"
          : "bg-emerald-500/5 border-emerald-500/20"
      }`}
    >
      <div className="flex items-center justify-between pb-2 shrink-0">
        <div className="flex items-center gap-2 text-foreground font-bold text-base">
          <span>{hasErrors ? "⚠️" : "✅"}</span>
          <span>
            System Warnings & Incidents {hasErrors ? `(${recentErrors.length})` : ""}
          </span>
        </div>
        <span className="text-base opacity-80 text-foreground font-medium">
          Error Rate: {errorRate}
        </span>
      </div>

      {hasErrors ? (
        <div className="h-[160px] overflow-y-auto space-y-1 text-[15px] pr-1">
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
                className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 opacity-90 border-b border-amber-500/10 pb-1 last:border-none"
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
      ) : (
        <div className="h-[160px] flex items-center justify-center text-center">
          <p className="text-sm opacity-60">
            All systems nominal. No recent operational warnings or request errors detected.
          </p>
        </div>
      )}
    </div>
  );
}