import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export function Card({ className, elevated = true, ...props }: CardProps) {
  const classes = [
    "rounded-2xl border border-border/90 bg-card/95 p-5",
    elevated ? "shadow-[0_18px_40px_-28px_rgba(0,0,0,0.9)]" : "shadow-none",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes} {...props} />;
}
