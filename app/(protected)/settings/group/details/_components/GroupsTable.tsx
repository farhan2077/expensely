import { Suspense } from "react";

import { ArrowRight } from "lucide-react";

import { MAX_GROUP_LIMIT } from "@/config";

import ClientSideTableRow from "@/app/(protected)/settings/group/details/_components/ClientTableRow";
import GroupMembersCount from "@/app/(protected)/settings/group/details/_components/GroupMembersCount";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { isEqual } from "@/libs/utils";

export default function GroupsTable({
  usersGroupsData,
  userId,
}: {
  usersGroupsData: any;
  userId: string;
}) {
  const noOfGroupsToJoinLeft = MAX_GROUP_LIMIT - usersGroupsData.length;
  const almostNoMoreGroupsLeftToJoin =
    noOfGroupsToJoinLeft >= MAX_GROUP_LIMIT - 1;

  return (
    <Table>
      <TableCaption>
        You can join upto {MAX_GROUP_LIMIT} groups. (
        {usersGroupsData.length === MAX_GROUP_LIMIT
          ? "No"
          : noOfGroupsToJoinLeft}{" "}
        more group{almostNoMoreGroupsLeftToJoin ? "" : "s"} left)
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Group name</TableHead>
          <TableHead className="w-44">Total members</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-muted">
        {usersGroupsData.map((grp: any) => {
          const isAdmin = isEqual(grp.group.ownerId, userId);

          return (
            <ClientSideTableRow key={grp.id} groupId={grp.groupId}>
              <TableCell>
                {grp.group.name}
                {isAdmin ? (
                  <Badge variant="secondary" className="ml-2">
                    own
                  </Badge>
                ) : null}
              </TableCell>
              <TableCell>
                <Suspense
                  fallback={
                    <div className="h-5 w-6 animate-pulse rounded bg-gray-200"></div>
                  }
                >
                  <GroupMembersCount groupId={grp.groupId} />
                </Suspense>
              </TableCell>
              <TableCell className="w-10">
                <ArrowRight className="h-4 w-4" />
              </TableCell>
            </ClientSideTableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
