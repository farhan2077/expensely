"use client";

import { useState } from "react";

import { ChevronRight } from "lucide-react";

import type { MemberTotal } from "@/app/(protected)/dashboard/[id]/page";

import Breakdown from "@/components/dialogs/Breakdown";

export default function SeeBreakdownButton({
  groupMembersTotals,
  avgMealRate,
  userId,
}: {
  groupMembersTotals: MemberTotal[];
  avgMealRate: number;
  userId: string;
}) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group flex items-center place-self-end text-primary underline underline-offset-2"
      >
        <span className="text-sm font-semibold">See full breakdown</span>
        <ChevronRight className="size-4 translate-x-0 transition-transform duration-200 ease-out group-hover:translate-x-[2px]" />
      </button>
      <Breakdown
        open={open}
        setOpen={setOpen}
        groupMembersTotals={groupMembersTotals}
        avgMealRate={avgMealRate}
        userId={userId}
      />
    </>
  );
}
