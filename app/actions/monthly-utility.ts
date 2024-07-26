"use server";

import { revalidatePath } from "next/cache";
import { and, eq, gte, lte } from "drizzle-orm";
import { startOfMonth, endOfMonth, format } from "date-fns";

import { db } from "@/db";
import { monthlyUtilitiesTable } from "@/db/schema";
import { Response } from "@/libs/types";

type MonthlyUtilityInput = {
  groupId: string;
  electricity: number;
  internet: number;
  water: number;
  gas: number;
  cook: number;
  otherUtils: number;
};

export type MonthlyUtilityOutputData = {
  id: string;
  date: string;
  groupId: string;
  electricity: number;
  internet: number;
  water: number;
  gas: number;
  cook: number;
  otherUtils: number;
};

export async function getMonthlyUtilities(
  groupId: string
): Promise<Response<MonthlyUtilityOutputData>> {
  const today = new Date();

  const defaultFromDate = format(startOfMonth(today), "P");
  const defaultToDate = format(endOfMonth(today), "P");

  const result = await db.query.monthlyUtilitiesTable.findFirst({
    where: and(
      eq(monthlyUtilitiesTable.groupId, groupId),
      gte(monthlyUtilitiesTable.date, defaultFromDate),
      lte(monthlyUtilitiesTable.date, defaultToDate)
    ),
  });

  if (!result) {
    return {
      success: false,
      message: "Monthly utilities not found",
    };
  }

  return {
    success: true,
    message: "Monthly utilities found",
    data: result,
  };
}

export async function addMonthlyUtilities(
  data: MonthlyUtilityInput
): Promise<Response> {
  const today = format(new Date(), "P");

  const result = await db.insert(monthlyUtilitiesTable).values({
    date: today,
    groupId: data.groupId,
    cook: data.cook,
    electricity: data.electricity,
    gas: data.gas,
    internet: data.internet,
    water: data.water,
    otherUtils: data.otherUtils,
  });

  if (!result) {
    return {
      success: false,
      message: "Monthly utilities could not be added",
    };
  }

  revalidatePath("/(protected)/dashboard/[id]", "layout");

  return {
    success: true,
    message: "New data added to daily activities",
  };
}

export async function updateMonthlyUtilities(
  data: MonthlyUtilityInput,
  id: string
): Promise<Response> {
  const result = await db
    .update(monthlyUtilitiesTable)
    .set({
      cook: data.cook,
      electricity: data.electricity,
      gas: data.gas,
      internet: data.internet,
      water: data.water,
      otherUtils: data.otherUtils,
    })
    .where(eq(monthlyUtilitiesTable.id, id));

  if (!result) {
    return {
      success: false,
      message: "Monthly utilities could not be updated",
    };
  }

  revalidatePath("/(protected)/dashboard/[id]", "layout");

  return {
    success: true,
    message: "New data updated to daily activities",
  };
}
