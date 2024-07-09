"use client";

import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { isEqual } from "@/libs/utils";
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
import GroupMembersCount from "@/app/(protected)/settings/group/details/GroupMembersCount";
import { MAX_GROUP_LIMIT } from "@/app/static";

export default function GroupsTable({
  usersGroupsData,
  userId,
}: {
  usersGroupsData: any;
  userId: string;
}) {
  const router = useRouter();

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
      <TableBody>
        {usersGroupsData.map((grp: any) => {
          return (
            <TableRow
              key={grp.id}
              onClick={() =>
                router.push(`/settings/group/details/${grp.groupId}`)
              }
              className="cursor-pointer"
            >
              <TableCell>
                {grp.group.name}
                {isEqual(grp.group.ownerId, userId) ? (
                  <Badge variant="outline" className="ml-2">
                    own
                  </Badge>
                ) : null}
              </TableCell>
              <TableCell>
                <Suspense
                  fallback={
                    <div className="h-5 w-5 animate-pulse rounded bg-gray-200"></div>
                  }
                >
                  <GroupMembersCount groupId={grp.groupId} />
                </Suspense>
              </TableCell>
              <TableCell className="w-10">
                <ArrowRight className="h-4 w-4" />
              </TableCell>
              <hr className="mx-4 rounded-full border-b border-muted last:hidden" />
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
