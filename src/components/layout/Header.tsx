import Link from "next/link";
import { SITE_SETTINGS } from "@/lib/constants";
import { PageContainer } from "@/components/layout/PageContainer";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/75 bg-background/72 backdrop-blur-xl supports-[backdrop-filter]:bg-background/58">
      <PageContainer className="relative flex items-center justify-between gap-3 py-3">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-6 -bottom-px h-px bg-gradient-to-r from-transparent via-accent/45 to-transparent"
        />
        <Logo />
        <nav className="flex items-center gap-2 text-sm text-neutral">
          <Link
            className="inline-flex items-center rounded-full border border-transparent px-3 py-1.5 transition-all duration-200 hover:border-border/70 hover:bg-[var(--surface-card-hover)] hover:text-foreground"
            href="/"
          >
            홈
          </Link>
          <a
            className="inline-flex items-center rounded-full border border-transparent px-3 py-1.5 transition-all duration-200 hover:border-border/70 hover:bg-[var(--surface-card-hover)] hover:text-foreground"
            href={SITE_SETTINGS.telegramHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            텔레그램
          </a>
          <a
            className="inline-flex items-center rounded-full border border-accent/45 bg-accent/12 px-3 py-1.5 font-semibold text-foreground transition-all duration-200 hover:border-accent/70 hover:bg-accent/20"
            href={SITE_SETTINGS.ctaHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            네프콘 구독
          </a>
          <ThemeToggle />
        </nav>
      </PageContainer>
    </header>
  );
}
