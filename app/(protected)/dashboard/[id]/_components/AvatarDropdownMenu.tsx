"use client";

import { useState } from "react";

import Link from "next/link";

import Avatar from "boring-avatars";
import { House, LogOut, Settings, User as UserIcon } from "lucide-react";

import { LogoutConfirmation } from "@/components/dialogs/LogoutConfirmation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { SafeUser } from "@/db/schema/users";

export default function AvatarDropdownMenu({
  userInfoData,
}: {
  userInfoData: SafeUser;
}) {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar size={35} name={userInfoData.email} variant="beam" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" side="bottom">
          <DropdownMenuGroup className="m-2">
            <p className="truncate text-sm font-medium">{userInfoData.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {userInfoData.email}
            </p>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <Link href="/settings" passHref>
              <DropdownMenuItem>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/settings/group" passHref>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <Link href="/home" passHref>
            <DropdownMenuItem>
              <House className="mr-2 h-4 w-4" />
              <span>Home page</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            onClick={() => setOpenDialog(true)}
            className="text-destructive hover:!bg-destructive/10 hover:!text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <LogoutConfirmation open={openDialog} setOpen={setOpenDialog} />
    </>
  );
}
