import { notFound } from "next/navigation";

import { SortableOrder } from "@/app/(protected)/dashboard/[id]/order/SortableOrder";
import { getGroupOrderInfo } from "@/app/actions/group-order";
import { format } from "date-fns";

export default async function Page({ params }: { params: { id: string } }) {
  const groupId = params.id;

  const groupOrderInfo = await getGroupOrderInfo(groupId);

  if (!groupOrderInfo || !groupOrderInfo.data) {
    notFound();
  }

  const currentMonth = format(new Date(), "MMMM");

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">
        Responsibilities
      </h1>
      <p className="text-muted-foreground">See who is in charge</p>
      <hr className="my-4 text-muted-foreground" />
      <div className="grid space-y-8">
        <section className="flex gap-8">
          <div className="-ml-3 w-[250px] shrink-0 px-3">
            <h2 className="text-lg font-medium">
              {currentMonth}&apos;s utilities
            </h2>
            <p className="mt-1 text-balance text-sm text-muted-foreground">
              Set order bla bla bla
            </p>
          </div>
          <SortableOrder
            groupId={groupId}
            groupOrderInfoData={groupOrderInfo.data}
          />
        </section>
      </div>
    </>
  );
}
