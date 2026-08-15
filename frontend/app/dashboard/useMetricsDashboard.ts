"use client";

import { useState, useEffect, useCallback } from "react";

export interface HealthData {
  status: string;
  uptime?: number;
  timestamp?: string;
  database?: string | { status: string; latencyMs?: number };
  version?: string;
  [key: string]: any;
}

export interface CountData {
  metrics?: any;
  summary?: any;
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

  const totalRequests =
    counts?.metrics?.totalRequests ?? counts?.summary?.totalRequests ?? 0;
  const uniqueClients =
    counts?.metrics?.uniqueClientsCount ?? counts?.summary?.uniqueClientsCount ?? 0;
  const totalFeeds =
    counts?.metrics?.totalFeeds ?? counts?.summary?.totalFeeds ?? 0;
  const totalPosts =
    counts?.metrics?.totalPosts ?? counts?.summary?.totalPosts ?? 0;

  const feedList = normalizeMetricsList(
    counts?.metrics?.requestsPerFeed ?? counts?.feeds,
    "feed"
  );

  const clientList = normalizeMetricsList(
    counts?.metrics?.requestsPerClient ?? counts?.clients,
    "clientId"
  );

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
    feedList,
    clientList,
    isHealthy,
    fetchDashboardData,
  };
}