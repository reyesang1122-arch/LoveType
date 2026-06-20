import { forwardRef } from "react";
import type { Archetype } from "@/data/archetypes";
import { SITE } from "@/lib/site";

interface ShareCardProps {
  archetype: Archetype;
  secondary: Archetype;
  score: number;
  /** Inline QR (data URL) that viewers can scan to open the site. */
  qrDataUrl?: string;
}

/**
 * Instagram Story sized (1080 x 1920) share card.
 * Rendered off-screen and captured to PNG via html-to-image.
 * Uses inline styles + absolute px so the export is pixel-accurate.
 */
const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(function ShareCard(
  { archetype, secondary, score, qrDataUrl },
  ref
) {
  const t = archetype.theme;
  return (
    <div
      ref={ref}
      style={{
        width: 1080,
        height: 1920,
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(160deg, ${t.from} 0%, ${t.via} 50%, ${t.to} 100%)`,
        color: t.text,
        fontFamily:
          'ui-sans-serif, system-ui, "PingFang SC", "Microsoft YaHei", sans-serif',
        display: "flex",
        flexDirection: "column",
        padding: "120px 90px",
        boxSizing: "border-box",
      }}
    >
      {/* decorative blobs */}
      <div
        style={{
          position: "absolute",
          top: -200,
          right: -160,
          width: 620,
          height: 620,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.16)",
          filter: "blur(10px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -240,
          left: -200,
          width: 640,
          height: 640,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.10)",
          filter: "blur(8px)",
        }}
      />

      {/* header */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <div
          style={{
            fontSize: 30,
            letterSpacing: 8,
            textTransform: "uppercase",
            opacity: 0.85,
            fontWeight: 600,
          }}
        >
          My Love Spirit
        </div>
        <div style={{ fontSize: 26, marginTop: 10, opacity: 0.75 }}>
          我的爱情守护灵
        </div>
      </div>

      {/* main */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={archetype.avatar}
          alt={archetype.spiritName}
          width={520}
          height={833}
          style={{
            width: 520,
            height: 833,
            borderRadius: 40,
            boxShadow: "0 30px 90px rgba(0,0,0,0.35)",
            border: "6px solid rgba(255,255,255,0.5)",
          }}
        />

        <div
          style={{
            marginTop: 56,
            maxWidth: 820,
            fontSize: 44,
            lineHeight: 1.5,
            fontWeight: 600,
            opacity: 0.98,
          }}
        >
          「{archetype.tagline}」
        </div>

        {/* score + secondary chips */}
        <div style={{ display: "flex", gap: 24, marginTop: 70 }}>
          <div
            style={{
              background: "rgba(255,255,255,0.18)",
              borderRadius: 28,
              padding: "26px 44px",
            }}
          >
            <div style={{ fontSize: 28, opacity: 0.8 }}>匹配度</div>
            <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.1 }}>
              {score}%
            </div>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.18)",
              borderRadius: 28,
              padding: "26px 44px",
            }}
          >
            <div style={{ fontSize: 28, opacity: 0.8 }}>潜在面</div>
            <div
              style={{
                fontSize: 56,
                fontWeight: 800,
                lineHeight: 1.4,
                whiteSpace: "nowrap",
              }}
            >
              {secondary.animalEmoji} {secondary.spiritName}
            </div>
          </div>
        </div>
      </div>

      {/* footer — scannable QR + link so viewers can actually come take the test */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
        }}
      >
        {qrDataUrl && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: 28,
              padding: 18,
              boxShadow: "0 16px 50px rgba(0,0,0,0.28)",
              flexShrink: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl}
              alt="QR"
              width={180}
              height={180}
              style={{ width: 180, height: 180, display: "block" }}
            />
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
          <div style={{ fontSize: 36, fontWeight: 700, opacity: 0.95, lineHeight: 1.3 }}>
            {qrDataUrl ? "📷 扫码 / 点链接" : "👉 测出你的爱情守护灵"}
          </div>
          <div style={{ fontSize: 30, fontWeight: 600, opacity: 0.95 }}>
            👉 测出你的爱情守护灵
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.92)",
              color: "#1b1633",
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: 1,
              padding: "16px 34px",
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span>💞</span>
            <span>{SITE.url.replace(/^https?:\/\//, "")}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ShareCard;
