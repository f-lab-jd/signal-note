import { formatCompactKRW, formatKRW, formatNumber, formatPercent } from "@/lib/format";

describe("format utilities", () => {
  it("formatKRW(2587410) includes 조 scale", () => {
    expect(formatKRW(2587410)).toContain("조");
  });

  it("formatKRW(1234) includes 억", () => {
    expect(formatKRW(1234)).toContain("억");
  });

  it("formatKRW(0) handles zero", () => {
    expect(formatKRW(0)).toBe("0억원");
  });

  it("formatPercent(5.23, 2) contains 5.23", () => {
    expect(formatPercent(5.23, 2)).toContain("5.23");
  });

  it("formatPercent(-3.1, 1) contains -3.1", () => {
    expect(formatPercent(-3.1, 1)).toContain("-3.1");
  });

  it("formatPercent(0, 2) returns zero percent", () => {
    expect(formatPercent(0, 2)).toBe("0%");
  });

  it("formatPercent(null) returns fallback without crashing", () => {
    expect(formatPercent(null)).toBe("—");
  });

  it("formatPercent(undefined) returns fallback without crashing", () => {
    expect(formatPercent(undefined)).toBe("—");
  });

  it("formatCompactKRW formats large values compactly", () => {
    expect(formatCompactKRW(1250000)).toContain("조원");
  });

  it("formatNumber applies fraction digits options", () => {
    expect(formatNumber(1234.567, { minimumFractionDigits: 1, maximumFractionDigits: 1 })).toContain("1,234.6");
  });

  it("formatNumber(null) returns fallback", () => {
    expect(formatNumber(null)).toBe("—");
  });
});
