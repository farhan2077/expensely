import { sql, type InferSelectModel, relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

import { usersGroupsTable } from "@/db/schema/users-groups";

const usersTable = sqliteTable("users", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text("name", { length: 255 }),
  email: text("email", { length: 255 }).unique(),
  hash: text("hash", { length: 255 }),
  salt: text("salt", { length: 255 }),
  createdAt: text("created_at", { mode: "text" }).default(
    sql`(CURRENT_TIMESTAMP)`
  ),
});

const usersRelations = relations(usersTable, ({ many }) => ({
  usersGroupsTable: many(usersGroupsTable),
}));

type User = InferSelectModel<typeof usersTable>;

export { usersTable, usersRelations, type User };
