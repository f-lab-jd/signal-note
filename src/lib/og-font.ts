import { readFile } from "node:fs/promises";
import { join } from "node:path";

const GOOGLE_FONTS_CSS_URL = "https://fonts.googleapis.com/css2";
const GOOGLE_FONTS_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
const DEFAULT_FALLBACK_TEXT =
  "가나다라마바사아자차카타파하ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789₩$€¥£%+-.,:/"

function normalizeFallbackText(text: string | undefined): string {
  const normalized = text?.trim().slice(0, 240);
  return normalized && normalized.length > 0 ? normalized : DEFAULT_FALLBACK_TEXT;
}

async function loadLocalSubsetFont(): Promise<ArrayBuffer> {
  const fontPath = join(process.cwd(), "src", "fonts", "Pretendard-Bold.subset.woff");
  const buffer = await readFile(fontPath);
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
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
