import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

import { loadOGFont } from "@/lib/og-font";

export const dynamic = "force-dynamic";

const SIGN_COLORS = {
  up: "#00d084",
  down: "#ff4d4d",
  neutral: "#94a3b8",
} as const;

function getSignColor(sign: string): string {
  return SIGN_COLORS[sign as keyof typeof SIGN_COLORS] ?? SIGN_COLORS.neutral;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get("title") ?? "오늘의 시장 시그널";
  const v1 = searchParams.get("v1") ?? "KOSPI";
  const n1 = searchParams.get("n1") ?? "—";
  const sign = searchParams.get("sign") ?? "neutral";
  const badge = searchParams.get("badge") ?? "오늘의 숫자";

  const numColor = getSignColor(sign);

  try {
    const allText = [title, v1, n1, badge, "시그널노트", "@nadojdya"].join("");
    const font = await loadOGFont(allText);

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "1200px",
            height: "630px",
            background: "#0b1628",
            padding: "60px",
            flexDirection: "column",
            justifyContent: "space-between",
            fontFamily: "Pretendard",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Glow: top-right green */}
          <div
            style={{
              display: "flex",
              position: "absolute",
              top: "-100px",
              right: "-80px",
              width: "460px",
              height: "460px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(0,208,132,0.10) 0%, transparent 68%)",
            }}
          />
          {/* Glow: bottom-left blue */}
          <div
            style={{
              display: "flex",
              position: "absolute",
              bottom: "-140px",
              left: "-80px",
              width: "520px",
              height: "520px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 68%)",
            }}
          />

          {/* Top badge */}
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "rgba(59,130,246,0.12)",
                border: "1px solid rgba(59,130,246,0.38)",
                color: "#60a5fa",
                padding: "10px 22px",
                borderRadius: "6px",
                fontSize: "22px",
                fontWeight: 700,
              }}
            >
              ⚡ 시그널노트 — {badge}
            </div>
          </div>

          {/* Main content */}
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Accent bar */}
            <div
              style={{
                display: "flex",
                width: "72px",
                height: "5px",
                background: "linear-gradient(90deg, #00d084, #3b82f6)",
                borderRadius: "3px",
              }}
            />
            {/* Title */}
            <div
              style={{
                display: "flex",
                fontSize: "96px",
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </div>
            {/* Secondary */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                fontSize: "36px",
                fontWeight: 700,
              }}
            >
              <span style={{ display: "flex", color: "#64748b" }}>{v1}</span>
              <span style={{ display: "flex", color: "#1e3a5f" }}>·</span>
              <span style={{ display: "flex", color: numColor }}>{n1}</span>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              paddingTop: "20px",
              color: "#475569",
              fontSize: "22px",
              fontWeight: 700,
            }}
          >
            <span style={{ display: "flex" }}>시그널노트</span>
            <span style={{ display: "flex" }}>@nadojdya</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Pretendard",
            data: font,
            weight: 700,
            style: "normal",
          },
        ],
      },
    );
  } catch (error) {
    console.error("[og] Failed to generate OG image:", error);
    return new Response("OG image generation failed", { status: 500 });
  }
}
