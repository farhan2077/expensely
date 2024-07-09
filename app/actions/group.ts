"use server";

import { validateSession } from "@/app/actions/auth";
import { db } from "@/db";
import { groupsTable, usersGroupsTable } from "@/db/schema";
import { redirect } from "next/navigation";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Response } from "@/libs/types";

export async function createGroupAction(
  name: string,
  code: number
): Promise<Response> {
  const { user } = await validateSession();
  if (!user) {
    redirect("/sign-in");
  }

  const existingGroup = await db.query.groupsTable.findFirst({
    where: eq(groupsTable.name, name),
  });
  if (existingGroup) {
    return {
      success: false,
      message: "Group already exists. Please try different name.",
      data: null,
    };
  }

  const [result] = await db
    .insert(groupsTable)
    .values({
      name: name,
      code: code,
      ownerId: user.id,
    })
    .returning();

  const [anotherResult] = await db
    .insert(usersGroupsTable)
    .values({
      groupId: result.id,
      userId: user.id,
    })
    .returning();

  revalidatePath("/(protected)/dashboard/[id]", "layout");
  revalidatePath("/(protected)/settings", "layout");

  return {
    success: true,
    message: "New group added",
    data: anotherResult,
  };
}

export async function joinGroupAction(
  name: string,
  code: number
): Promise<Response> {
  const { user } = await validateSession();
  if (!user) {
    redirect("/sign-in");
  }

  // check if group exists
  const existingGroup = await db.query.groupsTable.findFirst({
    where: eq(groupsTable.name, name),
  });
  if (!existingGroup) {
    return {
      success: false,
      message: "Group does not exist yet",
      data: null,
    };
  }

  // check if already joined group
  const existingUserGroup = await db.query.usersGroupsTable.findFirst({
    where: and(
      eq(usersGroupsTable.userId, user.id),
      eq(usersGroupsTable.groupId, existingGroup.id)
    ),
  });

  if (existingUserGroup) {
    return {
      success: false,
      message: "You have already joined the group",
      data: null,
    };
  }

  // check if password matches
  if (existingGroup.code !== code) {
    return {
      success: false,
      message: "Passcode does not match",
      data: null,
    };
  }

  const [result] = await db
    .insert(usersGroupsTable)
    .values({
      groupId: existingGroup.id,
      userId: user.id,
    })
    .returning();

  if (!result) {
    return {
      success: false,
      message: "There was an error",
      data: null,
    };
  }

  revalidatePath("/(protected)/dashboard/[id]", "layout");
  revalidatePath("/(protected)/settings", "layout");

  return {
    success: true,
    message: "Joined group",
    data: result,
  };
}

export async function getUsersGroups(): Promise<Response> {
  const { user } = await validateSession();
  if (!user) {
    redirect("/sign-in");
  }

  const result = await db.query.usersGroupsTable.findMany({
    where: eq(usersGroupsTable.userId, user.id),
    with: {
      group: true,
    },
  });

  return {
    success: true,
    message: "User's group(s) found",
    data: result,
  };
}

export async function getGroupInfo(groupId: string): Promise<Response> {
  const groupInfo = await db.query.groupsTable.findFirst({
    where: eq(groupsTable.id, groupId),
  });

  const groupMembers = await db.query.usersGroupsTable.findMany({
    where: eq(usersGroupsTable.groupId, groupId),
    columns: {
      id: true,
    },
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      },
    },
  });

  if (!groupInfo || !groupMembers) {
    return {
      success: false,
      message: "Group details not found",
      data: null,
    };
  }

  return {
    success: true,
    message: "Group details found",
    data: { groupInfo, groupMembers },
  };
}
