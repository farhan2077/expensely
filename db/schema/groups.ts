import { relations, type InferSelectModel } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

import { usersGroupsTable } from "@/db/schema/users-groups";
import { createId } from "@paralleldrive/cuid2";

const groupsTable = sqliteTable("groups", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text("name", { length: 255 }).notNull().unique(),
  code: integer("code", { mode: "number" }).notNull(),
  ownerId: text("owner_id").notNull(),
});

const groupsRelations = relations(groupsTable, ({ many }) => ({
  usersGroupsTable: many(usersGroupsTable),
}));

type Groups = InferSelectModel<typeof groupsTable>;

export { groupsTable, groupsRelations, type Groups };
