import { notFound } from "next/navigation";

import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { CheckCircle2, PlusCircleIcon } from "lucide-react";

import { getDailyActivities } from "@/app/actions/daily-activity";
import {
  getMonthlyActivities,
  type MonthlyActivityOutputData,
} from "@/app/actions/monthly-activity";
import { MonthlyUtilityOutputData } from "@/app/actions/monthly-utility";

import {
  type AllTotals,
  calculateMembersTotals,
  calculateTotals,
  type MemberTotal,
} from "@/app/(protected)/dashboard/[id]/page";
import AddMonthlyActivitiesButton from "@/app/(protected)/dashboard/[id]/utilities/AddMonthlyActivitiesButton";
import EditMonthlyActivityButton from "@/app/(protected)/dashboard/[id]/utilities/EditMonthlyActivityButton";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { calculateTotalUtilities, cn, isEmpty, isEqual } from "@/libs/utils";
import Section from "@/components/Section";

type MembersBillsDetailsCardT = {
  id: string;
  name: string;
  rent: number;
  paid: number;
  utility: number;
  lastMonthGroceryCost: number;
  lastMonthTotalMeal: number;
  lastMonthAvgMealRate: number;
};

function calcMembersBills(
  monthlyActivitiesData: MonthlyActivityOutputData[],
  lastMonthGroupMembersTotals: MemberTotal[],
  lastMonthAvgMealRate: number,
  currentMonthAvgUtilities: number
): MembersBillsDetailsCardT[] {
  const formattedData = [];

  for (let i = 0; i < monthlyActivitiesData.length; i++) {
    const currentMonthlyActivity = monthlyActivitiesData[i];
    const currentUserId = monthlyActivitiesData[i].userId;

    const foundItem = lastMonthGroupMembersTotals.find(
      (item) => item.userId === currentUserId
    );

    formattedData.push({
      id: currentMonthlyActivity.id,
      name: currentMonthlyActivity.user.name,
      rent: currentMonthlyActivity.rent,
      paid: currentMonthlyActivity.paid,
      utility: currentMonthAvgUtilities,
      lastMonthGroceryCost: !foundItem ? 0 : foundItem.totalGrocery,
      lastMonthTotalMeal: !foundItem ? 0 : foundItem.totalMeal,
      lastMonthAvgMealRate: lastMonthAvgMealRate,
    });
  }

  return formattedData;
}

function MembersBillsDetailsCard({
  // eslint-disable-next-line no-unused-vars
  id,
  name,
  rent,
  paid,
  utility,
  lastMonthGroceryCost,
  lastMonthTotalMeal,
  lastMonthAvgMealRate,
}: MembersBillsDetailsCardT) {
  const lastMonthMealBill = Math.ceil(
    lastMonthTotalMeal * lastMonthAvgMealRate
  );
  let prevDue = lastMonthMealBill - lastMonthGroceryCost;
  const totalToPay = rent + utility + prevDue;

  // the users has not eaten a single meal, therefore he will not have any
  if (lastMonthTotalMeal === 0) {
    prevDue = 0;
  }

  const hasPrevDue = prevDue > 0;
  const hasPaidLess = totalToPay > paid;
  const hasPaidMore = paid > totalToPay;

  return (
    <Card
      className={cn("group", {
        "border-destructive": hasPaidLess || hasPaidMore,
      })}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-1.5">
          <p className="text-base font-medium">{name}</p>
          {hasPaidLess ? (
            <PlusCircleIcon className="h-6 w-6 rotate-45 fill-destructive text-background" />
          ) : (
            <CheckCircle2 className="h-6 w-6 fill-green-500 text-background" />
          )}
        </CardTitle>
        <EditMonthlyActivityButton
          id={id}
          name={name}
          prevRent={rent}
          prevPaid={paid}
          totalToPay={totalToPay}
        />
      </CardHeader>
      <CardContent className="-mt-2 ">
        <div className="grid gap-2">
          <div className="flex justify-between text-sm">
            <span>Rent</span>
            <span className="tabular-nums">{rent}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Utilities</span>
            <span className="tabular-nums">{utility}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Due (prev month)</span>
            <span
              className={cn("font-medium tabular-nums", {
                "text-destructive": hasPrevDue,
                "text-green-600": !hasPrevDue,
              })}
            >
              {hasPrevDue ? `+${prevDue}` : prevDue}
            </span>
          </div>
          <hr className="my-0.5" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span className="font-medium">Total</span>
            <span className="font-medium">{totalToPay}</span>
          </div>
          <div
            className={cn("flex justify-between text-sm", {
              "text-destructive": hasPaidLess,
            })}
          >
            <span className="font-medium">Paid</span>
            <span className="font-medium">{paid === 0 ? "Not yet" : paid}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MembersBillsDetails({
  membersBillsArray,
  currentMonth,
}: {
  membersBillsArray: MembersBillsDetailsCardT[];
  currentMonth: string;
}) {
  return (
    <>
      <hr />
      <Section
        header={`Group members' bills`}
        description={`Track each memberss payment for ${currentMonth}`}
      >
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {membersBillsArray.map((member) => {
            return (
              <MembersBillsDetailsCard
                id={member.id}
                key={member.id}
                name={member.name}
                rent={member.rent}
                utility={member.utility}
                paid={member.paid}
                lastMonthGroceryCost={member.lastMonthGroceryCost}
                lastMonthTotalMeal={member.lastMonthTotalMeal}
                lastMonthAvgMealRate={member.lastMonthAvgMealRate}
              />
            );
          })}
        </div>
      </Section>
    </>
  );
}

export default async function MembersBills({
  currentSessionUserId,
  groupOwnerId,
  groupId,
  monthlyUtilitiesData,
  groupMembers,
  currentMonth,
}: {
  currentSessionUserId: string;
  groupOwnerId: string;
  groupId: string;
  monthlyUtilitiesData: MonthlyUtilityOutputData;
  groupMembers: any;
  currentMonth: string;
}) {
  const monthlyActivities = await getMonthlyActivities(monthlyUtilitiesData.id);
  const utilDate = monthlyUtilitiesData.date;

  const lastMonthFromDate = format(startOfMonth(subMonths(utilDate, 1)), "P");
  const lastMonthToDate = format(endOfMonth(subMonths(utilDate, 1)), "P");

  const dailyActivities = await getDailyActivities(
    groupId,
    lastMonthFromDate,
    lastMonthToDate
  );

  if (
    !dailyActivities.success ||
    !dailyActivities.data ||
    !monthlyActivities.data
  ) {
    notFound();
  }

  // eslint-disable-next-line no-unused-vars
  const { totalMeal, totalGrocery, avgMealRate }: AllTotals = calculateTotals(
    dailyActivities.data
  );
  const lastMonthGroupMembersTotals = calculateMembersTotals(
    dailyActivities.data
  );
  const lastMonthAvgMealRate = avgMealRate;

  const membersCount = groupMembers.length;
  // eslint-disable-next-line no-unused-vars
  const { total, originalAvg, formattedAvg } = calculateTotalUtilities(
    monthlyUtilitiesData,
    membersCount
  );
  const currentMonthAvgUtilities = formattedAvg;

  const membersBillsArray = calcMembersBills(
    monthlyActivities.data,
    lastMonthGroupMembersTotals,
    lastMonthAvgMealRate,
    currentMonthAvgUtilities
  );

  const isAdmin = isEqual(currentSessionUserId, groupOwnerId);

  return (
    <>
      {!monthlyActivities ||
      !monthlyActivities.data ||
      isEmpty(monthlyActivities.data) ? (
        <>
          <hr />
          <section className="text-center">
            <h2 className="text-lg font-medium">Group members&apos; bills</h2>
            {isAdmin ? (
              <>
                <p className="mb-4 mt-1 text-balance text-sm text-muted-foreground">
                  Track each members&apos; payment for {currentMonth}
                </p>
                <AddMonthlyActivitiesButton
                  utilityId={monthlyUtilitiesData.id}
                  groupMembers={groupMembers}
                />
              </>
            ) : (
              <p className="mb-4 mt-1 text-balance text-sm text-muted-foreground">
                Will be available once group owner updates utilities
              </p>
            )}
          </section>
        </>
      ) : (
        <MembersBillsDetails
          membersBillsArray={membersBillsArray}
          currentMonth={currentMonth}
        />
      )}
    </>
  );
}
