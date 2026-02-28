import { Zap } from "lucide-react";
import Link from "next/link";

interface LogoProps {
  href?: string;
  className?: string;
}

export function Logo({ href = "/", className }: LogoProps) {
  const classes = [
    "inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-3 py-1.5 text-sm font-semibold tracking-tight",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link className={classes} href={href}>
      <span>시그널노트</span>
      <Zap aria-hidden className="size-4 text-accent" />
    </Link>
  );
}
