import { PrismaClient } from '@/prisma/app/generated/prisma/client/client';
import { PrismaPg } from '@prisma/adapter-pg';

// 1. Declare global type using globalThis
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 2. Factory function to create the client + adapter
const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is missing.");
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
};

// 3. Reuse existing instance if present, or initialize a new one
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// 4. Save instance to globalThis in non-production environments
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}