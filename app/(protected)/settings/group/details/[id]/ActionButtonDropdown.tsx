"use client";

import { useState } from "react";

import { Ellipsis, UserPen, UserX } from "lucide-react";

import { RemoveMember } from "@/components/dialogs/RemoveMember";
import { UpdateRole } from "@/components/dialogs/UpdateRole";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { UserGroupTypeT } from "@/db/schema/users-groups";

export function ActionButtonDropdown({
  id,
  name,
  groupId,
  currentType,
}: {
  id: string;
  name: string;
  groupId: string;
  currentType: UserGroupTypeT;
}) {
  const [openRemoveMember, setOpenRemoveMember] = useState<boolean>(false);
  const [updateMemberRole, setUpdateMemberRole] = useState<boolean>(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <Ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-48"
          align="start"
          onClick={() => setUpdateMemberRole(true)}
        >
          <DropdownMenuItem>
            <UserPen className="mr-2 h-4 w-4" />
            <span>Update role</span>
          </DropdownMenuItem>
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
      <UpdateRole
        open={updateMemberRole}
        setOpen={setUpdateMemberRole}
        id={id}
        name={name}
        groupId={groupId}
        currentType={currentType}
      />
    </>
  );
}
