"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Clipboard, ClipboardCheck } from "lucide-react";

export function ViewGroupCode({ groupCode }: { groupCode: number }) {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  function handleCopy() {
    setIsCopied(true);
    toast.success("Group code has been copied to the clipboard");
    navigator.clipboard.writeText(groupCode.toString());
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  return (
    <div className="inline">
      Others can join by using code&nbsp;
      <span
        className={`cursor-copy select-none rounded px-1 py-0.5 font-medium ${isCopied ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}
        onClick={() => handleCopy()}
      >
        {groupCode}
        {!isCopied ? (
          <Clipboard
            className="-mt-[0.20rem] ml-0.5 inline h-3 w-3 stroke-muted-foreground"
            strokeWidth={2.5}
          />
        ) : (
          <ClipboardCheck
            className="-mt-[0.20rem] ml-0.5 inline h-3 w-3 stroke-primary"
            strokeWidth={2.5}
          />
        )}
      </span>
    </div>
  );
}
