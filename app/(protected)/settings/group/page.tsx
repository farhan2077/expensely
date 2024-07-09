import { notFound } from "next/navigation";

import { getUsersGroups } from "@/app/actions/group";
import { validateSession } from "@/app/actions/auth";
import GroupsTable from "@/app/(protected)/settings/group/details/GroupsTable";

export default async function Page() {
  const { user } = await validateSession();
  const usersGroupsData = await getUsersGroups();

  if (!user || !usersGroupsData || !usersGroupsData.data) {
    notFound();
  }

  return (
    <>
      <h2 className="text-lg font-medium">Group</h2>
      <p className="text-sm text-muted-foreground">
        See all groups you have created or joined
      </p>
      <hr className="my-4 text-muted-foreground" />
      <GroupsTable usersGroupsData={usersGroupsData.data} userId={user.id} />
    </>
  );
}
