"use client";

import { useCallback, useState } from "react";
import { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CalendarIcon, Check } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { startOfMonth, endOfMonth, format, parse } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/libs/utils";
import type { UniqueMonthOutput } from "@/app/(protected)/dashboard/[id]/page";

type QueryParams = {
  [key: string]: string;
};

export default function MonthPicker({
  months,
}: {
  months: UniqueMonthOutput[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState<boolean>(false);

  // https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams
  const createQueryString = useCallback(
    (newParams: QueryParams) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        params.set(key, value);
      });

      return params.toString();
    },
    [searchParams]
  );

  let fromSP = searchParams.get("from");
  let currentMonth = format(new Date(), "MMMM yyyy");

  const parsedFromSP = !fromSP
    ? currentMonth
    : parse(fromSP, "MM/dd/yyyy", new Date());
  const monthFromSP = format(parsedFromSP, "MMMM yyyy");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size={"sm"}
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !fromSP && "text-muted-foreground"
          )}
          onClick={() => setOpen(true)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {fromSP ? monthFromSP : <span>Pick a month</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[200px] p-0">
        <ScrollArea className="my-1 grid max-h-80">
          {months.map((each) => {
            return (
              <div
                key={each.month}
                className="mx-1 flex cursor-pointer items-center rounded px-2.5 py-1.5 text-sm hover:bg-muted"
                onClick={() => {
                  setOpen(false);
                  router.push(
                    (pathname +
                      "?" +
                      createQueryString({
                        from: format(startOfMonth(each.month), "P"),
                        to: format(endOfMonth(each.month), "P"),
                      })) as Route
                  );
                }}
              >
                <Check
                  className={cn("mr-2 h-4 w-4 shrink-0", {
                    "opacity-100": each.month === monthFromSP,
                    "opacity-0": each.month !== monthFromSP,
                  })}
                />
                {each.month}
              </div>
            );
          })}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
