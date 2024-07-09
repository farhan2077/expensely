import { notFound } from "next/navigation";
import { getGroupInfo } from "@/app/actions/group";

export default async function GroupMembersCount({
  groupId,
}: {
  groupId: string;
}) {
  // artificially delaying the response
  await new Promise((resolve) => setTimeout(resolve, 500));

  const result = await getGroupInfo(groupId);

  if (!result) {
    notFound();
  }

  return <div>{result.data.groupMembers.length}</div>;
}
