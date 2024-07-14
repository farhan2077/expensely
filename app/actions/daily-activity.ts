"use server";

import { db } from "@/db";

import { and, eq, gte, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Response } from "@/libs/types";
import { dailyActivitiesTable } from "@/db/schema";
import { startOfMonth, endOfMonth, format } from "date-fns";

type DailyActivity = {
  date: string;
  groupId: string;
  userId: string;
  meal: number;
  grocery: number;
};

export type DailyGroupActivity = {
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

export async function getDailyGroupActivities(
  groupId: string,
  fromDate: string | undefined,
  toDate: string | undefined
): Promise<Response<DailyGroupActivity[]>> {
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

export async function getDailyGroupActivitiesMonths(
  groupId: string
): Promise<Response<DailyGroupActivity[]>> {
  const result = await db.query.dailyActivitiesTable.findMany({
    where: and(eq(dailyActivitiesTable.groupId, groupId)),
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

export async function addDailyAcitivities(
  activities: DailyActivity[]
): Promise<Response> {
  // const today = new Date().toISOString().split("T")[0];
  // const testActivities = [
  //   {
  //     date: today,
  //     userId: "gxpduwh3l7zcdmlr3z9ma4ca", // Farhan Bin Amin
  //     groupId: "j15jwa6257pjsacg29qn0jba", // Farhan's group
  //     meal: 1,
  //     grocery: 10,
  //   },
  //   {
  //     date: today,
  //     userId: "wseyrgd84tip1kst8i2wzk2s", // Jane Doe
  //     groupId: "j15jwa6257pjsacg29qn0jba", // Farhan's group
  //     meal: 2,
  //     grocery: 20,
  //   },
  //   {
  //     date: today,
  //     userId: "jmxqpxpyxkdi947nhr6foosc", // Another one
  //     groupId: "j15jwa6257pjsacg29qn0jba", // Farhan's group
  //     meal: 3,
  //     grocery: 30,
  //   },
  // ];

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
