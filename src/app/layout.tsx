import type { Metadata, Viewport } from "next";
import { SITE } from "@/lib/site";
import XinyuWidget from "@/components/XinyuWidget";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.nameZh} · Love Archetype Test`,
    template: `%s · ${SITE.nameZh}`,
  },
  description: SITE.description,
  keywords: [
    "恋爱原型测试",
    "爱情人格测试",
    "情侣测试",
    "MBTI 恋爱",
    "16personalities",
    "心语",
    "relationship personality test",
    "love archetype",
  ],
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  icons: {
    icon: "/lovetype-logo.png",
    shortcut: "/lovetype-logo.png",
    apple: "/lovetype-logo.png",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: SITE.url,
    siteName: SITE.nameZh,
    title: `${SITE.nameZh} · 测出你的爱情守护灵`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.nameZh} · 测出你的爱情守护灵`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1b1633",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen antialiased">
        {children}
        <XinyuWidget />
      </body>
    </html>
  );
}
