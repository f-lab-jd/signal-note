import { CTABanner } from "@/components/layout/CTABanner";
import { Header } from "@/components/layout/Header";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { ChangeBadge } from "@/components/ui/ChangeBadge";
import { Footer } from "@/components/ui/Footer";
import { MetricBadge } from "@/components/ui/MetricBadge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getCompany } from "@/lib/data";
import { formatCompactKRW, formatNumber } from "@/lib/format";

export default function Home() {
  const company = getCompany("samsung");
  const latestClose = company?.priceHistory.at(-1)?.close ?? null;
  const previousClose = company?.priceHistory.at(-2)?.close ?? null;
  const monthChangePercent =
    latestClose && previousClose
      ? ((latestClose - previousClose) / previousClose) * 100
      : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="py-8 sm:py-12">
        <PageContainer className="space-y-6">
          <SectionHeader
            title="오늘의 핵심 시그널"
            subtitle="카드, 배지, CTA 컴포넌트의 기본 레이아웃 검증 화면"
          />

          <Card className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-neutral">Preview</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {company?.nameKo}
                </h1>
                <p className="mt-1 text-sm text-neutral">
                  {company?.nameEn} · {company?.tickerCode}
                </p>
              </div>
              <ChangeBadge value={monthChangePercent} />
            </div>

            <div className="flex flex-wrap gap-2">
              <MetricBadge
                label="시가총액"
                value={formatCompactKRW(company?.metrics.marketCap)}
              />
              <MetricBadge
                label="PER"
                value={
                  company?.metrics.per === null
                    ? "—"
                    : `${formatNumber(company?.metrics.per, { maximumFractionDigits: 1 })}배`
                }
              />
            </div>
          </Card>

          <CTABanner />
        </PageContainer>
      </main>
      <Footer />
    </div>
  );
}
