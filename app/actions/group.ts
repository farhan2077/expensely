"use server";

import { validateSession } from "@/app/actions/auth";
import { db } from "@/db";
import { groupsTable } from "@/db/schema/groups";
import { usersGroupsTable } from "@/db/schema/users-groups";
import { redirect } from "next/navigation";

import { and, eq, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Response } from "@/libs/types";
import { groupsOrdersTable } from "@/db/schema";

export async function createGroupAction(
  name: string,
  code: number,
  userName: string,
  userEmail: string
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
    };
  }

  const [newGroup] = await db
    .insert(groupsTable)
    .values({
      name: name,
      code: code,
      ownerId: user.id,
    })
    .returning();

  if (!newGroup) {
    return {
      success: false,
      message: "Group could not be created.",
    };
  }

  const [newUsersGroups] = await db
    .insert(usersGroupsTable)
    .values({
      groupId: newGroup.id,
      userId: user.id,
      isActive: true,
      type: "admin",
    })
    .returning();

  if (!newUsersGroups) {
    return {
      success: false,
      message: "Group could not be assigned to you.",
    };
  }

  // while creating a group, there will be no previous data in groupsOrdersTable
  const newGroupOrder = await db.insert(groupsOrdersTable).values({
    order: 0, // first one, so 0 index
    groupId: newUsersGroups.groupId,
    email: userEmail,
    name: userName,
  });

  if (!newGroupOrder) {
    return {
      success: false,
      message: "You were not added to the order",
    };
  }

  revalidatePath("/(protected)/dashboard/[id]", "layout");
  revalidatePath("/(protected)/settings", "layout");

  return {
    success: true,
    message: "New group added",
    data: newUsersGroups,
  };
}

export async function joinGroupAction(
  name: string,
  code: number,
  userName: string,
  userEmail: string
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

  const [usersGroupsResult] = await db
    .insert(usersGroupsTable)
    .values({
      groupId: existingGroup.id,
      userId: user.id,
      isActive: true,
      type: "member",
    })
    .returning();

  if (!usersGroupsResult) {
    return {
      success: false,
      message: "Could not join group",
      data: null,
    };
  }

  // since the group has already been created, then there will be at least one entry
  const groupsOrderCount = await db
    .select({ count: count() })
    .from(groupsOrdersTable)
    .where(eq(groupsOrdersTable.groupId, usersGroupsResult.groupId));

  const anotherOrder = await db
    .insert(groupsOrdersTable)
    .values({
      order: groupsOrderCount[0].count, // why not count + 1, becuase we are saving in index 0, so count will always be +1
      groupId: usersGroupsResult.groupId,
      email: userEmail,
      name: userName,
    })
    .returning();

  if (!anotherOrder) {
    return {
      success: false,
      message: "Could not update order",
    };
  }

  revalidatePath("/(protected)/dashboard/[id]", "layout");
  revalidatePath("/(protected)/settings", "layout");

  return {
    success: true,
    message: "Joined group",
    data: usersGroupsResult,
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
      group: {
        columns: {
          id: true,
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
