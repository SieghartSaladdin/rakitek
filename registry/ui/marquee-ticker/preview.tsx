"use client";

import { MarqueeTicker } from "./component";

export default function MarqueeTickerPreview() {
  return (
    <div
      className="w-full rounded-[10px] px-5 py-10 lg:relative lg:left-1/2 lg:w-[calc(65vw_+_71px)] lg:-translate-x-1/2 lg:px-12 lg:py-14"
      style={{
        backgroundColor: "var(--rk-fg)",
        backgroundImage:
          "radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--rk-bg) 12%, transparent), transparent 60%), linear-gradient(135deg, color-mix(in srgb, var(--rk-fg) 92%, var(--rk-bg)), var(--rk-fg))",
        color: "var(--rk-bg)",
      }}
    >
      <div className="w-full">
        <MarqueeTicker
          items={["new", "Fresh off the tree", "New"]}
          mode="arrows"
          inverted
        />
      </div>
    </div>
  );
}
