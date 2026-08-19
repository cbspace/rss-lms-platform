// api/app/api/health/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import packageJson from "@/package.json";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const dbStartTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbLatencyMs = Date.now() - dbStartTime;

    const memoryUsage = process.memoryUsage();

    const responsePayload = {
      status: "ok",
      version: packageJson.version || process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      database: {
        status: "connected",
        latencyMs: dbLatencyMs,
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        heapUsedMb: Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100,
        rssMb: Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100,
      },
    };

    return NextResponse.json(responsePayload, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("GET /api/health Check Failed:", error);

    return NextResponse.json(
      {
        status: "error",
        version: packageJson.version || "1.0.0",
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString(),
        database: {
          status: "disconnected",
          error: error?.message || "Failed to reach database",
        },
      },
      { status: 503 }
    );
  }
}