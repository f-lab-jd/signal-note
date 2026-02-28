import { ArrowUpRight } from "lucide-react";
import { SITE_SETTINGS } from "@/lib/constants";

export function CTABanner() {
  return (
    <aside className="rounded-2xl border border-accent/35 bg-accent/10 p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-neutral">네프콘에서 더 많은 종목을 확인하세요</p>
          <p className="mt-1 text-lg font-semibold tracking-tight">매일 시그널 받기</p>
        </div>
        <a
          className="inline-flex items-center justify-center gap-1 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110"
          href={SITE_SETTINGS.ctaHref}
          rel="noopener noreferrer"
          target="_blank"
        >
          매일 시그널 받기
          <ArrowUpRight aria-hidden className="size-4" />
        </a>
      </div>
    </aside>
  );
}
