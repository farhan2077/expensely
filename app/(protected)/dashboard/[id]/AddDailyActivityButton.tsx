"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import AddDailyActivity from "@/components/dialogs/AddDailyActivity";

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
      >
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
