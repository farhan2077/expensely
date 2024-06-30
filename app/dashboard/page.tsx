import { redirect } from "next/navigation";

import type { Metadata } from "next";

import { validateSession } from "@/app/actions/auth";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Welcome to your expensely dashboard",
};

async function DashboardPage() {
  const { user } = await validateSession();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <main className="max-w-sm">
      <h1>Dashboard</h1>
    </main>
  );
}

export default DashboardPage;
