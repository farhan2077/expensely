"use client";

import { type Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { CircleUser, Home, Settings, Zap } from "lucide-react";

import { type UsersWithGroup } from "@/app/actions/group";

import { cn } from "@/libs/utils";

export default function Tabbar({
  usersGroupsData,
}: {
  usersGroupsData: UsersWithGroup[];
}) {
  const pathname = usePathname();

  const firstGroupId = usersGroupsData[0].groupId;
  const currentGroupId = pathname.split("/")[2];
  const groupId = pathname.startsWith("/dashboard")
    ? currentGroupId
    : firstGroupId;

  const OVERVIEW_LINK = `/dashboard/${groupId}`;
  const BILLS_LINK = `/dashboard/${groupId}/bills`;
  // const ORDER_LINK = `/dashboard/${groupId}/order`;
  const PROFILE_SETTINGS_LINK = `/settings`;
  const GROUP_SETTINGS_LINK = `/settings/group`;

  const isDashboardActive = pathname.startsWith("/dashboard");
  const isBillsActive = pathname.endsWith("/bills");
  // const isOrderActive = pathname.endsWith("/order");
  const isProfileSettingsActive = pathname.startsWith("/settings");
  const isGroupSettingsActive = pathname.startsWith("/settings/group");

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[4rem] border-t bg-background shadow-sm">
      <div className="mx-6 grid h-full grid-cols-4 gap-6">
        <Link
          href={OVERVIEW_LINK as Route}
          className={cn("flex items-center justify-center border-t-2", {
            "border-primary text-primary": isDashboardActive && !isBillsActive,
            "border-transparent text-muted-foreground":
              !isDashboardActive || isBillsActive,
          })}
        >
          <div>
            <div className="flex w-full items-center justify-center">
              <Home className="h-5 w-5" />
            </div>
            <span className="text-[0.6rem] font-medium uppercase">
              overview
            </span>
          </div>
        </Link>
        <Link
          href={BILLS_LINK as Route}
          className={cn("flex items-center justify-center border-t-2", {
            "border-primary text-primary": isBillsActive,
            "border-transparent text-muted-foreground": !isBillsActive,
          })}
        >
          <div>
            <div className="flex w-full items-center justify-center">
              <Zap className="h-5 w-5" />
            </div>
            <span className="text-[0.6rem] font-medium uppercase">bills</span>
          </div>
        </Link>
        <Link
          href={PROFILE_SETTINGS_LINK}
          className={cn("flex items-center justify-center border-t-2", {
            "border-primary text-primary":
              isProfileSettingsActive && !isGroupSettingsActive,
            "border-transparent text-muted-foreground":
              !isProfileSettingsActive || isGroupSettingsActive,
          })}
        >
          <div>
            <div className="flex w-full items-center justify-center">
              <CircleUser className="h-5 w-5" />
            </div>
            <span className="text-[0.6rem] font-medium uppercase">profile</span>
          </div>
        </Link>
        <Link
          href={GROUP_SETTINGS_LINK}
          className={cn("flex items-center justify-center border-t-2", {
            "border-primary text-primary": isGroupSettingsActive,
            "border-transparent text-muted-foreground": !isGroupSettingsActive,
          })}
        >
          <div>
            <div className="flex w-full items-center justify-center">
              <Settings className="h-5 w-5" />
            </div>
            <span className="text-[0.6rem] font-medium uppercase">
              settings
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
