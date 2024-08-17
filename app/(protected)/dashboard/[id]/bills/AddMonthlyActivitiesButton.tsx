"use client";

import { useState } from "react";

import { Plus } from "lucide-react";

import AddMonthlyActivities from "@/components/dialogs/AddMonthlyActivities";
import { Button } from "@/components/ui/button";

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
        <Plus className="mr-2 size-4" />
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
