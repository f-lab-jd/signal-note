import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import "./theme-overrides.css";
import { getSiteUrl } from "@/lib/site-url";
import { TelegramPopup } from "@/components/ui/TelegramPopup";

const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "100 900",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const BRAND_NAME = "시그널노트";
const DEFAULT_TITLE = `${BRAND_NAME} | 국내 대표 25개 종목 데이터 대시보드`;
const DEFAULT_DESCRIPTION = "국내 대표 25개 종목의 핵심 지표, 주가 추이, 컨센서스를 한 화면에서 확인하는 투자 데이터 대시보드";
const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY ?? "";
const THEME_STORAGE_KEY = "signalnote-theme";
const THEME_INIT_SCRIPT = `
  (() => {
    try {
      const root = document.documentElement;
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const systemTheme = mediaQuery.matches ? "dark" : "light";
      const storedTheme = window.localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
      const resolvedTheme = storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : "dark";

      root.dataset.systemTheme = systemTheme;
      root.setAttribute("data-theme", resolvedTheme);
    } catch (error) {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  })();
`;
const KAKAO_INIT_SCRIPT = `
  (() => {
    const kakaoJsKey = ${JSON.stringify(KAKAO_JS_KEY)};
    if (!kakaoJsKey) {
      return;
    }

    const tryInitialize = (attempt = 0) => {
      if (!window.Kakao) {
        if (attempt >= 20) {
          return;
        }

        window.setTimeout(() => {
          tryInitialize(attempt + 1);
        }, 150);
        return;
      }

      try {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(kakaoJsKey);
        }
      } catch (error) {
        console.warn("[layout] Kakao SDK initialization failed.", error);
      }
    };

    tryInitialize();
  })();
`;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${BRAND_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: BRAND_NAME,
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "시그널노트 대시보드 OG 이미지",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@nadojdya",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" data-theme="dark" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
      </head>
      <body
        className={`${pretendard.variable} ${inter.variable} font-sans antialiased`}
      >
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
          strategy="afterInteractive"
        />
        <Script id="kakao-init" strategy="lazyOnload">
          {KAKAO_INIT_SCRIPT}
        </Script>
        {children}
        <TelegramPopup />
      </body>
    </html>
  );
}
