"use server";

import { revalidatePath } from "next/cache";

import { endOfMonth, format, startOfMonth } from "date-fns";
import { and, eq, gte, lte } from "drizzle-orm";

import { db } from "@/db";
import { dailyActivitiesTable } from "@/db/schema";

import { Response } from "@/libs/types";

type DailyActivityInput = {
  date: string;
  groupId: string;
  userId: string;
  meal: number;
  grocery: number;
};

export type DailyActivityOutputData = {
  date: string;
  id: string;
  userId: string;
  groupId: string;
  meal: number;
  grocery: number;
  user: {
    name: string;
  };
};

export type DailyActivityDateOutputData = {
  date: string;
};

export async function getDailyActivities(
  groupId: string,
  fromDate?: string,
  toDate?: string
): Promise<Response<DailyActivityOutputData[]>> {
  const today = new Date();

  const defaultFromDate = format(startOfMonth(today), "P");
  const defaultToDate = format(endOfMonth(today), "P");

  const result = await db.query.dailyActivitiesTable.findMany({
    where: and(
      eq(dailyActivitiesTable.groupId, groupId),
      gte(dailyActivitiesTable.date, !fromDate ? defaultFromDate : fromDate),
      lte(dailyActivitiesTable.date, !toDate ? defaultToDate : toDate)
    ),
    with: {
      user: {
        columns: {
          name: true,
        },
      },
    },
  });

  if (!result) {
    return {
      success: false,
      message: "Daily activities not found",
    };
  }

  return {
    success: true,
    message: "Daily activities found",
    data: result,
  };
}

export async function getDailyActivitiesDates(
  groupId: string
): Promise<Response<DailyActivityDateOutputData[]>> {
  const result = await db.query.dailyActivitiesTable.findMany({
    where: and(eq(dailyActivitiesTable.groupId, groupId)),
    columns: {
      date: true,
    },
  });

  if (!result) {
    return {
      success: false,
      message: "Daily activities not found",
    };
  }

  return {
    success: true,
    message: "Daily activities found",
    data: result,
  };
}

export async function addDailyAcitivities(
  activities: DailyActivityInput[]
): Promise<Response> {
  try {
    const results = await db.transaction(async (tx) => {
      const insertedActivities = [];

      for (const activity of activities) {
        const [inserted] = await tx
          .insert(dailyActivitiesTable)
          .values(activity)
          .returning();
        insertedActivities.push(inserted);
      }

      return insertedActivities;
    });

    if (!results) {
      return {
        success: false,
        message: "There was an error while adding daily activities",
        data: null,
      };
    }

    revalidatePath("/(protected)/dashboard/[id]", "layout");

    return {
      success: true,
      message: "New data added to daily activities",
    };
  } catch (error) {
    revalidatePath("/(protected)/dashboard/[id]", "layout");

    return {
      success: false,
      message: "There was an error",
      data: error,
    };
  }
}

type UpdateFormValue = { id: string; meal: number; grocery: number };

export async function updateDailyActivity({
  formValues,
}: {
  formValues: UpdateFormValue[];
}): Promise<Response> {
  try {
    const results = await db.transaction(async (tx) => {
      const updatedGroupsOrders = [];

      for (const item of formValues) {
        const [updated] = await tx
          .update(dailyActivitiesTable)
          .set({
            meal: item.meal,
            grocery: item.grocery,
          })
          .where(and(eq(dailyActivitiesTable.id, item.id)))
          .returning();
        updatedGroupsOrders.push(updated);
      }

      return updatedGroupsOrders;
    });

    if (!results) {
      return {
        success: false,
        message: "There was an error while updaing meal and grocery",
        data: null,
      };
    }

    revalidatePath("/(protected)/dashboard/[id]", "layout");

    return {
      success: true,
      message: "Meals and groceries updated",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
      data: error,
    };
  }
}
