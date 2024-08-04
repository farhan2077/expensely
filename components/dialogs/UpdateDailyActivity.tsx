"use client";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Icons } from "@/components/icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { updateDailyActivityFormSchema } from "@/libs/validations/daily-activity";
import {
  updateDailyActivity,
  type DailyActivityOutputData,
} from "@/app/actions/daily-activity";

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

  async function onSubmit(formValues: FormType) {
    setIsLoading(true);

    const formattedFormValues = formValues.groups.map((group, index) => ({
      ...group,
      id: restData[index].id,
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
        // p-6 is applied by default, but <ScrollArea/> was cutting the input field ring thus p-5 here and additional p-1 is applied later
        className="max-w-lg overflow-hidden p-5"
      >
        <ScrollArea className="max-h-[85vh]">
          <div className="p-1">
            <DialogHeader className="mb-4">
              <DialogTitle>Update meal and grocery cost</DialogTitle>
              <DialogDescription>
                You are updating data for {format(restData[0].date, "PP")}
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
                            <span className="mr-1.5 inline-flex h-4 w-4 items-center justify-center rounded bg-muted-foreground/20 text-xs tabular-nums text-black/80">
                              {index + 1}
                            </span>
                            <span>{restData[index].user.name}</span>
                          </p>
                        </div>
                        <FormField
                          control={form.control}
                          name={`groups.${index}.meal`}
                          render={({ field }) => (
                            <FormItem className="col-start-5 col-end-9 space-y-1">
                              <FormLabel>Meal(s)</FormLabel>
                              <FormControl>
                                <Input
                                  className="placeholder:tracking-tight"
                                  type="number"
                                  inputMode="numeric" // display numeric keyboard on mobile
                                  placeholder="Number of meal"
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
                              <FormLabel>Grocery expenses</FormLabel>
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
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
