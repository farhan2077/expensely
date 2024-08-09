import { createId } from "@paralleldrive/cuid2";
import { type InferSelectModel, relations, sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import { dailyActivitiesTable } from "@/db/schema/daily-activities";
import { monthlyActivitiesTable } from "@/db/schema/monthly-activities";
import { usersGroupsTable } from "@/db/schema/users-groups";

const usersTable = sqliteTable("users", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text("name", { length: 255 }).notNull(),
  email: text("email", { length: 255 }).unique().notNull(),
  hash: text("hash", { length: 255 }),
  salt: text("salt", { length: 255 }),
  createdAt: text("created_at", { mode: "text" }).default(
    sql`(CURRENT_TIMESTAMP)`
  ),
});

const usersRelations = relations(usersTable, ({ many }) => ({
  usersGroupsTable: many(usersGroupsTable),
  dailyActivitiesTable: many(dailyActivitiesTable),
  monthlyActivitiesTable: many(monthlyActivitiesTable),
}));

type User = InferSelectModel<typeof usersTable>;
type SafeUser = Omit<User, "hash" | "salt">;

export { usersTable, usersRelations };
export type { User, SafeUser };
