import { ReactNode } from "react";

export default function Section({
  header,
  description,
  children,
}: {
  header: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 lg:flex-row lg:gap-8">
      <div className="-ml-3 w-full shrink-0 px-3 lg:w-[250px]">
        <h2 className="text-lg font-medium">{header}</h2>
        <p className="mt-1 text-balance text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="w-full">{children}</div>
    </section>
  );
}
