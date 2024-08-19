"use client";

import { QRCodeSVG } from "qrcode.react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function ShowQRCode({
  open,
  setOpen,
  groupName,
  groupCode,
}: {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;
  groupName: string;
  groupCode: number;
}) {
  const qrCodeValue = `${groupName},${groupCode}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-describedby={undefined} className="max-w-xs">
        <DialogHeader>
          <DialogTitle>Join {groupName}</DialogTitle>
        </DialogHeader>
        <div className="mt-2 flex w-full justify-center">
          <QRCodeSVG value={qrCodeValue} size={200} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ShowQRCode;
