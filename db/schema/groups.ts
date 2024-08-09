import { createId } from "@paralleldrive/cuid2";
import { type InferSelectModel, relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { dailyActivitiesTable } from "@/db/schema/daily-activities";
import { groupsOrdersTable } from "@/db/schema/groups-orders";
import { monthlyUtilitiesTable } from "@/db/schema/monthly-utilities";
import { usersTable } from "@/db/schema/users";
import { usersGroupsTable } from "@/db/schema/users-groups";

const groupsTable = sqliteTable("groups", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text("name", { length: 255 }).notNull().unique(),
  code: integer("code", { mode: "number" }).notNull(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),
});

const groupsRelations = relations(groupsTable, ({ many, one }) => ({
  usersGroupsTable: many(usersGroupsTable),
  dailyActivitiesTable: many(dailyActivitiesTable),
  owner: one(usersTable, {
    fields: [groupsTable.ownerId],
    references: [usersTable.id],
  }),
  monthlyUtilitiesTable: many(monthlyUtilitiesTable),
  groupsOrdersTable: many(groupsOrdersTable),
}));

type Groups = InferSelectModel<typeof groupsTable>;

export { groupsTable, groupsRelations, type Groups };
