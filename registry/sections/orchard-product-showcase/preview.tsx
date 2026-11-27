"use client";

import { OrchardProductShowcase } from "./component";

const JAR_ART = (title: string, hue: string) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='367' height='481' viewBox='0 0 367 481'><rect x='110' y='92' width='147' height='36' rx='8' fill='peru'/><path d='M92 142c0-16 14-26 32-26h119c18 0 32 10 32 26v236c0 24-18 42-42 42H134c-24 0-42-18-42-42V142Z' fill='${hue}'/><rect x='98' y='210' width='171' height='126' fill='seashell'/><text x='183' y='265' text-anchor='middle' font-family='Georgia,serif' font-size='20' fill='maroon'>SOLARA</text><text x='183' y='296' text-anchor='middle' font-family='Arial,sans-serif' font-size='11' letter-spacing='2' fill='orangered'>${title}</text></svg>`,
  );

export default function OrchardProductShowcasePreview() {
  return (
    <OrchardProductShowcase
      id="marmalades"
      title="Marmelade & Jams"
      coverImage="https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=1400&q=80&auto=format&fit=crop"
      coverAlt="Picnic spread with orchard preserves"
      description={[
        "Artisanal citrus marmalades and jams prepared the traditional way: whole fruit pulp, peel, and cane sugar slowly cook together to preserve natural colour and aroma, with a balanced modern touch. Enjoy them at breakfast on warm sourdough, or alongside aged cheeses.",
      ]}
      weightsLabel="Available weights"
      weights={["240g", "1.2kg"]}
      showWeights={true}
      asideFirst={false}
      mediaLayout="cover"
      showSlider={true}
      slides={[
        {
          id: "blood-orange",
          title: "Blood Orange Marmalade",
          imageSrc: JAR_ART("BLOOD ORANGE", "darkorange"),
          hoverBg: "var(--rk-surface)",
          href: "#blood-orange",
        },
        {
          id: "fig-harvest",
          title: "Sun-Dried Fig Jam",
          imageSrc: JAR_ART("ORCHARD FIG", "saddlebrown"),
          hoverBg: "var(--rk-surface)",
          href: "#fig-harvest",
        },
        {
          id: "pear-ginger",
          title: "Spiced Pear Preserve",
          imageSrc: JAR_ART("SPICED PEAR", "goldenrod"),
          hoverBg: "var(--rk-surface)",
          href: "#pear-ginger",
        },
        {
          id: "berry-noir",
          title: "Wild Mulberry Jam",
          imageSrc: JAR_ART("MULBERRY", "indigo"),
          hoverBg: "var(--rk-surface)",
          href: "#berry-noir",
        },
      ]}
      ariaLabel="Marmalades and Jams Showcase"
    />
  );
}
