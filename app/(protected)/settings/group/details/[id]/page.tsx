import { notFound } from "next/navigation";
import { Badge as BadgeIcon, Ellipsis } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { getGroupDetails } from "@/app/actions/group";
import { validateSession } from "@/app/actions/auth";
import { isEqual } from "@/libs/utils";
import { Badge } from "@/components/ui/badge";
import { ViewGroupCode } from "@/app/(protected)/settings/group/details/[id]/ViewGroupCode";

export default async function Page({ params }: { params: { id: string } }) {
  const { user } = await validateSession();
  const id = params.id;

  const groupDetails = await getGroupDetails(id);

  if (!user || !groupDetails.success || !groupDetails.data) {
    notFound();
  }

  const isAdmin = isEqual(groupDetails.data.groupInfo.ownerId, user.id);

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
          {groupDetails.data.groupMembers.map((member: any) => {
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
                    {isAdmin ? "Owner" : "Member"}
                  </Badge>
                </TableCell>
                {isAdmin ? (
                  <TableCell className="w-fit text-right">
                    <Button variant={"ghost"} size={"icon"}>
                      <Ellipsis className="h-4 w-4" />
                    </Button>
                  </TableCell>
                ) : null}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
