import { createId } from "@paralleldrive/cuid2";
import { type InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { usersTable } from "@/db/schema";

const resetTokensTable = sqliteTable("reset_tokens", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  token: text("token").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});

type ResetPassword = InferSelectModel<typeof resetTokensTable>;

export { resetTokensTable, type ResetPassword };
