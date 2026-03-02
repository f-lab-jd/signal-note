export type ISODateString = `${number}-${number}-${number}`;

export type MarketType = "KOSPI" | "KOSDAQ";

export type ConsensusRating = "매수" | "중립" | "매도";

export interface CompanyMetrics {
  marketCap: number;
  per: number | null;
  pbr: number | null;
  roe: number | null;
  dividendYield: number | null;
  foreignOwnership: number | null;
  weekRange52: {
    low: number;
    high: number;
  };
}

export interface AnnualFinancial {
  year: number;
  revenue: number;
  operatingProfit: number;
  netIncome: number;
}

export interface PricePoint {
  date: ISODateString;
  close: number;
}

export interface CompanyConsensus {
  targetPrice: number | null;
  rating: ConsensusRating;
  analystCount: number;
}

export interface CompanyData {
  slug: string;
  tickerCode: string;
  nameKo: string;
  nameEn: string;
  market: MarketType;
  sector: string;
  metrics: CompanyMetrics;
  financials: {
    annual: AnnualFinancial[];
  };
  priceHistory: PricePoint[];
  consensus: CompanyConsensus;
  lastUpdated: ISODateString;
}


export interface MarketIndex {
  label: string;
  value: number;
  changePercent: number;
}

export interface MarketData {
  indices: MarketIndex[];
  lastUpdated: ISODateString;
}