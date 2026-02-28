import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { HTMLAttributes } from "react";

interface ChangeBadgeProps extends HTMLAttributes<HTMLDivElement> {
  value: number | null;
}

function isNeutral(value: number | null): value is null | 0 {
  return value === null || value === 0 || Object.is(value, -0);
}

export function ChangeBadge({ className, value, ...props }: ChangeBadgeProps) {
  const neutral = isNeutral(value);
  const positive = !neutral && value > 0;
  const toneClass = neutral
    ? "border-border bg-background/40 text-neutral"
    : positive
      ? "border-up/30 bg-up/10 text-up"
      : "border-down/30 bg-down/10 text-down";

  const classes = [
    "fin-num inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-semibold",
    toneClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const Icon = neutral ? Minus : positive ? ArrowUpRight : ArrowDownRight;
  const displayValue = neutral
    ? value === null
      ? "—"
      : "0%"
    : `${positive ? "+" : "-"}${Math.abs(value).toFixed(2)}%`;

  return (
    <div className={classes} {...props}>
      <Icon aria-hidden className="size-3.5" />
      <span>{displayValue}</span>
    </div>
  );
}
