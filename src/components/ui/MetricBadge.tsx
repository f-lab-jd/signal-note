import type { HTMLAttributes } from "react";

interface MetricBadgeProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
}

export function MetricBadge({ className, label, value, ...props }: MetricBadgeProps) {
  const classes = [
    "inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/40 px-3 py-1.5",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      <span className="text-xs text-neutral">{label}</span>
      <span className="fin-num text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}
