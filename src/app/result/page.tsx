import { Suspense } from "react";
import type { Metadata } from "next";
import ResultClient from "@/components/ResultClient";

export const metadata: Metadata = {
  title: "我的爱情守护灵",
  description: "看看我的爱情守护灵，以及最适合我的另一半是谁。",
  robots: { index: false, follow: true },
};

function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      <p className="text-sm text-slate-400">正在揭晓你的爱情守护灵…</p>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ResultClient />
    </Suspense>
  );
}
