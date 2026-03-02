export const COMPANY_SLUGS = [
  // 반도체
  "samsung",
  "hynix",
  "hanmi-semi",
  // 자동차
  "hyundai",
  "kia",
  "hyundai-mobis",
  // 인터넷·게임
  "naver",
  "kakao",
  "krafton",
  // 2차전지
  "lg-energy",
  "samsung-sdi",
  "ecopro-bm",
  // 바이오
  "samsung-bio",
  "celltrion",
  "alteogen",
  // 금융
  "kb-finance",
  "shinhan",
  "samsung-fire",
  // 소재·화학
  "posco",
  "lg-chem",
  // 방산·조선
  "hanwha-aero",
  "hd-ksoe",
  // 통신
  "skt",
  "kt",
  // 유통·소비
  "amorepacific",
] as const;

export type CompanySlug = (typeof COMPANY_SLUGS)[number];

export const SLUG_TO_TICKER: Record<CompanySlug, string> = {
  // 반도체
  "samsung": "005930",
  "hynix": "000660",
  "hanmi-semi": "042700",
  // 자동차
  "hyundai": "005380",
  "kia": "000270",
  "hyundai-mobis": "012330",
  // 인터넷·게임
  "naver": "035420",
  "kakao": "035720",
  "krafton": "259960",
  // 2차전지
  "lg-energy": "373220",
  "samsung-sdi": "006400",
  "ecopro-bm": "247540",
  // 바이오
  "samsung-bio": "207940",
  "celltrion": "068270",
  "alteogen": "196170",
  // 금융
  "kb-finance": "105560",
  "shinhan": "055550",
  "samsung-fire": "000810",
  // 소재·화학
  "posco": "005490",
  "lg-chem": "051910",
  // 방산·조선
  "hanwha-aero": "012450",
  "hd-ksoe": "009540",
  // 통신
  "skt": "017670",
  "kt": "030200",
  // 유통·소비
  "amorepacific": "090430",
};

export const TICKER_TO_SLUG: Record<string, CompanySlug> = {
  // 반도체
  "005930": "samsung",
  "000660": "hynix",
  "042700": "hanmi-semi",
  // 자동차
  "005380": "hyundai",
  "000270": "kia",
  "012330": "hyundai-mobis",
  // 인터넷·게임
  "035420": "naver",
  "035720": "kakao",
  "259960": "krafton",
  // 2차전지
  "373220": "lg-energy",
  "006400": "samsung-sdi",
  "247540": "ecopro-bm",
  // 바이오
  "207940": "samsung-bio",
  "068270": "celltrion",
  "196170": "alteogen",
  // 금융
  "105560": "kb-finance",
  "055550": "shinhan",
  "000810": "samsung-fire",
  // 소재·화학
  "005490": "posco",
  "051910": "lg-chem",
  // 방산·조선
  "012450": "hanwha-aero",
  "009540": "hd-ksoe",
  // 통신
  "017670": "skt",
  "030200": "kt",
  // 유통·소비
  "090430": "amorepacific",
};

export const SITE_SETTINGS = {
  name: "Signal Note",
  description: "국내 대표 25개 종목의 핵심 재무 지표와 컨센서스 요약",
  locale: "ko-KR",
  currency: "KRW",
  ctaLabel: "더 깊은 분석은 시그널노트에서",
  ctaHref: "https://nepcon.kr",
  companyRequestHref: "https://x.com/nadojdya",
} as const;
