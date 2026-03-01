"use client";

import { useEffect, useMemo, useState, type HTMLAttributes } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { AnnualFinancial } from "@/data/schema";
import { formatCompactKRW, formatNumber } from "@/lib/format";

interface RevenueChartProps extends HTMLAttributes<HTMLDivElement> {
  data: AnnualFinancial[] | null | undefined;
  height?: number;
}

const MOBILE_WIDTH = 768;

function formatAxisValue(value: number): string {
  const absoluteValue = Math.abs(value);

  if (absoluteValue >= 10000) {
    const trillionValue = value / 10000;
    return `${formatNumber(trillionValue, {
      maximumFractionDigits: Math.abs(trillionValue) >= 100 ? 0 : 1,
    })}조`;
  }

  return `${formatNumber(value)}억`;
}

export function RevenueChart({
  className,
  data,
  height = 250,
  ...props
}: RevenueChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [tooltipDisabled, setTooltipDisabled] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_WIDTH - 1}px)`);

    const handleMediaQueryChange = () => {
      setTooltipDisabled(mediaQuery.matches);
    };

    handleMediaQueryChange();

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  const chartData = useMemo(
    () =>
      (data ?? []).map((item) => ({
        yearLabel: `${item.year}`,
        revenue: item.revenue,
        operatingProfit: item.operatingProfit,
      })),
    [data],
  );

  const classes = ["w-full min-w-0", className].filter(Boolean).join(" ");

  if (chartData.length === 0) {
    return (
      <div className={classes} {...props}>
        <div
          className="flex items-center justify-center rounded-xl border border-dashed border-border/80 bg-background/35 px-3 text-center text-sm text-neutral"
          style={{ height }}
        >
          연간 실적 데이터가 없습니다.
        </div>
      </div>
    );
  }

  if (!isMounted) {
    return (
      <div className={classes} {...props}>
        <div
          className="rounded-xl border border-border/70 bg-background/25"
          style={{ height }}
          aria-hidden
        />
      </div>
    );
  }

  return (
    <div className={classes} {...props}>
      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-neutral">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[var(--color-revenue)]" aria-hidden />
          매출
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[var(--color-profit)]" aria-hidden />
          영업이익
        </span>
      </div>

      <div className="w-full min-w-0" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            barCategoryGap="18%"
            margin={{ top: 8, right: 6, bottom: 0, left: 4 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="color-mix(in oklab, var(--color-border) 85%, transparent)"
            />
            <XAxis
              dataKey="yearLabel"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-neutral)", fontSize: 12, fontFamily: "var(--font-inter)" }}
            />
            <YAxis
              width={58}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatAxisValue}
              tick={{ fill: "var(--color-neutral)", fontSize: 11, fontFamily: "var(--font-inter)" }}
            />

            {tooltipDisabled ? null : (
              <Tooltip
                cursor={{ fill: "color-mix(in oklab, var(--color-border) 24%, transparent)" }}
                contentStyle={{
                  backgroundColor: "color-mix(in oklab, var(--color-card) 96%, black 4%)",
                  borderColor: "color-mix(in oklab, var(--color-border) 90%, transparent)",
                  borderRadius: "0.75rem",
                  color: "var(--color-foreground)",
                  fontFamily: "var(--font-pretendard)",
                }}
                formatter={(value, name) => [
                  formatCompactKRW(Number(value)),
                  name === "revenue" ? "매출" : "영업이익",
                ]}
                labelFormatter={(label) => `${label}년`}
              />
            )}

            <Bar
              dataKey="revenue"
              name="revenue"
              fill="var(--color-revenue)"
              radius={[7, 7, 0, 0]}
              maxBarSize={36}
            />
            <Bar
              dataKey="operatingProfit"
              name="operatingProfit"
              fill="var(--color-profit)"
              radius={[7, 7, 0, 0]}
              maxBarSize={36}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
