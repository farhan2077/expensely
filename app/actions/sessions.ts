import { eq } from "drizzle-orm";

import { db } from "@/db";
import { sessionsTable } from "@/db/schema";

export async function deleteSessionForUser(userId: string, trx = db) {
  await trx.delete(sessionsTable).where(eq(sessionsTable.userId, userId));
}
