import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  endOfMonth,
  format,
  isWithinInterval,
  parse,
  startOfMonth,
  subMonths,
} from "date-fns";

import { APP_NAME } from "@/config";

import { validateSession } from "@/app/actions/auth";
import {
  type DailyActivityDateOutputData,
  type DailyActivityOutputData,
  getDailyActivities,
  getDailyActivitiesDates,
} from "@/app/actions/daily-activity";
import { getGroupDetails } from "@/app/actions/group";

import AddDailyActivityButton from "@/app/(protected)/dashboard/[id]/AddDailyActivityButton";
import MonthPicker from "@/app/(protected)/dashboard/[id]/MonthPicker";
import SeeBreakdownButton from "@/app/(protected)/dashboard/SeeBreakdownButton";

import PageIntro from "@/components/PageIntro";
import Stat from "@/components/Stat";
import {
  columns,
  type DailyActivityRow,
} from "@/components/tables/daily-activities/columns";
import { DataTable } from "@/components/tables/daily-activities/data-table";

import { isEmpty, isEqual } from "@/libs/utils";

export const metadata: Metadata = {
  title: "Dashboard",
  description: `Welcome to your ${APP_NAME} dashboard`,
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
  // eslint-disable-next-line no-console
  console.log("⌘ fromSP:", fromSP, new Date());
  // eslint-disable-next-line no-console
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
  const ownTotalsData = groupMembersTotals.find(
    (member) => member.userId === user.id
  );

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
  const foundMember = groupDetails.data.groupMembers.find(
    (member) => member.user.id === user.id
  );

  const isEditor = !foundMember
    ? false
    : foundMember.type === "editor"
      ? true
      : false;

  return (
    <>
      <PageIntro
        header="Dashboard"
        description={`Daily activities of ${groupDetails.data.groupInfo.name}`}
      />
      <div className="grid gap-4">
        <section className="flex justify-between">
          <div className="flex w-full flex-col gap-4 lg:flex-row lg:gap-20">
            <div className="flex gap-20">
              <Stat
                title="Groceries"
                value={totals.totalGrocery}
                helperText="bdt"
                wrapperClassName="hidden lg:block"
                titleAccentColor="bg-primary"
                titleColor="text-primary"
              />
              <Stat
                title="Meals"
                value={totals.totalMeal}
                helperText="total"
                wrapperClassName="hidden lg:block"
                titleAccentColor="bg-primary"
                titleColor="text-primary"
              />
              <Stat
                title="Meal rate"
                value={totals.avgMealRate}
                helperText="/meal"
                titleAccentColor="bg-primary"
                titleColor="text-primary"
              />
            </div>
            <hr className="block lg:hidden" />
            <div
              aria-hidden="true"
              className="hidden w-0.5 bg-muted-foreground lg:block"
            ></div>
            <div className="flex gap-20">
              <Stat
                title="My groceries"
                value={ownTotalsData?.totalGrocery ?? 0}
                helperText="bdt"
                titleAccentColor="bg-teal-600"
                titleColor="text-teal-600 dark:text-teal-400"
              />
              <Stat
                title="My meals"
                value={ownTotalsData?.totalMeal ?? 0}
                helperText="total"
                wrapperClassName="hidden lg:block"
                titleAccentColor="bg-teal-600"
                titleColor="text-teal-600 dark:text-teal-400"
              />
              <Stat
                title="My meal bill"
                value={Math.ceil(
                  ownTotalsData
                    ? ownTotalsData.totalMeal * totals.avgMealRate
                    : 0 * totals.avgMealRate
                )}
                helperText="bdt"
                titleAccentColor="bg-teal-600"
                titleColor="text-teal-600 dark:text-teal-400"
              />
            </div>
          </div>
          <div className="-mr-1 hidden shrink-0 flex-col lg:flex">
            <SeeBreakdownButton
              groupMembersTotals={groupMembersTotals}
              avgMealRate={totals.avgMealRate}
            />
          </div>
        </section>
        <hr className="text-muted-foreground" />
        <div className="grid gap-4">
          <div className="flex flex-col items-start justify-end gap-4 sm:flex-row">
            {isEmpty(months) ? null : <MonthPicker months={months} />}
            {isAdmin || isEditor ? (
              <AddDailyActivityButton
                groupMembers={groupDetails.data.groupMembers}
                disabledDates={disabledDates}
              />
            ) : null}
          </div>
          <DataTable data={sortedActivities} columns={columns} />
        </div>
      </div>
    </>
  );
}

export default Page;
