"use client";

import { useEffect, useId, useMemo, useState, type HTMLAttributes } from "react";
import { Area, AreaChart, Line, ResponsiveContainer } from "recharts";

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
  height = 92,
  maxPoints = 30,
  ...props
}: PriceSparklineProps) {
  const [isMounted, setIsMounted] = useState(false);
  const gradientId = useId().replace(/:/g, "");

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
        <div
          className="flex items-center justify-center rounded-lg border border-dashed border-border/80 bg-background/25 px-3 text-center text-xs text-neutral"
          style={{ height }}
        >
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
  const gradientTopColor = isNeutral
    ? "rgba(100,116,139,0.24)"
    : isUp
      ? "rgba(255,71,71,0.32)"
      : "rgba(74,144,217,0.3)";
  const gradientBottomColor = isNeutral
    ? "rgba(100,116,139,0.01)"
    : isUp
      ? "rgba(255,71,71,0.02)"
      : "rgba(74,144,217,0.02)";

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
          <AreaChart data={chartData} margin={{ top: 5, right: 2, bottom: 4, left: 2 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={gradientTopColor} />
                <stop offset="100%" stopColor={gradientBottomColor} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="close"
              stroke="none"
              fill={`url(#${gradientId})`}
              fillOpacity={1}
              isAnimationActive={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="close"
              stroke={lineColor}
              strokeWidth={2.6}
              dot={false}
              activeDot={false}
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
