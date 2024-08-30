"use client";

import { useState } from "react";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  endOfDay,
  format,
  isAfter,
  isBefore,
  isSameDay,
  startOfMonth,
  startOfTomorrow,
  subMonths,
} from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { addDailyAcitivities } from "@/app/actions/daily-activity";

import { Icons } from "@/components/icons";
import ScrollAreaNoFocus from "@/components/scroll-area-no-focus";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn, getFirstName } from "@/libs/utils";
import { dailyActivityFormSchema } from "@/libs/validations/daily-activity";

export default function AddDailyActivity({
  open,
  setOpen,
  groupMembers,
  disabledDates,
}: {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;
  groupMembers: any;
  disabledDates: Array<string>;
}) {
  const today = new Date();
  const tomorrow = startOfTomorrow();
  const startOfPreviousMonth = startOfMonth(subMonths(today, 1));

  const isDateDisabled = (date: Date) => {
    return (
      isAfter(endOfDay(date), tomorrow) || // Disable days after today
      isBefore(date, startOfPreviousMonth) || // Disable days before the start of the current month
      disabledDates.some((disabledDate) => isSameDay(date, disabledDate)) // Disable specific dates
    );
  };

  const formDefaultValue = {
    date: new Date(),
    meal: undefined,
    grocery: undefined,
  };

  const formDefaultValueArr = Array(groupMembers.length)
    .fill(null)
    .map(() => ({ ...formDefaultValue }));

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [daypickerOpen, setDaypickerOpen] = useState(false);

  const form = useForm<z.infer<typeof dailyActivityFormSchema>>({
    resolver: zodResolver(dailyActivityFormSchema),
    defaultValues: {
      groups: formDefaultValueArr,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "groups",
  });

  const fillEmptyFields = () => {
    const currentGroupValues = form.getValues().groups;

    const updatedGroupValues = currentGroupValues.map((group) => ({
      meal: group.meal || 0,
      grocery: group.grocery || 0,
    }));
    form.setValue("groups", updatedGroupValues);
  };

  async function onSubmit(formValues: z.infer<typeof dailyActivityFormSchema>) {
    if (!formValues.date) {
      toast.error("Date is required.");
      return;
    }

    const formattedFormValues = formValues.groups.map((group, index) => ({
      ...group,
      // date: formValues.date.toISOString().split("T")[0],
      date: format(formValues.date, "P"),
      // crossCheckName: groupMembers[index].user.name, // for TESTING only
      userId: groupMembers[index].user.id,
      groupId: groupMembers[index].group.id,
    }));

    setIsLoading(true);

    try {
      const res = await addDailyAcitivities(formattedFormValues);
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
        aria-describedby={undefined} // this is needed to remove the `DialogDescription` entirely since `DialogDescription` is not used here
      >
        {/* <ScrollArea /> from shadcn/ui or radix-ui is not used here due to focus trapping issues, instead custom one is used here which is without focus trap */}
        <ScrollAreaNoFocus className="max-h-[85vh] overflow-y-auto p-4">
          <DialogHeader className="mb-4">
            <DialogTitle>Add info</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-12">
                      <FormLabel
                        tabIndex={0} // make date picker first focusable item
                        className="col-start-1 col-end-5 mt-2 text-ellipsis text-sm font-medium leading-none focus-visible:outline-none"
                      >
                        Choose date
                      </FormLabel>
                      <Popover
                        open={daypickerOpen}
                        onOpenChange={setDaypickerOpen}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              aria-expanded={daypickerOpen}
                              className={cn(
                                "col-start-5 col-end-13 px-3 text-left font-normal",
                                {
                                  "text-muted-foreground": !field.value,
                                }
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value || undefined}
                            onSelect={(date) => {
                              field.onChange(date);
                              setDaypickerOpen(false);
                            }}
                            disabled={isDateDisabled}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid grid-cols-12">
                      <div className="col-start-5 col-end-13">
                        <FormMessage className="text-xs" />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <hr className="mb-2 mt-2 border-b border-muted" />
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
                            {getFirstName(groupMembers[index].user.name)}
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
                <Button
                  variant={"outline"}
                  className="w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    fillEmptyFields();
                  }}
                >
                  Fill empty fields
                </Button>
                <Button disabled={isLoading} type="submit" className="w-full">
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLoading ? "" : "Add data"}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollAreaNoFocus>
      </DialogContent>
    </Dialog>
  );
}
