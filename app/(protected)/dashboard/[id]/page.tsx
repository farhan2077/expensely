import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DollarSign, CookingPot, Utensils } from "lucide-react";

import { getGroupInfo } from "@/app/actions/group";
import { parse, format } from "date-fns";
import {
  getDailyGroupActivities,
  getDailyGroupActivitiesMonths,
  type DailyGroupActivity,
} from "@/app/actions/daily-activity";
import {
  columns,
  type DailyActivityRow,
} from "@/components/tables/daily-activities/columns";
import AddDailyActivityButton from "@/app/(protected)/dashboard/[id]/AddDailyActivityButton";

import InfoCard from "@/components/InfoCard";
import { DataTable } from "@/components/tables/daily-activities/data-table";
import MonthPicker from "@/app/(protected)/dashboard/[id]/MonthPicker";
import { validateSession } from "@/app/actions/auth";
import { isEqual } from "@/libs/utils";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Welcome to your expensely dashboard",
};

//* 1. Transform the data to be used in data table and month picker
function transformData(
  dailyGrpActivitiesData: DailyGroupActivity[]
): DailyActivityRow[] {
  const transformedData = dailyGrpActivitiesData.reduce(
    (acc: DailyActivityRow[], curr) => {
      const existingGroup = acc.find((group) => group.date === curr.date);

      if (existingGroup) {
        existingGroup.rest.push({ ...curr });
      } else {
        acc.push({
          date: curr.date,
          rest: [{ ...curr }],
        });
      }

      return acc;
    },
    []
  );

  return transformedData;
}

//* 2. Ascending or descending sort
function sortByDate(
  data: DailyActivityRow[],
  type: "asc" | "desc"
): DailyActivityRow[] {
  // asc = 1 2 3 4 5
  // desc = 5 4 3 2 1

  if (type === "desc") {
    return data.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  // type === "asc"
  return data.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

//* 3.
function calculateTotals(data: DailyActivityRow[]): {
  totalMeal: number;
  totalGrocery: number;
  avgMealRate: number;
} {
  let totalMeal = 0;
  let totalGrocery = 0;
  let avgMealRate = 0;

  data.forEach((day) => {
    day.rest.forEach((item) => {
      totalMeal += item.meal;
      totalGrocery += item.grocery;
    });
  });

  if (totalMeal === 0) {
    avgMealRate = 0;
  } else {
    avgMealRate = Number((totalGrocery / totalMeal).toFixed(2));
  }

  return { totalMeal, totalGrocery, avgMealRate };
}

type UniqueMonthInput = {
  date: string;
};
export type UniqueMonthOutput = {
  month: string;
};

//* 4. From the sorted data, get the unique months only
function extractUniqueMonths(data: UniqueMonthInput[]): UniqueMonthOutput[] {
  const uniqueMonths = new Map<string, UniqueMonthOutput>();

  data.forEach((item) => {
    const date = parse(item.date, "MM/dd/yyyy", new Date());
    const month = format(date, "MMMM yyyy");

    if (!uniqueMonths.has(month)) {
      uniqueMonths.set(month, { month });
    }
  });

  return Array.from(uniqueMonths.values());
}

type PageProps = {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
};

async function Page({ params, searchParams }: PageProps) {
  const groupId = params.id;
  const fromSP = searchParams.from;
  const toSP = searchParams.to;

  const { user } = await validateSession();
  const groupInfo = await getGroupInfo(groupId);
  const dailyGrpActivities = await getDailyGroupActivities(
    groupId,
    !fromSP ? "" : fromSP,
    !toSP ? "" : toSP
  );
  const dailyGrpActivitiesMonths = await getDailyGroupActivitiesMonths(groupId);

  if (
    !user ||
    !groupInfo.success ||
    !dailyGrpActivities.success ||
    !dailyGrpActivities.data ||
    !dailyGrpActivitiesMonths.data
  ) {
    notFound();
  }

  // daily activities
  const transformedActivities = transformData(dailyGrpActivities.data);
  const sortedActivities = sortByDate(transformedActivities, "desc");
  const totals = calculateTotals(transformedActivities);

  // months
  const transformedMonths = transformData(dailyGrpActivitiesMonths.data);
  const sortedMonths = sortByDate(transformedMonths, "desc");
  const months = extractUniqueMonths(sortedMonths);

  return (
    <main>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground">
        Take a look at what&apos;s happening in {groupInfo.data.groupInfo.name}
      </p>
      <hr className="my-4 text-muted-foreground" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <InfoCard
          title="Total bazar costs"
          body={totals.totalGrocery}
          bodyType="currency"
          icon={DollarSign}
        />
        <InfoCard
          title="Total meals"
          body={totals.totalMeal}
          bodyType="number"
          icon={CookingPot}
        />
        <InfoCard
          title="Meal rate"
          body={totals.avgMealRate}
          bodyType="number"
          icon={Utensils}
        />
      </div>
      <div className="my-4">
        <div className="flex items-center justify-end gap-4">
          <MonthPicker months={months} />
          {isEqual(user.id, groupInfo.data.groupInfo.ownerId) ? (
            <AddDailyActivityButton
              groupMembers={groupInfo.data.groupMembers}
            />
          ) : null}
        </div>
      </div>
      <DataTable data={sortedActivities} columns={columns} />
    </main>
  );
}

export default Page;
