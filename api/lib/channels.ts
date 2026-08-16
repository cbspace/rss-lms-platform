// api/lib/channels.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/app/generated/prisma/client/client";

// Infer the Channel type with nested posts included
export type ChannelWithPosts = Prisma.ChannelGetPayload<{
  include: {
    posts: {
      orderBy: { date: "desc" };
    };
  };
}>;

// Minimal Channel summary type for listing
export type ChannelSummary = Prisma.ChannelGetPayload<{
  include: {
    _count: {
      select: { posts: true };
    };
  };
}>;

/**
 * Retrieves all channels, ordered by creation date descending.
 */
export async function getChannels(includePosts = true) {
  if (includePosts) {
    return prisma.channel.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        posts: {
          orderBy: { date: "desc" },
        },
      },
    });
  }

  return prisma.channel.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });
}

/**
 * Retrieves a single channel by slug or ID with posts included.
 */
export async function getChannelBySlug(
  identifier: string
): Promise<ChannelWithPosts | null> {
  if (!identifier) return null;

  return prisma.channel.findFirst({
    where: {
      OR: [{ slug: identifier }, { id: identifier }],
    },
    include: {
      posts: {
        orderBy: {
          date: "desc",
        },
      },
    },
  });
}

/**
 * Enforces channel existence by slug or ID.
 * Returns either the Channel object (with posts) or a formatted 404/400 NextResponse.
 */
export async function requireChannel(
  identifier: string
): Promise<{ channel: ChannelWithPosts } | { errorResponse: NextResponse }> {
  if (!identifier) {
    return {
      errorResponse: NextResponse.json(
        { error: "Channel identifier is required" },
        { status: 400 }
      ),
    };
  }

  const channel = await getChannelBySlug(identifier);

  if (!channel) {
    return {
      errorResponse: NextResponse.json(
        { error: `Channel '${identifier}' not found` },
        { status: 404 }
      ),
    };
  }

  return { channel };
}

/**
 * Creates a new RSS channel.
 */
export async function createChannel(data: {
  slug: string;
  name: string;
  description?: string;
}) {
  return prisma.channel.create({
    data: {
      slug: data.slug.trim().toLowerCase(),
      name: data.name.trim(),
      description: data.description?.trim() || "",
    },
  });
}

/**
 * Deletes a channel and its associated posts/relations.
 */
export async function deleteChannel(identifier: string) {
  const channel = await prisma.channel.findFirst({
    where: {
      OR: [{ slug: identifier }, { id: identifier }],
    },
    select: { id: true, slug: true },
  });

  if (!channel) return null;

  return prisma.channel.delete({
    where: { id: channel.id },
  });
}