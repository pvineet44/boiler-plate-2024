import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
    transactionOptions: {
      maxWait: 25000, // default: 2000
      timeout: 25000, // default: 5000
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
