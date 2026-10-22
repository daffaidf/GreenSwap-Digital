import { Pool } from "pg";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pool?: Pool;
};

// Supabase session pooler hanya menyediakan 15 koneksi untuk seluruh project,
// jadi tiap instance serverless harus memakai 1 koneksi saja.
// Pool di-cache di globalThis (semua environment) supaya tidak ada dua Pool
// dalam satu instance akibat bundling Next.js memisahkan modul ke chunk berbeda.
const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
    allowExitOnIdle: true,
  });

globalForPrisma.pool = pool;

const adapter = new PrismaPg(pool);

export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter });

globalForPrisma.prisma = db;
