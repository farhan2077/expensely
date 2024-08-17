"use client";

import { useCallback, useState } from "react";

import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import { endOfMonth, format, parse, startOfMonth } from "date-fns";
import { CalendarIcon, Check } from "lucide-react";

import type { UniqueMonthOutput } from "@/app/(protected)/dashboard/[id]/page";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/libs/utils";

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
  const parsedFromSP = !fromSP ? new Date() : fromSP;
  const formattedFromSP = format(parsedFromSP, "MMMM yyyy");

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
          {fromSP ? format(fromSP, "MMMM yyyy") : <span>Pick a month</span>}
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
                  const parsedMonth = parse(
                    each.month,
                    "MMMM yyyy",
                    new Date()
                  );

                  router.push(
                    (pathname +
                      "?" +
                      createQueryString({
                        from: format(startOfMonth(parsedMonth), "P"),
                        to: format(endOfMonth(parsedMonth), "P"),
                      })) as Route
                  );
                }}
              >
                <Check
                  className={cn("mr-2 h-4 w-4 shrink-0", {
                    "opacity-100": each.month === formattedFromSP,
                    "opacity-0": each.month !== formattedFromSP,
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
