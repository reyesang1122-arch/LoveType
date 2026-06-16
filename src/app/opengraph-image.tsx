import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "恋爱原型测试 · Love Archetype Test";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #c471ed 0%, #7b54d4 50%, #4a4ed6 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 120 }}>💞</div>
        <div style={{ fontSize: 84, fontWeight: 800, marginTop: 10 }}>恋爱原型测试</div>
        <div style={{ fontSize: 40, opacity: 0.9, marginTop: 16, letterSpacing: 6 }}>
          LOVE ARCHETYPE TEST
        </div>
        <div style={{ fontSize: 34, opacity: 0.85, marginTop: 30 }}>
          20 道题 · 找出你在爱情里的样子
        </div>
      </div>
    ),
    { ...size }
  );
}
