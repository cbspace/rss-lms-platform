import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
  try {
    const { id: identifier } = await params;
    const post = await findPostByIdentifier(identifier);

    if (!post) {
      return NextResponse.json(
        { error: `Post '${identifier}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/posts/[id] Error:", error);
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
  try {
    const { id: identifier } = await params;
    const existingPost = await findPostByIdentifier(identifier);

    if (!existingPost) {
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

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/posts/[id] Error:", error);
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
  try {
    const { id: identifier } = await params;
    const existingPost = await findPostByIdentifier(identifier);

    if (!existingPost) {
      return NextResponse.json(
        { error: `Post '${identifier}' not found` },
        { status: 404 }
      );
    }

    await prisma.post.delete({
      where: { id: existingPost.id },
    });

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE /api/posts/[id] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete post", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}