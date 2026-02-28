import { ImageResponse } from "next/og";
import { loadOGFont } from "@/lib/og-font";

export const runtime = "edge";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

const CACHE_CONTROL_HEADER_VALUE = "public, s-maxage=300, stale-while-revalidate=86400";
const DASHBOARD_TITLE = "시그널노트 ⚡ — 투자 데이터, 한눈에 보다";

export default async function OpenGraphImage(): Promise<ImageResponse> {
  const ogFontData = await loadOGFont(`${DASHBOARD_TITLE} Dashboard Home 기업 카드 그리드 마켓 오버뷰`);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "radial-gradient(1200px 500px at 85% -20%, rgba(22, 163, 74, 0.24), transparent), linear-gradient(145deg, #060b15 0%, #0f172a 60%, #111827 100%)",
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
            border: "1px solid rgba(148, 163, 184, 0.26)",
            borderRadius: "34px",
            padding: "40px",
            background:
              "linear-gradient(168deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.62) 100%)",
            boxShadow: "0 20px 64px rgba(2, 6, 23, 0.56)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "26px",
                color: "rgba(226, 232, 240, 0.84)",
              }}
            >
              <span>Dashboard Home</span>
            </div>
            <div
              style={{
                display: "flex",
                padding: "10px 16px",
                borderRadius: "9999px",
                border: "1px solid rgba(148, 163, 184, 0.38)",
                fontSize: "24px",
                color: "#e2e8f0",
                background: "rgba(15, 23, 42, 0.5)",
              }}
            >
              Wave 2
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "58px",
              gap: "14px",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "30px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(148, 163, 184, 0.9)",
              }}
            >
              Signal Note
            </p>
            <h1
              style={{
                margin: 0,
                maxWidth: "980px",
                fontSize: "72px",
                lineHeight: 1.14,
                letterSpacing: "-0.02em",
              }}
            >
              {DASHBOARD_TITLE}
            </h1>
          </div>

          <div
            style={{
              display: "flex",
              gap: "14px",
              marginTop: "auto",
            }}
          >
            {[
              "대표 5개 기업",
              "핵심 지표 + 차트",
              "실시간 요약형 대시보드",
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderRadius: "14px",
                  border: "1px solid rgba(148, 163, 184, 0.34)",
                  fontSize: "24px",
                  color: "rgba(241, 245, 249, 0.95)",
                  background: "rgba(15, 23, 42, 0.65)",
                }}
              >
                {item}
              </div>
            ))}
          </div>
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
