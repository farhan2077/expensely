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
      <p className="text-muted-foreground">
        Manage your account settings and set e-mail preferences.
      </p>
      <hr className="my-4 text-muted-foreground" />
      <div className="flex gap-6">
        <div>
          <Sidebar />
        </div>
        <div className="w-full">
          <div className="max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  );
}
