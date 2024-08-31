"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { z } from "zod";

import {
  addMonthlyUtilities,
  type MonthlyUtilityOutputData,
  updateMonthlyUtilities,
} from "@/app/actions/monthly-utility";

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

import { isEmpty } from "@/libs/utils";
import { monthlyUtilityFormSchema } from "@/libs/validations/monthly-utility";

export default function AddUtilities({
  open,
  setOpen,
  groupId,
  monthlyUtilitiesData,
}: {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;
  groupId: string;
  monthlyUtilitiesData: MonthlyUtilityOutputData | null;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isMonthlyUtilsDataEmpty =
    !monthlyUtilitiesData ||
    !monthlyUtilitiesData.id ||
    isEmpty(monthlyUtilitiesData);

  const form = useForm<z.infer<typeof monthlyUtilityFormSchema>>({
    resolver: zodResolver(monthlyUtilityFormSchema),
    defaultValues: {
      electricity: isMonthlyUtilsDataEmpty
        ? undefined
        : monthlyUtilitiesData.electricity,
      internet: isMonthlyUtilsDataEmpty
        ? undefined
        : monthlyUtilitiesData.internet,
      water: isMonthlyUtilsDataEmpty ? undefined : monthlyUtilitiesData.water,
      gas: isMonthlyUtilsDataEmpty ? undefined : monthlyUtilitiesData.gas,
      cook: isMonthlyUtilsDataEmpty ? undefined : monthlyUtilitiesData.cook,
      otherUtils: isMonthlyUtilsDataEmpty
        ? undefined
        : monthlyUtilitiesData.otherUtils,
    },
  });

  async function onSubmit(
    formValues: z.infer<typeof monthlyUtilityFormSchema>
  ) {
    setIsLoading(true);

    try {
      const formattedData = {
        groupId: groupId,
        electricity: formValues.electricity,
        internet: formValues.internet,
        water: formValues.water,
        gas: formValues.gas,
        cook: formValues.cook,
        otherUtils: formValues.otherUtils,
      };

      let res = null;

      isMonthlyUtilsDataEmpty
        ? (res = await addMonthlyUtilities(formattedData))
        : (res = await updateMonthlyUtilities(
            formattedData,
            monthlyUtilitiesData.id
          ));

      if (res.success) {
        toast.success(res.message);
        form.reset();
        setOpen(false);
      } else {
        toast.warning(res.message);
      }
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
            <DialogTitle>
              {isMonthlyUtilsDataEmpty ? "Add" : "Update"} Utilities
            </DialogTitle>
            <DialogDescription>
              {isMonthlyUtilsDataEmpty ? (
                <>Add data for {format(new Date(), "MMMM yyyy")}</>
              ) : (
                <>
                  You&apos;re updating data for{" "}
                  {format(monthlyUtilitiesData.date, "MMMM yyyy")}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="electricity"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Electricity bill</FormLabel>
                      <FormControl>
                        <Input
                          autoFocus
                          type="number"
                          inputMode="numeric" // display numeric keyboard on mobile
                          placeholder="Enter elctricity bill"
                          autoComplete="electricity"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="internet"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Internet bill</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric" // display numeric keyboard on mobile
                          placeholder="Enter internet bill"
                          autoComplete="internet"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="water"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Water bill</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric" // display numeric keyboard on mobile
                          placeholder="Enter water bill"
                          autoComplete="water"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gas"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Gas bill</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric" // display numeric keyboard on mobile
                          placeholder="Enter gas bill"
                          autoComplete="gas"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cook"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Cook bill</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric" // display numeric keyboard on mobile
                          placeholder="Enter cook bill"
                          autoComplete="cook"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="otherUtils"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Other utilities bill</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric" // display numeric keyboard on mobile
                          placeholder="Enter other utilities bill"
                          autoComplete="otherUtils"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-4 flex gap-4">
                <Button
                  variant={"outline"}
                  className="w-1/2 hover:border-destructive/20 hover:bg-destructive/10 hover:text-destructive focus-visible:border-destructive/20 focus-visible:bg-destructive/10 focus-visible:ring-destructive"
                  onClick={(e) => {
                    e.preventDefault();
                    form.reset();
                  }}
                >
                  Clear all
                </Button>
                <Button disabled={isLoading} type="submit" className="w-1/2">
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLoading
                    ? ""
                    : isMonthlyUtilsDataEmpty
                      ? "Add data"
                      : "Update data"}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollAreaNoFocus>
      </DialogContent>
    </Dialog>
  );
}
