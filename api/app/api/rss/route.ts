// app/api/rss/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/app/generated/prisma/client/client";
import { recordSpan } from "@/lib/telemetry";

// ==========================================
// 1. GET: List all channels with post counts
// ==========================================
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const channels = await prisma.channel.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { posts: true } },
      },
    });

    await recordSpan({
      req: request,
      name: "GET /api/rss",
      route: "/api/rss",
      method: "GET",
      statusCode: 200,
      durationMs: Date.now() - startTime,
      postCount: channels.reduce((acc, c) => acc + c._count.posts, 0),
    });

    return NextResponse.json(channels, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/rss Error:", error);

    await recordSpan({
      req: request,
      name: "GET /api/rss",
      route: "/api/rss",
      method: "GET",
      statusCode: 500,
      durationMs: Date.now() - startTime,
      error: {
        type: "DB_ERROR",
        message: error?.message || "Failed to fetch channel list.",
      },
    });

    return NextResponse.json(
      { error: "Failed to fetch channels", details: error?.message },
      { status: 500 }
    );
  }
}

// ==========================================
// 2. POST: Create a new channel
// ==========================================
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let rawSlug: string | undefined;

  try {
    const body = await request.json();
    const { slug, name, description } = body;
    rawSlug = slug;

    const trimmedSlug = slug?.trim().toLowerCase();
    const trimmedName = name?.trim();

    if (!trimmedSlug || !trimmedName) {
      await recordSpan({
        req: request,
        name: "POST /api/rss",
        route: "/api/rss",
        method: "POST",
        statusCode: 400,
        durationMs: Date.now() - startTime,
        feedSlug: trimmedSlug || undefined,
        error: {
          type: "VALIDATION_ERROR",
          message: "Slug and name are required fields.",
        },
      });

      return NextResponse.json(
        { error: "Slug and name are required" },
        { status: 400 }
      );
    }

    const channel = await prisma.channel.create({
      data: {
        slug: trimmedSlug,
        name: trimmedName,
        description: description?.trim() || "",
      },
    });

    await recordSpan({
      req: request,
      name: "POST /api/rss",
      route: "/api/rss",
      method: "POST",
      statusCode: 201,
      durationMs: Date.now() - startTime,
      feedSlug: channel.slug,
      postCount: 0,
    });

    return NextResponse.json(channel, { status: 201 });
  } catch (error: any) {
    // Catch Prisma Unique Constraint Violation (P2002)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const targetFields = (error.meta?.target as string[]) || [];

      let userMessage = "A channel with this identifier already exists.";
      if (targetFields.includes("slug")) {
        userMessage = "A channel with this slug already exists. Please enter a unique slug.";
      } else if (targetFields.includes("name")) {
        userMessage = "A channel with this name already exists. Please choose a different name.";
      }

      await recordSpan({
        req: request,
        name: "POST /api/rss",
        route: "/api/rss",
        method: "POST",
        statusCode: 409,
        durationMs: Date.now() - startTime,
        feedSlug: rawSlug,
        error: {
          type: "VALIDATION_ERROR",
          message: userMessage,
        },
      });

      return NextResponse.json(
        { error: userMessage, field: targetFields[0] },
        { status: 409 }
      );
    }

    console.error("POST /api/rss Error:", error);

    await recordSpan({
      req: request,
      name: "POST /api/rss",
      route: "/api/rss",
      method: "POST",
      statusCode: 500,
      durationMs: Date.now() - startTime,
      feedSlug: rawSlug,
      error: {
        type: "DB_ERROR",
        message: error?.message || "Failed to create channel.",
      },
    });

    return NextResponse.json(
      { error: "Failed to create channel", details: error?.message },
      { status: 500 }
    );
  }
}