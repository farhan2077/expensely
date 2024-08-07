"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { getResetPasswordMail } from "@/app/(auth)/forgot-password/actions";

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

import { forgotPasswordFormSchema } from "@/libs/validations/auth";

type FormType = z.infer<typeof forgotPasswordFormSchema>;

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<FormType>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(formValues: FormType) {
    setIsLoading(true);

    try {
      const res = await getResetPasswordMail(formValues.email);

      if (!res.success) {
        toast.warning(res.message);
        return;
      }

      toast.success(res.message);
      form.reset();
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
        <div className="pt-2">
          <Button disabled={isLoading} type="submit" className="w-full">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isLoading ? "" : "Send mail"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
