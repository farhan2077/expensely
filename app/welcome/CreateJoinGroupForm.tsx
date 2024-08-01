"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import CreateGroup from "@/components/dialogs/CreateGroup";
import JoinGroup from "@/components/dialogs/JoinGroup";
import type { SafeUser } from "@/db/schema/users";

function CreateJoinGroupForm({ userInfoData }: { userInfoData: SafeUser }) {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openJoinModal, setOpenJoinModal] = useState(false);

  return (
    <div className="flex w-full items-center justify-center gap-4">
      <Button onClick={() => setOpenCreateModal(true)}>Create group</Button>
      <CreateGroup
        open={openCreateModal}
        setOpen={setOpenCreateModal}
        userInfoData={userInfoData}
      />

      <Button variant="outline" onClick={() => setOpenJoinModal(true)}>
        Join group
      </Button>
      <JoinGroup
        open={openJoinModal}
        setOpen={setOpenJoinModal}
        userInfoData={userInfoData}
      />
    </div>
  );
}

export default CreateJoinGroupForm;
