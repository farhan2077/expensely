"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { usersTable } from "@/db/schema/users";
import { validateSession } from "@/app/actions/auth";

export async function getUserInfo() {
  const { user } = await validateSession();
  if (!user) {
    redirect("/sign-in");
  }

  const result = await db.query.usersTable.findFirst({
    columns: {
      id: true,
      createdAt: true,
      name: true,
      email: true,
    },
    where: eq(usersTable.id, user.id),
  });

  if (!result) {
    return {
      success: false,
      message: "User info not found",
    };
  }

  return {
    success: true,
    message: "User info found",
    data: result,
  };
}

export async function updatedUserName(userId: string, newName: string) {
  const [result] = await db
    .update(usersTable)
    .set({ name: newName })
    .where(eq(usersTable.id, userId))
    .returning({ updatedName: usersTable.name });

  if (!result || !result.updatedName) {
    return {
      success: false,
      message: "User name could not be updated",
    };
  }

  revalidatePath("/settings");

  return {
    success: true,
    message: "User name updated",
    data: result.updatedName,
  };
}
