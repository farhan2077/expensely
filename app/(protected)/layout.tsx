import { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";

import Header from "@/app/(protected)/dashboard/[id]/Header";
import { validateSession } from "@/app/actions/auth";

import { getUsersGroups } from "@/app/actions/group";
import { isEmpty } from "@/libs/utils";
import { getUserInfo } from "@/app/actions/user";

export default async function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { user } = await validateSession();
  const userInfo = await getUserInfo();
  const usersGroupsData = await getUsersGroups();

  if (!user) {
    redirect("/sign-in");
  }

  if (!userInfo.data || !usersGroupsData.success) {
    notFound();
  }

  if (isEmpty(usersGroupsData.data)) {
    redirect("/welcome");
  }

  return (
    <>
      <nav className="mb-6">
        <Header
          userInfoData={userInfo.data}
          usersGroups={usersGroupsData.data}
        />
      </nav>
      <main className="mx-6 mb-10">{children}</main>
    </>
  );
}
