import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Aurora requires TLS; pg treats sslmode=require as verify-full, so we pass
// ssl explicitly and strip sslmode from the connection string to avoid P1011.
const connectionString = process.env.DATABASE_URL.replace(
  /[?&]sslmode=[^&]*/g,
  "",
).replace(/\?$/, "");

const adapter = new PrismaPg({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
