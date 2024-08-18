export default function Stat({
  title,
  value,
  helperText,
  wrapperClassName,
}: {
  title: string;
  value: number;
  helperText: string;
  wrapperClassName?: string;
}) {
  return (
    <div className={wrapperClassName}>
      <p className="mb-1.5 font-medium">{title}</p>
      <div>
        <span className="text-3xl font-bold tracking-wide">{value}</span>
        <span className="ms-1.5 text-sm text-muted-foreground">
          {helperText}
        </span>
      </div>
    </div>
  );
}
