"use client";

import { OrchardProductMetaBand } from "./component";

export default function OrchardProductMetaBandPreview() {
  return (
    <OrchardProductMetaBand
      id="details"
      tips={{
        label: "Useful tips",
        value: "Delicious for filling croissants, tarts or crepes. Keep away from heat sources and direct sunlight. After opening, store in the refrigerator and consume within 3-4 days.",
      }}
      weights={{ label: "Available weights", items: ["30g", "190g", "1kg", "3kg"] }}
      conservation={{ label: "Shelf life", value: "18 months" }}
      ariaLabel="Product details"
    />
  );
}
