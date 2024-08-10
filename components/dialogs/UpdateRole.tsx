"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { updateUserRole } from "@/app/actions/group";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type UserGroupTypeT } from "@/db/schema/users-groups";

import { userRoleUpdateFormSchema } from "@/libs/validations/user";

export function UpdateRole({
  open,
  setOpen,
  id,
  name,
  groupId,
  currentType,
}: {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;
  id: string;
  name: string;
  groupId: string;
  currentType: UserGroupTypeT;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const ROLES = ["editor", "member"];

  const form = useForm<z.infer<typeof userRoleUpdateFormSchema>>({
    resolver: zodResolver(userRoleUpdateFormSchema),
  });

  async function onSubmit(
    formValues: z.infer<typeof userRoleUpdateFormSchema>
  ) {
    setIsLoading(true);

    try {
      const res = await updateUserRole(id, groupId, formValues.role);
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
            Once done, {name} will be an editor
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="capitalize">
                        <SelectValue placeholder={currentType} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ROLES.map((role) => {
                        return (
                          <SelectItem
                            key={role}
                            value={role}
                            defaultChecked={role === currentType}
                            className="capitalize"
                          >
                            {role}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="focus-visible:ring-0"
              >
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit" className="w-full">
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isLoading ? "" : "Update role"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
