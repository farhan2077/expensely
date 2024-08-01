"use server";

import { db } from "@/db";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Response } from "@/libs/types";
import {
  groupsOrdersTable,
  type GroupsOrders,
} from "@/db/schema/groups-orders";
import { error } from "console";

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
  // 1
  // get all the current fields
  // delete them
  // add the new ones
  //
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
  } catch (e) {
    return {
      success: false,
      message: "There was an error",
      data: error,
    };
  }
}
