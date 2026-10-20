import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// منع إنشاء عدة instances في التطوير (Hot Reload)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// إزالة sslmode من الرابط وتمرير ssl صريحًا
// (تحذير مكتبة pg عن أسماء أوضاع SSL القديمة)
function buildPgOptions(connectionString: string): {
  connectionString: string;
  ssl?: { rejectUnauthorized: boolean };
} {
  try {
    const url = new URL(connectionString);
    const sslmode = url.searchParams.get("sslmode");
    url.searchParams.delete("sslmode");
    const sslRequired = sslmode !== null && sslmode !== "disable";
    return {
      connectionString: url.toString(),
      ssl: sslRequired ? { rejectUnauthorized: true } : undefined,
    };
  } catch {
    return { connectionString };
  }
}

// Prisma 7 يتطلب driver adapter — نستخدم pg مع رابط Neon (connection pooling)
function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL غير مضبوط — أضف الرابط في .env.local (راجع .env.example)"
    );
  }
  const adapter = new PrismaPg(buildPgOptions(connectionString));
  return new PrismaClient({
    adapter,
    log: ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
