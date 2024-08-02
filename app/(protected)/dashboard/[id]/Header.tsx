"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";

import { cn } from "@/libs/utils";
import type { SafeUser } from "@/db/schema/users";

import { Icons } from "@/components/icons";
import AvatarDropdownMenu from "@/app/(protected)/dashboard/[id]/_components/AvatarDropdownMenu";
import GroupPicker from "@/app/(protected)/dashboard/[id]/_components/GroupPicker";
import { ToggleTheme } from "@/components/ui/toggle-theme";

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
  const UTILITIES_LINK = `/dashboard/${groupId}/utilities`;
  const ORDER_LINK = `/dashboard/${groupId}/order`;

  return (
    <div className="flex items-center justify-between border-b px-6 shadow-sm">
      <div className="flex h-[4rem] gap-8">
        <div className="flex h-[101.5%] items-center justify-center">
          <Link href={OVERVIEW_LINK as Route} passHref className="group">
            <Icons.logo className="h-8 w-8 opacity-100 transition-opacity group-hover:opacity-75" />
          </Link>
        </div>
        <ul className="hidden h-[101.5%] items-start justify-center gap-2 md:flex">
          {/* menu - 1 */}
          <li
            className={cn(
              "group flex h-full items-center justify-center font-medium transition",
              {
                "border-b-2 border-primary text-primary":
                  pathname.startsWith("/dashboard") &&
                  (!pathname.endsWith("/utilities") ||
                    !pathname.endsWith("/order")),
                "border-b-2 border-transparent text-muted-foreground/90":
                  (pathname.startsWith("/dashboard") &&
                    (pathname.endsWith("/utilities") ||
                      pathname.endsWith("/order"))) ||
                  !pathname.includes("/dashboard"),
              }
            )}
          >
            <Link
              href={OVERVIEW_LINK as Route}
              className={cn(
                "select-none rounded px-3 py-1.5 text-sm capitalize",
                {
                  "group-hover:bg-primary/5":
                    pathname.startsWith("/dashboard") &&
                    (!pathname.endsWith("/utilities") ||
                      !pathname.endsWith("/order")),
                  "group-hover:bg-secondary/70":
                    (pathname.startsWith("/dashboard") &&
                      (pathname.endsWith("/utilities") ||
                        pathname.endsWith("/order"))) ||
                    !pathname.includes("/dashboard"),
                }
              )}
            >
              overview
            </Link>
          </li>
          {/* menu - 2 */}
          <li
            className={cn(
              "group flex h-full items-center justify-center font-medium tracking-wide transition",
              {
                "border-b-2 border-primary text-primary":
                  pathname.endsWith("/utilities"),
                "border-b-2 border-transparent text-muted-foreground/90":
                  !pathname.endsWith("/utilities"),
              }
            )}
          >
            <Link
              href={UTILITIES_LINK as Route}
              className={cn(
                "select-none rounded px-3 py-1.5 text-sm capitalize",
                {
                  "group-hover:bg-primary/5": pathname.endsWith("/utilities"),
                  "group-hover:bg-secondary/70":
                    !pathname.endsWith("/utilities"),
                }
              )}
            >
              utilities
            </Link>
          </li>
          {/* menu - 3 */}
          <li
            className={cn(
              "group flex h-full items-center justify-center font-medium transition",
              {
                "border-b-2 border-primary text-primary":
                  pathname.endsWith("/order"),
                "border-b-2 border-transparent text-muted-foreground/90":
                  !pathname.endsWith("/order"),
              }
            )}
          >
            <Link
              href={ORDER_LINK as Route}
              className={cn(
                "select-none rounded px-3 py-1.5 text-sm capitalize",
                {
                  "group-hover:bg-primary/5": pathname.endsWith("/order"),
                  "group-hover:bg-secondary/70": !pathname.endsWith("/order"),
                }
              )}
            >
              order
            </Link>
          </li>
          {/* menu - 4 */}
          <li
            className={cn(
              "group flex h-full items-center justify-center font-medium transition",
              {
                "border-b-2 border-primary text-primary":
                  pathname.startsWith("/settings"),
                "border-b-2 border-transparent text-muted-foreground/90":
                  !pathname.startsWith("/settings"),
              }
            )}
          >
            <Link
              href={`/settings`}
              className={cn(
                "select-none rounded px-3 py-1.5 text-sm capitalize",
                {
                  "group-hover:bg-primary/5": pathname.startsWith("/settings"),
                  "group-hover:bg-secondary/70":
                    !pathname.startsWith("/settings"),
                }
              )}
            >
              settings
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex items-center gap-2">
        {pathname.startsWith("/dashboard") ? (
          <GroupPicker userInfoData={userInfoData} usersGroups={usersGroups} />
        ) : null}
        <ToggleTheme />
        <AvatarDropdownMenu userInfoData={userInfoData} />
      </div>
    </div>
  );
}

export default Header;
