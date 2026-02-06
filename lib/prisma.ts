// Import Prisma Client – the ORM used to interact with the database
import { PrismaClient } from "@prisma/client";

// Import Prisma Neon adapter (required for Prisma 7 + Neon)
import { PrismaNeon } from "@prisma/adapter-neon";

// Neon serverless configuration
import { neonConfig } from "@neondatabase/serverless";

/**
 * Enable WebSocket support only in local development.
 * Neon’s serverless driver requires WebSocket when running locally.
 */
if (process.env.NODE_ENV === "development") {
  neonConfig.webSocketConstructor = require("ws");
}

/**
 * Read the database connection string from environment variables
 */
const connectionString = process.env.DATABASE_URL;

// Stop the application if DATABASE_URL is not defined
if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

/**
 * Initialize the Prisma Neon adapter.
 * 
 * In Prisma 7, we pass a configuration object
 * (not a Pool instance) to the adapter.
 */
const adapter = new PrismaNeon({
  connectionString,
});

/**
 * Create a PrismaClient instance using the Neon adapter.
 * All Prisma queries will now run against the Neon PostgreSQL database.
 */
export const prisma = new PrismaClient({
  adapter,
});
