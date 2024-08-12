import React from "react";

import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";
import { toast } from "sonner";

import { deleteEmptyAndResetOrder } from "@/app/actions/group-order";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function RemoveEmptySlots({ groupId }: { groupId: string }) {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async () => {
    try {
      const result = await deleteEmptyAndResetOrder(groupId);
      if (result.success) {
        toast.success("Empty slots removed successfully");
        window.location.reload();
      } else {
        toast.warning(result.message || "Failed to remove empty slots");
      }
    } catch (error) {
      toast.error("Something went wrong while removing empty slots");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button
        type="submit"
        size="sm"
        variant="destructive"
        className="flex w-fit gap-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Icons.spinner className="h-4 w-4 animate-spin" />
        ) : (
          <Trash className="h-4 w-4" />
        )}
        {isSubmitting ? "" : "Delete empty slots"}
      </Button>
    </form>
  );
}
