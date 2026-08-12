// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logRequest } from "@/lib/metrics";

// ==========================================
// 1. GET: Fetch All Posts (Ordered by newest)
// ==========================================
export async function GET(request: NextRequest) {
  try {
    await logRequest(request, "all-posts");

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

    return NextResponse.json(posts, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/posts Error:", error);
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
  try {
    const body = await request.json();
    const { title, author, summary, content, imageUrl, channelSlugs } = body;

    // Basic Validation
    if (!title?.trim() || !content?.trim()) {
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

    await logRequest(request, validSlugs[0] || "uncategorized");

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

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/posts Error:", error);

    // Specific Prisma error handling for invalid channel relation
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "One or more provided channelSlugs do not exist in the database." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create post", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}