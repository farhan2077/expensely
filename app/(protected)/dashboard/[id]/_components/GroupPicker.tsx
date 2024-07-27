"use client";

import { type Route } from "next";
import { useState } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { Check, ChevronsUpDown, Plus, Users } from "lucide-react";

import { cn } from "@/libs/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UsersGroups } from "@/db/schema/users-groups";
import CreateGroup from "@/components/dialogs/CreateGroup";
import JoinGroup from "@/components/dialogs/JoinGroup";

export default function GroupPicker({
  user,
  usersGroups,
}: {
  user: any;
  usersGroups: any;
}) {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openJoinModal, setOpenJoinModal] = useState(false);

  const matchedGroupFromParam = usersGroups.find(
    (item: UsersGroups) => item.groupId === params.id && item.userId === user.id
  );

  if (!matchedGroupFromParam) {
    return null; // Or a loading spinner
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="flex w-[200px] justify-between overflow-hidden shadow"
            size="sm"
          >
            <div className="overflow-hidden text-ellipsis">
              {matchedGroupFromParam.group.name}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0" align="end">
          <Command>
            <CommandInput placeholder="Search group..." />
            <CommandList>
              <CommandEmpty>No group found.</CommandEmpty>
              <CommandGroup>
                {usersGroups.map((group: any) => (
                  <CommandItem
                    key={group.id}
                    value={group.group.name}
                    onSelect={() => {
                      const OVERVIEW_LINK =
                        `/dashboard/${group.groupId}` as Route;
                      const UTILITIES_LINK =
                        `/dashboard/${group.groupId}/utilities` as Route;

                      setOpen(false);
                      router.push(
                        pathname.endsWith("/utilities")
                          ? UTILITIES_LINK
                          : OVERVIEW_LINK
                      );
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 shrink-0",
                        params.id === group.groupId
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <span className="truncate">{group.group.name}</span>
                    {group.group.ownerId === user.id ? (
                      <Badge className="ml-2 px-1.5 py-0">own</Badge>
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <hr />
          <div className="m-1">
            <Button
              onClick={() => {
                setOpen(false);
                setOpenCreateModal(true);
              }}
              variant="ghost"
              className="h-8 w-full justify-start rounded px-2 text-sm font-normal hover:bg-accent"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create group
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                setOpenJoinModal(true);
              }}
              variant="ghost"
              className="h-8 w-full justify-start rounded px-2 text-sm font-normal hover:bg-accent"
            >
              <Users className="mr-2 h-4 w-4" />
              Join group
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <CreateGroup open={openCreateModal} setOpen={setOpenCreateModal} />
      <JoinGroup open={openJoinModal} setOpen={setOpenJoinModal} />
    </>
  );
}
