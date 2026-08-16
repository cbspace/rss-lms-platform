// app/dashboard/useMetricsDashboard.ts
"use client";

import { useState, useEffect, useCallback } from "react";

export interface HealthData {
  status: string;
  version?: string;
  environment?: string;
  commitSha?: string;
  uptime?: number;
  timestamp?: string;
  database?: {
    status: string;
    latencyMs?: number;
    error?: string;
  };
  system?: {
    nodeVersion?: string;
    platform?: string;
    heapUsedMb?: number;
    rssMb?: number;
  };
  [key: string]: any;
}

export interface SpanError {
  type: "NOT_FOUND" | "EMPTY_FEED" | "PARSE_ERROR" | "DB_ERROR" | "VALIDATION_ERROR" | string;
  message: string;
}

export interface SpanRecord {
  id: string;
  traceId: string;
  name: string;
  route: string;
  method: string;
  statusCode: number;
  durationMs: number;
  clientIp: string;
  feedSlug?: string | null;
  postCount?: number | null;
  errorType?: string | null;
  errorMessage?: string | null;
  error?: {
    type?: string;
    message?: string;
  };
  timestamp: string;
}

export interface CountData {
  metrics?: {
    totalRequests?: number;
    uniqueClientsCount?: number;
    totalFeeds?: number;
    totalPosts?: number;
    errorRate?: string;
    avgLatencyMs?: number;
    requestsPerFeed?: Record<string, number> | any[];
    requestsPerClient?: Record<string, number> | any[];
  };
  summary?: {
    totalRequests?: number;
    uniqueClientsCount?: number;
    totalFeeds?: number;
    totalPosts?: number;
    errorRate?: string;
    avgLatencyMs?: number;
  };
  recentSpans?: SpanRecord[];
  recentErrors?: SpanRecord[];
  feeds?: any;
  clients?: any;
  [key: string]: any;
}

export interface MetricRow {
  label: string;
  count: number;
}

function normalizeMetricsList(rawData: any, keyField: string = "feed"): MetricRow[] {
  if (!rawData) return [];

  if (Array.isArray(rawData)) {
    return rawData
      .map((item) => {
        if (typeof item === "object" && item !== null) {
          const label =
            item[keyField] ||
            item.slug ||
            item.clientId ||
            item.client ||
            item.ip ||
            "unknown";
          const count = Number(item.count ?? item.requestCount ?? item.requests ?? 0);
          return { label: String(label), count };
        }
        return null;
      })
      .filter((item): item is MetricRow => item !== null);
  }

  if (typeof rawData === "object") {
    return Object.entries(rawData).map(([key, val]) => {
      if (typeof val === "object" && val !== null) {
        const innerVal = (val as any).count ?? (val as any).requestCount ?? 0;
        return { label: key, count: Number(innerVal) };
      }
      return { label: key, count: Number(val) };
    });
  }

  return [];
}

export function useMetricsDashboard() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string>("");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const [health, setHealth] = useState<HealthData | null>(null);
  const [counts, setCounts] = useState<CountData | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setError(null);
      const [healthRes, countRes] = await Promise.all([
        fetch("/api/health"),
        fetch("/api/count"),
      ]);

      if (healthRes.ok) {
        const healthJson = await healthRes.json();
        setHealth(healthJson);
      }

      if (countRes.ok) {
        const countJson = await countRes.json();
        setCounts(countJson);
      }

      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Failed to load telemetry data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    fetchDashboardData();

    if (!autoRefresh) return;
    const interval = setInterval(fetchDashboardData, 3000);
    return () => clearInterval(interval);
  }, [autoRefresh, mounted, fetchDashboardData]);

  // Aggregate values
  const totalRequests =
    counts?.metrics?.totalRequests ?? counts?.summary?.totalRequests ?? 0;
  const uniqueClients =
    counts?.metrics?.uniqueClientsCount ?? counts?.summary?.uniqueClientsCount ?? 0;
  const totalFeeds =
    counts?.metrics?.totalFeeds ?? counts?.summary?.totalFeeds ?? 0;
  const totalPosts =
    counts?.metrics?.totalPosts ?? counts?.summary?.totalPosts ?? 0;
  const errorRate =
    counts?.metrics?.errorRate ?? counts?.summary?.errorRate ?? "0.0%";
  const avgLatencyMs =
    counts?.metrics?.avgLatencyMs ?? counts?.summary?.avgLatencyMs ?? 0;

  // Breakdown tables
  const feedList = normalizeMetricsList(
    counts?.metrics?.requestsPerFeed ?? counts?.feeds,
    "feed"
  );

  const clientList = normalizeMetricsList(
    counts?.metrics?.requestsPerClient ?? counts?.clients,
    "clientId"
  );

  // Spans and diagnostics
  const recentSpans: SpanRecord[] = counts?.recentSpans ?? [];
  const recentErrors: SpanRecord[] = counts?.recentErrors ?? [];

  const isHealthy =
    health?.status === "ok" || health?.status === "healthy" || health?.status === "UP";

  return {
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
  };
}