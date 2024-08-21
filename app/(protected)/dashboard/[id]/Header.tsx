"use client";

import { useState } from "react";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { PanelRightOpen, Plus } from "lucide-react";

import AvatarDropdownMenu from "@/app/(protected)/dashboard/[id]/_components/AvatarDropdownMenu";
import GroupPicker from "@/app/(protected)/dashboard/[id]/_components/GroupPicker";

import { Icons } from "@/components/icons";
// import Note from "@/components/Note";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ToggleTheme } from "@/components/ui/toggle-theme";

import type { SafeUser } from "@/db/schema/users";

import { cn } from "@/libs/utils";
import AddJoinGroupButton from "@/app/(protected)/dashboard/[id]/AddJoinGroupButton";

function Header({
  userInfoData,
  usersGroups,
}: {
  userInfoData: SafeUser;
  usersGroups: any;
}) {
  const pathname = usePathname();

  const firstGroupId = usersGroups[0].groupId;
  const currentGroupId = pathname.split("/")[2];
  const groupId = pathname.startsWith("/dashboard")
    ? currentGroupId
    : firstGroupId;

  const OVERVIEW_LINK = `/dashboard/${groupId}`;
  const BILLS_LINK = `/dashboard/${groupId}/bills`;
  // const ORDER_LINK = `/dashboard/${groupId}/order`;
  const SETTINGS_LINK = `/settings`;

  const isDashboardActive = pathname.startsWith("/dashboard");
  const isBillsActive = pathname.endsWith("/bills");
  const isOrderActive = pathname.endsWith("/order");
  const isSettingsActive = pathname.startsWith("/settings");

  function getMenuClassName(isActive: boolean): string {
    return cn(
      "group flex h-full items-center justify-center font-medium transition",
      {
        "border-b-2 border-primary text-primary": isActive,
        "border-b-2 border-transparent text-muted-foreground/90": !isActive,
      }
    );
  }

  function getLinkClassName(isActive: boolean): string {
    return cn("select-none rounded px-3 py-1.5 text-sm capitalize", {
      "group-hover:bg-primary/5": isActive,
      "group-hover:bg-secondary/70": !isActive,
    });
  }

  function MobileSheet() {
    const [open, setOpen] = useState(false);

    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button size="sm" className="aspect-square px-0" variant="outline">
            <PanelRightOpen className="w-full stroke-[1.5]" />
          </Button>
        </SheetTrigger>
        <SheetHeader>
          <VisuallyHidden.Root>
            <SheetTitle>Sidebar</SheetTitle>
          </VisuallyHidden.Root>
          <VisuallyHidden.Root>
            <SheetDescription>Links to other pages</SheetDescription>
          </VisuallyHidden.Root>
        </SheetHeader>
        <SheetContent className="flex h-dvh flex-col justify-between">
          <div className="mt-8">
            <ul className="grid place-items-start gap-4">
              {/* menu - 1 */}
              <li
                onClick={() => setOpen(false)}
                className={getMenuClassName(
                  isDashboardActive && !isBillsActive && !isOrderActive
                )}
              >
                <Link className="capitalize" href={OVERVIEW_LINK as Route}>
                  overview
                </Link>
              </li>
              {/* menu - 2 */}
              <li
                onClick={() => setOpen(false)}
                className={getMenuClassName(isBillsActive)}
              >
                <Link className="capitalize" href={BILLS_LINK as Route}>
                  bills
                </Link>
              </li>
              {/* menu - 3 */}
              {/* <li
                onClick={() => setOpen(false)}
                className={getMenuClassName(isOrderActive)}
              >
                <Link className="capitalize" href={ORDER_LINK as Route}>
                  order
                </Link>
              </li> */}
              {/* menu - 4 */}
              <li
                onClick={() => setOpen(false)}
                className={getMenuClassName(isSettingsActive)}
              >
                <Link className="capitalize" href={SETTINGS_LINK as Route}>
                  settings
                </Link>
              </li>
            </ul>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <ToggleTheme />
            <AvatarDropdownMenu userInfoData={userInfoData} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="flex items-center justify-between border-b px-6 shadow-sm">
      <div className="flex h-[4rem] gap-8">
        <div className="flex h-[101.5%] items-center justify-center">
          <Link href={OVERVIEW_LINK as Route} passHref className="group">
            <Icons.logo className="h-8 w-8 text-foreground opacity-100 transition-opacity group-hover:opacity-75" />
          </Link>
        </div>
        {/* pc */}
        <ul className="hidden h-[101.5%] items-start justify-center gap-2 md:flex">
          {/* menu - 1 */}
          <li
            className={getMenuClassName(
              isDashboardActive && !isBillsActive && !isOrderActive
            )}
          >
            <Link
              href={OVERVIEW_LINK as Route}
              className={getLinkClassName(
                isDashboardActive && !isBillsActive && !isOrderActive
              )}
            >
              overview
            </Link>
          </li>
          {/* menu - 2 */}
          <li className={getMenuClassName(isBillsActive)}>
            <Link
              href={BILLS_LINK as Route}
              className={getLinkClassName(isBillsActive)}
            >
              bills
            </Link>
          </li>
          {/* menu - 3 */}
          {/* <li className={getMenuClassName(isOrderActive)}>
            <Link
              href={ORDER_LINK as Route}
              className={getLinkClassName(isOrderActive)}
            >
              order
            </Link>
          </li> */}
          {/* menu - 4 */}
          <li className={getMenuClassName(isSettingsActive)}>
            <Link
              href={SETTINGS_LINK as Route}
              className={getLinkClassName(isSettingsActive)}
            >
              settings
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex items-center gap-4">
        {/* pc */}
        {/* {isDashboardActive ? <Note currentGroupId={currentGroupId} /> : null} */}
        <AddJoinGroupButton userInfoData={userInfoData} />
        {isDashboardActive ? (
          <GroupPicker userInfoData={userInfoData} usersGroups={usersGroups} />
        ) : null}
        <div className="hidden md:flex">
          <ToggleTheme />
        </div>
        <div className="hidden md:flex">
          <AvatarDropdownMenu userInfoData={userInfoData} />
        </div>
        {/* mobile */}
        <div className="block md:hidden">
          <MobileSheet />
        </div>
      </div>
    </div>
  );
}

export default Header;
