"use client";

import { type Route } from "next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import type { User } from "@/db/schema/users";

import { Icons } from "@/components/icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { groupFormSchema } from "@/libs/validations/group";
import { createGroupAction } from "@/app/actions/group";

function CreateGroup({
  open,
  setOpen,
  userInfoData,
}: {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;
  userInfoData: Omit<User, "hash" | "salt">;
}) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof groupFormSchema>>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: "",
      code: undefined,
    },
  });

  async function onSubmit(formValues: z.infer<typeof groupFormSchema>) {
    setIsLoading(true);

    try {
      const res = await createGroupAction(
        formValues.name,
        formValues.code,
        userInfoData.name,
        userInfoData.email
      );
      if (res.success && res.data) {
        toast.success(res.message);
        form.reset();

        const OVERVIEW_LINK = `/dashboard/${res.data.groupId}` as Route;

        router.push(OVERVIEW_LINK);
        setOpen(false);
      } else {
        toast.warning(res.message);
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new group</DialogTitle>
          <DialogDescription>
            Create and manage your own group
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group name</FormLabel>
                  <FormControl>
                    <Input
                      autoFocus
                      type="text"
                      placeholder="Enter preferred group name"
                      autoComplete="group-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a 4 digit code" // your defaultValue must be undefined
                      autoComplete="group-code"
                      inputMode="numeric" // display numeric keyboard on mobile
                      {...field}
                      value={field.value || ""} // avoid errors of uncontrolled vs controlled
                      pattern="[0-9]*" // to receive only numbers without showing does weird arrows in the input
                      onChange={
                        (e) =>
                          e.target.validity.valid &&
                          field.onChange(e.target.value) // e.target.validity.valid is required for pattern to work
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-2">
              <Button disabled={isLoading} type="submit" className="w-full">
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isLoading ? "" : "Create new group"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateGroup;
