"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";

import { updateMonthlyActivity } from "@/app/actions/monthly-activity";

import { Icons } from "@/components/icons";
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

import {
  editMonthlyActivityFormSchema,
  type EditMonthlyActivityFormType,
} from "@/libs/validations/monthly-activity";

function EditMonthlyActivity({
  id,
  name,
  prevRent,
  prevPaid,
  totalToPay,
  open,
  setOpen,
}: {
  id: string;
  name: string;
  prevRent: number;
  prevPaid: number;
  totalToPay: number;
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentMonth = format(new Date(), "MMMM");

  const form = useForm<EditMonthlyActivityFormType>({
    resolver: zodResolver(editMonthlyActivityFormSchema),
    defaultValues: {
      rent: prevRent,
      paid: prevPaid === 0 ? undefined : prevPaid,
    },
  });

  async function onSubmit(formValues: EditMonthlyActivityFormType) {
    setIsLoading(true);

    try {
      const res = await updateMonthlyActivity(
        id,
        formValues.rent,
        formValues.paid
      );

      if (!res.success) {
        toast.warning(res.message);
      }

      setOpen(false);
      toast.success(res.message);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bill update</DialogTitle>
          <DialogDescription>
            {name} will have to pay{" "}
            <span className="font-medium text-foreground">
              {totalToPay} taka
            </span>{" "}
            for {currentMonth}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rent</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter rent amount"
                      autoComplete="rent"
                      inputMode="numeric" // display numeric keyboard on mobile
                      {...field}
                      value={field.value || ""} // avoid errors of uncontrolled vs controlled
                      pattern="[0-9]*" // to receive only numbers without showing does weird arrows in the input
                      onChange={
                        (e) =>
                          e.target.validity.valid &&
                          field.onChange(e.target.value) // e.target.validity.valid is required for pattern to work
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paid</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter paid amount" // your defaultValue must be undefined
                      autoComplete="paid"
                      inputMode="numeric" // display numeric keyboard on mobile
                      {...field}
                      value={field.value || ""} // avoid errors of uncontrolled vs controlled
                      pattern="[0-9]*" // to receive only numbers without showing does weird arrows in the input
                      onChange={
                        (e) =>
                          e.target.validity.valid &&
                          field.onChange(e.target.value) // e.target.validity.valid is required for pattern to work
                      }
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
                {isLoading ? "" : "Update data"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditMonthlyActivity;
