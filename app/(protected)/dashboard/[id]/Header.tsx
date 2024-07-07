"use client";

import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { Route } from "next";

import { cn } from "@/libs/utils";
import { User } from "@/db/schema/users";

import { Icons } from "@/components/icons";
import AvatarDropdownMenu from "@/app/(protected)/dashboard/[id]/_components/AvatarDropdownMenu";
import GroupPicker from "@/app/(protected)/dashboard/[id]/_components/GroupPicker";

function Header({
  user,
  usersGroups,
}: {
  user: Omit<User, "hash" | "salt">;
  usersGroups: any;
}) {
  const DASHBOARD_OVERVIEW_LINK = `/dashboard/${usersGroups[0].groupId}`;
  const NAV_LINKS = [
    { name: "overview", href: DASHBOARD_OVERVIEW_LINK, prefix: "/dashboard" },
    { name: "settings", href: "/settings", prefix: "/settings" },
  ];

  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between px-6 shadow">
      <div className="flex h-[4rem] gap-8">
        <div className="flex h-[101.5%] items-center justify-center">
          <Link
            href={DASHBOARD_OVERVIEW_LINK as Route}
            passHref
            className="group"
          >
            <Icons.logo className="h-8 w-8 opacity-100 transition-opacity group-hover:opacity-75" />
          </Link>
        </div>
        <ul className="hidden h-[101.5%] items-start justify-center gap-4 md:flex">
          {NAV_LINKS.map((navMenu) => {
            const isLinkActive = pathname.startsWith(navMenu.prefix);

            return (
              <li
                key={navMenu.name}
                className={cn(
                  "group flex h-full items-center justify-center font-medium transition",
                  {
                    "border-b-2 border-primary text-primary": isLinkActive,
                    "border-b-2 border-transparent opacity-50": !isLinkActive,
                  }
                )}
              >
                <Link
                  href={navMenu.href as Route}
                  className={cn(
                    "select-none rounded px-3 py-1.5 text-sm capitalize",
                    {
                      "group-hover:bg-primary/5": isLinkActive,
                      "group-hover:bg-secondary": !isLinkActive,
                    }
                  )}
                >
                  {navMenu.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex items-center gap-6">
        {pathname.startsWith("/dashboard") ? (
          <GroupPicker user={user} usersGroups={usersGroups} />
        ) : null}
        <AvatarDropdownMenu user={user} />
      </div>
    </div>
  );
}

export default Header;
