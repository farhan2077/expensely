import { useState } from "react";

import { PenLine } from "lucide-react";

import { type DailyActivityOutputData } from "@/app/actions/daily-activity";

import UpdateDailyActivity from "@/components/dialogs/UpdateDailyActivity";
import { Button } from "@/components/ui/button";

export default function UpdateDailyActivityButton({
  restData,
}: {
  restData: DailyActivityOutputData[];
}) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Button
        size={"icon"}
        variant={"ghost"}
        onClick={() => setOpenModal(true)}
      >
        <PenLine className="h-4 w-4" />
      </Button>
      <UpdateDailyActivity
        open={openModal}
        setOpen={setOpenModal}
        restData={restData}
      />
    </>
  );
}
