import { notFound } from "next/navigation";

import { getGroupDetails } from "@/app/actions/group";

export default async function GroupMembersCount({
  groupId,
}: {
  groupId: string;
}) {
  // artificially delaying the response
  await new Promise((resolve) => setTimeout(resolve, 500));

  const groupDetails = await getGroupDetails(groupId);

  if (!groupDetails.success || !groupDetails.data) {
    notFound();
  }

  return <div>{groupDetails.data.groupMembers.length}</div>;
}
