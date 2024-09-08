"use client";

import { useEffect, useState } from "react";

import { type Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { getUsersGroups } from "@/app/actions/group";

import { signinAction } from "@/app/(auth)/sign-in/actions";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { signinFormSchema } from "@/libs/validations/auth";

export function SigninForm() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passwordFieldType, setPasswordFieldType] = useState("password");

  useEffect(() => {
    async function handleSuccessfulSignIn() {
      try {
        const result = await getUsersGroups();

        if (result.success && result.data) {
          if (result.data.length === 0) {
            router.push(`/welcome`);
          }

          router.push(`/dashboard/${result.data[0].groupId}` as Route);
        }
      } catch (error) {
        toast.error("Could not fetch room data");
      }
    }

    handleSuccessfulSignIn();
  }, [router]);

  function togglePasswordFieldType() {
    setPasswordFieldType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  }

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
    } catch (error) {
      setIsLoading(false);
      handleError(error);
    }
  }

  // function getTargetGroupId(groups: any[]) {
  //   const ownedGroups = groups.filter(
  //     (item) => item.userId === item.group.ownerId
  //   );

  //   return ownedGroups.length > 0 ? ownedGroups[0].groupId : groups[0].groupId;
  // }

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
                  tabIndex={1}
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
                <Link
                  tabIndex={5}
                  href="/forgot-password"
                  className="text-sm leading-none text-muted-foreground hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input
                    tabIndex={2}
                    type={passwordFieldType}
                    placeholder="Must include both numbers and characters"
                    autoComplete="password"
                    {...field}
                  />
                  <Button
                    tabIndex={3}
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="shrink-0"
                    onClick={(e) => {
                      e.preventDefault();
                      togglePasswordFieldType();
                    }}
                  >
                    {passwordFieldType === "password" ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="pt-2">
          <Button
            tabIndex={4}
            disabled={isLoading}
            type="submit"
            className="w-full"
          >
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
