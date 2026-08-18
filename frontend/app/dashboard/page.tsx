// app/dashboard/page.tsx
"use client";

import TitleSection from "../components/TitleSection";
import MetricDisplay from "../components/MetricDisplay";
import IncidentsCard from "../components/IncidentsCard";
import HealthRuntimeCard from "../components/HealthRuntimeCard";
import JsonPayloadCard from "../components/JsonPayloadCard";
import MetricBreakdownCard from "../components/MetricBreakdownCard";
import RecentSpansCard from "../components/RecentSpansCard";
import { useMetricsDashboard } from "./useMetricsDashboard";

export default function MetricsDashboardPage() {
  const {
    mounted,
    loading,
    error,
    lastRefreshed,
    autoRefresh,
    setAutoRefresh,
    health,
    totalRequests,
    uniqueClients,
    totalFeeds,
    totalPosts,
    errorRate,
    avgLatencyMs,
    feedList,
    clientList,
    recentSpans,
    recentErrors,
    isHealthy,
    fetchDashboardData,
  } = useMetricsDashboard();

  if (!mounted) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-6 pb-10 p-4">
        <div className="p-8 text-center text-foreground font-mono">
          [Mounting Observability Dashboard...]
        </div>
      </div>
    );
  }

  return (
    <div id="metrics_dashboard" className="w-full max-w-6xl mx-auto space-y-6 pb-10">
      <TitleSection
        title="RSS Server Metrics & Observability"
        icon="📈"
        content={
          <p className="opacity-70">
            Real-time health status, telemetry spans, error detection, and traffic breakdowns.
          </p>
        }
        right_section={
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchDashboardData()}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-mono font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh Now"}
            </button>
            <label className="text-sm font-mono opacity-80 cursor-pointer flex items-center gap-2 select-none">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-element-border text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
              Auto-refresh (3s)
            </label>
          </div>
        }
      />

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-500 text-sm font-mono">
          ⚠️ {error}
        </div>
      )}

      {/* OPERATIONAL WARNINGS & ERROR INCIDENTS */}
      <IncidentsCard recentErrors={recentErrors} errorRate={errorRate} />

      {/* TOP SUMMARY METRICS */}
      <div className="p-4 rounded-xl border border-element-border space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h2 className="text-base font-semibold text-foreground font-mono flex items-center gap-2">
            <span>📊</span> Operational Summary Overview
          </h2>
          <span className="text-sm font-mono opacity-60">
            Last Updated: {lastRefreshed || "Fetching..."}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <MetricDisplay
            heading="Total Requests"
            value={Number(totalRequests).toLocaleString()}
          />
          <MetricDisplay
            heading="Unique Clients"
            value={Number(uniqueClients).toLocaleString()}
          />
          <MetricDisplay
            heading="Total Feeds"
            value={Number(totalFeeds).toLocaleString()}
          />
          <MetricDisplay
            heading="Total Posts"
            value={Number(totalPosts).toLocaleString()}
          />
          <MetricDisplay
            heading="Avg Latency"
            value={`${avgLatencyMs}ms`}
          />
          <MetricDisplay
            heading="Error Rate"
            value={errorRate}
          />
        </div>
      </div>

      {/* SYSTEM HEALTH & RUNTIME METADATA (Grid with JsonPayloadCard) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HealthRuntimeCard health={health} isHealthy={isHealthy} />
        <JsonPayloadCard
          title="Health Metadata Payload"
          icon="📦"
          data={health}
          emptyMessage="// No health telemetry received"
          minHeight="min-h-[100px]"
          maxHeight="max-h-[197px]"
        />
      </div>

      {/* DETAILED BREAKDOWNS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricBreakdownCard
          title="Requests Per Feed Channel"
          icon="📡"
          countLabel="Active Channels"
          data={feedList}
          totalRequests={Number(totalRequests)}
          itemColumnHeader="Channel / Feed Slug"
          valueColumnHeader="Hit Count"
          emptyMessage="No feed requests recorded in database yet"
        />

        <MetricBreakdownCard
          title="Requests Per Client / IP"
          icon="👥"
          countLabel="Identified Clients"
          data={clientList}
          totalRequests={Number(totalRequests)}
          itemColumnHeader="Client ID / Source"
          valueColumnHeader="Requests"
          emptyMessage="No client records captured yet"
          formatAsCode={true}
        />
      </div>

      {/* LIVE REQUEST TRACE SPANS */}
      <RecentSpansCard recentSpans={recentSpans} />
    </div>
  );
}