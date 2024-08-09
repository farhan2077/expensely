import { createId } from "@paralleldrive/cuid2";
import { type InferSelectModel, relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { groupsTable } from "@/db/schema/groups";
import { monthlyActivitiesTable } from "@/db/schema/monthly-activities";

const monthlyUtilitiesTable = sqliteTable("monthly_utilities", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey()
    .unique(),
  date: text("date").notNull(), // each month will have only one entry
  electricity: integer("electricity", { mode: "number" }).notNull(),
  internet: integer("internet", { mode: "number" }).notNull(),
  water: integer("water", { mode: "number" }).notNull(),
  gas: integer("gas", { mode: "number" }).notNull(),
  cook: integer("cook", { mode: "number" }).notNull(),
  otherUtils: integer("other_utils", { mode: "number" }).notNull(),
  groupId: text("group_id")
    .notNull()
    .references(() => groupsTable.id, { onDelete: "cascade" }),
});

const monthlyUtilitiesRelations = relations(
  monthlyUtilitiesTable,
  ({ one, many }) => ({
    group: one(groupsTable, {
      fields: [monthlyUtilitiesTable.groupId],
      references: [groupsTable.id],
    }),
    monthlyActivitiesTable: many(monthlyActivitiesTable),
  })
);

// one to many relationship w/ monthly activities

type MonthylUtilities = InferSelectModel<typeof monthlyUtilitiesTable>;

export {
  monthlyUtilitiesTable,
  monthlyUtilitiesRelations,
  type MonthylUtilities,
};
