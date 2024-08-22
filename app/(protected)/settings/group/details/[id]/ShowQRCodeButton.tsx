"use client";

import { useState } from "react";

import { QrCode } from "lucide-react";

import ShowQRCode from "@/components/dialogs/ShowQRCode";
import { Button } from "@/components/ui/button";

export default function ShowQRCodeButton({
  groupName,
  groupCode,
}: {
  groupName: string;
  groupCode: number;
}) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        size="icon"
        className="size-9 shrink-0"
      >
        <QrCode className="h-4 w-4" />
      </Button>
      <ShowQRCode
        open={open}
        setOpen={setOpen}
        groupName={groupName}
        groupCode={groupCode}
      />
    </>
  );
}
