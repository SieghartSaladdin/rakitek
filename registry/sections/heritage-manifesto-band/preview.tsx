"use client";

import { HeritageManifestoBand } from "./component";

export default function HeritageManifestoBandPreview() {
  return (
    <div style={{ paddingBlock: "24px", background: "var(--rk-surface)" }}>
      <HeritageManifestoBand
        surtext="Since 1970"
        statement="Meridian Voyages is far more than an ordinary tour operator, standing proudly as an enduring pioneer of curated journeys built on 56 years of craft."
      />
    </div>
  );
}
