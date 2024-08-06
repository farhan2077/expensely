import { config } from "dotenv";

import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

import env from "@/env";

export default defineConfig({
  schema: "./db/schema/index.ts",
  out: "./db/migrations",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  },
  verbose: true,
  strict: true,
});
