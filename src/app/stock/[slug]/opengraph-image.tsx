import { ImageResponse } from "next/og";
import { getCompany } from "@/lib/data";
import { formatCompactKRW, formatNumber, formatPercent } from "@/lib/format";
import { loadOGFont } from "@/lib/og-font";

export const dynamic = "force-dynamic";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

const CACHE_CONTROL_HEADER_VALUE = "public, s-maxage=300, stale-while-revalidate=86400";
const MAX_KO_NAME_LENGTH = 16;
const MAX_EN_NAME_LENGTH = 34;

interface StockOpenGraphImageProps {
  params: Promise<{
    slug: string;
  }>;
}

function normalizeSlug(slug: string): string {
  return slug.trim().toLowerCase();
}

function truncateText(text: string, maxLength: number): string {
  const normalized = text.trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, Math.max(maxLength - 1, 1))}…`;
}

function formatMultiple(value: number | null): string {
  if (value === null) {
    return "—";
  }

  return `${formatNumber(value, { maximumFractionDigits: 2 })}배`;
}

function computePriceChangePercent(company: NonNullable<ReturnType<typeof getCompany>>): number | null {
  const history = company.priceHistory;
  if (!history || history.length < 2) return null;
  const oldest = history[0].close;
  const latest = history[history.length - 1].close;
  if (oldest === 0) return null;
  return ((latest - oldest) / oldest) * 100;
}

export default async function OpenGraphImage({
  params,
}: StockOpenGraphImageProps): Promise<ImageResponse> {
  const { slug } = await params;
  const company = getCompany(normalizeSlug(slug));
  const nameKo = truncateText(company?.nameKo ?? "알 수 없는 기업", MAX_KO_NAME_LENGTH);
  const nameEn = truncateText(company?.nameEn ?? "Unknown Company", MAX_EN_NAME_LENGTH);
  const ticker = company?.tickerCode ?? "----";

  const priceChange = company ? computePriceChangePercent(company) : null;

  const metrics = [
    {
      label: "시가총액",
      value: company ? formatCompactKRW(company.metrics.marketCap) : "—",
    },
    {
      label: "PER",
      value: company ? formatMultiple(company.metrics.per) : "—",
    },
    {
      label: "변동률",
      value: formatPercent(priceChange, 1),
    },
  ].slice(0, 3);

  const ogFontData = await loadOGFont(
    [
      nameKo,
      nameEn,
      ticker,
      "Company One-Pager",
      "시그널노트 ⚡",
      ...metrics.map((metric) => `${metric.label} ${metric.value}`),
    ].join(" "),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "radial-gradient(1000px 460px at 100% -10%, rgba(14, 165, 233, 0.22), transparent), linear-gradient(150deg, #030712 0%, #0f172a 58%, #111827 100%)",
          padding: "44px",
          fontFamily: "PretendardSubset",
          color: "#f8fafc",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            borderRadius: "34px",
            border: "1px solid rgba(148, 163, 184, 0.28)",
            padding: "40px",
            background:
              "linear-gradient(165deg, rgba(17, 24, 39, 0.9) 0%, rgba(15, 23, 42, 0.64) 100%)",
            boxShadow: "0 28px 72px rgba(2, 6, 23, 0.62)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "24px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(148, 163, 184, 0.9)",
              }}
            >
              Company One-Pager
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "24px",
                color: "rgba(226, 232, 240, 0.95)",
              }}
            >
              {ticker}
            </p>
          </div>

          <h1
            style={{
              margin: "28px 0 0",
              maxWidth: "900px",
              fontSize: "74px",
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
            }}
          >
            {nameKo}
          </h1>

          <p
            style={{
              margin: "14px 0 0",
              fontSize: "34px",
              color: "rgba(203, 213, 225, 0.94)",
            }}
          >
            {nameEn}
          </p>

          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "44px",
            }}
          >
            {metrics.map((metric) => (
              <div
                key={metric.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  flex: 1,
                  borderRadius: "16px",
                  border: "1px solid rgba(148, 163, 184, 0.3)",
                  background: "rgba(15, 23, 42, 0.66)",
                  padding: "16px 18px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "20px",
                    color: "rgba(148, 163, 184, 0.96)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {metric.label}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "42px",
                    lineHeight: 1.08,
                    color: "#f8fafc",
                  }}
                >
                  {metric.value}
                </p>
              </div>
            ))}
          </div>

          <p
            style={{
              margin: "auto 0 0",
              alignSelf: "flex-end",
              fontSize: "28px",
              color: "rgba(226, 232, 240, 0.88)",
              letterSpacing: "0.02em",
            }}
          >
            시그널노트 ⚡
          </p>
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        "Cache-Control": CACHE_CONTROL_HEADER_VALUE,
      },
      fonts: [
        {
          name: "PretendardSubset",
          data: ogFontData,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );
}
