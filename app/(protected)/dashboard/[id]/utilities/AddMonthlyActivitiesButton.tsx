"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import AddMonthlyActivities from "@/components/dialogs/AddMonthlyActivities";

export default function AddMonthlyActivitiesButton({
  utilityId,
  groupMembers,
}: {
  groupMembers: any;
  utilityId: string;
}) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Button
        onClick={() => {
          setOpenModal(true);
        }}
      >
        Add members&apos; bills
      </Button>
      <AddMonthlyActivities
        open={openModal}
        setOpen={setOpenModal}
        groupMembers={groupMembers}
        utilityId={utilityId}
      />
    </>
  );
}
