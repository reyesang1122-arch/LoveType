"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QUESTIONS, TOTAL_QUESTIONS } from "@/data/questions";
import { computeResult, encodeScores } from "@/lib/scoring";
import { saveTestResult } from "@/lib/supabase";
import { track } from "@/lib/analytics";

export default function TestPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void track("test_started");
  }, []);

  const question = QUESTIONS[step];
  const progress = Math.round((step / TOTAL_QUESTIONS) * 100);
  const selected = answers[step];

  const finish = useMemo(
    () =>
      async (finalAnswers: number[]) => {
        setSubmitting(true);
        const result = computeResult(finalAnswers);
        // best-effort analytics, never blocks navigation
        void saveTestResult({
          top_archetype: result.top,
          secondary_archetype: result.secondary,
          score: result.score,
          scores: result.scores,
        });
        void track("test_completed", { archetype: result.top });
        const s = encodeScores(result.scores);
        router.push(`/result?s=${encodeURIComponent(s)}`);
      },
    [router]
  );

  function choose(optionIndex: number) {
    const next = [...answers];
    next[step] = optionIndex;
    setAnswers(next);

    // brief delay so the user sees the selection highlight before advancing
    window.setTimeout(() => {
      if (step + 1 < TOTAL_QUESTIONS) {
        setStep(step + 1);
      } else {
        void finish(next);
      }
    }, 220);
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_50%_-10%,#efe2ff_0%,#faf7ff_45%,#fff_100%)]" />

      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 pb-10 pt-8">
        {/* Top bar: progress */}
        <div className="flex items-center gap-3">
          <button
            onClick={step === 0 ? undefined : back}
            disabled={step === 0}
            aria-label="上一题"
            className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition active:scale-95 disabled:opacity-40"
          >
            ←
          </button>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 transition-all duration-300"
              style={{ width: `${Math.max(progress, 4)}%` }}
            />
          </div>
          <span className="w-12 flex-none text-right text-xs font-semibold tabular-nums text-slate-500">
            {step + 1}/{TOTAL_QUESTIONS}
          </span>
        </div>

        {/* Question */}
        <div key={step} className="mt-12 flex flex-1 flex-col">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
            问题 {step + 1}
          </p>
          <h1 className="mt-3 text-balance text-2xl font-bold leading-snug text-ink">
            {question.text}
          </h1>

          <div className="mt-8 space-y-3">
            {question.options.map((opt, i) => {
              const isSelected = selected === i;
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={submitting}
                  className={`group flex w-full items-center gap-3 rounded-2xl border px-5 py-4 text-left transition active:scale-[0.99] ${
                    isSelected
                      ? "border-transparent bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                      : "border-slate-200 bg-white text-ink shadow-sm hover:border-indigo-300"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 flex-none items-center justify-center rounded-full border text-xs font-bold ${
                      isSelected
                        ? "border-white/60 bg-white/20 text-white"
                        : "border-slate-300 text-slate-400 group-hover:border-indigo-400 group-hover:text-indigo-500"
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-[15px] font-medium leading-snug">{opt.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 text-center text-[11px] text-slate-400">
          {submitting ? (
            <span className="inline-flex items-center gap-2 text-indigo-500">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-indigo-300 border-t-indigo-600" />
              正在召唤你的爱情守护灵…
            </span>
          ) : (
            <Link href="/" className="underline-offset-2 hover:underline">
              退出测试
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
