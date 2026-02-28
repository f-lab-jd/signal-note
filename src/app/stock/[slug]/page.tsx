import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PriceSparkline } from "@/components/charts/PriceSparkline";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { CTABanner } from "@/components/layout/CTABanner";
import { Header } from "@/components/layout/Header";
import { PageContainer } from "@/components/layout/PageContainer";
import { ShareButtons } from "@/components/share/ShareButtons";
import { Card } from "@/components/ui/Card";
import { ChangeBadge } from "@/components/ui/ChangeBadge";
import { Footer } from "@/components/ui/Footer";
import { MetricBadge } from "@/components/ui/MetricBadge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SITE_SETTINGS } from "@/lib/constants";
import { getAllSlugs, getCompany } from "@/lib/data";
import { formatCompactKRW, formatNumber, formatPercent } from "@/lib/format";

interface StockPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const STOCK_OG_IMAGE = {
  width: 1200,
  height: 630,
} as const;
const OPEN_GRAPH_LOCALE = "ko_KR";

function normalizeSlug(slug: string): string {
  return slug.trim().toLowerCase();
}

function formatMultiple(value: number | null): string {
  if (value === null) {
    return "—";
  }

  return `${formatNumber(value, { maximumFractionDigits: 2 })}배`;
}

function formatWeekRange(low: number, high: number): string {
  return `${formatNumber(low)}원 - ${formatNumber(high)}원`;
}

function buildMetadata(slug: string): Metadata {
  const company = getCompany(slug);

  if (!company) {
    const title = "기업 정보를 찾을 수 없습니다";
    const description = "요청하신 종목 페이지를 찾을 수 없습니다.";

    return {
      title,
      description,
      alternates: {
        canonical: "/",
      },
      openGraph: {
        title: `${title} | 시그널노트`,
        description,
        type: "website",
        locale: OPEN_GRAPH_LOCALE,
        url: "/",
        siteName: SITE_SETTINGS.name,
        images: [
          {
            url: "/opengraph-image",
            width: STOCK_OG_IMAGE.width,
            height: STOCK_OG_IMAGE.height,
            alt: "시그널노트 대시보드 OG 이미지",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | 시그널노트`,
        description,
        images: ["/opengraph-image"],
      },
    };
  }

  const title = `${company.nameKo} 분석`;
  const socialTitle = `${title} | 시그널노트`;
  const description = `${company.nameKo}(${company.tickerCode}) 핵심 숫자: 시가총액 ${formatCompactKRW(company.metrics.marketCap)}, PER ${formatMultiple(company.metrics.per)}, 배당수익률 ${formatPercent(company.metrics.dividendYield, 2)}. 실적 추이와 컨센서스를 확인하세요.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/stock/${company.slug}`,
    },
    openGraph: {
      title: socialTitle,
      description,
      type: "article",
      locale: OPEN_GRAPH_LOCALE,
      url: `/stock/${company.slug}`,
      siteName: SITE_SETTINGS.name,
      images: [
        {
          url: `/stock/${company.slug}/opengraph-image`,
          width: STOCK_OG_IMAGE.width,
          height: STOCK_OG_IMAGE.height,
          alt: `${company.nameKo} 종목 OG 이미지`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [`/stock/${company.slug}/opengraph-image`],
    },
  };
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: StockPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildMetadata(normalizeSlug(slug));
}

export default async function StockPage({ params }: StockPageProps) {
  const { slug } = await params;
  const normalizedSlug = normalizeSlug(slug);

  if (slug !== normalizedSlug) {
    redirect(`/stock/${normalizedSlug}`);
  }

  const company = getCompany(normalizedSlug);

  if (!company) {
    notFound();
  }

  const latestClose = company.priceHistory.at(-1)?.close ?? null;
  const previousClose = company.priceHistory.at(-2)?.close ?? null;
  const monthChangePercent =
    latestClose !== null && previousClose !== null && previousClose !== 0
      ? ((latestClose - previousClose) / previousClose) * 100
      : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="py-8 sm:py-12">
        <PageContainer className="space-y-6">
          <Card className="space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-neutral">Company One-Pager</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{company.nameKo}</h1>
                <p className="mt-1 text-sm text-neutral">
                  {company.nameEn} · {company.tickerCode}
                </p>
              </div>
              <ChangeBadge value={monthChangePercent} />
            </div>

            <div className="flex flex-wrap gap-2">
              <MetricBadge label="티커" value={company.tickerCode} />
              <MetricBadge label="시장" value={company.market} />
              <MetricBadge label="섹터" value={company.sector} />
            </div>

            <p className="text-xs text-neutral">Last updated: {company.lastUpdated}</p>
          </Card>

          <Card className="space-y-4">
            <SectionHeader title="핵심 지표" subtitle="시가총액, 밸류에이션, 배당, 52주 범위를 빠르게 점검합니다." />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <Card elevated={false} className="space-y-1 border-border/70 bg-background/40 p-4">
                <p className="text-xs text-neutral">시가총액</p>
                <p className="fin-num text-lg font-semibold">{formatCompactKRW(company.metrics.marketCap)}</p>
              </Card>
              <Card elevated={false} className="space-y-1 border-border/70 bg-background/40 p-4">
                <p className="text-xs text-neutral">PER</p>
                <p className="fin-num text-lg font-semibold">{formatMultiple(company.metrics.per)}</p>
              </Card>
              <Card elevated={false} className="space-y-1 border-border/70 bg-background/40 p-4">
                <p className="text-xs text-neutral">PBR</p>
                <p className="fin-num text-lg font-semibold">{formatMultiple(company.metrics.pbr)}</p>
              </Card>
              <Card elevated={false} className="space-y-1 border-border/70 bg-background/40 p-4">
                <p className="text-xs text-neutral">배당수익률</p>
                <p className="fin-num text-lg font-semibold">{formatPercent(company.metrics.dividendYield, 2)}</p>
              </Card>
              <Card elevated={false} className="space-y-1 border-border/70 bg-background/40 p-4">
                <p className="text-xs text-neutral">52주 범위</p>
                <p className="fin-num text-base font-semibold">
                  {formatWeekRange(company.metrics.weekRange52.low, company.metrics.weekRange52.high)}
                </p>
              </Card>
            </div>
          </Card>

          <Card className="space-y-4">
            <SectionHeader title="실적/주가 차트" subtitle="Task 7 차트 컴포넌트를 그대로 사용합니다." />
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
              <div className="min-w-0 space-y-2">
                <p className="text-xs uppercase tracking-[0.16em] text-neutral">Annual Financials</p>
                <RevenueChart data={company.financials.annual} />
              </div>

              <div className="min-w-0 space-y-2">
                <p className="text-xs uppercase tracking-[0.16em] text-neutral">Price Sparkline</p>
                <PriceSparkline data={company.priceHistory} />
              </div>
            </div>
          </Card>

          <Card className="space-y-4">
            <SectionHeader title="애널리스트 컨센서스" subtitle="목표가와 투자의견 흐름을 간단히 확인하세요." />
            <div className="grid gap-3 sm:grid-cols-3">
              <Card elevated={false} className="space-y-1 border-border/70 bg-background/40 p-4">
                <p className="text-xs text-neutral">목표주가</p>
                <p className="fin-num text-lg font-semibold">
                  {company.consensus.targetPrice === null
                    ? "—"
                    : `${formatNumber(company.consensus.targetPrice)}원`}
                </p>
              </Card>
              <Card elevated={false} className="space-y-1 border-border/70 bg-background/40 p-4">
                <p className="text-xs text-neutral">투자의견</p>
                <p className="text-lg font-semibold">{company.consensus.rating}</p>
              </Card>
              <Card elevated={false} className="space-y-1 border-border/70 bg-background/40 p-4">
                <p className="text-xs text-neutral">커버리지 증권사</p>
                <p className="fin-num text-lg font-semibold">{formatNumber(company.consensus.analystCount)}곳</p>
              </Card>
            </div>
          </Card>

          <ShareButtons shareText={`${company.nameKo} 분석 | 시그널노트`} />

          <CTABanner />
        </PageContainer>
      </main>
      <Footer />
    </div>
  );
}
