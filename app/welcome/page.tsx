import { redirect } from "next/navigation";

import type { Metadata } from "next";

import { validateSession } from "@/app/actions/auth";
import CreateJoinGroupForm from "@/app/welcome/CreateJoinGroupForm";
import {} from "@/app/(auth)/sign-in/actions";
import { isEmpty } from "@/libs/utils";
import { getUsersGroups } from "@/app/actions/group";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Welcome to your expensely dashboard",
};

async function Page() {
  const { user } = await validateSession();

  if (!user) {
    redirect("/sign-in");
  }

  const result = await getUsersGroups();

  if (!isEmpty(result.data)) {
    redirect(`/dashboard/${result.data[0].groupId}`);
  }

  return (
    <main className="relative">
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome to Expensely
            </h1>
          </div>
          <div className="mt-8">
            <CreateJoinGroupForm />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Page;
