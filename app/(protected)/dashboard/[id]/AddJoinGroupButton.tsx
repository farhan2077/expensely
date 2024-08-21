"use client";

import { useState } from "react";

import { CirclePlus } from "lucide-react";

import AddJoinGroup from "@/components/dialogs/AddJoinGroup";
import { Button } from "@/components/ui/button";

import { SafeUser } from "@/db/schema/users";

export default function AddJoinGroupButton({
  userInfoData,
}: {
  userInfoData: SafeUser;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="size-9 shrink-0"
        onClick={() => setOpen(true)}
      >
        <CirclePlus className="h-4 w-4" />
      </Button>
      <AddJoinGroup open={open} setOpen={setOpen} userInfoData={userInfoData} />
    </>
  );
}
