// app/api/rss/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireChannel } from "@/lib/channels";
import { generateRssXml } from "@/lib/rss";
import { logRequest } from "@/lib/metrics";

type RouteParams = {
  params: Promise<{ slug: string }>;
};

// 1. GET: Read Channel (RSS XML or JSON)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    // Verify channel & fetch attached posts
    const result = await requireChannel(slug);
    if ("errorResponse" in result) return result.errorResponse;

    const { channel } = result;

    // Toggle between JSON metadata and RSS XML
    const acceptHeader = request.headers.get("accept") || "";
    const wantsJson =
      acceptHeader.includes("application/json") ||
      request.nextUrl.searchParams.has("json");

    if (wantsJson) {
      return NextResponse.json(channel, { status: 200 });
    }

    // Generate XML using our isolated helper
    const rssXml = generateRssXml(channel);

    await logRequest(request, slug);

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
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

// 2. POST: Create New Channel (or add existing Post IDs)
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { name, description, postIds } = body;
    await logRequest(request, slug);

    // Create channel and optionally connect existing posts by ID
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

    return NextResponse.json(newChannel, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/rss/[slug] Error:", error);
    return NextResponse.json(
      { error: "Failed to create Channel", details: error?.message || String(error) },
      { status: 400 }
    );
  }
}

// 3. PUT / PATCH: Update Channel Metadata
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    // Verify channel exists
    const result = await requireChannel(slug);
    if ("errorResponse" in result) return result.errorResponse;

    const { channel } = result;
    const body = await request.json();
    const { name, description } = body;

    // Update channel record
    const updatedChannel = await prisma.channel.update({
      where: { id: channel.id },
      data: {
        name: name?.trim() || channel.name,
        description: description !== undefined ? description?.trim() : channel.description,
      },
      include: { posts: true },
    });

    return NextResponse.json(updatedChannel, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/rss/[slug] Error:", error);
    return NextResponse.json(
      { error: "Failed to update channel", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

// 4. DELETE: Delete Entire Channel
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    // Verify channel exists
    const result = await requireChannel(slug);
    if ("errorResponse" in result) return result.errorResponse;

    const { channel } = result;

    // Delete channel record
    await prisma.channel.delete({
      where: { id: channel.id },
    });

    return NextResponse.json(
      { message: "Channel deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE /api/rss/[slug] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete channel", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}