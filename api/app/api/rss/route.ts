import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/app/generated/prisma/client/client";

// GET /api/rss - List all channels
export async function GET() {
  try {
    const channels = await prisma.channel.findMany({
      include: {
        _count: { select: { posts: true } },
      },
    });
    return NextResponse.json(channels, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch channels", details: error?.message },
      { status: 500 }
    );
  }
}

// POST /api/rss - Create a new channel with user-friendly duplicate error
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, name, description } = body;

    const trimmedSlug = slug?.trim().toLowerCase();
    const trimmedName = name?.trim();

    if (!trimmedSlug || !trimmedName) {
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

      return NextResponse.json(
        { error: userMessage, field: targetFields[0] },
        { status: 409 }
      );
    }

    console.error("POST /api/rss Error:", error);
    return NextResponse.json(
      { error: "Failed to create channel", details: error?.message },
      { status: 500 }
    );
  }
}