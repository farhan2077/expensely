import { createId } from "@paralleldrive/cuid2";
import { type InferSelectModel, relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { groupsTable } from "@/db/schema/groups";
import { usersTable } from "@/db/schema/users";

const usersGroupsTable = sqliteTable("users_groups", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  isActive: integer("active", { mode: "boolean" }).notNull(),
  type: text("type", {
    enum: ["admin", "editor", "member"],
  }).notNull(),
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
export type UserGroupTypeT = UsersGroups["type"];

export { usersGroupsTable, usersGroupsRelations, type UsersGroups };
