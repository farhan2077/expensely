"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { DailyActivityOutputData } from "@/app/actions/daily-activity";

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

      return <p className="font-medium">{format(date, "ccc, PPP")}</p>;
    },
  },
  {
    id: "meals",
    header: "Meals",
    accessorFn: (row) => row.rest,
    cell: ({ row }) => {
      const users = row.original.rest as Array<DailyActivityOutputData>;
      const totalMealCount = users.reduce((sum, user) => sum + user.meal, 0);

      return (
        <div
          className="flex w-fit gap-2"
          title={`Total meals ${totalMealCount}`}
        >
          {users
            .sort(function (a, b) {
              const nameA = a.user.name.toLowerCase(),
                nameB = b.user.name.toLowerCase();

              if (nameA < nameB)
                // sort string ascending
                return -1;
              if (nameA > nameB) return 1;
              return 0; // default return value (no sorting)
            })
            .map((user) => {
              return user.meal === 0 ? null : (
                <div key={user.id} className="flex items-center">
                  <span className="rounded-l bg-slate-100 px-2 py-1">
                    {user.user.name}
                  </span>
                  <span className="rounded-r bg-slate-200 px-2 py-1 font-semibold">
                    {user.meal}
                  </span>
                </div>
              );
            })}
        </div>
      );
    },
  },
  {
    id: "grocery-cost",
    header: "Grocery cost",
    accessorFn: (row) => row.rest,
    cell: ({ row }) => {
      const users = row.original.rest;
      const totalGroceryCost = users.reduce(
        (sum, user) => sum + user.grocery,
        0
      );

      return totalGroceryCost === 0 ? (
        "No grocery"
      ) : (
        <p title={`Total cost ${totalGroceryCost} taka`}>
          {/* symbol source: https://www.toptal.com/designers/htmlarrows/currency/, Bengali Taka */}
          <span className="mr-0.5 text-base">&#2547;</span>
          {totalGroceryCost}
        </p>
      );
    },
  },
];
