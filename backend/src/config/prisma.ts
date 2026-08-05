import { PrismaClient } from '@prisma/client';
import { env, isProduction } from './env.js';

// Evita múltiplas instâncias do PrismaClient durante hot-reload em desenvolvimento
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isProduction ? ['error', 'warn'] : ['error', 'warn'],
  });

if (!isProduction) {
  globalForPrisma.prisma = prisma;
}

void env; // garante que env é carregado antes do Prisma
