"use client";

import { useEffect, useMemo, useState, type HTMLAttributes } from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts";

import type { PricePoint } from "@/data/schema";
import { formatNumber } from "@/lib/format";

interface PriceSparklineProps extends HTMLAttributes<HTMLDivElement> {
  data: PricePoint[] | null | undefined;
  height?: number;
  maxPoints?: number;
}

export function PriceSparkline({
  className,
  data,
  height = 72,
  maxPoints = 30,
  ...props
}: PriceSparklineProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const chartData = useMemo(() => {
    const source = data ?? [];
    const startIndex = Math.max(source.length - maxPoints, 0);

    return source.slice(startIndex).map((point) => ({
      close: point.close,
      date: point.date,
    }));
  }, [data, maxPoints]);

  const classes = ["w-full min-w-0", className].filter(Boolean).join(" ");

  if (chartData.length === 0) {
    return (
      <div className={classes} {...props}>
        <div className="flex h-18 items-center justify-center rounded-lg border border-dashed border-border/80 bg-background/25 px-3 text-center text-xs text-neutral">
          주가 데이터가 없습니다.
        </div>
      </div>
    );
  }

  if (!isMounted) {
    return (
      <div className={classes} {...props}>
        <div className="rounded-lg border border-border/70 bg-background/25" style={{ height }} aria-hidden />
      </div>
    );
  }

  const firstClose = chartData[0]?.close ?? 0;
  const lastClose = chartData.at(-1)?.close ?? 0;
  const isNeutral = firstClose === lastClose;
  const isUp = lastClose > firstClose;
  const trendLabelClass = isNeutral ? "text-neutral" : isUp ? "text-up" : "text-down";
  const lineColor = isNeutral
    ? "var(--color-neutral)"
    : isUp
      ? "var(--color-up)"
      : "var(--color-down)";

  return (
    <div className={classes} {...props}>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <p className="text-xs text-neutral">최근 추이</p>
        <p className={`fin-num text-xs font-semibold ${trendLabelClass}`}>
          {formatNumber(lastClose)}원
        </p>
      </div>

      <div className="w-full min-w-0" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 2, bottom: 4, left: 2 }}>
            <Line
              type="monotone"
              dataKey="close"
              stroke={lineColor}
              strokeWidth={2.2}
              dot={false}
              activeDot={false}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
