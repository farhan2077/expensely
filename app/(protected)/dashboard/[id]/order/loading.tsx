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
      <section className="flex gap-8">
        <div className="-ml-3 w-[250px] shrink-0 px-3">
          <h2 className="text-lg font-medium">Order for {currentMonth}</h2>
          <p className="mt-1 text-balance text-sm text-muted-foreground">
            See who is currently in charge
          </p>
        </div>
        <div className="w-full">
          <div className="flex flex-col">
            <div className="flex gap-4">
              <div className="flex flex-col gap-2">
                <div className="h-[40px] w-[180px] animate-pulse rounded-md bg-muted"></div>
                <div className="h-[40px] w-[180px] animate-pulse rounded-md bg-muted"></div>
                <div className="h-[40px] w-[180px] animate-pulse rounded-md bg-muted"></div>
                <div className="h-[40px] w-[180px] animate-pulse rounded-md bg-muted"></div>
                <div className="h-[40px] w-[180px] animate-pulse rounded-md bg-muted"></div>
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col gap-2">
                  <div className="h-[40px] w-[360px] animate-pulse rounded-md bg-muted"></div>
                  <div className="h-[40px] w-[360px] animate-pulse rounded-md bg-muted"></div>
                  <div className="h-[40px] w-[360px] animate-pulse rounded-md bg-muted"></div>
                  <div className="h-[40px] w-[360px] animate-pulse rounded-md bg-muted"></div>
                  <div className="h-[40px] w-[360px] animate-pulse rounded-md bg-muted"></div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="h-[40px] w-[40px] animate-pulse rounded-md bg-muted"></div>
                  <div className="h-[40px] w-[40px] animate-pulse rounded-md bg-muted"></div>
                  <div className="h-[40px] w-[40px] animate-pulse rounded-md bg-muted"></div>
                  <div className="h-[40px] w-[40px] animate-pulse rounded-md bg-muted"></div>
                  <div className="h-[40px] w-[40px] animate-pulse rounded-md bg-muted"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
