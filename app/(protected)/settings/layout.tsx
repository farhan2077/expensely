import type { ReactNode } from "react";

import Sidebar from "@/app/(protected)/settings/Sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="text-muted-foreground">Manage your account and groups</p>
      <hr className="my-4 text-muted-foreground" />
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
        <div>
          <Sidebar />
        </div>
        <hr className="block lg:hidden" />
        <div className="w-full">
          <div className="max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  );
}
