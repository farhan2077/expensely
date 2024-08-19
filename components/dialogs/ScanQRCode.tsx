"use client";

import { Scanner } from "@yudiel/react-qr-scanner";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function ScanQRCode({
  open,
  setOpen,
  form,
}: {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;
  form: any; //
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-describedby={undefined} className="max-w-xs">
        <DialogHeader>
          <DialogTitle>Scan QR code</DialogTitle>
        </DialogHeader>
        <div className="overflow-hidden rounded">
          <Scanner
            onScan={(result) => {
              const rawText = result[0].rawValue;
              const array = rawText.split(",").map((item) => item.trim());

              form.setValue("name", array[0]);
              form.setValue("code", array[1]);

              setOpen(false);
            }}
            onError={() => {
              toast.error("Could not scan QR code. Please try manually.");
            }}
            styles={{
              container: {
                width: "100%",
                height: "0", // hack to make the video not shift the layout
                paddingBottom: "100%", // hack to make the video not shift the layout
                border: "0px",
              },
              video: { width: "100%", height: "auto" }, // hack to make the video not shift the layout
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ScanQRCode;
