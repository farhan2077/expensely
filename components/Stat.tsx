import { ArrowDownRight } from "lucide-react";

import { cn } from "@/libs/utils";

export default function Stat({
  title,
  value,
  isGood,
  showComparator = false,
  helperText,
  wrapperClassName,
  titleAccentColor,
  titleColor,
}: {
  title: string;
  value: number;
  isGood?: boolean; // shows green indicator (comparison)
  showComparator?: boolean; // if green indicator should be shown
  helperText: string;
  wrapperClassName?: string;
  titleAccentColor: string;
  titleColor: string;
}) {
  return (
    <div className={wrapperClassName}>
      <div className="mb-1.5 flex items-center gap-1.5">
        <span
          className={cn("size-2.5 shrink-0 rounded-[2px]", titleAccentColor)}
          aria-hidden="true"
        ></span>
        <p className={cn("whitespace-nowrap", titleColor)}>{title}</p>
        <div>
          {showComparator ? (
            isGood ? (
              <ArrowDownRight className="h-3.5 w-3.5 rounded-[2px] bg-green-100 text-green-700 ring-1 ring-green-300 dark:bg-green-950 dark:text-green-300 dark:ring-green-900" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5 -rotate-90 rounded-[2px] bg-red-100 text-red-700 ring-1 ring-red-200 dark:bg-red-950 dark:text-red-300 dark:ring-red-900" />
            )
          ) : null}
        </div>
      </div>
      <div className="flex h-9 items-end gap-1.5">
        <span className="text-3xl font-bold tracking-wide">{value}</span>
        <span className="mb-1 text-sm text-muted-foreground">{helperText}</span>
      </div>
    </div>
  );
}
