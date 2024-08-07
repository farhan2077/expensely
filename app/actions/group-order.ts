"use server";

import { revalidatePath } from "next/cache";

import { and, asc, count, eq, like } from "drizzle-orm";

import { EMPTY_MAIL_SUFFIX } from "@/config";

import { db } from "@/db";
import {
  type GroupsOrders,
  groupsOrdersTable,
} from "@/db/schema/groups-orders";

import { Response } from "@/libs/types";

export async function getGroupOrderInfo(
  groupId: string
): Promise<Response<GroupsOrders[]>> {
  const result = await db
    .select()
    .from(groupsOrdersTable)
    .where(eq(groupsOrdersTable.groupId, groupId))
    .orderBy(groupsOrdersTable.order);

  if (!result) {
    return {
      success: false,
      message: "Users groups orders not found",
    };
  }

  return {
    success: true,
    message: "Users groups orders found",
    data: result,
  };
}

// add function
// 2 variants, real ones and fake ones

export async function updateGroupOrders(
  groupId: string,
  groupsOrders: any // better type
): Promise<Response> {
  try {
    const results = await db.transaction(async (tx) => {
      const updatedGroupsOrders = [];

      for (const item of groupsOrders) {
        const [updated] = await tx
          .update(groupsOrdersTable)
          .set({
            order: item.order,
          })
          .where(
            and(
              eq(groupsOrdersTable.groupId, groupId),
              eq(groupsOrdersTable.email, item.email)
            )
          )
          .returning();
        updatedGroupsOrders.push(updated);
      }

      return updatedGroupsOrders;
    });

    if (!results) {
      return {
        success: false,
        message: "There was an error while updaing order",
        data: null,
      };
    }

    revalidatePath("/(protected)/dashboard/[id]", "layout");

    return {
      success: true,
      message: "Order updated",
    };
  } catch (error) {
    return {
      success: false,
      message: "There was an error",
      data: error,
    };
  }
}

// this must be run after user and group correlation has already been created
// which will ensure that there will be at least one entry
export async function addGroupOrder(
  groupId: string,
  email: string,
  name: string
): Promise<Response> {
  try {
    const [groupsOrderCount] = await db
      .select({ count: count() })
      .from(groupsOrdersTable)
      .where(eq(groupsOrdersTable.groupId, groupId));

    const anotherOrder = await db
      .insert(groupsOrdersTable)
      .values({
        order: groupsOrderCount.count, // why not count + 1, becuase index starts at 0, so the count is already +1
        groupId: groupId,
        email: email,
        name: name,
      })
      .returning();

    if (!anotherOrder) {
      return {
        success: false,
        message: "Could not add order",
      };
    }

    revalidatePath("/(protected)/dashboard/[id]", "layout");

    return {
      success: true,
      message: "Added order",
    };
  } catch (error) {
    return {
      success: false,
      message: "There was an error",
      data: error,
    };
  }
}

export async function deleteEmptyAndResetOrder(
  groupId: string
): Promise<Response> {
  try {
    // Start a transaction
    return await db.transaction(async (tx) => {
      // 1. Delete rows with empty email and matching group ID
      await tx
        .delete(groupsOrdersTable)
        .where(
          and(
            eq(groupsOrdersTable.groupId, groupId),
            like(groupsOrdersTable.email, `%${EMPTY_MAIL_SUFFIX}`)
          )
        );

      // 2. Select remaining rows for the group, ordered by current order
      const remainingRows = await tx
        .select()
        .from(groupsOrdersTable)
        .where(eq(groupsOrdersTable.groupId, groupId))
        .orderBy(asc(groupsOrdersTable.order));

      // 3. Update the order of remaining rows
      // let updatedCount = 0;
      for (let i = 0; i < remainingRows.length; i++) {
        await tx
          .update(groupsOrdersTable)
          .set({ order: i })
          .where(eq(groupsOrdersTable.id, remainingRows[i].id));
        // updatedCount++;
      }

      // deletedCount: deleteResult.rowsAffected,
      // updatedCount: updatedCount,

      return {
        success: true,
        message: "Removed empty slots successfully",
      };
    });
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}
