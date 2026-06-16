"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { SITE } from "@/lib/site";

const SLOGANS = [
  "理解彼此，比赢更重要",
  "你真的知道另一半在想什么吗？",
  "爱不是猜测，是理解",
  "由心语 AI 情侣辅导师出品",
];

const SIZE = 48; // default size (px)
const MARGIN = 14; // min gap from viewport edges
const STORAGE_KEY = "lovetype_xinyu_widget_pos";

interface Pos {
  x: number;
  y: number;
}

function clamp(p: Pos, vw: number, vh: number): Pos {
  return {
    x: Math.min(Math.max(p.x, MARGIN), Math.max(MARGIN, vw - SIZE - MARGIN)),
    y: Math.min(Math.max(p.y, MARGIN), Math.max(MARGIN, vh - SIZE - MARGIN)),
  };
}

export default function XinyuWidget() {
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<Pos>({ x: 0, y: 0 });
  const [expanded, setExpanded] = useState(false);
  const [slogan, setSlogan] = useState(0);
  const drag = useRef({ active: false, moved: false, sx: 0, sy: 0, ox: 0, oy: 0 });

  // initial position (restore from localStorage or bottom-right default)
  useEffect(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let p: Pos = { x: vw - SIZE - MARGIN, y: vh - SIZE - 120 };
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const s = JSON.parse(saved) as Pos;
        if (typeof s?.x === "number" && typeof s?.y === "number") p = s;
      }
    } catch {
      /* ignore */
    }
    setPos(clamp(p, vw, vh));
    setMounted(true);
  }, []);

  // rotate slogan every 15s
  useEffect(() => {
    const id = window.setInterval(() => setSlogan((i) => (i + 1) % SLOGANS.length), 15000);
    return () => window.clearInterval(id);
  }, []);

  // keep inside viewport on resize
  useEffect(() => {
    if (!mounted) return;
    const onResize = () => setPos((p) => clamp(p, window.innerWidth, window.innerHeight));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mounted]);

  function onPointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    const d = drag.current;
    d.active = true;
    d.moved = false;
    d.sx = e.clientX;
    d.sy = e.clientY;
    d.ox = pos.x;
    d.oy = pos.y;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      d.moved = true;
      setExpanded(false);
    }
    setPos(clamp({ x: d.ox + dx, y: d.oy + dy }, window.innerWidth, window.innerHeight));
  }

  function onPointerUp() {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    if (!d.moved) {
      setExpanded((v) => !v);
      return;
    }
    // snap to the nearest horizontal edge (AssistiveTouch style) and persist
    setPos((p) => {
      const vw = window.innerWidth;
      const snapped: Pos = {
        x: p.x + SIZE / 2 < vw / 2 ? MARGIN : vw - SIZE - MARGIN,
        y: p.y,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(snapped));
      } catch {
        /* ignore */
      }
      return snapped;
    });
  }

  function go() {
    void track("xinyu_clicked", { metadata: { source: "widget" } });
    window.open(SITE.xinyuUrl, "_blank", "noopener,noreferrer");
  }

  if (!mounted) return null;

  const onRight = pos.x + SIZE / 2 > window.innerWidth / 2;
  const openDown = pos.y < 240;

  const panelStyle: React.CSSProperties = {
    transformOrigin: `${onRight ? "right" : "left"} ${openDown ? "top" : "bottom"}`,
    ...(onRight ? { right: 0 } : { left: 0 }),
    ...(openDown ? { top: SIZE + 12 } : { bottom: SIZE + 12 }),
  };

  return (
    <>
      {/* click-away backdrop */}
      {expanded && (
        <div className="fixed inset-0 z-[55]" onClick={() => setExpanded(false)} aria-hidden />
      )}

      <div
        style={{
          position: "fixed",
          left: pos.x,
          top: pos.y,
          width: SIZE,
          height: SIZE,
          zIndex: 60,
          touchAction: "none",
        }}
      >
        {/* expanded panel */}
        <div
          className={`absolute w-56 rounded-2xl bg-white p-4 shadow-[0_12px_40px_rgba(20,16,50,0.25)] ring-1 ring-black/5 transition-all duration-200 ease-out ${
            expanded ? "scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0"
          }`}
          style={panelStyle}
        >
          <button
            onClick={() => setExpanded(false)}
            aria-label="关闭"
            className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-slate-300 transition hover:text-slate-500"
          >
            ✕
          </button>

          <div className="flex items-center gap-2.5">
            <Image
              src="/logo-icon.png"
              alt={SITE.xinyuName}
              width={36}
              height={36}
              className="h-9 w-9 rounded-xl ring-1 ring-black/5"
            />
            <div className="text-sm font-bold leading-tight text-ink">
              {SITE.xinyuName}
            </div>
          </div>

          <p
            key={slogan}
            className="mt-3 animate-fade-up text-[13px] leading-relaxed text-slate-600"
          >
            「{SLOGANS[slogan]}」
          </p>

          <button
            onClick={go}
            className="mt-3.5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition active:scale-[0.97]"
          >
            体验心语 <span>→</span>
          </button>
        </div>

        {/* floating bubble */}
        <button
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          aria-label="心语 AI 情侣辅导师"
          className="relative flex h-12 w-12 cursor-grab touch-none items-center justify-center rounded-full bg-white shadow-[0_4px_22px_rgba(20,16,50,0.22)] ring-1 ring-black/5 transition active:scale-95 active:cursor-grabbing"
          style={{ opacity: expanded ? 1 : 0.94 }}
        >
          {/* soft attention glow */}
          <span className="pointer-events-none absolute inset-0 rounded-full bg-indigo-500/10 blur-[6px]" />
          <Image
            src="/logo-icon.png"
            alt={SITE.xinyuName}
            width={44}
            height={44}
            priority
            className="relative h-10 w-10 rounded-full"
          />
        </button>
      </div>
    </>
  );
}
