"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "signalnote-theme";

function resolveStoredTheme(): Theme | null {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
}

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const [systemTheme, setSystemTheme] = useState<Theme>("dark");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      setSystemTheme(getSystemTheme());
    };

    setMounted(true);
    setSystemTheme(getSystemTheme());

    const initialTheme = resolveStoredTheme() ?? "dark";
    setTheme(initialTheme);
    applyTheme(initialTheme);

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  const buttonLabel = useMemo(() => {
    if (!mounted) {
      return "테마 전환";
    }

    return theme === "dark"
      ? `라이트 모드로 전환 (시스템: ${systemTheme === "dark" ? "다크" : "라이트"})`
      : `다크 모드로 전환 (시스템: ${systemTheme === "dark" ? "다크" : "라이트"})`;
  }, [mounted, systemTheme, theme]);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  };

  if (!mounted) {
    return (
      <button
        aria-hidden
        className="pointer-events-none inline-flex size-10 items-center justify-center rounded-full border border-border/70 bg-card/70 opacity-0"
        type="button"
      />
    );
  }

  return (
    <button
      aria-label={buttonLabel}
      className="inline-flex size-10 items-center justify-center rounded-full border border-border/75 bg-card/70 text-foreground transition hover:border-accent/55 hover:bg-card"
      onClick={toggleTheme}
      title={buttonLabel}
      type="button"
    >
      {theme === "dark" ? <Sun aria-hidden className="size-4" /> : <Moon aria-hidden className="size-4" />}
    </button>
  );
}
