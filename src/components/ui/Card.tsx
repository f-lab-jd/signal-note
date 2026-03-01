import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export function Card({ className, elevated = true, ...props }: CardProps) {
  const classes = [
    "rounded-2xl border border-border/85 bg-card/94 p-5 text-card-foreground transition-all duration-200",
    "dark:border-border/90 dark:bg-card/92",
    elevated
      ? "shadow-[0_1px_3px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_24px_54px_-34px_rgba(0,0,0,0.92)]"
      : "shadow-none",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes} {...props} />;
}
