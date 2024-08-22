import { format } from "date-fns";

export default function Loading() {
  const currentMonth = format(new Date(), "MMMM");

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Bills</h1>
      <p className="text-muted-foreground">
        Utility and other bills for {currentMonth}
      </p>
      <hr className="my-4 text-muted-foreground" />
      <section className="flex flex-col gap-4 lg:flex-row lg:gap-8">
        <div className="-ml-3 w-full shrink-0 px-3 lg:w-[250px]">
          <h2 className="text-lg font-medium">
            {currentMonth}&apos;s utilities
          </h2>
          <p className="mt-1 text-balance text-sm text-muted-foreground">
            Shared equally amongst groups memebers
          </p>
        </div>
        <div className="w-full">
          <div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
              <div className="h-[110px] animate-pulse rounded-md bg-muted"></div>
              <div className="h-[110px] animate-pulse rounded-md bg-muted"></div>
              <div className="h-[110px] animate-pulse rounded-md bg-muted"></div>
              <div className="h-[110px] animate-pulse rounded-md bg-muted"></div>
              <div className="h-[110px] animate-pulse rounded-md bg-muted"></div>
              <div className="h-[110px] animate-pulse rounded-md bg-muted"></div>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-[24px] w-[400px] animate-pulse rounded-md bg-muted"></div>
            <div className="mt-4 h-[40px] w-[200px] animate-pulse rounded-md bg-muted"></div>
          </div>
        </div>
      </section>
    </>
  );
}
