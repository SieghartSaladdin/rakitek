import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@/components/AppShell";
import { getAllStyles } from "@/lib/catalog";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rakitek: Multi-Style UI/UX System",
  description:
    "Curated multi-style UI components, website styling presets, and sections extracted from real Awwwards-level websites.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const fontUrls = Array.from(new Set(getAllStyles().map((s) => s.fonts.googleFontsUrl)));

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {fontUrls.map((url) => (
          <link key={url} rel="stylesheet" href={url} />
        ))}
      </head>
      <body className="min-h-screen antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
