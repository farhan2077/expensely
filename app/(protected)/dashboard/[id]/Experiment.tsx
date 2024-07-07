import { db } from "@/db";
import { usersGroupsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function Experiment({ userId }: { userId: string }) {
  const result = await db.query.usersGroupsTable.findMany({
    where: eq(usersGroupsTable.userId, userId),
  });

  console.log(result);

  return (
    <div>
      <p className="text-red-500">Experiment</p>
    </div>
  );
}
