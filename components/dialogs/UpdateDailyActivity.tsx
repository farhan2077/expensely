"use client";

import { useEffect, useState } from "react";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { z } from "zod";

import {
  type DailyActivityOutputData,
  updateDailyActivity,
} from "@/app/actions/daily-activity";

import { Icons } from "@/components/icons";
import ScrollAreaNoFocus from "@/components/scroll-area-no-focus";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Input } from "@/components/ui/input";

import { getFirstName } from "@/libs/utils";
import { updateDailyActivityFormSchema } from "@/libs/validations/daily-activity";

export type FormType = z.infer<typeof updateDailyActivityFormSchema>;

export default function UpdateDailyActivity({
  open,
  setOpen,
  restData,
}: {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;
  restData: DailyActivityOutputData[];
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<FormType>({
    resolver: zodResolver(updateDailyActivityFormSchema),
    defaultValues: {
      groups: restData,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "groups",
  });

  useEffect(() => {
    form.setValue("groups", restData);
  }, [form, restData]);

  async function onSubmit(formValues: FormType) {
    setIsLoading(true);

    const formattedFormValues = formValues.groups.map((group) => ({
      id: group.id,
      meal: group.meal,
      grocery: group.grocery,
    }));

    try {
      const res = await updateDailyActivity({
        formValues: formattedFormValues,
      });

      if (!res.success) {
        toast.warning(res.message);
        return;
      }

      toast.success(res.message);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        // <DialogContent /> has p-6 by default
        // but <ScrollAreaNoFocus /> is cutting the input field ring due to overflow-hidden, so p-2 here (scrollbar will also be present inside this p-2)
        // and additional p-4 is applied later, in p-4 this scrollbar is placed so it is not placed on top of the content on the dialog
        className="max-w-lg overflow-hidden p-2"
      >
        {/* <ScrollArea /> from shadcn/ui or radix-ui is not used here due to focus trapping issues, instead custom one is used here which is without focus trap */}
        <ScrollAreaNoFocus className="max-h-[85vh] overflow-y-auto p-4">
          <DialogHeader className="mb-4">
            <DialogTitle>Update meal and grocery cost</DialogTitle>
            <DialogDescription>
              You are updating data for {format(restData[0].date, "PPP")}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="divide-y-2 divide-muted *:pb-4 *:pt-3 first:*:pt-0 last:*:pb-0">
                {fields.map((field, index) => (
                  <div className="grid grid-cols-1" key={field.id}>
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-start-1 col-end-5">
                        <p className="mt-1 flex items-center text-ellipsis text-sm font-medium leading-none">
                          <span className="mr-1.5 inline-flex h-4 w-4 items-center justify-center rounded bg-muted-foreground/20 text-xs tabular-nums text-foreground/80">
                            {index + 1}
                          </span>
                          <span className="lowercase first-letter:capitalize">
                            {getFirstName(field.user.name)}
                          </span>
                        </p>
                      </div>
                      <FormField
                        control={form.control}
                        name={`groups.${index}.meal`}
                        render={({ field }) => (
                          <FormItem className="col-start-5 col-end-9 space-y-1">
                            <FormLabel>Meals</FormLabel>
                            <FormControl>
                              <Input
                                className="placeholder:tracking-tight"
                                type="number"
                                inputMode="numeric" // display numeric keyboard on mobile
                                placeholder="Number of meals"
                                autoComplete="meal"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`groups.${index}.grocery`}
                        render={({ field }) => (
                          <FormItem className="col-start-9 col-end-13 space-y-1">
                            <FormLabel>
                              Grocery&nbsp;
                              <span className="hidden sm:inline">expenses</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="placeholder:tracking-tight"
                                type="number"
                                inputMode="numeric" // display numeric keyboard on mobile
                                placeholder="Amount spent"
                                autoComplete="grocery"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-4">
                <Button disabled={isLoading} type="submit" className="w-full">
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLoading ? "" : "Update data"}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollAreaNoFocus>
      </DialogContent>
    </Dialog>
  );
}
