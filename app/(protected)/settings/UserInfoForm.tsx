"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Info } from "lucide-react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { userInfoFormSchema } from "@/libs/validations/user";
import { updatedUserName } from "@/app/actions/user";

export default function UserInfoForm({ userInfo }: { userInfo: any }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof userInfoFormSchema>>({
    resolver: zodResolver(userInfoFormSchema),
    defaultValues: {
      name: userInfo.name,
    },
  });

  async function onSubmit(formValues: z.infer<typeof userInfoFormSchema>) {
    setIsLoading(true);

    try {
      const result = await updatedUserName(userInfo.id, formValues.name);

      if (!result.success) {
        toast.warning(result.message);
        return;
      }

      toast.success(result.message);

      form.reset({
        name: result.data,
      });
    } catch (error) {
      toast.error("Unknown error occured");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="name" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                This is how other&apos;s see you
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <div className="flex items-center">
            <Label>Email</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="ml-1 h-3 w-3" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Primary email cannot be changed</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input defaultValue={userInfo.email} disabled />
          <p className="text-xs text-muted-foreground">
            You can manage verified email addresses in your email settings.
          </p>
        </div>
        <div className="pt-2">
          <Button disabled={isLoading} type="submit">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isLoading ? "Updating profile" : "Update profile"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
