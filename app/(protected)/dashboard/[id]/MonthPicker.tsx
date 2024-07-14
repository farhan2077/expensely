"use client";

import * as React from "react";
import { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { startOfMonth, endOfMonth, format } from "date-fns";

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

  const [open, setOpen] = React.useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = React.useState<string>("");

  // https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams
  const createQueryString = React.useCallback(
    (newParams: QueryParams) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        params.set(key, value);
      });

      return params.toString();
    },
    [searchParams]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size={"sm"}
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !selectedMonth && "text-muted-foreground"
          )}
          onClick={() => setOpen(true)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedMonth ? selectedMonth : <span>Pick a month</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[200px] p-0">
        <ScrollArea className="my-1 grid max-h-80">
          {months.map((each) => {
            return (
              <div
                key={each.month}
                className="mx-1 cursor-pointer rounded px-3 py-1.5 text-sm hover:bg-muted"
                onClick={() => {
                  setSelectedMonth(each.month);
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
                {each.month}
              </div>
            );
          })}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
