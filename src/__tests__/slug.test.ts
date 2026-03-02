import { COMPANY_SLUGS, SLUG_TO_TICKER, TICKER_TO_SLUG } from "@/lib/constants";
import { getCompany } from "@/lib/data";

const EXPECTED_COUNT = 25;

describe("slug and ticker mappings", () => {
  it('SLUG_TO_TICKER["samsung"] is 005930', () => {
    expect(SLUG_TO_TICKER["samsung"]).toBe("005930");
  });

  it('TICKER_TO_SLUG["005930"] is samsung', () => {
    expect(TICKER_TO_SLUG["005930"]).toBe("samsung");
  });

  it(`all ${EXPECTED_COUNT} slugs have corresponding ticker mappings`, () => {
    expect(COMPANY_SLUGS).toHaveLength(EXPECTED_COUNT);

    for (const slug of COMPANY_SLUGS) {
      expect(SLUG_TO_TICKER[slug]).toBeDefined();
      expect(SLUG_TO_TICKER[slug]).toMatch(/^\d{6}$/);
    }
  });

  it(`all ${EXPECTED_COUNT} tickers have corresponding slug mappings`, () => {
    const tickers = Object.values(SLUG_TO_TICKER);
    expect(tickers).toHaveLength(EXPECTED_COUNT);

    for (const ticker of tickers) {
      expect(TICKER_TO_SLUG[ticker]).toBeDefined();
      expect(COMPANY_SLUGS).toContain(TICKER_TO_SLUG[ticker]);
    }
  });

  it("slug-ticker maps are consistent round-trip", () => {
    for (const slug of COMPANY_SLUGS) {
      const ticker = SLUG_TO_TICKER[slug];
      expect(TICKER_TO_SLUG[ticker]).toBe(slug);
    }
  });

  it('getCompany("SAMSUNG") follows current slug normalization behavior', () => {
    const company = getCompany("SAMSUNG");
    expect(company?.slug).toBe("samsung");
  });
});
