import { SITE_SETTINGS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border/80 py-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 text-xs text-neutral sm:px-6 lg:px-8">
        <p className="text-sm text-foreground">투자 참고용, 투자 권유가 아닙니다</p>
        <p>
          {SITE_SETTINGS.name} demo data · 마지막 업데이트 {new Date().getFullYear()}년
        </p>
      </div>
    </footer>
  );
}
