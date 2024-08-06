import { redirect } from "next/navigation";

import type { Metadata } from "next";

import { validateSession } from "@/app/actions/auth";
import CreateJoinGroupForm from "@/app/welcome/CreateJoinGroupForm";
import {} from "@/app/(auth)/sign-in/actions";
import { isEmpty } from "@/libs/utils";
import { getUsersGroups } from "@/app/actions/group";
import { getUserInfo } from "@/app/actions/user";
import { Separator } from "@/components/ui/separator";
import Logout from "@/app/welcome/LogoutButton";
import { APP_NAME } from "@/config";

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
        <div className="flex h-4 items-center space-x-3">
          <p className="text-sm">
            You are logged in using{" "}
            <span className="font-medium">{userInfo.data.email}</span>
          </p>
          <Separator
            orientation="vertical"
            className="bg-muted-foreground/50"
          />
          <Logout />
        </div>
      </div>
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome to {APP_NAME}
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
