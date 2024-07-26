import { notFound } from "next/navigation";
import {
  Flashlight,
  Droplet,
  Wifi,
  PillBottle,
  ChefHat,
  Bolt,
  Info,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import InfoCard from "@/components/InfoCard";
import {
  getMonthlyUtilities,
  type MonthlyUtilityOutputData,
} from "@/app/actions/monthly-utility";
import { isEmpty, isEqual, calculateTotalUtilities } from "@/libs/utils";
import { getGroupInfo } from "@/app/actions/group";
import MembersBills from "@/app/(protected)/dashboard/[id]/utilities/MembersBills";
import { validateSession } from "@/app/actions/auth";
import { format } from "date-fns";
import UpsertUtilitiesButton from "@/app/(protected)/dashboard/[id]/utilities/UpsertUtilitiesButton";

export type TotalUtilities = {
  total: number;
  originalAvg: string;
  formattedAvg: number;
};

function MonthlyUtilitiesDetails({
  monthlyUtilitiesData,
  membersCount,
  groupId,
  currentMonth,
}: {
  monthlyUtilitiesData: MonthlyUtilityOutputData;
  membersCount: number;
  groupId: string;
  currentMonth: string;
}) {
  const { total, originalAvg, formattedAvg } = calculateTotalUtilities(
    monthlyUtilitiesData,
    membersCount
  );

  return (
    <section className="flex gap-8">
      <div className="-ml-3 w-[250px] shrink-0 px-3">
        <h2 className="text-lg font-medium">{currentMonth}&apos;s utilities</h2>
        <p className="mt-1 text-balance text-sm text-muted-foreground">
          Shared equally amongst groups memebers
        </p>
      </div>
      <div className="w-full">
        <div className="grid grid-cols-6 gap-4">
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
            <p>
              This month&apos;s total utilities are {total}.{" "}
              {membersCount > 1 ? (
                <>
                  So everyone ({membersCount} members) will have to pay{" "}
                  <span className="font-medium">{formattedAvg} taka</span> each
                </>
              ) : null}
            </p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild className="cursor-pointer">
                  <Info className="ml-1 h-3 w-3" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Actual average utility is {originalAvg} BDT</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <UpsertUtilitiesButton
            type="update"
            groupId={groupId}
            currentMonth={currentMonth}
            monthlyUtilitiesData={monthlyUtilitiesData}
          />
        </div>
      </div>
    </section>
  );
}

export default async function Page({ params }: { params: { id: string } }) {
  const groupId = params.id;

  const { user } = await validateSession();
  const monthlyUtilities = await getMonthlyUtilities(groupId);
  const groupInfo = await getGroupInfo(groupId);

  if (!user || !groupInfo.data) {
    return notFound();
  }

  const membersCount = groupInfo.data.groupMembers.length;

  const currentMonth = format(new Date(), "MMMM");

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Utilities</h1>
      <p className="text-muted-foreground">
        Current month&apos;s electricity bill, internet bill and others
      </p>
      <hr className="my-4 text-muted-foreground" />
      <div className="grid space-y-8">
        {isEmpty(monthlyUtilities.data) || !monthlyUtilities.data ? (
          <section className="text-center">
            <h2 className="text-lg font-medium">Utilities</h2>
            {isEqual(user.id, groupInfo.data.groupInfo.ownerId) ? (
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
            />
            <MembersBills
              currentSessionUserId={user.id}
              groupOwnerId={groupInfo.data.groupInfo.ownerId}
              groupId={groupId}
              monthlyUtilitiesData={monthlyUtilities.data}
              groupMembers={groupInfo.data.groupMembers}
              currentMonth={currentMonth}
            />
          </>
        )}
      </div>
    </>
  );
}
