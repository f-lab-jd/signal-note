export const COMPANY_SLUGS = [
  "samsung",
  "hynix",
  "naver",
  "kakao",
  "hyundai",
] as const;

export type CompanySlug = (typeof COMPANY_SLUGS)[number];

export const SLUG_TO_TICKER: Record<CompanySlug, string> = {
  samsung: "005930",
  hynix: "000660",
  naver: "035420",
  kakao: "035720",
  hyundai: "005380",
};

export const TICKER_TO_SLUG: Record<string, CompanySlug> = {
  "005930": "samsung",
  "000660": "hynix",
  "035420": "naver",
  "035720": "kakao",
  "005380": "hyundai",
};

export const SITE_SETTINGS = {
  name: "Signal Note",
  description: "국내 대표 5개 기업의 핵심 재무 지표와 컨센서스 요약",
  locale: "ko-KR",
  currency: "KRW",
  ctaLabel: "더 깊은 분석은 시그널노트에서",
  ctaHref: "https://nepcon.kr",
} as const;
