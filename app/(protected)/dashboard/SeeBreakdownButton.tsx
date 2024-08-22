"use client";

import { useState } from "react";

import { ChevronRight } from "lucide-react";

import type { MemberTotal } from "@/app/(protected)/dashboard/[id]/page";

import Breakdown from "@/components/dialogs/Breakdown";

export default function SeeBreakdownButton({
  groupMembersTotals,
  avgMealRate,
}: {
  groupMembersTotals: MemberTotal[];
  avgMealRate: number;
}) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center place-self-end text-primary hover:underline"
      >
        <span className="text-sm">See full breakdown</span>
        <ChevronRight className="size-4" />
      </button>
      <Breakdown
        open={open}
        setOpen={setOpen}
        groupMembersTotals={groupMembersTotals}
        avgMealRate={avgMealRate}
      />
    </>
  );
}
