// api/app/api/count/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTelemetryAggregates } from "@/lib/telemetry";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [telemetry, totalFeeds, totalPosts] = await Promise.all([
      getTelemetryAggregates(),
      prisma.channel.count().catch(() => 0),
      prisma.post.count().catch(() => 0),
    ]);

    const summary = telemetry?.summary ?? {
      totalRequests: 0,
      uniqueClientsCount: 0,
      errorRate: "0.0%",
      avgLatencyMs: 0,
      totalErrors: 0,
    };

    return NextResponse.json({
      metrics: {
        totalRequests: summary.totalRequests,
        uniqueClientsCount: summary.uniqueClientsCount,
        totalFeeds: totalFeeds ?? 0,
        totalPosts: totalPosts ?? 0,
        errorRate: summary.errorRate,
        avgLatencyMs: summary.avgLatencyMs,
        requestsPerFeed: telemetry?.requestsPerFeed ?? {},
        requestsPerClient: telemetry?.requestsPerClient ?? {},
      },
      summary: {
        totalRequests: summary.totalRequests,
        uniqueClientsCount: summary.uniqueClientsCount,
        totalFeeds: totalFeeds ?? 0,
        totalPosts: totalPosts ?? 0,
        errorRate: summary.errorRate,
        avgLatencyMs: summary.avgLatencyMs,
      },
      recentSpans: telemetry?.recentSpans ?? [],
      recentErrors: telemetry?.recentErrors ?? [],
    });
  } catch (error: any) {
    console.error("GET /api/count Error:", error);
    return NextResponse.json(
      { error: "Failed to load metrics", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}