#!/usr/bin/env python3
"""
signal-note 일별 데이터 수집 스크립트.

매일 장 마감 후 (4:00 PM KST) 실행.
데이터 소스:
  - 네이버 증권 모바일 API (primary): 종가, 시총, PER/PBR, 배당수익률, 52주 범위,
    외국인비율, 컨센서스, KOSPI/KOSDAQ 지수
  - pykrx (secondary): 월별 종가 히스토리 (최근 12개월)
  - exchangerate-api.com: USD/KRW 환율

사용법:
  python scripts/collect.py              # 실제 수집 + JSON 업데이트
  python scripts/collect.py --dry-run    # 수집만 하고 파일 쓰지 않음
"""

from __future__ import annotations

import json
import re
import sys
from datetime import date, timedelta
from pathlib import Path

import requests
from pykrx import stock

# ---------------------------------------------------------------------------
# 경로
# ---------------------------------------------------------------------------
PROJECT_ROOT = Path(__file__).resolve().parent.parent
COMPANIES_DIR = PROJECT_ROOT / "src" / "data" / "companies"
MARKET_FILE = PROJECT_ROOT / "src" / "data" / "market.json"

# ---------------------------------------------------------------------------
# 종목 메타 (정적 — 거의 안 바뀜)
# ---------------------------------------------------------------------------
COMPANIES: dict[str, dict] = {
    # 반도체
    "samsung": {
        "ticker": "005930",
        "nameKo": "삼성전자",
        "nameEn": "Samsung Electronics",
        "market": "KOSPI",
        "sector": "반도체·전자제품",
    },
    "hynix": {
        "ticker": "000660",
        "nameKo": "SK하이닉스",
        "nameEn": "SK Hynix",
        "market": "KOSPI",
        "sector": "반도체",
    },
    "hanmi-semi": {
        "ticker": "042700",
        "nameKo": "한미반도체",
        "nameEn": "Hanmi Semiconductor",
        "market": "KOSPI",
        "sector": "반도체",
    },
    # 자동차
    "hyundai": {
        "ticker": "005380",
        "nameKo": "현대자동차",
        "nameEn": "Hyundai Motor",
        "market": "KOSPI",
        "sector": "자동차",
    },
    "kia": {
        "ticker": "000270",
        "nameKo": "기아",
        "nameEn": "Kia Corp",
        "market": "KOSPI",
        "sector": "자동차",
    },
    "hyundai-mobis": {
        "ticker": "012330",
        "nameKo": "현대모비스",
        "nameEn": "Hyundai Mobis",
        "market": "KOSPI",
        "sector": "자동차부품",
    },
    # 인터넷·게임
    "naver": {
        "ticker": "035420",
        "nameKo": "NAVER",
        "nameEn": "NAVER Corp",
        "market": "KOSPI",
        "sector": "인터넷·플랫폼",
    },
    "kakao": {
        "ticker": "035720",
        "nameKo": "카카오",
        "nameEn": "Kakao Corp",
        "market": "KOSPI",
        "sector": "인터넷·플랫폼",
    },
    "krafton": {
        "ticker": "259960",
        "nameKo": "크래프톤",
        "nameEn": "Krafton",
        "market": "KOSPI",
        "sector": "게임",
    },
    # 2차전지
    "lg-energy": {
        "ticker": "373220",
        "nameKo": "LG에너지솔루션",
        "nameEn": "LG Energy Solution",
        "market": "KOSPI",
        "sector": "2차전지",
    },
    "samsung-sdi": {
        "ticker": "006400",
        "nameKo": "삼성SDI",
        "nameEn": "Samsung SDI",
        "market": "KOSPI",
        "sector": "2차전지",
    },
    "ecopro-bm": {
        "ticker": "247540",
        "nameKo": "에코프로비엠",
        "nameEn": "EcoPro BM",
        "market": "KOSDAQ",
        "sector": "2차전지소재",
    },
    # 바이오
    "samsung-bio": {
        "ticker": "207940",
        "nameKo": "삼성바이오로직스",
        "nameEn": "Samsung Biologics",
        "market": "KOSPI",
        "sector": "바이오",
    },
    "celltrion": {
        "ticker": "068270",
        "nameKo": "셀트리온",
        "nameEn": "Celltrion",
        "market": "KOSPI",
        "sector": "바이오",
    },
    "alteogen": {
        "ticker": "196170",
        "nameKo": "알테오젠",
        "nameEn": "Alteogen",
        "market": "KOSDAQ",
        "sector": "바이오",
    },
    # 금융
    "kb-finance": {
        "ticker": "105560",
        "nameKo": "KB금융",
        "nameEn": "KB Financial Group",
        "market": "KOSPI",
        "sector": "금융",
    },
    "shinhan": {
        "ticker": "055550",
        "nameKo": "신한지주",
        "nameEn": "Shinhan Financial Group",
        "market": "KOSPI",
        "sector": "금융",
    },
    "samsung-fire": {
        "ticker": "000810",
        "nameKo": "삼성화재",
        "nameEn": "Samsung Fire & Marine",
        "market": "KOSPI",
        "sector": "보험",
    },
    # 소재·화학
    "posco": {
        "ticker": "005490",
        "nameKo": "POSCO홀딩스",
        "nameEn": "POSCO Holdings",
        "market": "KOSPI",
        "sector": "철강",
    },
    "lg-chem": {
        "ticker": "051910",
        "nameKo": "LG화학",
        "nameEn": "LG Chem",
        "market": "KOSPI",
        "sector": "화학",
    },
    # 방산·조선
    "hanwha-aero": {
        "ticker": "012450",
        "nameKo": "한화에어로스페이스",
        "nameEn": "Hanwha Aerospace",
        "market": "KOSPI",
        "sector": "방산",
    },
    "hd-ksoe": {
        "ticker": "009540",
        "nameKo": "HD한국조선해양",
        "nameEn": "HD Korea Shipbuilding",
        "market": "KOSPI",
        "sector": "조선",
    },
    # 통신
    "skt": {
        "ticker": "017670",
        "nameKo": "SK텔레콤",
        "nameEn": "SK Telecom",
        "market": "KOSPI",
        "sector": "통신",
    },
    "kt": {
        "ticker": "030200",
        "nameKo": "KT",
        "nameEn": "KT Corp",
        "market": "KOSPI",
        "sector": "통신",
    },
    # 유통·소비
    "amorepacific": {
        "ticker": "090430",
        "nameKo": "아모레퍼시픽",
        "nameEn": "Amorepacific",
        "market": "KOSPI",
        "sector": "화장품",
    },
}

HTTP_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/131.0.0.0 Safari/537.36"
    ),
}


# ---------------------------------------------------------------------------
# 유틸
# ---------------------------------------------------------------------------
def log(msg: str) -> None:
    print(f"[collect] {msg}", flush=True)


def warn(msg: str) -> None:
    print(f"[collect][warn] {msg}", file=sys.stderr, flush=True)


def today_iso() -> str:
    """오늘 날짜를 YYYY-MM-DD 형식으로 반환."""
    return date.today().strftime("%Y-%m-%d")


def safe_float(value: object) -> float | None:
    """0이나 NaN이면 None, 아니면 float."""
    try:
        v = float(value)  # type: ignore[arg-type]
        if v == 0 or v != v:  # 0 or NaN
            return None
        return round(v, 4)
    except (TypeError, ValueError):
        return None


def parse_korean_number(text: str) -> int | None:
    """한글 단위 숫자 파싱. '1,281조 6,016억' → 12816016 (억원 단위)."""
    if not text:
        return None
    text = text.strip()

    # 조 + 억 패턴: "1,281조 6,016억"
    m = re.match(r"([\d,]+)조\s*([\d,]+)억", text)
    if m:
        jo = int(m.group(1).replace(",", ""))
        eok = int(m.group(2).replace(",", ""))
        return jo * 10000 + eok

    # 조만 있는 패턴: "1,281조"
    m = re.match(r"([\d,]+)조", text)
    if m:
        jo = int(m.group(1).replace(",", ""))
        return jo * 10000

    # 억만 있는 패턴: "6,016억"
    m = re.match(r"([\d,]+)억", text)
    if m:
        eok = int(m.group(1).replace(",", ""))
        return eok

    return None


def parse_ratio(text: str) -> float | None:
    """'32.98배' → 32.98, '50.66%' → 50.66, '0.77%' → 0.77."""
    if not text:
        return None
    text = text.strip()
    m = re.match(r"([\d,.]+)", text)
    if m:
        try:
            return round(float(m.group(1).replace(",", "")), 4)
        except ValueError:
            return None
    return None


def parse_comma_int(text: str) -> int | None:
    """'228,500' → 228500, '216,500' → 216500."""
    if not text:
        return None
    try:
        return int(text.replace(",", ""))
    except ValueError:
        return None


def parse_comma_float(text: str) -> float | None:
    """'6,244.13' → 6244.13."""
    if not text:
        return None
    try:
        return round(float(text.replace(",", "")), 2)
    except ValueError:
        return None


# ---------------------------------------------------------------------------
# 네이버 증권 모바일 API — 종목 데이터
# ---------------------------------------------------------------------------
def fetch_naver_stock(ticker: str) -> dict:
    """네이버 증권 API에서 종목 데이터 수집."""
    result: dict = {
        "close": None,
        "marketCap": None,
        "per": None,
        "pbr": None,
        "dividendYield": None,
        "weekRange52": None,
        "foreignOwnership": None,
        "consensus": None,
    }

    # --- basic API: 종가, 등락률 ---
    try:
        url = f"https://m.stock.naver.com/api/stock/{ticker}/basic"
        resp = requests.get(url, headers=HTTP_HEADERS, timeout=10)
        if resp.ok:
            data = resp.json()
            result["close"] = parse_comma_int(data.get("closePrice", ""))
    except Exception as e:
        warn(f"네이버 basic API 실패 ({ticker}): {e}")

    # --- integration API: 시총, PER, PBR, 배당, 52주, 외인, 컨센서스 ---
    try:
        url = f"https://m.stock.naver.com/api/stock/{ticker}/integration"
        resp = requests.get(url, headers=HTTP_HEADERS, timeout=10)
        if resp.ok:
            data = resp.json()

            # totalInfos 파싱
            info_map: dict[str, str] = {}
            for item in data.get("totalInfos", []):
                code = item.get("code", "")
                value = item.get("value", "")
                if code and value:
                    info_map[code] = value

            result["marketCap"] = parse_korean_number(info_map.get("marketValue", ""))
            result["per"] = parse_ratio(info_map.get("per", ""))
            result["pbr"] = parse_ratio(info_map.get("pbr", ""))
            result["dividendYield"] = parse_ratio(info_map.get("dividendYieldRatio", ""))

            w52_high = parse_comma_int(info_map.get("highPriceOf52Weeks", ""))
            w52_low = parse_comma_int(info_map.get("lowPriceOf52Weeks", ""))
            if w52_high is not None and w52_low is not None:
                result["weekRange52"] = {"low": w52_low, "high": w52_high}

            foreign_rate = parse_ratio(info_map.get("foreignRate", ""))
            if foreign_rate is not None:
                result["foreignOwnership"] = round(foreign_rate, 2)

            # 외인비율 보강: dealTrendInfos에서 더 정확한 값
            deal_trends = data.get("dealTrendInfos", [])
            if deal_trends:
                hold_ratio = parse_ratio(deal_trends[0].get("foreignerHoldRatio", ""))
                if hold_ratio is not None:
                    result["foreignOwnership"] = round(hold_ratio, 2)

            # 컨센서스
            consensus_data = data.get("consensusInfo")
            if consensus_data:
                target_str = consensus_data.get("priceTargetMean", "")
                recomm_str = consensus_data.get("recommMean", "")

                target_price = parse_comma_int(target_str)
                recomm_mean = parse_comma_float(recomm_str) if recomm_str else None

                # recommMean 매핑: 4~5=매수, 3=중립, 1~2=매도
                rating = "중립"
                if recomm_mean is not None:
                    if recomm_mean >= 3.5:
                        rating = "매수"
                    elif recomm_mean <= 2.5:
                        rating = "매도"

                # 리서치 수로 analystCount 추정
                researches = data.get("researches", [])
                analyst_count = len(researches) if researches else 0

                result["consensus"] = {
                    "targetPrice": target_price,
                    "rating": rating,
                    "analystCount": analyst_count,
                }

    except Exception as e:
        warn(f"네이버 integration API 실패 ({ticker}): {e}")

    return result


# ---------------------------------------------------------------------------
# pykrx — 월별 종가 히스토리 (12개월)
# ---------------------------------------------------------------------------
def fetch_price_history(ticker: str) -> list[dict]:
    """pykrx에서 월별 종가 히스토리 수집."""
    year_ago = (date.today() - timedelta(days=400)).strftime("%Y%m%d")
    today_str = date.today().strftime("%Y%m%d")
    price_history: list[dict] = []

    try:
        monthly = stock.get_market_ohlcv_by_date(year_ago, today_str, ticker, freq="m")
        for idx, row in monthly.iterrows():
            close_val = int(row["종가"])
            if close_val > 0:
                price_history.append({
                    "date": idx.strftime("%Y-%m-%d"),
                    "close": close_val,
                })
    except Exception as e:
        warn(f"pykrx 월별 종가 수집 실패 ({ticker}): {e}")

    return price_history


# ---------------------------------------------------------------------------
# 시장 지수 — 네이버 API
# ---------------------------------------------------------------------------
def fetch_market_indices() -> list[dict]:
    """KOSPI, KOSDAQ 지수 수집."""
    indices: list[dict] = []

    for code, label in [("KOSPI", "KOSPI"), ("KOSDAQ", "KOSDAQ")]:
        try:
            url = f"https://m.stock.naver.com/api/index/{code}/basic"
            resp = requests.get(url, headers=HTTP_HEADERS, timeout=10)
            if resp.ok:
                data = resp.json()
                close = parse_comma_float(data.get("closePrice", ""))
                change_pct = parse_comma_float(data.get("fluctuationsRatio", ""))

                if close is not None:
                    indices.append({
                        "label": label,
                        "value": close,
                        "changePercent": change_pct if change_pct is not None else 0,
                    })
        except Exception as e:
            warn(f"{label} 지수 수집 실패: {e}")

    return indices


# ---------------------------------------------------------------------------
# USD/KRW 환율 — exchangerate-api.com (무료, 키 불필요)
# ---------------------------------------------------------------------------
def fetch_usd_krw() -> dict | None:
    """USD/KRW 환율 수집. changePercent는 이전 market.json과 비교해서 계산."""
    try:
        url = "https://api.exchangerate-api.com/v4/latest/USD"
        resp = requests.get(url, headers=HTTP_HEADERS, timeout=10)
        if resp.ok:
            data = resp.json()
            krw = data.get("rates", {}).get("KRW")
            if krw:
                value = round(float(krw), 2)

                # 이전 market.json에서 USD/KRW 값을 읽어서 변동률 계산
                change_pct = 0.0
                if MARKET_FILE.exists():
                    try:
                        old_data = json.loads(MARKET_FILE.read_text(encoding="utf-8"))
                        for idx in old_data.get("indices", []):
                            if idx.get("label") == "USD/KRW":
                                old_val = idx.get("value", 0)
                                if old_val and old_val != 0:
                                    change_pct = round(((value - old_val) / old_val) * 100, 2)
                                break
                    except Exception:
                        pass

                return {
                    "label": "USD/KRW",
                    "value": value,
                    "changePercent": change_pct,
                }
    except Exception as e:
        warn(f"USD/KRW 환율 수집 실패: {e}")

    return None


# ---------------------------------------------------------------------------
# JSON 읽기/쓰기
# ---------------------------------------------------------------------------
def load_company_json(slug: str) -> dict:
    """기존 회사 JSON 파일 로드. 없으면 빈 dict."""
    path = COMPANIES_DIR / f"{slug}.json"
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return {}


def save_json(path: Path, data: dict | list) -> None:
    """JSON 저장 (pretty-print, 한글 보존)."""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


# ---------------------------------------------------------------------------
# 종목 데이터 병합
# ---------------------------------------------------------------------------
def merge_company_data(
    slug: str,
    meta: dict,
    existing: dict,
    naver_data: dict,
    price_history: list[dict],
    today: str,
) -> dict:
    """기존 JSON + 새 데이터 병합. 정적 필드 보존, 동적 필드 업데이트."""
    old_metrics = existing.get("metrics", {})
    old_consensus = existing.get("consensus", {})

    return {
        "slug": slug,
        "tickerCode": meta["ticker"],
        "nameKo": meta["nameKo"],
        "nameEn": meta["nameEn"],
        "market": meta["market"],
        "sector": meta["sector"],
        "metrics": {
            "marketCap": naver_data["marketCap"] or old_metrics.get("marketCap"),
            "per": naver_data["per"],
            "pbr": naver_data["pbr"],
            "roe": None,  # TODO: DART 연동 후 추가
            "dividendYield": naver_data["dividendYield"],
            "foreignOwnership": naver_data.get("foreignOwnership"),
            "weekRange52": naver_data["weekRange52"] or old_metrics.get("weekRange52", {"low": 0, "high": 0}),
        },
        # 연간 실적은 일별 수집 대상 아님 — 기존 데이터 보존
        "financials": existing.get("financials", {"annual": []}),
        "priceHistory": price_history or existing.get("priceHistory", []),
        "consensus": naver_data.get("consensus") or old_consensus,
        "lastUpdated": today,
    }


# ---------------------------------------------------------------------------
# 메인
# ---------------------------------------------------------------------------
def main() -> None:
    dry_run = "--dry-run" in sys.argv

    log("데이터 수집 시작" + (" (dry-run)" if dry_run else ""))

    today = today_iso()
    log(f"날짜: {today}")

    # 1. 종목별 수집
    for slug, meta in COMPANIES.items():
        ticker = meta["ticker"]
        log(f"  {meta['nameKo']} ({ticker}) 수집 중...")

        try:
            existing = load_company_json(slug)
            naver_data = fetch_naver_stock(ticker)
            price_history = fetch_price_history(ticker)

            merged = merge_company_data(slug, meta, existing, naver_data, price_history, today)

            if dry_run:
                log(f"    종가={naver_data['close']}, 시총={merged['metrics']['marketCap']}억, PER={merged['metrics']['per']}, 외인={merged['metrics']['foreignOwnership']}%")
                if merged["consensus"]:
                    log(f"    컨센서스: 목표가={merged['consensus']['targetPrice']}, 의견={merged['consensus']['rating']}")
            else:
                save_json(COMPANIES_DIR / f"{slug}.json", merged)
                log(f"    ✓ 저장 완료")
        except Exception as e:
            warn(f"  {slug} 수집 실패: {e}")

    # 2. 시장 지수 수집
    log("시장 지수 수집 중...")
    try:
        indices = fetch_market_indices()

        # USD/KRW 추가
        usd_krw = fetch_usd_krw()
        if usd_krw:
            indices.append(usd_krw)

        market_data = {
            "indices": indices,
            "lastUpdated": today,
        }

        if dry_run:
            for idx in indices:
                log(f"    {idx['label']}: {idx['value']} ({idx['changePercent']:+.2f}%)")
        else:
            save_json(MARKET_FILE, market_data)
            log(f"  ✓ market.json 저장 완료")
    except Exception as e:
        warn(f"시장 지수 수집 실패: {e}")

    log("수집 완료!")


if __name__ == "__main__":
    main()
