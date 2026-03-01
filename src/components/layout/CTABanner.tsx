import { ArrowUpRight } from "lucide-react";
import { SITE_SETTINGS } from "@/lib/constants";

export function CTABanner() {
  return (
    <aside className="relative overflow-hidden rounded-3xl border border-accent/40 bg-[linear-gradient(125deg,color-mix(in_oklab,var(--color-accent)_28%,transparent)_0%,color-mix(in_oklab,var(--color-accent)_9%,transparent)_44%,transparent_100%)] p-6 sm:p-7">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-accent/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 left-8 size-44 rounded-full bg-up/15 blur-3xl"
      />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-neutral">네프콘 프리미엄에서 더 깊은 데이터를 확인하세요</p>
          <p className="text-2xl font-semibold tracking-tight sm:text-3xl">🔥 매일 장 시작 전 핵심 시그널 받기</p>
        </div>
        <a
          className="inline-flex items-center justify-center gap-1 rounded-full border border-black/10 bg-accent px-5 py-2.5 text-sm font-bold text-black shadow-[0_8px_22px_rgba(0,208,132,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 sm:text-base"
          href={SITE_SETTINGS.ctaHref}
          rel="noopener noreferrer"
          target="_blank"
        >
          ⚡ 네프콘에서 시그널 받기
          <ArrowUpRight aria-hidden className="size-4" />
        </a>
      </div>
    </aside>
  );
}
