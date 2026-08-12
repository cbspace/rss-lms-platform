import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function logRequest(req: NextRequest, feedSlug?: string) {
  try {
    // Extract Client IP address safely from headers or connection
    const clientIp = 
      req.headers.get("x-forwarded-for")?.split(",")[0] || 
      req.headers.get("x-real-ip") || 
      "127.0.0.1";

    const endpoint = req.nextUrl.pathname;

    // Async record in DB so it doesn't slow down the main API response
    await prisma.$transaction([
      prisma.requestLog.create({
        data: {
          clientIp,
          endpoint,
          feedSlug,
        },
      }),
      prisma.metricSummary.upsert({
        where: { id: "global" },
        update: { totalCount: { increment: 1 } },
        create: { id: "global", totalCount: 1 },
      }),
    ]);
  } catch (err) {
    console.error("Failed to log request metric:", err);
  }
}