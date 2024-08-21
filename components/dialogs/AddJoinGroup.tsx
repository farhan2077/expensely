"use client";

import { APP_NAME } from "@/config";

import CreateJoinGroupForm from "@/app/welcome/CreateJoinGroupForm";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { SafeUser } from "@/db/schema/users";

function AddJoinGroup({
  open,
  setOpen,
  userInfoData,
}: {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;
  userInfoData: SafeUser;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader className="mb-2">
          <DialogTitle>Add or join group</DialogTitle>
          <DialogDescription>
            Start using {APP_NAME} after this step
          </DialogDescription>
        </DialogHeader>
        <CreateJoinGroupForm userInfoData={userInfoData} />
      </DialogContent>
    </Dialog>
  );
}

export default AddJoinGroup;
