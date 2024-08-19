"use client";

import type { MemberTotal } from "@/app/(protected)/dashboard/[id]/page";

import { Icons } from "@/components/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getFirstName } from "@/libs/utils";

function Breakdown({
  open,
  setOpen,
  groupMembersTotals,
  avgMealRate,
}: {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;
  groupMembersTotals: MemberTotal[];
  avgMealRate: number;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <ScrollArea className="max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Full breakdown</DialogTitle>
            <DialogDescription>
              See group members&apos; expense at a glance
            </DialogDescription>
          </DialogHeader>

          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Grocery</TableHead>
                <TableHead className="hidden sm:table-cell">Meal</TableHead>
                <TableHead className="text-right">Meal cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupMembersTotals.map((member) => {
                const mealCost = Math.ceil(member.totalMeal * avgMealRate);
                const isUnder = mealCost <= member.totalGrocery;

                return (
                  <TableRow key={member.userId}>
                    <TableCell>
                      <div className="font-medium lowercase first-letter:capitalize">
                        {getFirstName(member.name)}
                      </div>
                    </TableCell>
                    <TableCell className="hidden items-center gap-0.5 tabular-nums sm:flex">
                      <Icons.bdt className="size-3 stroke-[0.5px]" />
                      {member.totalGrocery}
                    </TableCell>
                    <TableCell className="hidden tabular-nums sm:table-cell">
                      {member.totalMeal}
                    </TableCell>
                    <TableCell className="flex items-center justify-end gap-3">
                      <div className="flex items-center gap-0.5">
                        <Icons.bdt className="size-3 stroke-[0.5px]" />
                        <span className="tabular-nums">{mealCost}</span>
                      </div>
                      {isUnder ? (
                        <span
                          className="size-2 shrink-0 rounded-full bg-green-600 ring-4 ring-green-100 dark:bg-green-500 dark:ring-green-950"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <span
                          className="size-2 shrink-0 rounded-full bg-destructive ring-4 ring-red-100 dark:ring-red-950"
                          aria-hidden="true"
                        ></span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default Breakdown;
