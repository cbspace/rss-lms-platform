// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordSpan, resetFeedWarning } from "@/lib/telemetry";

// ==========================================
// 1. GET: Fetch All Posts (Ordered by newest)
// ==========================================
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const posts = await prisma.post.findMany({
      orderBy: { date: "desc" },
      include: {
        channels: {
          select: {
            slug: true,
            name: true,
          },
        },
      },
    });

    await recordSpan({
      req: request,
      name: "GET /api/posts",
      route: "/api/posts",
      method: "GET",
      statusCode: 200,
      durationMs: Date.now() - startTime,
      postCount: posts.length,
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/posts Error:", error);

    await recordSpan({
      req: request,
      name: "GET /api/posts",
      route: "/api/posts",
      method: "GET",
      statusCode: 500,
      durationMs: Date.now() - startTime,
      error: {
        type: "DB_ERROR",
        message: error?.message || "Failed to fetch posts list.",
      },
    });

    return NextResponse.json(
      { error: "Failed to fetch posts", details: error?.message },
      { status: 500 }
    );
  }
}

// ==========================================
// 2. POST: Create New Post & Link Channels
// ==========================================
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { title, author, summary, content, imageUrl, channelSlugs } = body;

    // Basic Validation
    if (!title?.trim() || !content?.trim()) {
      await recordSpan({
        req: request,
        name: "POST /api/posts",
        route: "/api/posts",
        method: "POST",
        statusCode: 400,
        durationMs: Date.now() - startTime,
        error: {
          type: "VALIDATION_ERROR",
          message: "Title and content are required fields.",
        },
      });

      return NextResponse.json(
        { error: "Title and content are required fields." },
        { status: 400 }
      );
    }

    // Sanitize channel slugs
    const rawSlugs: string[] = Array.isArray(channelSlugs) ? channelSlugs : [];
    const validSlugs = rawSlugs
      .map((s) => (typeof s === "string" ? s.trim() : ""))
      .filter(Boolean);

    const targetFeed = validSlugs[0] || undefined;

    const newPost = await prisma.post.create({
      data: {
        title: title.trim(),
        author: author?.trim() || "Anonymous",
        summary: summary?.trim() || title.trim(),
        content: content.trim(),
        imageUrl: imageUrl?.trim() || null,
        ...(validSlugs.length > 0
          ? {
              channels: {
                connect: validSlugs.map((slug: string) => ({ slug })),
              },
            }
          : {}),
      },
      include: {
        channels: {
          select: { slug: true, name: true },
        },
      },
    });

    // If post is attached to channels, purge the EMPTY_FEED warnings
    if (validSlugs.length > 0) {
      // 1. Remove past EMPTY_FEED warning spans from DB for these channels
      await prisma.telemetrySpan.deleteMany({
        where: {
          feedSlug: { in: validSlugs },
          errorType: "EMPTY_FEED",
        },
      });

      // 2. Clear the in-memory cache for each slug
      validSlugs.forEach((slug) => resetFeedWarning(slug));
    }

    await recordSpan({
      req: request,
      name: "POST /api/posts",
      route: "/api/posts",
      method: "POST",
      statusCode: 201,
      durationMs: Date.now() - startTime,
      feedSlug: targetFeed,
      postCount: 1,
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/posts Error:", error);

    // Prisma specific error: missing related foreign entity
    if (error.code === "P2025") {
      await recordSpan({
        req: request,
        name: "POST /api/posts",
        route: "/api/posts",
        method: "POST",
        statusCode: 400,
        durationMs: Date.now() - startTime,
        error: {
          type: "NOT_FOUND",
          message: "One or more provided channelSlugs do not exist in the database.",
        },
      });

      return NextResponse.json(
        { error: "One or more provided channelSlugs do not exist in the database." },
        { status: 400 }
      );
    }

    await recordSpan({
      req: request,
      name: "POST /api/posts",
      route: "/api/posts",
      method: "POST",
      statusCode: 500,
      durationMs: Date.now() - startTime,
      error: {
        type: "DB_ERROR",
        message: error?.message || "Failed to create post.",
      },
    });

    return NextResponse.json(
      { error: "Failed to create post", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}