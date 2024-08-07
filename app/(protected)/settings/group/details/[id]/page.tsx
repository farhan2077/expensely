import { notFound } from "next/navigation";

import { Badge as BadgeIcon } from "lucide-react";

import { validateSession } from "@/app/actions/auth";
import { getGroupDetails, type GroupMember } from "@/app/actions/group";

import { ActionButtonDropdown } from "@/app/(protected)/settings/group/details/[id]/ActionButtonDropdown";
import { ViewGroupCode } from "@/app/(protected)/settings/group/details/[id]/ViewGroupCode";

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { isEqual } from "@/libs/utils";

export default async function Page({ params }: { params: { id: string } }) {
  const { user } = await validateSession();
  const id = params.id;

  const groupDetails = await getGroupDetails(id);

  if (!user || !groupDetails.success || !groupDetails.data) {
    notFound();
  }

  const ownerId = groupDetails.data.groupInfo.ownerId;
  const isAdmin = isEqual(ownerId, user.id);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium">
                {groupDetails.data.groupInfo.name}
              </h2>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {isAdmin ? (
              <ViewGroupCode groupCode={groupDetails.data.groupInfo.code} />
            ) : (
              "View who are in this group"
            )}
          </div>
        </div>

        {isAdmin ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="relative h-fit">
                  <BadgeIcon
                    strokeWidth={1.1}
                    className="custom__animate-spin-infinite h-12 w-12 animate-spin fill-primary/10 text-primary"
                  />
                  <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-xs font-bold text-primary">
                    own
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent>You created this group</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null}
      </div>

      <hr className="my-4 text-muted-foreground" />

      <Table>
        <TableCaption>
          {isAdmin ? "Your group" : "This group"} has{" "}
          {groupDetails.data.groupMembers.length} member
          {groupDetails.data.groupMembers.length > 1 ? "s" : ""}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            {isAdmin ? (
              <TableHead className="text-right">Action</TableHead>
            ) : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {groupDetails.data.groupMembers.map((member: GroupMember) => {
            const isMemberAdmin = ownerId === member.user.id;

            return (
              <TableRow key={member.id}>
                <TableCell className="font-medium">
                  <p>{member.user.name}</p>
                  {isAdmin ? (
                    <p className="text-sm font-normal text-muted-foreground">
                      {member.user.email}
                    </p>
                  ) : null}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {isMemberAdmin ? "Owner" : "Member"}
                  </Badge>
                </TableCell>
                <TableCell className="w-fit text-right">
                  {isAdmin && !isMemberAdmin ? (
                    <ActionButtonDropdown
                      id={member.id}
                      name={member.user.name}
                      groupId={member.group.id}
                    />
                  ) : null}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
