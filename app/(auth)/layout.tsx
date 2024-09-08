import type { ReactNode } from "react";

import Link from "next/link";
import { redirect } from "next/navigation";

import { APP_NAME } from "@/config";

import { getUsersGroups } from "@/app/actions/group";

import { Icons } from "@/components/icons";

export default async function AuthLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const result = await getUsersGroups();

  if (result.success && result.data) {
    if (result.data.length === 0) {
      redirect(`/welcome`);
    }

    redirect(`/dashboard/${result.data[0].groupId}`);
  }

  return (
    <main className="container relative grid h-dvh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-foreground p-10 dark:border-r lg:flex">
        <Link
          passHref
          href="/"
          className="relative z-20 flex items-center text-lg font-medium text-background"
        >
          <Icons.logo className="mr-2 h-5 w-5" />
          <h1 className="text-xl font-semibold tracking-tight" translate="no">
            {APP_NAME}
          </h1>
        </Link>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-muted" translate="no">
              Manage shared expenses with {APP_NAME}
            </p>
          </blockquote>
        </div>
      </div>
      {children}
    </main>
  );
}
