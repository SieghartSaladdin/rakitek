"use client";

import { VoyagePackageCard } from "./component";

export default function VoyagePackageCardPreview() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px max(10px, calc(100vw * 25 / 1440))",
        background: "var(--rk-surface)",
      }}
    >
      <style>{`
        .rk-pkg-preview-box {
          width: 438.3px;
          max-width: 100%;
        }
        @media (max-width: 1024px) {
          .rk-pkg-preview-box {
            width: 485.3px;
          }
        }
      `}</style>
      <div className="rk-pkg-preview-box">
        <VoyagePackageCard
          title="Ancient Kyoto & Coastal Japan Tours"
          imageSrc="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&q=75&auto=format&fit=crop"
          imageAlt="Traditional wooden street and pagoda silhouette at dusk"
          featuredBadge="Expert Led"
          typeTags={["Group Expedition", "Cruise"]}
          specs={["16 days", "14 nights", "38 meals"]}
          price={4899}
          pricePrefix="Starting from:"
          onClick={(e) => e.preventDefault()}
        />
      </div>
    </div>
  );
}
