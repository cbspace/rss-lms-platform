// app/api/rss/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireChannel } from "@/lib/channels";
import { generateRssXml } from "@/lib/rss";
import { recordSpan, resetFeedWarning } from "@/lib/telemetry";

type RouteParams = {
  params: Promise<{ slug: string }>;
};

// Helper to extract client identifiers
function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "127.0.0.1";
}

// 1. GET: Read Channel (RSS XML or JSON)
export async function GET(request: NextRequest, { params }: RouteParams) {
  const startTime = Date.now();
  const clientIp = getClientIp(request);
  const traceId = request.headers.get("x-trace-id") || `tr_${Date.now()}`;
  let slug = "unknown";

  try {
    const resolvedParams = await params;
    slug = resolvedParams.slug;

    // Verify channel & fetch attached posts
    const result = await requireChannel(slug);

    if ("errorResponse" in result) {
      // 404 Telemetry Span
      await recordSpan({
        traceId,
        name: "GET /api/rss/[slug]",
        route: `/api/rss/${slug}`,
        method: "GET",
        statusCode: 404,
        durationMs: Date.now() - startTime,
        clientIp,
        feedSlug: slug,
        error: {
          type: "NOT_FOUND",
          message: `Channel '${slug}' was requested but does not exist.`,
        },
      });

      return result.errorResponse;
    }

    const { channel } = result;
    const postCount = channel.posts?.length || 0;

    // Warning detection for empty feeds
    const warningError =
      postCount === 0
        ? {
            type: "EMPTY_FEED" as const,
            message: `Channel '${slug}' exists but contains 0 posts.`,
          }
        : undefined;

    // Toggle between JSON metadata and RSS XML
    const acceptHeader = request.headers.get("accept") || "";
    const wantsJson =
      acceptHeader.includes("application/json") ||
      request.nextUrl.searchParams.has("json");

    if (wantsJson) {
      await recordSpan({
        traceId,
        name: "GET /api/rss/[slug] (JSON)",
        route: `/api/rss/${slug}`,
        method: "GET",
        statusCode: 200,
        durationMs: Date.now() - startTime,
        clientIp,
        feedSlug: slug,
        postCount,
        error: warningError,
      });

      return NextResponse.json(channel, { status: 200 });
    }

    // Generate XML
    const rssXml = generateRssXml(channel);

    await recordSpan({
      traceId,
      name: "GET /api/rss/[slug] (XML)",
      route: `/api/rss/${slug}`,
      method: "GET",
      statusCode: 200,
      durationMs: Date.now() - startTime,
      clientIp,
      feedSlug: slug,
      postCount,
      error: warningError,
    });

    return new NextResponse(rssXml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error: any) {
    console.error("GET /api/rss/[slug] Error:", error);

    await recordSpan({
      traceId,
      name: "GET /api/rss/[slug]",
      route: `/api/rss/${slug}`,
      method: "GET",
      statusCode: 500,
      durationMs: Date.now() - startTime,
      clientIp,
      feedSlug: slug,
      error: {
        type: "DB_ERROR",
        message: error?.message || "Internal Server Error fetching RSS feed.",
      },
    });

    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

// 2. POST: Create New Channel (or add existing Post IDs)
export async function POST(request: NextRequest, { params }: RouteParams) {
  const startTime = Date.now();
  const clientIp = getClientIp(request);
  const traceId = request.headers.get("x-trace-id") || `tr_${Date.now()}`;
  let slug = "unknown";

  try {
    const resolvedParams = await params;
    slug = resolvedParams.slug;
    const body = await request.json();
    const { name, description, postIds } = body;

    const newChannel = await prisma.channel.create({
      data: {
        slug,
        name: name || slug,
        description,
        ...(postIds && Array.isArray(postIds)
          ? {
              posts: {
                connect: postIds.map((id: string) => ({ id })),
              },
            }
          : {}),
      },
      include: { posts: true },
    });

    await recordSpan({
      traceId,
      name: "POST /api/rss/[slug]",
      route: `/api/rss/${slug}`,
      method: "POST",
      statusCode: 201,
      durationMs: Date.now() - startTime,
      clientIp,
      feedSlug: slug,
      postCount: newChannel.posts.length,
    });

    return NextResponse.json(newChannel, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/rss/[slug] Error:", error);

    await recordSpan({
      traceId,
      name: "POST /api/rss/[slug]",
      route: `/api/rss/${slug}`,
      method: "POST",
      statusCode: 400,
      durationMs: Date.now() - startTime,
      clientIp,
      feedSlug: slug,
      error: {
        type: "VALIDATION_ERROR",
        message: error?.message || "Failed to create Channel record.",
      },
    });

    return NextResponse.json(
      { error: "Failed to create Channel", details: error?.message || String(error) },
      { status: 400 }
    );
  }
}

// 3. PUT / PATCH: Update Channel Metadata
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const startTime = Date.now();
  const clientIp = getClientIp(request);
  const traceId = request.headers.get("x-trace-id") || `tr_${Date.now()}`;
  let slug = "unknown";

  try {
    const resolvedParams = await params;
    slug = resolvedParams.slug;

    const result = await requireChannel(slug);
    if ("errorResponse" in result) {
      await recordSpan({
        traceId,
        name: "PUT /api/rss/[slug]",
        route: `/api/rss/${slug}`,
        method: "PUT",
        statusCode: 404,
        durationMs: Date.now() - startTime,
        clientIp,
        feedSlug: slug,
        error: {
          type: "NOT_FOUND",
          message: `Attempted to update non-existent channel '${slug}'.`,
        },
      });

      return result.errorResponse;
    }

    const { channel } = result;
    const body = await request.json();
    const { name, description } = body;

    const updatedChannel = await prisma.channel.update({
      where: { id: channel.id },
      data: {
        name: name?.trim() || channel.name,
        description: description !== undefined ? description?.trim() : channel.description,
      },
      include: { posts: true },
    });

    await recordSpan({
      traceId,
      name: "PUT /api/rss/[slug]",
      route: `/api/rss/${slug}`,
      method: "PUT",
      statusCode: 200,
      durationMs: Date.now() - startTime,
      clientIp,
      feedSlug: slug,
      postCount: updatedChannel.posts.length,
    });

    return NextResponse.json(updatedChannel, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/rss/[slug] Error:", error);

    await recordSpan({
      traceId,
      name: "PUT /api/rss/[slug]",
      route: `/api/rss/${slug}`,
      method: "PUT",
      statusCode: 500,
      durationMs: Date.now() - startTime,
      clientIp,
      feedSlug: slug,
      error: {
        type: "DB_ERROR",
        message: error?.message || "Failed to update channel.",
      },
    });

    return NextResponse.json(
      { error: "Failed to update channel", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

// 4. DELETE: Delete Entire Channel & Purge Associated Warnings
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const startTime = Date.now();
  let slug = "unknown";

  try {
    const resolvedParams = await params;
    slug = resolvedParams.slug;

    const result = await requireChannel(slug);
    if ("errorResponse" in result) {
      await recordSpan({
        req: request,
        name: "DELETE /api/rss/[slug]",
        route: `/api/rss/${slug}`,
        method: "DELETE",
        statusCode: 404,
        durationMs: Date.now() - startTime,
        feedSlug: slug,
        error: {
          type: "NOT_FOUND",
          message: `Attempted to delete non-existent channel '${slug}'.`,
        },
      });

      return result.errorResponse;
    }

    const { channel } = result;

    // 1. Purge all past warning/incident records associated with this feed slug
    await prisma.telemetrySpan.deleteMany({
      where: {
        feedSlug: slug,
        errorType: "EMPTY_FEED", // Or remove `errorType: "EMPTY_FEED"` to delete all spans for this channel
      },
    });

    // 2. Clear in-memory deduplication set
    resetFeedWarning(slug);

    // 3. Delete the channel record
    await prisma.channel.delete({
      where: { id: channel.id },
    });

    // 4. Record successful deletion span
    await recordSpan({
      req: request,
      name: "DELETE /api/rss/[slug]",
      route: `/api/rss/${slug}`,
      method: "DELETE",
      statusCode: 200,
      durationMs: Date.now() - startTime,
      feedSlug: slug,
    });

    return NextResponse.json(
      { message: `Channel '${slug}' and associated telemetry warnings deleted successfully` },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE /api/rss/[slug] Error:", error);

    await recordSpan({
      req: request,
      name: "DELETE /api/rss/[slug]",
      route: `/api/rss/${slug}`,
      method: "DELETE",
      statusCode: 500,
      durationMs: Date.now() - startTime,
      feedSlug: slug,
      error: {
        type: "DB_ERROR",
        message: error?.message || "Failed to delete channel.",
      },
    });

    return NextResponse.json(
      { error: "Failed to delete channel", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}