import type { CompanyData } from "@/data/schema";
import hyundai from "@/data/companies/hyundai.json";
import hynix from "@/data/companies/hynix.json";
import kakao from "@/data/companies/kakao.json";
import naver from "@/data/companies/naver.json";
import samsung from "@/data/companies/samsung.json";
import { COMPANY_SLUGS, type CompanySlug } from "@/lib/constants";

const COMPANIES_BY_SLUG: Record<CompanySlug, CompanyData> = {
  samsung: samsung as CompanyData,
  hynix: hynix as CompanyData,
  naver: naver as CompanyData,
  kakao: kakao as CompanyData,
  hyundai: hyundai as CompanyData,
};

function normalizeSlug(slug: string | null | undefined): CompanySlug | null {
  if (!slug) {
    return null;
  }

  const normalizedSlug = slug.trim().toLowerCase() as CompanySlug;
  return COMPANY_SLUGS.includes(normalizedSlug) ? normalizedSlug : null;
}

export function getCompany(slug: string | null | undefined): CompanyData | undefined {
  const normalizedSlug = normalizeSlug(slug);
  return normalizedSlug ? COMPANIES_BY_SLUG[normalizedSlug] : undefined;
}

export function getAllCompanies(): CompanyData[] {
  return COMPANY_SLUGS.map((slug) => COMPANIES_BY_SLUG[slug]);
}

export function getAllSlugs(): CompanySlug[] {
  return [...COMPANY_SLUGS];
}
