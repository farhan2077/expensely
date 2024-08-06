"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

import { resetPasswordFormSchema } from "@/libs/validations/auth";
import { changePassword } from "@/app/(auth)/reset-password/actions";

type FormType = z.infer<typeof resetPasswordFormSchema>;

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<FormType>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      token: token,
      password: "",
      confirm_password: "",
    },
  });

  async function onSubmit(formValues: FormType) {
    console.log(formValues);
    setIsLoading(true);

    try {
      const res = await changePassword(formValues.token, formValues.password);
      if (!res.success) {
        toast.warning(res.message);
        return;
      }
      toast.success(res.message);
      form.reset();
      router.push("/sign-in");
    } catch (error: any) {
      toast.error(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Must include both numbers and characters"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Re-enter password"
                  autoComplete="confirm-password"
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
            {isLoading ? "" : "Change password"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
