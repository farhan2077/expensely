import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DollarSign, CookingPot, Utensils } from "lucide-react";

import { getGroupInfo } from "@/app/actions/group";
import { getDailyGroupActivities } from "@/app/actions/daily-activity";
import InfoCard from "@/components/InfoCard";
import {
  columns,
  type DailyActivity,
} from "@/components/tables/daily-activities/columns";
import AddDailyActivityButton from "@/app/(protected)/dashboard/[id]/AddDailyActivityButton";
import { DataTable } from "@/components/tables/daily-activities/data-table";
// import { PrettyJSONFormatter } from "@/libs/formatters";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Welcome to your expensely dashboard",
};

function calculateTotals(data: DailyActivity[]): {
  totalMeal: number;
  totalGrocery: number;
  avgMealRate: number;
} {
  let totalMeal = 0;
  let totalGrocery = 0;
  let avgMealRate = 0;

  data.forEach((day) => {
    day.rest.forEach((item: any) => {
      totalMeal += item.meal;
      totalGrocery += item.grocery;
    });
  });

  if (totalMeal === 0) {
    avgMealRate = 0;
  } else {
    avgMealRate = totalGrocery / totalMeal;
  }

  return { totalMeal, totalGrocery, avgMealRate };
}

function sortDataByDate(data: DailyActivity[]): DailyActivity[] {
  return data.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

type InputData = {
  date: string;
  id: string;
  userId: string;
  groupId: string;
  meal: number;
  grocery: number;
  user: {
    name: string;
  };
}[];

function transformDailyActivitiesDataFormat(
  dailyActivitiesData: InputData
): DailyActivity[] {
  const transformedData = dailyActivitiesData.reduce(
    (acc: DailyActivity[], curr) => {
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

async function Page({ params }: { params: { id: string } }) {
  const groupId = params.id;

  const result = await getGroupInfo(groupId);
  const dailyActivities = await getDailyGroupActivities(groupId);

  if (!result.success || !dailyActivities.success || !dailyActivities.data) {
    notFound();
  }

  const transformedDailyActivitiesData = transformDailyActivitiesDataFormat(
    dailyActivities.data
  );

  const sortedFormattedDailyActivities = sortDataByDate(
    transformedDailyActivitiesData
  );

  const totals = calculateTotals(transformedDailyActivitiesData);

  return (
    <main>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground">
        Take a look at what&apos;s happening in {result.data.groupInfo.name}
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
        {/* <PrettyJSONFormatter data={sortedFormattedDailyActivities} /> */}
        <div className="flex items-center justify-end gap-4">
          <AddDailyActivityButton groupMembers={result.data.groupMembers} />
        </div>
      </div>
      <DataTable data={sortedFormattedDailyActivities} columns={columns} />
    </main>
  );
}

export default Page;
