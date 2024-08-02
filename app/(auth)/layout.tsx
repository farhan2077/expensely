import Link from "next/link";

import type { ReactNode } from "react";

import { Icons } from "@/components/icons";

export default function AuthLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <main className="container relative grid h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-foreground p-10 dark:border-r lg:flex">
        <div className="absolute inset-0" />
        <Link
          passHref
          href="/"
          className="relative z-20 flex items-center text-lg font-medium text-background"
        >
          <Icons.logo className="mr-2 h-5 w-5" />
          <h1 className="text-xl font-semibold tracking-tight">Expensely</h1>
        </Link>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-muted">Manage shared expenses with expensely</p>
          </blockquote>
        </div>
      </div>
      {children}
    </main>
  );
}
