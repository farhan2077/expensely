"use client";

import { toast } from "sonner";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { removeMemberFromGroup } from "@/app/actions/group";
import { useForm } from "react-hook-form";

export function RemoveMember({
  open,
  setOpen,
  id,
  name,
  groupId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string;
  name: string;
  groupId: string;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm({});

  async function onSubmit() {
    // do something
    setIsLoading(true);

    try {
      const res = await removeMemberFromGroup(id, groupId);
      if (!res.success) {
        toast.warning(res.message);
        return;
      }

      toast.success(res.message);
      setOpen(false);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Are you sure?</DialogTitle>
          <DialogDescription className="text-pretty py-2 text-center">
            Once removed, {name}&apos;s data will no longer be available
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="focus-visible:ring-0"
          >
            Cancel
          </Button>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Button
                disabled={isLoading}
                type="submit"
                variant="destructive"
                className="w-full"
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isLoading ? "" : "Kick member"}
              </Button>
            </form>
          </Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
