import type { CompanyData } from "@/data/schema";
import alteogen from "@/data/companies/alteogen.json";
import amorepacific from "@/data/companies/amorepacific.json";
import celltrion from "@/data/companies/celltrion.json";
import ecoproBm from "@/data/companies/ecopro-bm.json";
import hanmiSemi from "@/data/companies/hanmi-semi.json";
import hanwhaAero from "@/data/companies/hanwha-aero.json";
import hdKsoe from "@/data/companies/hd-ksoe.json";
import hyundai from "@/data/companies/hyundai.json";
import hyundaiMobis from "@/data/companies/hyundai-mobis.json";
import hynix from "@/data/companies/hynix.json";
import kakao from "@/data/companies/kakao.json";
import kbFinance from "@/data/companies/kb-finance.json";
import kia from "@/data/companies/kia.json";
import krafton from "@/data/companies/krafton.json";
import kt from "@/data/companies/kt.json";
import lgChem from "@/data/companies/lg-chem.json";
import lgEnergy from "@/data/companies/lg-energy.json";
import naver from "@/data/companies/naver.json";
import posco from "@/data/companies/posco.json";
import samsung from "@/data/companies/samsung.json";
import samsungBio from "@/data/companies/samsung-bio.json";
import samsungFire from "@/data/companies/samsung-fire.json";
import samsungSdi from "@/data/companies/samsung-sdi.json";
import shinhan from "@/data/companies/shinhan.json";
import skt from "@/data/companies/skt.json";
import { COMPANY_SLUGS, type CompanySlug } from "@/lib/constants";

const COMPANIES_BY_SLUG: Record<CompanySlug, CompanyData> = {
  // 반도체
  "samsung": samsung as CompanyData,
  "hynix": hynix as CompanyData,
  "hanmi-semi": hanmiSemi as CompanyData,
  // 자동차
  "hyundai": hyundai as CompanyData,
  "kia": kia as CompanyData,
  "hyundai-mobis": hyundaiMobis as CompanyData,
  // 인터넷·게임
  "naver": naver as CompanyData,
  "kakao": kakao as CompanyData,
  "krafton": krafton as CompanyData,
  // 2차전지
  "lg-energy": lgEnergy as CompanyData,
  "samsung-sdi": samsungSdi as CompanyData,
  "ecopro-bm": ecoproBm as CompanyData,
  // 바이오
  "samsung-bio": samsungBio as CompanyData,
  "celltrion": celltrion as CompanyData,
  "alteogen": alteogen as CompanyData,
  // 금융
  "kb-finance": kbFinance as CompanyData,
  "shinhan": shinhan as CompanyData,
  "samsung-fire": samsungFire as CompanyData,
  // 소재·화학
  "posco": posco as CompanyData,
  "lg-chem": lgChem as CompanyData,
  // 방산·조선
  "hanwha-aero": hanwhaAero as CompanyData,
  "hd-ksoe": hdKsoe as CompanyData,
  // 통신
  "skt": skt as CompanyData,
  "kt": kt as CompanyData,
  // 유통·소비
  "amorepacific": amorepacific as CompanyData,
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
