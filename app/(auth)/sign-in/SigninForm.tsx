"use client";

import { type Route } from "next";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { signinFormSchema } from "@/libs/validations/auth";
import { signinAction } from "@/app/(auth)/sign-in/actions";
import { isEmpty } from "@/libs/utils";
import { getUsersGroups } from "@/app/actions/group";

export function SigninForm() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof signinFormSchema>>({
    resolver: zodResolver(signinFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(formValues: z.infer<typeof signinFormSchema>) {
    setIsLoading(true);

    try {
      const { success, message } = await signinAction(
        formValues.email,
        formValues.password
      );

      if (!success) {
        setIsLoading(false);
        toast.warning(message);
        return;
      }

      toast.success(message);
      form.reset();
      await handleSuccessfulSignIn();
    } catch (error) {
      setIsLoading(false);
      handleError(error);
    }
  }

  async function handleSuccessfulSignIn() {
    try {
      const { data: groups } = await getUsersGroups();

      if (isEmpty(groups)) {
        router.push("/welcome");
        return;
      }

      const targetGroupId = getTargetGroupId(groups);
      const OVERVIEW_LINK = `/dashboard/${targetGroupId}` as Route;
      router.push(OVERVIEW_LINK);
    } catch (error) {
      toast.error("Could not fetch room data");
    }
  }

  function getTargetGroupId(groups: any[]) {
    const ownedGroups = groups.filter(
      (item) => item.userId === item.group.ownerId
    );

    return ownedGroups.length > 0 ? ownedGroups[0].groupId : groups[0].groupId;
  }

  function handleError(error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    toast.error(errorMessage);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  autoFocus
                  type="email"
                  placeholder="email@example.com"
                  autoComplete="email"
                  spellCheck={false}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                {/* <p className="text-sm leading-none underline">
                  Forgot password?
                </p> */}
              </div>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Must include both numbers and characters"
                  autoComplete="password"
                  {...field}
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
            {isLoading ? "" : "Log in"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
