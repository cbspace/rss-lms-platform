-- CreateTable
CREATE TABLE "RequestLog" (
    "id" TEXT NOT NULL,
    "clientIp" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "feedSlug" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetricSummary" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "totalCount" INTEGER NOT NULL DEFAULT 0,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MetricSummary_pkey" PRIMARY KEY ("id")
);
