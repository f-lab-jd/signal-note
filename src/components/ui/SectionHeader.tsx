import type { HTMLAttributes } from "react";

interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
}

export function SectionHeader({
  className,
  title,
  subtitle,
  ...props
}: SectionHeaderProps) {
  const classes = [
    "flex flex-col gap-1 border-b border-border/80 pb-3",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
      {subtitle ? <p className="text-sm text-neutral">{subtitle}</p> : null}
    </div>
  );
}
