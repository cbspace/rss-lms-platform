// api/lib/telemetry.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export interface SpanError {
  type: "NOT_FOUND" | "EMPTY_FEED" | "PARSE_ERROR" | "DB_ERROR" | "VALIDATION_ERROR" | string;
  message: string;
}

export interface RecordSpanInput {
  req?: NextRequest | Request;
  traceId?: string;
  clientIp?: string;
  name: string; // e.g. "GET /api/rss/[slug]"
  route: string;
  method: string;
  statusCode: number;
  durationMs: number;
  feedSlug?: string;
  postCount?: number;
  error?: SpanError;
}

// In-memory cache to ensure EMPTY_FEED warnings are only recorded once per channel
const warnedEmptyFeeds = new Set<string>();

/**
 * Resets the warning latch for a given channel slug (e.g. when posts are added/deleted).
 */
export function resetFeedWarning(feedSlug: string) {
  warnedEmptyFeeds.delete(feedSlug);
}

/**
 * Extracts the client IP address from proxy headers or falls back to localhost.
 */
export function getClientIp(req: NextRequest | Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "127.0.0.1";
}

/**
 * Extracts an existing trace ID from request headers or generates a unique fallback.
 */
export function getTraceId(req: NextRequest | Request): string {
  return (
    req.headers.get("x-trace-id") ||
    `tr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
  );
}

/**
 * Records an execution trace span directly into the PostgreSQL database.
 * Deduplicates EMPTY_FEED warnings so each feed channel only generates one warning record.
 */
export async function recordSpan(input: RecordSpanInput) {
  const clientIp =
    input.clientIp || (input.req ? getClientIp(input.req) : "127.0.0.1");
  const traceId =
    input.traceId || (input.req ? getTraceId(input.req) : `tr_${Date.now()}`);

  let errorType = input.error?.type;
  let errorMessage = input.error?.message;

  // Deduplicate EMPTY_FEED warnings per channel
  if (errorType === "EMPTY_FEED" && input.feedSlug) {
    if (warnedEmptyFeeds.has(input.feedSlug)) {
      // Already logged this warning previously: record the span as a normal request
      errorType = undefined;
      errorMessage = undefined;
    } else {
      // Mark as warned for subsequent requests
      warnedEmptyFeeds.add(input.feedSlug);
    }
  }

  try {
    return await prisma.telemetrySpan.create({
      data: {
        traceId,
        name: input.name,
        route: input.route,
        method: input.method,
        statusCode: input.statusCode,
        durationMs: input.durationMs,
        clientIp,
        feedSlug: input.feedSlug,
        postCount: input.postCount,
        errorType,
        errorMessage,
      },
    });
  } catch (err) {
    // Prevent telemetry persistence failure from breaking the request response cycle
    console.error("Failed to persist telemetry span to database:", err);
    return null;
  }
}

/**
 * Aggregates observability metrics, client totals, breakdowns,
 * and live recent spans directly from the database for /api/count.
 */
export async function getTelemetryAggregates() {
  try {
    const [
      totalRequests,
      feedGroups,
      clientGroups,
      recentSpans,
      recentErrors,
      errorCount,
      avgDuration,
    ] = await Promise.all([
      // 1. Total requests
      prisma.telemetrySpan.count().catch(() => 0),

      // 2. Requests grouped per feed
      prisma.telemetrySpan
        .groupBy({
          by: ["feedSlug"],
          where: { feedSlug: { not: null } },
          _count: { _all: true },
        })
        .catch(() => []),

      // 3. Unique client IPs
      prisma.telemetrySpan
        .groupBy({
          by: ["clientIp"],
          _count: { _all: true },
        })
        .catch(() => []),

      // 4. Latest 10 live spans
      prisma.telemetrySpan
        .findMany({
          take: 10,
          orderBy: { timestamp: "desc" },
        })
        .catch(() => []),

      // 5. Latest 5 errors or operational warnings (shown in dashboard feed)
      prisma.telemetrySpan
        .findMany({
          where: {
            OR: [{ statusCode: { gte: 400 } }, { errorType: { not: null } }],
          },
          take: 5,
          orderBy: { timestamp: "desc" },
        })
        .catch(() => []),

      // 6. Genuine error count (HTTP 4xx/5xx or database/parsing errors; excludes EMPTY_FEED warnings)
      prisma.telemetrySpan
        .count({
          where: {
            OR: [
              { statusCode: { gte: 400 } },
              {
                AND: [
                  { errorType: { not: null } },
                  { errorType: { not: "EMPTY_FEED" } },
                ],
              },
            ],
          },
        })
        .catch(() => 0),

      // 7. Average execution duration
      prisma.telemetrySpan
        .aggregate({
          _avg: { durationMs: true },
        })
        .catch(() => ({ _avg: { durationMs: null } })),
    ]);

    const requestsPerFeed = (feedGroups || []).reduce(
      (acc: Record<string, number>, curr) => {
        if (curr?.feedSlug) acc[curr.feedSlug] = curr._count?._all ?? 0;
        return acc;
      },
      {}
    );

    const requestsPerClient = (clientGroups || []).reduce(
      (acc: Record<string, number>, curr) => {
        if (curr?.clientIp) acc[curr.clientIp] = curr._count?._all ?? 0;
        return acc;
      },
      {}
    );

    const count = totalRequests ?? 0;
    const errors = errorCount ?? 0;
    const errorRate = count > 0 ? ((errors / count) * 100).toFixed(1) : "0.0";
    const avgLatency = Math.round(avgDuration?._avg?.durationMs || 0);

    return {
      summary: {
        totalRequests: count,
        uniqueClientsCount: (clientGroups || []).length,
        errorRate: `${errorRate}%`,
        avgLatencyMs: avgLatency,
        totalErrors: errors,
      },
      requestsPerFeed,
      requestsPerClient,
      recentSpans: recentSpans || [],
      recentErrors: recentErrors || [],
    };
  } catch (err) {
    console.error("Error in getTelemetryAggregates:", err);
    return {
      summary: {
        totalRequests: 0,
        uniqueClientsCount: 0,
        errorRate: "0.0%",
        avgLatencyMs: 0,
        totalErrors: 0,
      },
      requestsPerFeed: {},
      requestsPerClient: {},
      recentSpans: [],
      recentErrors: [],
    };
  }
}