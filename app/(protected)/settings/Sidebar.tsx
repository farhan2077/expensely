"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { User, Users } from "lucide-react";

import { cn } from "@/libs/utils";
import { Route } from "next";

const SIDEBAR_LINKS = [
  { name: "profile", href: "/settings", icon: User },
  { name: "groups", href: "/settings/group", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="-ml-3 grid gap-1">
      {SIDEBAR_LINKS.map((menu) => {
        const Icon = menu.icon;

        return (
          <Link
            key={menu.name}
            href={menu.href as Route}
            className={cn(
              "flex w-60 items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm font-medium capitalize",
              {
                "bg-muted": menu.href === pathname,
                "bg-white text-muted-foreground": menu.href !== pathname,
              }
            )}
          >
            <Icon className="h-4 w-4" />
            {menu.name}
          </Link>
        );
      })}
    </div>
  );
}
