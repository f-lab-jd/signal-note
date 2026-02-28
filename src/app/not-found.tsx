import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Footer } from "@/components/ui/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="py-12 sm:py-16">
        <PageContainer>
          <Card className="relative overflow-hidden border-border/80 bg-card/95 p-8 sm:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-12 size-48 rounded-full bg-accent/20 blur-3xl"
            />
            <div className="relative space-y-4">
              <p className="text-xs uppercase tracking-[0.18em] text-neutral">404 Not Found</p>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">페이지를 찾을 수 없습니다</h1>
              <p className="text-sm text-neutral sm:text-base">
                요청하신 경로가 없거나 이동되었습니다. 대시보드에서 다시 종목을 탐색해 보세요.
              </p>
              <Link
                className="inline-flex items-center rounded-full border border-border/80 bg-background/40 px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/60 hover:bg-card"
                href="/"
              >
                홈으로 돌아가기
              </Link>
            </div>
          </Card>
        </PageContainer>
      </main>
      <Footer />
    </div>
  );
}
