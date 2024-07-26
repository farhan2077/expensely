"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import AddUtilities from "@/components/dialogs/AddUtilities";

import { type MonthlyUtilityOutputData } from "@/app/actions/monthly-utility";

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
        {type === "insert"
          ? `Add ${currentMonth}'s utilities`
          : `Update ${currentMonth}'s utilities`}
      </Button>
      <AddUtilities
        open={openModal}
        setOpen={setOpenModal}
        groupId={groupId}
        monthlyUtilitiesData={monthlyUtilitiesData}
      />
    </>
  );
}
