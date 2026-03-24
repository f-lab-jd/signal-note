"use client";

import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SITE_SETTINGS } from "@/lib/constants";

const STORAGE_KEY = "telegram_popup_dismissed_at";
const SHOW_DELAY_MS = 20_000;
const COOLDOWN_DAYS = 7;

export function TelegramPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const daysSince = (Date.now() - Number(raw)) / (1000 * 60 * 60 * 24);
        if (daysSince < COOLDOWN_DAYS) return;
      }
    } catch {
      // localStorage 접근 실패 시 팝업 표시
    }

    const timer = window.setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="텔레그램 시그널 구독"
      className="fixed bottom-5 right-5 z-50 w-72 overflow-hidden rounded-2xl border border-accent/45 bg-card shadow-[0_12px_48px_rgba(0,0,0,0.36)] sm:w-80"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-accent/20 blur-2xl"
      />
      <div className="relative p-5">
        <button
          type="button"
          onClick={dismiss}
          aria-label="닫기"
          className="absolute right-3 top-3 rounded-full p-1 text-neutral transition-colors hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.14em] text-neutral">무료 시그널</p>
          <p className="text-base font-semibold leading-snug">
            📢 매일 핵심 시그널을<br />텔레그램으로 받아보세요
          </p>
          <p className="text-sm text-neutral">
            장 시작 전 핵심 종목 움직임과 시그널을 무료로 받을 수 있습니다.
          </p>

          <div className="flex flex-col gap-2 pt-1">
            <a
              href={SITE_SETTINGS.telegramHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={dismiss}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-black/10 bg-accent px-4 py-2.5 text-sm font-bold text-black shadow-[0_6px_18px_rgba(0,208,132,0.3)] transition-all hover:brightness-110"
            >
              텔레그램 구독하기
              <ArrowUpRight className="size-3.5" />
            </a>
            <button
              type="button"
              onClick={dismiss}
              className="text-xs text-neutral transition-colors hover:text-foreground"
            >
              괜찮아요, 나중에 볼게요
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
