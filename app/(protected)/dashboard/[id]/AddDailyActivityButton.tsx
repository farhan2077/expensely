"use client";

import { useState } from "react";

import { Plus } from "lucide-react";

import AddDailyActivity from "@/components/dialogs/AddDailyActivity";
import { Button } from "@/components/ui/button";

export default function AddDailyActivityButton({
  groupMembers,
  disabledDates,
}: {
  groupMembers: any;
  disabledDates: Array<string>;
}) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Button
        size={"sm"}
        onClick={() => {
          setOpenModal(true);
        }}
        // className="flex items-center"
      >
        <Plus className="mr-1.5 size-4" />
        Add meals and expenses
      </Button>
      <AddDailyActivity
        open={openModal}
        setOpen={setOpenModal}
        groupMembers={groupMembers}
        disabledDates={disabledDates}
      />
    </>
  );
}
