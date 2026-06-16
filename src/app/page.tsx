import Link from "next/link";
import Image from "next/image";
import { ARCHETYPES, type ArchetypeId } from "@/data/archetypes";
import { SITE } from "@/lib/site";
import Track from "@/components/Track";
import XinyuButton from "@/components/XinyuButton";

// Display order for the hero strip + grid (matches the brief).
const SPIRITS: ArchetypeId[] = [
  "builder",
  "guardian",
  "dreamer",
  "healer",
  "challenger",
  "mediator",
  "independent",
  "pursuer",
];

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: `${SITE.nameZh} · 爱情守护灵`,
    description: SITE.description,
    about: { "@type": "Thing", name: "Love spirit animal" },
  };

  return (
    <main className="relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Track event="landing_view" withSource />

      {/* Ambient gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_50%_-10%,#efe2ff_0%,#faf7ff_45%,#fff_100%)]" />
      <div className="pointer-events-none absolute -left-24 top-24 -z-10 h-72 w-72 rounded-full bg-fuchsia-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-64 -z-10 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl" />

      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 pb-10 pt-14">
        {/* ============================ HERO ============================ */}
        <section className="flex flex-col items-center text-center">
          <Image
            src="/lovetype-logo.png"
            alt="LoveType 恋爱原型测试"
            width={88}
            height={88}
            priority
            className="mb-4 h-20 w-20 rounded-[1.4rem] shadow-lg ring-1 ring-black/5"
          />
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-1.5 text-xs font-medium text-indigo-700 shadow-sm backdrop-blur">
            🐾 8 只爱情守护灵 · 找出属于你的那只
          </span>

          <h1 className="text-balance text-[2.7rem] font-extrabold leading-[1.1] tracking-tight text-ink">
            测出你的
            <br />
            <span className="bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              爱情守护灵
            </span>
          </h1>

          <p className="mt-4 text-balance text-[15px] leading-relaxed text-slate-600">
            为什么你总是遇到同一种感情问题？
            <br />3 分钟测出你的恋爱人格、关系盲点，
            <br />以及最适合你的另一半。
          </p>

          {/* 8-character strip */}
          <div className="no-scrollbar mt-7 flex w-full snap-x gap-3 overflow-x-auto pb-1">
            {SPIRITS.map((id, i) => {
              const a = ARCHETYPES[id];
              return (
                <div
                  key={id}
                  className="animate-fade-up flex w-[68px] flex-none snap-start flex-col items-center"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="overflow-hidden rounded-2xl border border-white/70 bg-white shadow-md ring-1 ring-black/5">
                    <Image
                      src={a.avatar}
                      alt={`${a.spiritName} ${a.animalName}`}
                      width={350}
                      height={561}
                      className="h-[100px] w-[68px] object-cover object-top"
                    />
                  </div>
                  <span className="mt-1.5 text-[11px] font-semibold text-slate-600">
                    {a.animalEmoji} {a.spiritName}
                  </span>
                </div>
              );
            })}
          </div>

          <Link
            href="/test"
            className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition active:scale-[0.98]"
          >
            立即免费测试
            <span className="transition group-hover:translate-x-0.5">→</span>
          </Link>

          <div className="mt-3.5 flex items-center gap-2 text-xs text-slate-500">
            <span className="flex -space-x-1.5">
              {["🐰", "🦊", "🦌", "🐱"].map((e) => (
                <span
                  key={e}
                  className="flex h-6 w-6 items-center justify-center rounded-full border border-white bg-white text-xs shadow-sm"
                >
                  {e}
                </span>
              ))}
            </span>
            已有 12,000+ 人测出自己的守护灵
          </div>
        </section>

        {/* ====================== ARCHETYPE GRID ====================== */}
        <section className="mt-14">
          <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-slate-400">
            你会是哪一只？
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {SPIRITS.map((id, i) => {
              const a = ARCHETYPES[id];
              return (
                <div
                  key={id}
                  className="animate-fade-up flex items-center gap-3 rounded-2xl border border-white/70 bg-white/80 p-2.5 shadow-sm ring-1 ring-black/5 backdrop-blur"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <Image
                    src={a.avatar}
                    alt={`${a.spiritName} ${a.animalName}`}
                    width={350}
                    height={561}
                    className="h-16 w-12 flex-none rounded-xl object-cover object-top shadow-sm"
                  />
                  <div className="min-w-0 leading-tight">
                    <div className="truncate text-sm font-bold text-ink">
                      {a.animalEmoji} {a.spiritName}
                    </div>
                    <div className="mt-1 text-[11px] leading-snug text-slate-500">
                      「{a.identity}」
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===================== WHAT YOU GET ===================== */}
        <section className="mt-14">
          <h2 className="mb-5 text-center text-lg font-bold text-ink">测完你会得到</h2>
          <ul className="space-y-2.5">
            {[
              "你的爱情守护灵",
              "你的恋爱优势",
              "你的关系盲点",
              "最适合你的另一半类型",
              "专属 IG 分享卡",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/80 px-5 py-3.5 text-sm font-medium text-ink shadow-sm backdrop-blur"
              >
                <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-600 text-xs font-bold text-white">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* ===================== SHARE PREVIEW ===================== */}
        <section className="mt-14">
          <h2 className="mb-1 text-center text-lg font-bold text-ink">分享卡长这样</h2>
          <p className="mb-5 text-center text-xs text-slate-400">
            一键生成，直接发 Instagram 限时动态
          </p>
          <SharePreview />
        </section>

        {/* ===================== FINAL CTA ===================== */}
        <section className="mt-14 rounded-3xl bg-gradient-to-br from-fuchsia-600 via-purple-600 to-indigo-700 p-7 text-center text-white shadow-xl shadow-indigo-500/20">
          <h2 className="text-balance text-xl font-bold leading-snug">
            已经有 12,000+ 人
            <br />
            测出自己的爱情守护灵
          </h2>
          <Link
            href="/test"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-indigo-700 shadow-lg transition active:scale-[0.98]"
          >
            立即免费测试 →
          </Link>
          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-white/80">
            <span>无需注册</span>
            <span className="opacity-40">·</span>
            <span>3 分钟完成</span>
            <span className="opacity-40">·</span>
            <span>支持分享 IG Story</span>
          </div>
        </section>

        {/* ===================== XINYU BRANDING ===================== */}
        <section className="mt-10 rounded-3xl border border-white/70 bg-white/80 p-6 text-center shadow-sm backdrop-blur">
          <Image
            src="/logo-icon.png"
            alt={SITE.xinyuName}
            width={48}
            height={48}
            className="mx-auto h-12 w-12 rounded-2xl ring-1 ring-black/5"
          />
          <div className="mt-2 text-base font-bold text-ink">{SITE.xinyuName}</div>
          <p className="mx-auto mt-3 max-w-xs text-balance text-sm leading-relaxed text-slate-600">
            想更深入了解你们的沟通模式、情绪需求与关系循环？
          </p>
          <XinyuButton className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition active:scale-[0.98]">
            开始体验心语 →
          </XinyuButton>
        </section>

        <footer className="mt-10 text-center text-[11px] text-slate-400">
          由 {SITE.xinyuName} 出品 · 仅供娱乐与自我探索
        </footer>
      </div>
    </main>
  );
}

/** Faux Instagram-Story share card preview (independent cat example). */
function SharePreview() {
  const a = ARCHETYPES.independent;
  const ideal = ARCHETYPES[a.idealMatch];
  const t = a.theme;
  return (
    <div className="mx-auto w-[230px]">
      {/* phone frame */}
      <div className="rounded-[2rem] border-[6px] border-ink/90 bg-ink p-1 shadow-2xl">
        <div
          className="relative overflow-hidden rounded-[1.6rem]"
          style={{
            aspectRatio: "9 / 16",
            background: `linear-gradient(160deg, ${t.from} 0%, ${t.via} 55%, ${t.to} 100%)`,
            color: t.text,
          }}
        >
          {/* story top bar */}
          <div className="absolute inset-x-0 top-0 z-10 px-3 pt-2.5">
            <div className="h-[3px] w-full rounded-full bg-white/40">
              <div className="h-full w-1/3 rounded-full bg-white" />
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/25 text-[9px]">
                💞
              </span>
              <span className="text-[9px] font-medium opacity-90">恋爱原型测试</span>
            </div>
          </div>

          {/* content */}
          <div className="flex h-full flex-col items-center justify-center px-4 pt-8 text-center">
            <div className="text-[9px] font-semibold uppercase tracking-[0.2em] opacity-80">
              {a.animalEmoji} {a.animalName}
            </div>
            <div className="mt-1.5 overflow-hidden rounded-xl border-2 border-white/50 shadow-lg">
              <Image
                src={a.avatar}
                alt={a.spiritName}
                width={350}
                height={561}
                className="h-[120px] w-[76px] object-cover object-top"
              />
            </div>
            <div className="mt-2.5 text-xl font-extrabold">{a.spiritName}</div>
            <p className="mt-1.5 text-[11px] font-medium leading-snug opacity-95">
              爱你，
              <br />
              但也需要自己的空间。
            </p>

            <div className="mt-3 flex items-center gap-2">
              <div className="rounded-lg bg-white/20 px-2.5 py-1.5 backdrop-blur">
                <div className="text-[8px] opacity-80">关系危险指数</div>
                <div className="text-sm font-extrabold leading-tight">72%</div>
              </div>
              <div className="rounded-lg bg-white/20 px-2.5 py-1.5 backdrop-blur">
                <div className="text-[8px] opacity-80">最适合</div>
                <div className="text-[11px] font-bold leading-tight">
                  {ideal.animalEmoji} {ideal.spiritName}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
