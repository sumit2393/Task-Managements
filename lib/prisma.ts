import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";

if (process.env.NODE_ENV === "development") {
  neonConfig.webSocketConstructor = require("ws");
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL missing");
}

const adapter = new PrismaNeon({
  connectionString,
});

export const prisma = new PrismaClient({
  adapter,
});
