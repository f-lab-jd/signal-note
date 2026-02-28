"use client";

import { Check, Copy, MessageCircle, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

const DEFAULT_SHARE_TEXT = "시그널노트 — 투자 데이터, 한눈에 보다";
const COPY_FEEDBACK_MS = 2000;
const KAKAO_CHECK_INTERVAL_MS = 150;
const KAKAO_CHECK_MAX_ATTEMPTS = 20;

interface ShareButtonsProps {
  shareText?: string;
}

function getButtonClassName(isCopied: boolean): string {
  return [
    "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold",
    "bg-card text-foreground",
    isCopied ? "border-accent text-accent" : "border-border hover:border-accent/60",
  ].join(" ");
}

export function ShareButtons({ shareText = DEFAULT_SHARE_TEXT }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [isKakaoAvailable, setIsKakaoAvailable] = useState(false);
  const kakaoJsKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCopied(false);
    }, COPY_FEEDBACK_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [copied]);

  useEffect(() => {
    if (!kakaoJsKey) {
      setIsKakaoAvailable(false);
      return;
    }

    let attempts = 0;
    const intervalId = window.setInterval(() => {
      attempts += 1;

      const kakao = window.Kakao;
      if (!kakao) {
        if (attempts >= KAKAO_CHECK_MAX_ATTEMPTS) {
          window.clearInterval(intervalId);
        }

        return;
      }

      try {
        if (!kakao.isInitialized()) {
          kakao.init(kakaoJsKey);
        }

        setIsKakaoAvailable(Boolean(kakao.Share));
      } catch (error) {
        console.warn("[ShareButtons] Kakao SDK initialization failed.", error);
        setIsKakaoAvailable(false);
      }

      window.clearInterval(intervalId);
    }, KAKAO_CHECK_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [kakaoJsKey]);

  const handleKakaoShare = () => {
    const kakao = window.Kakao;

    if (!kakao || !kakao.Share || !kakao.isInitialized()) {
      console.warn("[ShareButtons] Kakao SDK unavailable for share.");
      return;
    }

    try {
      kakao.Share.sendScrap({
        requestUrl: window.location.href,
      });
    } catch (error) {
      console.warn("[ShareButtons] Kakao share failed.", error);
    }
  };

  const handleXShare = () => {
    const shareUrl = new URL("https://twitter.com/intent/tweet");
    shareUrl.searchParams.set("url", window.location.href);
    shareUrl.searchParams.set("text", shareText);
    window.open(shareUrl.toString(), "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch (error) {
      console.warn("[ShareButtons] Failed to copy link.", error);
    }
  };

  return (
    <aside className="rounded-2xl border border-border bg-card/95 p-5 sm:p-6" aria-label="공유 버튼">
      <div className="flex flex-wrap gap-2">
        {isKakaoAvailable ? (
          <button className={getButtonClassName(false)} onClick={handleKakaoShare} type="button">
            <MessageCircle aria-hidden className="size-4" />
            카카오톡 공유
          </button>
        ) : null}

        <button className={getButtonClassName(false)} onClick={handleXShare} type="button">
          <Share2 aria-hidden className="size-4" />
          X(Twitter) 공유
        </button>

        <button className={getButtonClassName(copied)} onClick={handleCopyLink} type="button">
          {copied ? <Check aria-hidden className="size-4" /> : <Copy aria-hidden className="size-4" />}
          {copied ? "복사됨!" : "링크 복사"}
        </button>
      </div>
    </aside>
  );
}
