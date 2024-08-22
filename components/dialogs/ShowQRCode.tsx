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
        <div className="flex justify-center">
          <div className="w-fit rounded bg-white p-4">
            <QRCodeSVG value={qrCodeValue} size={238} />
            {/* how 238? */}
            {/* `ShowQRCode` > 270px */}
            {/* QRCodeSVG should be x + 32 = 270; x = 238px (padding 4rem on both left and write > 8rem = 16*2px) */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ShowQRCode;
