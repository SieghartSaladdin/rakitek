"use client";

import { OrchardJarMarqueeHero } from "./component";
import { DEFAULT_ARCH_SVG, DEFAULT_BADGE_SVG, jarSvg, labelSvg } from "./default-art";

export default function OrchardJarMarqueeHeroPreview() {
  return (
    <OrchardJarMarqueeHero
      id="jar-hero"
      title="Solara Orchard: Artisan marmalades, spreads and preserves"
      subtitle="Scroll to discover"
      cta={null}
      shapeImage={DEFAULT_ARCH_SVG}
      badgeImage={DEFAULT_BADGE_SVG}
      items={[
        { id: "orange-0", href: "#orange", alt: "Blood Orange Marmalade", jarSrc: jarSvg("darkorange"), labelSrc: labelSvg("BLOOD ORANGE", "Marmalade", "orangered", "sienna") },
        { id: "caponata-1", href: "#caponata", alt: "Orchard Caponata", jarSrc: jarSvg("maroon"), labelSrc: labelSvg("ORCHARD", "Relish", "plum", "indigo") },
        { id: "pesto-2", href: "#pesto", alt: "Sun-Dried Tomato Pesto", jarSrc: jarSvg("firebrick"), labelSrc: labelSvg("RED PESTO", "Herb Blend", "bisque", "crimson") },
        { id: "pistachio-3", href: "#pistachio", alt: "Roasted Pistachio Spread", jarSrc: jarSvg("olivedrab"), labelSrc: labelSvg("PISTACHIO", "Velvet Cream", "darkseagreen", "darkolivegreen") },
        { id: "fig-4", href: "#fig", alt: "Wild Fig Jam", jarSrc: jarSvg("saddlebrown"), labelSrc: labelSvg("WILD FIG", "Harvest Jam", "tan", "saddlebrown") },
        { id: "mandarin-5", href: "#mandarin", alt: "Tangerine Preserve", jarSrc: jarSvg("chocolate"), labelSrc: labelSvg("TANGERINE", "Citrus Peel", "orange", "chocolate") },
        { id: "mulberry-6", href: "#mulberry", alt: "Black Mulberry Jam", jarSrc: jarSvg("darkslateblue"), labelSrc: labelSvg("MULBERRY", "Orchard Jam", "thistle", "darkslateblue") },
        { id: "almond-7", href: "#almond", alt: "Toasted Almond Cream", jarSrc: jarSvg("goldenrod"), labelSrc: labelSvg("ALMOND", "Stone Ground", "wheat", "peru") },
      ]}
      ariaLabel="Featured jar showcase"
    />
  );
}
