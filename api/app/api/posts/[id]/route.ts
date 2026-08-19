// app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordSpan, resetFeedWarning } from "@/lib/telemetry";

type RouteParams = {
  params: Promise<{ id: string }>;
};

/**
 * Shared helper to resolve a post by post-#, numeric postNumber, or GUID.
 */
async function findPostByIdentifier(identifier: string) {
  const cleanNumberStr = identifier.replace(/^(post-|\#)/i, "");
  const numericId = parseInt(cleanNumberStr, 10);
  const isNumeric = !isNaN(numericId);

  return prisma.post.findFirst({
    where: {
      OR: [
        ...(isNumeric ? [{ postNumber: numericId }] : []),
        { id: identifier },
        { id: `post-${cleanNumberStr}` },
      ],
    },
    include: {
      channels: {
        select: {
          id: true,
          slug: true,
          name: true,
        },
      },
    },
  });
}

// ----------------------------------------------------------------------
// 1. GET: Fetch single post
// ----------------------------------------------------------------------
export async function GET(request: NextRequest, { params }: RouteParams) {
  const startTime = Date.now();
  let identifier = "unknown";

  try {
    const resolvedParams = await params;
    identifier = resolvedParams.id;
    const post = await findPostByIdentifier(identifier);

    if (!post) {
      await recordSpan({
        req: request,
        name: "GET /api/posts/[id]",
        route: `/api/posts/${identifier}`,
        method: "GET",
        statusCode: 404,
        durationMs: Date.now() - startTime,
        error: {
          type: "NOT_FOUND",
          message: `Post '${identifier}' does not exist.`,
        },
      });

      return NextResponse.json(
        { error: `Post '${identifier}' not found` },
        { status: 404 }
      );
    }

    await recordSpan({
      req: request,
      name: "GET /api/posts/[id]",
      route: `/api/posts/${identifier}`,
      method: "GET",
      statusCode: 200,
      durationMs: Date.now() - startTime,
      feedSlug: post.channels[0]?.slug,
      postCount: 1,
    });

    return NextResponse.json(post, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/posts/[id] Error:", error);

    await recordSpan({
      req: request,
      name: "GET /api/posts/[id]",
      route: `/api/posts/${identifier}`,
      method: "GET",
      statusCode: 500,
      durationMs: Date.now() - startTime,
      error: {
        type: "DB_ERROR",
        message: error?.message || "Failed to fetch post.",
      },
    });

    return NextResponse.json(
      { error: "Failed to fetch post", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------------------------
// 2. PUT: Update a post and sync channel relationships
// ----------------------------------------------------------------------
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const startTime = Date.now();
  let identifier = "unknown";

  try {
    const resolvedParams = await params;
    identifier = resolvedParams.id;
    const existingPost = await findPostByIdentifier(identifier);

    if (!existingPost) {
      await recordSpan({
        req: request,
        name: "PUT /api/posts/[id]",
        route: `/api/posts/${identifier}`,
        method: "PUT",
        statusCode: 404,
        durationMs: Date.now() - startTime,
        error: {
          type: "NOT_FOUND",
          message: `Attempted to update non-existent post '${identifier}'.`,
        },
      });

      return NextResponse.json(
        { error: `Post '${identifier}' not found` },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, author, summary, content, imageUrl, channelSlugs } = body;

    // 1. Resolve actual Channel records by matching either id or slug
    const targetSlugsOrIds: string[] = Array.isArray(channelSlugs) ? channelSlugs : [];
    
    const matchedChannels = await prisma.channel.findMany({
      where: {
        OR: [
          { slug: { in: targetSlugsOrIds } },
          { id: { in: targetSlugsOrIds } },
        ],
      },
      select: { id: true },
    });

    // 2. Perform the update with valid channel IDs
    const updatedPost = await prisma.post.update({
      where: { id: existingPost.id },
      data: {
        title: title?.trim() || existingPost.title,
        author: author?.trim() || existingPost.author,
        summary: summary?.trim() || existingPost.summary,
        content: content?.trim() || summary?.trim() || existingPost.content,
        imageUrl: imageUrl?.trim() ? imageUrl.trim() : existingPost.imageUrl,
        channels: {
          set: [], // Clear existing relations
          connect: matchedChannels.map((ch) => ({ id: ch.id })), // Connect by verified ID
        },
      },
      include: {
        channels: {
          select: {
            id: true,
            slug: true,
            name: true,
          },
        },
      },
    });

    // 3. Purge EMPTY_FEED warnings for newly linked/active channels
    const connectedSlugs = updatedPost.channels
      .map((ch) => ch.slug)
      .filter(Boolean);

    if (connectedSlugs.length > 0) {
      await prisma.telemetrySpan.deleteMany({
        where: {
          feedSlug: { in: connectedSlugs },
          errorType: "EMPTY_FEED",
        },
      });

      connectedSlugs.forEach((slug) => resetFeedWarning(slug));
    }

    await recordSpan({
      req: request,
      name: "PUT /api/posts/[id]",
      route: `/api/posts/${identifier}`,
      method: "PUT",
      statusCode: 200,
      durationMs: Date.now() - startTime,
      feedSlug: updatedPost.channels[0]?.slug,
      postCount: 1,
    });

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/posts/[id] Error:", error);

    await recordSpan({
      req: request,
      name: "PUT /api/posts/[id]",
      route: `/api/posts/${identifier}`,
      method: "PUT",
      statusCode: 500,
      durationMs: Date.now() - startTime,
      error: {
        type: "DB_ERROR",
        message: error?.message || "Failed to update post.",
      },
    });

    return NextResponse.json(
      { error: "Failed to update post", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------------------------
// 3. DELETE: Remove a post
// ----------------------------------------------------------------------
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const startTime = Date.now();
  let identifier = "unknown";

  try {
    const resolvedParams = await params;
    identifier = resolvedParams.id;
    const existingPost = await findPostByIdentifier(identifier);

    if (!existingPost) {
      await recordSpan({
        req: request,
        name: "DELETE /api/posts/[id]",
        route: `/api/posts/${identifier}`,
        method: "DELETE",
        statusCode: 404,
        durationMs: Date.now() - startTime,
        error: {
          type: "NOT_FOUND",
          message: `Attempted to delete non-existent post '${identifier}'.`,
        },
      });

      return NextResponse.json(
        { error: `Post '${identifier}' not found` },
        { status: 404 }
      );
    }

    await prisma.post.delete({
      where: { id: existingPost.id },
    });

    await recordSpan({
      req: request,
      name: "DELETE /api/posts/[id]",
      route: `/api/posts/${identifier}`,
      method: "DELETE",
      statusCode: 200,
      durationMs: Date.now() - startTime,
      feedSlug: existingPost.channels[0]?.slug,
    });

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE /api/posts/[id] Error:", error);

    await recordSpan({
      req: request,
      name: "DELETE /api/posts/[id]",
      route: `/api/posts/${identifier}`,
      method: "DELETE",
      statusCode: 500,
      durationMs: Date.now() - startTime,
      error: {
        type: "DB_ERROR",
        message: error?.message || "Failed to delete post.",
      },
    });

    return NextResponse.json(
      { error: "Failed to delete post", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}