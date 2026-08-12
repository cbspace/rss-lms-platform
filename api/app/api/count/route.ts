import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Fetch total request count
    const summary = await prisma.metricSummary.findUnique({
      where: { id: "global" },
    });

    // 2. Count total channels and posts
    const [totalChannels, totalPosts] = await Promise.all([
      prisma.channel.count(),
      prisma.post.count(),
    ]);

    // 3. Count unique clients (IPs)
    const uniqueClients = await prisma.requestLog.groupBy({
      by: ["clientIp"],
      _count: true,
    });

    // 4. Requests grouped per feed
    const requestsPerFeed = await prisma.requestLog.groupBy({
      by: ["feedSlug"],
      where: { feedSlug: { not: null } },
      _count: { feedSlug: true },
    });

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        metrics: {
          totalRequests: summary?.totalCount || 0,
          uniqueClientsCount: uniqueClients.length,
          totalFeeds: totalChannels,
          totalPosts: totalPosts,
          requestsPerFeed: requestsPerFeed.map((item) => ({
            feed: item.feedSlug,
            count: item._count.feedSlug,
          })),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/count Error:", error);
    return NextResponse.json(
      { error: "Failed to load metrics", details: error?.message },
      { status: 500 }
    );
  }
}