"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { User, Users } from "lucide-react";

import { cn } from "@/libs/utils";

const SIDEBAR_LINKS = [
  { name: "profile", href: "/settings", icon: User },
  { name: "groups", href: "/settings/group", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="ml-0 flex flex-row gap-1 lg:-ml-3 lg:flex-col">
      {SIDEBAR_LINKS.map((menu) => {
        const Icon = menu.icon;

        return (
          <Link
            key={menu.name}
            href={menu.href as Route}
            className={cn(
              "flex w-fit items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm font-medium capitalize lg:w-[250px]",
              {
                "bg-muted": menu.href === pathname,
                "bg-background text-muted-foreground": menu.href !== pathname,
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
