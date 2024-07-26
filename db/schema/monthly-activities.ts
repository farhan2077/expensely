import { relations, type InferSelectModel } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { monthlyUtilitiesTable } from "@/db/schema/monthly-utilities";
import { usersTable } from "@/db/schema/users";

const monthlyActivitiesTable = sqliteTable("monthly_activities", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  date: text("date").notNull(), // for each user should have one entry per month
  rent: integer("rent", { mode: "number" }).notNull(),
  paid: integer("paid", { mode: "number" }).notNull(),
  utilityId: text("utilities_id")
    .notNull()
    .references(() => monthlyUtilitiesTable.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});

const monthlyActivitiesRelations = relations(
  monthlyActivitiesTable,
  ({ one }) => ({
    utility: one(monthlyUtilitiesTable, {
      fields: [monthlyActivitiesTable.utilityId],
      references: [monthlyUtilitiesTable.id],
    }),
    user: one(usersTable, {
      fields: [monthlyActivitiesTable.userId],
      references: [usersTable.id],
    }),
  })
);

type MonthylActivities = InferSelectModel<typeof monthlyActivitiesTable>;

export {
  monthlyActivitiesTable,
  monthlyActivitiesRelations,
  type MonthylActivities,
};
