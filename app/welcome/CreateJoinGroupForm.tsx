"use client";

import { useState } from "react";

import { Shapes, Users } from "lucide-react";

import CreateGroup from "@/components/dialogs/CreateGroup";
import JoinGroup from "@/components/dialogs/JoinGroup";
import { Button } from "@/components/ui/button";

import type { SafeUser } from "@/db/schema/users";

function CreateJoinGroupForm({ userInfoData }: { userInfoData: SafeUser }) {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openJoinModal, setOpenJoinModal] = useState(false);

  return (
    <>
      <div className="flex w-full items-center justify-center gap-4">
        <div className="flex flex-col items-center">
          <Button onClick={() => setOpenCreateModal(true)} className="gap-2">
            <Shapes className="h-4 w-4" />
            Create group
          </Button>
        </div>
        <div className="flex flex-col items-center">
          <Button
            variant={"outline"}
            onClick={() => setOpenJoinModal(true)}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            Join group
          </Button>
        </div>
      </div>
      <CreateGroup
        open={openCreateModal}
        setOpen={setOpenCreateModal}
        userInfoData={userInfoData}
      />
      <JoinGroup
        open={openJoinModal}
        setOpen={setOpenJoinModal}
        userInfoData={userInfoData}
      />
    </>
  );
}

export default CreateJoinGroupForm;
