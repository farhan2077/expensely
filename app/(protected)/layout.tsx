import { ReactNode } from "react";
import { redirect } from "next/navigation";

import Header from "@/app/(protected)/dashboard/[id]/Header";
import { getUserInfo, validateSession } from "@/app/actions/auth";

import { getUsersGroups } from "@/app/actions/group";
import { isEmpty } from "@/libs/utils";

export default async function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { user } = await validateSession();
  if (!user) {
    redirect("/sign-in");
  }

  let userInfo = null;
  let usersGroupsData = null;

  try {
    userInfo = await getUserInfo();
    usersGroupsData = await getUsersGroups();

    if (isEmpty(usersGroupsData.data)) {
      redirect("/welcome");
    }
  } catch {
    redirect("/welcome");
  }

  return (
    <>
      <nav className="mb-6">
        {!userInfo ||
        !userInfo.data ||
        !usersGroupsData ||
        !usersGroupsData.data ? null : (
          <Header user={userInfo.data} usersGroups={usersGroupsData.data} />
        )}
      </nav>
      <main className="mx-6">{children}</main>
    </>
  );
}
