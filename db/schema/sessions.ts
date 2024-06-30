import { type InferSelectModel } from "drizzle-orm";
import { usersTable } from "@/db/schema/users";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const sessionsTable = sqliteTable("sessions", {
  id: text("id").primaryKey().notNull(),
  expiresAt: integer("expires_at").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }), // foreign key
});

type Session = InferSelectModel<typeof sessionsTable>;

export { sessionsTable };
export type { Session };
