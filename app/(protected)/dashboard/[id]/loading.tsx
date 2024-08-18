export default function Loading() {
  return (
    <>
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <div className="text-muted-foreground">
          <div className="h-[24px] w-full animate-pulse rounded-md bg-muted sm:w-[300px]"></div>
        </div>
      </section>
      <hr className="my-4 text-muted-foreground" />
      <section className="flex gap-20">
        <div>
          <div className="mb-3.5 mt-0.5 h-[20px] w-[80px] animate-pulse rounded-md bg-muted"></div>
          <div className="h-[20px] w-[100px] animate-pulse rounded-md bg-muted"></div>
        </div>
        <div className="hidden md:block">
          <div className="mb-3.5 mt-0.5 h-[20px] w-[50px] animate-pulse rounded-md bg-muted"></div>
          <div className="h-[20px] w-[70px] animate-pulse rounded-md bg-muted"></div>
        </div>
        <div className="hidden md:block">
          <div className="mb-3.5 mt-0.5 h-[20px] w-[80px] animate-pulse rounded-md bg-muted"></div>
          <div className="h-[20px] w-[100px] animate-pulse rounded-md bg-muted"></div>
        </div>
      </section>
    </>
  );
}
