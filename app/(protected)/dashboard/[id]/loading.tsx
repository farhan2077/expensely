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
      <section className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <div className="h-[110px] animate-pulse rounded-md bg-muted"></div>
        <div className="hidden h-[110px] animate-pulse rounded-md bg-muted md:block"></div>
        <div className="hidden h-[110px] animate-pulse rounded-md bg-muted md:block"></div>
      </section>
    </>
  );
}
