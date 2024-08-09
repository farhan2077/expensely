import { createId } from "@paralleldrive/cuid2";
import { type InferSelectModel, relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { groupsTable } from "@/db/schema/groups";

const groupsOrdersTable = sqliteTable("groups_orders", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  order: integer("order", { mode: "number" }).notNull(),
  name: text("name", { length: 255 }).notNull(),
  email: text("email", { length: 255 }),
  groupId: text("group_id")
    .notNull()
    .references(() => groupsTable.id, {
      onDelete: "cascade",
    }),
});

const groupsOrdersTableRelations = relations(groupsOrdersTable, ({ one }) => ({
  group: one(groupsTable, {
    fields: [groupsOrdersTable.groupId],
    references: [groupsTable.id],
  }),
}));

type GroupsOrders = InferSelectModel<typeof groupsOrdersTable>;

export { groupsOrdersTable, groupsOrdersTableRelations, type GroupsOrders };
