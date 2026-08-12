// lib/channels.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from  '@/prisma/app/generated/prisma/client/client';

// Infer the Channel type with nested posts included
export type ChannelWithPosts = Prisma.ChannelGetPayload<{
  include: {
    posts: {
      orderBy: { date: "desc" };
    };
  };
}>;

/**
 * Checks if a channel exists by slug or ID.
 * Returns either the Channel object (with posts included) or a 404 NextResponse.
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

  const channel = await prisma.channel.findFirst({
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