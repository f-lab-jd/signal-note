const KOREAN_LOCALE = "ko-KR";

function isNumber(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function formatNumber(
  value: number | null | undefined,
  options: Intl.NumberFormatOptions = {},
): string {
  if (!isNumber(value)) {
    return "—";
  }

  return new Intl.NumberFormat(KOREAN_LOCALE, options).format(value);
}

export function formatPercent(
  value: number | null | undefined,
  fractionDigits = 2,
): string {
  if (!isNumber(value)) {
    return "—";
  }

  if (Object.is(value, -0) || value === 0) {
    return "0%";
  }

  const formatted = new Intl.NumberFormat(KOREAN_LOCALE, {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  }).format(value);

  return value > 0 ? `+${formatted}%` : `${formatted}%`;
}

export function formatKRW(value: number | null | undefined): string {
  if (!isNumber(value)) {
    return "—";
  }

  const sign = value < 0 ? "-" : "";
  const absoluteValue = Math.abs(Math.round(value));

  if (absoluteValue >= 10000) {
    const trillionUnit = Math.floor(absoluteValue / 10000);
    const eokUnit = absoluteValue % 10000;

    if (eokUnit === 0) {
      return `${sign}${formatNumber(trillionUnit)}조원`;
    }

    return `${sign}${formatNumber(trillionUnit)}조 ${formatNumber(eokUnit)}억원`;
  }

  return `${sign}${formatNumber(absoluteValue)}억원`;
}

export function formatCompactKRW(value: number | null | undefined): string {
  if (!isNumber(value)) {
    return "—";
  }

  if (Object.is(value, -0) || value === 0) {
    return "0억원";
  }

  const sign = value < 0 ? "-" : "";
  const absoluteValue = Math.abs(value);

  if (absoluteValue >= 10000) {
    const trillionUnit = absoluteValue / 10000;
    const formatted = new Intl.NumberFormat(KOREAN_LOCALE, {
      minimumFractionDigits: 0,
      maximumFractionDigits: trillionUnit >= 100 ? 0 : 1,
    }).format(trillionUnit);

    return `${sign}${formatted}조원`;
  }

  return `${sign}${formatNumber(Math.round(absoluteValue))}억원`;
}
