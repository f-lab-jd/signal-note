const FALLBACK_SITE_URL = "http://localhost:3000";

function withProtocol(url: string): string {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return `https://${url}`;
}

export function getSiteUrl(rawUrl: string | undefined = process.env.NEXT_PUBLIC_SITE_URL): string {
  const normalizedUrl = rawUrl?.trim();

  if (!normalizedUrl) {
    return FALLBACK_SITE_URL;
  }

  const candidateUrl = withProtocol(normalizedUrl);

  try {
    return new URL(candidateUrl).origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}
