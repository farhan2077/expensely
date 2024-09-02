"use client";

import { useState } from "react";

import { PenLine, Plus } from "lucide-react";

import { type MonthlyUtilityOutputData } from "@/app/actions/monthly-utility";

import UpsertUtilities from "@/components/dialogs/UpsertUtilities";
import { Button } from "@/components/ui/button";

export default function UpsertUtilitiesButton({
  type,
  currentMonth,
  groupId,
  monthlyUtilitiesData,
}: {
  type: "insert" | "update";
  currentMonth: string;
  groupId: string;
  monthlyUtilitiesData: null | MonthlyUtilityOutputData;
}) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Button
        onClick={() => {
          setOpenModal(true);
        }}
      >
        {type === "insert" ? (
          <>
            <Plus className="mr-2 size-4" /> Add {currentMonth}&apos;s utilities
          </>
        ) : (
          <>
            <PenLine className="mr-2 size-4" />
            Update {currentMonth}&apos;s utilities
          </>
        )}
      </Button>
      <UpsertUtilities
        open={openModal}
        setOpen={setOpenModal}
        groupId={groupId}
        monthlyUtilitiesData={monthlyUtilitiesData}
      />
    </>
  );
}
