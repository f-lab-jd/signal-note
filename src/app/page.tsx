import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PriceSparkline } from "@/components/charts/PriceSparkline";
import { Header } from "@/components/layout/Header";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Footer } from "@/components/ui/Footer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SITE_SETTINGS } from "@/lib/constants";
import { getAllCompanies } from "@/lib/data";
import { formatCompactKRW, formatNumber } from "@/lib/format";

const MARKET_OVERVIEW = [
  { label: "KOSPI", value: "2,645.28", changePercent: 0.82 },
  { label: "KOSDAQ", value: "860.41", changePercent: -0.34 },
  { label: "USD/KRW", value: "1,328.60", changePercent: 0.15 },
] as const;

const X_FOLLOW_URL = "https://x.com/signalnote";
const DASHBOARD_OG_IMAGE_PATH = "/opengraph-image";
const DASHBOARD_OG_IMAGE = {
  width: 1200,
  height: 630,
} as const;

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
  const title = `시그널노트 대시보드 | ${SITE_SETTINGS.name}`;
  const description = "국내 대표 5개 기업의 시총, 변동률, 가격 추이를 한눈에 확인하는 대시보드입니다.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: SITE_SETTINGS.locale,
      siteName: SITE_SETTINGS.name,
      images: [
        {
          url: DASHBOARD_OG_IMAGE_PATH,
          width: DASHBOARD_OG_IMAGE.width,
          height: DASHBOARD_OG_IMAGE.height,
          alt: "시그널노트 대시보드 OG 이미지",
        },
      ],
    },
  };
}

export default function Home() {
  const companies = getAllCompanies().slice(0, 5);
  const lastUpdated =
    companies
      .map((company) => company.lastUpdated)
      .sort((left, right) => left.localeCompare(right))
      .at(-1) ?? "—";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="py-8 sm:py-12">
        <PageContainer className="space-y-6">
          <Card className="relative overflow-hidden border-accent/35 bg-card/95">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-8 size-40 rounded-full bg-accent/20 blur-3xl"
            />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-accent/90">Dashboard Home</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">시그널노트 ⚡</h1>
                <p className="mt-2 text-base text-neutral sm:text-lg">투자 데이터, 한눈에 보다</p>
              </div>

              <div className="rounded-xl border border-border/80 bg-background/35 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-neutral">Last updated</p>
                <p className="fin-num mt-1 text-sm font-semibold">{lastUpdated}</p>
              </div>
            </div>
          </Card>

          <Card className="space-y-4">
            <SectionHeader
              title="기업 카드 그리드"
              subtitle="대표 5개 종목의 핵심 지표와 단기 흐름을 빠르게 점검합니다."
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {companies.map((company) => {
                const latestClose = company.priceHistory.at(-1)?.close ?? null;
                const previousClose = company.priceHistory.at(-2)?.close ?? null;
                const monthBaseClose = company.priceHistory.at(-5)?.close ?? company.priceHistory[0]?.close ?? null;
                const dayChange = getPercentChange(latestClose, previousClose);
                const monthChange = getPercentChange(latestClose, monthBaseClose);

                return (
                  <Link className="group block h-full" href={`/stock/${company.slug}`} key={company.slug}>
                    <Card className="flex h-full flex-col gap-4 border-border/80 bg-background/20 p-4 transition duration-200 group-hover:-translate-y-0.5 group-hover:border-accent/55 group-hover:shadow-[0_24px_50px_-34px_rgba(0,0,0,0.92)]">
                      <div className="space-y-1">
                        <p className="text-lg font-semibold tracking-tight">{company.nameKo}</p>
                        <p className="fin-num text-xs text-neutral">
                          {company.nameEn} · {company.tickerCode}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-lg border border-border/70 bg-card/60 px-3 py-2">
                          <p className="text-[11px] uppercase tracking-[0.14em] text-neutral">당일</p>
                          <p className={`fin-num mt-1 text-sm font-semibold ${getChangeClassName(dayChange)}`}>
                            {formatChange(dayChange)}
                          </p>
                        </div>
                        <div className="rounded-lg border border-border/70 bg-card/60 px-3 py-2">
                          <p className="text-[11px] uppercase tracking-[0.14em] text-neutral">당월</p>
                          <p className={`fin-num mt-1 text-sm font-semibold ${getChangeClassName(monthChange)}`}>
                            {formatChange(monthChange)}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-lg border border-border/70 bg-card/40 px-3 py-2">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-neutral">시가총액</p>
                        <p className="fin-num mt-1 text-base font-semibold">{formatCompactKRW(company.metrics.marketCap)}</p>
                      </div>

                      <div className="mt-auto rounded-lg border border-border/70 bg-card/30 px-2 py-2">
                        <PriceSparkline data={company.priceHistory} height={66} />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </Card>

          <Card className="space-y-4">
            <SectionHeader title="마켓 오버뷰" subtitle="정적 지표로 오늘의 시장 온도를 빠르게 확인합니다." />

            <div className="grid gap-3 sm:grid-cols-3">
              {MARKET_OVERVIEW.map((market) => (
                <Card
                  elevated={false}
                  className="space-y-1 border-border/70 bg-background/35 p-4"
                  key={market.label}
                >
                  <p className="text-xs text-neutral">{market.label}</p>
                  <p className="fin-num text-lg font-semibold">{market.value}</p>
                  <p className={`fin-num text-sm font-semibold ${getChangeClassName(market.changePercent)}`}>
                    {formatChange(market.changePercent)}
                  </p>
                </Card>
              ))}
            </div>
          </Card>

          <Card className="space-y-4 border-accent/30 bg-card/95">
            <SectionHeader
              title="Follow & Subscribe"
              subtitle="네프콘 구독과 X 팔로우로 새로운 시그널 업데이트를 놓치지 마세요."
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <a
                className="inline-flex items-center justify-center gap-1 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110"
                href={SITE_SETTINGS.ctaHref}
                rel="noopener noreferrer"
                target="_blank"
              >
                Nepcon 구독
                <ArrowUpRight aria-hidden className="size-4" />
              </a>
              <a
                className="inline-flex items-center justify-center gap-1 rounded-full border border-border/80 bg-background/40 px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/60 hover:bg-card"
                href={X_FOLLOW_URL}
                rel="noopener noreferrer"
                target="_blank"
              >
                X에서 팔로우
                <ArrowUpRight aria-hidden className="size-4" />
              </a>
            </div>
          </Card>
        </PageContainer>
      </main>
      <Footer />
    </div>
  );
}
