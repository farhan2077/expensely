import { format } from "date-fns";

export default function Loading() {
  const currentMonth = format(new Date(), "MMMM");

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">
        Responsibilities
      </h1>
      <p className="text-muted-foreground">See who is in charge</p>
      <hr className="my-4 text-muted-foreground" />
      <section className="flex flex-col gap-4 lg:flex-row lg:gap-8">
        <div className="-ml-3 w-full shrink-0 px-3 lg:w-[250px]">
          <h2 className="text-lg font-medium">Order for {currentMonth}</h2>
          <p className="mt-1 text-balance text-sm text-muted-foreground">
            See who is currently in charge
          </p>
        </div>
        <div className="w-full">
          <div className="flex w-full gap-4 overflow-scroll">
            <div className="flex flex-row gap-2 sm:w-fit">
              <div className="flex flex-col gap-2">
                <div className="h-[40px] w-[170px] animate-pulse rounded-md bg-muted lg:w-[185px]"></div>
                <div className="h-[40px] w-[170px] animate-pulse rounded-md bg-muted lg:w-[185px]"></div>
                <div className="h-[40px] w-[170px] animate-pulse rounded-md bg-muted lg:w-[185px]"></div>
                <div className="h-[40px] w-[170px] animate-pulse rounded-md bg-muted lg:w-[185px]"></div>
                <div className="h-[40px] w-[170px] animate-pulse rounded-md bg-muted lg:w-[185px]"></div>
              </div>
            </div>
            <div className="flex flex-row gap-2 sm:w-fit">
              <div className="flex flex-col gap-2">
                <div className="h-[40px] w-[170px] animate-pulse rounded-md bg-muted lg:w-[185px]"></div>
                <div className="h-[40px] w-[170px] animate-pulse rounded-md bg-muted lg:w-[185px]"></div>
                <div className="h-[40px] w-[170px] animate-pulse rounded-md bg-muted lg:w-[185px]"></div>
                <div className="h-[40px] w-[170px] animate-pulse rounded-md bg-muted lg:w-[185px]"></div>
                <div className="h-[40px] w-[170px] animate-pulse rounded-md bg-muted lg:w-[185px]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
