import Image from "next/image";
import { SITE } from "@/lib/site";
import XinyuButton from "@/components/XinyuButton";

export default function ConversionCTA({ archetype }: { archetype?: string }) {
  return (
    <section className="mt-10 overflow-hidden rounded-3xl bg-gradient-to-br from-fuchsia-600 via-purple-600 to-indigo-700 p-7 text-white shadow-xl shadow-indigo-500/20">
      <Image
        src="/logo-icon.png"
        alt={SITE.xinyuName}
        width={44}
        height={44}
        className="h-11 w-11 rounded-xl bg-white p-1 shadow-md ring-1 ring-black/5"
      />
      <div className="mt-3 text-sm font-bold tracking-wide text-white/90">
        {SITE.xinyuName}
      </div>
      <h2 className="mt-3 text-balance text-xl font-bold leading-snug">
        想更深入了解你们的沟通模式、情绪需求与关系循环？
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-white/85">
        爱情守护灵只是开始。{SITE.xinyuName}
        能陪你和另一半，看清你们之间真实的相处模式，找到更靠近彼此的方式。
      </p>
      <XinyuButton
        archetype={archetype}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-base font-bold text-indigo-700 shadow-lg transition active:scale-[0.98]"
      >
        开始体验心语
        <span>→</span>
      </XinyuButton>
    </section>
  );
}
