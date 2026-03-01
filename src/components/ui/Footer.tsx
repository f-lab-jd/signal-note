import { SITE_SETTINGS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-[color-mix(in_oklab,var(--surface-muted)_45%,transparent)] py-8">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="text-base font-semibold text-foreground">시그널노트</p>
            <p className="text-xs text-neutral">투자 참고용 자료이며 투자 권유가 아닙니다.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs sm:justify-end">
            <a
              className="inline-flex items-center rounded-full border border-border/75 bg-background/70 px-3 py-1.5 font-semibold text-foreground transition-colors hover:border-accent/55 hover:text-accent"
              href="https://x.com/nadojdya"
              rel="noopener noreferrer"
              target="_blank"
            >
              X @nadojdya
            </a>
            <a
              className="inline-flex items-center rounded-full border border-accent/40 bg-accent/12 px-3 py-1.5 font-semibold text-foreground transition-colors hover:border-accent/70"
              href={SITE_SETTINGS.ctaHref}
              rel="noopener noreferrer"
              target="_blank"
            >
              네프콘 구독
            </a>
          </div>
        </div>

        <p className="mt-4 text-xs text-neutral">데모 데이터 기준 · {new Date().getFullYear()}년 업데이트</p>
      </div>
    </footer>
  );
}
