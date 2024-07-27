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
import { useForm } from "react-hook-form";
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
import { monthlyUtilityFormSchema } from "@/libs/validations/monthly-utility";
import {
  addMonthlyUtilities,
  updateMonthlyUtilities,
  type MonthlyUtilityOutputData,
} from "@/app/actions/monthly-utility";
import { isEmpty } from "@/libs/utils";

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
        // p-6 is applied by default, but <ScrollArea/> was cutting the input field ring thus p-5 here and additional p-1 is applied later
        className="max-w-lg overflow-hidden p-5"
      >
        <ScrollArea className="max-h-[85vh]">
          <div className="p-1">
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
                <div className="mt-4">
                  <Button disabled={isLoading} type="submit" className="w-full">
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
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
