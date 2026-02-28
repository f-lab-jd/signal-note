import hyundai from "@/data/companies/hyundai.json";
import hynix from "@/data/companies/hynix.json";
import kakao from "@/data/companies/kakao.json";
import naver from "@/data/companies/naver.json";
import samsung from "@/data/companies/samsung.json";
import type { CompanyData } from "@/data/schema";
import { getAllCompanies, getAllSlugs, getCompany } from "@/lib/data";

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

const COMPANY_FIXTURES = [samsung, hynix, naver, kakao, hyundai];
const EXPECTED_SLUGS = ["samsung", "hynix", "naver", "kakao", "hyundai"];

describe("data loading", () => {
  it("all 5 JSON files include all required CompanyData fields", () => {
    expect(COMPANY_FIXTURES).toHaveLength(5);

    for (const company of COMPANY_FIXTURES) {
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

  it("getAllSlugs() returns 5 slugs", () => {
    expect(getAllSlugs()).toHaveLength(5);
  });

  it("getAllSlugs() includes all expected slugs", () => {
    expect(getAllSlugs()).toEqual(expect.arrayContaining(EXPECTED_SLUGS));
  });

  it("getAllCompanies() returns 5 companies", () => {
    expect(getAllCompanies()).toHaveLength(5);
  });
});
