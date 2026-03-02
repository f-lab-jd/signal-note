import type { CompanyData } from "@/data/schema";
import { getAllCompanies, getAllSlugs, getCompany } from "@/lib/data";

const EXPECTED_COUNT = 25;

const REQUIRED_COMPANY_FIELDS: Array<keyof CompanyData> = [
  "slug",
  "nameKo",
  "nameEn",
  "tickerCode",
  "market",
  "sector",
  "metrics",
  "financials",
  "priceHistory",
  "consensus",
  "lastUpdated",
];

describe("data loading", () => {
  it(`all ${EXPECTED_COUNT} companies include all required CompanyData fields`, () => {
    const companies = getAllCompanies();
    expect(companies).toHaveLength(EXPECTED_COUNT);

    for (const company of companies) {
      for (const field of REQUIRED_COMPANY_FIELDS) {
        expect(company).toHaveProperty(field);
      }
    }
  });

  it('getCompany("samsung") returns 삼성전자', () => {
    const company = getCompany("samsung");

    expect(company).toBeDefined();
    expect(company?.nameKo).toBe("삼성전자");
  });

  it('getCompany("nonexistent") returns undefined', () => {
    expect(getCompany("nonexistent")).toBeUndefined();
  });

  it("getCompany(null) returns undefined without crashing", () => {
    expect(getCompany(null)).toBeUndefined();
  });

  it("getCompany(undefined) returns undefined without crashing", () => {
    expect(getCompany(undefined)).toBeUndefined();
  });

  it(`getAllSlugs() returns ${EXPECTED_COUNT} slugs`, () => {
    expect(getAllSlugs()).toHaveLength(EXPECTED_COUNT);
  });

  it("getAllSlugs() includes core slugs", () => {
    const slugs = getAllSlugs();
    expect(slugs).toContain("samsung");
    expect(slugs).toContain("hynix");
    expect(slugs).toContain("naver");
    expect(slugs).toContain("kakao");
    expect(slugs).toContain("hyundai");
  });

  it(`getAllCompanies() returns ${EXPECTED_COUNT} companies`, () => {
    expect(getAllCompanies()).toHaveLength(EXPECTED_COUNT);
  });
});
