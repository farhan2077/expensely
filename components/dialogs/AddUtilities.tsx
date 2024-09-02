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
      <DialogContent className="max-w-lg">
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
        <ScrollAreaNoFocus>
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
                          type="number"
                          inputMode="numeric" // display numeric keyboard on mobile
                          placeholder="Enter elctricity bill"
                          autoComplete="electricity"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? "" : Number(value));
                          }}
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
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? "" : Number(value));
                          }}
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
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? "" : Number(value));
                          }}
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
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? "" : Number(value));
                          }}
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
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? "" : Number(value));
                          }}
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
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? "" : Number(value));
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-4 flex gap-4">
                {isMonthlyUtilsDataEmpty ? (
                  <Button
                    type="button"
                    variant={"outline"}
                    className="w-1/2 hover:border-destructive/20 hover:bg-destructive/10 hover:text-destructive focus-visible:border-destructive/20 focus-visible:bg-destructive/10 focus-visible:ring-destructive"
                    onClick={(e) => {
                      e.preventDefault();
                      form.reset({
                        // @ts-expect-error
                        electricity: "",
                        // @ts-expect-error
                        internet: "",
                        // @ts-expect-error
                        water: "",
                        // @ts-expect-error
                        gas: "",
                        // @ts-expect-error
                        cook: "",
                        // @ts-expect-error
                        otherUtils: "",
                      });
                    }}
                  >
                    Clear all
                  </Button>
                ) : null}
                <Button
                  disabled={isLoading}
                  type="submit"
                  className={`${isMonthlyUtilsDataEmpty ? "w-1/2" : "w-full"}`}
                >
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
