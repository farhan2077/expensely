import { notFound } from "next/navigation";

import { validateSession } from "@/app/actions/auth";
import { getUsersGroups } from "@/app/actions/group";
import { getUserInfo } from "@/app/actions/user";

import GroupsTable from "@/app/(protected)/settings/group/details/_components/GroupsTable";
import CreateJoinGroupForm from "@/app/welcome/CreateJoinGroupForm";

export default async function Page() {
  const { user } = await validateSession();
  const userInfo = await getUserInfo();
  const usersGroupsData = await getUsersGroups();

  if (!user || !userInfo.data || !usersGroupsData || !usersGroupsData.data) {
    notFound();
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Group</h2>
          <p className="text-sm text-muted-foreground">
            See all groups you have created or joined
          </p>
        </div>
        {usersGroupsData.data.length < 5 ? (
          <div>
            <CreateJoinGroupForm userInfoData={userInfo.data} />
          </div>
        ) : null}
      </div>
      <hr className="my-4 text-muted-foreground" />
      <GroupsTable usersGroupsData={usersGroupsData.data} userId={user.id} />
    </>
  );
}
