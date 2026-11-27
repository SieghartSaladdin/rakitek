"use client";

import { OrchardProductionLedger } from "./component";

export default function OrchardProductionLedgerPreview() {
  return (
    <OrchardProductionLedger
      id="citrus"
      title="Citrus Fruits"
      singleLineTitle={true}
      description={[
        "Fragrant and juicy, our citrus fruits are the heart of this orchard farm.\n\nWe cultivate: blonde oranges, red oranges of the Garnet variety and lemons of the Meyer Sweet variety. Each fruit has its own season, its own character and its own story. We care for our trees with respect and harvest only when the fruit is ready, honouring the rhythms of nature and the traditions of those who came before us and the growers who still tend them.\nOnly time and care.",
      ]}
      subtitle="Crates / Box of 10kg"
      columns={[
        { key: "product", label: "Product" },
        { key: "availability", label: "Availability" },
      ]}
      rows={[
        { product: "Navel Oranges for Fresh Consumption", availability: "November 20 to January 15" },
        { product: "Navel Oranges for Juicing", availability: "November 20 to January 15" },
        { product: "Blood Oranges for Fresh Consumption", availability: "January 15 to February 28" },
        { product: "Blood Oranges for Juicing", availability: "January 15 to February 28" },
        { product: "Sweet Lemons for Fresh Consumption", availability: "November 15 to April 15" },
        { product: "Late Mandarins for Fresh Consumption", availability: "January 15 to February 28" },
        { product: "Pomegranate, sweet and tart varieties", availability: "October 01 to November 30" },
      ]}
    />
  );
}
