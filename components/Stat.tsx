import { cn } from "@/libs/utils";

export default function Stat({
  title,
  value,
  helperText,
  wrapperClassName,
  titleAccentColor,
  titleColor,
}: {
  title: string;
  value: number;
  helperText: string;
  wrapperClassName?: string;
  titleAccentColor: string;
  titleColor: string;
}) {
  return (
    <div className={wrapperClassName}>
      <div className="mb-1.5 flex items-center gap-1.5">
        <span
          className={cn("size-2.5 rounded-[2px]", titleAccentColor)}
          aria-hidden="true"
        ></span>
        <p className={cn("font-medium", titleColor)}>{title}</p>
      </div>
      <div className="flex h-9 items-end gap-1.5">
        <span className="text-3xl font-bold tracking-wide">{value}</span>
        <span className="mb-1 text-sm text-muted-foreground">{helperText}</span>
      </div>
    </div>
  );
}
