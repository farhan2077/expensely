"use client";

import { useState } from "react";

import { PenLine } from "lucide-react";

import EditMonthlyActivity from "@/components/dialogs/EditMonthlyActivity";

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
      <button className="group !-m-2 p-2" onClick={() => setOpenModal(true)}>
        <PenLine className="h-5 w-5 text-muted-foreground transition-colors ease-out group-hover:text-foreground" />
      </button>
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
