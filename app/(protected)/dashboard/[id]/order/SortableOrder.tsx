"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { GripVertical, Trash } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sortable,
  SortableDragHandle,
  SortableItem,
} from "@/components/ui/sortable";
import { type GroupsOrders } from "@/db/schema/groups-orders";
import { Icons } from "@/components/icons";
import { updateGroupOrders } from "@/app/actions/group-order";
import { toast } from "sonner";
import { useState } from "react";

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
}: {
  groupId: string;
  groupOrderInfoData: GroupsOrders[];
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof groupOrderFormSchema>>({
    resolver: zodResolver(groupOrderFormSchema),
    defaultValues: {
      // data: [
      //   {
      //     name: "Farhan",
      //   },
      //   {
      //     name: "Ismail",
      //   },
      //   {
      //     name: "Sohan",
      //   },
      // ],
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

  const { fields, move, remove } = useFieldArray({
    control: form.control,
    name: "data",
  });

  const { isDirty } = form.formState;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <Sortable
          value={fields}
          onMove={({ activeIndex, overIndex }) => move(activeIndex, overIndex)}
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
                          <Input className="h-10" {...field} />
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
                  {/* <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-10 shrink-0"
                    onClick={() => remove(index)}
                  >
                    <Trash
                      className="size-4 text-destructive"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Remove</span>
                  </Button> */}
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
            {isLoading ? "Updating" : "Update"}
          </Button>
          {/* this empty slot can add, with empty and everyone name */}
          {/* both empty and everyone slots can be one or more */}
          {/* <Button size="sm" variant={"outline"} className="w-fit">
            Add empty slot
          </Button> */}
        </div>
      </form>
    </Form>
  );
}
