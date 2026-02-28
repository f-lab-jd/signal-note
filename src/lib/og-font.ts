const LOCAL_OG_FONT_URL = new URL("../fonts/Pretendard-Bold.subset.woff", import.meta.url);
const GOOGLE_FONTS_CSS_URL = "https://fonts.googleapis.com/css2";
const GOOGLE_FONTS_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
const DEFAULT_FALLBACK_TEXT =
  "\uAC00\uB098\uB2E4\uB77C\uB9C8\uBC14\uC0AC\uC544\uC790\uCC28\uCE74\uD0C0\uD30C\uD558ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\u20A9\u0024\u20AC\u00A5\u00A3\u0025\u002B\u002D\u002E\u002C\u003A\u002F";

function normalizeFallbackText(text: string | undefined): string {
  const normalized = text?.trim().slice(0, 240);
  return normalized && normalized.length > 0 ? normalized : DEFAULT_FALLBACK_TEXT;
}

async function loadLocalSubsetFont(): Promise<ArrayBuffer> {
  const response = await fetch(LOCAL_OG_FONT_URL);

  if (!response.ok) {
    throw new Error(`Failed to load local OG subset font: ${response.status}`);
  }

  return response.arrayBuffer();
}

function extractFontUrlFromCss(cssText: string): string {
  const woff2Match = cssText.match(/src:\s*url\(([^)]+)\)\s*format\('(woff2|woff)'\)/i);

  if (!woff2Match?.[1]) {
    throw new Error("Could not find font URL in Google Fonts CSS response");
  }

  return woff2Match[1].replaceAll('"', "").replaceAll("'", "");
}

async function loadNotoSansKRFallback(text: string): Promise<ArrayBuffer> {
  const cssUrl = new URL(GOOGLE_FONTS_CSS_URL);
  cssUrl.searchParams.set("family", "Noto Sans KR:wght@700");
  cssUrl.searchParams.set("display", "swap");
  cssUrl.searchParams.set("text", normalizeFallbackText(text));

  const cssResponse = await fetch(cssUrl, {
    headers: {
      "User-Agent": GOOGLE_FONTS_USER_AGENT,
    },
  });

  if (!cssResponse.ok) {
    throw new Error(`Failed to load fallback font CSS: ${cssResponse.status}`);
  }

  const cssText = await cssResponse.text();
  const fontUrl = extractFontUrlFromCss(cssText);
  const fontResponse = await fetch(fontUrl);

  if (!fontResponse.ok) {
    throw new Error(`Failed to load fallback font file: ${fontResponse.status}`);
  }

  return fontResponse.arrayBuffer();
}

let cachedLocalOGFontPromise: Promise<ArrayBuffer> | null = null;

export async function loadOGFont(text?: string): Promise<ArrayBuffer> {
  try {
    cachedLocalOGFontPromise ??= loadLocalSubsetFont();
    return await cachedLocalOGFontPromise;
  } catch (localFontError) {
    cachedLocalOGFontPromise = null;

    try {
      return await loadNotoSansKRFallback(text ?? DEFAULT_FALLBACK_TEXT);
    } catch (fallbackError) {
      const localMessage =
        localFontError instanceof Error ? localFontError.message : String(localFontError);
      const fallbackMessage =
        fallbackError instanceof Error ? fallbackError.message : String(fallbackError);

      throw new Error(
        `OG font loading failed. local="${localMessage}" fallback="${fallbackMessage}"`,
      );
    }
  }
}
