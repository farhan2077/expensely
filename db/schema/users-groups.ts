import { relations, type InferSelectModel } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

import { usersTable, groupsTable } from "@/db/schema";

const usersGroupsTable = sqliteTable("users_groups", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  groupId: text("group_id")
    .notNull()
    .references(() => groupsTable.id, { onDelete: "cascade" }),
});

const usersGroupsRelations = relations(usersGroupsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [usersGroupsTable.userId],
    references: [usersTable.id],
  }),
  group: one(groupsTable, {
    fields: [usersGroupsTable.groupId],
    references: [groupsTable.id],
  }),
}));

type UsersGroups = InferSelectModel<typeof usersGroupsTable>;

export { usersGroupsTable, usersGroupsRelations, type UsersGroups };
