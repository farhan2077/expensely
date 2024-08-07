import { createClient } from "@libsql/client";
import { drizzle, LibSQLDatabase } from "drizzle-orm/libsql";

import env from "@/env";

import * as schema from "@/db/schema";

export const client = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, {
  schema,
  logger: true,
});

export let DB: LibSQLDatabase<typeof schema>;
