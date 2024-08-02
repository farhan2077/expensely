import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { addGroupOrder } from "@/app/actions/group-order";
import { EMPTY_MAIL } from "@/config";

export function AddEmptySlot({ groupId }: { groupId: string }) {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async () => {
    try {
      const result = await addGroupOrder(
        groupId,
        EMPTY_MAIL,
        "▶︎ This is an empty slot ◀︎"
      );
      if (result.success) {
        toast.success("Empty slot added successfully");
        // You might want to add a callback here to update the parent component
        // or use a state management solution to refresh the list
      } else {
        toast.warning(result.message || "Failed to add empty slot");
      }
    } catch (error) {
      toast.error("Something went wrong while adding empty slot");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button
        type="submit"
        size="sm"
        variant="outline"
        className="w-fit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        {isSubmitting ? "Adding..." : "Add empty slot"}
      </Button>
    </form>
  );
}
