import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { APP_NAME } from "@/config";

import { validateSession } from "@/app/actions/auth";
import { getUsersGroups } from "@/app/actions/group";
import { getUserInfo } from "@/app/actions/user";

import CreateJoinGroupForm from "@/app/welcome/CreateJoinGroupForm";
import Logout from "@/app/welcome/LogoutButton";

import { Separator } from "@/components/ui/separator";

import { isEmpty } from "@/libs/utils";

export const metadata: Metadata = {
  title: "Welcome",
  description: `Welcome to ${APP_NAME}`,
};

async function Page() {
  const { user } = await validateSession();
  const userInfo = await getUserInfo();

  if (!user || !userInfo.success || !userInfo.data || !userInfo.data.email) {
    redirect("/sign-in");
  }

  const result = await getUsersGroups();

  if (!isEmpty(result.data)) {
    redirect(`/dashboard/${result.data[0].groupId}`);
  }

  return (
    <main className="relative">
      <div className="absolute right-7 top-6">
        <div className="flex h-4 flex-col items-end space-x-3 space-y-3 md:flex-row md:items-center md:space-y-0">
          <p className="text-sm">
            <span className="hidden sm:inline">
              You are logged in using&nbsp;
            </span>
            <span className="font-medium">{userInfo.data.email}</span>
          </p>
          <Separator
            orientation="vertical"
            className="hidden bg-muted-foreground/50 md:block"
          />
          <Logout />
        </div>
      </div>
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome to{" "}
              <Link href={"/"} className="text-primary">
                {APP_NAME}
              </Link>
            </h1>
          </div>
          <div className="mt-8">
            <CreateJoinGroupForm userInfoData={userInfo.data} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Page;
