"use client";

import Link from "next/link";
import { useState } from "react";
import { Settings, User as UserIcon, LogOut, House } from "lucide-react";
import Avatar from "boring-avatars";

import { LogoutConfirmation } from "@/components/dialogs/LogoutConfirmation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/db/schema/users";

export default function AvatarDropdownMenu({
  user,
}: {
  user: Omit<User, "hash" | "salt">;
}) {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar size={35} name={user.email as string} variant="beam" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mt-0.5 w-56" align="end" side="bottom">
          <DropdownMenuGroup className="m-2">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
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
          <DropdownMenuItem onClick={() => setOpenDialog(true)}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <LogoutConfirmation open={openDialog} setOpen={setOpenDialog} />
    </>
  );
}
