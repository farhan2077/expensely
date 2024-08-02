import { notFound } from "next/navigation";

import { SortableOrder } from "@/app/(protected)/dashboard/[id]/order/SortableOrder";
import { getGroupOrderInfo } from "@/app/actions/group-order";
import {
  format,
  addDays,
  startOfMonth,
  getDaysInMonth,
  isWithinInterval,
} from "date-fns";

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
      <h1 className="text-2xl font-semibold tracking-tight">
        Responsibilities
      </h1>
      <p className="text-muted-foreground">See who is in charge</p>
      <hr className="my-4 text-muted-foreground" />
      <div className="grid space-y-8">
        <section className="flex gap-8">
          <div className="-ml-3 w-[250px] shrink-0 px-3">
            <h2 className="text-lg font-medium">Order for {currentMonth}</h2>
            <p className="mt-1 text-balance text-sm text-muted-foreground">
              See who is currently in charge
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex shrink-0 flex-col gap-2">
              {monthSegments.map((segment) => {
                const text = segment.range.start + " to " + segment.range.end;

                return (
                  <div key={segment.index} className="w-fit">
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
        </section>
      </div>
    </>
  );
}
