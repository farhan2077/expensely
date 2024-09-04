"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { and, eq } from "drizzle-orm";

import { validateSession } from "@/app/actions/auth";
import { addGroupOrder } from "@/app/actions/group-order";

import { db } from "@/db";
import { groupsOrdersTable } from "@/db/schema";
import { type Groups, groupsTable } from "@/db/schema/groups";
import {
  UserGroupTypeT,
  type UsersGroups,
  usersGroupsTable,
} from "@/db/schema/users-groups";

import { Response } from "@/libs/types";

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
): Promise<Response<UsersGroups | null>> {
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

  // check user id and group already exists
  const existingUserGroup = await db.query.usersGroupsTable.findFirst({
    where: and(
      eq(usersGroupsTable.userId, user.id),
      eq(usersGroupsTable.groupId, existingGroup.id)
    ),
  });

  // check existingUserGroup is active
  if (existingUserGroup && existingUserGroup.isActive) {
    return {
      success: false,
      message: "You have already joined the group",
      data: null,
    };
  }
  // if existingUserGroup is active, then check code
  if (existingGroup.code !== code) {
    return {
      success: false,
      message: "Passcode does not match",
      data: null,
    };
  }
  // if existingUserGroup is not active, then make it active
  if (existingUserGroup && !existingUserGroup.isActive) {
    const [updatedResult] = await db
      .update(usersGroupsTable)
      .set({
        isActive: true,
      })
      .where(
        and(
          eq(usersGroupsTable.userId, user.id),
          eq(usersGroupsTable.groupId, existingGroup.id)
        )
      )
      .returning();

    // add order after updating isActive
    const orderRes = await addGroupOrder(
      updatedResult.groupId,
      userEmail,
      userName
    );

    if (!orderRes.success) {
      return {
        success: false,
        message: orderRes.message,
      };
    }

    return {
      success: true,
      message: "Rejoined group",
      data: updatedResult,
    };
  }

  // if no existingUserGroup, create new one
  if (!existingUserGroup) {
    // do something
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

  // add order after adding new user and group
  const orderRes = await addGroupOrder(
    usersGroupsResult.groupId,
    userEmail,
    userName
  );

  if (!orderRes.success) {
    return {
      success: false,
      message: orderRes.message,
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

export type UsersWithGroup = {
  id: string;
  type: "admin" | "editor" | "member";
  isActive: boolean;
  userId: string;
  groupId: string;
  group: {
    id: string;
    name: string;
    code: number;
    ownerId: string;
  };
};

export async function getUsersGroups(): Promise<Response<UsersWithGroup[]>> {
  const { user } = await validateSession();
  if (!user) {
    return {
      success: false,
      message: "Invalid session",
    };
  }

  const result = await db.query.usersGroupsTable.findMany({
    where: and(
      eq(usersGroupsTable.userId, user.id),
      eq(usersGroupsTable.isActive, true)
    ),
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

export type GroupMember = {
  id: string;
  type: UserGroupTypeT;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string | null;
  };
  group: {
    id: string;
  };
};

type GroupDetailsData = {
  groupInfo: Groups;
  groupMembers: GroupMember[];
};

export async function getGroupDetails(
  groupId: string
): Promise<Response<GroupDetailsData | null>> {
  const groupInfo = await db.query.groupsTable.findFirst({
    where: eq(groupsTable.id, groupId),
  });

  const groupMembers = await db.query.usersGroupsTable.findMany({
    where: and(
      eq(usersGroupsTable.groupId, groupId),
      eq(usersGroupsTable.isActive, true)
    ),
    columns: {
      id: true,
      type: true,
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

export async function removeMemberFromGroup(
  id: string,
  groupId: string
): Promise<Response> {
  try {
    const res = await db
      .update(usersGroupsTable)
      .set({
        isActive: false,
      })
      .where(
        and(eq(usersGroupsTable.id, id), eq(usersGroupsTable.groupId, groupId))
      )
      .returning();

    revalidatePath("/(protected)/dashboard/[id]", "layout");
    revalidatePath("/(protected)/settings", "layout");

    if (!res) {
      return {
        success: false,
        message: "Could not remove member",
      };
    }

    return {
      success: true,
      message: "Removed member",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
      data: error,
    };
  }
}

export async function updateUserRole(
  id: string,
  groupId: string,
  newType: "editor" | "member"
) {
  try {
    const res = await db
      .update(usersGroupsTable)
      .set({
        type: newType,
      })
      .where(
        and(eq(usersGroupsTable.id, id), eq(usersGroupsTable.groupId, groupId))
      )
      .returning();

    revalidatePath("/(protected)/dashboard/[id]", "layout");
    revalidatePath("/(protected)/settings", "layout");

    if (!res) {
      return {
        success: false,
        message: "Could not updated member role",
      };
    }

    return {
      success: true,
      message: "Updated member role",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
      data: error,
    };
  }
}
