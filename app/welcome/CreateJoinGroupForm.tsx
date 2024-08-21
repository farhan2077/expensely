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
      <div className="flex w-full items-center justify-center gap-10">
        <div className="flex flex-col items-center">
          <div className="mb-4 flex items-center justify-center">
            <Shapes className="h-10 w-10 stroke-[1.5px]" />
          </div>
          <Button onClick={() => setOpenCreateModal(true)}>Create group</Button>
        </div>
        <div className="flex flex-col items-center">
          <div className="mb-4 flex items-center justify-center">
            <Users className="h-10 w-10 stroke-[1.5px]" />
          </div>
          <Button onClick={() => setOpenJoinModal(true)}>Join group</Button>
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
