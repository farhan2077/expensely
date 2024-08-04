"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, UserX, UserPen } from "lucide-react";
import { RemoveMember } from "@/components/dialogs/RemoveMember";
import { useState } from "react";

export function ActionButtonDropdown({
  id,
  name,
  groupId,
}: {
  id: string;
  name: string;
  groupId: string;
}) {
  const [openRemoveMember, setOpenRemoveMember] = useState<boolean>(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <Ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="start">
          {/* <DropdownMenuItem>
            <UserPen className="mr-2 h-4 w-4" />
            <span>Update role</span>
          </DropdownMenuItem> */}
          <DropdownMenuItem
            className="text-destructive hover:!bg-destructive/10 hover:!text-destructive"
            onClick={() => setOpenRemoveMember(true)}
          >
            <UserX className="mr-2 h-4 w-4" />
            <span>Remove member</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <RemoveMember
        open={openRemoveMember}
        setOpen={setOpenRemoveMember}
        id={id}
        name={name}
        groupId={groupId}
      />
      {/* dialog 2 */}
    </>
  );
}
