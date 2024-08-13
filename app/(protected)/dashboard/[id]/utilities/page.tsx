import { notFound } from "next/navigation";

import { format } from "date-fns";
import {
  Bolt,
  ChefHat,
  Droplet,
  Flashlight,
  Info,
  PillBottle,
  Wifi,
} from "lucide-react";

import { validateSession } from "@/app/actions/auth";
import { getGroupDetails } from "@/app/actions/group";
import {
  getMonthlyUtilities,
  type MonthlyUtilityOutputData,
} from "@/app/actions/monthly-utility";

import MembersBills from "@/app/(protected)/dashboard/[id]/utilities/MembersBills";
import UpsertUtilitiesButton from "@/app/(protected)/dashboard/[id]/utilities/UpsertUtilitiesButton";

import InfoCard from "@/components/InfoCard";
import PageIntro from "@/components/PageIntro";
import Section from "@/components/Section";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { calculateTotalUtilities, isEmpty, isEqual } from "@/libs/utils";

export type TotalUtilities = {
  total: number;
  originalAvg: number;
  formattedAvg: number;
};

function MonthlyUtilitiesDetails({
  monthlyUtilitiesData,
  membersCount,
  groupId,
  currentMonth,
  isAdmin,
  isEditor,
}: {
  monthlyUtilitiesData: MonthlyUtilityOutputData;
  membersCount: number;
  groupId: string;
  currentMonth: string;
  isAdmin: boolean;
  isEditor: boolean;
}) {
  const { total, originalAvg, formattedAvg } = calculateTotalUtilities(
    monthlyUtilitiesData,
    membersCount
  );

  return (
    <Section
      header={`${currentMonth}'s utilities`}
      description={`Shared equally amongst groups memebers`}
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        <InfoCard
          title="Electricity"
          body={monthlyUtilitiesData.electricity}
          bodyType="currency"
          icon={Flashlight}
        />
        <InfoCard
          title="Internet"
          body={monthlyUtilitiesData.internet}
          bodyType="currency"
          icon={Wifi}
        />
        <InfoCard
          title="Water"
          body={monthlyUtilitiesData.water}
          bodyType="currency"
          icon={Droplet}
        />
        <InfoCard
          title="Gas"
          body={monthlyUtilitiesData.gas}
          bodyType="currency"
          icon={PillBottle}
        />
        <InfoCard
          title="Cook"
          body={monthlyUtilitiesData.cook}
          bodyType="currency"
          icon={ChefHat}
        />
        <InfoCard
          title="Others"
          body={monthlyUtilitiesData.otherUtils}
          bodyType="currency"
          icon={Bolt}
        />
      </div>
      <div className="mt-4">
        <div className="mb-3 flex items-center text-sm">
          <p className="inline">
            This month&apos;s total utilities are {total}.{" "}
            {membersCount > 1 ? (
              <>
                So everyone ({membersCount} members) will have to pay
                <span className="font-medium">
                  &nbsp;{formattedAvg} taka&nbsp;
                </span>
                each&nbsp;
                {formattedAvg === originalAvg ? null : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild className="inline cursor-pointer">
                        <Info className="mb-0.5 h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Actual average utility is {originalAvg} BDT</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </>
            ) : null}
          </p>
        </div>
        {isAdmin || isEditor ? (
          <UpsertUtilitiesButton
            type="update"
            groupId={groupId}
            currentMonth={currentMonth}
            monthlyUtilitiesData={monthlyUtilitiesData}
          />
        ) : null}
      </div>
    </Section>
  );
}

export default async function Page({ params }: { params: { id: string } }) {
  const groupId = params.id;

  const { user } = await validateSession();
  const monthlyUtilities = await getMonthlyUtilities(groupId);
  const groupDetails = await getGroupDetails(groupId);

  if (!user || !groupDetails.data) {
    return notFound();
  }

  const membersCount = groupDetails.data.groupMembers.length;

  const currentMonth = format(new Date(), "MMMM");

  const isAdmin = isEqual(groupDetails.data.groupInfo.ownerId, user.id)
    ? true
    : false;

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
        header="Utilities"
        description={`${currentMonth}'s electricity bill, internet bill and others`}
      />
      <div className="grid space-y-8">
        {isEmpty(monthlyUtilities.data) || !monthlyUtilities.data ? (
          <section className="text-center">
            <h2 className="text-lg font-medium">
              {currentMonth}&apos;s utilities
            </h2>
            {isAdmin || isEditor ? (
              <>
                <p className="mb-4 mt-1 text-balance text-sm text-muted-foreground">
                  Shared equally amongst group members
                </p>
                <UpsertUtilitiesButton
                  type="insert"
                  groupId={groupId}
                  currentMonth={currentMonth}
                  monthlyUtilitiesData={null}
                />
              </>
            ) : (
              <p className="mb-4 mt-1 text-balance text-sm text-muted-foreground">
                Will be available once group owner updates utilities
              </p>
            )}
          </section>
        ) : (
          <>
            <MonthlyUtilitiesDetails
              monthlyUtilitiesData={monthlyUtilities.data}
              membersCount={membersCount}
              groupId={groupId}
              currentMonth={currentMonth}
              isAdmin={isAdmin}
              isEditor={isEditor}
            />
            <MembersBills
              currentSessionUserId={user.id}
              groupOwnerId={groupDetails.data.groupInfo.ownerId}
              groupId={groupId}
              monthlyUtilitiesData={monthlyUtilities.data}
              groupMembers={groupDetails.data.groupMembers}
              currentMonth={currentMonth}
            />
          </>
        )}
      </div>
    </>
  );
}
