import Link from "next/link";
import { SITE_SETTINGS } from "@/lib/constants";
import { PageContainer } from "@/components/layout/PageContainer";
import { Logo } from "@/components/ui/Logo";

export function Header() {
  return (
    <header className="border-b border-border/80 bg-background/85 py-3 backdrop-blur">
      <PageContainer className="flex items-center justify-between gap-3">
        <Logo />
        <nav className="flex items-center gap-2 text-sm text-neutral">
          <Link className="rounded-full px-3 py-1 hover:bg-card hover:text-foreground" href="/">
            홈
          </Link>
          <a
            className="rounded-full border border-border/80 px-3 py-1 text-foreground hover:bg-card"
            href={SITE_SETTINGS.ctaHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            Nepcon
          </a>
        </nav>
      </PageContainer>
    </header>
  );
}
