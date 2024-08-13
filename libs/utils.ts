import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { type MonthlyUtilityOutputData } from "@/app/actions/monthly-utility";

import { type TotalUtilities } from "@/app/(protected)/dashboard/[id]/bills/page";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isEmpty(input: any): boolean {
  if (input === undefined || input === null) {
    return true;
  }

  if (typeof input === "object" && Object.keys(input).length === 0) {
    return true;
  }

  if (typeof input === "string" && input.trim().length === 0) {
    return true;
  }

  return false;
}

export function logRuntimeType(type: "client" | "server") {
  if (type === "client") {
    // eslint-disable-next-line no-console
    console.log("%c----- CLIENT -----", "color: lightgreen;");
  }

  if (type === "server") {
    // eslint-disable-next-line no-console
    console.log("\x1b[34m%s\x1b[0m", "----- SERVER -----");
  }
}

export function isEqual<T extends string | number>(a: T, b: T): boolean {
  return a === b;
}

export function calculateTotalUtilities(
  data: MonthlyUtilityOutputData,
  membersCount: number
): TotalUtilities {
  const electricity = data.electricity;
  const internet = data.internet;
  const water = data.water;
  const gas = data.gas;
  const cook = data.cook;
  const otherUtils = data.otherUtils;

  const total = electricity + internet + water + gas + cook + otherUtils;
  const avg = total / membersCount;

  const originalAvg = Number(avg.toFixed(2));
  const formattedAvg = Math.ceil(avg);

  return { total, originalAvg, formattedAvg };
}

export function getFirstName(fullName: string): string {
  return fullName.split(" ")[0];
}
