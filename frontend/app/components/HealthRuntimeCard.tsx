// app/components/HealthRuntimeCard.tsx
"use client";

import { HealthData } from "../dashboard/useMetricsDashboard";

interface HealthRuntimeCardProps {
  health: HealthData | null;
  isHealthy: boolean;
}

export default function HealthRuntimeCard({ health, isHealthy }: HealthRuntimeCardProps) {
  return (
    <div className="p-4 rounded-xl border border-element-border space-y-3 font-mono">
      <h3 className="text-base font-bold opacity-90 uppercase tracking-wide flex items-center gap-2">
        <span>🩺</span> Health & Runtime (/api/health)
      </h3>
      <div className="p-3 rounded-lg bg-field-background border border-element-border border-l-4 border-l-purple-500 space-y-2 text-sm">
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
          <span className="opacity-80">App Version</span>
          <span className="text-foreground font-semibold">
            v{health?.version || "1.0.0"}{" "}
          </span>
        </div>

        {health?.environment && (
          <div className="flex justify-between items-center">
            <span className="opacity-80">Environment</span>
            <code className="text-foreground font-semibold">
              {health.environment}
            </code>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="opacity-80">Database DB</span>
          <span className="text-foreground font-semibold">
            {health?.database?.status === "connected"
              ? `Connected (${health.database.latencyMs ?? 0}ms)`
              : health?.database?.status || "Connected"}
          </span>
        </div>

        {health?.uptime !== undefined && (
          <div className="flex justify-between items-center">
            <span className="opacity-80">Uptime</span>
            <span className="text-foreground font-semibold">
              {Math.floor(health.uptime / 60)}m {Math.floor(health.uptime % 60)}s
            </span>
          </div>
        )}

        {health?.system?.nodeVersion && (
          <div className="flex justify-between items-center">
            <span className="opacity-80">Node Runtime</span>
            <span className="text-foreground font-semibold">{health.system.nodeVersion}</span>
          </div>
        )}

        {health?.system?.heapUsedMb && (
          <div className="flex justify-between items-center">
            <span className="opacity-80">Memory Heap</span>
            <span className="text-foreground font-semibold">{health.system.heapUsedMb} MB</span>
          </div>
        )}
      </div>
    </div>
  );
}