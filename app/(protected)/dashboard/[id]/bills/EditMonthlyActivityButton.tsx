"use client";

import { useState } from "react";

import { PenLine } from "lucide-react";

import EditMonthlyActivity from "@/components/dialogs/EditMonthlyActivity";
import { Button } from "@/components/ui/button";

export default function EditMonthlyActivityButton({
  id,
  name,
  prevRent,
  prevPaid,
  totalToPay,
}: {
  id: string;
  name: string;
  prevRent: number;
  prevPaid: number;
  totalToPay: number;
}) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Button
        variant={"secondary"}
        size={"icon"}
        className="opacity-0 transition-opacity duration-100 ease-out group-hover:opacity-100"
        onClick={() => setOpenModal(true)}
      >
        <PenLine className="h-5 w-5 text-foreground " />
      </Button>
      <EditMonthlyActivity
        id={id}
        name={name}
        prevRent={prevRent}
        prevPaid={prevPaid}
        totalToPay={totalToPay}
        open={openModal}
        setOpen={setOpenModal}
      />
    </>
  );
}
