/*
  Warnings:

  - You are about to drop the `MetricSummary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RequestLog` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "MetricSummary";

-- DropTable
DROP TABLE "RequestLog";

-- CreateTable
CREATE TABLE "TelemetrySpan" (
    "id" TEXT NOT NULL,
    "traceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "clientIp" TEXT NOT NULL,
    "feedSlug" TEXT,
    "postCount" INTEGER,
    "errorType" TEXT,
    "errorMessage" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TelemetrySpan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TelemetrySpan_timestamp_idx" ON "TelemetrySpan"("timestamp" DESC);

-- CreateIndex
CREATE INDEX "TelemetrySpan_feedSlug_idx" ON "TelemetrySpan"("feedSlug");

-- CreateIndex
CREATE INDEX "TelemetrySpan_clientIp_idx" ON "TelemetrySpan"("clientIp");

-- CreateIndex
CREATE INDEX "TelemetrySpan_statusCode_idx" ON "TelemetrySpan"("statusCode");
