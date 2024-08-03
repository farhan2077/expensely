import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  DollarSign,
  CookingPot,
  Utensils,
  UtensilsCrossed,
  Banknote,
} from "lucide-react";

import { getGroupDetails } from "@/app/actions/group";
import {
  parse,
  format,
  isWithinInterval,
  subMonths,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import {
  getDailyActivities,
  getDailyActivitiesDates,
  type DailyActivityOutputData,
  type DailyActivityDateOutputData,
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
import { isEqual, isEmpty } from "@/libs/utils";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Welcome to your expensely dashboard",
};

export type MemberTotal = {
  userId: string;
  name: string;
  totalMeal: number;
  totalGrocery: number;
};

export function calculateMembersTotals(
  data: DailyActivityOutputData[]
): MemberTotal[] {
  const output = data.reduce((acc: MemberTotal[], curr) => {
    const existingUser = acc.find((obj) => obj.userId === curr.userId);

    if (existingUser) {
      existingUser.totalMeal += curr.meal;
      existingUser.totalGrocery += curr.grocery;
    } else {
      acc.push({
        userId: curr.userId,
        name: curr.user.name,
        totalMeal: curr.meal,
        totalGrocery: curr.grocery,
      });
    }

    return acc;
  }, []);

  return output;
}

export type AllTotals = {
  totalMeal: number;
  totalGrocery: number;
  avgMealRate: number;
};

export function calculateTotals(data: DailyActivityOutputData[]): AllTotals {
  let totalMeal = 0;
  let totalGrocery = 0;
  let avgMealRate = 0;

  data.forEach((item) => {
    totalMeal += item.meal;
    totalGrocery += item.grocery;
  });

  if (totalMeal === 0) {
    avgMealRate = 0;
  } else {
    avgMealRate = Number((totalGrocery / totalMeal).toFixed(2));
  }

  return { totalMeal, totalGrocery, avgMealRate };
}

//* 1a. transform the data to be used in data table
function transformDailyActivities(
  data: DailyActivityOutputData[]
): DailyActivityRow[] {
  const output = data.reduce((acc: DailyActivityRow[], curr) => {
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
  }, []);

  return output;
}

//* 1b. transform the data to be used in month picker and to show disabled dates while adding data
function transformDailyActivitiesDates(
  data: DailyActivityDateOutputData[]
): DailyActivityDateOutputData[] {
  const output = data.reduce((acc: DailyActivityDateOutputData[], curr) => {
    const existingGroup = acc.find((group) => group.date === curr.date);

    if (!existingGroup) {
      acc.push({
        date: curr.date,
      });
    }

    return acc;
  }, []);

  return output;
}

//* 2. sort both daily activities and daily activities dates
function sortByDate<
  T extends DailyActivityRow[] | DailyActivityDateOutputData[],
>(data: T, type: "asc" | "desc"): T {
  // asc = 1 2 3 4 5
  // desc = 5 4 3 2 1

  if (type === "desc") {
    return data.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ) as T;
  }

  // type === "asc"
  return data.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  ) as T;
}

type UniqueMonthInput = {
  date: string;
};
export type UniqueMonthOutput = {
  month: string;
};

//* 3b. from sorted daily activites dates, get unique months only
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

//* 3. from transformed daily activites dates, get last 2 months' dates (on which day there we activities)
function getLastTwoMonthsDates(array: DailyActivityDateOutputData[]): string[] {
  const today = new Date();
  const startOfLastMonth = startOfMonth(subMonths(today, 1));
  const endOfCurrentMonth = endOfMonth(today);

  return array
    .filter((item) => {
      const itemDate = parse(item.date, "MM/dd/yyyy", new Date());
      return isWithinInterval(itemDate, {
        start: startOfLastMonth,
        end: endOfCurrentMonth,
      });
    })
    .map((item) => item.date);
}

type PageProps = {
  params: { id: string };
  searchParams: {
    from?: string;
    to?: string;
  };
};

async function Page({ params, searchParams }: PageProps) {
  const groupId = params.id;
  const fromSP = searchParams.from || "";
  const toSP = searchParams.to || "";

  // TODO: there's some issue with the page still showing previously selected month's data when clicked on the logo or overview or coming back to other page to this page
  // TODO: need to fix this later, for now this works, idk how
  console.log("⌘ fromSP:", fromSP, new Date());
  console.log("⌘ toSP:", toSP, new Date());

  const { user } = await validateSession();
  const groupDetails = await getGroupDetails(groupId);
  const dailyActivities = await getDailyActivities(groupId, fromSP, toSP);
  const dailyActivitiesMonths = await getDailyActivitiesDates(groupId);

  if (
    !user ||
    !groupDetails.data ||
    !dailyActivities.success ||
    !dailyActivities.data ||
    !dailyActivitiesMonths.success ||
    !dailyActivitiesMonths.data
  ) {
    notFound();
  }

  // daily activities
  const totals = calculateTotals(dailyActivities.data);
  const groupMembersTotals = calculateMembersTotals(dailyActivities.data);

  const transformedActivities = transformDailyActivities(dailyActivities.data);
  const sortedActivities = sortByDate(transformedActivities, "desc");

  // months
  const transformedMonths = transformDailyActivitiesDates(
    dailyActivitiesMonths.data
  );
  const disabledDates = getLastTwoMonthsDates(transformedMonths);
  const sortedMonths = sortByDate(transformedMonths, "desc");
  const months = extractUniqueMonths(sortedMonths);

  const isAdmin = isEqual(user.id, groupDetails.data.groupInfo.ownerId);

  return (
    <div className="grid gap-4">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Take a look at what&apos;s happening in{" "}
          {groupDetails.data.groupInfo.name}
        </p>
      </section>
      <hr className="text-muted-foreground" />
      <section className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <InfoCard
          title="Total grocery costs"
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
      </section>
      {groupMembersTotals.length > 0 && (
        <section>
          <h2 className="my-4 text-lg font-bold leading-none">
            Everyone&apos;s grocery costs and meals so far
          </h2>

          <div className="flex divide-x-2 divide-border">
            {groupMembersTotals.map((member) => {
              return (
                <div key={member.userId} className="px-8 first:pl-0 last:pr-0">
                  <p className="text-sm font-medium">{member.name}</p>
                  <div className="mt-1">
                    <div className="flex items-center gap-2">
                      <Banknote className="h-4 w-4" />
                      <span className="text-sm tabular-nums">
                        {member.totalGrocery} BDT
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UtensilsCrossed className="h-4 w-4" />
                      <span className="text-sm tabular-nums">
                        {/* symbol source: https://www.toptal.com/designers/htmlarrows/arrows/, Wedge-Tailed Right Arrow */}
                        {member.totalMeal} meals (&#10172;&nbsp;
                        {Math.ceil(member.totalMeal * totals.avgMealRate)} BDT)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
      <div className="mt-4 flex flex-col items-start justify-end gap-4 sm:flex-row">
        {isEmpty(months) ? null : <MonthPicker months={months} />}
        {isAdmin ? (
          <AddDailyActivityButton
            groupMembers={groupDetails.data.groupMembers}
            disabledDates={disabledDates}
          />
        ) : null}
      </div>
      <DataTable data={sortedActivities} columns={columns} />
    </div>
  );
}

export default Page;
