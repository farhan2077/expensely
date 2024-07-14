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

import { getGroupInfo } from "@/app/actions/group";
import { validateSession } from "@/app/actions/auth";
import { isEqual } from "@/libs/utils";
import { Badge } from "@/components/ui/badge";
import { getFormattedDate, getRelativeTime } from "@/libs/formatters";

export default async function Page({ params }: { params: { id: string } }) {
  const { user } = await validateSession();
  const id = params.id;

  const result = await getGroupInfo(id);

  if (!result.success || !user) {
    notFound();
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium">
                {result.data.groupInfo.name}
              </h2>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {isEqual(result.data.groupInfo.ownerId, user.id)
              ? "You can add or remove members here"
              : "View who are in this group"}
          </p>
        </div>

        {isEqual(result.data.groupInfo.ownerId, user.id) ? (
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
          {isEqual(result.data.groupInfo.ownerId, user.id)
            ? "Your group"
            : "This group"}{" "}
          has {result.data.groupMembers.length} member
          {result.data.groupMembers.length > 1 ? "s" : ""}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Joined</TableHead>
            {isEqual(result.data.groupInfo.ownerId, user.id) ? (
              <TableHead></TableHead>
            ) : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.data.groupMembers.map((member: any) => {
            return (
              <TableRow key={member.id}>
                <TableCell className="font-medium">
                  <p>{member.user.name}</p>
                  {isEqual(result.data.groupInfo.ownerId, user.id) ? (
                    <p className="text-sm font-normal text-muted-foreground">
                      {member.user.email}
                    </p>
                  ) : null}
                </TableCell>
                <TableCell>
                  {isEqual(result.data.groupInfo.ownerId, member.user.id) ? (
                    <Badge
                      variant="outline"
                      className="border-blue-100 bg-blue-100"
                    >
                      Owner
                    </Badge>
                  ) : (
                    <Badge variant="outline">Member</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {getRelativeTime(member.user.createdAt)}
                      </TooltipTrigger>
                      <TooltipContent>
                        {getFormattedDate(member.user.createdAt)}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                {isEqual(result.data.groupInfo.ownerId, user.id) ? (
                  <TableCell className="w-fit text-right">
                    <Button variant="ghost">
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
