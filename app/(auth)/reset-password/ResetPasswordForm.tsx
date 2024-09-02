"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { changePassword } from "@/app/(auth)/reset-password/actions";

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

import { resetPasswordFormSchema } from "@/libs/validations/auth";

type FormType = z.infer<typeof resetPasswordFormSchema>;

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passwordFieldType, setPasswordFieldType] = useState("password");
  const [confirmPasswordFieldType, setConfirmPasswordFieldType] =
    useState("password");

  function togglePasswordFieldType() {
    setPasswordFieldType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  }

  function toggleConfirmPasswordFieldType() {
    setConfirmPasswordFieldType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  }

  const form = useForm<FormType>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      token: token,
      password: "",
      confirm_password: "",
    },
  });

  async function onSubmit(formValues: FormType) {
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
                <div className="flex items-center gap-2">
                  <Input
                    type={passwordFieldType}
                    placeholder="Must include both numbers and characters"
                    autoComplete="new-password"
                    {...field}
                  />
                  <Button
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
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input
                    type={confirmPasswordFieldType}
                    placeholder="Re-enter password"
                    autoComplete="confirm-password"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="shrink-0"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleConfirmPasswordFieldType();
                    }}
                  >
                    {confirmPasswordFieldType === "password" ? (
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
