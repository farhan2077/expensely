"use server";

import { revalidatePath } from "next/cache";

import { endOfMonth, format, startOfMonth } from "date-fns";
import { and, eq, gte, lte } from "drizzle-orm";

import { db } from "@/db";
import { monthlyActivitiesTable } from "@/db/schema";

import { Response } from "@/libs/types";

export type MonthlyActivityInput = {
  date: string;
  rent: number;
  paid: number;
  utilityId: string;
  userId: string;
};

export type MonthlyActivityOutputData = {
  id: string;
  utilityId: string;
  date: string;
  rent: number;
  paid: number;
  userId: string;
  user: {
    id: string;
    name: string;
  };
};

export async function getMonthlyActivities(
  utilityId: string
): Promise<Response<MonthlyActivityOutputData[]>> {
  const today = new Date();

  const defaultFromDate = format(startOfMonth(today), "P");
  const defaultToDate = format(endOfMonth(today), "P");

  const result = await db.query.monthlyActivitiesTable.findMany({
    where: and(
      eq(monthlyActivitiesTable.utilityId, utilityId),
      gte(monthlyActivitiesTable.date, defaultFromDate),
      lte(monthlyActivitiesTable.date, defaultToDate)
    ),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!result) {
    return {
      success: false,
      message: "Monthly activities not found",
    };
  }

  return {
    success: true,
    message: "Monthly activities found",
    data: result,
  };
}

export async function addMonthlyActivity(
  activities: MonthlyActivityInput[]
): Promise<Response> {
  try {
    const results = await db.transaction(async (tx) => {
      const insertedActivities = [];

      for (const activity of activities) {
        const [inserted] = await tx
          .insert(monthlyActivitiesTable)
          .values(activity)
          .returning();
        insertedActivities.push(inserted);
      }

      return insertedActivities;
    });

    if (!results) {
      return {
        success: false,
        message: "There was an error while adding monthly activities",
      };
    }

    revalidatePath("/(protected)/dashboard/[id]", "layout");

    return {
      success: true,
      message: "New data added to monthly activities",
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

export async function updateMonthlyActivity(
  id: string,
  rent: number,
  paid: number
): Promise<Response> {
  const result = await db
    .update(monthlyActivitiesTable)
    .set({
      rent: rent,
      paid: paid,
    })
    .where(eq(monthlyActivitiesTable.id, id))
    .returning();

  revalidatePath("/(protected)/dashboard/[id]", "layout");

  if (!result)
    return {
      success: false,
      message: "Monthly data could not be updated",
    };

  return {
    success: true,
    message: "Monthly data updated successfully",
  };
}
