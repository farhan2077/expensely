import { notFound } from "next/navigation";

import {
  addDays,
  format,
  getDaysInMonth,
  isWithinInterval,
  startOfMonth,
} from "date-fns";

import { getGroupOrderInfo } from "@/app/actions/group-order";

import { SortableOrder } from "@/app/(protected)/dashboard/[id]/order/SortableOrder";

import PageIntro from "@/components/PageIntro";
import Section from "@/components/Section";
import { Input } from "@/components/ui/input";

import { cn } from "@/libs/utils";

function divideMonthIntoSegments(divisor: number) {
  const currentDate = new Date();
  const firstDayOfMonth = startOfMonth(currentDate);
  const totalDays = getDaysInMonth(currentDate);

  const baseDaysPerSegment = Math.floor(totalDays / divisor);
  const remainingDays = totalDays % divisor;

  let result = [];
  let startDate = firstDayOfMonth;

  for (let i = 0; i < divisor; i++) {
    let endDate = addDays(startDate, baseDaysPerSegment - 1); // why -1, becuase it already includes startDate

    // distribute remaining days until there's none
    if (i < remainingDays) {
      endDate = addDays(endDate, 1);
    }

    const isActive = isWithinInterval(currentDate, {
      start: startDate,
      end: endDate,
    });

    result.push({
      index: i,
      range: {
        start: format(startDate, "dd MMM"),
        end: format(endDate, "dd MMM"),
      },
      isActive,
    });

    startDate = addDays(endDate, 1);
  }

  return result;
}

export default async function Page({ params }: { params: { id: string } }) {
  const groupId = params.id;

  const groupOrderInfo = await getGroupOrderInfo(groupId);

  if (!groupOrderInfo || !groupOrderInfo.data) {
    notFound();
  }
  const groupOrderInfoDataCount = groupOrderInfo.data.length;
  const monthSegments = divideMonthIntoSegments(groupOrderInfoDataCount);

  const activeItem = monthSegments.find((item) => item.isActive === true);
  const activeIdx = activeItem ? activeItem.index : -1;

  const currentMonth = format(new Date(), "MMMM");

  return (
    <>
      <PageIntro header="Responsibilities" description="See who is in charge" />
      <Section
        header={`Order for ${currentMonth}`}
        description={`See who is currently in charge`}
      >
        <div className="flex gap-4 overflow-scroll">
          <div className="flex w-1/2 shrink-0 flex-col gap-2 sm:w-fit">
            {monthSegments.map((segment) => {
              const text = segment.range.start + " to " + segment.range.end;

              return (
                <div key={segment.index}>
                  <Input
                    defaultValue={text}
                    className={cn("cursor-auto focus-visible:ring-0", {
                      "border-primary/80 bg-primary-foreground":
                        segment.index === activeIdx,
                    })}
                    readOnly
                  />
                </div>
              );
            })}
          </div>
          <SortableOrder
            groupId={groupId}
            groupOrderInfoData={groupOrderInfo.data}
            activeIdx={activeIdx}
          />
        </div>
      </Section>
    </>
  );
}
