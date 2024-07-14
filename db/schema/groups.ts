import { relations, type InferSelectModel } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

import { usersGroupsTable } from "@/db/schema/users-groups";
import { dailyActivitiesTable } from "@/db/schema/daily-activities";
import { usersTable } from "@/db/schema/users";

const groupsTable = sqliteTable("groups", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text("name", { length: 255 }).notNull().unique(),
  code: integer("code", { mode: "number" }).notNull(),
  ownerId: text("owner_id").references(() => usersTable.id),
});

const groupsRelations = relations(groupsTable, ({ many, one }) => ({
  usersGroupsTable: many(usersGroupsTable),
  dailyActivitiesTable: many(dailyActivitiesTable),
  owner: one(usersTable, {
    fields: [groupsTable.ownerId],
    references: [usersTable.id],
  }),
}));

type Groups = InferSelectModel<typeof groupsTable>;

export { groupsTable, groupsRelations, type Groups };
