import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PriceSparkline } from "@/components/charts/PriceSparkline";
import { CTABanner } from "@/components/layout/CTABanner";
import { Header } from "@/components/layout/Header";
import { PageContainer } from "@/components/layout/PageContainer";
import { ShareButtons } from "@/components/share/ShareButtons";
import { Card } from "@/components/ui/Card";
import { Footer } from "@/components/ui/Footer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SITE_SETTINGS } from "@/lib/constants";
import { getAllCompanies } from "@/lib/data";
import { formatCompactKRW, formatNumber } from "@/lib/format";
import type { MarketData } from "@/data/schema";
import marketJson from "@/data/market.json";

const marketData = marketJson as MarketData;

const X_FOLLOW_URL = "https://x.com/nadojdya";
const DASHBOARD_OG_IMAGE = {
  width: 1200,
  height: 630,
} as const;
const OPEN_GRAPH_LOCALE = "ko_KR";
const DASHBOARD_TITLE = "대표 25종목 대시보드";

function getPercentChange(currentValue: number | null, baseValue: number | null): number | null {
  if (currentValue === null || baseValue === null || baseValue === 0) {
    return null;
  }

  return ((currentValue - baseValue) / baseValue) * 100;
}

function getChangeClassName(changePercent: number | null): string {
  if (changePercent === null || changePercent === 0 || Object.is(changePercent, -0)) {
    return "text-neutral";
  }

  return changePercent > 0 ? "text-up" : "text-down";
}

function formatChange(changePercent: number | null): string {
  if (changePercent === null || changePercent === 0 || Object.is(changePercent, -0)) {
    return "0%";
  }

  const sign = changePercent > 0 ? "+" : "";
  return `${sign}${formatNumber(changePercent, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
}

export function generateMetadata(): Metadata {
  const title = DASHBOARD_TITLE;
  const socialTitle = `${DASHBOARD_TITLE} | 시그널노트`;
  const description = "국내 대표 25개 종목의 시총, 변동률, 가격 추이를 한눈에 확인하는 대시보드입니다.";

  // Build dynamic OG URL from latest KOSPI data
  const kospi = marketData.indices.find((i) => i.label === "KOSPI");
  const kospiValue = kospi?.value != null
    ? new Intl.NumberFormat("ko-KR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(kospi.value)
    : "시그널노트";
  const kospiChange = kospi?.changePercent != null && kospi.changePercent !== 0
    ? (kospi.changePercent > 0 ? "+" : "") +
      new Intl.NumberFormat("ko-KR", { minimumFractionDigits: 1, maximumFractionDigits: 2 }).format(kospi.changePercent) + "%"
    : "0%";
  const kospiSign = kospi?.changePercent == null || kospi.changePercent === 0
    ? "neutral"
    : kospi.changePercent > 0 ? "up" : "down";

  const ogParams = new URLSearchParams({
    title: kospiValue,
    v1: "KOSPI",
    n1: kospiChange,
    sign: kospiSign,
    badge: "오늘의 시장",
  });
  const ogImageUrl = `/api/og?${ogParams.toString()}`;

  return {
    title,
    description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: socialTitle,
      description,
      type: "website",
      locale: OPEN_GRAPH_LOCALE,
      url: "/",
      siteName: SITE_SETTINGS.name,
      images: [
        {
          url: ogImageUrl,
          width: DASHBOARD_OG_IMAGE.width,
          height: DASHBOARD_OG_IMAGE.height,
          alt: "시그널노트 대시보드 OG 이미지",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@nadojdya",
      title: socialTitle,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function Home() {
  const companies = getAllCompanies();
  const lastUpdated =
    companies
      .map((company) => company.lastUpdated)
      .sort((left, right) => left.localeCompare(right))
      .at(-1) ?? "—";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="py-8 sm:py-12">
        <PageContainer className="space-y-6 sm:space-y-7">
          <Card className="relative overflow-hidden border-accent/40 bg-[linear-gradient(125deg,color-mix(in_oklab,var(--color-accent)_18%,transparent)_0%,color-mix(in_oklab,var(--color-card)_85%,transparent)_50%,transparent_100%)]">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-12 -top-10 size-44 rounded-full bg-accent/30 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-10 left-12 size-48 rounded-full bg-down/20 blur-3xl"
            />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  <span className="bg-gradient-to-r from-accent via-emerald-500 to-cyan-400 bg-clip-text text-transparent">
                    시그널노트
                  </span>
                  <span aria-hidden className="ml-2 inline-block animate-pulse text-foreground">
                    ⚡
                  </span>
                </h1>
                <p className="text-base text-neutral sm:text-lg">국내 대표 종목 핵심 데이터를 한눈에 파악하세요</p>
              </div>

              <div className="rounded-2xl border border-border/75 bg-background/45 px-4 py-3 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.16em] text-neutral">최종 업데이트</p>
                <p className="fin-num mt-1 text-sm font-semibold">{lastUpdated}</p>
              </div>
            </div>
          </Card>

          <a
            className="group flex items-center justify-between gap-4 rounded-2xl border border-accent/45 bg-accent/12 px-5 py-4 shadow-[0_12px_30px_rgba(0,208,132,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent/16"
            href={SITE_SETTINGS.ctaHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-neutral">오늘의 프리미엄 시그널</p>
              <p className="mt-1 text-base font-semibold sm:text-lg">네프콘에서 매일 시그널 받기 →</p>
            </div>
            <ArrowUpRight aria-hidden className="size-5 shrink-0 text-accent transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>

          <Card className="space-y-4">
            <SectionHeader
              title="주요 종목"
              subtitle="섹터별 대표 25개 종목의 핵심 지표와 단기 흐름을 빠르게 점검합니다."
            />

            <div className="-mx-1 overflow-x-auto pb-2 sm:mx-0 sm:overflow-visible">
              <div className="grid grid-flow-col auto-cols-[minmax(78%,1fr)] gap-4 px-1 sm:grid-flow-row sm:grid-cols-2 sm:px-0 lg:grid-cols-3 xl:grid-cols-5">
                {companies.map((company) => {
                  const latestClose = company.priceHistory.at(-1)?.close ?? null;
                  const previousClose = company.priceHistory.at(-2)?.close ?? null;
                  const monthBaseClose = company.priceHistory.at(-5)?.close ?? company.priceHistory[0]?.close ?? null;
                  const dayChange = getPercentChange(latestClose, previousClose);
                  const monthChange = getPercentChange(latestClose, monthBaseClose);

                  return (
                    <Link className="group block h-full" href={`/stock/${company.slug}`} key={company.slug}>
                      <Card className="flex h-full min-h-72 flex-col gap-4 border-border/80 bg-[linear-gradient(155deg,color-mix(in_oklab,var(--color-card)_88%,white_12%)_0%,var(--color-card)_100%)] p-4 backdrop-blur-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:border-accent/60 group-hover:bg-[color-mix(in_oklab,var(--surface-card-hover)_85%,transparent)] group-hover:shadow-[0_24px_46px_-30px_rgba(0,0,0,0.68)]">
                        <div className="space-y-1">
                          <p className="text-lg font-semibold tracking-tight">{company.nameKo}</p>
                          <p className="fin-num text-xs text-neutral">
                            {company.nameEn} · {company.tickerCode}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-xl border border-border/70 bg-background/45 px-3 py-2.5">
                            <p className="text-[11px] uppercase tracking-[0.14em] text-neutral">당일</p>
                            <p className={`fin-num mt-1 text-sm font-semibold ${getChangeClassName(dayChange)}`}>
                              {formatChange(dayChange)}
                            </p>
                          </div>
                          <div className="rounded-xl border border-border/70 bg-background/45 px-3 py-2.5">
                            <p className="text-[11px] uppercase tracking-[0.14em] text-neutral">5거래일</p>
                            <p className={`fin-num mt-1 text-sm font-semibold ${getChangeClassName(monthChange)}`}>
                              {formatChange(monthChange)}
                            </p>
                          </div>
                        </div>

                        <div className="rounded-xl border border-border/70 bg-background/36 px-3 py-2.5">
                          <p className="text-[11px] uppercase tracking-[0.14em] text-neutral">시가총액</p>
                          <p className="fin-num mt-1 text-base font-semibold">{formatCompactKRW(company.metrics.marketCap)}</p>
                        </div>

                        <div className="mt-auto rounded-xl border border-border/70 bg-background/34 px-2 py-2">
                          <PriceSparkline data={company.priceHistory} height={86} />
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </Card>

          <Card className="space-y-4">
            <SectionHeader title="시장 한눈에" subtitle="지수와 환율 흐름으로 오늘의 시장 온도를 빠르게 확인합니다." />

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {marketData.indices.map((market) => (
                <Card
                  elevated={false}
                  className="space-y-1 border-border/70 bg-[linear-gradient(145deg,color-mix(in_oklab,var(--color-card)_90%,var(--color-accent)_10%)_0%,color-mix(in_oklab,var(--color-card)_96%,transparent)_100%)] p-5"
                  key={market.label}
                >
                  <p className="text-xs text-neutral">{market.label}</p>
                  <p className="fin-num text-xl font-semibold">{formatNumber(market.value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p className={`fin-num text-sm font-semibold ${getChangeClassName(market.changePercent)}`}>
                    {formatChange(market.changePercent)}
                  </p>
                </Card>
              ))}
            </div>
          </Card>

          <Card className="space-y-4 border-accent/35 bg-[linear-gradient(130deg,color-mix(in_oklab,var(--color-accent)_20%,transparent)_0%,var(--color-card)_62%_52%,transparent_100%)]">
            <SectionHeader
              title="시그널 구독"
              subtitle="네프콘 구독과 텔레그램 채널로 새로운 시그널 업데이트를 놓치지 마세요."
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <a
                className="inline-flex items-center justify-center gap-1 rounded-full border border-black/10 bg-accent px-4 py-2.5 text-sm font-bold text-black shadow-[0_12px_28px_rgba(0,208,132,0.34)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
                href={SITE_SETTINGS.ctaHref}
                rel="noopener noreferrer"
                target="_blank"
              >
                네프콘 구독
                <ArrowUpRight aria-hidden className="size-4" />
              </a>
              <a
                className="inline-flex items-center justify-center gap-1 rounded-full border border-border/80 bg-background/45 px-4 py-2.5 text-sm font-semibold text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:bg-[var(--surface-card-hover)]"
                href={SITE_SETTINGS.telegramHref}
                rel="noopener noreferrer"
                target="_blank"
              >
                텔레그램 채널
                <ArrowUpRight aria-hidden className="size-4" />
              </a>
              <a
                className="inline-flex items-center justify-center gap-1 rounded-full border border-border/80 bg-background/45 px-4 py-2.5 text-sm font-semibold text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:bg-[var(--surface-card-hover)]"
                href={X_FOLLOW_URL}
                rel="noopener noreferrer"
                target="_blank"
              >
                X에서 팔로우
                <ArrowUpRight aria-hidden className="size-4" />
              </a>
            </div>
          </Card>

          <ShareButtons shareText="시그널노트 — 투자 데이터, 한눈에 보다" />

          <CTABanner />
        </PageContainer>
      </main>
      <Footer />
    </div>
  );
}
