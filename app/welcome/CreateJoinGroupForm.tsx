"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import CreateGroup from "@/components/dialogs/CreateGroup";
import JoinGroup from "@/components/dialogs/JoinGroup";

function CreateJoinGroupForm() {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openJoinModal, setOpenJoinModal] = useState(false);

  return (
    <div className="flex w-full items-center justify-center gap-4">
      <Button variant="outline" onClick={() => setOpenCreateModal(true)}>
        Create group
      </Button>
      <CreateGroup open={openCreateModal} setOpen={setOpenCreateModal} />

      <Button onClick={() => setOpenJoinModal(true)}>Join group</Button>
      <JoinGroup open={openJoinModal} setOpen={setOpenJoinModal} />
    </div>
  );
}

export default CreateJoinGroupForm;
