"use client";

import TitleSection from "../components/TitleSection";
import MetricDisplay from "../components/MetricDisplay";
import { useMetricsDashboard } from "./useMetricsDashboard";

export default function MetricsDashboardPage() {
  // Store the dashboard logic in a separate TS file
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
    feedList,
    clientList,
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
            Real-time health status, database metrics, feed distribution, and client traffic.
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

      {/* TOP SUMMARY METRICS */}
      <div className="p-5 rounded-xl border border-element-border space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h2 className="text-base font-semibold text-foreground font-mono flex items-center gap-2">
            <span>📊</span> Operational Summary Overview
          </h2>
          <span className="text-[12px] font-mono opacity-60">
            Last Updated: {lastRefreshed || "Fetching..."}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
        </div>
      </div>

      {/* SYSTEM HEALTH & METADATA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-xl border border-element-border bg-[var(--elementBg)] space-y-3">
          <h3 className="text-base font-mono font-bold opacity-90 uppercase tracking-wide flex items-center gap-2">
            <span>🩺</span> Health & Runtime (/api/health)
          </h3>
          <div className="p-3 rounded-lg bg-field-background border border-element-border border-l-4 border-l-purple-500 space-y-2 text-sm font-mono">
            <div className="flex justify-between items-center pb-2 border-b border-element-border">
              <span className="opacity-80">Server Status</span>
              <span
                className={`px-2 py-0.5 rounded text-[12px] font-bold text-white ${
                  isHealthy ? "bg-emerald-600" : "bg-rose-600"
                }`}
              >
                {health?.status ? String(health.status).toUpperCase() : "UNKNOWN"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-80">Database Persistence</span>
              <span className="text-foreground font-semibold">
                {typeof health?.database === "object"
                  ? health.database.status
                  : health?.database || "Connected"}
              </span>
            </div>
            {health?.uptime !== undefined && (
              <div className="flex justify-between items-center">
                <span className="opacity-80">Process Uptime</span>
                <span className="text-foreground">
                  {Math.floor(health.uptime / 60)}m {Math.floor(health.uptime % 60)}s
                </span>
              </div>
            )}
            {health?.version && (
              <div className="flex justify-between items-center">
                <span className="opacity-80">App Version</span>
                <span className="text-foreground">{health.version}</span>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2 p-5 rounded-xl border border-element-border bg-[var(--elementBg)] space-y-3">
          <h3 className="text-base font-mono font-bold opacity-90 uppercase tracking-wide flex items-center gap-2">
            <span>📦</span> Health Metadata Payload
          </h3>
          <pre className="p-3 rounded-lg bg-field-background border border-element-border border-l-4 border-l-purple-500 text-foreground font-mono text-xs max-h-36 overflow-auto whitespace-pre-wrap word-break-all">
            {health ? JSON.stringify(health, null, 2) : "// No health telemetry received"}
          </pre>
        </div>
      </div>

      {/* DETAILED BREAKDOWNS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests Per Feed Table */}
        <div className="p-5 rounded-xl border border-element-border bg-[var(--elementBg)] space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-mono font-bold opacity-90 uppercase tracking-wide flex items-center gap-2">
              <span>📡</span> Requests Per Feed Channel
            </h3>
            <span className="text-xs font-mono opacity-60">
              {feedList.length} Active Channels
            </span>
          </div>

          <div className="p-3 rounded-lg bg-field-background border border-element-border border-l-4 border-l-purple-500">
            {feedList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-mono">
                  <thead>
                    <tr className="border-b border-element-border opacity-70 text-xs uppercase">
                      <th className="pb-2">Channel / Feed Slug</th>
                      <th className="pb-2 text-right">Hit Count</th>
                      <th className="pb-2 text-right">Traffic Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-element-border">
                    {feedList.map((row) => {
                      const share =
                        totalRequests > 0
                          ? ((row.count / Number(totalRequests)) * 100).toFixed(1)
                          : "0.0";
                      return (
                        <tr key={row.label} className="hover:bg-background/40 transition-colors">
                          <td className="py-2.5 font-bold text-foreground truncate max-w-[180px]">
                            {row.label}
                          </td>
                          <td className="py-2.5 text-right text-foreground">{row.count}</td>
                          <td className="py-2.5 text-right opacity-80">{share}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-sm font-mono opacity-50 py-4 text-center">
                // No feed requests recorded in database yet
              </div>
            )}
          </div>
        </div>

        {/* Requests Per Client Table */}
        <div className="p-5 rounded-xl border border-element-border bg-[var(--elementBg)] space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-mono font-bold opacity-90 uppercase tracking-wide flex items-center gap-2">
              <span>👥</span> Requests Per Client / IP
            </h3>
            <span className="text-xs font-mono opacity-60">
              {clientList.length} Identified Clients
            </span>
          </div>

          <div className="p-3 rounded-lg bg-field-background border border-element-border border-l-4 border-l-purple-500">
            {clientList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-mono">
                  <thead>
                    <tr className="border-b border-element-border opacity-70 text-xs uppercase">
                      <th className="pb-2">Client ID / Source</th>
                      <th className="pb-2 text-right">Requests</th>
                      <th className="pb-2 text-right">Traffic Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-element-border">
                    {clientList.map((row) => {
                      const share =
                        totalRequests > 0
                          ? ((row.count / Number(totalRequests)) * 100).toFixed(1)
                          : "0.0";
                      return (
                        <tr key={row.label} className="hover:bg-background/40 transition-colors">
                          <td className="py-2.5 text-foreground truncate max-w-[180px]">
                            <code className="text-xs">{row.label}</code>
                          </td>
                          <td className="py-2.5 text-right font-bold text-foreground">{row.count}</td>
                          <td className="py-2.5 text-right opacity-80">{share}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-sm font-mono opacity-50 py-4 text-center">
                // No client records captured yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}