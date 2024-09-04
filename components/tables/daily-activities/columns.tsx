"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format, isFriday } from "date-fns";

import type { DailyActivityOutputData } from "@/app/actions/daily-activity";

import { Icons } from "@/components/icons";
import UpdateDailyActivityButton from "@/components/tables/daily-activities/UpdateDailyActivityButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn, getFirstName } from "@/libs/utils";

export type DailyActivityRow = {
  date: string;
  rest: DailyActivityOutputData[];
};

export const columns: ColumnDef<DailyActivityRow>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("date") as string;

      return (
        <p
          className={cn("whitespace-nowrap font-medium", {
            "text-primary": isFriday(date),
          })}
        >
          <span className="block lg:hidden">{format(date, "dd MMM")}</span>
          <span className="hidden lg:block">{format(date, "ccc, PPP")}</span>
        </p>
      );
    },
  },
  {
    id: "meals",
    header: "Meals",
    accessorFn: (row) => row.rest,
    cell: ({ row }) => {
      const users = row.original.rest as Array<DailyActivityOutputData>;
      const totalMeals = users.reduce((sum, user) => sum + user.meal, 0);

      return (
        <div className="flex max-w-5xl flex-wrap items-center gap-2">
          {users
            // .sort(function (a, b) {
            //   const nameA = a.user.name.toLowerCase(),
            //     nameB = b.user.name.toLowerCase();

            //   if (nameA < nameB)
            //     // sort string ascending
            //     return -1;
            //   if (nameA > nameB) return 1;
            //   return 0; // default return value (no sorting)
            // })
            .map((user) => {
              return (
                <div
                  key={user.id}
                  className="hidden items-center gap-2 sm:flex"
                >
                  {user.grocery === 0 ? (
                    <div className="flex items-center rounded bg-slate-200 ring-2 ring-slate-200 dark:bg-slate-800 dark:ring-slate-800">
                      <span className="rounded bg-background px-2 py-1 lowercase first-letter:capitalize">
                        {getFirstName(user.user.name)}
                      </span>
                      <span
                        className={cn(
                          "bg-slate-200 px-2 py-1 tabular-nums dark:bg-slate-800",
                          {
                            "font-semibold": user.meal !== 0,
                          }
                        )}
                      >
                        {user.meal}
                      </span>
                    </div>
                  ) : (
                    <TooltipProvider delayDuration={50} key={user.id}>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center overflow-hidden rounded ring-2 ring-primary">
                            <span className="bg-background px-2 py-1 lowercase first-letter:capitalize">
                              {getFirstName(user.user.name)}
                            </span>
                            <span
                              className={cn(
                                "bg-slate-200 px-2 py-1 tabular-nums dark:bg-slate-800",
                                {
                                  "font-semibold": user.meal !== 0,
                                }
                              )}
                            >
                              {user.meal}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="mb-1">
                          <p>
                            Grocery cost:{" "}
                            <span className="font-semibold">
                              {user.grocery}
                            </span>{" "}
                            BDT
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              );
            })}
          {/* <p className="duration-50 text-sm opacity-0 transition-opacity group-hover:opacity-100"> */}
          <p className="custom__meal-cell flex items-center text-sm">
            <span className="hidden md:block">Total meals&nbsp;</span>
            <span className="font-semibold">{totalMeals}</span>
          </p>
        </div>
      );
    },
  },
  {
    id: "grocery-cost",
    header: () => {
      return (
        <>
          <span className="block lg:hidden">Groceries</span>
          <span className="hidden lg:block">Total grocery cost</span>
        </>
      );
    },
    accessorFn: (row) => row.rest,
    cell: ({ row }) => {
      const users = row.original.rest;
      const totalGroceryCost = users.reduce(
        (sum, user) => sum + user.grocery,
        0
      );

      return (
        <p
          className={cn("flex items-center gap-[0.5px] whitespace-nowrap", {
            "text-muted-foreground": totalGroceryCost === 0,
          })}
        >
          <Icons.bdt className="size-3 stroke-[0.5px]" />
          {totalGroceryCost}
        </p>
      );
    },
  },
  {
    id: "action",
    header: () => {
      return <span className="flex justify-end">Action</span>;
    },
    accessorFn: (row) => row.rest,
    cell: function Cell({ row }) {
      return (
        <div className="flex justify-end">
          <UpdateDailyActivityButton restData={row.original.rest} />
        </div>
      );
    },
  },
];
