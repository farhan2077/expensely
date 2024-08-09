import { createId } from "@paralleldrive/cuid2";
import { type InferSelectModel, relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { groupsTable } from "@/db/schema/groups";
import { usersTable } from "@/db/schema/users";

const dailyActivitiesTable = sqliteTable("daily_activities", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  date: text("date").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  groupId: text("group_id")
    .notNull()
    .references(() => groupsTable.id, { onDelete: "cascade" }),
  meal: integer("meal", { mode: "number" }).notNull(),
  grocery: integer("grocery", { mode: "number" }).notNull(),
});

const dailyActivitiesRelations = relations(dailyActivitiesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [dailyActivitiesTable.userId],
    references: [usersTable.id],
  }),
  group: one(groupsTable, {
    fields: [dailyActivitiesTable.groupId],
    references: [groupsTable.id],
  }),
}));

type DailyActivities = InferSelectModel<typeof dailyActivitiesTable>;

export { dailyActivitiesTable, dailyActivitiesRelations, type DailyActivities };
