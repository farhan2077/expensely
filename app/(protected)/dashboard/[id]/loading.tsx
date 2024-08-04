export default function Loading() {
  return (
    <div className="grid gap-4">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          <div className="h-[24px] w-[400px] animate-pulse rounded-md bg-muted"></div>
        </p>
      </section>
      <hr className="text-muted-foreground" />
      <section className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="h-[110px] animate-pulse rounded-md bg-muted"></div>
        <div className="h-[110px] animate-pulse rounded-md bg-muted"></div>
        <div className="h-[110px] animate-pulse rounded-md bg-muted"></div>
      </section>
    </div>
  );
}
