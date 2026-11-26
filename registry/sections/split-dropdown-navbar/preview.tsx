"use client";

import { SplitDropdownNavbar } from "./component";

export default function SplitDropdownNavbarPreview() {
  return (
    <div style={{ minHeight: "340px", position: "relative", background: "var(--rk-bg)" }}>
      <SplitDropdownNavbar
        brandName="Meridian"
        dropdownTitle="Destinations"
        primaryLinks={[
          { label: "Featured", href: "#featured" },
          { label: "Brochures", href: "#brochures" },
          { label: "Stories", href: "#stories" },
        ]}
        ctaLabel="Travel agent space"
        hideOnScroll={false}
        onNavigate={(_href, e) => e.preventDefault()}
        onOpenSearch={() => {}}
      />
    </div>
  );
}
