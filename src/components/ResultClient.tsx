"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ARCHETYPES, getArchetype } from "@/data/archetypes";
import { decodeScores, resultFromScores } from "@/lib/scoring";
import ShareCard from "@/components/ShareCard";
import ConversionCTA from "@/components/ConversionCTA";
import { track } from "@/lib/analytics";
import { makeQrDataUrl } from "@/lib/qr";
import { SITE } from "@/lib/site";

/** Warm the browser cache so html-to-image can inline the avatar instantly. */
function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
    if (img.complete) resolve();
  });
}

export default function ResultClient() {
  const params = useSearchParams();
  const cardRef = useRef<HTMLDivElement>(null);
  const shareFileRef = useRef<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [qr, setQr] = useState<string>("");

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  // Pre-render the QR once so it's already inside the off-screen card at capture time.
  useEffect(() => {
    let alive = true;
    makeQrDataUrl(SITE.url).then((d) => alive && setQr(d));
    return () => {
      alive = false;
    };
  }, []);

  const scores = decodeScores(params.get("s"));

  if (!scores) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
        <div className="text-5xl">💔</div>
        <h1 className="text-xl font-bold text-ink">还没有测试结果</h1>
        <p className="text-sm text-slate-500">先完成测试，才能看到你的爱情守护灵。</p>
        <Link
          href="/test"
          className="rounded-2xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg"
        >
          开始测试
        </Link>
      </main>
    );
  }

  const result = resultFromScores(scores);
  const top = ARCHETYPES[result.top];
  const secondary = ARCHETYPES[result.secondary];
  const ideal = getArchetype(top.idealMatch)!;
  const t = top.theme;

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2600);
  }

  async function handleGenerate() {
    if (busy) return;
    setBusy(true);
    try {
      const node = cardRef.current;
      if (!node) {
        flash("正在准备，请再点一次");
        return;
      }
      // make sure fonts + the avatar are ready before snapshotting
      try {
        await (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready;
      } catch {
        /* ignore */
      }
      await preloadImage(top.avatar);

      const { toPng } = await import("html-to-image");
      const opts = { width: 1080, height: 1920, pixelRatio: 1, cacheBust: true };
      // first pass primes images; second pass is reliably complete
      let dataUrl = await toPng(node, opts);
      dataUrl = await toPng(node, opts);

      if (!dataUrl || dataUrl.length < 5000) throw new Error("empty render");
      setPreviewUrl(dataUrl);
      // pre-build the shareable File now (NOT inside the share tap) so that
      // navigator.share() fires synchronously within the gesture on iOS.
      try {
        const blob = await (await fetch(dataUrl)).blob();
        shareFileRef.current = new File([blob], `love-spirit-${top.id}.png`, {
          type: "image/png",
        });
      } catch {
        shareFileRef.current = null;
      }
      void track("share_card_generated", { archetype: top.id });
    } catch {
      flash("生成失败，请重试");
    } finally {
      setBusy(false);
    }
  }

  function downloadImage() {
    if (!previewUrl) return;
    const a = document.createElement("a");
    a.href = previewUrl;
    a.download = `love-spirit-${top.id}.png`;
    a.click();
    flash("已保存图片，打开 IG 发限时动态吧 ✨");
  }

  async function handleSaveShare() {
    void track("share_clicked", { archetype: top.id });
    // Copy the link so users can paste it as a tappable IG "link sticker".
    try {
      await navigator.clipboard?.writeText(SITE.url);
      flash("🔗 链接已复制！在 IG 限动里加「链接贴纸」粘贴，朋友就能一点跳过来（图里也有二维码可扫）");
    } catch {
      /* clipboard may be blocked; QR on the card still works */
    }
    const file = shareFileRef.current;
    const shareable =
      !!file &&
      typeof navigator !== "undefined" &&
      typeof navigator.canShare === "function" &&
      navigator.canShare({ files: [file] });

    if (shareable && file) {
      try {
        await navigator.share({
          files: [file],
          title: `我的爱情守护灵是${top.spiritName}`,
          text: `我的爱情守护灵是「${top.spiritName}」${top.animalEmoji}，快来测测你的 👉`,
          url: SITE.url,
        });
      } catch (err) {
        const name = (err as { name?: string })?.name;
        if (name !== "AbortError") downloadImage();
      }
    } else {
      downloadImage();
    }
  }

  async function copyLink() {
    try {
      const url = `${window.location.origin}/result?s=${params.get("s")}`;
      await navigator.clipboard.writeText(url);
      flash("结果链接已复制");
    } catch {
      flash("复制失败");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden pb-16">
      {/* Off-screen capture node for the share card */}
      <div
        aria-hidden
        className="no-scrollbar"
        style={{
          position: "fixed",
          left: -99999,
          top: 0,
          pointerEvents: "none",
        }}
      >
        <ShareCard ref={cardRef} archetype={top} secondary={secondary} score={result.score} qrDataUrl={qr} />
      </div>

      {/* Hero with archetype gradient */}
      <section
        className="relative px-6 pb-10 pt-16 text-center"
        style={{
          background: `linear-gradient(160deg, ${t.from} 0%, ${t.via} 55%, ${t.to} 100%)`,
          color: t.text,
        }}
      >
        <div className="mx-auto max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] opacity-80">
            你的爱情守护灵
          </p>
          <div className="mt-6 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={top.avatar}
              alt={`${top.spiritName} ${top.animalName}`}
              width={350}
              height={561}
              className="w-44 animate-scale-in rounded-3xl shadow-2xl ring-1 ring-white/40"
            />
          </div>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight">
            {top.animalEmoji} {top.spiritName}
          </h1>
          <p className="mt-1 text-sm uppercase tracking-[0.3em] opacity-80">{top.animalName}</p>

          <p className="mx-auto mt-6 max-w-xs text-balance text-base font-medium leading-relaxed opacity-95">
            「{top.tagline}」
          </p>

          <div className="mt-7 inline-flex items-center gap-4 rounded-2xl bg-white/15 px-6 py-3 backdrop-blur">
            <div>
              <div className="text-[11px] opacity-80">匹配度</div>
              <div className="text-2xl font-extrabold leading-tight">{result.score}%</div>
            </div>
            <div className="h-8 w-px bg-white/30" />
            <div>
              <div className="text-[11px] opacity-80">潜在面</div>
              <div className="text-sm font-bold leading-tight">
                {secondary.animalEmoji} {secondary.spiritName}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto -mt-6 max-w-md px-6">
        {/* Description card */}
        <div className="animate-fade-up rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg backdrop-blur">
          <p className="text-[15px] leading-relaxed text-slate-700">{top.description}</p>
        </div>

        {/* Strengths */}
        <Section title="你的恋爱优势" emoji="💪">
          <ul className="space-y-2.5">
            {top.strengths.map((s) => (
              <li key={s} className="flex items-start gap-2.5 text-sm text-slate-700">
                <span
                  className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full"
                  style={{ background: t.accent }}
                />
                {s}
              </li>
            ))}
          </ul>
        </Section>

        {/* Blind spots */}
        <Section title="关系里的盲点" emoji="🫧">
          <ul className="space-y-2.5">
            {top.blindSpots.map((s) => (
              <li key={s} className="flex items-start gap-2.5 text-sm text-slate-700">
                <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-slate-300" />
                {s}
              </li>
            ))}
          </ul>
        </Section>

        {/* Ideal match */}
        <Section title="最契合你的另一半" emoji="💞">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ideal.avatar}
              alt={`${ideal.spiritName} ${ideal.animalName}`}
              width={350}
              height={561}
              className="h-24 w-16 flex-none rounded-2xl object-cover object-top shadow-md ring-1 ring-black/5"
            />
            <div>
              <div className="text-lg font-bold text-ink">
                {ideal.animalEmoji} {ideal.spiritName}
                <span className="ml-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                  {ideal.animalName}
                </span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{top.matchReason}</p>
            </div>
          </div>
        </Section>

        {/* Full ranking */}
        <Section title="你的八灵图谱" emoji="📊">
          <div className="space-y-3">
            {result.ranking.map((r) => {
              const a = ARCHETYPES[r.id];
              const max = result.ranking[0].points || 1;
              const width = Math.round((r.points / max) * 100);
              return (
                <div key={r.id}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-600">
                      {a.animalEmoji} {a.spiritName}
                    </span>
                    <span className="tabular-nums text-slate-400">{r.percent}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.max(width, 4)}%`,
                        background: a.theme.accent,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Share actions */}
        <div className="mt-8 space-y-3">
          <button
            onClick={handleGenerate}
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition active:scale-[0.98] disabled:opacity-70"
          >
            {busy ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                正在生成卡片…
              </>
            ) : (
              <>📲 一键生成 IG 分享卡</>
            )}
          </button>
          <button
            onClick={copyLink}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-600 shadow-sm transition active:scale-[0.98]"
          >
            🔗 复制结果链接
          </button>
        </div>

        {/* Conversion */}
        <ConversionCTA archetype={top.id} />

        {/* Retake */}
        <div className="mt-8 text-center">
          <Link
            href="/test"
            className="text-sm font-medium text-slate-400 underline-offset-2 hover:underline"
          >
            重新测一次
          </Link>
        </div>
      </div>

      {/* Generated share-card preview */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/80 px-6 py-8 backdrop-blur-sm"
          onClick={() => setPreviewUrl(null)}
        >
          <p className="mb-3 text-center text-sm text-white/80">
            {canShare
              ? "点下方按钮 → 选 Instagram → 限时动态 📲"
              : "长按图片保存，再去 IG 发限时动态 👇"}
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt={`${top.spiritName} 分享卡`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[64vh] w-auto rounded-2xl shadow-2xl ring-1 ring-white/20"
          />
          <div className="mt-5 flex w-full max-w-xs flex-col gap-3" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleSaveShare}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-base font-bold text-ink shadow-lg transition active:scale-[0.98]"
            >
              {canShare ? "📲 分享到 IG Story / 其他 App" : "💾 保存图片"}
            </button>
            <p className="text-center text-[11px] leading-relaxed text-white/60">
              卡片上有网址，朋友看到就能来测自己的守护灵 💞
            </p>
            <button
              onClick={() => setPreviewUrl(null)}
              className="text-sm font-medium text-white/70"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-6">
          <div className="rounded-full bg-ink/90 px-5 py-2.5 text-sm font-medium text-white shadow-lg backdrop-blur">
            {toast}
          </div>
        </div>
      )}
    </main>
  );
}

function Section({
  title,
  emoji,
  children,
}: {
  title: string;
  emoji: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 animate-fade-up rounded-3xl border border-white/70 bg-white/90 p-6 shadow-sm backdrop-blur">
      <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-ink">
        <span>{emoji}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}
