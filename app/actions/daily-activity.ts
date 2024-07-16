"use server";

import { db } from "@/db";

import { and, eq, gte, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Response } from "@/libs/types";
import { dailyActivitiesTable } from "@/db/schema";
import { startOfMonth, endOfMonth, format } from "date-fns";

type DailyActivityInput = {
  date: string;
  groupId: string;
  userId: string;
  meal: number;
  grocery: number;
};

export type DailyActivityOutput = {
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

export type DailyActivityDateOutput = {
  date: string;
};

export async function getDailyActivities(
  groupId: string,
  fromDate: string | undefined,
  toDate: string | undefined
): Promise<Response<DailyActivityOutput[]>> {
  const today = new Date();
  const from = startOfMonth(today);
  const to = endOfMonth(today);

  const formattedFromDate = format(from, "P");
  const formattedToDate = format(to, "P");

  const result = await db.query.dailyActivitiesTable.findMany({
    where: and(
      eq(dailyActivitiesTable.groupId, groupId),
      gte(dailyActivitiesTable.date, !fromDate ? formattedFromDate : fromDate),
      lte(dailyActivitiesTable.date, !toDate ? formattedToDate : toDate)
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
): Promise<Response<DailyActivityDateOutput[]>> {
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
