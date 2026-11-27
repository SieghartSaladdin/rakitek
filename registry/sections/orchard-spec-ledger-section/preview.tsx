"use client";

import { OrchardSpecLedgerSection } from "./component";

export default function OrchardSpecLedgerSectionPreview() {
  return (
    <OrchardSpecLedgerSection
      id="monopack"
      title="Mono Pack"
      description={[
        "We know that breakfast is one of the most memorable moments of a guest’s stay. That is why we have captured the bright freshness of our harvests in an elegant and refined single-serve glass format. An artisanal pantry line dedicated to high-end hospitality, where slow-cooked citrus jams and marmalades meet the daily practicality required by fine table service, bringing morning sunshine directly to every guest’s plate with hygiene and unforgettable flavour from the very first taste.",
      ]}
      coverImage="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1400&q=80&auto=format&fit=crop"
      coverAlt="Single-serve hospitality orchard assortment"
      columns={[
        { key: "product", label: "Product", align: "start" },
        { key: "shelfLife", label: "Shelf life", align: "start" },
        { key: "weight", label: "Weight", align: "end" },
      ]}
      rows={[
        { product: "Orange Marmalade", shelfLife: "36 months", weight: "30g" },
        { product: "Mandarin Marmalade", shelfLife: "36 months", weight: "30g" },
        { product: "Extra Strawberry Jam", shelfLife: "36 months", weight: "30g" },
        { product: "Extra Cherry Jam", shelfLife: "36 months", weight: "30g" },
        { product: "Extra Apricot Jam", shelfLife: "36 months", weight: "30g" },
        { product: "Extra Fig Jam", shelfLife: "36 months", weight: "30g" },
        { product: "Blossom Honey", shelfLife: "36 months", weight: "30g" },
        { product: "Pistachio Spread", shelfLife: "18 months", weight: "30g" },
        { product: "Almond Spread", shelfLife: "18 months", weight: "30g" },
        { product: "Hazelnut Spread", shelfLife: "18 months", weight: "30g" },
      ]}
      showCover={true}
      ariaLabel="Mono Pack Specifications"
    />
  );
}
