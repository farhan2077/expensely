"use client";

import { useEffect, useState } from "react";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GripVertical } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { EMPTY_MAIL_SUFFIX } from "@/config";

import { updateGroupOrders } from "@/app/actions/group-order";

import { AddEmptySlot } from "@/app/(protected)/dashboard/[id]/order/AddEmptySlot";
import { RemoveEmptySlots } from "@/app/(protected)/dashboard/[id]/order/RemoveEmptySlots";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sortable,
  SortableDragHandle,
  SortableItem,
} from "@/components/ui/sortable";

import { type GroupsOrders } from "@/db/schema/groups-orders";

import { cn } from "@/libs/utils";

const groupOrderFormSchema = z.object({
  data: z.array(
    z.object({
      name: z.string(),
      email: z.string().nullable(),
      order: z.number(),
    })
  ),
});

export function SortableOrder({
  groupId,
  groupOrderInfoData,
  activeIdx,
}: {
  groupId: string;
  groupOrderInfoData: GroupsOrders[];
  activeIdx: number;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof groupOrderFormSchema>>({
    resolver: zodResolver(groupOrderFormSchema),
    defaultValues: {
      data: groupOrderInfoData,
    },
  });

  async function onSubmit(formData: z.infer<typeof groupOrderFormSchema>) {
    const formattedFormData = formData.data.map((item, index) => ({
      ...item,
      order: index,
    }));
    setIsLoading(true);

    try {
      const res = await updateGroupOrders(groupId, formattedFormData);

      if (!res.success) {
        setIsLoading(false);
        toast.warning(res.message);
        return;
      }

      setIsLoading(false);
      toast.success(res.message);
      form.reset(formData); // Reset the form state
    } catch (e: any) {
      setIsLoading(false);
      toast.error(e);
    }
  }

  const { fields, move } = useFieldArray({
    control: form.control,
    name: "data",
  });

  useEffect(() => {
    form.reset({ data: groupOrderInfoData });
  }, [groupOrderInfoData, form]);

  const emptyItemFound = groupOrderInfoData.find((item) =>
    item.email?.includes(EMPTY_MAIL_SUFFIX)
  );

  const { isDirty } = form.formState;

  return (
    <div className="grid gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <Sortable
            value={fields}
            onMove={({ activeIndex, overIndex }) =>
              move(activeIndex, overIndex)
            }
            overlay={
              <div className="flex items-center gap-2">
                <div className="h-10 w-full rounded-sm bg-primary/10" />
                <div className="size-10 shrink-0 rounded-sm bg-primary/10" />
                {/* <div className="size-10 shrink-0 rounded-sm bg-primary/10" /> */}
              </div>
            }
          >
            <div className="grid gap-2">
              {fields.map((field, index) => (
                <SortableItem key={field.id} value={field.id} asChild>
                  <div className="flex w-[400px] items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`data.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input
                              className={cn(
                                "h-10 cursor-auto focus-visible:ring-0",
                                {
                                  "border-primary/80 bg-primary-foreground":
                                    activeIdx === index,
                                }
                              )}
                              {...field}
                              readOnly
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <SortableDragHandle
                      variant="outline"
                      size="icon"
                      className="size-10 shrink-0"
                    >
                      <GripVertical className="size-4" aria-hidden="true" />
                    </SortableDragHandle>
                  </div>
                </SortableItem>
              ))}
            </div>
          </Sortable>
          <div className="flex gap-4">
            <Button size="sm" className="w-fit" disabled={!isDirty}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isLoading ? "Updating order" : "Update order"}
            </Button>
          </div>
        </form>
      </Form>
      <div className="flex gap-4">
        <AddEmptySlot groupId={groupId} />
        {emptyItemFound ? <RemoveEmptySlots groupId={groupId} /> : null}
      </div>
    </div>
  );
}
