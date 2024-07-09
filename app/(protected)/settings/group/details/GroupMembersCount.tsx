import { notFound } from "next/navigation";
import { getGroupInfo } from "@/app/actions/group";

export default async function GroupMembersCount({
  groupId,
}: {
  groupId: string;
}) {
  const result = await getGroupInfo(groupId);

  if (!result) {
    notFound();
  }

  return <div>{result.data.groupMembers.length}</div>;
}
